'use client';
import { useEffect, useRef } from 'react';
import './scroller.css'; 
import Image from 'next/image';

const LogoScrollerComponent = ({ items = [] }) => {
    const scrollerRef = useRef(null);

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;
        if (scroller.getAttribute('data-animated') === 'true') return;

        // Only animate if the user hasn't requested reduced motion
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            scroller.setAttribute('data-animated', true);
            const scrollerInner = scroller.querySelector('.scroller__inner');
            if (!scrollerInner) return;
            const scrollerContent = Array.from(scrollerInner.children);

            // Clone items for the infinite loop effect
            scrollerContent.forEach((item) => {
                const duplicate = item.cloneNode(true);
                duplicate.setAttribute('aria-hidden', true);
                scrollerInner.appendChild(duplicate);
            });
        }
    }, []);

    const logoItems = items
        .filter((item) => item?.thumbnail)
        .map((item, index) => ({
            id: item.id ?? index,
            name: item.title || 'Skill',
            url: item.thumbnail,
        }));

    if (!logoItems.length) return null;

    return (
        <div className="max-w-screen mx-auto p-6 flex flex-col items-center overflow-hidden">
            <div 
                ref={scrollerRef} 
                className="scroller w-screen" 
                data-direction="right" 
                data-speed="slow"
            >
                <div className="scroller__inner flex gap-8 items-center py-4">
                    {logoItems.map((item) => (
                        <div key={item.id} className="shrink-0 rounded-2xl bg-primary/55 p-2 shadow-sm">
                            <Image
                                width={76}
                                height={76}
                                src={item.url}
                                alt={item.name}
                                className="h-19 w-19 rounded-xl object-contain transition-all duration-500 hover:scale-110"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogoScrollerComponent;