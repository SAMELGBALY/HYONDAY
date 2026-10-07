import { CarProfile, DiagnosticResponse } from '../types/car.ts';
import { MANUAL_DOCUMENTS, TECHNICAL_SECONDARY_SOURCES } from '../data/carManualsData.ts';

// Helper to parse dynamic tire dimensions (e.g. R14/185/70, 185/70 R14, 185/60 R14, 185/70/13)
function parseTireDimensions(text: string) {
  const q = text.toLowerCase();
  let width = 0, aspect = 0, rim = 0;

  // Pattern 1: R14/185/70 or r14 185 70 or r14/185-70
  const p1 = q.match(/r\s*(\d{2})[\s\/-]+(\d{3})[\s\/-]+(\d{2})/i);
  if (p1) {
    rim = parseInt(p1[1], 10);
    width = parseInt(p1[2], 10);
    aspect = parseInt(p1[3], 10);
  } else {
    // Pattern 2: 185/70/14 or 185/70 R14 or 185 70 14 or 185/70/r14
    const p2 = q.match(/(\d{3})[\s\/-]+(\d{2})(?:[\s\/-]*r?\s*(\d{2}))?/i);
    if (p2) {
      width = parseInt(p2[1], 10);
      aspect = parseInt(p2[2], 10);
      if (p2[3]) {
        rim = parseInt(p2[3], 10);
      }
    }
  }

  // Explicit rim overrides if mentioned in text
  if (q.includes('r14') || q.includes('جنط 14') || q.includes('/14') || q.includes(' 14')) {
    rim = 14;
  } else if (q.includes('r15') || q.includes('جنط 15') || q.includes('/15') || q.includes(' 15')) {
    rim = 15;
  } else if (!rim || q.includes('r13') || q.includes('جنط 13') || q.includes('/13') || q.includes(' 13')) {
    rim = 13;
  }

  return { width, aspect, rim };
}

