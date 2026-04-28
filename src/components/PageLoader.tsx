import { useEffect, useState } from 'react';
import gsap from 'gsap';

export default function PageLoader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fontsReady = document.fonts.ready;
    const heroImg = new Image();
    heroImg.src = '/assets/hero-interior.jpg';
    const imgLoaded = new Promise<void>((resolve) => {
      heroImg.onload = () => resolve();
      heroImg.onerror = () => resolve();
    });

    Promise.all([fontsReady, imgLoaded]).then(() => {
      gsap.to('.loader-content', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          setVisible(false);
          onComplete();
        },
      });
    });

    const timeout = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="loader-content fixed inset-0 z-50 flex items-center justify-center bg-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin-slow rounded-full border-2 border-gold border-t-transparent" />
        <span className="font-display text-lg text-gold">Luxury Services</span>
      </div>
    </div>
  );
}
