import { db } from '@/lib/db';

export async function adminLogin(username) {
    const [result] = await db.query("SELECT * FROM admin WHERE username = ?", [username]);
    return result;
}

export async function getAdminFromUsername(username) {
    try {
        const [result] = await db.query("SELECT * FROM admin WHERE username = ?", [username]);
        return result;
    } catch (error) {
        console.error("getAdminFromUsername query error: ", error.message);
        return [];
    }
}

export async function adminRegister(username, encryptedPassword) {
    try {
        const [result] = await db.query("INSERT INTO admin (username, password) VALUES (?,?)", [username, encryptedPassword]);
        return {
            status: 201,
            message: "New admin has been created",
            userId: result.insertId
        };
    } catch (error) {
        console.error("Registration failed: ", error.message);
        return {
            status: 500,
            message: "Registration failed",
            error: error.message
        };
    }
}