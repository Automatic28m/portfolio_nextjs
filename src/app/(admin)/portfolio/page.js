import { getPortfolioWithCounts } from "@/services/portfolioService";
import PortfolioTableClient from "./PortfolioTableClient";
import Link from "next/link";

export const metadata = { title: "Manage Portfolio | Admin" };

export default async function ManagePortfolioPage() {
    // Fetch data on the server
    const data = await getPortfolioWithCounts();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-durer text-slate-900">Manage Portfolio</h1>
                <Link href="/portfolio/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    + Add New Item
                </Link>
            </div>
            
            <PortfolioTableClient initialData={data} />
        </div>
    );
}