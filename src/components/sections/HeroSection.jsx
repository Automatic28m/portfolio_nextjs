'use client';
import { Mail, Github, Instagram } from "lucide-react";
import FadeInOnView from "../animations/fadeInOnView";
import { Typewriter } from "../animations/typeWriter";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-cover bg-center bg-fixed"
      style={{
        width: '100%',
        minHeight: '600px',
        backgroundImage: "url('/images/bg.jpg')",
      }}
    >
      {/* Hero Content */}
      <div
        className="relative z-10 flex flex-col-reverse md:flex-row overflow-hidden"
        style={{
          minHeight: '600px',
        }}
      >

        {/* 1. Image Container - Fixed with 'relative' and specific heights */}
        <FadeInOnView
          duration={0.5}
          className="relative flex-1 w-full h-125 md:h-auto min-h-125 md:min-h-175"
        >
          <Image
            src="/images/profile2.png"
            alt="Phanlop Boonluea"
            fill
            className="object-cover object-top transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Subtle gradient overlay to blend the bottom for "My Story" */}
          <div className="absolute inset-0"/>
        </FadeInOnView>

        {/* 2. Content Column */}
        <div className="flex-1 flex flex-col gap-y-6 justify-center px-8 md:px-20 py-12">
          <div className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            <Typewriter
              text="Hi, I'm Phanlop Boonluea"
              className="text-5xl md:text-7xl font-bold mb-2 font-durer leading-tight"
            />
          </div>

          <div className="space-y-2">
            <Typewriter
              text="Computer Engineering Student @ RMUTT"
              className="text-xl md:text-2xl text-secondary font-medium font-subject"
            />
            <p className="text-secondary/80 max-w-md">
              I'm a passionate student developer who loves building user-friendly web apps. I'm currently studying at RMUTT University in Thailand.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-8 text-secondary/70 mt-6">
            <SocialLink href="mailto:phanlop.auto@gmail.com" icon={<Mail size={26} />}/>
            <SocialLink href="https://github.com/Automatic28m" icon={<Github size={26} />} />
            <SocialLink href="https://www.instagram.com/automatic.pb/" icon={<Instagram size={26} />} />
          </div>
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
      className="group flex flex-col items-center gap-2 hover:text-accent transition-all duration-300 hover:-translate-y-1"
    >
      <div className="p-3 rounded-full bg-surface shadow-sm group-hover:shadow-md transition-all border border-secondary/15">
        {icon}
      </div>
    </a>
  );
}