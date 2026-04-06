'use client';

import FadeInOnView from "./animations/fadeInOnView";
import { Mail, Github, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer id="contact" className="px-6 py-16 text-center bg-primary text-surface mt-auto">
            <FadeInOnView>
                <h2 className="text-3xl font-bold mb-4 font-durer">Contact Me</h2>
            <p className="mb-8 text-surface/70">Let&apos;s build something amazing together!</p>

                <div className="flex justify-center gap-8 mb-12">
                    <SocialLink href="mailto:phanlop.auto@gmail.com" icon={<Mail size={24} />} />
                    <SocialLink href="https://github.com/Automatic28m" icon={<Github size={24} />} />
                    <SocialLink href="https://www.instagram.com/automatic.pb/" icon={<Instagram size={24} />} />
                </div>

                <div className="border-t border-surface/15 pt-8 text-sm text-surface/55">
                    <p>© {new Date().getFullYear()} Phanlop Boonluea. Built with Next.js 16 & Tailwind v4.</p>
                </div>
            </FadeInOnView>
        </footer>
    );
}

function SocialLink({ href, icon, label }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 hover:text-accent transition-all duration-300 hover:-translate-y-1"
        >
            {icon}
            <span className="text-xs font-medium uppercase tracking-widest">{label}</span>
        </a>
    );
}