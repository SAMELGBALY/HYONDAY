/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CarProfile } from './types/car';
import { PRESET_CAR_PROFILES } from './data/carManualsData';
import { CarSelector } from './components/CarSelector';
import { DiagnosticLab } from './components/DiagnosticLab';
import { QuickSpecsView } from './components/QuickSpecsView';
import { ObdInspector } from './components/ObdInspector';
import { InteractiveTree } from './components/InteractiveTree';
import { ManualsVault } from './components/ManualsVault';
import { InstallPromptModal } from './components/InstallPromptModal';
import {
  Wrench,
  Gauge,
  Cpu,
  GitBranch,
  BookOpen,
  Car,
  Shield,
  Layers,
  Sparkles,
  Smartphone,
  Download,
} from 'lucide-react';

type ActiveTab = 'diagnose' | 'specs' | 'obd' | 'tree' | 'vault';

export default function App() {
  const [activeCar, setActiveCar] = useState<CarProfile>(PRESET_CAR_PROFILES[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('diagnose');
  const [forwardedPrompt, setForwardedPrompt] = useState<string | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const handleTransferToDiagnose = (prompt: string) => {
    setForwardedPrompt(prompt);
    setActiveTab('diagnose');
  };

  const navItems = [
    {
      id: 'diagnose' as ActiveTab,
      label: 'تشخيص الأعطال بالكتالوج',
      icon: Wrench,
      badge: 'الذكاء الاصطناعي',
    },
    {
      id: 'specs' as ActiveTab,
      label: 'المواصفات والسعات السريعة',
      icon: Gauge,
    },
    {
      id: 'obd' as ActiveTab,
      label: 'فاحص أكواد الأعطال OBD-II',
      icon: Cpu,
    },
    {
      id: 'tree' as ActiveTab,
      label: 'شجرة الفحص التفاعلية',
      icon: GitBranch,
    },
    {
      id: 'vault' as ActiveTab,
      label: 'مكتبة الكتالوجات والمصادر',
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Title & Sameh El Gebaly Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/10">
              <Car className="w-5 h-5 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white tracking-tight">AutoDoc AI</h1>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
                  م/ سامح الجبالي
                </span>
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  MANUAL RAG
                </span>
              </div>
              <p className="text-[11px] text-slate-400">مساعد تشخيص وصيانة السيارات الفني بالكتالوج المعتمد</p>
            </div>
          </div>

          {/* Quick Technical Badges & Install App Button */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-800">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>فصل صارم بين زيت المحرك والفتيس</span>
              </div>
            </div>

            {/* Install on Mobile Button */}
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 shrink-0"
              title="تثبيت التطبيق على شاشة هاتفك المحمول كـ PWA"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>تثبيت على الهاتف 📱</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Car Switcher Bar */}
        <CarSelector currentCar={activeCar} onSelectCar={setActiveCar} />

        {/* Tab Navigation Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'diagnose' && (
            <DiagnosticLab currentCar={activeCar} />
          )}

          {activeTab === 'specs' && (
            <QuickSpecsView currentCar={activeCar} />
          )}

          {activeTab === 'obd' && (
            <ObdInspector onSelectCodeToDiagnose={handleTransferToDiagnose} />
          )}

          {activeTab === 'tree' && (
            <InteractiveTree onTransferToAI={handleTransferToDiagnose} />
          )}

          {activeTab === 'vault' && (
            <ManualsVault />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p className="font-semibold text-slate-400">
            تطبيق AutoDoc AI الفني · إشراف وتطوير: <span className="text-amber-400 font-bold">م/ سامح الجبالي</span>
          </p>
          <p className="text-[11px] text-slate-500">
            مبني وفقاً لكتالوج خدمة هيونداي (Service Manual) والنشرات الفنية المعتمدة
          </p>
          <p className="text-[10px] text-slate-600">
            تنبيه: الكتالوج مرجع هندسي استرشادي. اتبع دائماً احتياطات السلامة وارتدِ نظارات ووسائل الحماية أثناء العمل على المحرك وسوائل التبريد الساخنة.
          </p>
        </div>
      </footer>

      {/* Mobile Install Modal */}
      <InstallPromptModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
