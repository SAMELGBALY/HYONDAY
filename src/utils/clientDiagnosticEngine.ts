import { CarProfile, DiagnosticResponse } from '../types/car';
import { MANUAL_DOCUMENTS, TECHNICAL_SECONDARY_SOURCES } from '../data/carManualsData';

export function synthesizeClientDiagnosis(
  question: string,
  currentCar: CarProfile
): DiagnosticResponse {
  const q = question.toLowerCase();

  // 1. Hot Start / Hard warm starting (مشكلة الدوارة وهي سخنة)
  if (
    q.includes('ادور') ||
    q.includes('دوار') ||
    q.includes('تدور') ||
    q.includes('مارش') ||
    q.includes('افصلها') ||
    q.includes('سخنة') ||
    q.includes('سخنه') ||
    q.includes('start')
  ) {
    return {
      vehicleSummary: {
        model: currentCar.modelArabic || currentCar.model,
        year: currentCar.year || 1998,
        engine: currentCar.engine || '1.5L SOHC (G4EK)',
        transmission: currentCar.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال',
      },
      detectedSystem: 'منظومة الوقود والإشعال (Fuel & Ignition)',
      detectedIntent: 'diagnosis',
      severityLevel: 'medium',
      primaryDiagnosis:
        'صعوبة تشغيل المحرك وهو ساخن (Hot Start Hard Starting) ترجع غالباً إلى تسييل بنزين الكاربراتير (Flooding) أو ظاهرة التبخر (Vapor Lock)، أو تأثر موبينة/مشط الإسبراتير بحرارة حوض المحرك.',
      probableCauses: [
        {
          cause: 'تسييل إبرة الكاربراتير (Carburetor Needle Valve Leaking)',
          probability: 'high',
          explanation:
            'بعد إطفاء المحرك الساخن، يستمر ضغط الخط في تسريب قطرات بنزين من إبرة العوامة داخل مجمع السحب، مما يؤدي لـ "شرق" المحرك وخنق غرف الاحتراق بالبنزين الزائد.',
        },
        {
          cause: 'تأثر ملف الإشعال أو مشط الإسبراتير بالحرارة (Ignition Coil / Module Heat Soak)',
          probability: 'high',
          explanation:
            'ارتفاع حرارة الموبينة أو المشط الإلكتروني داخل الإسبراتير يرفع المقاومة الكهربائية ويضعف الشرارة الكهربائية أثناء محاولة الدوارة فور إطفاء المحرك.',
        },
        {
          cause: 'ظاهرة الجيوب البخارية (Vapor Lock) في خراطيم البنزين',
          probability: 'medium',
          explanation:
            'حرارة حوض المحرك وفرن الشكمان تؤدي لغليان البنزين داخل خراطيم السحب وتحوله لبخار يعجز طرمبة البنزين الميكانيكية عن سحبه وضخه فوراً.',
        },
      ],
      diagnosticChecks: [
        {
          id: 'check-flood',
          component: 'اختبار شرق الكاربراتير بالدواسة',
          action:
            'عند تأخر الدوارة، اضغط دواسة البنزين للأسفل تماماً وثبت قدمك أثناء تشغيل المارش لمدة 5 ثوانٍ.',
          normalValue: 'إذا دار المحرك أسرع مع خروج دخان خفيف، فهذا تأكيد قاطع على وجود تسييل بنزين من الإبرة (شرق).',
          faultIndicator: 'عدم الاستجابة أو الدوران بصعوبة بالغة.',
        },
        {
          id: 'check-spark',
          component: 'فحص قوة شرارة الموبينة والإسبراتير',
          action:
            'انزع كابل بوجيه وقربه 1 سم من شاسيه المحرك أثناء تدوير المارش والمحرك ساخن.',
          normalValue: 'شرارة زرقاء ناصعة وقوية تسمع صوت فرقعتها.',
          faultIndicator: 'شرارة صفراء ضعيفة جداً أو متقطعة تشير لتلف الموبينة أو المشط مع السخونة.',
        },
        {
          id: 'check-fuel-line',
          component: 'فحص خط راجع البنزين وفلتر البنزين',
          action: 'التأكد من أن خرطوم راجع التانك غير مسدود ولا توجد كتمة في الفلتر.',
          normalValue: 'تدفق سلس للبنزين الراجع لتخفيف الضغط وحرارة الكاربراتير.',
          faultIndicator: 'ضغط زائد في خط التغذية يرفع العوامة ويسرب البنزين.',
        },
      ],
      repairSteps: [
        '1. فك غطاء الكاربراتير وفحص إبرة العوامة واستبدالها مع ضبط خلوص العوامة لمنع التسييل بعد الإطفاء.',
        '2. عزل خراطيم البنزين القريبة من فرن الشكمان أو كتلة المحرك بعازل حراري لمنع ظاهرة التبخر (Vapor Lock).',
        '3. فحص ومراجعة المقاومة الكهربائية للموبينة ومشط الإسبراتير وتغيير معجون التبريد الحراري (Thermal Paste) أسفل المشط.',
        '4. تغيير فلتر البنزين والتأكد من فتح خط راجع الوقود للتنك.',
      ],
      safetyWarnings: [
        '⚠️ احذر من استخدام لهب مكشوف أو التدخين أثناء فحص خراطيم أو غطاء الكاربراتير.',
        '⚠️ لا تفرط في إطالة زمن المارش لأكثر من 10 ثوانٍ متصلة لتجنب احتراق ملفات المارش أو تفريغ البطارية.',
      ],
      exactSpecs: [
        {
          parameter: 'خلوص شمعات الاحتراق (بوجيهات الكاربراتير)',
          value: '0.7 - 0.8 مم',
          unit: 'mm',
          note: 'NGK BPR6ES أو Champion RN9YC',
        },
        {
          parameter: 'مقاومة ملف الإشعال الابتدائي (Primary Coil)',
          value: '0.7 - 0.9 أوم',
          unit: 'Ω',
          note: 'عند 20°C (كتالوج الكهرباء ص 56)',
        },
        {
          parameter: 'مقاومة ملف الإشعال الثانوي (Secondary Coil)',
          value: '10.0 - 14.5 كيلو أوم',
          unit: 'kΩ',
          note: 'كتالوج الكهرباء ص 56',
        },
      ],
      manualReferences: [
        {
          manualName: 'Hyundai Excel Service Manual (X3)',
          section: 'Fuel System > Carburetor & Fuel Pump',
          page: 'ص 88',
          quote: 'Hard starting when engine is hot due to carburetor flooding or fuel vapor lock.',
        },
        {
          manualName: 'Hyundai Excel Service Manual (X3)',
          section: 'Electrical System > Ignition System',
          page: 'ص 56',
          quote: 'Ignition coil resistance and distributor air gap inspection.',
        },
      ],
      secondarySources: TECHNICAL_SECONDARY_SOURCES.slice(0, 3),
      mechanicTips: [
        'في محركات هيونداي إكسيل الكاربراتير، الحل السحري لتشغيل المحرك وهو ساخن ومشرق هو الضغط على دواسة البنزين لآخرها أثناء تشغيل المارش لفتح الخانق وإدخال أقصى كمية هواء لتجفيف البنزين المسيل.',
        'احرص على ألا تلمس خراطيم البنزين أي أجزاء ساخنة من جسم المحرك أو مواسير الشكمان.',
      ],
      preventiveAdvice: 'تنظيف الكاربراتير وتغيير طقم الجوانات والإبرة كل سنة يضمن دوارة سريعة في أقل من ثانية صيفاً وشتاءً.',
    };
  }

  // 2. Overheating in Traffic (سخونة في الزحمة)
  if (q.includes('سخن') || q.includes('حرار') || q.includes('مروح') || q.includes('ردياتير')) {
    const coolDoc = MANUAL_DOCUMENTS.find((d) => d.system === 'cooling') || MANUAL_DOCUMENTS[2];
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
        'ارتفاع حرارة المحرك في الزحمة والتوقف ينتج غالباً عن تعطل مروحة الردياتير الكهربائية، سدد داخلي في مواسير الردياتير، أو تلف سوستة غطاء الردياتير.',
      probableCauses: [
        {
          cause: 'تعطل مروحة التبريد أو ثيرموستات المروحة السفلي',
          probability: 'high',
          explanation: 'في التوقف ينعدم تيار الهواء الخارجي، وتعتمد السيارة كلياً على مروحة الردياتير لسحب الهواء.',
        },
        {
          cause: 'سدد في شرايين الردياتير بسبب استخدام مياه الصنبور العادية',
          probability: 'high',
          explanation: 'ترسب الأملاح يضيق مجاري الماء فلا يستوعب التبريد في السرعات البطيئة.',
        },
        {
          cause: 'تلف غطاء الردياتير (سوستة الضغط)',
          probability: 'medium',
          explanation: 'فقدان ضغط الردياتير (0.9 بار) يجعل الماء يغلي مبكراً عند 100°C بدلاً من 120°C.',
        },
      ],
      diagnosticChecks: [
        {
          id: 'check-fan',
          component: 'فحص مروحة الردياتير',
          action: 'عمل قفلة بسلك على فيشة ثيرموستات المروحة أسفل الردياتير.',
          normalValue: 'دوران المروحة فوراً بأقصى سرعة.',
          faultIndicator: 'عدم دوران المروحة (تلف الفيوز 30A أو احتراق موتور المروحة).',
        },
        {
          id: 'check-cap',
          component: 'فحص غطاء الردياتير والقربة',
          action: 'التأكد من عدم وجود فوران ماء للقربة عند تسخين المحرك.',
          normalValue: 'ثبات مستوى الماء في القربة ضمن نطاق MIN و MAX.',
          faultIndicator: 'فوران ماء وخروجه من فايظ القربة.',
        },
      ],
      repairSteps: [
        '1. فحص وتغيير ثيرموستات المروحة السفلي (يفتح عند 91°C إلى 95°C).',
        '2. تسييخ الردياتير أو تغييره بردياتير جديد وتعبئة سائل تبريد أصلي 50/50 مع ماء مقطر.',
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
          section: coolDoc.chapter,
          page: `ص ${coolDoc.page}`,
          quote: coolDoc.title,
        },
      ],
      secondarySources: TECHNICAL_SECONDARY_SOURCES.slice(0, 3),
      mechanicTips: [
        'احرص دائماً على عدم إلغاء ثيرموستات الكوع (الكوعة) لأن إلغاءه يسبب استهلاك بنزين عالي وتآكل سريع للشميزات.',
      ],
    };
  }

  // 3. Engine Oil Capacity & Specs (سعة ولزوجة الزيت)
  if (q.includes('زيت') || q.includes('فلتر') || q.includes('لزوج') || q.includes('سعة') || q.includes('كمية')) {
    const oilDoc = MANUAL_DOCUMENTS[0];
    return {
      vehicleSummary: {
        model: currentCar.modelArabic || currentCar.model,
        year: currentCar.year || 1998,
        engine: currentCar.engine || '1.5L SOHC',
        transmission: currentCar.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال',
      },
      detectedSystem: 'منظومة التزييت وزيت المحرك (Engine Lubrication)',
      detectedIntent: 'specification',
      severityLevel: 'low',
      primaryDiagnosis:
        'مواصفات وسعة زيت محرك هيونداي إكسيل 98 المعتمدة في الكتالوج: 3.3 لتر مع تغيير الفلتر، بلزوجة 20W-50 في الصيف أو 15W-40 / 10W-40 في الشتاء والطقس المعتدل.',
      probableCauses: [
        {
          cause: 'استفسار مواصفات صيانة دورية معتمدة',
          probability: 'high',
          explanation: 'مطابقة سعة ولزوجة زيت المحرك وعزم ربط طبة الكارتيرة وفق كتالوج المصنع.',
        },
      ],
      diagnosticChecks: [
        {
          id: 'check-dipstick',
          component: 'فحص مقاس الزيت (Dipstick)',
          action: 'سحب مقاس الزيت بعد توقف المحرك بـ 5 دقائق على أرض مستوية.',
          normalValue: 'مستوى الزيت بين علامتي L و F وقريب من حرف F.',
          faultIndicator: 'نزول الزيت تحت علامة L أو تجاوزه علامة F.',
        },
      ],
      repairSteps: [
        '1. فك طبة زيت الكارتيرة وتفريغ الزيت القديم في وعاء وهو دافئ.',
        '2. استبدال فلتر الزيت ودهن جوان الفلتر الجديد بنقطة زيت خفيفة.',
        '3. تركيب طبة الزيت بوردة نحاس جديدة وربطها بعزم 35 - 45 نيوتن.متر.',
        '4. تعبئة 3.3 لتر من الزيت الجديد والتأكد من عدم وجود تسريب.',
      ],
      safetyWarnings: [
        '⚠️ احذر من لمس الزيت الساخن أثناء تفريغه.',
        '⚠️ ممنوع نهائياً خلط زيت المحرك مع زيت الفتيس.',
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
          parameter: 'عزم ربط طبة زيت الكارتيرة',
          value: '35 - 45 نيوتن.متر',
          unit: 'N.m',
          note: 'مع تغيير وردة النحاس',
        },
        {
          parameter: 'سعة زيت الفتيس المانيوال',
          value: '2.15 لتر (GL-4 حصراً)',
          unit: 'Liters',
          note: 'كتالوج الفتيس ص 28',
        },
      ],
      manualReferences: [
        {
          manualName: 'Hyundai Excel Service Manual (X3)',
          section: oilDoc.chapter,
          page: `ص ${oilDoc.page}`,
          quote: oilDoc.title,
        },
      ],
      secondarySources: TECHNICAL_SECONDARY_SOURCES.slice(0, 3),
      mechanicTips: [
        'في الأجواء الحارة والصيفية في مصر والدول العربية، لزوجة 20W-50 أو 15W-40 هي الأنسب لمحركات الإكسيل للحفاظ على ضغط الزيت وحماية عمود الكامة والسبايك.',
      ],
    };
  }

  // General fallback
  const firstDoc = MANUAL_DOCUMENTS[0];
  return {
    vehicleSummary: {
      model: currentCar.modelArabic || currentCar.model,
      year: currentCar.year || 1998,
      engine: currentCar.engine || '1.5L SOHC',
      transmission: currentCar.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال',
    },
    detectedSystem: 'الفحص الميكانيكي العام لهيونداي إكسيل 98',
    detectedIntent: 'diagnosis',
    severityLevel: 'medium',
    primaryDiagnosis: `تشخيص فني معتمد مستخرج من كتالوج صيانة هيونداي إكسيل 98 (${firstDoc.vehicleModel}).`,
    probableCauses: [
      {
        cause: 'فحص المنظومات الكهربائية وتغذية الوقود والاشتعال',
        probability: 'high',
        explanation: 'التحقق من سلامة البوجيهات (خلوص 0.8 مم)، ضبط الإسبراتير، وفلتر البنزين.',
      },
    ],
    diagnosticChecks: [
      {
        id: 'check-general',
        component: 'فحص دورة الإشعال والوقود',
        action: 'فحص البوجيهات والكابلات وضغط طرمبة البنزين.',
        normalValue: 'شرارة زرقاء وضغط بنزين سليم وخلوص بوجيهات 0.8 مم.',
        faultIndicator: 'تقطيع أو تأخر في الدوارة أو دخان أسود.',
      },
    ],
    repairSteps: [
      'اتباع خطوات الفحص والصيانة المحددة في كتالوج الصيانة الرسمي.',
    ],
    safetyWarnings: ['احرص دائماً على تطبيق احتياطات السلامة وارتداء قفازات العمل.'],
    exactSpecs: [
      {
        parameter: 'خلوص شمعات الاحتراق (كاربراتير)',
        value: '0.7 - 0.8 مم',
        unit: 'mm',
      },
      {
        parameter: 'سعة زيت المحرك بالفلتر',
        value: '3.3 لتر',
        unit: 'Liters',
      },
    ],
    manualReferences: [
      {
        manualName: 'Hyundai Excel Service Manual (X3)',
        section: firstDoc.chapter,
        page: `ص ${firstDoc.page}`,
        quote: firstDoc.title,
      },
    ],
    secondarySources: TECHNICAL_SECONDARY_SOURCES.slice(0, 3),
    mechanicTips: [
      'محرك هيونداي إكسيل 98 محرك بسيط واعتمادي جداً عند الحفاظ على نظافة دورة التبريد وضبط الكاربراتير والإسبراتير بدقة.',
    ],
  };
}
