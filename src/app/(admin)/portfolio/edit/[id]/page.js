import {
    getPortfolioByIdForEdit,
    getPortfolioType,
    getSkillTypes,
    getSkillTypesByPortfolioId,
} from "@/services/portfolioService";
import EditPortfolioForm from "./EditPortfolioForm";

export const metadata = { title: "Edit Portfolio | Admin" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditPortfolioPage({ params }) {
    const { id } = await params;
    const portfolioId = Number(id);

    if (Number.isNaN(portfolioId)) {
        return (
            <div className="min-h-screen grid place-items-center text-slate-700">
                Invalid portfolio ID.
            </div>
        );
    }

    const [portfolio, portfolioTypes, skillTypes, selectedSkills] = await Promise.all([
        getPortfolioByIdForEdit(portfolioId),
        getPortfolioType(),
        getSkillTypes(),
        getSkillTypesByPortfolioId(portfolioId),
    ]);

    if (!portfolio) {
        return (
            <div className="min-h-screen grid place-items-center text-slate-700">
                Portfolio not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <EditPortfolioForm
                id={portfolioId}
                initialPortfolio={portfolio}
                portfolioTypes={portfolioTypes}
                skillTypes={skillTypes}
                initialSkillIds={selectedSkills.map((skill) => String(skill.id))}
            />
        </div>
    );
}
