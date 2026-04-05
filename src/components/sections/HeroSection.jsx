'use client';
import { Mail, Github, Instagram } from "lucide-react"; // I'm assuming you downgraded to v0 for these!
import FadeInOnView from "../animations/fadeInOnView";
import { Typewriter } from "../animations/typeWriter";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section id="hero" className="flex flex-col-reverse md:flex-row bg-white overflow-hidden min-h-[600px]">

      {/* 1. Image Container - Fixed with 'relative' and specific heights */}
      <FadeInOnView
        duration={0.5}
        className="relative flex-1 w-full h-[500px] md:h-[auto] min-h-[500px] md:min-h-[700px]"
      >
        <Image
          src="/images/profile2.png"
          alt="Phanlop Boonluea"
          fill
          priority // Loads this immediately
          className="object-cover object-top transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Subtle gradient overlay to blend the bottom for "My Story" */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
      </FadeInOnView>

      {/* 2. Content Column */}
      <div className="flex-1 flex flex-col gap-y-6 justify-center px-8 md:px-20 py-12 bg-slate-50/50">
        <div className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
          <Typewriter
            text="Hi, I'm Phanlop Boonluea"
            className="text-5xl md:text-7xl font-bold mb-2 font-durer leading-tight"
          />
        </div>

        <div className="space-y-2">
          <Typewriter
            text="Computer Engineering Student @ RMUTT"
            className="text-xl md:text-2xl text-slate-600 font-medium font-subject"
          />
          <p className="text-slate-500 max-w-md">
            I'm a passionate student developer who loves building user-friendly web apps. I'm currently studying at RMUTT University in Thailand.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex gap-8 text-slate-400 mt-6">
          <SocialLink href="mailto:phanlop.auto@gmail.com" icon={<Mail size={26} />} label="Email" />
          <SocialLink href="https://github.com/Automatic28m" icon={<Github size={26} />} label="GitHub" />
          <SocialLink href="https://www.instagram.com/automatic.pb/" icon={<Instagram size={26} />} label="Instagram" />
        </div>
      </div>
    </section>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-2 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="p-3 rounded-full bg-white shadow-sm group-hover:shadow-md transition-all border border-slate-100">
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
    </a>
  );
}