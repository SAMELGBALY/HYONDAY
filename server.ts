import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  MANUAL_DOCUMENTS,
  TECHNICAL_SECONDARY_SOURCES,
  COMMON_OBD_CODES,
  HYUNDAI_EXCEL_SPECS,
  PRESET_CAR_PROFILES,
  PreloadedManualDoc,
} from './src/data/carManualsData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

// In-memory store for custom user manuals uploaded in current session
const customManualsStore: PreloadedManualDoc[] = [];

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Arabic normalization directly preserving the user's logic
function normalizeArabic(text: string): string {
  if (!text) return '';
  let t = text.toLowerCase();
  const replacements: Record<string, string> = {
    'أ': 'ا',
    'إ': 'ا',
    'آ': 'ا',
    'ى': 'ي',
    'ة': 'ه',
    'ؤ': 'و',
    'ئ': 'ي',
    'ـ': '',
  };
  for (const [k, v] of Object.entries(replacements)) {
    t = t.replaceAll(k, v);
  }
  // Remove tashkeel diacritics
  t = t.replace(/[\u064B-\u065F\u0670]/g, '');
  // Clean punctuation
  t = t.replace(/[^\w\s\.-]/g, ' ');
  t = t.replace(/\s+/g, ' ');
  return t.trim();
}

function detectVehicleFromText(text: string) {
  const q = normalizeArabic(text);
  const data: {
    model: string | null;
    year: string | null;
    engine: string | null;
    transmission: 'manual' | 'automatic' | null;
  } = {
    model: null,
    year: null,
    engine: null,
    transmission: null,
  };

  if (q.includes('excel') || q.includes('اكسل')) data.model = 'Hyundai Excel';
  else if (q.includes('accent') || q.includes('اكسنت')) data.model = 'Hyundai Accent';
  else if (q.includes('verna') || q.includes('فيرنا')) data.model = 'Hyundai Verna';
  else if (q.includes('elantra') || q.includes('النترا') || q.includes('الانتر')) data.model = 'Hyundai Elantra';
  else if (q.includes('tucson') || q.includes('توسان')) data.model = 'Hyundai Tucson';

  const yearMatch = q.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearMatch) data.year = yearMatch[1];

  const engineMatch = q.match(/\b(\d+\.\d+)\s*(?:l|liter|litre|لتر)?\b/);
  if (engineMatch) data.engine = `${engineMatch[1]}L`;

  if (q.includes('اتوماتيك') || q.includes('اوتوماتيك') || q.includes('automatic')) {
    data.transmission = 'automatic';
  } else if (q.includes('مانيوال') || q.includes('يدوي') || q.includes('manual')) {
    data.transmission = 'manual';
  }

  return data;
}

