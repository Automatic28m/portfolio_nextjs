import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Optimized for Next.js 16
 * Now handles both File objects (from formData) and raw Buffers
 */
export const uploadToCloudinary = async (fileData, folder, public_id) => {
    if (!fileData) return null;

    let buffer;
    if (typeof fileData.arrayBuffer === 'function') {
        const arrayBuffer = await fileData.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
    } else {
        buffer = fileData; // It's already a Buffer
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                folder, 
                public_id,
                resource_type: "auto"
            },
            (error, result) => {
                if (result) resolve(result.secure_url);
                else reject(error);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

export const extractCloudinaryPublicId = (url) => {
    if (!url) return null;
    // This regex is good, but Cloudinary URLs can be tricky. 
    // This version is a bit more robust for nested folders:
    const parts = url.split('/');
    const fileName = parts.pop(); // e.g. "image.jpg"
    const folderPath = parts.slice(parts.indexOf('upload') + 2).join('/'); // everything after /upload/v123/
    const publicId = `${folderPath}/${fileName.split('.')[0]}`;
    return publicId;
};

export const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;
    try {
        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary Delete Error:", error);
        throw error;
    }
};

export default cloudinary;