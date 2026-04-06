'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
import { updatePortfolioAction } from "@/actions/portfolioActions";
import { colorMap } from "@/utils/colors";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

export default function EditPortfolioForm({
    id,
    initialPortfolio,
    portfolioTypes,
    skillTypes,
    initialSkillIds,
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(initialPortfolio.title || "");
    const [contents, setContents] = useState(initialPortfolio.contents || "");
    const [location, setLocation] = useState(initialPortfolio.event_location || "");
    const [typeId, setTypeId] = useState(String(initialPortfolio.portfolio_type_id || ""));
    const [selectedSkillIds, setSelectedSkillIds] = useState(initialSkillIds || []);
    const [eventDate, setEventDate] = useState(
        initialPortfolio.event_date ? new Date(initialPortfolio.event_date) : null
    );

    const toggleSkillId = (skillId, checked) => {
        const normalized = String(skillId);
        if (checked) {
            setSelectedSkillIds((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
            return;
        }

        setSelectedSkillIds((prev) => prev.filter((id) => id !== normalized));
    };

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("contents", contents);
            formData.append("location", location);
            formData.append("event_date", eventDate ? eventDate.toISOString().split("T")[0] : "");
            formData.append("type_id", typeId);

            selectedSkillIds.forEach((skillId) => {
                formData.append("skill_type_ids", skillId);
            });

            const fileInput = event.currentTarget.elements.namedItem("thumbnail");
            if (fileInput?.files?.[0]) {
                if (fileInput.files[0].size > MAX_FILE_BYTES) {
                    throw new Error("Thumbnail exceeds 5MB. Please compress the image and try again.");
                }
                formData.append("thumbnail", fileInput.files[0]);
            }

            const result = await updatePortfolioAction(id, formData);

            if (!result.success) {
                throw new Error(result.error || "Failed to update portfolio");
            }

            toast.success("Portfolio updated successfully!");
            router.push("/portfolio");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to update portfolio");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <Toaster />
            <form onSubmit={handleSubmit} className="bg-white text-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
                <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-3xl font-bold font-durer text-slate-900">Edit Project</h2>
                    <p className="text-slate-700 text-sm">Update your portfolio item details and tags.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-700 tracking-widest">Project Title</label>
                        <input
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Smart Bin System"
                            className="w-full p-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-700 tracking-widest">Category Type</label>
                        <select
                            required
                            value={typeId}
                            onChange={(e) => setTypeId(e.target.value)}
                            className="w-full p-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="">Select Category</option>
                            {portfolioTypes.map((type) => (
                                <option key={type.id} value={type.id}>{type.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-700 tracking-widest">Contents / Description</label>
                    <textarea
                        value={contents}
                        onChange={(e) => setContents(e.target.value)}
                        rows={4}
                        placeholder="Describe the project goals and your role..."
                        className="w-full p-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-700 tracking-widest">Event Location</label>
                        <input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g. RMUTT, Pathum Thani"
                            className="w-full p-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <label className="text-xs font-black uppercase text-slate-700 tracking-widest">Project Date</label>
                        <DatePicker
                            selected={eventDate}
                            onChange={(date) => setEventDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="w-full p-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholderText="YYYY-MM-DD"
                            isClearable
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500">Replace Thumbnail (Optional)</label>
                        <input
                            type="file"
                            name="thumbnail"
                            accept="image/*"
                            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500">Current Thumbnail</label>
                        {initialPortfolio.thumbnail ? (
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-white">
                                <Image
                                    src={initialPortfolio.thumbnail}
                                    alt={initialPortfolio.title || "Current thumbnail"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="text-xs text-slate-500">No thumbnail uploaded.</div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-black uppercase text-slate-700 tracking-widest">Technologies / Skill Tags</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {skillTypes.map((skill) => {
                            const colorClass = colorMap[skill.color?.toLowerCase()] || colorMap.gray;
                            const checked = selectedSkillIds.includes(String(skill.id));

                            return (
                                <label
                                    key={skill.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer hover:shadow-sm group ${colorClass}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(e) => toggleSkillId(skill.id, e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-xs font-bold">{skill.name}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 hover:shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Saving Changes..." : "Save Portfolio Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
