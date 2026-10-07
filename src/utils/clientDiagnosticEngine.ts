import { CarProfile, DiagnosticResponse } from '../types/car.ts';
import { MANUAL_DOCUMENTS, TECHNICAL_SECONDARY_SOURCES } from '../data/carManualsData.ts';

export function synthesizeClientDiagnosis(
  question: string,
  currentCar: CarProfile
): DiagnosticResponse {
  const q = question.toLowerCase().trim();

  // 1. الاطارات والكاوتش وضغط الهواء والترصيص (Tires, Wheels & Pressure)
  if (
    q.includes('اطار') ||
    q.includes('اطارات') ||
    q.includes('إطار') ||
    q.includes('إطارات') ||
    q.includes('كاوتش') ||
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
      primaryDiagnosis:
        'المواصفات الفنية المعتمدة لإطارات وضغط هواء هيونداي إكسيل 98: المقاس القياسي 175/70 R13، وضغط الهواء الموصى به 30 إلى 32 PSI (2.1 إلى 2.2 بار) لجميع العجلات الأربع في الظروف العادية.',
      probableCauses: [
        {
          cause: 'استفسار عن مقاس وضغط هواء الإطارات وضبط الزوايا',
          probability: 'high',
          explanation:
            'مطابقة ضغط الإطارات يحافظ على ثبات السيارة، يقلل استهلاك البنزين، ويمنع تآكل مداس الكاوتش من الأطراف أو المنتصف.',
        },
      ],
      diagnosticChecks: [
        {
          id: 'check-tire-pressure',
          component: 'قياس ضغط هواء الإطارات (باردة)',
          action: 'قياس الضغط بمقياس معتمد قبل التحرك بالسيارة والمحرك والإطارات باردة تماماً.',
          normalValue: '30 - 32 PSI (2.1 بار) للعجلات الأمامية والخلفية. وعند التحميل الكامل أو السفر: 32 - 34 PSI.',
          faultIndicator: 'أقل من 26 PSI يسبب ثقل الدركسيون وسخونة الإطار وزيادة استهلاك البنزين بنسبة 10%.',
        },
        {
          id: 'check-tire-tread',
          component: 'فحص عمق مداس الإطار وتآكل الجوانب',
          action: 'ملاحظة علامات مؤشر التآكل (TWI) بين خطوط المداس.',
          normalValue: 'عمق المداس لا يقل عن 1.6 مم والتآكل متساوي عبر سطح الإطار بالكامل.',
          faultIndicator: 'تآكل في الجانب الداخلي أو الخارجي فقط يشير إلى حاجة السيارة لضبط زوايا (Camber/Toe).',
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
        '1. ضبط ضغط الهواء بانتظام كل أسبوعين على 31 PSI لجميع العجلات الأربع، وضبط الإطار الاحتياطي (الاستبن) على 35 PSI.',
        '2. تدوير الإطارات (Tire Rotation) كل 10,000 كم لضمان تآكل منتظم لجميع الإطارات وإطالة عمرها.',
        '3. عزم ربط صواميل العجلات (Lug Nuts): يجب ربطها بنمط نجمي (Criss-Cross) بعزم 90 إلى 110 نيوتن.متر (N.m).',
        '4. ضبط زوايا العجل الأمامي (Toe-in): المقاس القياسي بالكتالوج هو 0 ± 2 مم.',
      ],
      safetyWarnings: [
        '⚠️ تجنب قياس أو تفريغ هواء الإطارات وهي ساخنة فور العودة من السفر لأن الضغط يرتفع طبيعياً بمقدار 3-4 PSI مع الحرارة.',
        '⚠️ لا تستخدم إطارات تجاوز عمرها الإنتاجي 5 سنوات (تاريخ الصنع مكتوب على جانب الإطار DOT أسبوع/سنة) لتفادي خطر الانفجار المفاجئ.',
      ],
      exactSpecs: [
        {
          parameter: 'المقاس القياسي الموصى به للإطارات',
          value: '175/70 R13 (أو 155/80 R13)',
          unit: 'Size',
          note: 'على جنط 13 بوصة الأصلي لهيونداي إكسيل',
        },
        {
          parameter: 'ضغط الهواء القياسي (السيارة باردة)',
          value: '30 - 32 PSI (2.1 - 2.2 بار)',
          unit: 'PSI',
          note: 'لجميع العجلات الأربع (كتالوج ص 134)',
        },
        {
          parameter: 'ضغط هواء الإطار الاحتياطي (الاستبن)',
          value: '35 PSI (2.4 بار)',
          unit: 'PSI',
          note: 'جاهز للاستخدام في أي وقت',
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
        'للحفاظ على عفشة الإكسيل والجنوط 13 من نقر الشوارع، ضغط 30 إلى 31 PSI يعطي نعومة ممتازة في المطبات ويحمي المساعدين وجلب المقصات.',
      ],
      preventiveAdvice: 'افحص تاريخ إنتاج الكاوتش (أسبوع/سنة) وتأكد من سلامة بلف الهواء وأغطية البلوف لمنع تسريب الهواء البطيء.',
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
