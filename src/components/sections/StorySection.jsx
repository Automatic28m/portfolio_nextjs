import Image from 'next/image';
import FadeInOnView from '../animations/fadeInOnView';

export default function StorySection() {
    return (
        <section id="my-story" className="py-24 bg-surface overflow-hidden font-subject">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    
                    {/* Image Column */}
                    <FadeInOnView direction="left" className="relative group">
                        <div className="relative h-125 w-full overflow-hidden rounded-2xl shadow-xl">
                            {/* ⚠️ PRO TIP: Rename 'IMG_9479 2.JPG' to 'story-profile.jpg' 
                                to avoid issues with spaces in filenames. 
                            */}
                            <Image
                                src="/images/IMG_9479 2.JPG"
                                alt="Phanlop Boonluea Story"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {/* Aesthetic overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-primary/25 to-transparent" />
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -bottom-6 -right-6 -z-10 h-32 w-32 rounded-full bg-accent/35 blur-2xl" />
                    </FadeInOnView>

                    {/* Content Column */}
                    <div className="flex flex-col">
                        <FadeInOnView>
                            <h2 className="text-4xl font-bold mb-6 font-durer text-primary border-l-4 border-secondary pl-4">
                                My Story
                            </h2>
                        </FadeInOnView>
                        
                        <div className="space-y-4 text-secondary leading-relaxed text-justify">
                            <p>
                                Hi, I&apos;m <span className="font-bold text-primary">Phanlop Boonluea</span>, a Computer Engineering student
                                at&nbsp;
                                <a
                                    href="https://www.rmutt.ac.th/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-secondary hover:text-primary hover:underline font-semibold"
                                >
                                    Rajamangala University of Technology Thanyaburi (RMUTT).
                                </a>
                                Originally from Chonburi, Thailand, I’m now based in Pathum Thani for my studies.
                            </p>

                            <p>
                                My journey into programming began in 2019 at the&nbsp;
                                <a
                                    href="http://www.tatc.ac.th/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-secondary hover:text-primary hover:underline font-semibold"
                                >
                                    Thai-Austrian Technical College
                                </a>. 
                                That decision sparked a passion—I found myself diving deep into code, 
                                competing in various contests, and discovering my knack for building logic. 
                                Each competition helped shape my confidence and engineering direction.
                            </p>

                            <p>
                                In 2024, I chose to pursue <span className="text-primary font-semibold">Computer Engineering</span> to master both hardware and software. 
                                The transition was tough, especially the math-heavy curriculum, but I stayed focused. 
                                I doubled down on my studies, finished my first year with pride, and adapted to the rigor of engineering.
                            </p>

                            <p className="pt-2">
                                Today, I’m channeling my energy into building real-world projects and 
                                gaining hands-on experience. My goal is to grow into a skilled engineer 
                                who builds meaningful, high-performance solutions for society.
                            </p>
                        </div>

                        {/* Visual Badge/Callout */}
                        <div className="mt-8 p-4 bg-white rounded-lg border border-secondary/15 shadow-sm inline-flex items-center gap-3 w-fit">
                            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-wider text-secondary/80">
                                Seeking Internship Opportunities
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}