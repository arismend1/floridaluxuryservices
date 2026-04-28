import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/hooks/useI18n';
import { getLenis } from '@/hooks/useLenis';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  ready: boolean;
}

export default function HeroSection({ ready }: HeroSectionProps) {
  const { t, lang } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const titleLine1Ref = useRef<HTMLDivElement>(null);
  const titleLine2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLSpanElement>(null);
  const stat2Ref = useRef<HTMLSpanElement>(null);
  const stat3Ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  // Split text into character spans
  const title1Chars = useMemo(() => t('hero.title1').split(''), [lang]);
  const title2Chars = useMemo(() => t('hero.title2').split(''), [lang]);

  useEffect(() => {
    if (!ready) return;

    const ctx = gsap.context(() => {
      // Image scale reveal (only on first load)
      if (imageRef.current && !hasAnimated.current) {
        gsap.fromTo(
          imageRef.current.querySelector('img'),
          { scale: 1.3 },
          { scale: 1, duration: 1.6, ease: 'power4.out', delay: 0.2 }
        );
      }

      // Title line 1 animation
      if (titleLine1Ref.current) {
        gsap.fromTo(
          titleLine1Ref.current.querySelectorAll('.char'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power4.out',
            stagger: 0.02,
            delay: hasAnimated.current ? 0 : 0.3,
          }
        );
      }

      // Title line 2 animation
      if (titleLine2Ref.current) {
        gsap.fromTo(
          titleLine2Ref.current.querySelectorAll('.char'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power4.out',
            stagger: 0.02,
            delay: hasAnimated.current ? 0 : 0.45,
          }
        );
      }

      // Subtitle fade-in
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: hasAnimated.current ? 0.1 : 0.8 }
        );
      }

      // CTA fade-in
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: 'power3.out', delay: hasAnimated.current ? 0.15 : 1.0 }
        );
      }

      // Counter animations (only on first load)
      if (!hasAnimated.current) {
        const animateCounter = (
          ref: React.RefObject<HTMLSpanElement | null>,
          target: number,
          prefix: string,
          suffix: string,
          delay: number
        ) => {
          if (!ref.current) return;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            delay,
            onUpdate: () => {
              if (ref.current) {
                ref.current.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
              }
            },
          });
        };

        animateCounter(stat1Ref, 30, '+', '', 1.2);
        animateCounter(stat2Ref, 500, '+', '', 1.4);
        animateCounter(stat3Ref, 100, '', '%', 1.6);
        hasAnimated.current = true;
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [ready, lang]);

  const scrollToServices = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo('#servicios', { offset: -72 });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[700px] bg-white lg:h-screen"
    >
      <div className="mx-auto grid h-full max-w-[1440px] items-center gap-8 px-6 pt-24 pb-12 lg:grid-cols-[45%_55%] lg:px-12 lg:pt-0 lg:pb-0">
        {/* Text Column */}
        <div className="flex flex-col justify-center">
          {/* Title */}
          <div className="font-display text-[40px] leading-[1.05] tracking-tight text-black md:text-[56px] lg:text-[clamp(64px,5.5vw,88px)]">
            <div ref={titleLine1Ref}>
              {title1Chars.map((char, i) => (
                <span key={i} className="char inline-block" style={{ opacity: 0, transform: 'translateY(40px)' }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
            <div ref={titleLine2Ref}>
              {title2Chars.map((char, i) => (
                <span key={i} className="char inline-block" style={{ opacity: 0, transform: 'translateY(40px)' }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mt-6 max-w-[420px] font-body text-[15px] leading-relaxed text-muted-text opacity-0 md:text-[17px]"
          >
            {t('hero.subtitle')}
          </p>

          {/* CTA */}
          <button
            ref={ctaRef}
            onClick={scrollToServices}
            className="btn-outline-black mt-8 w-fit opacity-0"
          >
            {t('hero.cta')}
          </button>

          {/* Stats */}
          <div className="mt-12 flex flex-col gap-6 md:flex-row md:gap-12">
            {[
              { ref: stat1Ref, value: '+30', label: t('hero.stat1') },
              { ref: stat2Ref, value: '+500', label: t('hero.stat2') },
              { ref: stat3Ref, value: '100%', label: t('hero.stat3') },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-6 md:gap-0">
                <div className="flex flex-col">
                  <span
                    ref={stat.ref}
                    className="font-accent text-[36px] font-bold text-black md:text-[48px]"
                  >
                    {stat.value}
                  </span>
                  <span className="mt-1 font-body text-xs font-medium uppercase tracking-widest text-muted-text">
                    {stat.label}
                  </span>
                </div>
                {i < 2 && (
                  <div className="hidden h-10 w-px bg-black/15 md:ml-12 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Image Column */}
        <div
          ref={imageRef}
          className="relative h-[400px] overflow-hidden lg:h-[85vh]"
        >
          <img
            src="/assets/hero-interior.jpg"
            alt="Luxury interior remodeling"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
