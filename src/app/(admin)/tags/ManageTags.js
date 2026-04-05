'use client';
import { useState } from "react";
import { colorMap } from "@/utils/colors";
import { toast } from "react-hot-toast";

export default function ManageTags({ initialTags }) {
  // Use local state only for the list filtering/optimistic updates
  const [tags, setTags] = useState(initialTags);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-durer">Skill Tags</h1>
        <form className="flex gap-2">
            <input name="name" placeholder="Tag Name" className="p-2 border rounded-lg" />
            <select name="color" className="p-2 border rounded-lg">
                {Object.keys(colorMap).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Add</button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tags.map((tag) => (
          <div key={tag.id} className={`p-4 rounded-2xl border flex flex-col items-center gap-3 ${colorMap[tag.color] || colorMap.gray}`}>
            <span className="font-bold text-sm">{tag.name}</span>
            <div className="flex gap-2">
                <button className="text-[10px] uppercase font-black hover:underline">Edit</button>
                <button className="text-[10px] uppercase font-black text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}