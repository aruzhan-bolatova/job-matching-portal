"use client";
import { useState, useEffect } from "react";

export default function JobAssistantChat() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("jobAssistantMessages");
      return stored
        ? JSON.parse(stored)
        : [
            {
              role: "assistant",
              content:
                "Hi — I'm your job assistant. Ask me about open roles, companies, or how to apply!",
            },
          ];
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("jobAssistantMessages", JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      if (data.reply) {
        const cleanedContent = data.reply.replace(/```html|```/g, "").trim();
        setMessages((prev) => [...prev, { role: "assistant", content: cleanedContent }]);
      }
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Hmm — something went wrong. Try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-white text-white rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-90 transition-all z-50"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[320px] h-[440px] bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-gray-200 bg-white">
        <h2 className="text-base font-medium text-gray-900">Job Assistant</h2>
        <button
          onClick={() => setIsExpanded(false)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          ✖️
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`m-3 p-3 rounded-lg max-w-[80%] text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-black text-white ml-auto"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            {msg.role === "user" ? msg.content : (
              <div
                className="text-gray-800"
                dangerouslySetInnerHTML={{
                  __html: msg.content,  // This ensures the response is rendered as HTML
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-1.5 bg-white border-t border-gray-200">
        <form onSubmit={sendMessage} className="flex gap-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about jobs..."
            className="flex-1 p-2.5 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-2 py-2 bg-black text-white rounded-lg hover:bg-opacity-90 disabled:bg-opacity-60 text-sm"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}