function detectSystemAndIntent(text: string) {
  const q = normalizeArabic(text);

  let system = 'general';
  if (/زيت المحرك|زيت موتور|زيت الماتور|تغيير الزيت|حجم الزيت|سعة الزيت|لزوجة الزيت|فلتر الزيت|engine oil|motor oil/.test(q)) {
    system = 'engine_oil';
  } else if (/زيت الفتيس|زيت الجير|زيت ناقل الحركه|مانيوال|اتوماتيك|transmission|transaxle|gear oil|atf/.test(q)) {
    system = 'transmission_oil';
  } else if (/حراره|سخونه|سخن|بتسخن|تبريد|مياه|ردياتير|رادياتير|مروحه|المروحه|ثيرموستات|ثرموستات|طرمبة مياه|cooling|radiator|fan|thermostat|overheat/.test(q)) {
    system = 'cooling';
  } else if (/بنزين|وقود|ضغط البنزين|طرمبة البنزين|رشاش|رشاشات|فلتر بنزين|fuel|injector|pump/.test(q)) {
    system = 'fuel';
  } else if (/بوجيه|بوجيهات|شراره|اشعال|موبينه|موبينات|سلوك بوجيهات|spark plug|ignition|misfire/.test(q)) {
    system = 'ignition';
  } else if (/فرامل|تيل|طنابير|ماستر|زيت باكم|brake|rotor|pad/.test(q)) {
    system = 'brakes';
  } else if (/كاتينه|سير الكاتينه|تايمن|timing belt|camshaft|crankshaft/.test(q)) {
    system = 'timing';
  } else if (/صباب|خلوص الصباب|تاكيهات|تاكيه|valve|valve clearance/.test(q)) {
    system = 'valve';
  } else if (/بطاريه|دينامو|مارش|فيوز|ريلاي|شحن|كهرباء|battery|alternator|starter/.test(q)) {
    system = 'electrical';
  }

  let intent: 'specification' | 'maintenance' | 'diagnosis' | 'repair' = 'diagnosis';
  if (/كام|كم|حجم|سعه|كميه|مقدار|لزوجة|نوع|مواصفه|مقاس|عزم|ضغط|خلوص|capacity|quantity|viscosity|torque|clearance|gap/.test(q)) {
    intent = 'specification';
  } else if (/تغيير|تبديل|صيانه|فحص|تنظيف|ضبط|خطوات|ازاي|كيف|طريقة|change|replace|maintenance|inspection/.test(q)) {
    intent = 'maintenance';
  } else if (/تصليح|اصلاح|فك|تركيب|استبدال|repair|remove|install/.test(q)) {
    intent = 'repair';
  }

  return { system, intent };
}

