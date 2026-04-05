'use client';
import { useState } from "react";
import { colorMap } from "@/utils/colors";
import { toast } from "react-hot-toast";
import DataTable from "react-data-table-component";
import { Search, Edit3, Trash2 } from "lucide-react";

export default function ManageTags({ initialTags }) {
  // Use local state only for the list filtering/optimistic updates
  const [tags, setTags] = useState(initialTags);
  const [filterText, setFilterText] = useState("");

  const filteredTags = tags.filter((tag) =>
    tag.name?.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Tag Name",
      selector: (row) => row.name,
      sortable: true,
      grow: 2,
    },
    {
      name: "Color",
      cell: (row) => {
        const colorClass = colorMap[row.color?.toLowerCase()] || colorMap.gray;
        return (
          <span className={`px-2 py-1 rounded-md text-xs font-bold border ${colorClass}`}>
            {row.color}
          </span>
        );
      },
      sortable: true,
      selector: (row) => row.color,
    },
    {
      name: "Actions",
      cell: () => (
        <div className="flex gap-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" aria-label="Edit tag">
            <Edit3 size={16} />
          </button>
          <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" aria-label="Delete tag">
            <Trash2 size={16} />
          </button>
        </div>
      ),
      width: "130px",
    },
  ];

  return (
    <div className="space-y-8 text-slate-900">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-durer">Skill Tags</h1>
        <form className="flex gap-2">
            <input name="name" placeholder="Tag Name" className="p-2 border rounded-lg text-slate-900" />
            <select name="color" className="p-2 border rounded-lg text-slate-900">
                {Object.keys(colorMap).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Add</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-slate-900">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input
              type="text"
              placeholder="Search tags..."
              className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredTags}
          pagination
          responsive
          striped
          highlightOnHover
          noDataComponent={<span className="text-slate-700 py-4">No tags found.</span>}
        />
      </div>
    </div>
  );
}