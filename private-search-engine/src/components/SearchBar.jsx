import { useState, useRef, useEffect } from "react";
import { generateSuggestions } from "../suggestions";

export default function SearchBar({ onSearch, autoFocus, recentItems }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const suggestions = generateSuggestions(recentItems || []);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  const handleSuggestion = (q) => {
    setValue(q);
    onSearch(q);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-[640px] mx-auto px-4 pt-16 pb-10">
      <div className="relative">
        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none"
          fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="搜索你的记忆..."
          className="w-full h-16 pl-14 pr-16 rounded-2xl border text-lg
                     bg-white text-stone-900 placeholder:text-stone-400
                     transition-all duration-200
                     outline-none"
          style={{
            borderColor: focused ? "#0f766e" : "#e7e5e4",
            boxShadow: focused
              ? "0 0 0 3px rgba(15,118,110,0.1), 0 2px 8px rgba(0,0,0,0.04)"
              : "0 1px 3px rgba(0,0,0,0.04)",
          }}
        />

        {value ? (
          <button
            onClick={handleClear}
            className="absolute right-14 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center
                       rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-stone-400
                           bg-stone-100 px-2 py-0.5 rounded-md font-mono tracking-tight">
            ⌘K
          </span>
        )}
      </div>

      {/* Dynamic suggestions */}
      {!value && suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4 justify-center">
          <span className="text-xs text-stone-400">最近记忆</span>
          {suggestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSuggestion(q)}
              className="text-xs text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200
                         px-3 py-1.5 rounded-full transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
