'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import { Search, Trash2, Upload } from "lucide-react";
import { deleteGalleryImageAction, uploadGalleryImagesAction } from "@/actions/galleryActions";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_BYTES = 5.5 * 1024 * 1024;

export default function GalleryTableClient({ portfolioId, initialGallery }) {
    const [gallery, setGallery] = useState(initialGallery || []);
    const [filterText, setFilterText] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const imageUploadRef = useRef(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const filteredGallery = useMemo(() => {
        const q = filterText.trim().toLowerCase();
        if (!q) return gallery;
        return gallery.filter((row) =>
            String(row.id).includes(q) || row.img?.toLowerCase().includes(q)
        );
    }, [gallery, filterText]);

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "80px",
        },
        {
            name: "Image",
            cell: (row) => (
                <div className="relative w-28 h-16 my-2 rounded overflow-hidden border border-slate-200 bg-slate-100">
                    <Image
                        src={row.img || "/images/profile.png"}
                        fill
                        className="object-cover"
                        alt={`Gallery ${row.id}`}
                        sizes="112px"
                    />
                </div>
            ),
            width: "150px",
            ignoreRowClick: true,
        },
        {
            name: "URL",
            selector: (row) => row.img,
            sortable: false,
            wrap: true,
            grow: 2,
        },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    onClick={() => handleDeleteOne(row.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    aria-label={`Delete image ${row.id}`}
                    disabled={isDeleting}
                >
                    <Trash2 size={18} />
                </button>
            ),
            width: "100px",
            ignoreRowClick: true,
        },
    ];

    async function refreshGallery() {
        const response = await fetch(`/api/gallery/${portfolioId}`, { cache: "no-store" });
        if (!response.ok) {
            throw new Error("Failed to refresh gallery");
        }
        const data = await response.json();
        setGallery(data.items || []);
    }

    async function handleUpload(event) {
        event.preventDefault();
        const imageUpload = imageUploadRef.current;

        if (!imageUpload?.files?.length) {
            toast.error("Please select at least one image.");
            return;
        }

        const selectedFiles = Array.from(imageUpload.files);
        const oversized = selectedFiles.find((file) => file.size > MAX_FILE_BYTES);
        if (oversized) {
            toast.error(`\"${oversized.name}\" exceeds 5MB. Please compress it first.`);
            return;
        }

        const totalBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
        if (totalBytes > MAX_TOTAL_BYTES) {
            toast.error("Total payload is too large for Netlify (~5.5MB max). Upload fewer images.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        for (const file of imageUpload.files) {
            formData.append("gallery_images", file);
        }

        const result = await uploadGalleryImagesAction(portfolioId, formData);
        if (result.success) {
            toast.success("Gallery images uploaded successfully!");
            await refreshGallery();
            imageUpload.value = "";
        } else {
            toast.error(result.error || "Upload failed. Please try again.");
        }

        setIsUploading(false);
    }

    async function handleDeleteOne(imageId) {
        if (!confirm(`Delete image ID ${imageId}?`)) return;

        setIsDeleting(true);
        const result = await deleteGalleryImageAction(imageId, portfolioId);

        if (result.success) {
            toast.success(`Image ID ${imageId} deleted`);
            setGallery((prev) => prev.filter((item) => item.id !== imageId));
        } else {
            toast.error(result.error || `Failed to delete image ID ${imageId}`);
        }

        setIsDeleting(false);
    }

    const contextActions = useMemo(() => {
        async function handleMultipleDelete() {
            if (!selectedRows.length) return;

            const ids = selectedRows.map((row) => row.id);
            if (!confirm(`Delete selected image IDs: ${ids.join(", ")}?`)) return;

            setIsDeleting(true);
            const results = await Promise.all(
                ids.map((id) => deleteGalleryImageAction(id, portfolioId))
            );

            const failed = results
                .map((res, index) => ({ res, id: ids[index] }))
                .filter((x) => !x.res.success);

            if (failed.length) {
                toast.error(`Deleted ${ids.length - failed.length}/${ids.length}. Some deletions failed.`);
            } else {
                toast.success(`Deleted ${ids.length} image(s)`);
            }

            const deletedIds = ids.filter((id, index) => results[index].success);
            setGallery((prev) => prev.filter((row) => !deletedIds.includes(row.id)));
            setToggleCleared((prev) => !prev);
            setSelectedRows([]);
            setIsDeleting(false);
        }

        return (
            <button
                onClick={handleMultipleDelete}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                disabled={isDeleting || !selectedRows.length}
            >
                Delete Selected
            </button>
        );
    }, [selectedRows, isDeleting, portfolioId]);

    if (!isMounted) {
        return <div className="p-8 text-center text-slate-700">Loading Gallery...</div>;
    }

    return (
        <div className="space-y-6">
            <Toaster />
            <h1 className="text-3xl font-bold font-durer text-slate-900">Gallery of Portfolio ID {portfolioId}</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-slate-900">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-4">
                    <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <input
                            id="imageUpload"
                            name="gallery_images"
                            multiple
                            type="file"
                            accept="image/*"
                            ref={imageUploadRef}
                            className="w-full sm:max-w-md p-2 border border-slate-200 rounded-lg bg-white text-slate-900"
                            disabled={isUploading}
                        />
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            <Upload size={16} />
                            {isUploading ? "Uploading..." : "Upload Images"}
                        </button>
                    </form>

                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID or URL..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <DataTable
                    title={null}
                    columns={columns}
                    data={filteredGallery}
                    responsive
                    striped
                    pagination
                    highlightOnHover
                    selectableRows
                    onSelectedRowsChange={(state) => setSelectedRows(state.selectedRows)}
                    clearSelectedRows={toggleCleared}
                    contextActions={contextActions}
                    noDataComponent={<span className="text-slate-700 py-4">No gallery images found.</span>}
                />
            </div>
        </div>
    );
}
