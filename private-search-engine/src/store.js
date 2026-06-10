// store.js — local storage with structured entities support

const STORAGE_KEY = "ps_items";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return items.map((item) => {
      if (item.aiKeywords && !item.aiTags) {
        item.aiTags = item.aiKeywords;
        delete item.aiKeywords;
      }
      if (!item.entities) item.entities = {};
      return item;
    });
  } catch (e) {
    console.error("Failed to read:", e);
    return [];
  }
}

function writeAll(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch (e) {
    console.error("Failed to write:", e);
    return false;
  }
}

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function tokenize(query) {
  const tokens = [];
  const parts = query.split(/\s+/).filter(Boolean);
  for (const part of parts) {
    tokens.push(part);
    if (/[\u4e00-\u9fff]/.test(part) && part.length > 1) {
      for (const ch of part) tokens.push(ch);
      if (part.length >= 4)
        for (let i = 0; i <= part.length - 2; i++) tokens.push(part.slice(i, i + 2));
    }
  }
  return [...new Set(tokens)];
}

export async function addTextItem(text, aiTitle, aiTags, aiSummary, entities) {
  const items = readAll();
  const item = {
    id: crypto.randomUUID(), type: "text", content: text, rawText: text,
    imageBase64: null, ocrText: null,
    aiTitle: aiTitle || null, aiTags: aiTags || [], aiSummary: aiSummary || null,
    entities: entities || {},
    createdAt: Date.now(),
  };
  items.push(item);
  if (!writeAll(items)) throw new Error("存储空间不足");
  return item;
}

export async function addImageItem(base64, ocrText, aiTitle, aiTags, aiSummary, entities) {
  const items = readAll();
  const item = {
    id: crypto.randomUUID(), type: "image", content: ocrText || "",
    rawText: null, imageBase64: base64, ocrText: ocrText || "",
    aiTitle: aiTitle || null, aiTags: aiTags || [], aiSummary: aiSummary || null,
    entities: entities || {},
    createdAt: Date.now(),
  };
  items.push(item);
  if (!writeAll(items)) throw new Error("图片过大");
  return item;
}

export async function getAllItems() { return readAll(); }

export async function getItemById(id) { return readAll().find((i) => i.id === id) || null; }

export async function searchItems(query) {
  const all = readAll();
  if (!query || !query.trim()) return all.sort((a, b) => b.createdAt - a.createdAt);

  const tokens = tokenize(query.toLowerCase().trim());
  const scored = all.map((item) => {
    const searchText = [
      item.rawText, item.ocrText, item.content,
      item.aiTitle, item.aiSummary,
      (item.aiTags || item.aiKeywords || []).join(" "),
      Object.values(item.entities || {}).join(" "),
    ].filter(Boolean).join(" ").toLowerCase();

    let score = 0;
    for (const token of tokens) {
      const regex = new RegExp(escapeRegex(token), "g");
      const matches = searchText.match(regex);
      if (matches) { score += 10; score += matches.length; }
    }
    return { item, score };
  }).filter((s) => s.score > 0).sort((a, b) => b.score - a.score).map((s) => s.item);

  return scored;
}

export async function deleteItem(id) {
  let items = readAll();
  items = items.filter((i) => i.id !== id);
  writeAll(items);
}
