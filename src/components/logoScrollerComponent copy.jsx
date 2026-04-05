'use client';
import { useEffect, useRef } from 'react';
import './scroller.css'; 
import Image from 'next/image';

const LogoScrollerComponent = () => {
    const scrollerRef = useRef(null);

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        // Only animate if the user hasn't requested reduced motion
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            scroller.setAttribute('data-animated', true);
            const scrollerInner = scroller.querySelector('.scroller__inner');
            const scrollerContent = Array.from(scrollerInner.children);

            // Clone items for the infinite loop effect
            scrollerContent.forEach((item) => {
                const duplicate = item.cloneNode(true);
                duplicate.setAttribute('aria-hidden', true);
                scrollerInner.appendChild(duplicate);
            });
        }
    }, []);

    // ✅ Fix: Point to the actual public path
    const folder = "/images/LogoImages/";

    // ✅ Fix: Added 'name' so your 'alt' tags actually work
    const languages = [
        { name: "React", url: "React.png" },
        { name: "Python", url: "python.png" },
        { name: "Angular", url: "angular.png" },
        { name: "Flutter", url: "flutter-icon.png" },
        { name: "Express", url: "express.png" },
        { name: "Node.js", url: "node-js.png" },
        { name: "C", url: "C_Logo.png" },
        { name: "HTML", url: "html.png" },
        { name: "CSS", url: "css.png" },
        { name: "JavaScript", url: "javascript.png" },
        { name: "PHP", url: "php.png" },
        { name: "MySQL", url: "mysql.png" },
        { name: "Figma", url: "figma.png" },
    ];

    return (
        <div className="max-w-screen mx-auto p-6 flex flex-col items-center overflow-hidden">
            <div 
                ref={scrollerRef} 
                className="scroller w-screen" 
                data-direction="right" 
                data-speed="slow"
            >
                <div className="scroller__inner flex gap-8 items-center py-4">
                    {languages.map((lang, index) => (
                        <div key={index} className="flex-shrink-0">
                            <Image
                                width={80} // 👈 Fixed size for scroller performance
                                height={80}
                                src={`${folder}${lang.url}`}
                                alt={lang.name}
                                className="object-contain mix-blend-multiply grayscale hover:grayscale-0 transition-all duration-500 transform hover:scale-110"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogoScrollerComponent;