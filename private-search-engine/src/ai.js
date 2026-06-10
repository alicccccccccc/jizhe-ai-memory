const URL = "https://api.deepseek.com/chat/completions";

const EXTRACT_PROMPT = "你是一个内容理解与结构化提取助手。分析用户提供的文本，返回JSON：\n" +
  '{"title":"简短标题不超过20字","summary":"一句话摘要不超过50字","tags":["标签1","标签2","标签3"],"entities":{}}\n' +
  "\nentities 提取规则：从文本中提取关键结构化字段。字段名用英文小写，值为具体数值或文字。\n" +
  "示例：\n" +
  "- 成绩 → {\"score\":\"81\",\"grade\":\"良好\"}\n" +
  "- 合同 → {\"deposit\":\"3000元\",\"rent\":\"1500元\",\"term\":\"一年\"}\n" +
  "- 体检 → {\"date\":\"2025年3月\",\"hospital\":\"人民医院\",\"result\":\"正常\"}\n" +
  "- 面试 → {\"date\":\"6月15日\",\"company\":\"字节跳动\",\"position\":\"产品经理\"}\n" +
  "\n只返回JSON，不要任何额外文字。tags 最多5个，entities 只提取明确出现的信息。";

const QA_SYSTEM = "你是一个私人记忆助手。根据用户保存的内容回答问题。\n" +
  "规则（按优先级）：\n" +
  "1. 优先使用 entities 结构化字段中的具体数值回答\n" +
  "2. 其次使用原文中的具体数字（分数、金额、日期、数量等），原样输出\n" +
  "3. 再次提取具体日期和时间\n" +
  "4. 最后提取结论或评级\n" +
  "5. 只根据提供的上下文回答，不要编造\n" +
  "6. 如果上下文中没有答案，诚实说\"你的记忆中没有相关信息\"\n" +
  "7. 回答中必须包含具体的数字或数据，不要只用模糊词替代\n" +
  "8. 格式：用1-2句话回答（必须包含具体数字），然后空一行，列出引用来源编号如 [1] [2]\n" +
  "9. 禁止：用\"良好\"替代\"81分\"、用\"近期\"替代\"6月10日\"——总是先给具体值，再给等级";

export async function generateAIContent(text) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === "你的API_KEY") {
    console.warn("[AI] No API key, using fallback");
    return fallback(text);
  }

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: EXTRACT_PROMPT },
          { role: "user", content: text.slice(0, 2000) },
        ],
        temperature: 0.3,
        max_tokens: 400,
      }),
    });

    if (!response.ok) throw new Error(`API ${response.status}`);
    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON");

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      title: (parsed.title || "").slice(0, 20),
      summary: (parsed.summary || "").slice(0, 50),
      tags: (parsed.tags || []).slice(0, 5).map((t) => String(t).slice(0, 10)),
      entities: parsed.entities && typeof parsed.entities === "object" ? parsed.entities : {},
    };
  } catch (err) {
    console.warn("[AI] DeepSeek failed:", err.message, "-> fallback");
    return fallback(text);
  }
}

export async function askMemory(question, items) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === "你的API_KEY") return null;
  if (!items || items.length === 0) return null;

  // Context: entities (structured) first, then OCR, then AI summaries
  const context = items.map((item, i) => {
    const parts = [];
    if (item.entities && Object.keys(item.entities).length > 0) {
      parts.push("结构化字段: " + JSON.stringify(item.entities));
    }
    parts.push(item.ocrText || "");
    parts.push(item.rawText || "");
    parts.push(item.aiTitle || "");
    return `[${i + 1}] ${parts.filter(Boolean).join(" | ").slice(0, 2000)}`;
  }).join("\n\n");

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: QA_SYSTEM },
          { role: "user", content: `记忆内容：\n${context}\n\n问题：${question}` },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!response.ok) throw new Error(`API ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
  } catch (err) {
    console.warn("[AI] Q&A failed:", err.message);
    return null;
  }
}

function fallback(text) {
  const firstLine = (text || "").split("\n")[0].trim();
  return {
    title: firstLine ? firstLine.slice(0, 20) : "截图",
    summary: firstLine ? firstLine.slice(0, 30) : "",
    tags: [],
    entities: {},
  };
}
