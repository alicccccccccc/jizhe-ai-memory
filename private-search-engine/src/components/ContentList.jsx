import { useState } from "react";

const GRADIENTS = [
  "from-amber-100 to-amber-50","from-blue-100 to-blue-50","from-violet-100 to-violet-50",
  "from-rose-100 to-rose-50","from-teal-100 to-teal-50","from-emerald-100 to-emerald-50",
  "from-cyan-100 to-cyan-50","from-fuchsia-100 to-fuchsia-50",
];
function pickGradient(id) { let h=0;for(let i=0;i<id.length;i++)h=(h*31+id.charCodeAt(i))|0;return GRADIENTS[Math.abs(h)%GRADIENTS.length]; }
function extractSummary(item) {
  if (item.aiSummary) return item.aiSummary.slice(0,30);
  if (item.type==="image"&&item.ocrText){let f=item.ocrText.split("\n")[0].trim();return f.slice(0,30)+(f.length>30?"...":"");}
  if (item.type==="text"&&item.rawText) return item.rawText.replace(/\s+/g," ").trim().slice(0,30);
  return null;
}

export default function ContentList({ items, query, onSelect, onDelete, onAddFirst }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-20 h-20 rounded-3xl bg-stone-100 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-stone-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-stone-800 mb-2">你的第二大脑</h2>
        <p className="text-sm text-stone-500 max-w-xs leading-relaxed mb-1">
          保存截图、合同、票据、想法和重要信息
        </p>
        <p className="text-xs text-stone-400 mb-8">
          未来找不到的时候，它会帮你想起来。
        </p>
        <button
          onClick={onAddFirst}
          className="px-5 py-2.5 text-sm font-medium text-white rounded-xl bg-accent-600 hover:bg-accent-700 transition-colors"
        >
          保存第一份记忆
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 pb-24">
      {query && <p className="text-xs text-stone-400 mb-4 pl-0.5">找到 {items.length} 条结果</p>}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onSelect={onSelect}
            onDeleteRequest={(id) => setConfirmDelete(id)} confirmDelete={confirmDelete}
            onConfirmDelete={(id) => { onDelete(id); setConfirmDelete(null); }}
            onCancelDelete={() => setConfirmDelete(null)} />
        ))}
      </div>
    </div>
  );
}

function ItemCard({ item, onSelect, onDeleteRequest, confirmDelete, onConfirmDelete, onCancelDelete }) {
  const isImage = item.type === "image" && item.imageBase64;
  const title = item.aiTitle || (item.type === "text" ? ((item.rawText || "").slice(0, 30) + ((item.rawText || "").length > 30 ? "..." : "")) : "截图");
  const summary = extractSummary(item);
  const tags = item.aiTags || item.aiKeywords || [];
  const gradient = pickGradient(item.id);
  const time = new Date(item.createdAt);
  const timeStr = formatRelativeTime(time);
  const isConfirming = confirmDelete === item.id;

  return (
    <div onClick={() => !isConfirming && onSelect(item)}
      className="group bg-white rounded-xl border border-stone-200 overflow-hidden cursor-pointer transition-all duration-150 hover:-translate-y-[1px] hover:shadow-sm">
      {isImage ? (
        <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
          <img src={item.imageBase64} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={`h-32 w-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-stone-900 leading-snug line-clamp-1">{title}</h3>
        {summary && <p className="text-xs text-stone-500 leading-relaxed mt-1 line-clamp-2">{summary}</p>}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map((t, i) => (
              <span key={i} className="px-2 py-0.5 text-[11px] rounded-md bg-amber-50 text-amber-700">{t}</span>
            ))}
            {tags.length > 3 && <span className="px-2 py-0.5 text-[11px] rounded-md bg-stone-100 text-stone-400">+{tags.length - 3}</span>}
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-[11px] text-stone-400">{timeStr}</span>
          {isConfirming ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button onClick={onCancelDelete} className="px-2 py-1 text-[11px] text-stone-500 hover:text-stone-700 rounded-md hover:bg-stone-100 transition-colors">取消</button>
              <button onClick={() => onConfirmDelete(item.id)} className="px-2 py-1 text-[11px] text-red-600 hover:text-white bg-red-50 hover:bg-red-500 rounded-md transition-colors">删除</button>
            </div>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); onDeleteRequest(item.id); }}
              className="w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all" title="删除">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function formatRelativeTime(date) {
  const now = new Date(); const diff = now - date;
  const mins = Math.floor(diff / 60000); const hours = Math.floor(diff / 3600000); const days = Math.floor(diff / 86400000);
  if (mins < 1) return "刚刚"; if (mins < 60) return `${mins} 分钟前`; if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, "0"); const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
