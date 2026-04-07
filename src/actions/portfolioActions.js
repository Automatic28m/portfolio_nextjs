'use server';
import { revalidatePath } from "next/cache";
import { uploadToCloudinary, extractCloudinaryPublicId, deleteFromCloudinary } from "@/lib/cloudinary";
import * as service from "@/services/portfolioService";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

export async function createPortfolioAction(payload) {
    try {
        const isFormData = payload?.get && typeof payload.get === 'function';
        const title = isFormData ? payload.get("title") : payload.title;
        const contents = isFormData ? payload.get("contents") : payload.contents;
        const location = isFormData ? payload.get("location") : payload.location;
        const date = isFormData ? payload.get("event_date") : payload.event_date;
        const type_id = isFormData ? payload.get("type_id") : payload.type_id;
        const facebook_url = isFormData ? payload.get("facebook_url") : payload.facebook_url;
        const website_url = isFormData ? payload.get("website_url") : payload.website_url;
        const youtube_url = isFormData ? payload.get("youtube_url") : payload.youtube_url;
        const instagram_url = isFormData ? payload.get("instagram_url") : payload.instagram_url;
        const github_url = isFormData ? payload.get("github_url") : payload.github_url;
        const skillIds = isFormData
            ? payload.getAll("skill_type_ids")
            : payload.skill_type_ids || payload.skillIds || [];

        let thumbnailUrl = isFormData ? null : payload.thumbnailUrl || payload.thumbnail || null;
        if (isFormData) {
            const thumbFile = payload.get("thumbnail");
            if (thumbFile && thumbFile.size > 0) {
                thumbnailUrl = await uploadToCloudinary(thumbFile, "portfolio_thumbnails");
            }
        }

        let galleryUrls = [];
        if (isFormData) {
            const galleryFiles = payload.getAll("gallery_images").filter(
                (file) => file && file.size > 0
            );
            galleryUrls = await Promise.all(
                galleryFiles.map((file) => uploadToCloudinary(file, "portfolio_galleries"))
            );
        } else {
            galleryUrls = payload.galleryUrls || [];
        }

        await service.createFullPortfolio({
            title,
            contents,
            location,
            date,
            thumbnail: thumbnailUrl,
            type_id,
            facebook_url,
            website_url,
            youtube_url,
            instagram_url,
            github_url,
            galleryUrls,
            skillIds,
        });

        revalidatePath("/portfolio");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Create Action Error:", error);
        return { success: false, error: error.message };
    }
}

export async function updatePortfolioAction(id, formData) {
    let newThumbnailUrl = null;
    try {
        const existingProject = await service.getPortfolioById(id);
        if (!existingProject) {
            return { success: false, error: "Portfolio not found" };
        }

        const title = formData.get("title");
        const contents = formData.get("contents");
        const location = formData.get("location");
        const date = formData.get("event_date") || null;
        const type_id = formData.get("type_id");
        const facebook_url = formData.get("facebook_url") || null;
        const website_url = formData.get("website_url") || null;
        const youtube_url = formData.get("youtube_url") || null;
        const instagram_url = formData.get("instagram_url") || null;
        const github_url = formData.get("github_url") || null;
        const skillIds = formData.getAll("skill_type_ids");

        // Handle Optional Thumbnail Update
        const newThumb = formData.get("thumbnail");
        let thumbnailUrl = null;
        if (newThumb && newThumb.size > 0) {
            if (newThumb.size > MAX_FILE_BYTES) {
                return {
                    success: false,
                    error: "Thumbnail exceeds 5MB. Please compress the image and try again.",
                };
            }
            newThumbnailUrl = await uploadToCloudinary(newThumb, "portfolio_thumbnails");
            thumbnailUrl = newThumbnailUrl;
        }

        // Database Update Logic
        await service.updatePortfolioFull(id, {
            title, contents, location, date, type_id,
            thumbnail: thumbnailUrl,
            facebook_url,
            website_url,
            youtube_url,
            instagram_url,
            github_url,
            skillIds
        });

        // When replacing thumbnail, delete old image from Cloudinary.
        if (newThumbnailUrl && existingProject.thumbnail) {
            const oldPublicId = extractCloudinaryPublicId(existingProject.thumbnail);
            const newPublicId = extractCloudinaryPublicId(newThumbnailUrl);

            if (oldPublicId && oldPublicId !== newPublicId) {
                try {
                    await deleteFromCloudinary(oldPublicId);
                } catch (cleanupError) {
                    console.error("Old thumbnail cleanup error:", cleanupError);
                }
            }
        }

        revalidatePath(`/portfolio/${id}`);
        revalidatePath("/admin/portfolio");
        return { success: true };
    } catch (error) {
        // Roll back newly uploaded thumbnail if DB update fails.
        if (newThumbnailUrl) {
            const newPublicId = extractCloudinaryPublicId(newThumbnailUrl);
            if (newPublicId) {
                try {
                    await deleteFromCloudinary(newPublicId);
                } catch (rollbackError) {
                    console.error("New thumbnail rollback cleanup error:", rollbackError);
                }
            }
        }

        return { success: false, error: error.message };
    }
}

export async function deletePortfolioAction(id) {
    try {
        // 1. Fetch details to delete from Cloudinary
        const project = await service.getPortfolioById(id);
        if (!project) {
            return { success: false, error: "Portfolio not found" };
        }

        if (project.thumbnail) {
            const publicId = extractCloudinaryPublicId(project.thumbnail);
            if (publicId) {
                await deleteFromCloudinary(publicId);
            }
        }

        const gallery = await service.getGalleryByPortfolioId(id);
        if (Array.isArray(gallery) && gallery.length) {
            await Promise.all(
                gallery.map(async (item) => {
                    const galleryPublicId = extractCloudinaryPublicId(item.img);
                    if (galleryPublicId) {
                        await deleteFromCloudinary(galleryPublicId);
                    }
                })
            );
        }

        // 2. Delete from DB
        await service.deletePortfolioById(id);

        revalidatePath("/admin/portfolio");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Delete Action Error:", error);
        return { success: false, error: error.message };
    }
}