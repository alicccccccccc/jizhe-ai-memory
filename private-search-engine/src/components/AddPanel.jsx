import { useState, useRef, useEffect } from "react";
import { addTextItem, addImageItem } from "../store";
import { generateAIContent } from "../ai";
import UploadZone from "./UploadZone";

export default function AddPanel({ onClose, onAdded }) {
  const [mode, setMode] = useState(null);
  const [text, setText] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);
  const [userKeywords, setUserKeywords] = useState("");
  const [savedBase64, setSavedBase64] = useState(null);
  const textareaRef = useRef(null);
  const keywordRef = useRef(null);

  useEffect(() => {
    if (mode === "text" && textareaRef.current) textareaRef.current.focus();
  }, [mode]);

  useEffect(() => {
    if (aiStatus === "empty" && keywordRef.current) keywordRef.current.focus();
  }, [aiStatus]);

  const handleFileSelected = (base64) => {
    setImageSrc(base64);
    setMode("image");
    setSavedBase64(base64);
    runOCR(base64);
  };

  const runOCR = async (base64) => {
    setOcrProgress({ status: "loading", progress: 0, text: "" });
    setAiStatus(null);
    setUserKeywords("");
    setSavedBase64(base64);

    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("chi_sim", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setOcrProgress((prev) => ({ ...prev, progress: Math.round(m.progress * 100) }));
          }
        },
      });
      const { data } = await worker.recognize(base64);
      await worker.terminate();
      const ocrText = data.text.trim();
      setOcrProgress({ status: "done", progress: 100, text: ocrText });

      if (!ocrText) { setAiStatus("empty"); return; }
      setAiStatus("generating");
      const ai = await generateAIContent(ocrText);
      setAiStatus("done");
      const item = await addImageItem(base64, ocrText, ai.title, ai.tags, ai.summary, ai.entities);
      onAdded(item);
    } catch (err) {
      console.error("OCR failed:", err);
      setOcrProgress({ status: "error", progress: 0, text: "" });
      setAiStatus("error");
    }
  };

  const handleSaveWithKeywords = async () => {
    const keywords = userKeywords.split(/[,，\s]+/).map(k => k.trim()).filter(Boolean);
    const item = await addImageItem(savedBase64 || imageSrc, "", "截图", keywords, "", {});
    onAdded(item);
    onClose();
  };

  const handleRetry = () => { if (savedBase64) runOCR(savedBase64); };

  const handleSaveText = async () => {
    if (!text.trim()) return;
    setAiStatus("generating");
    const ai = await generateAIContent(text.trim());
    setAiStatus("done");
    const item = await addTextItem(text.trim(), ai.title, ai.tags, ai.summary, ai.entities);
    onAdded(item);
    onClose();
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSaveText(); };

  const accentBtn = "flex-1 py-2.5 text-sm font-medium text-white rounded-lg bg-accent-600 hover:bg-accent-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors";
  const ghostBtn = "flex-1 py-2.5 text-sm text-stone-500 hover:text-stone-700 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors";

  if (mode === null) {
    return (
      <div className="fixed inset-0 z-40 flex items-end justify-center pb-8" onClick={onClose}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 z-50" onClick={e => e.stopPropagation()}>
          <h3 className="text-base font-medium text-stone-800 mb-4">添加内容</h3>
          <div className="space-y-2">
            <button onClick={() => setMode("text")} className="w-full flex items-center gap-3 p-4 rounded-xl border border-stone-200 hover:border-accent-200 hover:bg-accent-50/50 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0"><svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg></div>
              <div><p className="text-sm font-medium text-stone-800">输入文字</p><p className="text-xs text-stone-400">AI 自动生成标题、摘要和标签</p></div>
            </button>
            <button onClick={() => setMode("image")} className="w-full text-left">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-stone-300 hover:border-accent-200 hover:bg-accent-50/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0"><svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Zm16.5-7.5h.008v.008h-.008v-.008Z" /></svg></div>
                <div><p className="text-sm font-medium text-stone-800">上传图片</p><p className="text-xs text-stone-400">拖拽或选择文件，自动 OCR + AI 理解</p></div>
              </div>
            </button>
          </div>
          <button onClick={onClose} className="mt-4 w-full py-2 text-sm text-stone-400 hover:text-stone-600 transition-colors">取消</button>
        </div>
      </div>
    );
  }

  if (mode === "text") {
    return (
      <div className="fixed inset-0 z-40 flex items-end justify-center pb-8" onClick={onClose}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 z-50" onClick={e => e.stopPropagation()}>
          <textarea ref={textareaRef} value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown} placeholder="输入或粘贴文字内容..." rows={5} className="w-full p-3 rounded-xl border border-stone-200 text-sm text-stone-800 placeholder:text-stone-400 resize-none focus:outline-none focus:border-accent-600 focus:ring-2 focus:ring-accent-100" />
          <p className="text-xs text-stone-400 mt-1">Ctrl+Enter 保存，AI 自动生成摘要</p>
          {aiStatus === "generating" && (<p className="text-xs text-accent-600 mt-1 flex items-center gap-1"><span className="w-3 h-3 border border-accent-400 border-t-transparent rounded-full animate-spin" />DeepSeek AI 正在理解内容...</p>)}
          <div className="flex gap-2 mt-3">
            <button onClick={() => { setMode(null); setText(""); setAiStatus(null); }} className={ghostBtn}>返回</button>
            <button onClick={handleSaveText} disabled={!text.trim()} className={accentBtn}>保存</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center pb-8" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 z-50" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-medium text-stone-800 mb-3">上传图片</h3>
        {!imageSrc ? (
          <UploadZone onFileSelected={handleFileSelected} />
        ) : (
          <>
            <img src={imageSrc} alt="预览" className="w-full rounded-lg border border-stone-200" />
            {ocrProgress && ocrProgress.status === "loading" && (
              <div className="mt-3"><div className="flex items-center gap-2 text-sm text-stone-500"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>正在 OCR 识别... {ocrProgress.progress}%</div><div className="mt-1 w-full h-1.5 bg-stone-100 rounded-full overflow-hidden"><div className="h-full bg-accent-500 rounded-full transition-all duration-300" style={{ width: `${ocrProgress.progress}%` }} /></div></div>
            )}
            {ocrProgress && ocrProgress.status === "done" && (
              <div className="mt-3 space-y-2">
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-100"><p className="text-xs text-stone-400 mb-1">识别文字</p><p className="text-sm text-stone-700 whitespace-pre-wrap">{ocrProgress.text || "(未识别到文字)"}</p></div>
                {aiStatus === "generating" && (<div className="p-3 rounded-lg bg-accent-50 border border-accent-100 flex items-center gap-2"><span className="w-3 h-3 border border-accent-400 border-t-transparent rounded-full animate-spin" /><p className="text-xs text-accent-600">DeepSeek AI 正在理解内容...</p></div>)}
                {aiStatus === "done" && (<div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-2"><svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg><p className="text-xs text-emerald-700">AI 理解完成</p></div>)}
                {aiStatus === "empty" && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 space-y-3">
                    <div className="flex items-center gap-2"><svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg><p className="text-sm text-amber-800 font-medium">未提取到足够信息</p></div>
                    <p className="text-xs text-amber-600">OCR 未能从此图片中提取文字。你可以手动添加关键词，这些关键词将用于搜索和 AI 检索。</p>
                    <div><input ref={keywordRef} type="text" value={userKeywords} onChange={e => setUserKeywords(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSaveWithKeywords(); }} placeholder="输入关键词，用逗号或空格分隔..." className="w-full p-2.5 rounded-lg border border-amber-200 text-sm text-stone-800 placeholder:text-stone-400 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" /><p className="text-[11px] text-amber-500 mt-1">例如：合同 押金 房东 2025年</p></div>
                    <div className="flex gap-2"><button onClick={handleRetry} className="flex-1 py-2 text-xs text-stone-600 hover:text-stone-800 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors">重新识别</button><button onClick={handleSaveWithKeywords} disabled={!userKeywords.trim()} className="flex-1 py-2 text-xs font-medium text-white rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">保存</button></div>
                  </div>
                )}
                {aiStatus === "error" && (<div className="p-2 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2"><svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg><p className="text-xs text-red-700">OCR 识别失败，请重试</p></div>)}
              </div>
            )}
            {ocrProgress && ocrProgress.status === "error" && (<div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-100"><p className="text-sm text-red-600">OCR 识别失败，请尝试重新截图或检查图片清晰度。</p></div>)}
          </>
        )}
        <div className="flex gap-2 mt-4">
          <button onClick={() => { setMode(null); setImageSrc(null); setOcrProgress(null); setAiStatus(null); setUserKeywords(""); }} className={ghostBtn}>{imageSrc ? "放弃" : "返回"}</button>
          {imageSrc && ocrProgress?.status === "done" && aiStatus !== "error" && aiStatus !== "empty" && (<button onClick={onClose} className={accentBtn}>完成</button>)}
        </div>
      </div>
    </div>
  );
}
