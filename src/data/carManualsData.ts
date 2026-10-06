import { CarProfile, OBDCodeInfo, CarSpecificationCategory } from '../types/car';

export interface PreloadedManualDoc {
  id: string;
  vehicleModel: string;
  system: string;
  chapter: string;
  page: number;
  title: string;
  content: string;
  tags: string[];
}

export const PRESET_CAR_PROFILES: CarProfile[] = [
  {
    id: 'hyundai-excel-1.5-carb-98',
    brand: 'Hyundai',
    model: 'Excel 1998 (1.5L Carburetor)',
    modelArabic: 'هيونداي إكسيل 98 (1500 كاربراتير مانيوال)',
    year: 1998,
    engine: '1.5L SOHC (G4EK / 4G15)',
    transmission: 'manual',
    fuelSystem: 'carburetor',
    mileageKm: 215000,
  },
  {
    id: 'hyundai-excel-1.3-carb-98',
    brand: 'Hyundai',
    model: 'Excel 1998 (1.3L Carburetor)',
    modelArabic: 'هيونداي إكسيل 98 (1300 كاربراتير مانيوال)',
    year: 1998,
    engine: '1.3L SOHC (G4EH)',
    transmission: 'manual',
    fuelSystem: 'carburetor',
    mileageKm: 220000,
  },
  {
    id: 'hyundai-excel-1.5-inj-98',
    brand: 'Hyundai',
    model: 'Excel 1998 (1.5L Injection)',
    modelArabic: 'هيونداي إكسيل 98 (1500 إنجكشن / حقن)',
    year: 1998,
    engine: '1.5L SOHC MPFI (G4EK)',
    transmission: 'manual',
    fuelSystem: 'mpfi',
    mileageKm: 190000,
  },
  {
    id: 'hyundai-excel-1.5-auto-98',
    brand: 'Hyundai',
    model: 'Excel 1998 (1.5L Automatic)',
    modelArabic: 'هيونداي إكسيل 98 (1500 فتيس أوتوماتيك)',
    year: 1998,
    engine: '1.5L SOHC (G4EK)',
    transmission: 'automatic',
    fuelSystem: 'carburetor',
    mileageKm: 205000,
  },
  {
    id: 'hyundai-accent-1.3-98',
    brand: 'Hyundai',
    model: 'Accent (X3)',
    modelArabic: 'هيونداي إكسنت 98 (الشكل القديم)',
    year: 1998,
    engine: '1.3L / 1.5L SOHC',
    transmission: 'manual',
    fuelSystem: 'mpfi',
    mileageKm: 185000,
  },
  {
    id: 'hyundai-verna-1.6',
    brand: 'Hyundai',
    model: 'Verna / Accent LC',
    modelArabic: 'هيونداي فيرنا',
    year: 2008,
    engine: '1.6L DOHC 16V (Alpha II - G4ED)',
    transmission: 'manual',
    fuelSystem: 'mpfi',
    mileageKm: 160000,
  },
  {
    id: 'hyundai-elantra-1.6',
    brand: 'Hyundai',
    model: 'Elantra HD',
    modelArabic: 'هيونداي إلنترا HD',
    year: 2010,
    engine: '1.6L DOHC CVVT (Gamma - G4FC)',
    transmission: 'automatic',
    fuelSystem: 'mpfi',
    mileageKm: 140000,
  },
  {
    id: 'hyundai-tucson-2.0',
    brand: 'Hyundai',
    model: 'Tucson (JM)',
    modelArabic: 'هيونداي توسان',
    year: 2009,
    engine: '2.0L DOHC 16V (Beta II - G4GC)',
    transmission: 'automatic',
    fuelSystem: 'mpfi',
    mileageKm: 175000,
  },
];

export const MANUAL_DOCUMENTS: PreloadedManualDoc[] = [
  // 1. ENGINE MECHANICAL & LUBRICATION (EXCEL / ACCENT / VERNA)
  {
    id: 'doc-lub-01',
    vehicleModel: 'Hyundai Excel / Accent',
    system: 'engine_oil',
    chapter: 'Engine Mechanical System > Lubrication System',
    page: 14,
    title: 'Engine Oil Capacity & Inspection Procedure',
    content: `SPECIFICATION: Engine Oil Capacity:
- With oil filter replacement: 3.3 Liters (3.5 US qts)
- Without oil filter replacement: 3.0 Liters (3.2 US qts)
- Dry engine overhaul: 3.7 Liters (3.9 US qts)
RECOMMENDED VISCOSITY:
- SAE 10W-30, SAE 10W-40, SAE 15W-40, or SAE 20W-50 (for ambient temperatures above 0°C up to +50°C, API SG, SH, SJ or higher).
OIL DRAIN PLUG TIGHTENING TORQUE:
- Drain plug torque: 35 - 45 N.m (3.5 - 4.5 kgf.m, 25 - 33 lbf.ft). Replace crush washer gasket on every oil drain.
OIL FILTER TIGHTENING TORQUE:
- 12 - 16 N.m (1.2 - 1.6 kgf.m, 9 - 12 lbf.ft) or hand tighten 3/4 turn after rubber O-ring seats.
PROCEDURE:
1. Warm engine to normal operating temperature.
2. Remove oil filler cap on rocker arm valve cover.
3. Place container under oil pan, remove drain plug and drain oil into pan.
WARNING: Engine oil may be hot. Be careful not to burn yourself.
4. Replace drain plug with new gasket and tighten to specified torque.
5. Refill engine with fresh oil through filler cap up to MAX (F) mark on dipstick. Do not overfill.
6. Run engine at idle for 3 minutes, check for leaks around filter and drain plug, then re-check dipstick after stopping engine for 5 minutes.`,
    tags: ['oil', 'capacity', 'viscosity', 'filter', 'torque', 'drain', 'زيت', 'محرك', 'سعة', 'لزوجة'],
  },

  // 2. TRANSAXLE & GEAR OIL (MANUAL & AUTOMATIC)
  {
    id: 'doc-trans-01',
    vehicleModel: 'Hyundai Excel / Accent / Verna',
    system: 'transmission_oil',
    chapter: 'Manual Transaxle (M5AF3 / M5BF2) > Lubrication',
    page: 28,
    title: 'Manual Transaxle Fluid Capacity & Specifications',
    content: `MANUAL TRANSAXLE OIL SPECIFICATION:
- Capacity: 2.15 Liters (2.27 US qts)
- Recommended Oil Type: Hypoid Gear Oil API GL-4, SAE 75W-90 or 80W-90.
- CAUTION: Do NOT use API GL-5 oil with active sulfur additives that can corrode brass synchronizer rings.
- Filler & Drain Plug Tightening Torque: 30 - 35 N.m (3.0 - 3.5 kgf.m).
AUTOMATIC TRANSAXLE (KM175 / A4AF3):
- Total dry capacity: 5.4 - 6.1 Liters. Drain and refill capacity: 2.5 Liters.
- Fluid Type: Genuine Hyundai ATF SP-III or Diamond ATF SP-III. Do NOT use standard Dexron II/III as it causes clutch chatter and harsh 1-2 shift overlap.
INSPECTION:
Check oil level at filler plug hole. Fluid should be within 0-5 mm below lower edge of filler hole.`,
    tags: ['transaxle', 'gearbox', 'transmission', 'gl-4', 'sp-iii', 'زيت فتيس', 'جير', 'مانيوال', 'اتوماتيك'],
  },

  // 3. COOLING SYSTEM & OVERHEATING DIAGNOSIS
  {
    id: 'doc-cool-01',
    vehicleModel: 'Hyundai Excel / Accent / Verna',
    system: 'cooling',
    chapter: 'Engine Cooling System > Inspection & Diagnosis',
    page: 42,
    title: 'Cooling System Specifications & Overheating in Traffic Diagnosis',
    content: `COOLING SYSTEM SPECIFICATIONS:
- Coolant capacity: 5.5 Liters (including expansion reservoir tank).
- Coolant mixture: 50% High-grade ethylene glycol anti-freeze + 50% demineralized/distilled water.
- Radiator cap opening pressure: 0.93 - 1.23 bar (13.5 - 17.8 psi, 93 - 123 kPa).
- Thermostat valve opening temperature: 82°C (180°F) ± 1.5°C. Full open temperature: 95°C (203°F). Valve lift: 8.0 mm or more.
- Radiator cooling fan thermo-switch (Thermo-sensor on lower radiator tank or controlled by ECM):
  * Fan ON temperature: 91°C - 95°C.
  * Fan OFF temperature: 86°C - 90°C.
DIAGNOSIS: OVERHEATING AT IDLE / IN TRAFFIC (سخونة في الزحمة والتوقف):
Symptom: Engine temperature climbs to red zone when idling or moving slowly in heavy traffic, but drops when driving at highway speeds (60-90 km/h).
FACTORY DIAGNOSTIC TREE:
1. CHECK RADIATOR COOLING FAN OPERATION:
   - Does fan spin when temperature passes middle gauge?
   - Disconnect thermo-sensor connector: bridge terminals with wire. If fan runs, replace radiator thermo-switch.
   - If fan doesn't run, check 20A/30A COOLING FAN FUSE in engine compartment fuse box, and FAN RELAY.
   - Apply direct 12V battery power to cooling fan motor connector. If motor does not spin, internal carbon brushes or motor winding is burnt.
2. CHECK RADIATOR FINS CLOGGING:
   - External dust/mud/leaves between A/C condenser and radiator block airflow at low car speeds.
3. CHECK THERMOSTAT:
   - If upper radiator hose is boiling hot but lower radiator hose stays cold, thermostat is stuck closed. Replace thermostat.
4. CHECK RADIATOR CAP:
   - Weak pressure spring lets coolant boil at 100°C instead of pressurized 120°C, causing overflow into expansion tank and air pockets.
5. WATER PUMP IMPELLER:
   - Corroded or slipping impeller fins cannot circulate water sufficiently at low engine idle RPM (750-800 rpm).`,
    tags: ['cooling', 'overheating', 'fan', 'thermostat', 'radiator', 'حرارة', 'سخونة', 'مروحة', 'ردياتير', 'ثرموستات'],
  },

  // 4. IGNITION SYSTEM & SPARK PLUGS
  {
    id: 'doc-ign-01',
    vehicleModel: 'Hyundai Excel / Accent / Verna',
    system: 'ignition',
    chapter: 'Engine Electrical System > Ignition',
    page: 56,
    title: 'Ignition Timing, Spark Plug Specifications & Misfire Diagnosis',
    content: `IGNITION SPECIFICATIONS:
- Firing order: 1 - 3 - 4 - 2 (Cylinder 1 is nearest to timing belt).
- Spark plug type:
  * Champion: RN9YC or RN9YCC
  * NGK: BPR6ES-11 (for 1.1mm gap) or BPR6ES (for 0.8mm)
- Spark plug gap:
  * Carburetor / early models: 0.7 - 0.8 mm (0.028 - 0.031 in).
  * Electronic injection (MPFI) with high-energy coil: 1.0 - 1.1 mm (0.039 - 0.043 in).
- Spark plug tightening torque: 20 - 30 N.m (2.0 - 3.0 kgf.m, 15 - 22 lbf.ft).
- High tension spark plug cable resistance: Maximum 10 kΩ per meter (should not exceed 15-20 kΩ total per wire).
- Ignition timing at curb idle (800 ± 50 rpm): 5° ± 2° BTDC (timing light clamped to No. 1 wire).
MISFIRE / HESITATION DIAGNOSIS (تنتيش وتقطيع وضعف سحب):
1. Inspect spark plug tip:
   - Tan/Light gray: Normal combustion.
   - Black dry soot: Rich fuel mixture, weak ignition, leaking choke or dirty air filter.
   - Wet oil: Worn piston rings or leaking valve stem seals.
2. Spark plug wire test: Spray light mist of water at night. Look for visible blue arcing to engine block or distributor body.
3. Distributor cap / rotor check: Check for carbon tracking, crack in bakelite, or worn center carbon brush.
4. Ignition coil resistance:
   - Primary coil resistance: 0.7 - 0.9 Ω (at 20°C).
   - Secondary coil resistance: 10.0 - 14.5 kΩ (at 20°C).`,
    tags: ['ignition', 'spark plug', 'misfire', 'timing', 'بوجيهات', 'اشعال', 'تقطيع', 'تنتيش', 'سلوك بوجيهات'],
  },

  // 5. TIMING BELT REPLACEMENT & VALVE CLEARANCE
  {
    id: 'doc-tim-01',
    vehicleModel: 'Hyundai Excel / Accent 1.3/1.5 SOHC',
    system: 'timing',
    chapter: 'Engine Mechanical > Timing System & Valves',
    page: 72,
    title: 'Timing Belt Alignment Marks & Mechanical Valve Clearance',
    content: `TIMING BELT SPECIFICATIONS:
- Replacement interval: Every 60,000 km (37,000 miles) or 4 years.
- Camshaft sprocket timing mark: Align notch on camshaft gear with pointer mark on cylinder head front plate (12 o'clock position).
- Crankshaft sprocket timing mark: Align pin/punch mark on crankshaft sprocket with arrow mark on front lower engine block (12 o'clock position).
- Tensioner pulley bolt torque: 22 - 30 N.m.
- Belt deflection tension test: With thumb pressure of approx 49 N (5 kg, 11 lbs) midway between camshaft and water pump, belt should deflect 4 - 6 mm.
CAUTION: On interference engines (Alpha DOHC 16V / 1.5 DOHC), broken timing belt causes bent intake/exhaust valves upon piston collision.
MECHANICAL VALVE CLEARANCE (خلوص الصبابات):
For SOHC engines with mechanical rocker arms:
- Intake valve clearance (Engine HOT): 0.20 mm (0.008 in).
- Exhaust valve clearance (Engine HOT): 0.25 mm (0.010 in).
- Intake valve clearance (Engine COLD): 0.15 mm (0.006 in).
- Exhaust valve clearance (Engine COLD): 0.20 mm (0.008 in).
Rocker arm adjusting screw lock nut torque: 8 - 10 N.m.`,
    tags: ['timing belt', 'camshaft', 'crankshaft', 'valve clearance', 'صباب', 'كاتينة', 'سير كاتينة', 'خلوص'],
  },

  // 6. FUEL SYSTEM & IDLE STABILITY
  {
    id: 'doc-fuel-01',
    vehicleModel: 'Hyundai Excel / Accent / Verna',
    system: 'fuel',
    chapter: 'Fuel & Emission Control System',
    page: 88,
    title: 'Fuel Pressure, Injector Resistance & Idle Speed Control (IAC/ISC)',
    content: `FUEL SYSTEM SPECIFICATIONS:
- Fuel pressure (MPFI injection): 2.6 - 3.0 bar (38 - 44 psi) with vacuum hose connected to Fuel Pressure Regulator; 3.3 - 3.5 bar (48 - 51 psi) with vacuum hose disconnected.
- Electric fuel pump deadhead pressure: 5.0 - 6.0 bar.
- Injector coil resistance: 13.5 - 15.5 Ω (at 20°C).
- Idle Air Control (IAC / ISC) motor resistance: 10.5 - 14.0 Ω across coil pins.
IDLE SPEED HUNTING / STALLING (رعشة السلانسيه وبندولية RPM):
1. Carbon buildup around throttle plate and idle bypass bore prevents smooth airflow control. Clean throttle body with carb cleaner.
2. Vacuum leak at intake manifold gasket, brake booster hose, or PCV valve hose causes lean mixture and high/unstable idle (1200-1500 rpm).
3. Throttle Position Sensor (TPS): Output voltage should increase smoothly from 0.45 - 0.55V at closed throttle to 4.2 - 4.8V at wide open throttle without dead spots.`,
    tags: ['fuel', 'pump', 'pressure', 'idle', 'iac', 'tps', 'طرمبة بنزين', 'ضغط بنزين', 'سلانسيه', 'بوابه'],
  },

  // 7. BRAKE SYSTEM & HYDRAULIC TOLERANCES
  {
    id: 'doc-brk-01',
    vehicleModel: 'Hyundai Accent / Verna / Elantra',
    system: 'brakes',
    chapter: 'Brake System > Hydraulic & Mechanical',
    page: 104,
    title: 'Brake Pad Thickness, Rotor Runout & Fluid Specification',
    content: `BRAKE SPECIFICATIONS:
- Brake Fluid: DOT 3 or DOT 4 Glycol-based fluid (replace every 2 years or 40,000 km).
- Front Brake Pad thickness: Standard 10.0 mm (0.39 in); Service limit (minimum): 2.0 mm (0.08 in).
- Front Brake Disc Rotor thickness: Standard 19.0 mm; Minimum limit (runout/discard): 17.0 mm.
- Brake Disc Runout limit: Maximum 0.08 mm (0.003 in).
- Brake Caliper Guide Pin Bolt Torque: 22 - 32 N.m.
- Wheel Lug Nuts Torque: 90 - 110 N.m (65 - 80 lbf.ft).
- Brake Bleeding sequence:
  1. Rear Right (furthest from master cylinder)
  2. Front Left
  3. Rear Left
  4. Front Right`,
    tags: ['brake', 'pad', 'rotor', 'dot 4', 'فرامل', 'تيل', 'طنابير', 'زيت باكم', 'عزم'],
  },

  // 8. ELECTRICAL CHARGING & STARTING SYSTEM
  {
    id: 'doc-elec-01',
    vehicleModel: 'Hyundai Excel / Accent / Verna / Elantra',
    system: 'electrical',
    chapter: 'Electrical System > Battery & Alternator',
    page: 118,
    title: 'Charging Voltage, Parasitic Battery Drain & Starter Motor',
    content: `ELECTRICAL SPECIFICATIONS:
- Battery terminal open circuit voltage: 12.6V (100% charged), 12.4V (75%), 12.0V (25% - discharged).
- Cranking voltage drop: Voltage should not drop below 9.6V while engine starter is cranking for 10 seconds.
- Alternator output charging voltage:
  * At 2000 RPM with headlights & A/C ON: 13.8V - 14.5V.
  * Below 13.2V indicates worn alternator carbon brushes or failing diode bridge.
  * Above 15.0V indicates faulty voltage regulator, risking battery boiling and ECM damage.
- Parasitic drain (dark current with car locked & sleep mode): Must be under 35 - 50 mA (0.035 - 0.050 A). Anything above 80 mA drains battery overnight.
- Alternator belt tension: Deflection 6 - 8 mm under 98 N (10 kg) force.`,
    tags: ['battery', 'alternator', 'starter', 'voltage', 'بطارية', 'دينامو', 'مارش', 'شحن', 'فولت'],
  },
];