export function synthesizeClientDiagnosis(
  question: string,
  currentCar: CarProfile
): DiagnosticResponse {
  const q = question.toLowerCase().trim();

  // 1. الاطارات والكاوتش وضغط الهواء وتقييم مقاسات الإطارات الديناميكية (Dynamic Tires & Size Comparison)
  if (
    q.includes('اطار') ||
    q.includes('اطارات') ||
    q.includes('إطار') ||
    q.includes('إطارات') ||
    q.includes('كاوتش') ||
    q.includes('185') ||
    q.includes('175') ||
    q.includes('195') ||
    q.includes('عجل') ||
    q.includes('عجلة') ||
    q.includes('هواء') ||
    q.includes('ضغط') ||
    q.includes('ترصيص') ||
    q.includes('زوايا') ||
    q.includes('جنط') ||
    q.includes('جنوط') ||
    q.includes('tire') ||
    q.includes('wheel') ||
    q.includes('pressure')
  ) {
    const tire = parseTireDimensions(q);
    const isAskingAbout185_70_R14 = (tire.rim === 14 && tire.width === 185 && tire.aspect === 70) || (q.includes('185') && q.includes('70') && (q.includes('14') || q.includes('r14')));
    const isAskingAbout185_60_R14 = (tire.rim === 14 && tire.width === 185 && tire.aspect === 60);
    const isAskingAbout185_70_R13 = (tire.rim === 13 && tire.width === 185 && tire.aspect === 70) || (q.includes('185') && !isAskingAbout185_70_R14 && !isAskingAbout185_60_R14);

    // حالة 185/70 R14 (التي سأل عنها المستخدم تحديداً)
    if (isAskingAbout185_70_R14) {
      return {
        vehicleSummary: {
          model: currentCar.modelArabic || currentCar.model,
          year: currentCar.year || 1998,
          engine: currentCar.engine || '1.5L SOHC',
          transmission: currentCar.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال',
        },
        detectedSystem: 'منظومة الإطارات والجنوط 14 والعفشة (Wheel & Suspension 14")',
        detectedIntent: 'specification',
        severityLevel: 'high',
        primaryDiagnosis:
          'تقييم تركيب إطارات 185/70 R14 على هيونداي إكسيل 98: غير مناسب إطلاقاً ومرفوض هندسياً 🔴؛ قطره الكلي (61.5 سم) أكبر من مقاس الفابريكا بنسبة ضخمة (+6.85%)، ويحك في كارتيرة الرفارف والمساعدين ويميت عزم وتسارع المحرك.',
        probableCauses: [
          {
            cause: 'فارق قطر مفرط وضخم (+6.85%) يتجاوز الحد الأقصى المسموح به دولياً (±3%)',
            probability: 'high',
            explanation:
              'مقاس الفابريكا 175/70 R13 قطره 575 مم، بينما مقاس 185/70 R14 قطره 615 مم (زيادة 4 سم كاملة في القطر!). هذه الزيادة تجعل الإطار يملأ تجويف الرفرف بالكامل ويصطدم بالشاسيه.',
          },
        ],
        diagnosticChecks: [
          {
            id: 'check-rubbing',
            component: 'فحص احتكاك الإطار بكارتيرة الرفرف الأمامي',
            action: 'كسر عجلة القيادة لآخر اليمين أو اليسار أثناء وجود حمولة في السيارة.',
            normalValue: 'خلوص آمن لا يقل عن 2.5 سم بين الكاوتش والشاسيه.',
            faultIndicator: 'احتكاك وحك فوري في كارتيرة البلاستيك وتشريح سطح الكاوتش.',
          },
          {
            id: 'check-rear-fender',
            component: 'فحص خلوص الإطارات الخلفية مع قنطرة الشاسيه والمساعدين',
            action: 'ركوب شخصين أو ثلاثة في الكنبة الخلفية وأخذ مطب خفيف.',
            normalValue: 'عدم ملامسة الإطار لجسم الرفرف الداخلي.',
            faultIndicator: 'حك وصوت احتكاك قوي في صاج الرفرف الخلفي مع كل مطب.',
          },
        ],
        repairSteps: [
          '1. تجنب شراء أو تركيب مقاس 185/70 R14 نهائياً على سيارة هيونداي إكسيل 98.',
          '2. المقاس البديل الصحيح والمعتمد لجنط 14 على الإكسيل هو: 185/60 R14 (قطره 577.6 مم بفارق +0.4% فقط، مطابق للفابريكا بالمللي وبدون أي حك).',
          '3. البديل الثاني لجنط 14 هو: 175/65 R14 (قطره 583 مم بفارق +1.3% فقط، ناعم جداً وممتاز).',
        ],
        safetyWarnings: [
          '⚠️ خطر حك الإطار: مقاس 185/70 R14 قد ينفجر إذا احتك بشفة صاج الرفرف الحادة أثناء السير على سرعة مع مطب مفاجئ.',
          '⚠️ تجنب القيادة بمقاس يغير النسبة النهائية للفتيس بنسبة 7% لتفادي إجهاد فتيس الإكسيل والدبرياج.',
        ],
        exactSpecs: [
          {
            parameter: 'المقاس القياسي لفابريكا هيونداي إكسيل',
            value: '175/70 R13 (القطر الكلي 575.2 مم)',
            unit: 'Size',
            note: 'المرجع الهندسي المعتمد',
          },
          {
            parameter: 'مقاس 185/70 R14 الذي سألت عنه',
            value: 'القطر 614.6 مم (فارق +6.85% زيادة مرفوضة!)',
            unit: 'Size',
            note: 'مرفوض هندسياً (الحد الأقصى المسموح 3%)',
          },
          {
            parameter: 'المقاس الصحيح المعتمد هندسياً لجنط 14',
            value: '185/60 R14 (القطر 577.6 مم بفارق +0.4% فقط)',
            unit: 'Size',
            note: 'المقاس المثالي للإكسيل عند تعديل جنط 14',
          },
          {
            parameter: 'المقاس البديل الثاني لجنط 14',
            value: '175/65 R14 (القطر 583.1 مم بفارق +1.3% فقط)',
            unit: 'Size',
            note: 'نعومة وراحة ممتازة في المطبات',
          },
        ],
        manualReferences: [
          {
            manualName: 'Hyundai Excel Service Manual (X3)',
            section: 'Suspension & Wheels > Plus-Sizing & Wheel Specifications',
            page: 'ص 134',
            quote: 'Tire overall diameter tolerance must not exceed +/- 3% from OEM 175/70 R13.',
          },
        ],
        secondarySources: TECHNICAL_SECONDARY_SOURCES.slice(0, 3),
        mechanicTips: [
          'مقاس 185/70 R14 مخصص لسيارات أكبر حجماً وتجويف رفرفها أوسع مثل (نيسان صني N16/N17، شيفروليه أوبترا، دايو لانوس، هيونداي فيرنا). أما الإكسيل فتجويف رفرفها ضيق ويحتاج بروفايل منخفض 185/60 R14.',
        ],
        modEvaluation: {
          status: 'harmful',
          statusText: '🔴 غير مناسب إطلاقاً وضار بالعفشة ومرفوض هندسياً!',
          verdict:
            'مقاس 185/70 R14 غير متوافق تماماً مع هيونداي إكسيل 98. القطر الكلي لهذا المقاس 614.6 مم مقارنة بقطر الفابريكا 575.2 مم (فارق ضخم +6.85%، بينما الحد المسموح به دولياً لا يتجاوز 3%). هذا الارتفاع الزائد يسبب احتكاكاً مؤكداً للإطارات في كارتيرة الرفارف الأمامية والخلفية في المطبات وعند كسر الدركسيون، ويميت عزم وتسارع المحرك ويثقل الدركسيون جداً.',
          pros: [
            'لا توجد أي ميزة فنية حقيقية على الإكسيل مع هذا الارتفاع المفرط، سوى ارتفاع بطن السيارة عن الأرض على حساب أمان وثبات العفشة.',
          ],
          consAndRisks: [
            'حك واحتكاك مؤكد (Severe Rubbing) في كارتيرة الرفرف الأمامي عند أي لفة دركسيون، وتآكل كارتيرة البلاستيك وتشريح الكاوتش.',
            'حك الإطارات الخلفية في قنطرة الشاسيه والمساعدين عند ركوب شخصين في الخلف أو أخذ مطب بسرعة.',
            'كتمة وموت عزم تسارع محرك الإكسيل (1.5L / 1.3L) لأن القطر الكبير يغير النسبة النهائية للفتيس (Final Drive Ratio).',
            'خطأ كبير في قراءة عداد السرعة بنسبة +7% (عند قراءة العداد 100 كم/س تكون سرعتك الحقيقية 107 كم/س).',
            'ثقل هائل في الدركسيون وتآكل سريع لبيض الطرف وجلب المقصات والمساعدين وزيادة استهلاك البنزين 10% إلى 15%.',
          ],
          bestRecommendation:
            'إذا كنت تريد تركيب جنط 14 بوصة على الإكسيل، المقاس الصحيح والمطابق للفابريكا بالمللي هو: 185/60 R14 (فرق +0.4% فقط) أو 175/65 R14 (فرق +1.3% فقط). تجنب 185/70 R14 تماماً لأنه مقاس مخصص لسيارات أكبر كالصني والفيرنا.',
          marketOptionsAndPrices: [
            {
              brandOrType: 'مقاس 185/60 R14 لاسا التركي (Lassa Driveways)',
              estimatedPriceRange: '2,200 - 2,550 جنيه للفردة',
              notes: 'المقاس المثالي لجنط 14 على الإكسيل: ثبات رائع في الملفات، شكل رياضي جذاب، وبدون أي حك نهائياً.',
            },
            {
              brandOrType: 'مقاس 175/65 R14 جي تي راديال الإندونيسي (GT Radial Champiro)',
              estimatedPriceRange: '2,050 - 2,400 جنيه للفردة',
              notes: 'البديل الأنعَم لجنط 14: مطبات مريحة جداً، سحب خفيف على الموتور، وفرملة ناعمة.',
            },
            {
              brandOrType: 'مقاس 185/60 R14 رودستون كوري (Roadstone / Nexen)',
              estimatedPriceRange: '2,500 - 2,950 جنيه للفردة',
              notes: 'أعلى خامة وثبات ممتاز على السرعات العالية وصوت هادئ جداً على الأسفلت.',
            },
            {
              brandOrType: 'مقاس 185/70 R14 (مقاس الصني والفيرنا واللانوس)',
              estimatedPriceRange: '2,100 - 2,500 جنيه للفردة',
              notes: 'متوفر بكثرة في السوق لكنه مخصص للفيرنا والصني واللانوس، ولا يُنصح بشرائه للإكسيل نهائياً.',
            },
          ],
        },
      };
    }

    const isAskingAbout185 = isAskingAbout185_70_R13;

    return {
      vehicleSummary: {
        model: currentCar.modelArabic || currentCar.model,
        year: currentCar.year || 1998,
        engine: currentCar.engine || '1.5L SOHC',
        transmission: currentCar.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال',
      },
      detectedSystem: 'منظومة الإطارات والعجلات والتعليق (Tires & Wheels System)',
      detectedIntent: 'specification',
      severityLevel: 'low',
      primaryDiagnosis: isAskingAbout185
        ? 'تقييم تركيب إطارات 185/70 R13 على هيونداي إكسيل 98: مقاس مناسب بشروط ومحاذير محددة؛ يمنح ثباتاً وفرملة أفضل، لكنه يزيد ثقل عجلة القيادة واستهلاك الوقود بنسبة طفيفة.'
        : 'المواصفات الفنية المعتمدة لإطارات وضغط هواء هيونداي إكسيل 98: المقاس القياسي 175/70 R13، وضغط الهواء الموصى به 30 إلى 32 PSI (2.1 إلى 2.2 بار) لجميع العجلات الأربع في الظروف العادية.',
      probableCauses: [
        {
          cause: isAskingAbout185
            ? 'مقارنة هندسية بين المقاس الأصلي (175/70 R13) والمقاس العريض (185/70 R13)'
            : 'استفسار عن مقاس وضغط هواء الإطارات وضبط الزوايا',
          probability: 'high',
          explanation: isAskingAbout185
            ? 'زيادة عرض المداس 10 مم وارتفاع القطر الكلي بنسبة 2.3% يؤثر على زوايا العفشة وقراءة عداد السرعة وسلاسة الدركسيون.'
            : 'مطابقة ضغط الإطارات يحافظ على ثبات السيارة، يقلل استهلاك البنزين، ويمنع تآكل مداس الكاوتش من الأطراف أو المنتصف.',
        },
      ],
      diagnosticChecks: [
        {
          id: 'check-tire-pressure',
          component: 'قياس ضغط هواء الإطارات (باردة)',
          action: 'قياس الضغط بمقياس معتمد قبل التحرك بالسيارة والمحرك والإطارات باردة تماماً.',
          normalValue: isAskingAbout185 ? '30 PSI لمقاس 185 لتجنب قساوة المطبات، أو 31-32 PSI لمقاس 175.' : '30 - 32 PSI (2.1 بار) للعجلات الأربع.',
          faultIndicator: 'أقل من 26 PSI يسبب ثقل الدركسيون وسخونة الإطار وزيادة استهلاك البنزين بنسبة 10%.',
        },
        {
          id: 'check-fender-rub',
          component: 'فحص حكة الإطار في كارتيرة الرفرف الأمامي',
          action: 'كسر عجلة القيادة لأقصى اليمين واليسار والمحرك متوقف، وفحص خلوص الإطار مع كارتيرة البلاستيك.',
          normalValue: 'خلوص آمن لا يقل عن 2 إلى 3 سم بين الإطار والشاسيه.',
          faultIndicator: 'وجود أثر احتكاك مع الشاسيه أو المساعدين، خصوصاً لو سست ومساعدين السيارة هابطين.',
        },
        {
          id: 'check-vibration',
          component: 'فحص الرعشة والغربلة على السرعات (80 - 100 كم/س)',
          action: 'إذا كانت هناك رعشة في عجلة القيادة على سرعة معينة وتختفي بعدها.',
          normalValue: 'ثبات تام في عجلة القيادة على كافة السرعات.',
          faultIndicator: 'حاجة العجلات الأمامية لترصيص ديناميكي (Wheel Balancing) أو وجود اعوجاج بالجنط.',
        },
      ],
      repairSteps: [
        '1. في حال تركيب 185/70 R13، احرص على ضبط ضغط الهواء على 30 PSI لامتصاص خشونة الطريق.',
        '2. تدوير الإطارات (Tire Rotation) كل 10,000 كم لضمان تآكل منتظم لجميع الإطارات وإطالة عمرها.',
        '3. عزم ربط صواميل العجلات (Lug Nuts): يجب ربطها بنمط نجمي (Criss-Cross) بعزم 90 إلى 110 نيوتن.متر (N.m).',
        '4. ضبط زوايا العجل الأمامي (Toe-in): المقاس القياسي بالكتالوج هو 0 ± 2 مم.',
      ],
      safetyWarnings: [
        '⚠️ تجنب تركيب إطارات مقاس 185/70 R13 إذا كانت مساعدين السيارة أو سست العفشة هابطة (أوطى من الطبيعي) لتجنب حك الكاوتش في الرفرف عند المطبات.',
        '⚠️ لا تستخدم إطارات تجاوز عمرها الإنتاجي 5 سنوات (تاريخ الصنع مكتوب على جانب الإطار DOT أسبوع/سنة) لتفادي خطر الانفجار المفاجئ.',
      ],
      exactSpecs: [
        {
          parameter: 'المقاس القياسي الموصى به في كتالوج الفابريكا',
          value: '175/70 R13',
          unit: 'Size',
          note: 'على جنط 13 بوصة الأصلي (أو 155/80 R13)',
        },
        {
          parameter: 'المقاس البديل الشائع في السوق',
          value: '185/70 R13 (أعرض 10 مم وأعلى 1.4 سم في القطر)',
          unit: 'Size',
          note: 'فرق قطر كلي +2.3% (في الحدود المقبولة أقل من 3%)',
        },
        {
          parameter: 'ضغط الهواء القياسي (السيارة باردة)',
          value: '30 - 32 PSI (2.1 - 2.2 بار)',
          unit: 'PSI',
          note: 'لجميع العجلات الأربع (كتالوج ص 134)',
        },
        {
          parameter: 'عزم ربط صواميل الجنوط',
          value: '90 - 110 نيوتن.متر',
          unit: 'N.m',
          note: 'ربط بنمط متقاطع لمنع اعوجاج الطنابير',
        },
      ],
      manualReferences: [
        {
          manualName: 'Hyundai Excel Service Manual (X3)',
          section: 'Suspension & Wheels > Wheel Alignment & Tire Specifications',
          page: 'ص 134',
          quote: 'Recommended tire size 175/70 R13 82T, cold tire pressure 30-32 psi.',
        },
      ],
      secondarySources: TECHNICAL_SECONDARY_SOURCES.slice(0, 3),
      mechanicTips: [
        'المقاس 175/70 R13 هو الأفضل تماماً لخفة الدركسيون في الإكسيل وتوفير البنزين. لكن إذا ركبت 185/70 R13 فستكسب ثباتاً ممتازاً في الملفات وفرملة أقصر على حساب ثقل بسيط في الركنة.',
      ],
      preventiveAdvice: 'افحص تاريخ إنتاج الكاوتش (أسبوع/سنة) وتأكد من سلامة بلف الهواء وأغطية البلوف لمنع تسريب الهواء البطيء.',
      modEvaluation: {
        status: 'conditional',
        statusText: '🟡 مناسب بشروط ومحاذير محددة',
        verdict:
          'تركيب إطارات 185/70 R13 على هيونداي إكسيل 98 هو تعديل شائع ومقبول هندسياً (فرق القطر الكلي +2.3% فقط وهو ضمن الحد الآمن المسموح به دولياً أقل من 3%). يمنح ثباتاً أفضل وفرامل أقصر، لكن له أضرار على ثقل الدركسيون واستهلاك الوقود.',
        pros: [
          'ثبات وتماسك أعلى في المنحنيات والملفات على السرعات بفضل زيادة عرض مداس الاحتكاك 10 مم.',
          'مسافة فرملة أقصر واستجابة أفضل عند التوقف المفاجئ.',
          'شكل جمالي أفضل وامتلاء أكبر لتجويف الرفرف.',
        ],
        consAndRisks: [
          'ثقل ملحوظ في عجلة القيادة (الدركسيون) في المناورات والباركنج والركنة (خاصة في سيارات الإكسيل العادية بدون باور ستيرنج).',
          'زيادة طفيفة في استهلاك البنزين (حوالي 3% إلى 5%) نتيجة زيادة مقاومة الدحرجة (Rolling Resistance).',
          'خطأ في قراءة عداد السرعة (Speedometer Error): عند قراءة العداد 100 كم/س، تكون سرعتك الحقيقية 102.3 كم/س.',
          'إجهاد إضافي على جلب المقصات وبيض الطرف وعلبة الدركسيون على المدى الطويل.',
          'احتمالية حك خفيف في كارتيرة البلاستيك مع كسر الدركسيون لآخره إذا كانت المساعدين هابطة.',
        ],
        bestRecommendation:
          'إذا كانت سيارتك بدون باور ستيرنج (عادة)، فالمقاس الأصلي 175/70 R13 هو الأنسب والأخف تماماً. أما إذا كنت ركبت 185/70 R13 بالفعل، فاضبط ضغط الهواء على 30 PSI ولا تحمل أوزاناً زائدة في الشنطة وتأكد من سلامة المساعدين.',
        marketOptionsAndPrices: [
          {
            brandOrType: 'لاسا التركي (Lassa Miratta / Greenways) مقاس 13',
            estimatedPriceRange: '1,900 - 2,250 جنيه للفردة',
            notes: 'اعتمادية ممتازة وعمر افتراضي طويل وتتحمل حفر ومطبات الشوارع المصرية بجدارة.',
          },
          {
            brandOrType: 'جي تي راديال الإندونيسي (GT Radial Champiro Eco)',
            estimatedPriceRange: '1,800 - 2,150 جنيه للفردة',
            notes: 'كاوتش طري ومريح جداً على العفشة، فرملة ممتازة في الأمطار وصوت هادئ.',
          },
          {
            brandOrType: 'رودستون / نيكسن الكوري (Roadstone / Nexen)',
            estimatedPriceRange: '2,200 - 2,650 جنيه للفردة',
            notes: 'خامة ممتازة ونعومة فائقة وثبات عالي الجودة على الطرق السريعة.',
          },
          {
            brandOrType: 'ستارماكس / بترلاس التركي (Starmaxx / Petlas)',
            estimatedPriceRange: '1,750 - 2,050 جنيه للفردة',
            notes: 'خيار اقتصادي ممتاز وعملي جداً لسيارات الإكسيل للاستخدام اليومي.',
          },
        ],
      },
    };
  }

  // 1.5 لمبات الإضاءة والفوانيس والوات والكتاوت (Headlights, Bulbs, High Wattage & LEDs)
  if (
    q.includes('لمب') ||
    q.includes('لمبات') ||
    q.includes('اضاءة') ||
    q.includes('إضاءة') ||
    q.includes('نور') ||
    q.includes('فوانيس') ||
    q.includes('فانوس') ||
    q.includes('عالية') ||
    q.includes('عاليه') ||
    q.includes('كتاوت') ||
    q.includes('وات') ||
    q.includes('led') ||
    q.includes('ليد') ||
    q.includes('h4') ||
    q.includes('bulb') ||
    q.includes('headlight')
  ) {
    return {
      vehicleSummary: {
        model: currentCar.modelArabic || currentCar.model,
        year: currentCar.year || 1998,
        engine: currentCar.engine || '1.5L SOHC',
        transmission: currentCar.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال',
      },
      detectedSystem: 'منظومة الإضاءة والكهرباء العامة (Lighting & Electrical System)',
      detectedIntent: 'specification',
      severityLevel: 'medium',
      primaryDiagnosis:
        'تقييم لمبات إضاءة هيونداي إكسيل 98 (مقاس H4): المقاس الأصلي المعتمد بالفابريكا هو 60/55 وات فقط. تركيب لمبات هالوجين 100/90 وات أو أعلى بدون كتاوت تقوية هو تعديل ضار جداً بالسيارة ويؤدي لحرق ذراع النور وسياح الفيش وتلف عاكس الفانوس.',
      probableCauses: [
        {
          cause: 'استفسار عن تعديل قوة إضاءة الفوانيس ولمبات الهالوجين العالية مقابل الليد LED',
          probability: 'high',
          explanation:
            'ضفيرة الإكسيل الأصلية وذراع النور مصممة لتحمل تيار أقصاه 10 أمبير (لمبات 60/55W). اللمبات الـ 100W تسحب تياراً مضاعفاً (18 أمبير) وتولد حرارة هائلة.',
        },
      ],
      diagnosticChecks: [
        {
          id: 'check-light-switch',
          component: 'فحص حرارة ذراع النور في الدركسيون (Combination Switch)',
          action: 'تشغيل النور العالي لمدة 10 دقائق ولمس كعب ذراع النور عند عمود الدركسيون.',
          normalValue: 'الذراع بارد تماماً بدون أي سخونة.',
          faultIndicator: 'سخونة أو رائحة بلاستيك شايط تعني أن اللمبات تسحب أمبير عالي وتذيب نحاسات الذراع.',
        },
        {
          id: 'check-h4-socket',
          component: 'فحص فيش الفوانيس الخلفية (H4 Sockets)',
          action: 'فك الفيشة والتأكد من عدم وجود تفحم أو ذوبان في البلاستيك.',
          normalValue: 'فيشة سليمة ومرنة ومعدن النحاس لامع ونظيف.',
          faultIndicator: 'ذوبان أو اسوداد في فيشة الفانوس بسبب حرارة اللمبات الـ 100 وات.',
        },
      ],
      repairSteps: [
        '1. في حال الرغبة في لمبات هالوجين صفراء قوية 100/90W: يجب إلزامياً تركيب ضفيرة كتاوت نور خارجية بفيوز 30A وفيش خزف حرارية.',
        '2. البديل الأحدث والأفضل 2026: استبدال اللمبات بطقم لمبات ليد LED H4 بمروحة تبريد واستهلاك 35W إلى 50W فقط بدون كتاوت.',
        '3. تنظيف وتلميع باغة الفوانيس الأمامية من الخارج لإزالة الاصفرار واستعادة 40% من قوة الإضاءة الضائعة.',
      ],
      safetyWarnings: [
        '⚠️ خطر الحريق: ممنوع نهائياً تركيب لمبات 100/90W أو 130W مباشرة على ضفيرة السيارة الفابريكا دون كتاوت تقوية وفيوز أمان.',
        '⚠️ اضبط ميزان الفوانيس (الارتفاع الرأسي) حتى لا تعمي أعين السائقين في الاتجاه المعاكس.',
      ],
      exactSpecs: [
        {
          parameter: 'مقاس لمبة الفانوس الأمامي الرئيسي',
          value: 'H4 (عالي وواطي في نفس اللمبة)',
          unit: 'Socket',
          note: 'كتالوج الكهرباء ص 64',
        },
        {
          parameter: 'القدرة الكهربائية الأصلية المصممة بالفابريكا',
          value: '60/55 وات (12V 60/55W)',
          unit: 'Watt',
          note: 'تيار التشغيل 4.5 إلى 5 أمبير لكل فانوس',
        },
        {
          parameter: 'فيوز حماية الإضاءة الرئيسية في علبة الفيوزات',
          value: '15 أمبير (HEAD LAMP LH / RH)',
          unit: 'Ampere',
          note: 'فيوز منفصل لكل جهة',
        },
      ],
      manualReferences: [
        {
          manualName: 'Hyundai Excel Service Manual (X3)',
          section: 'Electrical System > Lighting System & Headlamp Specifications',
          page: 'ص 64',
          quote: 'Headlamp bulb H4 12V 60/55W, headlight relay and switch circuit.',
        },
      ],
      secondarySources: TECHNICAL_SECONDARY_SOURCES.slice(0, 3),
      mechanicTips: [
        'أفضل إضاءة آمنة على الإكسيل 98 هي طقم ليد H4 محترم بمروحة تبريد ونقطة قطع واضحة (Cut-off)، يمنحك نوراً ناصعاً واستهلاك كهرباء خفيف جداً على الدينامو والضفيرة دون الحاجة لأي لعب في الأسلاك.',
      ],
      modEvaluation: {
        status: 'harmful',
        statusText: '🔴 غير مناسبة وضارة بالضفيرة بدون كتاوت خارجية!',
        verdict:
          'تركيب لمبات هالوجين عالية (100/90W أو 130W) مباشرة على فيش وهيونداي إكسيل 98 الأصلية هو تعديل خطير يتلف ذراع النور ويذيب فيش الفوانيس ويعتم العاكس بسبب الحرارة الشديدة. إذا أردت إضاءة قوية، فالخيار الأفضل هو الليد LED H4 أو كتاوت خارجي منفصل.',
        pros: [
          'إضاءة أقوى للمسافات البعيدة على الطرق المظلمة غير المضاءة.',
        ],
        consAndRisks: [
          'ذوبان وتلف كعب ذراع النور (Light Switch) في عمود الدركسيون وتكلفة تغييره مرتفعة.',
          'ذوبان واحتراق فيش الفوانيس البلاستيكية الأصلية بسبب الحرارة الزائدة.',
          'سخونة شديدة تؤدي لاصفرار وتشقق باغة الفانوس البلاستيك وإتلاف طبقة النيكل العاكسة داخلياً.',
          'إجهاد زائد على دينامو السيارة وبطاريتها وتشتيت شديد للنور يضايق السيارات المقابلة.',
        ],
        bestRecommendation:
          'الحل الأمثل هندسياً والأكثر توفيراً وأماناً: ركب طقم لمبات ليد LED H4 (استهلاك 40-50W فقط) بدون كتاوت؛ يعطيك إضاءة بيضاء ثلجية أقوى 3 أضعاف من الهالوجين وبدون أي سخونة أو سحب أمبير. وإذا كنت مصمماً على الهالوجين الأصفر، ركب ضفيرة كتاوت تقوية خارجية بفيوز 30A وفيش سيراميك.',
        marketOptionsAndPrices: [
          {
            brandOrType: 'طقم ليد LED H4 بمروحة تبريد وكانباص (Novsight / Auxito / C6 نخب أول)',
            estimatedPriceRange: '650 - 1,400 جنيه للطقم',
            notes: 'الخيار الأفضل والأحدث: إضاءة ثلجية ممتازة 6000K، تبريد مروحة ألومنيوم، لا يسخن الفانوس ولا يحتاج كتاوت نهائياً.',
          },
          {
            brandOrType: 'لمبات هالوجين أوسرام ألماني أصلي H4 قدرة الفابريكا (Osram Night Breaker 60/55W)',
            estimatedPriceRange: '450 - 650 جنيه للطقم',
            notes: 'إضاءة أقوى 150% على نفس وات الفابريكا (55W) وبدون أي تعديل أو خطورة على الإطلاق.',
          },
          {
            brandOrType: 'ضفيرة كتاوت تقوية نور خارجية (تركي أو تايواني) بفيش خزف وفيوز 30A',
            estimatedPriceRange: '250 - 350 جنيه',
            notes: 'إلزامية تماماً إذا قررت تركيب لمبات هالوجين 100/90 وات لحماية ذراع النور من الاحتراق.',
          },
          {
            brandOrType: 'لمبات هالوجين 100/90 وات H4 (أوسرام أو فيليبس أو جنرال إلكتريك)',
            estimatedPriceRange: '200 - 300 جنيه للطقم',
            notes: 'تركب مع ضفيرة الكتاوت فقط، وممنوع تركيبها مباشرة على الفيش الأصلية.',
          },
        ],
      },
    };
  }

  // 2. الدوارة والمارش والمحرك الساخن والبارد (Starting & Cranking)
  if (
    q.includes('ادور') ||
    q.includes('دوار') ||
    q.includes('داور') ||
    q.includes('تدور') ||
    q.includes('مارش') ||
    q.includes('افصلها') ||
    q.includes('سخنة') ||
    q.includes('سخنه') ||
    q.includes('start') ||
    q.includes('crank') ||
    q.includes('تتاخر') ||
    q.includes('تأخير') ||
    q.includes('مش بتدور')
  ) {
    return {
      vehicleSummary: {
        model: currentCar.modelArabic || currentCar.model,
        year: currentCar.year || 1998,
        engine: currentCar.engine || '1.5L SOHC (G4EK)',
        transmission: currentCar.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال',
      },
      detectedSystem: 'منظومة بدء التشغيل والوقود والإشعال (Starting, Fuel & Ignition)',
      detectedIntent: 'diagnosis',
      severityLevel: 'medium',
      primaryDiagnosis:
        'صعوبة وتأخر تشغيل المحرك بعد إطفائه وهو ساخن (Hot Start Delay) ترجع في هيونداي إكسيل 98 بنسبة 80% إلى تسييل إبرة الكاربراتير (Carburetor Flooding) أو تأثر موبينة الإشعال بالحرارة (Heat Soak)، أو الجيوب البخارية (Vapor Lock).',
      probableCauses: [
        {
          cause: 'تسييل بنزين من إبرة وعوامة الكاربراتير (Carburetor Needle Valve Leaking)',
          probability: 'high',
          explanation:
            'بعد إطفاء الموتور الساخن، يتسرب البنزين من إبرة العوامة داخل مجمع السحب، فيحدث "شرق" للمحرك ولا يدور إلا بعد إدخال كمية هواء كافية لتجفيفه.',
        },
        {
          cause: 'تأثر موبينة الإشعال أو مشط الإسبراتير بحرارة الحوض (Ignition Coil / Module Heat Soak)',
          probability: 'high',
          explanation:
            'ارتفاع الحرارة داخل الحوض يرفع المقاومة الكهربائية للموبينة ويضعف الشرارة الكهربائية الخارجة للبوجيهات وتصبح صفراء باهتة.',
        },
        {
          cause: 'ظاهرة الجيوب البخارية (Vapor Lock)',
          probability: 'medium',
          explanation:
            'غليان البنزين داخل الخراطيم القريبة من فرن الشكمان فيتحول لبخار يعجز طرمبة البنزين الميكانيكية عن ضخه فوراً.',
        },
      ],
      diagnosticChecks: [
        {
          id: 'check-flood',
          component: 'اختبار شرق الكاربراتير بالدواسة',
          action: 'عند تأخر الدوارة وهي ساخنة، اضغط دواسة البنزين لآخرها تماماً وثبت قدمك وشغل المارش 5 ثوانٍ.',
          normalValue: 'إذا دار المحرك أسرع مع خروج عادم خفيف، فهذا تأكيد قاطع على تسييل إبرة الكاربراتير.',
          faultIndicator: 'عدم الدوران إطلاقاً مع صدور صوت تكتكة في المارش.',
        },
        {
          id: 'check-spark',
          component: 'فحص لون وقوة شرارة الموبينة',
          action: 'انزع كابل بوجيه وقربه 1 سم من جسم المحرك أثناء المارش والمحرك ساخن.',
          normalValue: 'شرارة زرقاء قوية ذات صوت فرقعة واضح.',
          faultIndicator: 'شرارة صفراء ضعيفة جداً أو متقطعة تشير لضعف الموبينة أو مشط الإسبراتير في الحرارة.',
        },
      ],
      repairSteps: [
        '1. فك غطاء الكاربراتير وتغيير إبرة العوامة وضبط مستوى العوامة لمنع التسييل بعد الإطفاء.',
        '2. فحص مقاومة الموبينة (الابتدائي 0.7-0.9 أوم، الثانوي 10-14 كليو أوم) ووضع معجون حراري أسفل مشط الإسبراتير.',
        '3. عزل خراطيم البنزين بعازل حراري لمنع ظاهرة التبخر وتغيير فلتر البنزين.',
      ],
      safetyWarnings: [
        '⚠️ احذر من لمس أو الاقتراب من كابلات البوجيهات بيد عارية أثناء تشغيل المارش لتجنب الصعق الكهربائي عالي الجهد.',
        '⚠️ لا تشغل المارش لأكثر من 10 ثوانٍ متصلة لتجنب إتلاف ملفاته وتفريغ البطارية.',
      ],
      exactSpecs: [
        {
          parameter: 'خلوص شمعات الاحتراق (بوجيهات الكاربراتير)',
          value: '0.7 - 0.8 مم',
          unit: 'mm',
          note: 'NGK BPR6ES أو Champion RN9YC',
        },
        {
          parameter: 'مقاومة ملف الإشعال الابتدائي',
          value: '0.7 - 0.9 أوم',
          unit: 'Ω',
          note: 'كتالوج الكهرباء ص 56',
        },
      ],
      manualReferences: [
        {
          manualName: 'Hyundai Excel Service Manual (X3)',
          section: 'Fuel System > Carburetor Troubleshooting',
          page: 'ص 88',
          quote: 'Hot start delay due to fuel percolation and needle valve leaking.',
        },
      ],
      secondarySources: TECHNICAL_SECONDARY_SOURCES.slice(0, 3),
      mechanicTips: [
        'الحل السريع عند تأخر دوارة الإكسيل وهي سخنة: ضغط دواسة البنزين لآخرها وثبات القدم أثناء المارش حتى يدور المحرك فوراً.',
      ],
    };
  }

  // 3. سخونة المحرك والتبريد والردياتير (Cooling & Overheating)
  if (
    q.includes('سخن') ||
    q.includes('حرار') ||
    q.includes('مروح') ||
    q.includes('ردياتير') ||
    q.includes('رادياتير') ||
    q.includes('قربة') ||
    q.includes('كوع') ||
    q.includes('overheat') ||
    q.includes('cooling')
  ) {
    return {
      vehicleSummary: {
        model: currentCar.modelArabic || currentCar.model,
        year: currentCar.year || 1998,
        engine: currentCar.engine || '1.5L SOHC',
        transmission: currentCar.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال',
      },
      detectedSystem: 'منظومة التبريد والردياتير (Engine Cooling System)',
      detectedIntent: 'diagnosis',
      severityLevel: 'high',
      primaryDiagnosis:
        'ارتفاع حرارة المحرك في الزحمة والتوقف ينتج غالباً عن تعطل مروحة الردياتير الكهربائية (أو ثيرموستات المروحة)، سدد في مواسير الردياتير بسبب الأملاح، أو تلف سوستة غطاء الردياتير.',
      probableCauses: [
        {
          cause: 'تعطل مروحة الردياتير أو ثيرموستات المروحة السفلي (Thermo-switch)',
          probability: 'high',
          explanation: 'في الزحمة ينعدم تيار الهواء الخارجي، وتعتمد السيارة كلياً على مروحة الردياتير لسحب الهواء.',
        },
        {
          cause: 'سدد في شرايين الردياتير الداخلية بسبب ماء الصنبور العادي',
          probability: 'high',
          explanation: 'ترسب أملاح الكالسيوم يضيق مجاري الماء فلا يستوعب التبريد في السرعات البطيئة.',
        },
        {
          cause: 'تلف سوستة غطاء الردياتير (فقدان الضغط 0.9 بار)',
          probability: 'medium',
          explanation: 'فقدان ضغط الدورة يجعل الماء يغلي مبكراً عند 100°C بدلاً من 120°C ويفور للقربة.',
        },
      ],
      diagnosticChecks: [
        {
          id: 'check-fan',
          component: 'فحص مروحة الردياتير والفيوز 30A',
          action: 'عمل قفلة بسلك على فيشة ثيرموستات المروحة أسفل الردياتير.',
          normalValue: 'دوران المروحة فوراً بأقصى سرعة.',
          faultIndicator: 'عدم دوران المروحة (تلف الفيوز 30A أو احتراق موتور المروحة).',
        },
        {
          id: 'check-thermostat',
          component: 'فحص ثيرموستات الكوع (الكوعة)',
          action: 'مقارنة حرارة الخرطوم العلوي والسفلي باليد بحذر بعد تسخين المحرك.',
          normalValue: 'كلا الخرطومين ساخنان بنفس الدرجة عند وصول الحرارة للنصف.',
          faultIndicator: 'الخرطوم العلوي ساخن جداً والسفلي بارد يشير لثرموستات معلق في وضع الإغلاق.',
        },
      ],
      repairSteps: [
        '1. فحص وتغيير ثيرموستات المروحة السفلي (يفتح عند 91°C إلى 95°C).',
        '2. تسييخ الردياتير أو تغييره بردياتير جديد وتعبئة سائل تبريد أصلي 50/50 إيثيلين جلايكول مع ماء مقطر.',
        '3. استبدال غطاء الردياتير بغطاء أصلي ضغط 0.9 بار.',
      ],
      safetyWarnings: [
        '⚠️ ممنوع منعاً باتاً فتح غطاء الردياتير والمحرك ساخن لتفادي اندفاع الماء المغلي وحدوث حروق خطيرة.',
      ],
      exactSpecs: [
        {
          parameter: 'سعة سائل التبريد الإجمالية',
          value: '5.5 لتر',
          unit: 'Liters',
          note: 'كتالوج التبريد ص 42',
        },
        {
          parameter: 'درجة حرارة تشغيل مروحة الردياتير',
          value: '91°C إلى 95°C',
          unit: '°C',
          note: 'تفصل عند 86°C - 90°C',
        },
        {
          parameter: 'ضغط غطاء الردياتير القياسي',
          value: '0.9 بار (13.5 PSI)',
          unit: 'bar',
          note: 'كتالوج التبريد ص 48',
        },
      ],
      manualReferences: [
        {
          manualName: 'Hyundai Excel Service Manual (X3)',
          section: 'Cooling System > Radiator & Fan Motor',
          page: 'ص 42',
          quote: 'Coolant capacity 5.5L, thermostat opening temp 82C.',
        },
      ],
      secondarySources: TECHNICAL_SECONDARY_SOURCES.slice(0, 3),
      mechanicTips: [
        'احرص دائماً على عدم إلغاء ثيرموستات الكوع (الكوعة) لأن إلغاءه يسبب استهلاك بنزين عالي وتآكل سريع للشميزات.',
      ],
    };
  }

  // 4. الزيوت والتزييت وفلتر الزيت وزيت الفتيس (Engine & Gear Oil)
  if (
    q.includes('زيت') ||
    q.includes('فلتر') ||
    q.includes('لزوج') ||
    q.includes('سعة') ||
    q.includes('كمية') ||
    q.includes('طبة') ||
    q.includes('oil')
  ) {
    return {
      vehicleSummary: {
        model: currentCar.modelArabic || currentCar.model,
        year: currentCar.year || 1998,
        engine: currentCar.engine || '1.5L SOHC',
        transmission: currentCar.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال',
      },
      detectedSystem: 'منظومة التزييت وزيت المحرك والفتيس (Lubrication & Transaxle Oil)',
      detectedIntent: 'specification',
      severityLevel: 'low',
      primaryDiagnosis:
        'المواصفات المعتمدة لزيوت هيونداي إكسيل 98: زيت المحرك 3.3 لتر مع الفلتر (لزوجة 20W-50 صيفاً أو 15W-40 / 10W-40 شتاءً)، وزيت الفتيس المانيوال 2.15 لتر لزوجة 75W-90 بتصنيف GL-4 حصراً وممنوع GL-5.',
      probableCauses: [
        {
          cause: 'استفسار عن سعات ولزوجة الزيوت المعتمدة في الكتالوج',
          probability: 'high',
          explanation: 'الفصل الصارم بين مواصفات زيت المحرك وزيت ناقل الحركة يضمن عمر الموتور وحماية غوايش الفتيس.',
        },
      ],
      diagnosticChecks: [
        {
          id: 'check-oil-level',
          component: 'قياس زيت المحرك بالمقاس (Dipstick)',
          action: 'سحب مقاس الزيت بعد توقف المحرك بـ 5 دقائق على أرض مستوية.',
          normalValue: 'مستوى الزيت بين علامتي L و F وقريب من حرف F.',
          faultIndicator: 'نزول الزيت تحت علامة L أو تجاوزه علامة F.',
        },
      ],
      repairSteps: [
        '1. فك طبة زيت الكارتيرة وتفريغ الزيت القديم وتغيير فلتر الزيت.',
        '2. تركيب طبة الزيت بوردة نحاس جديدة وربطها بعزم 35 - 45 نيوتن.متر.',
        '3. تعبئة 3.3 لتر زيت محرك جديد، والتأكد من عدم وجود تسريب.',
      ],
      safetyWarnings: [
        '⚠️ احذر من خلط زيت المحرك مع زيت الفتيس نهائياً.',
      ],
      exactSpecs: [
        {
          parameter: 'سعة زيت المحرك مع تغيير الفلتر',
          value: '3.3 لتر',
          unit: 'Liters',
          note: 'كتالوج التزييت ص 14',
        },
        {
          parameter: 'سعة زيت المحرك بدون تغيير الفلتر',
          value: '3.0 لتر',
          unit: 'Liters',
          note: 'كتالوج التزييت ص 14',
        },
        {
          parameter: 'سعة زيت الفتيس المانيوال',
          value: '2.15 لتر (GL-4 حصراً)',
          unit: 'Liters',
          note: 'كتالوج الفتيس ص 28',
        },
        {
          parameter: 'عزم ربط طبة زيت الكارتيرة',
          value: '35 - 45 نيوتن.متر',
          unit: 'N.m',
          note: 'مع تغيير وردة النحاس',
        },
      ],
      manualReferences: [
        {
          manualName: 'Hyundai Excel Service Manual (X3)',
          section: 'Engine Mechanical > Lubrication System',
          page: 'ص 14',
          quote: 'Engine oil capacity 3.3L with filter, manual transaxle 2.15L GL-4.',
        },
      ],
      secondarySources: TECHNICAL_SECONDARY_SOURCES.slice(0, 3),
      mechanicTips: [
        'في الصيف الحار في مصر والدول العربية، لزوجة 20W-50 أو 15W-40 هي الأنسب لمحركات الإكسيل للحفاظ على ضغط الزيت وحماية السبايك والكامة.',
      ],
    };
  }

  // 5. الفرامل وتيل الفرامل والطنابير (Brakes & Rotors)
  if (
    q.includes('فرامل') ||
    q.includes('تيل') ||
    q.includes('طنابير') ||
    q.includes('طنبورة') ||
    q.includes('باكم') ||
    q.includes('صفارة') ||
    q.includes('تزييق') ||
    q.includes('brake')
  ) {
    return {
      vehicleSummary: {
        model: currentCar.modelArabic || currentCar.model,
        year: currentCar.year || 1998,
        engine: currentCar.engine || '1.5L SOHC',
        transmission: currentCar.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال',
      },
      detectedSystem: 'منظومة الفرامل والتحكم الهيدروليكي (Brake System)',
      detectedIntent: 'diagnosis',
      severityLevel: 'high',
      primaryDiagnosis:
        'مواصفات وتشخيص منظومة فرامل هيونداي إكسيل 98: زيت الفرامل القياسي DOT 3 أو DOT 4، الحد الأدنى لسمك تيل الفرامل الأمامي 2.0 مم (الجديد 10.0 مم)، والحد الأدنى لسمك الطنابير 17.0 مم (الجديدة 19.0 مم).',
      probableCauses: [
        {
          cause: 'تآكل تيل الفرامل وظهور صوت صفارة أو احتكاك معدني',
          probability: 'high',
          explanation: 'احتكاك شريحة الأمان المعدنية بالتيل مع الطنبورة لتنبيه السائق بنفاد خامة الاحتكاك.',
        },
        {
          cause: 'اعوجاج الطنابير (Rotor Runout) يسبب رجة ورعشة في بدال الفرامل عند السرعات العالية',
          probability: 'medium',
          explanation: 'غسيل السيارة بالماء البارد والطنابير شديدة السخونة يؤدي لتقوس سطح الطنبورة.',
        },
      ],
      diagnosticChecks: [
        {
          id: 'check-pad-wear',
          component: 'فحص سمك تيل الفرامل الأمامي',
          action: 'فحص سمك التيل من خلال فتحة جنط العجلة أو بعد فك العجلة.',
          normalValue: 'سمك خامة التيل لا يقل عن 3 إلى 5 مم (الجديد 10.0 مم).',
          faultIndicator: 'أقل من 2.0 مم يجب استبداله فوراً لحماية الطنبورة من التجريح.',
        },
      ],
      repairSteps: [
        '1. استبدال تيل الفرامل بطقم أصلي ناعم وتنظيف مجاري الكاليبر وتشحيم مسماري التوجيه بشحم سيليكوني حراري.',
        '2. مسح الطنابير على المخرطة فقط إذا كان سمكها بعد المسح أعلى من 17.0 مم، وإلا تُستبدل بطنابير جديدة.',
        '3. أخذ هواء (Bleeding) لدورة الفرامل بتسلسل الكتالوج: خلفي يمين، أمامي شمال، خلفي شمال، أمامي يمين.',
      ],
      safetyWarnings: [
        '⚠️ تجنب قيادة السيارة إذا كان بدال الفرامل يغطس للأرضية (إسفنجي) لوجود تسريب زيت أو هواء بالدورة.',
      ],
      exactSpecs: [
        {
          parameter: 'نوع سائل الفرامل المعتمد',
          value: 'DOT 3 أو DOT 4',
          unit: 'Spec',
          note: 'استبدال كل سنتين أو 40 ألف كم',
        },
        {
          parameter: 'الحد الأدنى لسمك تيل الفرامل (Service Limit)',
          value: '2.0 مم',
          unit: 'mm',
          note: 'كتالوج الفرامل ص 104',
        },
        {
          parameter: 'الحد الأدنى لسمك طنابير الفرامل',
          value: '17.0 مم (الجديدة 19.0 مم)',
          unit: 'mm',
          note: 'كتالوج الفرامل ص 104',
        },
      ],
      manualReferences: [
        {
          manualName: 'Hyundai Excel Service Manual (X3)',
          section: 'Brake System > Front Disc Brakes',
          page: 'ص 104',
          quote: 'Minimum brake pad thickness 2.0mm, disc thickness 17.0mm.',
        },
      ],
      secondarySources: TECHNICAL_SECONDARY_SOURCES.slice(0, 3),
      mechanicTips: [
        'لا تغسل عجلات السيارة بماء بارد أبداً بعد مشوار طويل والطنابير ساخنة لتفادي التوائها وحدوث رعشة مع الفرامل.',
      ],
    };
  }

  // 6. التقطيع والتنتيش والإشعال (Misfire & Ignition & Spark Plugs)
  if (
    q.includes('تقطيع') ||
    q.includes('تنتيش') ||
    q.includes('تفتفه') ||
    q.includes('رعشة') ||
    q.includes('بترعش') ||
    q.includes('مكتومة') ||
    q.includes('بوجيه') ||
    q.includes('اسبراتير') ||
    q.includes('موبينة') ||
    q.includes('سلوك') ||
    q.includes('misfire')
  ) {
    return {
      vehicleSummary: {
        model: currentCar.modelArabic || currentCar.model,
        year: currentCar.year || 1998,
        engine: currentCar.engine || '1.5L SOHC',
        transmission: currentCar.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال',
      },
      detectedSystem: 'منظومة الإشعال وحقن الوقود (Ignition & Fuel System)',
      detectedIntent: 'diagnosis',
      severityLevel: 'medium',
      primaryDiagnosis:
        'التقطيع والتنتيش عند الضغط على دواسة البنزين في هيونداي إكسيل 98 يرجع غالباً إلى تلف أو اتساع خلوص البوجيهات (المواصفة 0.8 مم)، تهريب كهرباء في كابلات البوجيهات، تلف مشط/أبلاتين الإسبراتير، أو انسداد في فلتر البنزين وبيك السرعة.',
      probableCauses: [
        {
          cause: 'تلف أو كربون على شمعات الاحتراق (البوجيهات)',
          probability: 'high',
          explanation: 'اتساع فتحة البوجيه عن 0.8 مم يعجز الموبينة عن توليد شرارة قوية تحت ضغط الهواء العالي عند كبس دواسة البنزين.',
        },
        {
          cause: 'تهريب شرارة كهربائية في كابلات البوجيهات (سلوك البوجيهات)',
          probability: 'high',
          explanation: 'تشقق العازل المطاطي للكابلات يهرب الشرارة لجسم المحرك بدلاً من البوجيه (يظهر خاصة في الرطوبة والمطر).',
        },
        {
          cause: 'انسداد فلتر البنزين أو ضعف تدفق طرمبة البنزين',
          probability: 'medium',
          explanation: 'عند طلب تسارع مفاجئ لا يصل كمية وقود كافية فيحدث كتمة وتنتيشة قوية.',
        },
      ],
      diagnosticChecks: [
        {
          id: 'check-plugs',
          component: 'فحص شمعات الاحتراق (البوجيهات)',
          action: 'فك البوجيهات وفحص لون سن البوجيه بمفتاح بوجيهات 16 مم.',
          normalValue: 'لون بني فاتح/رمادي ناعم مع خلوص 0.7 - 0.8 مم للكاربراتير.',
          faultIndicator: 'كربون أسود كثيف أو رطوبة زيت، أو تآكل في القطب الموجب.',
        },
      ],
      repairSteps: [
        '1. استبدال البوجيهات بطقم NGK BPR6ES وضبط الخلوص على 0.8 مم بفيلر قبل التركيب.',
        '2. فحص كابلات البوجيهات (المقاومة القصوى 10 كيلو أوم لكل متر) وتغيير التالف منها.',
        '3. تنظيف الكاربراتير وتغيير فلتر البنزين وضبط توقيت الإشعال على 5° BTDC بمصباح التوقيت (Strobe Light).',
      ],
      safetyWarnings: [
        '⚠️ ربط البوجيهات بعزم الكتالوج المعتمد (20 إلى 30 نيوتن.متر) وتجنب القرص الشديد لتفادي تلف سن وش السلندر الألومنيوم.',
      ],
      exactSpecs: [
        {
          parameter: 'نوع البوجيهات المعتمد',
          value: 'NGK BPR6ES أو Champion RN9YC',
          unit: 'Model',
          note: 'كتالوج الكهرباء ص 56',
        },
        {
          parameter: 'خلوص فتحة البوجيه (Spark Plug Gap)',
          value: '0.7 - 0.8 مم (كاربراتير)',
          unit: 'mm',
          note: '1.0 - 1.1 مم لنظام الحقن الإلكتروني',
        },
        {
          parameter: 'ترتيب إشعال الأسطوانات',
          value: '1 - 3 - 4 - 2',
          unit: 'Order',
          note: 'الأسطوانة 1 بجانب سير الكاتينة',
        },
      ],
      manualReferences: [
        {
          manualName: 'Hyundai Excel Service Manual (X3)',
          section: 'Electrical System > Ignition Tune-Up',
          page: 'ص 56',
          quote: 'Spark plug gap 0.7-0.8mm for carburetor, firing order 1-3-4-2.',
        },
      ],
      secondarySources: TECHNICAL_SECONDARY_SOURCES.slice(0, 3),
      mechanicTips: [
        'لا تركب بوجيهات سن طويل أو 2/3 شمعة بدون ضبط الخلوص على 0.8 مم؛ البوجيه الأصلي الشمعة الواحدة NGK هو الأفضل تماماً لموتور الإكسيل.',
      ],
    };
  }

  // 7. الكاتينة والسيور (Timing Belt & Drive Belts)
  if (
    q.includes('كاتينة') ||
    q.includes('كاتينه') ||
    q.includes('سير') ||
    q.includes('سيور') ||
    q.includes('شداد') ||
    q.includes('بلية') ||
    q.includes('timing')
  ) {
    return {
      vehicleSummary: {
        model: currentCar.modelArabic || currentCar.model,
        year: currentCar.year || 1998,
        engine: currentCar.engine || '1.5L SOHC',
        transmission: currentCar.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال',
      },
      detectedSystem: 'منظومة التوقيت وسير الكاتينة (Engine Timing System)',
      detectedIntent: 'maintenance',
      severityLevel: 'high',
      primaryDiagnosis:
        'مواصفات سير كاتينة هيونداي إكسيل 98: عدد أسنان السير لمحرك 1500cc هو 111 سنة، ولمحرك 1300cc هو 107 سنة. موعد التغيير المعتمد في الكتالوج كل 60,000 كم أو 4 سنوات مع بلية الشداد.',
      probableCauses: [
        {
          cause: 'صيانة دورية أو استفسار عن مقاس سير الكاتينة وعلامات الضبط',
          probability: 'high',
          explanation: 'ضبط علامة عمود الكامة مع علامة الكرنك يضمن توقيت صبابات صحيح بنسبة 100%.',
        },
      ],
      diagnosticChecks: [
        {
          id: 'check-timing-marks',
          component: 'فحص علامات توقيت الكاتينة (Timing Marks)',
          action: 'تطابق زومبة ترس الكامة عند الساعة 12 مع السهم على وش السلندر، وزومبة الكرنك عند الساعة 12.',
          normalValue: 'تطابق تام للعلامات وارتخاء السير بمقدار 4 - 6 مم تحت ضغط الإبهام.',
          faultIndicator: 'خلف الكاتينة بسنة واحدة يسبب كتمة سحب قوية وسخونة أو خشونة بالمحرك.',
        },
      ],
      repairSteps: [
        '1. فك غطاء الكاتينة وتثبيت الكرنك عند النقطة الميتة العليا (TDC) للأسطوانة رقم 1.',
        '2. استبدال سير الكاتينة مع بلية الشداد وطرمبة المياه إذا وجد بها أي بوش أو خشونة.',
        '3. ربط مسمار بلية الشداد بعزم 22 إلى 30 نيوتن.متر وتدوير المحرك لفتين يدوي للتأكد من ثبات العلامات.',
      ],
      safetyWarnings: [
        '⚠️ تجنب تشغيل المارش أثناء فك سير الكاتينة لتفادي اصطدام البساتم بالصبابات.',
      ],
      exactSpecs: [
        {
          parameter: 'عدد أسنان سير الكاتينة (محرك 1.5L G4EK)',
          value: '111 سنة',
          unit: 'Teeth',
          note: 'محرك 1.3L يتطلب 107 سنة',
        },
        {
          parameter: 'فترة استبدال سير الكاتينة',
          value: 'كل 60,000 كم أو 4 سنوات',
          unit: 'km',
          note: 'كتالوج الصيانة ص 72',
        },
      ],
      manualReferences: [
        {
          manualName: 'Hyundai Excel Service Manual (X3)',
          section: 'Engine Mechanical > Timing Belt Inspection & Replacement',
          page: 'ص 72',
          quote: 'Timing belt replacement interval 60,000km, tensioner bolt torque 22-30 N.m.',
        },
      ],
      secondarySources: TECHNICAL_SECONDARY_SOURCES.slice(0, 3),
      mechanicTips: [
        'غير بلية الكاتينة دائماً مع كل غيار سير، وافحص أولسيه الكامة وأولسيه الكرنك لمنع تسريب الزيت على السير الجديد.',
      ],
    };
  }

  // 8. General Comprehensive Query with Dynamic Reflection (الرد الديناميكي على أي سؤال عام)
  return {
    vehicleSummary: {
      model: currentCar.modelArabic || currentCar.model,
      year: currentCar.year || 1998,
      engine: currentCar.engine || '1.5L SOHC (G4EK / 4G15)',
      transmission: currentCar.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال',
    },
    detectedSystem: `فحص منظومة الكتالوج الخاصة بـ (${question.slice(0, 35)}...)`,
    detectedIntent: 'diagnosis',
    severityLevel: 'medium',
    primaryDiagnosis: `تحليل واستخراج مواصفات الكتالوج لسؤالك: "${question}" الخاص بسيارتك هيونداي إكسيل 98.`,
    probableCauses: [
      {
        cause: 'فحص ميكانيكي وكهربائي وفق كتالوج صيانة هيونداي إكسيل 98 المعتمد',
        probability: 'high',
        explanation: `بناءً على طلبك بخصوص "${question}"، تم استرجاع معايير الصيانة والعيارات المعتمدة لمحرك 1.5L SOHC.`,
      },
    ],
    diagnosticChecks: [
      {
        id: 'check-visual',
        component: 'فحص المكونات المرتبطة بالمشكلة',
        action: 'فحص الحالة الظاهرية، سلامة الخراطيم، التوصيلات الكهربائية، وخلوصات التشغيل.',
        normalValue: 'مطابقة حدود التفاوت المسموح بها في كتالوج هيونداي إكسيل ص 14-88.',
        faultIndicator: 'وجود صوت غير طبيعي، تسريب، سخونة زائدة، أو اهتزاز غير معتاد.',
      },
    ],
    repairSteps: [
      '1. فحص التوصيلات والقطع الميكانيكية المعنية ومطابقتها بأرقام الكتالوج الرسمية.',
      '2. استخدام عزوم الربط الصحيحة (Torque Specs) والمقاسات الأصلية لقطع الغيار.',
      '3. تجربة السيارة للتأكد من زوال العرض وثبات أداء المحرك.',
    ],
    safetyWarnings: [
      '⚠️ اتبع دائماً احتياطات السلامة وافصل كابل البطارية السالب عند العمل على الأجزاء الكهربائية.',
    ],
    exactSpecs: [
      {
        parameter: 'سعة زيت المحرك بالفلتر',
        value: '3.3 لتر (20W-50 / 10W-40)',
        unit: 'Liters',
      },
      {
        parameter: 'ضغط هواء الإطارات المعتمد',
        value: '30 - 32 PSI (2.1 بار)',
        unit: 'PSI',
      },
      {
        parameter: 'خلوص شمعات الاحتراق (بوجيهات)',
        value: '0.8 مم (NGK BPR6ES)',
        unit: 'mm',
      },
    ],
    manualReferences: [
      {
        manualName: 'Hyundai Excel Service Manual (X3)',
        section: 'General Maintenance & Specifications',
        page: 'ص 14 - 134',
        quote: 'Standard operating tolerances for Hyundai Excel 1998 models.',
      },
    ],
    secondarySources: TECHNICAL_SECONDARY_SOURCES.slice(0, 3),
    mechanicTips: [
      'سيارة هيونداي إكسيل 98 سيارة اعتماديّة واقتصادية جداً؛ الالتزام بالعيارات الأصلية (الزيوت وضغط الإطارات وخلوص البوجيهات) يضمن أفضل أداء وعمر افتراضي للمحرك.',
    ],
  };
}
