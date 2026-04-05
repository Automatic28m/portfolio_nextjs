'use client'; // Required because we use useState

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ children }) {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const toggleNavbar = () => setIsNavbarOpen(!isNavbarOpen);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-100 font-subject">
            
            {/* 1. Desktop Sidebar (Fixed) */}
            <aside className="hidden md:block w-44 fixed inset-y-0 left-0 z-40">
                <Sidebar />
            </aside>

            {/* 2. Mobile Sidebar & Backdrop */}
            {isNavbarOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" 
                        onClick={toggleNavbar}
                    />
                    <aside className="fixed inset-y-0 left-0 w-64 z-40 md:hidden transition-transform">
                        <Sidebar />
                    </aside>
                </>
            )}

            {/* 3. Mobile Toggle Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={toggleNavbar}
                    className="p-2 rounded-full bg-white shadow-md text-slate-600 hover:text-blue-600 transition-colors"
                >
                    {isNavbarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* 4. Main Content Area */}
            {/* We use md:ml-44 to push content to the right of the fixed sidebar */}
            <main className="flex-1 md:ml-44 min-h-screen text-slate-900">
                {/* Optional: Add a Top Navbar here if you want */}
                <div className="p-4 md:p-8">
                    {children} {/* This replaces <Outlet /> */}
                </div>
            </main>
        </div>
    );
}