export const TECHNICAL_SECONDARY_SOURCES = [
  {
    type: 'TSB' as const,
    title: 'Hyundai Technical Service Bulletin #09-FL-004',
    code: 'TSB 09-FL-004',
    description: 'Crankshaft Position Sensor (CKP) heat soak failure causes sudden engine stall when warm and no-start until engine cools down (no spark / no fuel pulse). Resistance out of 800-950 Ω spec when hot.',
  },
  {
    type: 'TSB' as const,
    title: 'Hyundai Service Bulletin #05-20-008',
    code: 'TSB 05-20-008',
    description: 'Manual transaxle 2nd gear scratch/grind when cold: solved by switching to synthetic API GL-4 75W-85 fluid and checking clutch cable free play (15-20 mm at pedal).',
  },
  {
    type: 'OBD_DATABASE' as const,
    title: 'Global OBD-II Automotive Diagnostic Database (SAE J1979)',
    code: 'SAE J2012 / ISO 15031',
    description: 'Comprehensive powertrain freeze-frame definitions, sensor pinout tables, and oxygen sensor closed-loop voltage oscillation tolerances (0.1V to 0.9V switching 1-2 times per second).',
  },
  {
    type: 'OEM_SPEC' as const,
    title: 'Hyundai Motor Company OEM Fluid Standards',
    code: 'MS 591-08 / HMC-SP-III',
    description: 'Official fluid compatibility matrix for cooling, braking, manual transmission, automatic transaxles, and power steering (PSF-3 / Dexron II-D).',
  },
  {
    type: 'FIELD_GUIDE' as const,
    title: 'Arab Mechanic & Egyptian Workshop Field Knowledge (خبرة الورش المصرية والعربية)',
    code: 'EG-MECH-EXP',
    description: 'Common regional issues for Excel/Accent/Verna: radiator core clogging due to tap water usage (amlah/rust), cooling fan relay oxidation, ignition coil failure under summer heat, and throttle body stepper motor sticking.',
  },
];

