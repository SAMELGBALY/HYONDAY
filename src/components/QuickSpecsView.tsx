import React, { useState } from 'react';
import { CarProfile } from '../types/car';
import { HYUNDAI_EXCEL_SPECS } from '../data/carManualsData';
import {
  Droplets,
  Cog,
  Thermometer,
  Zap,
  Gauge,
  AlertTriangle,
  BookOpen,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface QuickSpecsViewProps {
  currentCar: CarProfile;
}

export const QuickSpecsView: React.FC<QuickSpecsViewProps> = ({ currentCar }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-amber-400" />;
      case 'Cog':
        return <Cog className="w-5 h-5 text-indigo-400" />;
      case 'Thermometer':
        return <Thermometer className="w-5 h-5 text-rose-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-cyan-400" />;
      default:
        return <Gauge className="w-5 h-5 text-emerald-400" />;
    }
  };

  const filteredCategories = HYUNDAI_EXCEL_SPECS.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.value.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>المواصفات والسعات الرسمية من كتالوج الخدمة</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            دليل السعات والعيارات الدقيقة لسيارة {currentCar.modelArabic || currentCar.model}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مستخرجة مباشرة من Service Manual المعتمد لتجنب الخلط بين زيت المحرك وزيت الفتيس، وضمان العمر الافتراضي للمحرك.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث عن: زيت، شمعات، ثرموستات، عزم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Critical Comparison Notice: Engine Oil vs Transaxle Oil */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-300">قاعدة ذهبية معتمدة في كتالوج الصيانة:</div>
          <p className="leading-relaxed">
            زيت المحرك (3.3 لتر لزوجة 10W-40 أو 20W-50 API SJ/SL) يختلف كلياً عن زيت الفتيس المانيوال (2.15 لتر لزوجة 75W-90 أو 80W-90 بتصنيف GL-4 فقط). تجنب نهائياً استخدام زيوت GL-5 في الفتيس المانيوال لحماية غوايش النحاس (Synchronizers) من التآكل.
          </p>
        </div>
      </div>

      {/* Model 98 Specific Guide (Differences & Constants) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
        <div className="font-bold text-white flex items-center gap-2">
          <span className="text-amber-400">🔍</span>
          <span>هل تفرق تفاصيل هيونداي إكسيل موديل 1998 عن باقي الموديلات؟</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 space-y-1">
            <span className="text-emerald-400 font-semibold">✓ ثوابت لا تختلف نهائياً:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li>سعة زيت المحرك (3.3 لتر بالفلتر / 3.0 لتر بدون فلتر).</li>
              <li>سعة زيت الفتيس المانيوال (2.15 لتر GL-4 حصراً).</li>
              <li>منظومة التبريد (5.5 لتر، ثيرموستات كوع يفتح 82°C، غطاء 0.9 بار).</li>
              <li>خلوص الصبابات الساخنة (سحب 0.20 مم / عادم 0.25 مم).</li>
            </ul>
          </div>
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 space-y-1">
            <span className="text-cyan-400 font-semibold">⚙️ ما يفرق تحديداً في موديل 98:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li><strong>كاربراتير vs إنجكشن:</strong> الكاربراتير خلوص بوجيهاته (0.7 - 0.8 مم)، والإنجكشن (1.0 - 1.1 مم).</li>
              <li><strong>موتور 1300 vs 1500:</strong> سير الكاتينة 107 سنة في 1300cc مقابل 111 سنة في 1500cc.</li>
              <li><strong>غاز التكييف:</strong> موديل 98 يعتمد غاز R134a الصديق للبيئة بدلاً من R12 القديم.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Spec Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCategories.map((cat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
            <div className="p-4 border-b border-slate-800/80 bg-slate-950/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-800/80">{getIcon(cat.icon)}</div>
                <h3 className="font-bold text-sm text-white">{cat.title}</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">{cat.items.length} مواصفة</span>
            </div>

            <div className="divide-y divide-slate-800/60 p-2">
              {cat.items.map((item, itemIdx) => (
                <div key={itemIdx} className="p-3 hover:bg-slate-800/30 rounded-xl transition-colors space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs text-slate-300 font-medium">{item.label}</span>
                    <div className="text-right">
                      <div className="text-xs font-bold text-amber-400 font-mono">{item.value}</div>
                      {item.tolerance && <span className="text-[10px] text-slate-500">{item.tolerance}</span>}
                    </div>
                  </div>

                  {item.sourcePage && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-slate-600" />
                      <span>{item.sourcePage}</span>
                    </div>
                  )}

                  {item.warning && (
                    <div className="text-[11px] text-red-300/90 bg-red-950/30 border border-red-900/40 rounded p-1.5 flex items-start gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                      <span>{item.warning}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
