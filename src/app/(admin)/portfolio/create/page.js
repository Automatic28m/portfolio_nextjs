// src/app/(admin)/portfolio/create/page.js
import { getSkillTypes, getPortfolioType } from "@/services/portfolioService";
import CreatePortfolioForm from "./CreatePortfolioForm";

export const maxDuration = 60;

export default async function Page() {
  const [skills, types] = await Promise.all([
    getSkillTypes(),
    getPortfolioType()
  ]);
  
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <CreatePortfolioForm skillTypes={skills} portfolioTypes={types} />
    </div>
  );
}