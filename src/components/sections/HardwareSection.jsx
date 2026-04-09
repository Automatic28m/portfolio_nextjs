import FadeInOnView from '../animations/fadeInOnView';
import { MotionCarousel } from '@/components/animate-ui/components/community/motion-carousel';

export default function HardwareSection({ items }) {
  const slides = Array.isArray(items) ? items : items?.slides ?? [];
  const proficiencies = Array.isArray(items) ? [] : items?.proficiencies ?? [];

  return (
    <section id="hardware" className="bg-secondary p-3">
      <div className="bg-blueprint-grid blueprint-ruler-frame text-white">
        {/* <span aria-hidden="true" className="blueprint-scale blueprint-scale-top" />
        <span aria-hidden="true" className="blueprint-scale blueprint-scale-right" />
        <span aria-hidden="true" className="blueprint-scale blueprint-scale-bottom" />
        <span aria-hidden="true" className="blueprint-scale blueprint-scale-left" /> */}

        <FadeInOnView className="relative z-10">
          <div className="mx-auto max-w-6xl space-y-10">
            <header className="space-y-3">
              <h2 className="text-5xl font-durer font-semibold text-left text-surface md:text-6xl">
                Hardware & Embedded Systems
              </h2>
              <p className="max-w-3xl text-left text-lg leading-relaxed text-surface/90">
                Turning logic into physical reality through microcontrollers and edge computing.
              </p>
            </header>

            <div className="h-px bg-surface/35" />

            <section className="space-y-6" aria-labelledby="microcontrollers-platforms">
              <div className="flex items-end justify-between gap-4">
                <h3 id="microcontrollers-platforms" className="text-3xl font-durer text-surface">
                  Microcontrollers & Platforms
                </h3>
                <p className="hidden max-w-md text-right text-sm leading-relaxed text-surface/80 md:block">
                  Explore the boards and systems I use for prototyping, automation, and embedded development.
                </p>
              </div>

              <MotionCarousel slides={slides} options={{ loop: true }} />
            </section>

            {proficiencies.length > 0 && (
              <section className="space-y-6" aria-labelledby="technical-proficiencies">
                <div className="h-px bg-surface/35" />
                <h3 id="technical-proficiencies" className="text-3xl font-durer text-surface">
                  Technical Proficiencies
                </h3>
                <div className="grid gap-5 md:grid-cols-3">
                  {proficiencies.map((proficiency) => (
                    <div key={proficiency.title} className="rounded-xl border border-surface/35 bg-surface/10 p-5">
                      <p className="text-xl font-durer text-surface">{proficiency.title}</p>
                      <p className="mt-3 text-sm leading-relaxed text-surface/90">{proficiency.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </FadeInOnView>
      </div>
    </section>
  );
}
