import { getDashboardCounts } from "@/services/portfolioService";
import DashboardSmallCard from "@/components/dashboardSmallCard";
import { 
    Eye, BicepsFlexed, Workflow, TrophyIcon, 
    Building, Laugh, GraduationCap, Image as ImageIcon 
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
    let counts = {};
    let loadError = null;

    try {
        counts = await getDashboardCounts();
    } catch (error) {
        loadError = "Dashboard data is temporarily unavailable. Please check database connection settings.";
        console.error("DashboardPage DB error:", error);
    }
    
    // Mapping our IDs from the database to the UI
    const stats = [
        { id: 'visitors', title: "Total Visitors", count: "100,000", icon: <Eye size={30} />, color: "blue", span: 2 },
        { id: 1, title: "Skills", count: counts[1] || 0, icon: <BicepsFlexed size={30} />, color: "violet" },
        { id: 2, title: "Projects", count: counts[2] || 0, icon: <Workflow size={30} />, color: "green" },
        { id: 3, title: "Achievements", count: counts[3] || 0, icon: <TrophyIcon size={30} />, color: "red" },
        { id: 4, title: "Internship", count: counts[4] || 0, icon: <Building size={30} />, color: "yellow" },
        { id: 5, title: "Activities", count: counts[5] || 0, icon: <Laugh size={30} />, color: "lime" },
        { id: 6, title: "Education", count: counts[6] || 0, icon: <GraduationCap size={30} />, color: "cyan" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-durer text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-700">Welcome back, Phanlop! Here is your portfolio at a glance.</p>
            </div>

            {loadError && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
                    {loadError}
                </div>
            )}

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <DashboardSmallCard
                        key={stat.id}
                        title={stat.title}
                        number={stat.count}
                        icon={stat.icon}
                        bg_color={stat.color}
                        col_span={stat.span || 1}
                    />
                ))}
            </div>

            {/* Image Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DashboardSmallCard
                    icon={<ImageIcon size={30} />}
                    bg_color="sky"
                    title="Thumbnail Images"
                    number="--" // Fetch this from Cloudinary API later
                />
                <DashboardSmallCard
                    icon={<ImageIcon size={30} />}
                    bg_color="amber"
                    title="Gallery Images"
                    number="--"
                />
            </div>
        </div>
    );
}