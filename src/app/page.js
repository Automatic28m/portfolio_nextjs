export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  getSkills, getProjects, getAchievements,
  getInternships, getActivities, getEducations
} from "@/services/portfolioService";

// UI Components
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TextScrollerComponent from "@/components/textScrollerComponent";
import LogoScrollerComponent from "@/components/logoScrollerComponent copy";
import PortfolioCard from "@/components/portfolioCard";
import FadeInOnView from "@/components/animations/fadeInOnView";
import BackgroundImageSection from "@/components/BackgroundImageSection";

// Sections
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import StorySection from "@/components/sections/StorySection";

export const metadata = {
  title: "Phanlop's Portfolio | Computer Engineer",
  description: "Portfolio of Phanlop Boonluea, Computer Engineering student at RMUTT.",
};

export default async function PortfolioPage() {
  let skills = [];
  let projects = [];
  let achievements = [];
  let internships = [];
  let activities = [];
  let educations = [];
  let dataLoadError = null;

  try {
    [
      skills,
      projects,
      achievements,
      internships,
      activities,
      educations
    ] = await Promise.all([
      getSkills(),
      getProjects(),
      getAchievements(),
      getInternships(),
      getActivities(),
      getEducations()
    ]);
  } catch (error) {
    dataLoadError = "Portfolio data is temporarily unavailable. Please try again shortly.";
    console.error("Home page DB error:", error);
  }

  return (
    <div className="flex flex-col min-h-screen font-subject">
      <Navbar />

      <main className="pt-16 min-h-screen bg-surface text-primary">

        {dataLoadError && (
          <section className="px-6 pt-6">
            <div className="max-w-5xl mx-auto rounded-lg border border-accent/40 bg-accent/15 px-4 py-3 text-primary">
              {dataLoadError}
            </div>
          </section>
        )}

        <HeroSection />
        <TextScrollerComponent className="bg-surface border-y border-secondary/15" />
        {/* <AboutSection /> */}
        <StorySection />

        {/* Skills Section - With Background Image */}
        <BackgroundImageSection
          id="skills"
          imageSrc="/images/bg.jpg"
          imageAlt="Skills Background"
          className="px-6 py-20 min-h-screen w-full"
          overlayOpacity="bg-primary/35"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold mb-12 font-durer text-center text-white">Tech Stacks</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-xl mx-auto">
              {skills.map((item, index) => (
                <span key={index} className="bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-white/20 text-center font-medium text-primary hover:text-secondary hover:bg-white hover:border-accent transition-all duration-300">
                  {item.title}
                </span>
              ))}
            </div>
            <div className="mt-16">
              <LogoScrollerComponent />
            </div>
          </div>
        </BackgroundImageSection>

        {/* Projects Section */}
        <PortfolioSection title="Projects" description="A showcase of my recent projects and contributions." id="projects" data={projects} />

        {/* Achievements Section - With Background Image */}
        <BackgroundImageSection
          id="achievements"
          imageSrc="/images/bg.jpg"
          imageAlt="Achievements Background"
          className="px-6 py-20 w-full"
          overlayOpacity="bg-primary/35"
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-6xl font-durer font-semibold text-left mb-3 text-primary">Achievements</h2>
            <p className="text-lg text-secondary/80 mb-12">My successful accomplishments</p>
            <div className="grid gap-8 md:grid-cols-2">
              {await Promise.all(achievements.map(async (item, index) => {
                const { getSkillTypesByPortfolioId } = await import("@/services/portfolioService");
                const skillTypes = await getSkillTypesByPortfolioId(item.id);
                return (
                  <PortfolioCard
                    item={item}
                    index={index}
                    key={item.id}
                    skillTypes={skillTypes}
                  />
                );
              }))}
            </div>
          </div>
        </BackgroundImageSection>

        {/* Internship Experiences Section */}
        <PortfolioSection title="Internship Experiences" description={"Experience in professional working"} id="internships" data={internships} />

        {/* Academic Activities Section - With Background Image */}
        <BackgroundImageSection
          id="activities"
          imageSrc="/images/bg.jpg"
          imageAlt="Activities Background"
          className="px-6 py-20 w-full"
          overlayOpacity="bg-primary/35"
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-6xl font-durer font-semibold text-left mb-3 text-primary">Academic Activities</h2>
            <p className="text-lg text-secondary/80 mb-12">My academic achievements and involvement</p>
            <div className="grid gap-8 md:grid-cols-2">
              {await Promise.all(activities.map(async (item, index) => {
                const { getSkillTypesByPortfolioId } = await import("@/services/portfolioService");
                const skillTypes = await getSkillTypesByPortfolioId(item.id);
                return (
                  <PortfolioCard
                    item={item}
                    index={index}
                    key={item.id}
                    skillTypes={skillTypes}
                  />
                );
              }))}
            </div>
          </div>
        </BackgroundImageSection>

        {/* Education Section */}
        <section id="education" className="px-6 py-20 bg-surface">
          <FadeInOnView>
            <h2 className="text-3xl font-durer font-semibold text-center mb-2 text-primary">Education</h2>
            <p className="text-center text-secondary/80 mb-14 max-w-2xl mx-auto">
              A milestone timeline of my academic journey.
            </p>
          </FadeInOnView>

          <div className="max-w-6xl mx-auto relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-secondary/15" />

            <div className="space-y-10 md:space-y-14">
              {educations.map((item, index) => {
                const year = item.event_date ? new Date(item.event_date).getFullYear() : 'N/A';
                const isLeft = index % 2 === 0;

                return (
                  <FadeInOnView key={index}>
                    <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
                      <div className="relative z-10 col-start-2 flex justify-center">
                        <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary text-surface shadow-md ring-8 ring-surface/80 md:h-8 md:w-8">
                          <div className="h-2 w-2 rounded-full bg-accent" />
                        </div>
                      </div>

                      <div className={`relative rounded-2xl border border-secondary/15 bg-white p-6 shadow-sm md:max-w-md ${isLeft ? 'md:col-start-1 md:justify-self-end md:mr-8 md:pr-10' : 'md:col-start-3 md:justify-self-start md:ml-8 md:pl-10'}`}>
                        <div className={`absolute top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border border-secondary/15 bg-white md:block ${isLeft ? '-right-2 border-l-0 border-b-0' : '-left-2 border-r-0 border-t-0'}`} />
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="text-xl font-bold text-primary">{item.title}</h3>
                            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-secondary/70">
                              {item.event_location || 'Education'}
                            </p>
                          </div>
                          <span className="inline-flex shrink-0 rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-secondary">
                            {year}
                          </span>
                        </div>
                        <p className="mt-4 text-secondary leading-relaxed">
                          {item.contents}
                        </p>
                      </div>
                    </div>
                  </FadeInOnView>
                );
              })}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

async function PortfolioSection({ title, description, id, data }) {
  return (
    <section id={id} className="px-6 py-20 bg-surface">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-6xl font-durer font-semibold text-left mb-3 text-primary">{title}</h2>
        {description && <p className="text-lg text-secondary/80 mb-12">{description}</p>}
        <div className="grid gap-3 md:grid-cols-2">
          {await Promise.all(data.map(async (item, index) => {
            const { getSkillTypesByPortfolioId } = await import("@/services/portfolioService");
            const skillTypes = await getSkillTypesByPortfolioId(item.id);

            return (
              <PortfolioCard
                item={item}
                index={index}
                key={item.id}
                skillTypes={skillTypes}
              />
            );
          }))}
        </div>
      </div>
    </section>
  );
}