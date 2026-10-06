import React, { useState } from 'react';
import { GitBranch, CheckCircle2, ChevronLeft, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';

interface TreeNode {
  id: string;
  question: string;
  note?: string;
  options: {
    label: string;
    nextNodeId?: string;
    conclusion?: {
      title: string;
      severity: 'high' | 'medium' | 'low';
      explanation: string;
      fix: string;
      specPage?: string;
    };
  }[];
}

interface InteractiveTreeProps {
  onTransferToAI?: (prompt: string) => void;
}

const OVERHEATING_TREE: Record<string, TreeNode> = {
  root: {
    id: 'root',
    question: 'متى ترتفع درجة حرارة المحرك بشكل أساسي؟',
    options: [
      {
        label: 'في الزحمة والتوقف والسرعات البطيئة فقط (وتبرد عند الجري السريع)',
        nextNodeId: 'fan_check',
      },
      {
        label: 'على السرعات العالية (أكثر من 80 كم/س) وأثناء السفر',
        nextNodeId: 'radiator_flow',
      },
      {
        label: 'الحرارة ترتفع فوراً بعد 5 دقائق من الدوارة وتدخل الخط الأحمر',
        nextNodeId: 'thermostat_check',
      },
    ],
  },
  fan_check: {
    id: 'fan_check',
    question: 'عند وصول مؤشر الحرارة لمنتصف العداد أو أعلى، هل مروحة الردياتير تدور؟',
    note: 'يمكنك فتح الكبوت وسماع صوت المروحة وملاحظة دوران الريش',
    options: [
      {
        label: 'المروحة لا تعمل نهائياً ولا تدور',
        conclusion: {
          title: 'تلف ثيرموستات المروحة أو الفيوز أو موتور المروحة',
          severity: 'high',
          explanation: 'في السرعات البطيئة لا يوجد تيار هواء طبيعي، لذا تتراكم الحرارة إذا لم تعمل المروحة.',
          fix: '1. افحص فيوز المروحة (20A/30A) في علبة الفيوزات.\n2. انزع فيشة ثيرموستات المروحة في أسفل الردياتير واعمل قفلة بسلك، إذا اشتغلت فالثيرموستات تالف.\n3. غذّ موتور المروحة بسلك مباشر 12V من البطارية، إذا لم يدور فالموتور محروق.',
          specPage: 'كتالوج التبريد ص 46',
        },
      },
      {
        label: 'المروحة تعمل وتدور ولكن الحرارة لا تنخفض',
        nextNodeId: 'radiator_external',
      },
    ],
  },
  radiator_external: {
    id: 'radiator_external',
    question: 'هل توجد أتربة وطين كثيف بين ردياتير المكيف وردياتير المحرك، أو نقص في ماء القربة؟',
    options: [
      {
        label: 'الماء ينقص من القربة ويوجد فوران من الغطاء',
        conclusion: {
          title: 'تلف سوستة غطاء الردياتير أو وجود هواء في الدورة',
          severity: 'medium',
          explanation: 'غطاء الردياتير يحافظ على ضغط 0.9-1.1 بار لمنع غليان الماء قبل 120°C. تلفه يسبب الغليان عند 100°C وخروج الماء للقربة.',
          fix: 'استبدل غطاء الردياتير بآخر أصلي بضغط 0.9 أو 1.1 بار حسب الكتالوج، وقم بأخذ هواء (Bleeding) للدورة.',
          specPage: 'كتالوج التبريد ص 48',
        },
      },
      {
        label: 'ماء القربة مكتمل ولا ينقص، لكن جسم الردياتير شديد السخونة',
        conclusion: {
          title: 'انسداد سدد داخلي في مواسير الردياتير (الأملاح) أو تلف ريش طرمبة المياه',
          severity: 'high',
          explanation: 'استخدام ماء الصنبور يسبب ترسب أملاح الكالسيوم وانسداد الشرايين النحاسية أو الألومنيوم للردياتير، مما يمنع تدفق الماء بالسرعة الكافية في الزحمة.',
          fix: 'تسييخ الردياتير أو استبداله بردياتير جديد وتعبئة ماء مقطر مع سائل تبريد 50/50 إيثيلين جلايكول.',
          specPage: 'كتالوج التبريد ص 43',
        },
      },
    ],
  },
  radiator_flow: {
    id: 'radiator_flow',
    question: 'السخونة على السرعات العالية: هل الخرطوم السفلي للردياتير بارد والعلوي ساخن نار؟',
    options: [
      {
        label: 'نعم، الخرطوم السفلي أبرد بكثير من العلوي',
        conclusion: {
          title: 'ثرموستات الكوع (Thermostat) معلق في وضع الإغلاق الجزئي',
          severity: 'high',
          explanation: 'الثرموستات لا يفتح مداه الكامل (8.0 مم عند 95°C)، وبالتالي يختنق تدفق الماء ولا يستوعب كمية الحرارة العالية الناتجة عن دوران المحرك السريع.',
          fix: 'استبدل ثرموستات الكوع بآخر أصلي يفتح عند 82°C، وتأكد من عدم إلغائه نهائياً لتفادي استهلاك الوقود المفرط وتآكل البساتم.',
          specPage: 'كتالوج التبريد ص 44',
        },
      },
      {
        label: 'كلا الخرطومين ساخنان جداً والردياتير نظيف',
        conclusion: {
          title: 'تآكل ريش طرمبة المياه (Water Pump Cavitation) أو تقديم مفرط في الإشعال',
          severity: 'high',
          explanation: 'تآكل الريش المعدنية للطرمبة بسبب الصدأ يجعلها تعجز عن ضخ الماء مع الـ RPM العالي.',
          fix: 'فحص واستبدال طرمبة المياه مع سير الكاتينة، وفحص وزنة الإسبراتير/الكهرباء.',
          specPage: 'كتالوج التبريد ص 49',
        },
      },
    ],
  },
  thermostat_check: {
    id: 'thermostat_check',
    question: 'هل تلاحظ وجود فقاعات هواء مستمرة في قربة الماء وخروج دخان أبيض كثيف من الشكمان؟',
    options: [
      {
        label: 'نعم، ماء القربة يغلي وتخرج فقاعات ورائحة عادم من الردياتير',
        conclusion: {
          title: 'تلف جوان وش السلندر (Cylinder Head Gasket Blowout)',
          severity: 'high',
          explanation: 'احتراق الجوان يسمح لضغط كبس الأسطوانات بالهروب إلى مجاري التبريد مما يرفع الحرارة فوراً.',
          fix: 'فك وش السلندر، اختباره بالضغط ومسحه بالمخرطة واستبدال الجوان وربطه بعزم الكتالوج المعتمد.',
          specPage: 'كتالوج المحرك ص 68',
        },
      },
      {
        label: 'لا توجد فقاعات، فقط الحرارة تقفز سريعاً جداً',
        conclusion: {
          title: 'ثرموستات كوع تالف تماماً في وضع الغلق (Stuck Closed)',
          severity: 'high',
          explanation: 'الماء محبوس داخل كتلة المحرك ولا يمر عبر الردياتير إطلاقاً.',
          fix: 'استبدال الثرموستات فوراً قبل تشغيل السيارة.',
          specPage: 'كتالوج التبريد ص 44',
        },
      },
    ],
  },
};

export const InteractiveTree: React.FC<InteractiveTreeProps> = ({ onTransferToAI }) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('root');
  const [history, setHistory] = useState<string[]>([]);
  const [selectedConclusion, setSelectedConclusion] = useState<any>(null);

  const currentNode = OVERHEATING_TREE[currentNodeId];

  const handleSelectOption = (option: any) => {
    if (option.conclusion) {
      setSelectedConclusion(option.conclusion);
    } else if (option.nextNodeId) {
      setHistory((prev) => [...prev, currentNodeId]);
      setCurrentNodeId(option.nextNodeId);
    }
  };

  const handleBack = () => {
    if (selectedConclusion) {
      setSelectedConclusion(null);
      return;
    }
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((old) => old.slice(0, old.length - 1));
      setCurrentNodeId(prev);
    }
  };

  const handleReset = () => {
    setCurrentNodeId('root');
    setHistory([]);
    setSelectedConclusion(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
            <GitBranch className="w-4 h-4" />
            <span>شجرة القرارات التشخيصية التفاعلية (Diagnostic Decision Tree)</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            فحص خطوة بخطوة للوصول إلى سبب العطل الدقيق
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            أجب عن الأسئلة الميدانية بناءً على ما تلاحظه في سيارتك لعزل المكون التالف وفق خوارزميات الكتالوج.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors border border-slate-700/60"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة الفحص من البداية</span>
        </button>
      </div>

      {/* Main Flow Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Breadcrumb / Back button */}
        {(history.length > 0 || selectedConclusion) && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 mb-4 transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span>الرجوع للخطوة السابقة</span>
          </button>
        )}

        {/* Question State */}
        {!selectedConclusion && currentNode && (
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-mono">
                خطوة التشخيص رقم {history.length + 1}
              </span>
              <h3 className="text-lg font-bold text-white leading-relaxed">
                {currentNode.question}
              </h3>
              {currentNode.note && (
                <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 inline-block">
                  💡 ملاحظة فنية: {currentNode.note}
                </p>
              )}
            </div>

            <div className="space-y-3 pt-2">
              {currentNode.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  className="w-full text-right p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-800/40 text-slate-200 text-sm font-medium transition-all flex items-center justify-between gap-3 group"
                >
                  <span>{option.label}</span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-[-4px] transition-all shrink-0 rotate-180" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Conclusion State */}
        {selectedConclusion && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                نتيجة الفحص التشخيصي المعتمدة
              </span>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
              <h3 className="text-lg font-bold text-white">
                {selectedConclusion.title}
              </h3>

              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-slate-400">التفسير الفني: </strong>
                {selectedConclusion.explanation}
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 text-xs text-slate-200">
                <div className="font-bold text-amber-400">🔧 خطوات الإصلاح المقترحة:</div>
                <pre className="font-sans whitespace-pre-wrap leading-relaxed text-slate-300">
                  {selectedConclusion.fix}
                </pre>
              </div>

              {selectedConclusion.specPage && (
                <div className="text-[11px] text-slate-400 pt-1">
                  مرجع الكتالوج: <span className="text-amber-400">{selectedConclusion.specPage}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition-colors"
              >
                فحص عطل آخر
              </button>

              {onTransferToAI && (
                <button
                  onClick={() =>
                    onTransferToAI(
                      `بناءً على فحص شجرة التشخيص، تبين احتمال: "${selectedConclusion.title}". أريد خطوات الإصلاح التفصيلية والمواصفات الفنية المعتمدة لسيارتي.`
                    )
                  }
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow"
                >
                  متابعة الاستشارة بالذكاء الاصطناعي ←
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
