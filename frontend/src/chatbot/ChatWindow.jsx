import { Loader2, Send, User, Bot } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../api";

export default function ChatWindow({ onClose }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I assist you today?" },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Show typing indicator
    setMessages((prev) => [...prev, { from: "bot", text: "Typing..." }]);

    try {
      const response = await axios.post(`${baseUrl}/api/chat`, {
        question: input,
      });

      if (response.status !== 200) {
        throw new Error(response.statusText);
      }

      const botReply = { from: "bot", text: response.data.answer };

      // Replace "Typing..." with actual bot response
      setMessages((prev) => [...prev.slice(0, -1), botReply]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { from: "bot", text: "Sorry, I couldn't process your request." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="w-80 h-96 bg-white rounded-xl shadow-xl flex flex-col border border-gray-200 animate-slide-up transition-all">
      {/* Header */}
      <div className="bg-[#1e1e2f] text-white p-3 rounded-t-xl flex justify-between items-center shadow">
        <h2 className="text-sm font-bold tracking-wide">EgluBot</h2>
      </div>

      {/* Chat messages */}
      <div
        className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50 text-sm"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`::-webkit-scrollbar { display: none; }`}</style>

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.from === "bot" && (
              <div className="bg-gray-300 p-1 rounded-full">
                <Bot size={16} className="text-gray-700" />
              </div>
            )}

            <div
              className={`max-w-[75%] px-4 py-2 rounded-xl ${
                msg.from === "user"
                  ? "bg-[#1e1e2f] text-white ml-auto"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {loading && msg.text === "Typing..." ? (
                <div className="flex items-center gap-1">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Typing...</span>
                </div>
              ) : (
                msg.text
              )}
            </div>

            {msg.from === "user" && (
              <div className="bg-[#1e1e2f] p-1 rounded-full">
                <User size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t p-2 bg-white rounded-b-xl">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f2937] transition"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-[#1e1e2f] hover:bg-[#1f2937] text-white p-2 rounded-md transition flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
