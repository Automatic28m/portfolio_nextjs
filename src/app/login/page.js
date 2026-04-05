'use client';

import { useActionState } from 'react'; // React 19 / Next 15 standard
import Link from 'next/link';
import { loginAction } from '@/actions/authActions';
export default function LoginPage() {
    //prevState holds the {error: ...} object returned by the action
    const [state, formAction, isPending] = useActionState(loginAction, null);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-subject">
            {/* Title handled by Metadata in layout or page */}
            
            <form action={formAction} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-6">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Admin Login</h2>

                {/* Show Error Message if login fails */}
                {state?.error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded border border-red-200 text-center">
                        {state.error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Username</label>
                    <input
                        name="username"
                        type="text"
                        className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Password</label>
                    <input
                        name="password"
                        type="password"
                        className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
                >
                    {isPending ? "Verifying..." : "Login"}
                </button>
            </form>

            <Link href="/" className="text-gray-600 hover:text-blue-600 transition">
                Go to home page
            </Link>
        </div>
    );
}