import React, { useState } from 'react';
import { COMMON_OBD_CODES } from '../data/carManualsData';
import { OBDCodeInfo } from '../types/car';
import {
  Activity,
  AlertTriangle,
  Search,
  CheckCircle2,
  Wrench,
  Cpu,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface ObdInspectorProps {
  onSelectCodeToDiagnose?: (codePrompt: string) => void;
}

export const ObdInspector: React.FC<ObdInspectorProps> = ({ onSelectCodeToDiagnose }) => {
  const [selectedCode, setSelectedCode] = useState<string>('P0300');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentCodeInfo: OBDCodeInfo | undefined =
    COMMON_OBD_CODES[selectedCode.toUpperCase()] ||
    Object.values(COMMON_OBD_CODES).find((c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.titleAr.includes(searchQuery)
    );

  const availableCodes = Object.keys(COMMON_OBD_CODES);

  return (
    <div className="space-y-6">
      {/* Top Banner & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5 mb-1">
            <Cpu className="w-4 h-4" />
            <span>فاحص أكواد الأعطال التشخيصية القياسية (OBD-II DTC)</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            مكتبة أكواد فحص كمبيوتر السيارة وخطوات اختبار الحساسات
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تفسير دقيق للأكواد مع قيم القياس بالمولتيميتر (أوم وفولت) والحلول المعتمدة لتجنب تغيير قطع سليمة عشوائياً.
          </p>
        </div>

        {/* Code Selector Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {availableCodes.map((code) => (
            <button
              key={code}
              onClick={() => setSelectedCode(code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                selectedCode === code
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Code Details Card */}
      {currentCodeInfo ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl divide-y divide-slate-800">
          {/* Header */}
          <div className="p-6 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-black text-xl">
                {currentCodeInfo.code}
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span>المنظومة: {currentCodeInfo.system}</span>
                  <span>·</span>
                  <span className="font-mono text-slate-500">{currentCodeInfo.titleEn}</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-white leading-snug">
                  {currentCodeInfo.titleAr}
                </h3>
              </div>
            </div>

            {onSelectCodeToDiagnose && (
              <button
                onClick={() =>
                  onSelectCodeToDiagnose(
                    `عندي كود عطل ${currentCodeInfo.code} (${currentCodeInfo.titleAr})، ما هي خطوات الفحص الدقيقة بالكتالوج؟`
                  )
                }
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow"
              >
                تحليل العطل بالذكاء الاصطناعي ←
              </button>
            )}
          </div>

          {/* 3 Columns Grid: Symptoms, Causes, Relevant Sensors */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-800">
            {/* Symptoms */}
            <div className="p-5 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>أعراض العطل الظاهرة على السيارة</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentCodeInfo.commonSymptoms.map((sym, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Possible Causes */}
            <div className="p-5 space-y-3">
              <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                <span>الأسباب الميكانيكية والكهربائية</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentCodeInfo.possibleCauses.map((cause, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Relevant Sensors */}
            <div className="p-5 space-y-3">
              <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                <span>الحساسات والدوائر المرتبطة</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {currentCodeInfo.relevantSensors.map((sensor, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono"
                  >
                    {sensor}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Step-by-Step Multimeter & Manual Test Steps */}
          <div className="p-6 bg-slate-950/40">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
              <Wrench className="w-4 h-4 text-emerald-400" />
              <span>شجرة الفحص المعتمدة من كتالوج الصيانة واختبار القياس (Multimeter):</span>
            </h4>

            <div className="space-y-2.5">
              {currentCodeInfo.manualTestSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
                >
                  <span className="text-emerald-400 font-bold shrink-0">#{idx + 1}</span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
          لم يتم العثور على الكود المطلوب. جرب كتابته في شريط التشخيص الذكي.
        </div>
      )}
    </div>
  );
};
