'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getAdminFromUsername } from '@/services/adminService';
import { redirect } from 'next/navigation';

export async function loginAction(prevState, formData) {
    const username = formData.get('username');
    const password = formData.get('password');

    // 1. Fetch user from your Aiven DB service
    const rows = await getAdminFromUsername(username);
    const user = rows[0];

    if (!user) {
        return { error: "Invalid username or password" };
    }

    // 2. Check password (using bcrypt like your old backend)
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return { error: "Invalid username or password" };
    }

    // 3. Create the JWT Token
    const token = jwt.sign(
        { user_id: user.id, username: user.username },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
    );

    // 4. Save to HTTP-Only Cookie (Secure)
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7200, // 2 hours
        path: '/',
    });

    // 5. Redirect to dashboard
    redirect('/dashboard');
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    redirect('/login');
}