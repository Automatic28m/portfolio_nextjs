'use client';
// This must be a Client Component because LightGallery uses browser APIs
import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import Image from 'next/image';
import FadeInOnView from './animations/fadeInOnView';

export default function PortfolioGallery({ images }) {
    if (!images || images.length === 0) return null;

    return (
        <FadeInOnView>
            <LightGallery
                speed={500}
                plugins={[lgThumbnail, lgZoom]}
                elementClassNames="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
                {images.map((item, index) => (
                    <a
                        key={index}
                        data-src={item.img}
                        className="group relative block aspect-square rounded-xl overflow-hidden cursor-zoom-in shadow-sm hover:shadow-md transition-all border border-secondary/15"
                    >
                        <Image
                            src={item.img}
                            alt={`Gallery image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                    </a>
                ))}
            </LightGallery>
            <p className="text-center text-secondary/60 text-xs mt-6 italic font-subject">
                Click any image to expand view
            </p>
        </FadeInOnView>
    );
}