'use server';
import { revalidatePath } from "next/cache";
import { uploadToCloudinary, extractCloudinaryPublicId, deleteFromCloudinary } from "@/lib/cloudinary";
import * as service from "@/services/portfolioService";

export async function createPortfolioAction(formData) {
    try {
        const title = formData.get("title");
        const contents = formData.get("contents");
        const location = formData.get("location");
        const date = formData.get("event_date");
        const type_id = formData.get("type_id");
        const skillIds = formData.getAll("skill_type_ids"); // Gets array from checkboxes

        // 1. Upload Thumbnail
        const thumbFile = formData.get("thumbnail");
        const thumbnailUrl = await uploadToCloudinary(thumbFile, "portfolio_thumbnails");

        // 2. Upload Gallery Images
        const galleryFiles = formData.getAll("gallery_images");
        const galleryUrls = [];
        for (const file of galleryFiles) {
            if (file.size > 0) {
                const url = await uploadToCloudinary(file, "portfolio_galleries");
                galleryUrls.push(url);
            }
        }

        // 3. Database Transaction (Logic from your database.js)
        await service.createFullPortfolio({
            title, contents, location, date,
            thumbnail: thumbnailUrl,
            type_id,
            galleryUrls,
            skillIds
        });

        revalidatePath("/admin/portfolio");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Create Action Error:", error);
        return { success: false, error: error.message };
    }
}

export async function updatePortfolioAction(id, formData) {
    try {
        const title = formData.get("title");
        const contents = formData.get("contents");
        const location = formData.get("location");
        const date = formData.get("event_date");
        const type_id = formData.get("type_id");
        const skillIds = formData.getAll("skill_type_ids");

        // Handle Optional Thumbnail Update
        const newThumb = formData.get("thumbnail");
        let thumbnailUrl = null;
        if (newThumb && newThumb.size > 0) {
            thumbnailUrl = await uploadToCloudinary(newThumb, "portfolio_thumbnails");
        }

        // Database Update Logic
        await service.updatePortfolioFull(id, {
            title, contents, location, date, type_id,
            thumbnail: thumbnailUrl,
            skillIds
        });

        revalidatePath(`/portfolio/${id}`);
        revalidatePath("/admin/portfolio");
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deletePortfolioAction(id) {
    try {
        // 1. Fetch details to delete from Cloudinary (Logic from your server.js)
        const project = await service.getPortfolioById(id);
        const gallery = await service.getGalleryByPortfolioId(id);

        if (project[0]?.thumbnail) {
            await deleteFromCloudinary(extractCloudinaryPublicId(project[0].thumbnail));
        }

        for (const item of gallery) {
            await deleteFromCloudinary(extractCloudinaryPublicId(item.img));
        }

        // 2. Delete from DB
        await service.deletePortfolioById(id);

        revalidatePath("/admin/portfolio");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}