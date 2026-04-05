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
        <FadeInOnView className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden" key={index}>
            <div className="flex flex-col h-full">
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

                <div className='p-5'>
                    <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4">{item.contents}</p>
                    <p className='text-xs font-bold text-blue-600 uppercase tracking-widest'>
                        {item.event_location} • {item.event_date}
                    </p>

                    {/* ✅ Display the props directly */}
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

                <Link
                    href={`/portfolio/${item.id}`}
                    className="flex items-center gap-1 p-5 pt-0 text-sm font-bold text-blue-600 hover:text-blue-800 transition"
                >
                    Read more <ArrowUpRight size={16} />
                </Link>
            </div>
        </FadeInOnView>
    );
}