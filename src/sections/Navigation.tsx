import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { getLenis } from '@/hooks/useLenis';
import gsap from 'gsap';

export default function Navigation() {
  const { t, toggleLang, lang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.05);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(id, { offset: -72 });
    } else {
      const el = document.querySelector(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const links = document.querySelectorAll('.mobile-nav-link');
      gsap.fromTo(links, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: 'power3.out' });
    }
  }, [menuOpen]);

  const navLinks = [
    { key: 'nav.services', href: '#servicios' },
    { key: 'nav.projects', href: '#proyectos' },
    { key: 'nav.about', href: '#sobre-nosotros' },
    { key: 'nav.contact', href: '#contacto' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'border-b border-black/10 bg-white/95 backdrop-blur-md'
            : 'bg-transparent'
        }`}
        style={{ height: 72 }}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <button
            onClick={() => scrollTo('#hero')}
            className="flex items-center transition-opacity duration-200 hover:opacity-80"
          >
            <span className="font-display text-xl tracking-tight text-black lg:text-2xl">
              Luxury
            </span>
            <span className="ml-1.5 font-display text-xl tracking-tight text-gold lg:text-2xl">
              Services
            </span>
          </button>

          {/* Desktop Links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => scrollTo(link.href)}
                className="font-body text-sm font-medium text-black transition-colors duration-200 hover:text-gold"
              >
                {t(link.key)}
              </button>
            ))}
          </div>

          {/* Right side: Language + CTA */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 font-body text-xs font-medium uppercase tracking-widest"
            >
              <span className={lang === 'es' ? 'text-black' : 'text-black/40 transition-opacity hover:opacity-100'}>
                {t('lang.es')}
              </span>
              <span className="text-black/30">/</span>
              <span className={lang === 'en' ? 'text-black' : 'text-black/40 transition-opacity hover:opacity-100'}>
                {t('lang.en')}
              </span>
            </button>

            <button
              onClick={() => scrollTo('#contacto')}
              className="btn-solid-gold hidden text-xs md:inline-flex"
            >
              {t('nav.cta')}
            </button>

            {/* Hamburger */}
            <button
              className="flex flex-col gap-1.5 md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Menu"
            >
              <span className="block h-[2px] w-6 bg-black" />
              <span className="block h-[2px] w-6 bg-black" />
              <span className="block h-[2px] w-6 bg-black" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-dark">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-white"
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => scrollTo(link.href)}
                className="mobile-nav-link font-display text-3xl text-white transition-colors duration-200 hover:text-gold"
              >
                {t(link.key)}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTo('#contacto')}
            className="mobile-nav-link btn-solid-gold mt-10"
          >
            {t('nav.cta')}
          </button>
        </div>
      )}
    </>
  );
}
