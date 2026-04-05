import { getGalleryByPortfolioId } from "@/services/galleryService";
import GalleryTableClient from "./GalleryTableClient";

export const metadata = { title: "Edit Gallery | Admin" };

export default async function EditGalleryPage({ params }) {
    const { id } = await params;
    const portfolioId = Number(id);

    const initialGallery = Number.isNaN(portfolioId)
        ? []
        : await getGalleryByPortfolioId(portfolioId);

    return <GalleryTableClient portfolioId={portfolioId} initialGallery={initialGallery} />;
}
