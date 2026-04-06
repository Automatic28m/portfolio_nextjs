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

      <main className="pt-16 min-h-screen bg-white text-gray-800">

        {dataLoadError && (
          <section className="px-6 pt-6">
            <div className="max-w-5xl mx-auto rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
              {dataLoadError}
            </div>
          </section>
        )}

        <HeroSection />
        <TextScrollerComponent className="bg-slate-50 border-y border-slate-100" />
        {/* <AboutSection /> */}
        <StorySection />

        {/* Skills Section - With Background Image */}
        <BackgroundImageSection 
          id="skills"
          imageSrc="/images/bg.jpg"
          imageAlt="Skills Background"
          className="px-6 py-20 min-h-screen w-full"
          overlayOpacity="bg-black/30"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold mb-12 font-durer text-center text-white">Tech Stacks</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-xl mx-auto">
              {skills.map((item, index) => (
                <span key={index} className="bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-white/20 text-center font-medium text-slate-900 hover:text-blue-600 hover:bg-white hover:border-blue-200 transition-all duration-300">
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
        <PortfolioSection title="Projects" id="projects" data={projects} />

        {/* Achievements Section - With Background Image */}
        <BackgroundImageSection 
          id="achievements"
          imageSrc="/images/bg.jpg"
          imageAlt="Achievements Background"
          className="px-6 py-20 w-full"
          overlayOpacity="bg-black/30"
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-durer font-semibold text-center mb-12 text-white">Achievements</h2>
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
        <PortfolioSection title="Internship Experiences" id="internships" data={internships} />

        {/* Academic Activities Section - With Background Image */}
        <BackgroundImageSection 
          id="activities"
          imageSrc="/images/bg.jpg"
          imageAlt="Activities Background"
          className="px-6 py-20 w-full"
          overlayOpacity="bg-black/30"
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-durer font-semibold text-center mb-12 text-white">Academic Activities</h2>
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
        <section id="education" className="px-6 py-20 bg-white">
          <FadeInOnView>
            <h2 className="text-3xl font-durer font-semibold text-center mb-12">Education</h2>
          </FadeInOnView>
          <ul className="max-w-2xl mx-auto space-y-6">
            {educations.map((item, index) => (
              <FadeInOnView key={index}>
                <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-blue-600 shadow-sm">
                  <h3 className="font-bold text-xl text-slate-900">{item.title}</h3>
                  <p className="text-blue-600 font-semibold mt-1">{item.contents}</p>
                  <p className="text-sm text-slate-500 mt-2">
                    {item.event_date ? new Date(item.event_date).getFullYear() : 'N/A'}
                  </p>
                </div>
              </FadeInOnView>
            ))}
          </ul>
        </section>

        <Footer />
      </main>
    </div>
  );
}

async function PortfolioSection({ title, id, data }) {
  return (
    <section id={id} className="px-6 py-20 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-durer font-semibold text-center mb-12">{title}</h2>
        <div className="grid gap-8 md:grid-cols-2">
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