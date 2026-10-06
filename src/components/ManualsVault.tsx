import React, { useState, useEffect } from 'react';
import { MANUAL_DOCUMENTS, TECHNICAL_SECONDARY_SOURCES } from '../data/carManualsData';
import {
  BookOpen,
  Search,
  PlusCircle,
  FileText,
  Upload,
  CheckCircle2,
  Tag,
  Layers,
  ChevronDown,
} from 'lucide-react';

export const ManualsVault: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [manuals, setManuals] = useState<any[]>(MANUAL_DOCUMENTS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form for custom manual upload
  const [newTitle, setNewTitle] = useState('');
  const [newModel, setNewModel] = useState('Hyundai Service Manual');
  const [newChapter, setNewChapter] = useState('Engine Mechanical');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('زيت, محرك, صيانة');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/manuals')
      .then((res) => res.json())
      .then((data) => {
        if (data.manuals) setManuals(data.manuals);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleUploadCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/manuals/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          vehicleModel: newModel,
          chapter: newChapter,
          content: newContent,
          tags: newTags.split(',').map((t) => t.trim()),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setManuals((prev) => [data.doc, ...prev]);
        setSuccessMessage('تمت إضافة وفهرسة الكتالوج الجديد بنجاح في قاعدة المعرفة!');
        setIsUploadModalOpen(false);
        setNewTitle('');
        setNewContent('');
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredManuals = manuals.filter((m) => {
    const query = searchTerm.toLowerCase();
    return (
      m.title.toLowerCase().includes(query) ||
      m.content.toLowerCase().includes(query) ||
      m.chapter.toLowerCase().includes(query) ||
      m.vehicleModel.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>مكتبة الكتالوجات الفنية الرسمية (Service Manuals Vault)</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            الوثائق المفهرسة بنظام BM25 والذكاء الاصطناعي
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تصفح فصول الكتالوج المعتمدة لهيونداي والسيارات، أو أضف كتالوج سيارتك وملاحظاتك الفنية لتضمينها في الفحص.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث في نصوص الكتالوجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Add custom manual button */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0 shadow"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>إضافة كتالوج مخصص</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Manual Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredManuals.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[11px] font-mono text-amber-400 font-medium">
                    {doc.vehicleModel}
                  </span>
                  <h3 className="font-bold text-sm text-white mt-0.5">{doc.title}</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono shrink-0">
                  صفحة {doc.page}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 mb-2">{doc.chapter}</div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {doc.content}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60">
              {doc.tags?.map((tag: string, i: number) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Sources Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>المصادر الفنية التكميلية المعتمدة (Secondary Technical Repositories)</span>
        </h3>
        <p className="text-xs text-slate-400">
          إلى جانب كتالوج المصنع، يعتمد النظام على النشرات الفنية الصادرة من مهندسي الصيانة وقواعد البيانات القياسية:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {TECHNICAL_SECONDARY_SOURCES.map((sec, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-cyan-300">{sec.title}</div>
              <div className="text-slate-400 text-[11px] leading-relaxed">{sec.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Custom Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">إضافة مستند أو نص من كتالوج سيارتك</h3>
            <p className="text-xs text-slate-400 mb-4">
              يمكنك لصق مواصفات أو إجراءات صيانة من كتالوج سيارتك ليقوم الذكاء الاصطناعي بفهرستها واستخدامها في الإجابة على استفساراتك.
            </p>

            <form onSubmit={handleUploadCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">عنوان الموضوع / المكون</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مواصفات زيت فتيس تويوتا كورولا 2008"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">موديل السيارة والكتالوج</label>
                  <input
                    type="text"
                    required
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">الفصل / الباب</label>
                  <input
                    type="text"
                    required
                    value={newChapter}
                    onChange={(e) => setNewChapter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">نص الكتالوج والمواصفات والأرقام</label>
                <textarea
                  rows={6}
                  required
                  placeholder="الصق نصوص الكتالوج، السعات باللتر، اللزوجة، عزوم الربط N.m، أو خطوات الفك والتركيب..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">الكلمات المفتاحية (مفصولة بفاصلة)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  {isSaving ? 'جاري الفهرسة...' : 'حفظ وفهرسة في الكتالوج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
