import FadeInOnView from "../animations/fadeInOnView";
import { Typewriter } from "../animations/typeWriter";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 font-durer">About Me</h2>
      <div className="text-lg text-secondary leading-relaxed">
        <Typewriter text="I'm a passionate student developer who loves building user-friendly web apps. I'm currently studying at RMUTT University in Thailand." />
      </div>
    </section>
  );
}