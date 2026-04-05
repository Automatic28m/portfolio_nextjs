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
    const [uploadProgress, setUploadProgress] = useState("");
    const [eventDate, setEventDate] = useState(new Date());

    async function getCloudinarySignature(folder) {
        const response = await fetch("/api/cloudinary-signature", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ folder }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get upload signature: ${errorText}`);
        }

        return response.json();
    }

    function renameWithExtension(fileName, extension) {
        const dotIndex = fileName.lastIndexOf(".");
        if (dotIndex === -1) return `${fileName}.${extension}`;
        return `${fileName.slice(0, dotIndex)}.${extension}`;
    }

    async function optimizeImageFile(file, { maxDimension, quality = 0.8, outputType = "image/webp" }) {
        if (!file?.type?.startsWith("image/")) {
            return file;
        }

        const bitmap = await createImageBitmap(file);
        const { width, height } = bitmap;
        const scale = Math.min(1, maxDimension / Math.max(width, height));
        const targetWidth = Math.max(1, Math.round(width * scale));
        const targetHeight = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const context = canvas.getContext("2d");

        if (!context) {
            bitmap.close();
            return file;
        }

        context.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
        bitmap.close();

        const optimizedBlob = await new Promise((resolve) => {
            canvas.toBlob(
                (blob) => resolve(blob || file),
                outputType,
                quality
            );
        });

        if (optimizedBlob.size >= file.size) {
            return file;
        }

        return new File([optimizedBlob], renameWithExtension(file.name, "webp"), {
            type: outputType,
            lastModified: Date.now(),
        });
    }

    async function runWithConcurrency(items, concurrency, workerFn) {
        if (!items.length) return [];
        const results = new Array(items.length);
        let currentIndex = 0;

        async function runWorker() {
            while (currentIndex < items.length) {
                const itemIndex = currentIndex;
                currentIndex += 1;
                results[itemIndex] = await workerFn(items[itemIndex], itemIndex);
            }
        }

        await Promise.all(
            Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker())
        );

        return results;
    }

    async function uploadFileToCloudinary(file, folder, signatureData) {
        const startTime = Date.now();
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("api_key", signatureData.apiKey);
        uploadData.append("timestamp", signatureData.timestamp.toString());
        uploadData.append("signature", signatureData.signature);
        uploadData.append("folder", folder);

        console.log(`Starting upload for ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB) to ${folder}`);

        let uploadResponse;
        try {
            uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`, {
                method: "POST",
                body: uploadData,
                signal: AbortSignal.timeout(120000), // 2 minute timeout
            });
        } catch (fetchError) {
            if (fetchError.name === 'TimeoutError') {
                console.error(`Upload timeout for ${file.name} after 2 minutes`);
                throw new Error(`Upload timeout for ${file.name}. The file may be too large or there may be network issues.`);
            }
            console.error(`Upload fetch error for ${file.name}:`, fetchError);
            throw new Error(`Upload failed for ${file.name}: ${fetchError.message}`);
        }

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error(`Upload failed for ${file.name}:`, errorText);
            throw new Error(`Cloudinary upload failed (${uploadResponse.status}): ${errorText}`);
        }

        const result = await uploadResponse.json();
        console.log(`Upload successful for ${file.name}: ${result.secure_url}`);
        console.log(`Uploaded ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB) in ${Date.now() - startTime}ms`);
        return result.secure_url;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setUploadProgress("Preparing upload...");
        const startTime = Date.now();

        try {
            const formData = new FormData(event.currentTarget);
            const eventDateString = eventDate.toISOString().split('T')[0];
            const title = formData.get("title");
            const contents = formData.get("contents");
            const location = formData.get("location");
            const type_id = formData.get("type_id");
            const skillIds = formData.getAll("skill_type_ids");
            const thumbnailFile = formData.get("thumbnail");
            const galleryFiles = formData.getAll("gallery_images").filter(
                (file) => file && file.size > 0
            );

            setUploadProgress("Optimizing images for faster upload...");
            const optimizeStart = Date.now();
            const optimizedThumbnail = thumbnailFile && thumbnailFile.size > 0
                ? await optimizeImageFile(thumbnailFile, { maxDimension: 1280, quality: 0.8 })
                : null;
            const optimizedGalleryFiles = await Promise.all(
                galleryFiles.map((file) => optimizeImageFile(file, { maxDimension: 1920, quality: 0.8 }))
            );
            const originalBytes = [thumbnailFile, ...galleryFiles]
                .filter(Boolean)
                .reduce((sum, file) => sum + file.size, 0);
            const optimizedBytes = [optimizedThumbnail, ...optimizedGalleryFiles]
                .filter(Boolean)
                .reduce((sum, file) => sum + file.size, 0);
            console.log(`Image optimization took: ${Date.now() - optimizeStart}ms`);
            console.log(
                `Payload reduced from ${(originalBytes / 1024 / 1024).toFixed(2)}MB to ${(optimizedBytes / 1024 / 1024).toFixed(2)}MB`
            );

            // Get signatures once per folder
            setUploadProgress("Getting upload permissions...");
            const sigStart = Date.now();
            const thumbnailSig = optimizedThumbnail ? await getCloudinarySignature("portfolio_thumbnails") : null;
            const gallerySig = optimizedGalleryFiles.length > 0 ? await getCloudinarySignature("portfolio_galleries") : null;
            console.log(`Signature generation took: ${Date.now() - sigStart}ms`);

            // Use low concurrency on gallery uploads to avoid saturating slow uplink bandwidth.
            setUploadProgress(`Uploading ${optimizedGalleryFiles.length + (optimizedThumbnail ? 1 : 0)} files...`);
            const uploadStart = Date.now();
            let thumbnailUrl = null;
            if (optimizedThumbnail && thumbnailSig) {
                thumbnailUrl = await uploadFileToCloudinary(optimizedThumbnail, "portfolio_thumbnails", thumbnailSig);
            }

            const galleryUrls = gallerySig
                ? await runWithConcurrency(
                    optimizedGalleryFiles,
                    2,
                    (file, index) => {
                        setUploadProgress(`Uploading gallery image ${index + 1}/${optimizedGalleryFiles.length}...`);
                        return uploadFileToCloudinary(file, "portfolio_galleries", gallerySig);
                    }
                )
                : [];
            console.log(`File uploads took: ${Date.now() - uploadStart}ms`);

            setUploadProgress("Saving to database...");
            const dbStart = Date.now();
            const result = await createPortfolioAction({
                title,
                contents,
                location,
                event_date: eventDateString,
                type_id,
                skill_type_ids: skillIds,
                thumbnailUrl,
                galleryUrls,
            });
            console.log(`Database save took: ${Date.now() - dbStart}ms`);
            console.log(`Total time: ${Date.now() - startTime}ms`);

            if (result.success) {
                toast.success("Project Created Successfully!");
                router.push("/admin/portfolio");
            } else {
                throw new Error(result.error || "Failed to create project");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to create project");
            setLoading(false);
            setUploadProgress("");
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <Toaster />
            <form onSubmit={handleSubmit} className="bg-white text-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
                <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-bold font-durer text-slate-900 text-3xl">Create New Project</h2>
                    <p className="text-slate-700 text-sm">Fill in the details to update your RMUTT portfolio.</p>
                </div>

                {/* 1. Title & Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-700 tracking-widest">Project Title</label>
                        <input name="title" required placeholder="e.g. Smart Bin System" className="w-full p-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-700 tracking-widest">Category Type</label>
                        <select name="type_id" required className="w-full p-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition">
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
                    <label className="text-xs font-black uppercase text-slate-700 tracking-widest">Contents / Description</label>
                    <textarea name="contents" rows={4} placeholder="Describe the project goals and your role..." className="w-full p-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>

                {/* 3. Location & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-700 tracking-widest">Event Location</label>
                        <input name="location" placeholder="e.g. RMUTT, Pathum Thani" className="w-full p-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" />
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <label className="text-xs font-black uppercase text-slate-700 tracking-widest">Project Date</label>
                        <DatePicker
                            selected={eventDate}
                            onChange={(date) => setEventDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="w-full p-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                    <label className="text-xs font-black uppercase text-slate-700 tracking-widest">Technologies / Skill Tags</label>
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
                        {loading ? (uploadProgress || "Uploading to Cloudinary...") : "Create Portfolio Entry"}
                    </button>
                </div>
            </form>
        </div>
    );
}