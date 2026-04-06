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
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            
            <main className="flex-grow pt-24 pb-20 px-6">
                <article className="max-w-4xl mx-auto">
                    {dataLoadError && (
                        <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
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
                                <div className="border-b border-slate-100 pb-6">
                                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-durer mb-4">
                                        {project.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-blue-600 uppercase tracking-widest">
                                        <span>{project.event_location}</span>
                                        <span className="text-slate-300">•</span>
                                        <span>{project.event_date}</span>
                                    </div>
                                </div>

                                <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line font-subject">
                                    {project.contents}
                                </p>

                                {/* Skill Tags */}
                                <div className="flex flex-wrap gap-2 pt-4">
                                    {skillTypes.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200"
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </FadeInOnView>

                            {/* Gallery Section */}
                            {gallery && gallery.length > 0 && (
                                <div className="mt-20">
                                    <FadeInOnView>
                                        <div className="flex items-center gap-4 mb-8">
                                            <h2 className="text-xl font-bold text-slate-400 uppercase tracking-tighter">Gallery</h2>
                                            <div className="flex-grow h-[1px] bg-slate-100"></div>
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