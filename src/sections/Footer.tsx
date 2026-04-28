import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/hooks/useI18n';
import { getLenis } from '@/hooks/useLenis';

gsap.registerPlugin(ScrollTrigger);

const socialIcons = [
  // Instagram
  <svg key="ig" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>,
  // Facebook
  <svg key="fb" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>,
  // Pinterest
  <svg key="pin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="8" x2="12" y2="21" />
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M8.5 9.5a6 6 0 0 1 7 0" />
    <path d="M12 2v2" />
  </svg>,
  // LinkedIn
  <svg key="li" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>,
];

const socialLinks = ['#', '#', '#', '#'];

export default function Footer() {
  const { t } = useI18n();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(id, { offset: -72 });
    }
  };

  const navLinks = [
    { key: 'nav.services', href: '#servicios' },
    { key: 'nav.projects', href: '#proyectos' },
    { key: 'nav.about', href: '#sobre-nosotros' },
    { key: 'nav.contact', href: '#contacto' },
  ];

  return (
    <footer
      ref={footerRef}
      className="border-t border-white/15 bg-dark opacity-0"
      style={{ padding: 'clamp(48px, 5vw, 64px) clamp(24px, 5vw, 48px) clamp(24px, 3vw, 32px)' }}
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Main content */}
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
          {/* Logo & Info */}
          <div className="text-center md:text-left">
            <div className="mb-4">
              <span className="font-display text-xl text-gold">Luxury</span>
              <span className="ml-1.5 font-display text-xl text-gold/80">Services</span>
            </div>
            <div className="space-y-1 font-body text-[13px] leading-relaxed text-[#A0A0A0]">
              <p>Luxury Services, Central Florida, FL</p>
              <p>{t('footer.phone')}</p>
              <p>{t('footer.email')}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => scrollTo(link.href)}
                className="font-body text-[13px] font-medium uppercase tracking-widest text-white transition-colors duration-200 hover:text-gold"
              >
                {t(link.key)}
              </button>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            {socialIcons.map((icon, i) => (
              <a
                key={i}
                href={socialLinks[i]}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all duration-200 hover:border-gold hover:text-gold"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center">
          <p className="font-body text-xs text-[#A0A0A0]/60">
            {t('footer.copyright')}
          </p>
        </div>

        {/* Back to top */}
        <button
          onClick={() => {
            const lenis = getLenis();
            if (lenis) lenis.scrollTo(0);
          }}
          className="mx-auto mt-6 flex items-center justify-center text-[#A0A0A0]/60 transition-colors duration-200 hover:text-gold md:absolute md:bottom-8 md:right-12 md:mt-0"
          aria-label="Back to top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  );
}
