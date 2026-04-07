'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState(() => {
        if (typeof window === 'undefined') return 'Login';
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return decoded.username || 'Login';
            } catch (error) {
                console.error('Invalid token', error);
            }
        }
        return 'Login';
    });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const navItems = [
        { id: 'hero', name: 'Home', link: '/#hero' },
        { id: 'skills', name: 'Skills', link: '/#skills' },
        { id: 'projects', name: 'Projects', link: '/#projects' },
        { id: 'achievements', name: 'Achievements', link: '/#achievements' },
        { id: 'educations', name: 'Educations', link: '/#educations' },
        { id: 'contact', name: 'Contact', link: '/#contact' },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 w-full h-16 z-50 flex items-center border-b border-secondary/20 bg-primary/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
                    <Link href="/" className="z-60 flex items-center gap-2">
                        <span className="font-durer text-2xl font-bold text-surface uppercase">
                            Phanlop&apos;s Portfolio
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-12">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.link}
                                className="text-surface font-durer text-sm uppercase tracking-widest hover:opacity-70 transition-opacity"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex lg:hidden items-right gap-4 z-60">
                        {/* <Link
                            href={username === 'Login' ? '/login' : '/dashboard'}
                            className="hidden lg:block text-surface font-durer text-md uppercase tracking-widest hover:opacity-70 transition-opacity"
                        >
                            {username}
                        </Link> */}

                        <button
                            className="lg:hidden text-surface p-2 cursor-pointer"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle Menu"
                        >
                            <div className="w-6 h-5 relative flex flex-col justify-between">
                                <span
                                    className={`w-full h-0.5 bg-surface transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
                                ></span>
                                <span
                                    className={`w-full h-0.5 bg-surface transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}
                                ></span>
                                <span
                                    className={`w-full h-0.5 bg-surface transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}
                                ></span>
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 bg-primary/50 backdrop-blur-xl flex flex-col items-left justify-center gap-10 transition-all duration-500 lg:hidden z-40 px-6
        ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
            >
                {navItems.map((item) => (
                    <Link
                        key={item.id}
                        href={item.link}
                        onClick={() => setIsOpen(false)}
                        className="text-surface font-durer text-3xl uppercase tracking-widest hover:opacity-70 transition-opacity"
                    >
                        {item.name}
                    </Link>
                ))}
                {/* <Link
                    href={username === 'Login' ? '/login' : '/dashboard'}
                    onClick={() => setIsOpen(false)}
                    className="text-surface text-durer text-3xl uppercase tracking-widest hover:opacity-70 transition-opacity"
                >
                    {username}
                </Link> */}
            </div>
        </>
    );
}