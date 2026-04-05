'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, Toaster } from "react-hot-toast";
import { createPortfolioAction } from "@/actions/portfolioActions";
import { colorMap } from "@/utils/colors";

// ✅ Receive the data we fetched in the Page file
export default function CreatePortfolioForm({ portfolioTypes, skillTypes }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [eventDate, setEventDate] = useState(new Date());

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        formData.append("event_date", eventDate.toISOString().split('T')[0]);

        const result = await createPortfolioAction(formData);

        if (result.success) {
            toast.success("Project Created Successfully!");
            router.push("/admin/portfolio");
        } else {
            toast.error(result.error || "Failed to create project");
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <Toaster />
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
                <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-bold font-durer text-slate-900 text-3xl">Create New Project</h2>
                    <p className="text-slate-400 text-sm">Fill in the details to update your RMUTT portfolio.</p>
                </div>

                {/* 1. Title & Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Project Title</label>
                        <input name="title" required placeholder="e.g. Smart Bin System" className="w-full p-3 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Category Type</label>
                        <select name="type_id" required className="w-full p-3 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition">
                            <option value="">Select Category</option>
                            {/* ✅ Now fetching and mapping correctly */}
                            {portfolioTypes.map((type) => (
                                <option key={type.id} value={type.id}>{type.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 2. Contents */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Contents / Description</label>
                    <textarea name="contents" rows={4} placeholder="Describe the project goals and your role..." className="w-full p-3 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>

                {/* 3. Location & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Event Location</label>
                        <input name="location" placeholder="e.g. RMUTT, Pathum Thani" className="w-full p-3 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" />
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Project Date</label>
                        <DatePicker
                            selected={eventDate}
                            onChange={(date) => setEventDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="w-full p-3 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                </div>

                {/* 4. Images Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500">Thumbnail (Single)</label>
                        <input type="file" name="thumbnail" accept="image/*" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500">Gallery Images (Multiple)</label>
                        <input type="file" name="gallery_images" multiple accept="image/*" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-black cursor-pointer" />
                    </div>
                </div>

                {/* 5. Skill Tags Checklist */}
                <div className="space-y-4">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Technologies / Skill Tags</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {/* ✅ Now mapping Skill Tags with colorMap */}
                        {skillTypes.map((skill) => {
                            const colorClass = colorMap[skill.color?.toLowerCase()] || colorMap.gray;
                            return (
                                <label
                                    key={skill.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer hover:shadow-sm group ${colorClass}`}
                                >
                                    <input
                                        type="checkbox"
                                        name="skill_type_ids"
                                        value={skill.id}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-xs font-bold">{skill.name}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* 6. Action Button */}
                <div className="pt-4">
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 hover:shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Uploading to Cloudinary..." : "Create Portfolio Entry"}
                    </button>
                </div>
            </form>
        </div>
    );
}