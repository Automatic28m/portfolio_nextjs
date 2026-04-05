import { NextResponse } from "next/server";
import { getGalleryByPortfolioId } from "@/services/galleryService";

export async function GET(_request, { params }) {
    try {
        const portfolioId = Number(params.portfolioId);
        if (Number.isNaN(portfolioId)) {
            return NextResponse.json({ error: "Invalid portfolio id" }, { status: 400 });
        }

        const items = await getGalleryByPortfolioId(portfolioId);
        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json({ error: error.message || "Failed to load gallery" }, { status: 500 });
    }
}
