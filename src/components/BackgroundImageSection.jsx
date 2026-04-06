/**
 * Reusable component to render a section with background image
 * Uses section-scoped fixed background to avoid overlap between sections
 */
export default function BackgroundImageSection({
  children,
  id,
  imageSrc = '/images/bg.jpg',
  imageAlt = 'Background',
  className = '',
}) {
  return (
    <section
      id={id}
      aria-label={imageAlt}
      className={`relative w-full bg-cover bg-center bg-fixed ${className}`}
      style={{
        width: '100%',
        backgroundImage: `url(${imageSrc})`,
      }}
    >
      {/* Dark Overlay for readability */}
      <div className={`absolute inset-0`} />

      {/* Content - Positioned relatively so it's above the background */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
        }}
      >
        {children}
      </div>
    </section>
  );
}
