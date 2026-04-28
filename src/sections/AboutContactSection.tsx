import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/hooks/useI18n';

gsap.registerPlugin(ScrollTrigger);

const statIcons = [
  // Calendar/clock
  <svg key="cal" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B38728" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>,
  // House/checkmark
  <svg key="house" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B38728" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>,
  // Shield/star
  <svg key="shield" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B38728" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>,
];

export default function AboutContactSection() {
  const { t, lang } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const crosslineRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const stat1Ref = useRef<HTMLSpanElement>(null);
  const stat2Ref = useRef<HTMLSpanElement>(null);
  const stat3Ref = useRef<HTMLSpanElement>(null);

  const titleWords = useMemo(() => t('about.title').split(' '), [lang]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Crossline + Title reveal
      if (crosslineRef.current && titleRef.current) {
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

        const wordSpans = titleRef.current.querySelectorAll('.word-inner');
        tl.to(wordSpans, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power4.out',
          stagger: 0.05,
        }, '-=0.5');
      }

      // Subtitle fade-in
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Stats counter animation
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
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (ref.current) {
              ref.current.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
            }
          },
        });
      };

      animateCounter(stat1Ref, 30, '+', '', 0);
      animateCounter(stat2Ref, 500, '+', '', 0.2);
      animateCounter(stat3Ref, 100, '', '%', 0.4);

      // Stats items fade-in
      if (statsRef.current) {
        const items = statsRef.current.children;
        gsap.fromTo(
          items,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.2,
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Form fade-in
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Contact info fade-in
      if (contactInfoRef.current) {
        const items = contactInfoRef.current.children;
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: contactInfoRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [lang]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormState('submitting');
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  }, [formData]);

  const stats = [
    { icon: statIcons[0], ref: stat1Ref, prefix: '+', value: '30', label: 'about.stat1' },
    { icon: statIcons[1], ref: stat2Ref, prefix: '+', value: '500', label: 'about.stat2' },
    { icon: statIcons[2], ref: stat3Ref, prefix: '', value: '100%', label: 'about.stat3' },
  ];

  return (
    <section
      id="sobre-nosotros"
      ref={sectionRef}
      className="bg-dark"
      style={{ padding: 'clamp(100px, 12vw, 160px) clamp(24px, 5vw, 48px)' }}
    >
      <div className="mx-auto max-w-[800px]">
        {/* Crossline + Title */}
        <div className="text-center">
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
            className="font-display text-[clamp(36px,3.5vw,56px)] leading-[1.15] text-gold"
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

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mx-auto mt-8 max-w-[640px] text-center font-body text-[17px] leading-[1.7] text-white/85 opacity-0"
        >
          {t('about.subtitle')}
        </p>

        {/* Stats */}
        <div
          ref={statsRef}
          className="mt-16 flex flex-col items-center justify-center gap-8 md:flex-row md:gap-16"
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="mb-4">{stat.icon}</div>
              <span
                ref={stat.ref}
                className="font-accent text-[44px] font-bold text-gold"
              >
                {stat.prefix}{stat.value}
              </span>
              <span className="mt-1 font-body text-[13px] font-medium uppercase tracking-widest text-[#A0A0A0]">
                {t(stat.label)}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-auto my-16 h-px w-full max-w-[400px] bg-white/15" />

        {/* Contact Form */}
        <div id="contacto" className="mx-auto max-w-[600px]">
          <div className="mb-10 text-center">
            <h3 className="font-display text-[32px] text-white">
              {t('contact.title')}
            </h3>
            <p className="mt-2 font-body text-[15px] text-[#A0A0A0]">
              {t('contact.subtitle')}
            </p>
          </div>

          {formState === 'success' ? (
            <div className="rounded-lg border border-gold/30 bg-gold/5 p-8 text-center">
              <svg
                className="mx-auto mb-4 h-12 w-12 text-gold"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p className="font-body font-medium text-gold">
                {t('contact.success')}
              </p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5 opacity-0">
              <input
                type="text"
                placeholder={t('contact.name')}
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input-gold"
              />
              <input
                type="email"
                placeholder={t('contact.email')}
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input-gold"
              />
              <input
                type="tel"
                placeholder={t('contact.phone')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input-gold"
              />
              <textarea
                placeholder={t('contact.message')}
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-textarea-gold min-h-[120px] resize-y"
              />
              <button
                type="submit"
                disabled={formState === 'submitting'}
                className="btn-solid-gold mt-3 w-full disabled:opacity-70"
              >
                {formState === 'submitting' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('contact.sending')}
                  </span>
                ) : (
                  t('contact.submit')
                )}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div
          ref={contactInfoRef}
          className="mt-12 flex flex-col items-center justify-center gap-6 md:flex-row md:gap-12"
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B38728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="font-body text-sm text-white">{t('footer.phone')}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B38728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="font-body text-sm text-white">{t('footer.email')}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B38728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="font-body text-sm text-white">Central Florida, FL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
