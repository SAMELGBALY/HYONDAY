import React, { useState } from 'react';
import { CarProfile } from '../types/car';
import { PRESET_CAR_PROFILES } from '../data/carManualsData';
import { Car, ChevronDown, Wrench, Gauge, Fuel } from 'lucide-react';

interface CarSelectorProps {
  currentCar: CarProfile;
  onSelectCar: (car: CarProfile) => void;
}

export const CarSelector: React.FC<CarSelectorProps> = ({ currentCar, onSelectCar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customModel, setCustomModel] = useState('');
  const [customYear, setCustomYear] = useState('1998');
  const [customEngine, setCustomEngine] = useState('1.5L SOHC');
  const [customTransmission, setCustomTransmission] = useState<'manual' | 'automatic'>('manual');
  const [customFuel, setCustomFuel] = useState<'mpfi' | 'carburetor' | 'gdi'>('mpfi');

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customModel.trim()) return;

    const newCar: CarProfile = {
      id: `custom-${Date.now()}`,
      brand: 'Custom',
      model: customModel,
      modelArabic: customModel,
      year: parseInt(customYear) || 2005,
      engine: customEngine,
      transmission: customTransmission,
      fuelSystem: customFuel,
    };

    onSelectCar(newCar);
    setIsCustomModalOpen(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Current Active Vehicle Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 backdrop-blur-md shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Car className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                السيارة المحددة في الكتالوج
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">موديل {currentCar.year}</span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{currentCar.modelArabic || currentCar.model}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-normal">
                {currentCar.engine}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-400 border-r border-slate-800 pr-4">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-500" />
              <span>الفتيس: {currentCar.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-slate-500" />
              <span>الوقود: {currentCar.fuelSystem === 'carburetor' ? 'كاربراتير' : 'حقن إلكتروني (إنجكشن)'}</span>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-sm font-medium transition-colors border border-slate-700/60"
          >
            <span>تغيير السيارة</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 max-h-96 overflow-y-auto">
            <div className="text-xs font-medium text-slate-400 mb-2 px-2">كتالوجات السيارات الجاهزة المعتمدة</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {PRESET_CAR_PROFILES.map((car) => {
                const isSelected = currentCar.id === car.id;
                return (
                  <button
                    key={car.id}
                    onClick={() => {
                      onSelectCar(car);
                      setIsOpen(false);
                    }}
                    className={`text-right p-3 rounded-lg border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1">{car.modelArabic} ({car.model})</div>
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>{car.year} · {car.engine}</span>
                      <span className="font-mono text-slate-500">{car.transmission === 'automatic' ? 'AT' : 'MT'}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => {
                  setIsCustomModalOpen(true);
                  setIsOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>إضافة سيارة أخرى غير مدرجة (مخصص)</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Custom Car Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">تحديد بيانات سيارتك الخاصة</h3>
            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">اسم وموديل السيارة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تويوتا كورولا / كيا سيراتو / دايو لانوس"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">سنة الصنع</label>
                  <input
                    type="number"
                    required
                    value={customYear}
                    onChange={(e) => setCustomYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">حجم المحرك</label>
                  <input
                    type="text"
                    required
                    placeholder="1.6L أو 1.3L"
                    value={customEngine}
                    onChange={(e) => setCustomEngine(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">نوع الفتيس</label>
                  <select
                    value={customTransmission}
                    onChange={(e) => setCustomTransmission(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="manual">مانيوال (Manual)</option>
                    <option value="automatic">أوتوماتيك (Automatic)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">تغذية الوقود</label>
                  <select
                    value={customFuel}
                    onChange={(e) => setCustomFuel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="mpfi">حقن إلكتروني (إنجكشن)</option>
                    <option value="carburetor">كاربراتير (Carburetor)</option>
                    <option value="gdi">حقن مباشر (GDI)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors"
                >
                  اعتماد السيارة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
