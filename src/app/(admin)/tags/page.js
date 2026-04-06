import { getSkillTypes } from "@/services/portfolioService";
import ManageTags from "./ManageTags";

export const metadata = { title: "Manage Tags | Admin" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TagsPage() {
    let skillTypes = [];
    try {
        skillTypes = await getSkillTypes();
    } catch (error) {
        console.error("TagsPage DB error:", error);
    }

    return <ManageTags initialTags={skillTypes} />;
}
