export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
	getSkills, getProjects, getAchievements,
	getInternships, getActivities, getEducations
} from "@/services/portfolioService";

// UI Components
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import LogoScrollerComponent from "@/components/logoScrollerComponent";
import PortfolioCard from "@/components/portfolioCard";
import FadeInOnView from "@/components/animations/fadeInOnView";
import BackgroundImageSection from "@/components/BackgroundImageSection";

// Sections
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import StorySection from "@/components/sections/StorySection";
import { GraduationCap } from "lucide-react";

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
				{/* <AboutSection /> */}
				<StorySection />

				{/* Skills Section - With Background Image */}
				<BackgroundImageSection
					id="skills"
					imageSrc="/images/bg.jpg"
					imageAlt="Skills Background"
					className="px-6 py-20 w-full"
					overlayOpacity="bg-primary/35"
				>
					<div className="max-w-5xl mx-auto text-white">
						<h2 className="text-6xl font-durer font-semibold text-left mb-3 text-primary">Tech Stacks</h2>
						<p className="text-lg text-secondary/80 mb-12 text-left">The tools, apps, devices, and libraries I use to build, design, and ship.</p>
						<div className="mt-12 ">
							<LogoScrollerComponent items={skills} />
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
						<div className="pointer-events-none absolute left-5 top-0 bottom-0 w-px bg-secondary/15 md:left-1/2 md:-translate-x-1/2" />

						<div className="space-y-10 md:space-y-14">
							{educations.map((item, index) => {
								const year = item.event_date ? new Date(item.event_date).getFullYear() : 'N/A';
								const isLeft = index % 2 === 0;

								return (
									<FadeInOnView key={item.id ?? index}>
										<div className="relative grid grid-cols-[2.5rem_1fr] items-start gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">

											{isLeft ? (
												<>
													<div className="relative col-start-2 row-start-1 w-full rounded-2xl border border-secondary/15 bg-white p-6 shadow-sm md:col-start-1 md:justify-self-end md:mr-8 md:w-full max-w-md md:pr-10">
														<div className="absolute top-1/2 hidden h-4 w-4 -right-2 -translate-y-1/2 rotate-45 border border-secondary/15 border-l-0 border-b-0 bg-white md:block" />
														<div className="flex items-start justify-between gap-4">
															<div className="min-w-0">
																<h3 className="text-xl font-bold text-primary">{item.title}</h3>
																<p className="mt-1 text-sm text-secondary/70">
																	{item.event_location || ''}
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

													<div className="relative z-10 col-start-1 row-start-1 flex justify-center md:col-start-2">
														<div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ring-8 ring-surface/80">
															<GraduationCap size={14} className="text-primary" />
														</div>
													</div>
												</>
											) : (
												<>
													<div className="relative z-10 col-start-1 row-start-1 flex justify-center md:col-start-2">
														<div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ring-8 ring-surface/80">
															<GraduationCap size={14} className="text-primary" />
														</div>
													</div>

													<div className="relative col-start-2 row-start-1 w-full rounded-2xl border border-secondary/15 bg-white p-6 shadow-sm md:col-start-3 md:justify-self-start md:ml-8 md:w-full max-w-md md:pl-10">
														<div className="absolute top-1/2 hidden h-4 w-4 -left-2 -translate-y-1/2 rotate-45 border border-secondary/15 border-r-0 border-t-0 bg-white md:block" />
														<div className="flex items-start justify-between gap-4">
															<div className="min-w-0">
																<h3 className="text-xl font-bold text-primary">{item.title}</h3>
																<p className="mt-1 text-sm text-secondary/70">
																	{item.event_location || ''}
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
												</>

											)}
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