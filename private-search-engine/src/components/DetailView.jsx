export default function DetailView({ item, onClose, onDelete }) {
  if (!item) return null;

  const time = new Date(item.createdAt);
  const timeStr = time.toLocaleString("zh-CN", {
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });

  const tags = item.aiTags || item.aiKeywords || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-8" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col z-50 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">{item.type === "image" ? "截图" : "文字"}</span>
            <span className="text-xs text-stone-400">{timeStr}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => { onDelete(item.id); onClose(); }} className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="删除">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* AI Title & Tags */}
          {item.aiTitle && (
            <div>
              <h2 className="text-lg font-semibold text-stone-900">{item.aiTitle}</h2>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs rounded-md bg-amber-50 text-amber-700">{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI Summary */}
          {item.aiSummary && (
            <div className="p-4 rounded-xl bg-accent-50/50 border border-accent-100">
              <p className="text-xs text-accent-600 mb-1 font-medium">AI 摘要</p>
              <p className="text-sm text-stone-700 leading-relaxed">{item.aiSummary}</p>
            </div>
          )}

          {/* Original image */}
          {item.type === "image" && item.imageBase64 && (
            <img src={item.imageBase64} alt="原始截图" className="w-full rounded-lg border border-stone-200" />
          )}

          {/* Original text */}
          {item.type === "text" && item.rawText && (
            <div className="p-4 rounded-lg bg-stone-50 border border-stone-100">
              <p className="text-xs text-stone-400 mb-1">原文</p>
              <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">{item.rawText}</p>
            </div>
          )}

          {/* OCR text */}
          {item.ocrText && (
            <div className="p-4 rounded-lg bg-stone-50 border border-stone-100">
              <p className="text-xs text-stone-400 mb-1">OCR 识别文字</p>
              <p className="text-sm text-stone-600 whitespace-pre-wrap leading-relaxed">{item.ocrText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
