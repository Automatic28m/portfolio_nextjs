'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { colorMap } from "@/utils/colors";
import { toast, Toaster } from "react-hot-toast";
import DataTable from "react-data-table-component";
import { Search, Edit3, Trash2 } from "lucide-react";
import { addTagAction, deleteTagAction, updateTagAction } from "@/actions/tagActions";

export default function ManageTags({ initialTags }) {
  const router = useRouter();
  // Use local state only for the list filtering/optimistic updates
  const [tags, setTags] = useState(initialTags);
  const [filterText, setFilterText] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(Object.keys(colorMap)[0] || "gray");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const filteredTags = tags.filter((tag) =>
    tag.name?.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleAddTag = async (event) => {
    event.preventDefault();

    const name = newTagName.trim();
    if (!name) {
      toast.error("Tag name is required");
      return;
    }

    setAdding(true);
    
    // If editing, call update instead of add
    if (editingId) {
      const loadingToast = toast.loading("Updating tag...");
      try {
        const result = await updateTagAction(editingId, name, newTagColor);
        if (!result.success) {
          throw new Error(result.error || "Failed to update tag");
        }

        setTags((prev) =>
          prev.map((tag) =>
            tag.id === editingId ? { ...tag, name, color: newTagColor } : tag
          )
        );
        setNewTagName("");
        setEditingId(null);
        toast.success(`Tag "${name}" updated successfully!`, { id: loadingToast });
        router.refresh();
      } catch (error) {
        toast.error(error.message || "Failed to update tag", { id: loadingToast });
      } finally {
        setAdding(false);
      }
      return;
    }

    // Otherwise, create new tag
    const loadingToast = toast.loading("Creating tag...");
    try {
      const result = await addTagAction(name, newTagColor);
      if (!result.success) {
        throw new Error(result.error || "Failed to add tag");
      }

      setTags((prev) => {
        const exists = prev.some((tag) => tag.id === result.tag?.id);
        if (exists || !result.tag) return prev;
        return [...prev, result.tag];
      });
      setNewTagName("");
      toast.success(`Tag "${name}" created successfully!`, { id: loadingToast });
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to add tag", { id: loadingToast });
    } finally {
      setAdding(false);
    }
  };

  const handleEditTag = (tagId, tagName, tagColor) => {
    setEditingId(tagId);
    setNewTagName(tagName);
    setNewTagColor(tagColor);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewTagName("");
    setNewTagColor(Object.keys(colorMap)[0] || "gray");
  };

  const handleDeleteTag = async (tagId, tagName) => {
    if (!confirm(`Are you sure you want to delete the tag "${tagName}"?`)) {
      return;
    }

    setDeletingId(tagId);
    const loadingToast = toast.loading("Deleting tag...");
    try {
      const result = await deleteTagAction(tagId);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete tag");
      }

      setTags((prev) => prev.filter((tag) => tag.id !== tagId));
      toast.success(`Tag "${tagName}" deleted successfully!`, { id: loadingToast });
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete tag", { id: loadingToast });
    } finally {
      setDeletingId(null);
    }
  };

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
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditTag(row.id, row.name, row.color)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Edit tag"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => handleDeleteTag(row.id, row.name)}
            disabled={deletingId === row.id}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Delete tag"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      width: "130px",
    },
  ];

  return (
    <div className="space-y-8 text-slate-900">
      <Toaster />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-durer">Skill Tags</h1>
        <form className="flex gap-2" onSubmit={handleAddTag}>
            {editingId && (
              <span className="text-sm font-semibold text-blue-600 py-2 px-2 bg-blue-50 rounded-lg">
                ✎ Editing
              </span>
            )}
            <input
              name="name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Tag Name"
              className="p-2 border rounded-lg text-slate-900"
            />
            <select
              name="color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="p-2 border rounded-lg text-slate-900"
            >
                {Object.keys(colorMap).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              type="submit"
              disabled={adding}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {adding ? (editingId ? "Updating..." : "Adding...") : (editingId ? "✓ Save" : "+ Add")}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-slate-400 text-white px-4 py-2 rounded-lg hover:bg-slate-500 transition"
              >
                Cancel
              </button>
            )}
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