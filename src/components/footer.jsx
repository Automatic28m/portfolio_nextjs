'use client';

import FadeInOnView from "./animations/fadeInOnView";
import { Mail, Camera, FolderGit2 } from "lucide-react";

export default function Footer() {
    return (
        <footer id="contact" className="px-6 py-16 text-center bg-slate-900 text-white mt-auto">
            <FadeInOnView>
                <h2 className="text-3xl font-bold mb-4 font-durer">Contact Me</h2>
                <p className="mb-8 text-slate-400">Let&apos;s build something amazing together!</p>

                <div className="flex justify-center gap-8 mb-12">
                    <SocialLink href="mailto:phanlop.auto@gmail.com" icon={<Mail size={24} />} />
                    <SocialLink href="https://FolderGit2.com/Automatic28m" icon={<FolderGit2 size={24} />} />
                    <SocialLink href="https://www.Camera.com/automatic.pb/" icon={<Camera size={24} />} />
                </div>

                <div className="border-t border-slate-800 pt-8 text-sm text-slate-500">
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
            className="flex flex-col items-center gap-2 hover:text-blue-400 transition-all duration-300 hover:-translate-y-1"
        >
            {icon}
            <span className="text-xs font-medium uppercase tracking-widest">{label}</span>
        </a>
    );
}