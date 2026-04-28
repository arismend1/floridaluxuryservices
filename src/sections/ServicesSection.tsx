import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/hooks/useI18n';
import { getLenis } from '@/hooks/useLenis';

gsap.registerPlugin(ScrollTrigger);

const serviceIcons = [
  // Kitchen - countertop/cabinets
  <svg key="kitchen" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B38728" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 20h18M5 20V10l7-5 7 5v10M9 20v-6h6v6" />
  </svg>,
  // Bathroom - shower/sink
  <svg key="bathroom" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B38728" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 4v4M6 8h4M4 20h16M4 20V10h16v10" />
    <path d="M20 10V6a2 2 0 0 0-2-2h-2" />
  </svg>,
  // Whole House - house with lines
  <svg key="wholehouse" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B38728" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10M2 12h20" />
  </svg>,
  // Outdoor - terrace/pergola
  <svg key="outdoor" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B38728" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20h20M4 20V10l8-6 8 6v10" />
    <path d="M8 20v-4h8v4" />
  </svg>,
  // Custom Carpentry - saw/hammer
  <svg key="carpentry" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B38728" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>,
  // Interior Design - pencil/ruler
  <svg key="interior" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B38728" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
  </svg>,
];

const services = [
  { key: 'service.kitchen', desc: 'service.kitchen.desc', icon: serviceIcons[0] },
  { key: 'service.bathroom', desc: 'service.bathroom.desc', icon: serviceIcons[1] },
  { key: 'service.wholehouse', desc: 'service.wholehouse.desc', icon: serviceIcons[2] },
  { key: 'service.outdoor', desc: 'service.outdoor.desc', icon: serviceIcons[3] },
  { key: 'service.carpentry', desc: 'service.carpentry.desc', icon: serviceIcons[4] },
  { key: 'service.interior', desc: 'service.interior.desc', icon: serviceIcons[5] },
];

export default function ServicesSection() {
  const { t, lang } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const crosslineRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const titleWords = useMemo(() => t('services.title').split(' '), [lang]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Crossline draw animation
      if (crosslineRef.current) {
        const lines = crosslineRef.current.querySelectorAll('line');
        lines.forEach((line) => {
          const length = 85;
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        });

        tl.to(lines, {
          strokeDashoffset: 0,
          duration: 1,
          ease: 'power4.inOut',
          stagger: 0.1,
        });

        // Title word reveal
        if (titleRef.current) {
          const wordSpans = titleRef.current.querySelectorAll('.word-inner');
          tl.to(wordSpans, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power4.out',
            stagger: 0.05,
          }, '-=0.5');
        }
      }

      // Grid items slide-up
      if (gridRef.current) {
        const items = gridRef.current.children;
        gsap.fromTo(
          items,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power4.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // CTA fade-in
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            delay: 0.3,
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [lang]);

  return (
    <section
      id="servicios"
      ref={sectionRef}
      className="bg-dark"
      style={{ padding: 'clamp(100px, 12vw, 160px) clamp(24px, 5vw, 48px)' }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Crossline + Title */}
        <div className="mb-20 text-center">
          <svg
            ref={crosslineRef}
            width="60"
            height="60"
            viewBox="0 0 60 60"
            className="mx-auto mb-10"
          >
            <line x1="0" y1="60" x2="60" y2="0" stroke="#B38728" strokeWidth="2" />
            <line x1="0" y1="0" x2="60" y2="60" stroke="#B38728" strokeWidth="2" />
          </svg>
          <h2
            ref={titleRef}
            className="mx-auto max-w-[800px] font-display text-[clamp(40px,4vw,72px)] leading-[1.15] text-gold"
          >
            {titleWords.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden" style={{ marginRight: '0.3em' }}>
                <span className="word-inner inline-block" style={{ opacity: 0, transform: 'translateY(100%)' }}>
                  {word}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* Services Grid */}
        <div
          ref={gridRef}
          className="mx-auto grid max-w-[900px] grid-cols-2 gap-x-12 gap-y-16 md:grid-cols-3"
        >
          {services.map((service) => (
            <div
              key={service.key}
              className="flex flex-col items-center text-center"
            >
              <div className="service-icon-circle">
                {service.icon}
              </div>
              <h3 className="mt-5 font-display text-[22px] text-white md:text-[28px]">
                {t(service.key)}
              </h3>
              <p className="mt-2 max-w-[260px] font-body text-sm leading-relaxed text-[#A0A0A0]">
                {t(service.desc)}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button
            ref={ctaRef}
            onClick={() => {
              const lenis = getLenis();
              if (lenis) lenis.scrollTo('#proyectos', { offset: -72 });
            }}
            className="btn-outline-gold opacity-0"
          >
            {t('services.cta')}
          </button>
        </div>
      </div>
    </section>
  );
}