export const COMMON_OBD_CODES: Record<string, OBDCodeInfo> = {
  P0300: {
    code: 'P0300',
    titleAr: 'عطل إشعال عشوائي أو متعدد في أسطوانات المحرك (Random/Multiple Cylinder Misfire)',
    titleEn: 'Random/Multiple Cylinder Misfire Detected',
    system: 'Ignition / Fuel',
    severity: 'high',
    commonSymptoms: [
      'تفتفة ورعشة قوية في المحرك على السلانسيه',
      'وميض لمبة فحص المحرك (Check Engine Blinking)',
      'ضعف شديد في عزم التسارع وزيادة استهلاك البنزين',
      'رائحة بنزين ني غير محترق في العادم',
    ],
    possibleCauses: [
      'تلف أو اتساخ شمعات الاحتراق (بوجيهات منتهية الصلاحية)',
      'تسريب كهرباء في كابلات البوجيهات (سلوك البوجيهات)',
      'تلف أو ضعف ملف الإشعال (الموبينة / Ignition Coil)',
      'تسريب هواء تفريغي (Vacuum Leak) في مانيفولد السحب',
      'انسداد في رشاشات البنزين أو ضعف ضغط طرمبة البنزين',
    ],
    manualTestSteps: [
      '1. افحص حالة شمعات الاحتراق وتأكد من الخلوص (1.0 - 1.1 مم لنظام الحقن، 0.8 مم للكاربراتير).',
      '2. قس مقاومة أسلاك البوجيهات بالمولتيميتر (أقل من 15 كليو أوم لكل سلك).',
      '3. قس مقاومة الموبينة (الابتدائي 0.7-0.9 أوم، الثانوي 10-14 كيلو أوم).',
      '4. افحص ضغط خط البنزين بواسطة ساعة قياس (يجب ألا يقل عن 2.6 - 3.2 بار).',
    ],
    relevantSensors: ['Crankshaft Position Sensor (CKP)', 'Camshaft Sensor (CMP)', 'MAP/MAF Sensor', 'O2 Sensor'],
  },
  P0171: {
    code: 'P0171',
    titleAr: 'خليط الوقود فقير جداً في بنك 1 (System Too Lean Bank 1)',
    titleEn: 'System Too Lean (Bank 1)',
    system: 'Fuel / Air Metering',
    severity: 'medium',
    commonSymptoms: [
      'تنتيشة وتردد عند الضغط المفاجئ على دواسة البنزين',
      'صعوبة تشغيل المحرك وهو بارد في الصباح',
      'ارتفاع صوت المحرك أو عدم استقرار السلانسيه',
      'ارتفاع حرارة غرف الاحتراق',
    ],
    possibleCauses: [
      'تسريب هواء بعد حساس الهواء (خرطوم فاكيوم مكسور أو جوان مانيفولد)',
      'اتساخ حساس سلك تدفق الهواء الساخن (MAF Sensor)',
      'ضعف طرمبة البنزين أو انسداد فلتر البنزين',
      'تلف حساس الأكسجين (حساس الشكمان) وقراءة جهد منخفض دائم (< 0.2V)',
    ],
    manualTestSteps: [
      '1. رش بخاخ إسبراي منظف على وصلات المانيفولد لملاحظة أي تغير في سرعة المحرك (كشف تسريب الهواء).',
      '2. افحص فلتر الهواء ونظف حساس MAF/MAP بإسبراي إلكترونيات خاص.',
      '3. قس ضغط طرمبة البنزين وتأكد من تغيير فلتر البنزين.',
      '4. افحص قراءة حساس الشكمان في وضع التشغيل المغلق (Closed Loop).',
    ],
    relevantSensors: ['MAF / MAP Sensor', 'Upstream O2 Sensor', 'Fuel Pressure Regulator', 'TPS'],
  },
  P0115: {
    code: 'P0115',
    titleAr: 'عطل في دائرة حساس حرارة سائل التبريد (ECT Sensor Circuit Malfunction)',
    titleEn: 'Engine Coolant Temperature Circuit Malfunction',
    system: 'Cooling / Electrical',
    severity: 'medium',
    commonSymptoms: [
      'تشغيل مروحة الردياتير باستمرار بأقصى سرعة كإجراء أمان للطوارئ',
      'صعوبة دوارة المحرك وهو بارد وخروج دخان أسود (كمبيوتر يضخ بنزين مفرط)',
      'عدم تحرك مؤشر الحرارة في لوحة العدادات',
      'استهلاك عالي جداً للبنزين',
    ],
    possibleCauses: [
      'فصل فيشة حساس الحرارة (ECT) أو تأكسد أطرافها',
      'قطع في سلك الإشارة المتجه لكمبيوتر السيارة (ECM)',
      'تلف الحساس الداخلي (المقاومة الحرارية NTC Thermistor)',
    ],
    manualTestSteps: [
      '1. قس مقاومة الحساس عند 20°C (المواصفة 2.2 - 2.8 كيلو أوم).',
      '2. سخن الحساس في ماء ساخن عند 80°C (المواصفة 280 - 350 أوم). إذا لم تنخفض المقاومة، فالحساس تالف.',
      '3. قس الفولت المغذي للفيشة (5.0 فولت من الكمبيوتر مع فتح الكونتاكت).',
    ],
    relevantSensors: ['ECT (Engine Coolant Temperature Sensor)'],
  },
  P0505: {
    code: 'P0505',
    titleAr: 'عطل في نظام التحكم في سرعة التباطؤ / السلانسيه (Idle Air Control System)',
    titleEn: 'Idle Air Control System Malfunction',
    system: 'Air Intake / Engine Idle',
    severity: 'low',
    commonSymptoms: [
      'انطفاء المحرك فجأة عند التوقف في إشارة أو عند تشغيل التكييف',
      'تأرجح مؤشر RPM صعوداً وهبوطاً (بندولية السلانسيه بين 600 و 1400 دورة)',
      'ارتفاع غير طبيعي في سرعة السلانسيه عند الوقوف',
    ],
    possibleCauses: [
      'انسداد ممر الهواء وصمام السلانسيه (IAC/ISC) برواسب الكربون والزيت',
      'تلف موتور خطوة السلانسيه (Stepper Motor)',
      'تسريب هواء فاكيوم حول البوابة (Throttle Body)',
    ],
    manualTestSteps: [
      '1. فك حساس/صمام السلانسيه وتنظيف الممر والبوابة جيداً بإسبراي إزالة الكربون.',
      '2. قياس مقاومة ملفات صمام IAC (المواصفة 10.5 - 14 أوم بين الأطراف).',
      '3. إعادة ضبط وبرمجة السلانسيه (Idle Relearn) بترك السيارة 10 دقائق بعد تسخينها.',
    ],
    relevantSensors: ['IAC / ISC Valve', 'TPS', 'MAP Sensor'],
  },
  P0420: {
    code: 'P0420',
    titleAr: 'كفاءة علبة البيئة / المحول الحفاز أقل من الحد المسموح (Catalyst System Efficiency)',
    titleEn: 'Catalyst System Efficiency Below Threshold',
    system: 'Exhaust / Emissions',
    severity: 'low',
    commonSymptoms: [
      'إضاءة لمبة Check Engine بدون تأثر ملحوظ في القيادة في البداية',
      'رائحة بيض فاسد (كبريت) من العادم عند التسارع القوي',
      'كتمة وضعف سحب في السرعات العالية إذا كانت العلبة مسدودة جزئياً',
    ],
    possibleCauses: [
      'تلف أو تكسر حشوة علبة البيئة (Catalytic Converter)',
      'تسريب عادم قبل حساس الشكمان الثاني',
      'تلف حساس الشكمان الخلفي (Downstream O2 Sensor)',
    ],
    manualTestSteps: [
      '1. فحص حرارة مدخل ومخرج علبة البيئة بمسدس ليزر حراري (المخرج يجب أن يكون أسخن بـ 15-30°C).',
      '2. مراقبة رسم إشارة الحساس الخلفي (يجب أن تكون شبه مستقرة حول 0.5-0.7V وليست متذبذبة مثل الأمامي).',
    ],
    relevantSensors: ['Upstream O2 Sensor (B1S1)', 'Downstream O2 Sensor (B1S2)'],
  },
};