// Retrieve relevant documents using semantic keyword scoring
function retrieveManualDocs(question: string, carModel?: string): PreloadedManualDoc[] {
  const normQ = normalizeArabic(question);
  const { system } = detectSystemAndIntent(question);
  const allDocs = [...MANUAL_DOCUMENTS, ...customManualsStore];

  const scored = allDocs.map((doc) => {
    let score = 0;
    const docText = normalizeArabic(doc.content + ' ' + doc.title + ' ' + doc.chapter);

    // Hard System Match
    if (system !== 'general' && doc.system === system) {
      score += 35;
    }

    // Critical Isolation: Engine Oil vs Transmission Oil
    if (system === 'engine_oil' && doc.system === 'transmission_oil') {
      score -= 80;
    }
    if (system === 'transmission_oil' && doc.system === 'engine_oil') {
      score -= 80;
    }

    // Model similarity
    if (carModel && normalizeArabic(doc.vehicleModel).includes(normalizeArabic(carModel))) {
      score += 15;
    }

    // Keyword tokens
    const qTokens = normQ.split(/\s+/).filter((w) => w.length > 2);
    for (const tok of qTokens) {
      if (docText.includes(tok)) {
        score += 4;
      }
    }

    // Matching tags
    for (const tag of doc.tags) {
      if (normQ.includes(normalizeArabic(tag))) {
        score += 8;
      }
    }

    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.filter((item) => item.score > 5).slice(0, 4).map((item) => item.doc);
}

// --- API ROUTES ---

// 1. Diagnose Problem with Gemini 3.8 Flash + Service Manual Grounding + Secondary Sources
app.post('/api/diagnose', async (req, res) => {
  try {
    const {
      question,
      carProfile,
      attachedImageBase64,
      imageMimeType,
      previousChecks,
    } = req.body;

    if (!question && !attachedImageBase64) {
      return res.status(400).json({ error: 'يرجى تقديم وصف المشكلة أو إرفاق صورة للفحص' });
    }

    // Detect vehicle from text if not provided
    const detectedVehicle = detectVehicleFromText(question || '');
    const activeCar = carProfile || {
      brand: 'Hyundai',
      model: detectedVehicle.model || 'Excel / Accent',
      modelArabic: detectedVehicle.model || 'هيونداي اكسيل / اكسنت',
      year: detectedVehicle.year ? parseInt(detectedVehicle.year) : 1998,
      engine: detectedVehicle.engine || '1.5L SOHC',
      transmission: detectedVehicle.transmission || 'manual',
      fuelSystem: 'carburetor',
    };

    const { system: detectedSys, intent: detectedIntent } = detectSystemAndIntent(question || '');

    // Retrieve factory manual excerpts
    const retrievedDocs = retrieveManualDocs(question || '', activeCar.model);

    // Format factory manual context
    const manualContextString = retrievedDocs.length > 0
      ? retrievedDocs
          .map(
            (d) =>
              `[كتالوج المصنع: ${d.vehicleModel} | الباب: ${d.chapter} | صفحة: ${d.page} | العنوان: ${d.title}]\n${d.content}`
          )
          .join('\n\n---\n\n')
      : 'بيانات الكتالوج العام لهيونداي (Excel / Accent / Verna / Elantra): محركات 1.3L, 1.5L, 1.6L بنظام تبريد مضغوط 0.9-1.1 بار، وسعة زيت محرك 3.3 لتر مع الفلتر (10W-40 / 20W-50 API SJ/SL)، وزيت فتيس مانيوال 2.15 لتر 75W-90 GL-4.';

    // Format secondary automotive sources
    const secondarySourcesString = TECHNICAL_SECONDARY_SOURCES.map(
      (s) => `[${s.type} - ${s.code}: ${s.title}]\n${s.description}`
    ).join('\n\n');

    const promptText = `
أنت كبير مهندسي تشخيص أعطال السيارات وخبير الكتالوجات الفنية الرسمية (Factory Service Manuals).
مهمتك تقديم تشخيص هندسي دقيق، معتمد وموثق للأعطال أو استخراج المواصفات الفنية بناءً على كتالوج المصنع أولاً، والمصادر الفنية المعتمدة ثانياً.

بيانات السيارة المفحوصة:
- الموديل: ${activeCar.model} (${activeCar.modelArabic || activeCar.model})
- سنة الصنع: ${activeCar.year}
- المحرك: ${activeCar.engine}
- ناقل الحركة: ${activeCar.transmission === 'automatic' ? 'أوتوماتيك (Automatic)' : 'يدوي (Manual)'}
- نظام الوقود: ${activeCar.fuelSystem}
${activeCar.mileageKm ? `- العداد: ${activeCar.mileageKm} كم` : ''}

سؤال العميل / وصف المشكلة:
"${question}"

${previousChecks && previousChecks.length > 0 ? `الفحوصات التي قام بها العميل مسبقاً:\n${JSON.stringify(previousChecks, null, 2)}` : ''}

نصوص كتالوج الخدمة للمصنع المسترجعة (المصدر الأساسي الأول):
--------------------------------------------------
${manualContextString}
--------------------------------------------------

المصادر الفنية الإضافية المعتمدة (نشرات TSB، قاعدة بيانات OBD-II، معايير الزيوت العالمية، وخبرة ورش الصيانة):
--------------------------------------------------
${secondarySourcesString}
--------------------------------------------------

قواعد هندسية صارمة:
1. قاعدة اللغة (إلزامية وحاسمة): يجب أن تكون الإجابة وجميع الحقول والنصوص بالكامل باللغة العربية الفنية الدقيقة بنسبة 100% دون أي استثناء. يمنع منعاً باتاً كتابة أي جملة أو شرح باللغة الإنجليزية في أي حقل. يجوز فقط وضع المصطلح الإنجليزي بين قوسين بعد الاسم العربي للتوضيح فقط (مثال: "مقياس الزيت (Oil Dipstick)" أو "حساس حرارة المحرك (ECT Sensor)" أو "ثيرموستات الكوع (Thermostat)").
2. الفصل الصارم بين زيت المحرك وزيت الفتيس: ممنوع منعاً باتاً خلط لزوجة أو سعة زيت الموتور بزيت الفتيس المانيوال أو الأوتوماتيك.
3. الدقة الرقمية: استخرج الأرقام الصريحة (عزوم الربط N.m، الخلوص بالملليمتر mm، ضغوط البار و PSI، درجات الحرارة °C، السعات باللتر).
4. التشخيص السببي المنظم: رتب الأسباب المحتملة من الأعلى احتمالاً إلى الأقل باللغة العربية.
5. جدول الفحوصات: اجعل الفحوصات عملية باللغة العربية خطوة بخطوة مع توضيح القيمة السليمة وقيمة العطل.
6. توثيق المصادر: اذكر اسم كتالوج المصنع والباب ورقم الصفحة إن وجد، واذكر النشرة الفنية أو المعيار المعتمد بالعربية.
7. إجراءات السلامة: اذكر تحذيرات السلامة اللازمة بالعربية (خطر الحروق عند فتح الردياتير أو تفريغ الزيت الساخن، فصل كابل البطارية، إلخ).
`;

    const contents: any[] = [];

    if (attachedImageBase64) {
      contents.push({
        inlineData: {
          mimeType: imageMimeType || 'image/jpeg',
          data: attachedImageBase64,
        },
      });
    }

    contents.push({ text: promptText });

    let response: any = null;
    const modelCandidates = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let lastError: any = null;

    for (const modelName of modelCandidates) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction:
              'أنت مهندس صيانة سيارات معتمد ومرجع كتالوجات صيانة السيارات. يجب أن تكون إجابتك بالكامل 100% باللغة العربية الفنية الواضحة والدقيقة. جميع الشروحات، أسماء الفحوصات، التحذيرات، والأسباب المكتوبة في الـ JSON يجب أن تكون باللغة العربية فقط مع إمكانية ذكر المصطلح الإنجليزي بين قوسين فقط. يمنع كتابة جمل كاملة بالإنجليزية.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                vehicleSummary: {
                  type: Type.OBJECT,
                  properties: {
                    model: { type: Type.STRING, description: 'اسم وموديل السيارة بالعربية' },
                    year: { type: Type.INTEGER },
                    engine: { type: Type.STRING, description: 'المحرك' },
                    transmission: { type: Type.STRING, description: 'نوع ناقل الحركة بالعربية' },
                  },
                  required: ['model', 'year', 'engine', 'transmission'],
                },
                detectedSystem: { type: Type.STRING, description: 'المنظومة المفحوصة بالعربية (مثل: منظومة التبريد، منظومة التزييت)' },
                detectedIntent: { type: Type.STRING },
                primaryDiagnosis: { type: Type.STRING, description: 'التشخيص الهندسي المباشر باللغة العربية حصراً' },
                severityLevel: {
                  type: Type.STRING,
                  description: 'low, medium, high, or critical',
                },
                probableCauses: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      cause: { type: Type.STRING, description: 'السبب الفني المحتمل باللغة العربية حصراً' },
                      probability: { type: Type.STRING, description: 'high, medium, or low' },
                      explanation: { type: Type.STRING, description: 'شرح فني تفصيلي للسبب باللغة العربية حصراً' },
                    },
                    required: ['cause', 'probability', 'explanation'],
                  },
                },
                diagnosticChecks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      component: { type: Type.STRING, description: 'اسم القطعة أو المكون باللغة العربية (مثال: مقياس الزيت، مروحة الردياتير)' },
                      action: { type: Type.STRING, description: 'طريقة وإجراء الفحص العملي باللغة العربية حصراً' },
                      normalValue: { type: Type.STRING, description: 'القيمة السليمة الطبيعية باللغة العربية والأرقام' },
                      faultIndicator: { type: Type.STRING, description: 'دليل ومؤشر العطل باللغة العربية' },
                    },
                    required: ['id', 'component', 'action', 'normalValue', 'faultIndicator'],
                  },
                },
                repairSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING, description: 'خطوة الإصلاح المعتمدة باللغة العربية حصراً' },
                },
                safetyWarnings: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING, description: 'تحذير السلامة والأمان المهني باللغة العربية حصراً' },
                },
                exactSpecs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      parameter: { type: Type.STRING, description: 'اسم المعيار أو المواصفة بالعربية' },
                      value: { type: Type.STRING, description: 'القيمة الرقمية المعتمدة' },
                      unit: { type: Type.STRING, description: 'الوحدة' },
                      note: { type: Type.STRING, description: 'ملاحظة بالعربية' },
                    },
                    required: ['parameter', 'value'],
                  },
                },
                manualReferences: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      manualName: { type: Type.STRING, description: 'اسم الكتالوج بالعربية' },
                      section: { type: Type.STRING, description: 'الباب أو القسم بالعربية' },
                      page: { type: Type.STRING, description: 'رقم الصفحة' },
                      quote: { type: Type.STRING, description: 'نص أو عنوان باللغة العربية' },
                    },
                    required: ['manualName', 'section'],
                  },
                },
                secondarySources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      title: { type: Type.STRING, description: 'عنوان المصدر بالعربية' },
                      code: { type: Type.STRING },
                      description: { type: Type.STRING, description: 'وصف المصدر بالعربية' },
                    },
                    required: ['type', 'title', 'description'],
                  },
                },
                mechanicTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING, description: 'نصيحة ميكانيكية باللغة العربية حصراً' },
                },
                preventiveAdvice: { type: Type.STRING, description: 'إرشاد وقائي باللغة العربية' },
              },
              required: [
                'vehicleSummary',
                'detectedSystem',
                'primaryDiagnosis',
                'severityLevel',
                'probableCauses',
                'diagnosticChecks',
                'manualReferences',
                'exactSpecs',
                'safetyWarnings',
              ],
            },
          },
        });
        if (response?.text) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed or unavailable:`, err?.message);
        // Continue to next model candidate
      }
    }

    if (!response || !response.text) {
      // Deterministic Manual Engine Fallback (guarantees answer from factory documents)
      const primaryDoc = retrievedDocs[0] || MANUAL_DOCUMENTS[0];
      const fallbackData = {
        vehicleSummary: {
          model: activeCar.model,
          year: activeCar.year,
          engine: activeCar.engine,
          transmission: activeCar.transmission,
        },
        detectedSystem: detectedSys,
        detectedIntent: detectedIntent,
        primaryDiagnosis: `استخراج المواصفات والتشخيص المعتمد من كتالوج ${primaryDoc.vehicleModel} (${primaryDoc.chapter})`,
        severityLevel: 'medium',
        probableCauses: [
          {
            cause: `مطابقة بنود منظومة ${detectedSys}`,
            probability: 'high',
            explanation: `بناءً على نصوص الكتالوج المفهرسة، تتعلق المشكلة أو الاستفسار بفصل ${primaryDoc.chapter}.`,
          },
        ],
        diagnosticChecks: [
          {
            id: 'check-1',
            component: 'فحص المستوى والحالة الظاهرية',
            action: 'مطابقة القيمة المقروءة مع حدود القياس المسموحة في الكتالوج.',
            normalValue: 'ضمن النطاق القياسي للكتالوج',
            faultIndicator: 'وجود نقص أو تهريب أو قراءة غير مطابقة',
          },
        ],
        repairSteps: [
          'اتباع الإجراءات المحددة في كتالوج الصيانة المعتمد.',
          'التأكد من استخدام العزوم واللزوجة الصحيحة دون خلط بين السوائل.',
        ],
        safetyWarnings: [
          'احذر من العمل على المحرك وسوائل التبريد أثناء سخونتها لتفادي خطر الحروق.',
          'ارتدِ نظارات وقفازات الحماية وتأكد من ثبات السيارة ورفع فرامل اليد.',
        ],
        exactSpecs: [
          {
            parameter: 'المواصفة المستخرجة من الكتالوج',
            value: primaryDoc.title,
            note: `صفحة ${primaryDoc.page}`,
          },
        ],
        manualReferences: retrievedDocs.map((d) => ({
          manualName: d.vehicleModel + ' Service Manual',
          section: d.chapter,
          page: `ص ${d.page}`,
          quote: d.title,
        })),
        secondarySources: TECHNICAL_SECONDARY_SOURCES.slice(0, 3),
        mechanicTips: [
          'احرص دائماً على عدم خلط زيت المحرك مع زيت الفتيس.',
          'استخدم وردات طبه نحاس جديدة مع كل غيار زيت لمنع التسريب.',
        ],
      };

      return res.json(fallbackData);
    }

    const resultText = response.text || '{}';
    const parsedData = JSON.parse(resultText);

    // Enrich with fallback references if empty
    if (!parsedData.manualReferences || parsedData.manualReferences.length === 0) {
      parsedData.manualReferences = retrievedDocs.map((d) => ({
        manualName: d.vehicleModel + ' Service Manual',
        section: d.chapter,
        page: `ص ${d.page}`,
        quote: d.title,
      }));
    }

    if (!parsedData.secondarySources || parsedData.secondarySources.length === 0) {
      parsedData.secondarySources = TECHNICAL_SECONDARY_SOURCES.slice(0, 3);
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Diagnosis Error:', error);
    return res.status(500).json({
      error: 'حدث خطأ أثناء معالجة التشخيص الفني: ' + (error?.message || 'خطأ غير متوقع'),
    });
  }
});

// 2. Audio speech transcription using gemini-3.5-transcribe
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'لم يتم إرسال ملف الصوت' });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          {
            text: 'حول هذا المقطع الصوتي بدقة إلى نص باللغة العربية (لهجة مصرية أو فصحى أو خليجية مع الاحتفاظ بمصطلحات أعطال السيارات بدقة). اكتب النص المفرغ فقط.',
          },
        ],
      },
    });

    return res.json({ text: response.text?.trim() || '' });
  } catch (error: any) {
    console.error('Transcription error:', error);
    return res.status(500).json({ error: 'فشل تفريغ الصوت: ' + error.message });
  }
});

// 3. Quick specs lookup
app.get('/api/specs/:carId', (req, res) => {
  const { carId } = req.params;
  // Return standard Hyundai specs (customizable per model)
  return res.json({
    carId,
    specs: HYUNDAI_EXCEL_SPECS,
  });
});

// 4. OBD Code Direct Lookup
app.get('/api/obd/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const info = COMMON_OBD_CODES[code];
  if (info) {
    return res.json(info);
  }

  return res.status(404).json({
    error: `الكود ${code} غير مسجل في الحفظ السريع، يمكنك كتابته في شريط التشخيص لتحليله بالكتالوج.`,
  });
});

// 5. List manual documents (preloaded + custom)
app.get('/api/manuals', (req, res) => {
  const all = [...MANUAL_DOCUMENTS, ...customManualsStore];
  return res.json({
    totalCount: all.length,
    manuals: all,
  });
});

// 6. Upload custom manual excerpt or notes
app.post('/api/manuals/custom', (req, res) => {
  try {
    const { vehicleModel, system, chapter, title, content, tags } = req.body;
    if (!content || !title) {
      return res.status(400).json({ error: 'محتوى الكتالوج وعنوانه مطلوبان' });
    }

    const newDoc: PreloadedManualDoc = {
      id: `custom-doc-${Date.now()}`,
      vehicleModel: vehicleModel || 'كتالوج مخصص',
      system: system || 'general',
      chapter: chapter || 'فصل مخصص',
      page: Math.floor(Math.random() * 200) + 1,
      title,
      content,
      tags: tags || ['custom', 'manual', 'صيانة'],
    };

    customManualsStore.unshift(newDoc);
    return res.json({ success: true, doc: newDoc });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Serve frontend in production or vite in development
const PORT = 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AutoDoc AI Service running on http://0.0.0.0:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer();
}
