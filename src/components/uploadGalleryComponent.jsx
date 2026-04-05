'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { uploadGalleryAction } from '@/app/actions/galleryActions';

export default function UploadGallery({ portfolioId }) {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        
        // Prepare FormData
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append("images", file));

        // Call the Server Action directly like a function!
        const result = await uploadGalleryAction(portfolioId, formData);

        if (result.success) {
            console.log("Gallery uploaded successfully!");
            router.push('/displayPortfolio'); // Redirect using Next.js router
        } else {
            alert("Upload failed: " + result.error);
        }
        
        setIsUploading(false);
    };

    return (
        <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
            <label className="cursor-pointer block">
                <span className="text-blue-600 font-bold">
                    {isUploading ? "Uploading..." : "+ Add Images to Gallery"}
                </span>
                <input
                    type="file"
                    multiple
                    className="hidden"
                    disabled={isUploading}
                    onChange={handleFileChange}
                />
            </label>
            <p className="text-xs text-gray-500 mt-2">Max 9 images at once</p>
        </div>
    );
}