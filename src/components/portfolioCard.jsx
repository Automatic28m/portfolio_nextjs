'use client';
import { colorMap } from "@/utils/colors";
import Link from 'next/link'; // 1. Import Link here
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import FadeInOnView from "../components/animations/fadeInOnView.jsx";
import LightGallery from 'lightgallery/react';
import { ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Image from 'next/image.js';

export default function PortfolioCard({ item, index, skillTypes = [] }) {
    return (
        <FadeInOnView className="bg-white rounded-lg shadow-sm border border-secondary/15 overflow-hidden" key={index}>
            <div className="flex flex-col h-full relative">
                {/* Image Section (Keep your fixed 'relative' container here) */}
                <div className="relative aspect-video w-full overflow-hidden">
                    <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
                        <a className="gallery-item cursor-zoom-in block w-full h-full" data-src={item.thumbnail}>
                            <Image
                                src={item.thumbnail || "/images/placeholder.png"}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-110"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        </a>
                    </LightGallery>
                </div>

                <div className="flex flex-col flex-1 pb-20">
                    <div className='p-5'>
                        <h3 className="font-durer font-bold text-2xl mb-2">{item.title}</h3>
                        <p className="text-sm text-secondary/85 line-clamp-3 mb-4">{item.contents}</p>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {skillTypes.map((skill, idx) => {
                                // Look up the classes based on the color string from DB (e.g., "blue")
                                const colorClasses = colorMap[skill.color?.toLowerCase()] || colorMap.gray;

                                return (
                                    <span
                                        key={idx}
                                        className={`px-2 py-1 text-[10px] font-bold rounded border ${colorClasses}`}
                                    >
                                        {skill.name}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>

                    <div className="flex justify-between p-5 absolute bottom-0 left-0 right-0 bg-white border-t border-secondary/15">
                        <p className='text-[10px] font-bold text-secondary/60 uppercase tracking-widest'>
                            {item.event_location} • {item.event_date}
                        </p>
                        <Link
                            href={`/portfolio/${item.id}`}
                            className="text-right w-fit group mt-auto inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-secondary transition-colors duration-200 hover:text-primary"
                        >
                            Read More
                            <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>
            </div>
        </FadeInOnView>
    );
}