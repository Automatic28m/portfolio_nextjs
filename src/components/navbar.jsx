'use client';

import Link from 'next/link';
import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [username, setUsername] = useState("Login");

    // We still use useEffect for now if you haven't moved to Cookies yet.
    // Once you finish Phase 4, we will pass 'username' as a prop from layout.js
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.username) setUsername(decoded.username);
            } catch (error) {
                console.error('Invalid token', error);
            }
        }
    }, []);

    const navItems = [
        { name: "Home", id: "hero" }, // Link to top
        { name: "About", id: "about" },
        { name: "Skills", id: "skills" },
        { name: "Projects", id: "projects" },
        { name: "Achievements", id: "achievements" },
        { name: "Contact", id: "contact" }
    ];

    return (
        <header className="bg-surface/85 backdrop-blur-md shadow-sm fixed w-full z-50 border-b border-secondary/10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="font-durer text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Phanlop's Portfolio
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                href={`/#${item.id}`} // Next.js automatically handles the scroll!
                                className="text-secondary hover:text-primary transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                        
                        <Link 
                            href={username === "Login" ? "/login" : "/dashboard"} 
                            className="bg-secondary/10 text-secondary px-4 py-2 rounded-full font-bold hover:bg-secondary/20 transition"
                        >
                            {username}
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-secondary"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Content */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-surface border-t border-secondary/10 py-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                href={`/#${item.id}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-2 text-secondary hover:bg-secondary/10 hover:text-primary"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link 
                            href="/login" 
                            className="block px-4 py-2 font-bold text-secondary"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {username}
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
}