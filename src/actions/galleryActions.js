'use server';

import { revalidatePath } from "next/cache";
import { uploadToCloudinary, extractCloudinaryPublicId, deleteFromCloudinary } from "@/lib/cloudinary";
import * as service from "@/services/galleryService";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_BYTES = 5.5 * 1024 * 1024;

export async function uploadGalleryImagesAction(portfolioId, formData) {
    try {
        const files = formData
            .getAll("gallery_images")
            .filter((file) => file && file.size > 0);

        const oversizedFile = files.find((file) => file.size > MAX_FILE_BYTES);
        if (oversizedFile) {
            return {
                success: false,
                error: `\"${oversizedFile.name}\" exceeds 5MB. Please compress it and try again.`,
            };
        }

        const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
        if (totalBytes > MAX_TOTAL_BYTES) {
            return {
                success: false,
                error: "Total upload payload is too large for Netlify (max ~5.5MB). Upload fewer images at once.",
            };
        }

        const urls = [];

        for (const file of files) {
            const url = await uploadToCloudinary(file, "portfolio_galleries");
            urls.push(url);
        }

        await service.uploadImageGalleryToPortfolioId(portfolioId, urls);
        
        revalidatePath(`/admin/portfolio/gallery/${portfolioId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteGalleryImageAction(imageId, portfolioId) {
    try {
        const image = await service.getGalleryById(imageId);
        const publicId = image?.img ? extractCloudinaryPublicId(image.img) : null;
        
        if (publicId) await deleteFromCloudinary(publicId);
        
        await service.deleteGalleryById(imageId);
        
        revalidatePath(`/admin/portfolio/gallery/${portfolioId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}