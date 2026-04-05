'use server';

import { revalidatePath } from "next/cache";
import { uploadToCloudinary, extractCloudinaryPublicId, deleteFromCloudinary } from "@/lib/cloudinary";
import * as service from "@/services/portfolioService";

export async function uploadGalleryImagesAction(portfolioId, formData) {
    try {
        const files = formData.getAll("gallery_images");
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
        const image = await service.getGalleryImageById(imageId);
        const publicId = extractCloudinaryPublicId(image[0].img);
        
        if (publicId) await deleteFromCloudinary(publicId);
        
        await service.deleteGalleryById(imageId);
        
        revalidatePath(`/admin/portfolio/gallery/${portfolioId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}