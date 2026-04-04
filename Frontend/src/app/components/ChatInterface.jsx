import React, { useState, useRef, useEffect } from 'react';
import UserMessage from './UserMessage';
import ArenaResponse from './ArenaResponse';

const MOCK_RESPONSE = {
  solution_1: `Here is a clean Python solution using modern syntax:

\`\`\`python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
\`\`\`

This approach has O(n) time complexity and O(1) space.`,

  solution_2: `A recursive solution can be elegant but less efficient:

\`\`\`python
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)
\`\`\`

Note: this has O(2^n) time complexity.`,

  judge: {
    solution_1_score: 10,
    solution_2_score: 5,
    solution_1_reasoning: "Excellent, optimal solution. Space complexity is O(1).",
    solution_2_reasoning: "Recursive solution is very slow without memoization."
  }
};

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      problem: inputValue,
      ...MOCK_RESPONSE
    };

    // ✅ FIXED state update
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      
      {/* Header */}
      <header className="py-4 px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-center">
        <h1 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">
          AI Chat Arena
        </h1>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 max-w-6xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-zinc-400">
            <div>
              <h2 className="text-2xl mb-2">Welcome to the Arena</h2>
              <p>Type a coding question below 👇</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="mb-10">
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
      <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a coding question..."
            className="w-full bg-zinc-100 dark:bg-zinc-950 rounded-full py-3 pl-5 pr-14 outline-none text-lg"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 bg-blue-600 text-white p-2 rounded-full disabled:opacity-50"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}