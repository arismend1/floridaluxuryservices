import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/hooks/useI18n';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'projects.kitchen.title',
    location: 'projects.kitchen.loc',
    category: 'projects.kitchen.cat',
    image: '/assets/project-kitchen.jpg',
    borderRadius: '120px 0 0 0',
    gridClass: 'md:col-span-1',
  },
  {
    title: 'projects.bathroom.title',
    location: 'projects.bathroom.loc',
    category: 'projects.bathroom.cat',
    image: '/assets/project-bathroom.jpg',
    borderRadius: '0 120px 0 0',
    gridClass: 'md:col-span-1',
  },
  {
    title: 'projects.backyard.title',
    location: 'projects.backyard.loc',
    category: 'projects.backyard.cat',
    image: '/assets/project-backyard.jpg',
    borderRadius: '0 0 0 120px',
    gridClass: 'md:col-span-1',
  },
  {
    title: 'projects.office.title',
    location: 'projects.office.loc',
    category: 'projects.office.cat',
    image: '/assets/project-office.jpg',
    borderRadius: '0 0 120px 0',
    gridClass: 'md:col-span-1',
  },
  {
    title: 'projects.suite.title',
    location: 'projects.suite.loc',
    category: 'projects.suite.cat',
    image: '/assets/project-suite.jpg',
    borderRadius: '120px 0 0 0',
    gridClass: 'md:col-span-1',
  },
  {
    title: 'projects.living.title',
    location: 'projects.living.loc',
    category: 'projects.living.cat',
    image: '/assets/project-living.jpg',
    borderRadius: '0 120px 0 0',
    gridClass: 'md:col-span-1',
  },
];

export default function ProjectsSection() {
  const { t, lang } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const crosslineRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const titleWords = useMemo(() => t('projects.title').split(' '), [lang]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Crossline + title reveal
      if (crosslineRef.current && titleRef.current) {
        const lines = crosslineRef.current.querySelectorAll('line');
        lines.forEach((line) => {
          const length = 85;
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
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
        const wordSpans = titleRef.current.querySelectorAll('.word-inner');
        tl.to(wordSpans, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power4.out',
          stagger: 0.05,
        }, '-=0.5');
      }

      // Cards slide-up reveal
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.project-card');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power4.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // CTA fade-in
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 90%',
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
      id="proyectos"
      ref={sectionRef}
      className="bg-white"
      style={{ paddingTop: 'clamp(80px, 10vw, 120px)', paddingBottom: 'clamp(100px, 12vw, 160px)' }}
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Crossline + Title */}
        <div className="mb-16 text-center md:mb-20">
          <svg
            ref={crosslineRef}
            width="60"
            height="60"
            viewBox="0 0 60 60"
            className="mx-auto mb-10"
          >
            <line x1="0" y1="60" x2="60" y2="0" stroke="#000000" strokeWidth="2" />
            <line x1="0" y1="0" x2="60" y2="60" stroke="#000000" strokeWidth="2" />
          </svg>
          <h2
            ref={titleRef}
            className="mx-auto max-w-[700px] font-display text-[clamp(36px,4vw,64px)] leading-[1.15] text-black"
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

        {/* Projects Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project, index) => (
            <div
              key={index}
              className="project-card group cursor-pointer"
            >
              {/* Image */}
              <div className="overflow-hidden max-md:!rounded-2xl" style={{ borderRadius: project.borderRadius }}>
                <img
                  src={project.image}
                  alt={t(project.title)}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h3 className="font-body text-lg font-medium text-black">
                    {t(project.title)}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-body text-[13px] text-muted-text">
                      {t(project.location)} | 2024
                    </span>
                  </div>
                  <span className="mt-1 inline-block font-body text-[11px] font-medium uppercase tracking-widest text-gold">
                    {t(project.category)}
                  </span>
                </div>

                {/* Arrow Circle */}
                <div className="arrow-circle mt-1 flex-shrink-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button
            ref={ctaRef}
            className="btn-outline-black opacity-0"
            onClick={() => {}}
          >
            {t('projects.cta')}
          </button>
        </div>
      </div>
    </section>
  );
}
