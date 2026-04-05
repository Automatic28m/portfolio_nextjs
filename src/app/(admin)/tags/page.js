import { getSkillTypes } from "@/services/portfolioService";
import ManageTags from "./ManageTags";

export const metadata = { title: "Manage Tags | Admin" };

export default async function TagsPage() {
    // Fetch data on the server
    const skillTypes = await getSkillTypes();

    return <ManageTags initialTags={skillTypes} />;
}