export const HYUNDAI_EXCEL_SPECS: CarSpecificationCategory[] = [
  {
    title: 'منظومة التزييت والزيوت (Engine Lubrication)',
    icon: 'Droplets',
    items: [
      {
        label: 'سعة زيت المحرك مع تغيير الفلتر',
        value: '3.3 لتر',
        tolerance: '± 0.1 لتر',
        sourcePage: 'كتالوج المحرك ص 14',
      },
      {
        label: 'سعة زيت المحرك بدون تغيير الفلتر',
        value: '3.0 لتر',
        tolerance: '± 0.1 لتر',
        sourcePage: 'كتالوج المحرك ص 14',
      },
      {
        label: 'اللزوجة الموصى بها في الصيف والأجواء الحارة',
        value: '20W-50 أو 15W-40 (تصنيف API SJ/SL)',
        warning: 'احذر خلط زيت المحرك مع زيت الفتيس نهائياً',
        sourcePage: 'كتالوج الصيانة ص 15',
      },
      {
        label: 'اللزوجة الموصى بها في الشتاء والطقس المعتدل',
        value: '10W-40 (تصنيف نصف تخليقي أو معدني عالي الجودة)',
        sourcePage: 'كتالوج الصيانة ص 15',
      },
      {
        label: 'عزم ربط طبة زيت الكارتيرة (Drain Plug)',
        value: '35 - 45 نيوتن.متر (N.m)',
        warning: 'استبدل وردة النحاس مع كل غيار زيت لتجنب تفويت السن',
        sourcePage: 'كتالوج المحرك ص 16',
      },
    ],
  },
  {
    title: 'منظومة الفتيس وناقل الحركة (Transaxle Fluids)',
    icon: 'Cog',
    items: [
      {
        label: 'سعة زيت الفتيس المانيوال (Manual Transaxle)',
        value: '2.15 لتر',
        sourcePage: 'كتالوج الفتيس ص 28',
      },
      {
        label: 'مواصفة زيت الفتيس المانيوال',
        value: 'SAE 75W-90 أو 80W-90 بتصنيف API GL-4 فقط',
        warning: 'ممنوع استخدام زيت GL-5 لأنه يسبب تآكل غوايش النحاس وظهور عضة الغيارات',
        sourcePage: 'كتالوج الفتيس ص 28',
      },
      {
        label: 'سعة زيت الفتيس الأتوماتيك (تغيير كارتيرة)',
        value: '2.5 لتر (إجمالي الفتيس فارغ تماماً: 5.8 لتر)',
        sourcePage: 'كتالوج الأتوماتيك ص 32',
      },
      {
        label: 'مواصفة زيت الفتيس الأتوماتيك',
        value: 'Hyundai Genuine ATF SP-III (أو Diamond SP-III)',
        warning: 'ممنوع زيوت Dexron العادية لتفادي نتعة النقلات بين الأول والثاني',
        sourcePage: 'كتالوج الأتوماتيك ص 32',
      },
    ],
  },
  {
    title: 'منظومة التبريد والردياتير (Cooling System)',
    icon: 'Thermometer',
    items: [
      {
        label: 'سعة سائل التبريد الإجمالية (مع القربة)',
        value: '5.5 لتر',
        sourcePage: 'كتالوج التبريد ص 42',
      },
      {
        label: 'نسبة خلط سائل التبريد المثالية',
        value: '50% إيثيلين جلايكول أصلي + 50% ماء مقطر',
        warning: 'مياه الحنفية تؤدي لترسب الأملاح وانسداد مجاري الردياتير خلال أشهر',
        sourcePage: 'كتالوج التبريد ص 43',
      },
      {
        label: 'درجة حرارة فتح الثرموستات (الكوع)',
        value: '82°C (فتح كامل عند 95°C)',
        sourcePage: 'كتالوج التبريد ص 44',
      },
      {
        label: 'درجة تشغيل مروحة الردياتير (ثيرموستات المروحة)',
        value: '91°C إلى 95°C (تفصل عند 86°C - 90°C)',
        sourcePage: 'كتالوج التبريد ص 46',
      },
      {
        label: 'ضغط غطاء الردياتير القياسي',
        value: '0.9 إلى 1.1 بار (13 - 16 PSI)',
        sourcePage: 'كتالوج التبريد ص 48',
      },
    ],
  },
  {
    title: 'الإشعال والكهرباء وضبط الصبابات (Ignition & Engine Tune-Up)',
    icon: 'Zap',
    items: [
      {
        label: 'نوع شمعات الاحتراق (البوجيهات)',
        value: 'NGK BPR6ES-11 أو Champion RN9YC',
        sourcePage: 'كتالوج الكهرباء ص 56',
      },
      {
        label: 'خلوص فتحة البوجيه (Spark Plug Gap)',
        value: '1.0 - 1.1 مم (للحقن الإلكتروني) / 0.7 - 0.8 مم (للكاربراتير)',
        sourcePage: 'كتالوج الكهرباء ص 56',
      },
      {
        label: 'ترتيب إشعال الأسطوانات (Firing Order)',
        value: '1 - 3 - 4 - 2 (الأسطوانة 1 بجوار سير الكاتينة)',
        sourcePage: 'كتالوج الكهرباء ص 57',
      },
      {
        label: 'خلوص صبابات السحب (Intake) - محرك ساخن',
        value: '0.20 مم (0.15 مم والمحرك بارد)',
        sourcePage: 'كتالوج المحرك ص 74',
      },
      {
        label: 'خلوص صبابات العادم (Exhaust) - محرك ساخن',
        value: '0.25 مم (0.20 مم والمحرك بارد)',
        sourcePage: 'كتالوج المحرك ص 74',
      },
      {
        label: 'جهد شحن الدينامو السليم',
        value: '13.8V إلى 14.4V عند 2000 د/د مع الأحمال',
        warning: 'أقل من 13.2V شحن ضعيف، أعلى من 15.0V تلف منظم الشحن ويغلي البطارية',
        sourcePage: 'كتالوج الكهرباء ص 120',
      },
    ],
  },
];
