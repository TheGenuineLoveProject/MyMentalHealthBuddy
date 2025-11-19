import { useState } from "react";

export default function JournalPage() {
  const [text, setText] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-700">Journal</h1>
      <textarea
        className="w-full mt-4 p-3 border rounded h-52"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write your thoughts here..."
      />
      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
        Save Entry
      </button>
    </div>
  );
}