import { useState, useEffect, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import ContentList from "./components/ContentList";
import AddPanel from "./components/AddPanel";
import DetailView from "./components/DetailView";
import AnswerPanel from "./components/AnswerPanel";
import { getAllItems, searchItems, deleteItem } from "./store";
import { askMemory } from "./ai";

const QUESTION_PATTERN = /[?？吗呢么多少什么怎么哪谁为何是不是可否]/;

export default function App() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiAnswer, setAiAnswer] = useState(null);
  const [aiSources, setAiSources] = useState(null);
  const [answerLoading, setAnswerLoading] = useState(false);

  useEffect(() => {
    getAllItems()
      .then((all) => setItems(all.sort((a, b) => b.createdAt - a.createdAt)))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = useCallback(async (q) => {
    setQuery(q);
    setAiAnswer(null);
    setAiSources(null);

    if (q.trim()) {
      const results = await searchItems(q);
      setSearchResults(results);

      // Trigger Q&A if question-like
      if (QUESTION_PATTERN.test(q) && results.length > 0) {
        setAnswerLoading(true);
        const topResults = results.slice(0, 3);
        const answer = await askMemory(q, topResults);
        setAiAnswer(answer);
        setAiSources(topResults);
        setAnswerLoading(false);
      }
    } else {
      const all = await getAllItems();
      setSearchResults(null);
      setItems(all.sort((a, b) => b.createdAt - a.createdAt));
    }
  }, []);

  const handleAdded = useCallback(async () => {
    const all = await getAllItems();
    setItems(all.sort((a, b) => b.createdAt - a.createdAt));
    if (query.trim()) {
      const results = await searchItems(query);
      setSearchResults(results);
    }
  }, [query]);

  const handleDelete = useCallback(async (id) => {
    await deleteItem(id);
    const all = await getAllItems();
    setItems(all.sort((a, b) => b.createdAt - a.createdAt));
    if (query.trim()) {
      const results = await searchItems(query);
      setSearchResults(results);
    }
    if (selectedItem?.id === id) setSelectedItem(null);
  }, [query, selectedItem]);

  const displayedItems = searchResults || items;

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <header className="h-10 flex items-center justify-between px-6">
        <h1 className="text-[13px] font-medium text-stone-800 tracking-normal select-none">记着</h1>
        <span className="text-[11px] text-stone-400 select-none">⌘K 搜索</span>
      </header>

      <SearchBar onSearch={handleSearch} autoFocus recentItems={items.slice(0, 5)} />

      {/* AI Answer */}
      {aiAnswer && (
        <AnswerPanel answer={aiAnswer} sources={aiSources} onSourceClick={setSelectedItem} />
      )}

      {/* Answer loading */}
      {answerLoading && (
        <div className="max-w-[1200px] mx-auto px-6 mb-6">
          <div className="bg-white rounded-xl border border-accent-100 p-5 flex items-center gap-3">
            <span className="w-4 h-4 border-2 border-accent-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-accent-600">AI 正在分析你的记忆...</span>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-28">
          <div className="w-5 h-5 border-2 border-stone-200 border-t-accent-500 rounded-full animate-spin" />
        </div>
      ) : (
        <ContentList items={displayedItems} query={query} onSelect={setSelectedItem} onDelete={handleDelete} onAddFirst={() => setShowAdd(true)} />
      )}

      <button onClick={() => setShowAdd(true)}
        className="fixed bottom-6 right-6 z-30 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-stone-600 hover:border-accent-200 hover:text-accent-700 shadow-sm transition-all duration-150">
        + 保存内容
      </button>

      {showAdd && <AddPanel onClose={() => setShowAdd(false)} onAdded={handleAdded} />}

      {selectedItem && <DetailView item={selectedItem} onClose={() => setSelectedItem(null)} onDelete={handleDelete} />}
    </div>
  );
}

