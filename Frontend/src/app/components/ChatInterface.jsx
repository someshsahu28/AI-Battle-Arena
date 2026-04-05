import React, { useState, useRef, useEffect } from 'react';
import UserMessage from './UserMessage';
import ArenaResponse from './ArenaResponse';
import axios from "axios";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const endOfMessagesRef = useRef(null);

  // ✅ API URL (auto switches local vs production)
  const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://ai-battle-arena-3ahd.onrender.com";

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/invoke`, {
        input: inputValue
      });

      const data = response.data;
      console.log("Response:", data);

      const newMessage = {
        id: Date.now(),
        problem: inputValue,
        ...data.result
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputValue('');

    } catch (error) {
      console.error("❌ Backend Error:", error);

      if (axios.isCancel(error)) {
        console.warn('Request was cancelled');
      } else {
        alert("Server error. Check backend / CORS.");
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">

      {/* Header */}
      <header className="py-4 px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 flex justify-center">
        <h1 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">
          AI Chat Arena
        </h1>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 w-full max-w-6xl mx-auto flex flex-col">

        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-zinc-400">
            <div className="text-center">
              <h2 className="text-2xl font-light mb-2 text-zinc-600 dark:text-zinc-300">
                Welcome to the Arena
              </h2>
              <p>Type a problem below to see two AI solutions go head-to-head.</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
              <UserMessage message={msg.problem} />
              <ArenaResponse
                solution1={msg.solution_1}
                solution2={msg.solution_2}
                judge={msg.judge}
              />
            </div>
          ))
        )}

        <div ref={endOfMessagesRef} />
      </main>

      {/* Input */}
      <div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center">

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a coding question..."
              className="w-full bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-none rounded-full py-4 pl-6 pr-16 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-zinc-400 shadow-sm text-lg"
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full disabled:opacity-50"
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                "➤"
              )}
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}