import { useState } from "react";
import { getInsight, type InsightResponse } from "../../../services/insightsService";

interface ChatWindowProps {
  onInsight?: (response: InsightResponse) => void;
}

const ChatWindow = ({ onInsight }: ChatWindowProps) => {
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const response = await getInsight(question);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.answer },
      ]);
      onInsight?.(response);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process your question.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col rounded-xl border bg-white shadow-sm">
      <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 400 }}>
        {messages.length === 0 && (
          <p className="text-center text-gray-400">
            Ask a question about the Corpus Platform...
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {loading && (
          <p className="text-sm text-gray-400">Thinking...</p>
        )}
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="flex-1 rounded-lg border px-4 py-2 text-sm outline-none focus:border-blue-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
