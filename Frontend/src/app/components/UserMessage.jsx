import React from 'react';

export default function UserMessage({ message }) {
  return (
    <div className="flex justify-end my-4">
      <div className="bg-blue-600 text-white px-5 py-3 rounded-xl max-w-[70%]">
        {message}
      </div>
    </div>
  );
}