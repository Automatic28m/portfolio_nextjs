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

// Sections
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import StorySection from "@/components/sections/StorySection";

export const metadata = {
  title: "Phanlop's Portfolio | Computer Engineer",
  description: "Portfolio of Phanlop Boonluea, Computer Engineering student at RMUTT.",
};

export default async function PortfolioPage() {
  const [
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

  return (
    <div className="flex flex-col min-h-screen font-subject">
      <Navbar />

      <main className="pt-16 min-h-screen bg-white text-gray-800">

        <HeroSection />
        <TextScrollerComponent className="bg-slate-50 border-y border-slate-100" />
        {/* <AboutSection /> */}
        <StorySection />

        {/* Skills Section - Cleaned Background */}
        <section id="skills" className="px-6 py-20 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold mb-12 font-durer text-center">Tech Stacks</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-xl mx-auto">
              {skills.map((item, index) => (
                <span key={index} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 text-center font-medium hover:text-blue-600 hover:border-blue-200 transition-all duration-300">
                  {item.title}
                </span>
              ))}
            </div>
            <div className="mt-16">
              <LogoScrollerComponent />
            </div>
          </div>
        </section>

        {/* Reusable Portfolio Sections */}
        <PortfolioSection title="Projects" id="projects" data={projects} />
        <PortfolioSection title="Achievements" id="achievements" data={achievements} bgGray />
        <PortfolioSection title="Internship Experiences" id="internships" data={internships} />
        <PortfolioSection title="Academic Activities" id="activities" data={activities} bgGray />

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

async function PortfolioSection({ title, id, data, bgGray = false }) {
  return (
    <section id={id} className={`px-6 py-20 ${bgGray ? 'bg-slate-50' : 'bg-white'}`}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-durer font-semibold text-center mb-12">{title}</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {/* 2. Map through data and fetch skills for each item */}
          {await Promise.all(data.map(async (item, index) => {
            const { getSkillTypesByPortfolioId } = await import("@/services/portfolioService");
            const skillTypes = await getSkillTypesByPortfolioId(item.id);

            return (
              <PortfolioCard
                item={item}
                index={index}
                key={item.id}
                skillTypes={skillTypes} // Pass as props
              />
            );
          }))}
        </div>
      </div>
    </section>
  );
}