import {
    getPortfolioById,
    getSkillTypesByPortfolioId,
} from "@/services/portfolioService";
import { getGalleryByPortfolioId } from "@/services/galleryService"; // Assume you have this service
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FadeInOnView from "@/components/animations/fadeInOnView";
import Image from "next/image";
import PortfolioGallery from "@/components/PortfolioGallery"; // Client Component for LightGallery
import { colorMap } from "@/utils/colors";
import { Globe, Facebook, Youtube, Instagram, Github } from "lucide-react";

const normalizeUrl = (url) => {
    if (!url) return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};


// Dynamic Metadata for SEO
export async function generateMetadata({ params }) {
    try {
        const { id } = await params;
        const project = await getPortfolioById(id);
        return {
            title: project ? `${project.title} | Phanlop's Portfolio` : "Project Not Found",
        };
    } catch (error) {
        console.error("Portfolio metadata error:", error);
        return {
            title: "Project | Phanlop's Portfolio",
        };
    }
}

export default async function PortfolioDetailPage({ params }) {
    const { id } = await params;
    let project = null;
    let gallery = [];
    let skillTypes = [];
    let dataLoadError = null;

    try {
        [project, gallery, skillTypes] = await Promise.all([
            getPortfolioById(id),
            getGalleryByPortfolioId(id),
            getSkillTypesByPortfolioId(id)
        ]);
    } catch (error) {
        dataLoadError = "Project data is temporarily unavailable. Please try again later.";
        console.error("Portfolio detail DB error:", error);
    }

    if (!project && !dataLoadError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">Project Not Found</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-surface">
            <Navbar />

            <main className="grow pt-24 pb-20 px-6">
                <article className="max-w-4xl mx-auto">
                    {dataLoadError && (
                        <div className="mb-8 rounded-lg border border-accent/40 bg-accent/15 px-4 py-3 text-primary">
                            {dataLoadError}
                        </div>
                    )}

                    {!project ? null : (
                        <>
                            {/* Hero Thumbnail */}
                            <FadeInOnView>
                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl mb-10">
                                    <Image
                                        src={project.thumbnail}
                                        alt={project.title}
                                        fill
                                        priority
                                        className="object-cover"
                                    />
                                </div>
                            </FadeInOnView>

                            {/* Content Section */}
                            <FadeInOnView className="space-y-6">
                                <div className="border-b border-secondary/15 pb-6">
                                    <h1 className="text-4xl md:text-5xl font-bold text-primary font-durer mb-4">
                                        {project.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-secondary uppercase tracking-widest">
                                        <span>{project.event_location}</span>
                                        <span className="text-secondary/40">•</span>
                                        <span>{project.event_date}</span>
                                    </div>
                                </div>

                                <p className="text-lg text-secondary/90 leading-relaxed whitespace-pre-line font-subject">
                                    {project.contents}
                                </p>

                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                    {[
                                        { label: "Website", url: normalizeUrl(project.website_url), Icon: Globe },
                                        { label: "Facebook", url: normalizeUrl(project.facebook_url), Icon: Facebook },
                                        { label: "YouTube", url: normalizeUrl(project.youtube_url), Icon: Youtube },
                                        { label: "Instagram", url: normalizeUrl(project.instagram_url), Icon: Instagram },
                                        { label: "GitHub", url: normalizeUrl(project.github_url), Icon: Github },
                                    ]
                                        .filter((link) => Boolean(link.url))
                                        .map(({ label, url, Icon }) => (
                                            <a
                                                key={label}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={label}
                                                className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-white px-3 py-1.5 text-sm font-semibold text-secondary transition-all hover:border-secondary/40 hover:text-primary"
                                            >
                                                <Icon size={16} />
                                                <span>{label}</span>
                                            </a>
                                        ))}
                                </div>

                                {/* Skill Tags */}
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
                            </FadeInOnView>

                            {/* Gallery Section */}
                            {gallery && gallery.length > 0 && (
                                <div className="mt-20">
                                    <FadeInOnView>
                                        <div className="flex items-center gap-4 mb-8">
                                            <h2 className="text-xl font-bold text-secondary/70 uppercase tracking-tighter">Gallery</h2>
                                            <div className="grow h-px bg-secondary/15"></div>
                                        </div>
                                    </FadeInOnView>

                                    <PortfolioGallery images={gallery} />
                                </div>
                            )}
                        </>
                    )}
                </article>
            </main>

            <Footer />
        </div>
    );
}