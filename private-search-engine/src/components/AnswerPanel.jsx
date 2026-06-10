export default function AnswerPanel({ answer, sources, onSourceClick }) {
  if (!answer) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-6 mb-6">
      <div className="bg-white rounded-xl border border-accent-200 overflow-hidden">
        {/* Answer header */}
        <div className="px-5 py-3 bg-accent-50/50 border-b border-accent-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <span className="text-xs font-medium text-accent-700">AI 回答</span>
        </div>

        {/* Answer content */}
        <div className="px-5 py-4">
          <p className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">{answer}</p>
        </div>

        {/* Source cards */}
        {sources && sources.length > 0 && (
          <div className="px-5 pb-4 space-y-2">
            <p className="text-[11px] text-stone-400 font-medium">来源</p>
            {sources.slice(0, 3).map((item, i) => (
              <button
                key={item.id}
                onClick={() => onSourceClick(item)}
                className="w-full text-left flex items-center gap-3 p-2.5 rounded-lg
                           border border-stone-100 hover:border-stone-200 hover:bg-stone-50
                           transition-colors"
              >
                <span className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center text-[10px] font-medium text-stone-400 flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-700 line-clamp-1 font-medium">
                    {item.aiTitle || "截图"}
                  </p>
                  {item.aiSummary && (
                    <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                      {item.aiSummary.slice(0, 40)}
                    </p>
                  )}
                </div>
                <svg className="w-3.5 h-3.5 text-stone-300 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
