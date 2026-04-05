'use server';

import { revalidatePath } from "next/cache";
import * as service from "@/services/portfolioService";

export async function addTagAction(name, color) {
    try {
        await service.addSkillType(name, color);
        revalidatePath("/admin/tags");
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function updateTagAction(id, name, color) {
    try {
        await service.updateSkillTypeById(id, name, color);
        revalidatePath("/admin/tags");
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteTagAction(id) {
    try {
        await service.deleteSkillTypeById(id);
        revalidatePath("/admin/tags");
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}