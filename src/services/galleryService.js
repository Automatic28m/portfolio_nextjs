import { db } from '@/lib/db';

export async function uploadImageGalleryToPortfolioId(id, imageFilenames) {
    if (!imageFilenames || imageFilenames.length === 0) {
        throw new Error("No images provided.");
    }
    const values = imageFilenames.map(filename => [filename, id]);
    const [result] = await db.query("INSERT INTO gallery (img, portfolio_id) VALUES ?", [values]);
    return result;
}

export async function getGalleryById(id) {
    const [rows] = await db.query("SELECT * FROM gallery WHERE id = ?", [id]);
    return rows;
}

export async function getGalleryByPortfolioId(id) {
    const [rows] = await db.query("SELECT * FROM gallery WHERE portfolio_id = ?", [id]);
    return rows;
}

export async function countGalleryByPortfolioId(id) {
    const [rows] = await db.query("SELECT COUNT(*) AS count FROM gallery WHERE portfolio_id = ?", [id]);
    return rows[0].count;
}

export async function deleteGalleryById(id) {
    const [rows] = await db.query("DELETE FROM gallery WHERE id = ?", [id]);
    return rows;
}