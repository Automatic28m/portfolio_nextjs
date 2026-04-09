'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function clampIndex(nextIndex, slideCount, loop) {
  if (slideCount === 0) return 0;
  if (loop) {
    return (nextIndex + slideCount) % slideCount;
  }
  return Math.min(Math.max(nextIndex, 0), slideCount - 1);
}

function HardwareSlide({ slide }) {
  const title = slide?.title ?? 'Slide';
  const description = slide?.description ?? '';
  const imageSrc = slide?.imageSrc;
  const imageAlt = slide?.imageAlt ?? title;

  return (
    <article className="h-full">
      <div className="grid h-full items-center gap-6 md:grid-cols-2 md:gap-8">
        <div className="space-y-4">
          <h4 className="text-2xl font-durer font-semibold text-surface sm:text-3xl">
            {title}
          </h4>
          <p className="max-w-xl text-sm leading-relaxed text-surface/90 sm:text-base">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-center">
          {imageSrc ? (
            <div className="relative aspect-square w-full p-4 sm:p-5">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 220px, 260px"
              />
            </div>
          ) : (
            <div className="flex aspect-square w-full max-w-64 items-center justify-center rounded-2xl border border-dashed border-surface/35 bg-surface/10 p-6 text-center text-surface/85">
              <div className="space-y-2">
                <p className="text-lg font-durer font-semibold">No image available</p>
                <p className="text-sm leading-relaxed">Use the description to highlight the platform and its use cases.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function MotionCarousel({ slides = [], options = {} }) {
  const { loop = false, autoplay = true, autoplayDelay = 3500 } = options;
  const slideCount = slides.length;
  const [activeIndex, setActiveIndex] = React.useState(0);

  const goTo = React.useCallback(
    (nextIndex) => {
      setActiveIndex((currentIndex) => clampIndex(nextIndex ?? currentIndex, slideCount, loop));
    },
    [loop, slideCount]
  );

  const handlePrevious = React.useCallback(() => {
    setActiveIndex((currentIndex) => clampIndex(currentIndex - 1, slideCount, loop));
  }, [loop, slideCount]);

  const handleNext = React.useCallback(() => {
    setActiveIndex((currentIndex) => clampIndex(currentIndex + 1, slideCount, loop));
  }, [loop, slideCount]);

  React.useEffect(() => {
    if (!autoplay || slideCount <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => clampIndex(currentIndex + 1, slideCount, loop));
    }, autoplayDelay);

    return () => window.clearInterval(intervalId);
  }, [autoplay, autoplayDelay, loop, slideCount]);

  if (slideCount === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `-${activeIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 180, damping: 26 }}
        >
          {slides.map((slide, index) => (
            <div key={slide?.title ?? index} className="w-full shrink-0 px-1 sm:px-2">
              <HardwareSlide slide={slide} />
            </div>
          ))}
        </motion.div>
      </div>

      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrevious}
            aria-label="Previous slide"
            className="absolute rounded-full border border-surface/35 bg-surface/15 p-2 text-surface backdrop-blur-md transition hover:bg-surface/25"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-0 z-10 rounded-full border border-surface/35 bg-surface/15 p-2 text-surface backdrop-blur-md transition hover:bg-surface/25"
          >
            <ChevronRight size={18} />
          </button>

          <div className="mt-5 flex items-center justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide?.title ?? index}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? 'w-8 bg-surface' : 'w-2.5 bg-surface/45 hover:bg-surface/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
