import { useState, useCallback, useEffect } from 'react';

const translations: Record<string, Record<string, string>> = {
  es: {
    'nav.services': 'Servicios',
    'nav.projects': 'Proyectos',
    'nav.about': 'Sobre Nosotros',
    'nav.contact': 'Contacto',
    'nav.cta': 'Cotizar Ahora',
    'hero.title1': 'De la Visión',
    'hero.title2': 'a la Realidad',
    'hero.subtitle': 'Remodelamos espacios para crear el hogar que siempre soñaste. Con más de 5 años transformando casas en experiencias únicas.',
    'hero.cta': 'Ver Nuestros Servicios',
    'hero.stat1': 'Años de Experiencia',
    'hero.stat2': 'Proyectos Completados',
    'hero.stat3': 'Satisfacción Garantizada',
    'services.title': 'Calidad Inigualable en Cada Detalle',
    'services.cta': 'Explorar Servicios',
    'service.kitchen': 'Kitchen Remodeling',
    'service.bathroom': 'Bathroom Renovation',
    'service.wholehouse': 'Whole House Transformation',
    'service.outdoor': 'Outdoor Living',
    'service.carpentry': 'Custom Carpentry',
    'service.interior': 'Interior Design',
    'service.kitchen.desc': 'Diseños modernos y funcionales para el corazón de tu hogar.',
    'service.bathroom.desc': 'Transformamos tu baño en un spa de lujo personalizado.',
    'service.wholehouse.desc': 'Renovación completa con atención a cada rincón.',
    'service.outdoor.desc': 'Terrazas, piscinas y espacios al aire libre de ensueño.',
    'service.carpentry.desc': 'Muebles y acabados a medida con maderas selectas.',
    'service.interior.desc': 'Asesoría profesional para crear ambientes únicos.',
    'projects.title': 'Nuestros Proyectos Más Recientes',
    'projects.cta': 'Ver Todos los Proyectos',
    'projects.kitchen.title': 'Modern Kitchen Makeover',
    'projects.kitchen.loc': 'Cental Florida',
    'projects.kitchen.cat': 'Kitchen Remodeling',
    'projects.bathroom.title': 'Spa-Inspired Bathroom',
    'projects.bathroom.loc': 'Coral Gables, FL',
    'projects.bathroom.cat': 'Bathroom Renovation',
    'projects.backyard.title': 'Backyard Oasis',
    'projects.backyard.loc': 'Pinecrest, FL',
    'projects.backyard.cat': 'Outdoor Living',
    'projects.office.title': 'Custom Home Office',
    'projects.office.loc': 'Brickell, FL',
    'projects.office.cat': 'Whole House',
    'projects.suite.title': 'Luxury Master Suite',
    'projects.suite.loc': 'Key Biscayne, FL',
    'projects.suite.cat': 'Interior Design',
    'projects.living.title': 'Open-Concept Living',
    'projects.living.loc': 'Aventura, FL',
    'projects.living.cat': 'Whole House',
    'about.title': 'Mas de 5 Años Transformando Hogares',
    'about.subtitle': 'Desde 2020, Luxury Services ha sido sinónimo de excelencia en la remodelación de casas en Miami y sus alrededores. Nuestro equipo de artesanos, diseñadores y project managers trabaja con pasión para convertir cada visión en una realidad que supera las expectativas.',
    'about.stat1': 'Años de Experiencia',
    'about.stat2': 'Proyectos Exitosos',
    'about.stat3': 'Garantía de Calidad',
    'contact.title': 'Hablemos de Tu Proyecto',
    'contact.subtitle': 'Cuéntanos sobre la remodelación que tienes en mente y te contactaremos pronto.',
    'contact.name': 'Tu nombre completo',
    'contact.email': 'tu@email.com',
    'contact.phone': '(000) 000-0000',
    'contact.message': 'Cuéntanos sobre tu proyecto...',
    'contact.submit': 'Enviar Mensaje',
    'contact.sending': 'Enviando...',
    'contact.success': '¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.',
    'footer.phone': '(321) 442-7567',
    'footer.email': 'luxuryservicesfl@gmail.com',
    'footer.address': 'Central Florida; FL',
    'footer.copyright': '© 2020 Luxury Services. Todos los derechos reservados.',
    'lang.es': 'ES',
    'lang.en': 'EN',
  },
  en: {
    'nav.services': 'Services',
    'nav.projects': 'Projects',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.cta': 'Get a Quote',
    'hero.title1': 'From Vision',
    'hero.title2': 'to Reality',
    'hero.subtitle': 'We remodel spaces to create the home you\'ve always dreamed of. With over 5 years transforming houses into unique experiences.',
    'hero.cta': 'See Our Services',
    'hero.stat1': 'Years of Experience',
    'hero.stat2': 'Projects Completed',
    'hero.stat3': 'Satisfaction Guaranteed',
    'services.title': 'Unmatched Quality in Every Detail',
    'services.cta': 'Explore Services',
    'service.kitchen': 'Kitchen Remodeling',
    'service.bathroom': 'Bathroom Renovation',
    'service.wholehouse': 'Whole House Transformation',
    'service.outdoor': 'Outdoor Living',
    'service.carpentry': 'Custom Carpentry',
    'service.interior': 'Interior Design',
    'service.kitchen.desc': 'Modern and functional designs for the heart of your home.',
    'service.bathroom.desc': 'We transform your bathroom into a personalized luxury spa.',
    'service.wholehouse.desc': 'Complete renovation with attention to every corner.',
    'service.outdoor.desc': 'Terraces, pools, and dream outdoor spaces.',
    'service.carpentry.desc': 'Custom furniture and finishes with select woods.',
    'service.interior.desc': 'Professional advice to create unique environments.',
    'projects.title': 'Our Most Recent Projects',
    'projects.cta': 'View All Projects',
    'projects.kitchen.title': 'Modern Kitchen Makeover',
    'projects.kitchen.loc': 'Miami Beach, FL',
    'projects.kitchen.cat': 'Kitchen Remodeling',
    'projects.bathroom.title': 'Spa-Inspired Bathroom',
    'projects.bathroom.loc': 'Coral Gables, FL',
    'projects.bathroom.cat': 'Bathroom Renovation',
    'projects.backyard.title': 'Backyard Oasis',
    'projects.backyard.loc': 'Pinecrest, FL',
    'projects.backyard.cat': 'Outdoor Living',
    'projects.office.title': 'Custom Home Office',
    'projects.office.loc': 'Brickell, FL',
    'projects.office.cat': 'Whole House',
    'projects.suite.title': 'Luxury Master Suite',
    'projects.suite.loc': 'Key Biscayne, FL',
    'projects.suite.cat': 'Interior Design',
    'projects.living.title': 'Open-Concept Living',
    'projects.living.loc': 'Aventura, FL',
    'projects.living.cat': 'Whole House',
    'about.title': '5 Years Transforming Homes',
    'about.subtitle': 'Since 2020, Luxury Services has been synonymous with excellence in home remodeling in Cental Florida and surrounding areas. Our team of craftsmen, designers, and project managers works with passion to turn every vision into a reality that exceeds expectations.',
    'about.stat1': 'Years of Experience',
    'about.stat2': 'Successful Projects',
    'about.stat3': 'Quality Guarantee',
    'contact.title': "Let's Talk About Your Project",
    'contact.subtitle': 'Tell us about the remodeling you have in mind and we will contact you soon.',
    'contact.name': 'Your full name',
    'contact.email': 'your@email.com',
    'contact.phone': '(000) 000-0000',
    'contact.message': 'Tell us about your project...',
    'contact.submit': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Thank you! We have received your message and will contact you soon.',
    'footer.phone': '(321) 442-7567',
    'footer.email': 'luxuryservicesfl@gmail.com',
    'footer.address': 'Central Florida, FL',
    'footer.copyright': '© 2026 Luxury Services. All rights reserved.',
    'lang.es': 'ES',
    'lang.en': 'EN',
  },
};

let currentLang = 'es';
const listeners = new Set<() => void>();

export function useI18n() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const cb = () => setTick(t => t + 1);
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);

  const t = useCallback((key: string): string => {
    return translations[currentLang]?.[key] ?? translations['es']?.[key] ?? key;
  }, []);

  const toggleLang = useCallback(() => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    listeners.forEach(l => l());
  }, []);

  const lang = currentLang;

  return { t, toggleLang, lang };
}

export { currentLang };
