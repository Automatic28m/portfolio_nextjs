import { getPortfolioWithCounts } from "@/services/portfolioService";
import PortfolioTableClient from "./PortfolioTableClient";

export const metadata = { title: "Manage Portfolio | Admin" };

export default async function ManagePortfolioPage() {
    // Fetch data on the server
    const data = await getPortfolioWithCounts();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-durer">Manage Portfolio</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    + Add New Project
                </button>
            </div>
            
            <PortfolioTableClient initialData={data} />
        </div>
    );
}