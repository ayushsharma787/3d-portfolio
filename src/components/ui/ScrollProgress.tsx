import { sections } from '../../lib/content';

interface ScrollProgressProps {
  activeIndex: number;
}

export default function ScrollProgress({ activeIndex }: ScrollProgressProps) {
  return (
    <aside className="scroll-progress" aria-label="Section progress">
      {sections.map((section, index) => (
        <button
          key={section}
          onClick={() => document.getElementById(`section-${index + 1}`)?.scrollIntoView({ behavior: 'smooth' })}
          className={index === activeIndex ? 'dot active' : 'dot'}
          aria-label={`Go to ${section}`}
        />
      ))}
    </aside>
  );
}
