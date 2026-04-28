import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollProgress from './ui/ScrollProgress';
import Loader from './ui/Loader';
import StatCounter from './ui/StatCounter';
import MoatFunnel3D from './three/MoatFunnel3D';
import BlackBox3D from './three/BlackBox3D';

gsap.registerPlugin(ScrollTrigger);

const sectionClass = 'story-section reveal';

const quadrants = [
  { title: 'REJECT', body: 'Abandons the moat. Generic satellite analytics is commoditized.', tone: 'reject' },
  { title: 'REJECT', body: 'Two unfamiliar fronts simultaneously. Highest risk, lowest leverage.', tone: 'reject' },
  { title: 'PRIORITY 1 (DEEPEN)', body: 'Bundle credit + insurance + advisory. Monetize infrastructure already built.', tone: 'priority' },
  { title: 'PRIORITY 2 (EXPAND)', body: 'Analog markets: Bangladesh, Kenya, Indonesia with smallholder insurance.', tone: 'expand' }
] as const;

export default function SatyuktExperience() {
  const [loading, setLoading] = useState(true);
  const [choice, setChoice] = useState<'Go Deeper' | 'Go Global' | null>(null);
  const [active, setActive] = useState(0);
  const [compare, setCompare] = useState(56);
  const [focusQuadrant, setFocusQuadrant] = useState<number | null>(null);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (loading) return;

    const sections = Array.from(document.querySelectorAll('section[data-story]'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index ?? 0);
            setActive(idx);
          }
        });
      },
      { threshold: 0.55 }
    );

    sections.forEach((s) => io.observe(s));

    const ctx = gsap.context(() => {
      gsap.from('.reveal', {
        opacity: 0,
        y: 60,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.reveal',
          start: 'top 85%'
        }
      });

      gsap.to('.hero h1', {
        scale: 0.78,
        yPercent: -20,
        scrollTrigger: {
          trigger: '#section-1',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }, rootRef);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, [loading]);

  const callbackText = useMemo(() => {
    if (!choice) return 'Choose a door in Section 2 to personalize the final strategic callback.';
    return `You chose ${choice} at the start. The analysis lands on Go Deeper — Priority 1.`;
  }, [choice]);

  if (loading) return <Loader onDone={() => setLoading(false)} />;

  return (
    <main ref={rootRef}>
      <ScrollProgress activeIndex={active} />

      <section id="section-1" className={`${sectionClass} hero`} data-story data-index={0}>
        <p className="eyebrow">Satyukt Strategic Analysis</p>
        <h1>Satyukt: Selling Trust, Not Satellites.</h1>
        <p>Platformization of AI in Agriculture | Strategic Analysis</p>
        <div className="hero-visual-grid">
          <img src="/images/generated/agri-lab-generated.svg" alt="Generated agri biotech lab concept" />
          <img src="/images/generated/agri-network-generated.svg" alt="Generated agritech network concept" />
        </div>
      </section>

      <section id="section-2" className={sectionClass} data-story data-index={1}>
        <h2>The Opening Question: Bengaluru, 2020</h2>
        <div className="choice-grid">
          {['Go Deeper', 'Go Global'].map((label) => (
            <button key={label} className={choice === label ? 'choice selected' : 'choice'} onClick={() => setChoice(label as 'Go Deeper' | 'Go Global')}>
              <h3>{label}</h3>
              <p>{label === 'Go Deeper' ? 'Build more services for the existing user base of farmers and institutions in India.' : 'Take the satellite-based products to other geographies and emerging markets.'}</p>
              {choice === label && <span className="check">✓ selected</span>}
            </button>
          ))}
        </div>
        <p className="footer-strip">Before we choose a door, we need to understand what Satyukt actually is.</p>
      </section>

      <section id="section-3" className={sectionClass} data-story data-index={2}>
        <h2>The Surface Reality: A Textbook AgriTech Success</h2>
        <div className="cards-4">
          {[
            ['Sat2Farm (B2C)', 'Farm advisory.'],
            ['Sat2Credit (B2B)', 'Lending.'],
            ['Sat4Agri (B2B)', 'Agri-enterprise.'],
            ['Sat4Risk (B2G/B2B)', 'Crop insurance.']
          ].map(([title, body]) => (
            <article key={title}><h3>{title}</h3><p>{body}</p></article>
          ))}
        </div>
        <p className="footer-strip">Founded 2018 (IISc/ISRO DNA) | Serving 18 countries | Backed by NABARD + Social Alpha ($500K)</p>
      </section>

      <section id="section-4" className={`${sectionClass} split`} data-story data-index={3}>
        <div>
          <h2>The Domain: This isn't a yield problem.</h2>
          <p><strong><StatCounter target={60} suffix="%" /></strong> of Indians depend on agriculture... yet it contributes only ~15% to GDP.</p>
          <p><strong><StatCounter target={50} suffix="%" /></strong> of small & marginal farmers cannot borrow from any formal source.</p>
        </div>
        <blockquote>"Satyukt isn't here to grow more rice. It is here to make farmers legible to capital."</blockquote>
      </section>

      <section id="section-5" className={sectionClass} data-story data-index={4}>
        <h2>The Technology: The satellite data is free. The algorithm isn't.</h2>
        <MoatFunnel3D />
        <p className="footer-strip">Key Takeaway: Anyone can buy the pixels. Almost no one has the India-tuned models.</p>
      </section>

      <section id="section-6" className={sectionClass} data-story data-index={5}>
        <h2>The Platform Illusion: A Multi-Product Data Business</h2>
        <div className="cards-4">
          {['Farmers (B2C)', 'Banks (B2B)', 'Insurers/Govt (B2G)', 'Agri-Enterprises (B2B)'].map((item) => (
            <article key={item}><h3>{item}</h3><p>Data Fee ⇄ Processed Data</p><p className="weak">WEAK</p></article>
          ))}
        </div>
        <p className="insight">The Verdict: Not a platform. Not yet. The flywheel hasn't started spinning. It relies on linear subscription and data fees.</p>
      </section>

      <section id="section-7" className={sectionClass} data-story data-index={6}>
        <h2>The National Context: What makes it work in India, makes it hard to leave.</h2>
        <div className="table-grid">
          <div><h3>Tailwind (Why it works)</h3><p>ISRO Partnership, NABARD + PMFBY, DILRMP records, and KCC infrastructure.</p></div>
          <div><h3>Lock-in (Why it's trapped)</h3><p>Data sovereignty, subsidy dependency, land fragmentation, and credit-rail specificity.</p></div>
        </div>
        <p className="footer-strip">Going global ≠ flipping a switch. It means rebuilding institutional scaffolding country by country.</p>
      </section>

      <section id="section-8" className={sectionClass} data-story data-index={7}>
        <h2>The Value Proposition: Farmers benefit. Institutions pay.</h2>
        <div className="flows">
          <div className="flow green">Farmer outcomes</div>
          <div className="flow navy">Banks: credit APIs</div>
          <div className="flow navy">Insurers: risk underwriting</div>
          <div className="flow navy">Govt agencies: oversight funding</div>
        </div>
        <p>Exception: Farmers may pay a small Sat2Farm subscription, but it remains the smallest revenue line and weakest moat.</p>
        <img className="section-image" src="/images/generated/agri-field-generated.svg" alt="Generated smart farm automation concept" />
      </section>

      <section id="section-9" className={sectionClass} data-story data-index={8}>
        <h2>The Evolution: Monetizing by moving closer to the decision.</h2>
        <ol className="stairs">
          <li>2018: Consultancy — selling raw analyses (lowest captured value).</li>
          <li>2019: Sat2Farm — selling advisories to farmers.</li>
          <li>2020: Sat2Credit & Sat4Risk — selling decisions to institutions.</li>
          <li className="active-step">Next: Trust Infrastructure — selling ongoing risk/credit relationships.</li>
        </ol>
      </section>

      <section id="section-10" className={sectionClass} data-story data-index={9}>
        <h2>The Synthesis: Agriculture and Finance are Complements, not Substitutes.</h2>
        <div className="puzzle">
          <div>Agriculture</div>
          <span>◆ Satyukt's Moat ◆</span>
          <div>Finance</div>
        </div>
        <div className="table-grid">
          <div><h3>Why it's half right</h3><p>Institutions pay. Agri-finance TAM is large. Sat2Credit/Sat4Risk are revenue engines.</p></div>
          <div><h3>Why it's half wrong</h3><p>Strip out agriculture and scoring becomes generic fintech. The moat remains crop-soil-weather intelligence.</p></div>
        </div>
      </section>

      <section id="section-11" className={sectionClass} data-story data-index={10}>
        <h2>Algorithmic Inclusion: The real shift in power dynamics</h2>
        <div className="compare-wrap">
          <div className="compare-before" style={{ width: `${compare}%` }}>
            <h3>Before</h3>
            <p>Exclusion wall, moneylender debt (24%+), unreachable formal banks.</p>
          </div>
          <div className="compare-after">
            <h3>After</h3>
            <p>Algorithmic bridge to bank/insurer access, lower rates, formal inclusion.</p>
          </div>
        </div>
        <input type="range" min={5} max={95} value={compare} onChange={(e) => setCompare(Number(e.target.value))} aria-label="Before after slider" />
      </section>

      <section id="section-12" className={sectionClass} data-story data-index={11}>
        <h2>The Real Risk is Model Governance.</h2>
        <BlackBox3D />
        <ul>
          <li>Who audits the model?</li>
          <li>What happens if the yield estimation is artificially depressed?</li>
          <li>What if the credit score is wrong due to a satellite glitch?</li>
        </ul>
        <p className="insight">Opacity, not power transfer, is the structural threat to long-term trust infrastructure.</p>
      </section>

      <section id="section-13" className={sectionClass} data-story data-index={12}>
        <h2>The Strategic Quadrant: Follow the moat, not the buyer.</h2>
        <div className="quad-grid">
          {quadrants.map((item, index) => (
            <button key={item.title + index} className={`quad-btn ${item.tone}`} onClick={() => setFocusQuadrant(index)}>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </button>
          ))}
        </div>
        {focusQuadrant !== null && (
          <div className="quad-modal" role="dialog" aria-modal="true">
            <article>
              <h3>{quadrants[focusQuadrant].title}</h3>
              <p>{quadrants[focusQuadrant].body}</p>
              <button onClick={() => setFocusQuadrant(null)}>Close</button>
            </article>
          </div>
        )}
      </section>

      <section id="section-14" className={`${sectionClass} final`} data-story data-index={13}>
        <p className="eyebrow">The Final Verdict</p>
        <h1>Satyukt isn't a satellite company. It is trust infrastructure.</h1>
        <div className="cards-3">
          <article>The Moat is the algorithm.</article>
          <article>The Buyer is the institution.</article>
          <article>The Strategy is to deepen.</article>
        </div>
        <p className="callback">{callbackText}</p>
        <div className="cards-3">
          <img src="/images/generated/agri-lab-generated.svg" alt="AI plant lab artwork" />
          <img src="/images/generated/agri-network-generated.svg" alt="Agrisystem network artwork" />
          <img src="/images/generated/agri-field-generated.svg" alt="Farm automation artwork" />
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Read the full analysis again</button>
      </section>
    </main>
  );
}
