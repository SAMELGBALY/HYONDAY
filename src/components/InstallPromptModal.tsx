import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Share2, Copy, Check, X, QrCode, ArrowUpRight } from 'lucide-react';

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallPromptModal: React.FC<InstallPromptModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Capture PWA install prompt on Android/Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        onClose();
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  if (!isOpen) return null;

  // Clean QR Code URL for easy scanning on desktop
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=0f172a&color=f59e0b&margin=6`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 text-slate-100 shadow-2xl relative overflow-hidden animate-in fade-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">تثبيت التطبيق على هاتفك المحمول</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            تطبيق <strong className="text-amber-400">AutoDoc AI · م/ سامح الجبالي</strong> مدعوم كـ Progressive Web App (PWA) ليعمل كتطبيق أصلي على شاشة هاتفك بدون متجر.
          </p>
        </div>

        {/* 1-Click Install Button (Chrome / Android) if available */}
        {deferredPrompt && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
            <span className="text-xs text-emerald-300 font-medium">متصفحك يدعم التثبيت المباشر:</span>
            <button
              onClick={handleInstallClick}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>تثبيت التطبيق على الشاشة الرئيسية الآن</span>
            </button>
          </div>
        )}

        {/* Instructions Tabs: Android vs iPhone */}
        <div className="space-y-4 mb-6">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <span>طريقة التثبيت السريعة في ثوانٍ:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Android / Chrome */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-right">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span>🤖 هواتف أندرويد (Chrome)</span>
              </div>
              <ol className="text-[11px] text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>افتح الرابط في متصفح <strong>Google Chrome</strong>.</li>
                <li>اضغط على زر القائمة <strong>(الثلاث نقاط ⋮)</strong> أعلى المتصفح.</li>
                <li>اختر <strong>«إضافة إلى الشاشة الرئيسية»</strong> أو <strong>«تثبيت التطبيق»</strong>.</li>
              </ol>
            </div>

            {/* iPhone / Safari */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-right">
              <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <span>🍏 هواتف آيفون (Safari)</span>
              </div>
              <ol className="text-[11px] text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>افتح الرابط في متصفح <strong>Safari</strong> حصراً.</li>
                <li>اضغط على زر المشاركة <strong>(مربع به سهم للأعلى ⎋)</strong> أسفل الشاشة.</li>
                <li>مرر لأسفل واختر <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong>.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* QR Code & Share link section */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-4">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
            <img src={qrUrl} alt="QR Code" className="w-24 h-24 rounded-lg object-contain" />
          </div>

          <div className="space-y-2 text-center sm:text-right flex-1">
            <div className="text-xs font-semibold text-slate-200">افتح الكاميرا وامسح الباركود</div>
            <p className="text-[11px] text-slate-400">
              وجه كاميرا هاتفك إلى الرمز لفتح التطبيق مباشرة في متصفحك وتثبيته.
            </p>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-400 font-medium transition-colors border border-slate-700"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'تم نسخ الرابط!' : 'نسخ رابط التطبيق لهاتفك'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
