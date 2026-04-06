import { getPortfolioWithCounts } from "@/services/portfolioService";
import PortfolioTableClient from "./PortfolioTableClient";
import Link from "next/link";

export const metadata = { title: "Manage Portfolio | Admin" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ManagePortfolioPage() {
    let data = [];
    let loadError = null;

    try {
        data = await getPortfolioWithCounts();
    } catch (error) {
        loadError = "Unable to load portfolio records right now.";
        console.error("ManagePortfolioPage DB error:", error);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-durer text-slate-900">Manage Portfolio</h1>
                <Link href="/portfolio/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    + Add New Item
                </Link>
            </div>

            {loadError && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
                    {loadError}
                </div>
            )}
            
            <PortfolioTableClient initialData={data} />
        </div>
    );
}