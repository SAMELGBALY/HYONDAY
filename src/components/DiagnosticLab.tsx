import React, { useState, useRef } from 'react';
import { CarProfile, DiagnosticResponse, DiagnosticCheckItem } from '../types/car';
import {
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Activity,
  Layers,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Clock,
  BookOpen,
  Wrench,
  Gauge,
} from 'lucide-react';

interface DiagnosticLabProps {
  currentCar: CarProfile;
}

export const DiagnosticLab: React.FC<DiagnosticLabProps> = ({ currentCar }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [result, setResult] = useState<DiagnosticResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Image upload state
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Interactive diagnostic checks tracked by user
  const [userChecks, setUserChecks] = useState<Record<string, 'ok' | 'fault' | 'pending'>>({});

  const commonSymptomChips = [
    'العربية بتسخن في الزحمة والمروحة مش بتشتغل',
    'تقطيع وتنتيش عند الضغط على دواسة البنزين',
    'كمية وسعة زيت المحرك ولزوجته الموصى بها',
    'صعوبة تشغيل المحرك صباحاً على البارد',
    'عضة وصوت احتكاك في الغيار الثاني بالفتيس',
    'كود عطل P0300 ورعشة قوية في السلانسيه',
    'خطوات تغيير زيت المحرك وعزم ربط الطبة',
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      const base64Data = resultStr.split(',')[1];
      setSelectedImageBase64(base64Data);
      setImagePreviewUrl(resultStr);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setSelectedImageBase64(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAudioTranscribe(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      alert('تعذر الوصول إلى الميكروفون: ' + err.message);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioTranscribe = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/webm' }),
        });
        const data = await res.json();
        if (data.text) {
          setQuestion((prev) => (prev ? `${prev} ${data.text}` : data.text));
        }
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleDiagnose = async (overridePrompt?: string) => {
    const textToSubmit = overridePrompt !== undefined ? overridePrompt : question;
    if (!textToSubmit.trim() && !selectedImageBase64) return;

    setIsLoading(true);
    setError(null);
    setLoadingStage('جاري مطابقة نصوص كتالوج المصنع وفهرس BM25 الفني...');

    try {
      const timer1 = setTimeout(() => {
        setLoadingStage('استخراج المواصفات الفنية والمصادر المعتمدة...');
      }, 1200);

      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSubmit,
          carProfile: currentCar,
          attachedImageBase64: selectedImageBase64,
          imageMimeType,
          previousChecks: userChecks,
        }),
      });

      clearTimeout(timer1);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'فشل إتمام التشخيص الفني');
      }

      const data: DiagnosticResponse = await res.json();
      setResult(data);

      // Initialize check states
      const initialChecks: Record<string, 'ok' | 'fault' | 'pending'> = {};
      data.diagnosticChecks?.forEach((c) => {
        initialChecks[c.id] = 'pending';
      });
      setUserChecks(initialChecks);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  const toggleCheckStatus = (checkId: string, status: 'ok' | 'fault') => {
    setUserChecks((prev) => ({
      ...prev,
      [checkId]: prev[checkId] === status ? 'pending' : status,
    }));
  };

  const getSeverityBadge = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-400',
          label: 'حرج جداً - يرجى عدم تحريك السيارة لتجنب تلف المحرك',
        };
      case 'high':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          label: 'عطل مرتفع الخطورة - يحتاج فحص فوري',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
          label: 'متوسط - يؤثر على كفاءة القيادة واستهلاك الوقود',
        };
      default:
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
          label: 'إجراء صيانة أو استفسار مواصفة فنية',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              استشر الكتالوج الفني لسيارتك ({currentCar.modelArabic || currentCar.model})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            يدعم العامية والفصحى وأكواد OBD والمصطلحات الميكانيكية
          </span>
        </div>

        {/* Input Box */}
        <div className="relative">
          <textarea
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="صف عطل سيارتك بالتفصيل، مثلاً:
- 'العربية بتسخن معايا في الزحمة ولما أجري على الطريق الحر بتبرد'
- 'عايز أعرف سعة زيت المحرك ولزوجته بالظبط وعزم ربط الطبة'
- 'عندي تنتيشة وتقطيع ورعشة لما أدوس بنزين فجأة'
- 'كود عطل P0300 ولمبة التشيك بتنور وتطفي'"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all resize-none leading-relaxed"
          />

          {/* Image preview badge if present */}
          {imagePreviewUrl && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-900/90 border border-slate-700 rounded-lg p-1.5 shadow-md">
              <img src={imagePreviewUrl} alt="Preview" className="w-10 h-10 object-cover rounded" />
              <div className="text-xs text-slate-300 pr-1">مرفق صورة للفحص</div>
              <button onClick={clearImage} className="text-slate-400 hover:text-red-400 p-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Action Controls & Media Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            {/* Image upload button */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-300 transition-colors border border-slate-700/40"
              title="إرفاق صورة للمبة العدادات أو البوجيه أو التسريب أو شاشة الفحص"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>إرفاق صورة</span>
            </button>

            {/* Voice record button */}
            <button
              type="button"
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                isRecording
                  ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700/40'
              }`}
              title="تسجيل وصف العطل بصوتك"
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isRecording ? 'إيقاف التسجيل...' : isTranscribing ? 'جاري تحويل الصوت...' : 'تسجيل صوتي'}</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => handleDiagnose()}
            disabled={isLoading || (!question.trim() && !selectedImageBase64)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-sm shadow-md transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>جاري البحث الفني...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-slate-950" />
                <span>تشخيص بالكتالوج والمصادر</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Question Chips */}
        <div className="mt-4 pt-3 border-t border-slate-800/50">
          <div className="text-xs text-slate-400 mb-2 font-medium">أعطال واستفسارات شائعة للسيارة:</div>
          <div className="flex flex-wrap gap-2">
            {commonSymptomChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(chip);
                  handleDiagnose(chip);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40 hover:text-amber-300 text-slate-300 transition-colors text-right"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Stage Indicator */}
      {isLoading && (
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-5 text-center space-y-3 animate-pulse">
          <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div className="text-base font-semibold text-white">{loadingStage}</div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            يتم فحص صفحات كتالوج الصيانة المعتمد لسيارتك ({currentCar.model}) ومطابقة بيانات منظومة {currentCar.engine} مع النشرات الفنية المعتمدة
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-sm">تنبيه في الفحص الفني</div>
            <div className="text-xs text-red-200 mt-1">{error}</div>
          </div>
        </div>
      )}

      {/* Diagnostic Response Card */}
      {result && !isLoading && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl divide-y divide-slate-800/80">
          {/* Header Summary */}
          <div className="p-6 bg-gradient-to-l from-slate-900 via-slate-900 to-slate-950">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-amber-400 font-mono font-medium border border-slate-700">
                  منظومة {result.detectedSystem}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">
                  {result.vehicleSummary.model} ({result.vehicleSummary.year}) - {result.vehicleSummary.engine}
                </span>
              </div>

              {/* Severity badge */}
              <div
                className={`text-xs px-3 py-1 rounded-full border font-medium flex items-center gap-1.5 ${
                  getSeverityBadge(result.severityLevel).bg
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{getSeverityBadge(result.severityLevel).label}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white leading-snug mb-3">
              {result.primaryDiagnosis}
            </h3>

            {/* Safety Warnings if any */}
            {result.safetyWarnings && result.safetyWarnings.length > 0 && (
              <div className="mt-4 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>تحذيرات الأمان والسلامة المهنية:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 pr-1 text-red-200/90">
                  {result.safetyWarnings.map((warn, i) => (
                    <li key={i}>{warn}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Probable Causes Breakdown */}
          {result.probableCauses && result.probableCauses.length > 0 && (
            <div className="p-6">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>الأسباب الفنية المحتملة (مرتبة بالأولوية):</span>
              </h4>

              <div className="space-y-3">
                {result.probableCauses.map((item, idx) => {
                  const pLower = (item.probability || '').toLowerCase();
                  const isHigh = pLower.includes('high') || pLower.includes('عالي') || pLower.includes('مرتفع');
                  const isMed = pLower.includes('med') || pLower.includes('متوسط');

                  const probColor = isHigh
                    ? 'text-red-400 bg-red-500/10 border-red-500/20'
                    : isMed
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    : 'text-blue-400 bg-blue-500/10 border-blue-500/20';

                  const probLabel = isHigh
                    ? 'احتمال مرتفع (الأرجح)'
                    : isMed
                    ? 'احتمال متوسط'
                    : 'احتمال وارد';

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-right dir-rtl"
                    >
                      <div className="space-y-1 text-right">
                        <div className="font-semibold text-sm text-slate-100">{item.cause}</div>
                        <div className="text-xs text-slate-400 leading-relaxed text-right">{item.explanation}</div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded border shrink-0 font-medium ${probColor}`}>
                        {probLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Diagnostic Checklist */}
          {result.diagnosticChecks && result.diagnosticChecks.length > 0 && (
            <div className="p-6 bg-slate-950/40">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>الفحوصات العملية المعتمدة (جرب فحصها وعلم عليها):</span>
                </h4>
                <span className="text-xs text-slate-400">حدد نتيجة فحصك لفلترة العطل</span>
              </div>

              <div className="space-y-3 mt-4">
                {result.diagnosticChecks.map((check, idx) => {
                  const currentStatus = userChecks[check.id] || 'pending';
                  return (
                    <div
                      key={check.id}
                      className={`p-4 rounded-xl border transition-all text-right ${
                        currentStatus === 'fault'
                          ? 'bg-red-950/20 border-red-500/40'
                          : currentStatus === 'ok'
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                        <div className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-slate-800 text-amber-400 text-xs flex items-center justify-center font-mono">
                            #{idx + 1}
                          </span>
                          <span>{check.component}</span>
                        </div>

                        {/* Status Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleCheckStatus(check.id, 'ok')}
                            className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                              currentStatus === 'ok'
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-emerald-300'
                            }`}
                          >
                            ✓ فحصته وسليم
                          </button>
                          <button
                            onClick={() => toggleCheckStatus(check.id, 'fault')}
                            className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                              currentStatus === 'fault'
                                ? 'bg-red-500 text-slate-950 border-red-400 font-bold'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-red-300'
                            }`}
                          >
                            ✗ فيه مشكلة / عطلان
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 mb-2 leading-relaxed text-right">
                        <strong className="text-slate-400">خطوة الفحص: </strong>
                        {check.action}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/60 text-right">
                        <div className="text-emerald-400/90 text-right">
                          <span className="text-slate-500">القيمة السليمة: </span>
                          {check.normalValue}
                        </div>
                        <div className="text-amber-400/90 text-right">
                          <span className="text-slate-500">دليل العطل: </span>
                          {check.faultIndicator}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Approved Repair Procedures */}
          {result.repairSteps && result.repairSteps.length > 0 && (
            <div className="p-6">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>خطوات الصيانة والإصلاح المعتمدة في الكتالوج:</span>
              </h4>

              <ol className="space-y-3">
                {result.repairSteps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200 leading-relaxed"
                  >
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Exact Numerical Specs & Tolerances */}
          {result.exactSpecs && result.exactSpecs.length > 0 && (
            <div className="p-6 bg-slate-950/60">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>المواصفات الفنية الصريحة المستخرجة:</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.exactSpecs.map((spec, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-xs text-slate-400">{spec.parameter}</div>
                    <div className="text-base font-bold text-white font-mono flex items-baseline gap-1">
                      <span>{spec.value}</span>
                      {spec.unit && <span className="text-xs text-amber-400 font-sans">{spec.unit}</span>}
                    </div>
                    {spec.note && <div className="text-xs text-slate-500 pt-1">{spec.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manual & Secondary Citations */}
          <div className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>المصادر الفنية المعتمدة المستخدمة:</span>
            </h4>

            {/* Factory Manual References */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400">📘 كتالوج المصنع الرسمي (Factory Service Manual):</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {result.manualReferences.map((ref, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="font-semibold text-slate-200">{ref.manualName}</div>
                    <div className="text-slate-400 flex items-center justify-between">
                      <span>{ref.section}</span>
                      {ref.page && <span className="text-amber-400 font-mono">{ref.page}</span>}
                    </div>
                    {ref.quote && <div className="text-slate-500 italic border-t border-slate-900 pt-1 mt-1 text-[11px]">"{ref.quote}"</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Sources */}
            {result.secondarySources && result.secondarySources.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-slate-400">🌐 مصادر إضافية معتمدة (TSB / OBD Database / خبرة الورش):</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {result.secondarySources.map((sec, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-cyan-300">{sec.title}</span>
                        {sec.code && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{sec.code}</span>}
                      </div>
                      <div className="text-slate-400 text-xs leading-relaxed">{sec.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mechanic Pro Tips */}
          {result.mechanicTips && result.mechanicTips.length > 0 && (
            <div className="p-6 bg-amber-500/5">
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>نصائح وتوجيهات خاصة لسيارتك:</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.mechanicTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
