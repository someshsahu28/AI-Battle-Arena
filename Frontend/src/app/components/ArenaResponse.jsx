import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export default function ArenaResponse({ solution1, solution2, judge }) {

  useEffect(() => {
    setTimeout(() => hljs.highlightAll(), 0);
  }, [solution1, solution2]);

  const Markdown = ({ content }) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children }) {
          return !inline ? (
            <pre className="bg-black text-white p-4 rounded-xl overflow-x-auto my-4">
              <code className={className}>{children}</code>
            </pre>
          ) : (
            <code className="bg-gray-200 px-1 rounded">{children}</code>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <div className="grid md:grid-cols-2 gap-6 my-6">

      {/* Solution 1 */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow">
        <h3 className="font-bold mb-4 text-emerald-500">Solution 1</h3>
        {solution1 ? <Markdown content={solution1} /> : <p>No data</p>}
      </div>

      {/* Solution 2 */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow">
        <h3 className="font-bold mb-4 text-violet-500">Solution 2</h3>
        {solution2 ? <Markdown content={solution2} /> : <p>No data</p>}
      </div>

      {/* Judge */}
      {judge && (
        <div className="col-span-2 bg-zinc-100 dark:bg-zinc-800 p-6 rounded-2xl">
          <h3 className="font-bold mb-4">⚖️ Judge</h3>

          <p>Solution 1 Score: {judge.solution_1_score}/10</p>
          <p className="mb-3">{judge.solution_1_reasoning}</p>

          <p>Solution 2 Score: {judge.solution_2_score}/10</p>
          <p>{judge.solution_2_reasoning}</p>
        </div>
      )}
    </div>
  );
}