# Tech Spec — Luxury Services

## Dependencias

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `gsap` | ^3.12 | Motor de animación + ScrollTrigger plugin |
| `lenis` | ^1.0 | Smooth scroll sincronizado con GSAP |
| `splitting` | ^1.0 | Split de texto en chars/words para animaciones tipográficas |
| `imagesloaded` | ^5.0 | Preload de imágenes antes de iniciar animaciones |

> Sin framework frontend. Vanilla JS (ES6+) + Vite como bundler.

---

## Inventario de Componentes

### Layout (compartidos)

| Componente | Fuente | Notas |
|------------|--------|-------|
| **Navigation** | Custom | Barra fija con transparencia→sólido al scroll. Toggle de idioma ES/EN. Menú hamburger con overlay fullscreen en mobile. |
| **Footer** | Custom | Tres columnas: logo+info, links, redes sociales. Back-to-top. |
| **PageLoader** | Custom | Spinner dorado sobre fondo oscuro. Desaparece tras precarga de fuentes + imagen hero + inicialización de libs. |

### Secciones (page-level)

| Componente | Fuente | Notas |
|------------|--------|-------|
| **HeroSection** | Custom | Grid 45/55 con Splitting + GSAP stagger en el título. Counter animation en estadísticas. Image scale reveal en la foto. |
| **ServicesSection** | Custom | Grid 3×2 de iconos sobre fondo oscuro. Cada item: icono SVG dorado + nombre (Playfair) + descripción. |
| **ProjectsSection** | Custom | Título sticky + grid asimétrico (patrón .35fr/1fr alternado). Seis tarjetas con border-radius único por tarjeta. |
| **AboutContactSection** | Custom | Título dorado + estadísticas con iconos + formulario de contacto con validación y estado de éxito. |

### Componentes Reutilizables

| Componente | Fuente | Uso |
|------------|--------|-----|
| **CrosslineReveal** | Custom | SVG de dos líneas cruzadas + título con Splitting. Usado en: Servicios, Proyectos, Sobre Nosotros. Recibe: color del stroke, selector del título. |
| **AnimatedCounter** | Custom | Número que anima de 0 al valor final. Usado en: Hero (3 stats), Sobre Nosotros (3 stats). Recibe: valor final, prefijo/sufijo, duration. |
| **ArrowCircle** | Custom | Círculo con flecha SVG. Hover: translateX slide loop. Usado en: tarjetas de Proyectos. Recibe: color del borde/flecha, link. |
| **PillButton** | Custom | Botón pill con 3 variantes (contorno negro, contorno dorado, sólido dorado). Usado en: Hero, Servicios, Proyectos, Contacto, Nav. Recibe: variant, label, href. |
| **ServiceIcon** | Custom | Círculo 72px con borde dorado + icono SVG. Hover: iluminación + escala. Usado en: ServicesSection grid. Recibe: icono SVG, nombre. |
| **ProjectCard** | Custom | Imagen con border-radius asimétrico + info + ArrowCircle. Usado en: ProjectsSection grid. Recibe: imagen, título, ubicación, fecha, categoría, borderRadius config. |
| **SocialIcon** | Custom | Círculo 24px con icono SVG de red social. Hover: cambio a dorado. Usado en: Footer. Recibe: icono SVG, link. |

---

## Plan de Animaciones

| Animación | Librería | Enfoque de Implementación | Complejidad |
|-----------|----------|---------------------------|-------------|
| **Reveal con Crossline** (Patrón #1) | GSAP + Splitting + ScrollTrigger | Timeline: stroke-dashoffset de las líneas SVG → Splitting del título (chars opacity+translateY con stagger). Wrapper `CrosslineReveal` que encapsula la timeline. Trigger: ScrollTrigger start "top 70%". | Media |
| **Image Scale Reveal** (Patrón #2) | GSAP + ScrollTrigger | Scale 1.3→1.0 en contenedor overflow:hidden. Aplicada en imagen Hero y opcionalmente en tarjetas de proyectos. | Baja |
| **Sticky Title Scroll** (Patrón #3) | GSAP ScrollTrigger (pin) | Pin del título de Proyectos con `end: "+=200%"`. Las tarjetas scrollean por debajo. | Media |
| **Card Slide-Up Reveal** (Patrón #4) | GSAP + ScrollTrigger | Batch de tarjetas: opacity 0→1, translateY 60→0, stagger 0.12–0.15s. Trigger start "top 75–85%". | Baja |
| **Counter Animation** (Patrón #5) | GSAP + ScrollTrigger | Tween de un objeto proxy `{value:0}` hasta el target, actualizando innerHTML en onUpdate. Stagger entre items. En Hero: trigger inmediato con delay. En Sobre Nosotros: trigger scroll. | Baja |
| **Icono Dorado Hover** (Patrón #6) | CSS transitions | Border-color y transform:scale en el icono SVG. Puramente CSS. | Baja |
| **Flecha Slide Hover** (Patrón #7) | CSS transitions | ::before + ::after duplican la flecha; translateX(-100%)→0 con cubic-bezier. Puramente CSS. | Media |
| **Hero entrance sequence** | GSAP timeline | Timeline maestra: preload → loader fade-out → imagen scale (1.3→1, 1.6s) → título Splitting stagger (0.02s/char, delay 0.3s) → subtítulo fade-in (delay 0.8s) → CTA fade-in (delay 1.0s) → counters (delay 1.2s). | Media |
| **Nav background transition** | CSS + JS | Scroll listener (>5vh) togglea clase CSS que aplica fondo sólido + backdrop-blur. Transición CSS 0.3s. | Baja |
| **Mobile menu overlay** | GSAP | Overlay fade-in 0.3s + links stagger fade-in 0.1s cada uno. | Baja |
| **Form submit states** | JS + CSS | Toggle entre estado default → loading (spinner + texto "Enviando...") → success (mensaje dorado fade-in 0.5s). | Baja |
| **Page loader** | GSAP | Spinner rotativo CSS + fade-out del contenedor completo (0.5s) al completar precarga. | Baja |

---

## Estado y Lógica — Plan Arquitectónico

### Sistema de Internacionalización (i18n)

**Arquitectura:** Diccionario plano JS con claves anidadas por sección. El idioma activo se almacena en una variable reactiva simple (no state manager completo). Al togglear ES↔EN se recorren todos los elementos DOM con atributo `data-i18n` y se reemplaza su `textContent`.

```
assets/i18n/
  es.json   — diccionario español (idioma por defecto)
  en.json   — diccionario inglés
```

Implementar como clase `I18n` con:
- `load(lang)` — fetch del JSON correspondiente
- `translateDOM()` — recorre `[data-i18n]` y aplica traducciones
- `toggle()` — alterna entre es/en, persiste en `localStorage`

### Secuencia de Inicialización (boot sequence)

Orden crítico que debe respetarse para evitar animaciones rotas o flash de contenido:

1. **Mostrar PageLoader** (spinner activo)
2. **Precargar fuentes** — `document.fonts.ready` para Playfair Display, Inter, Plus Jakarta Sans
3. **Precargar imagen hero** — `imagesloaded` sobre la imagen del hero
4. **Inicializar Splitting** — split de los títulos que lo requieren (Hero, Servicios, Proyectos, Sobre Nosotros)
5. **Inicializar Lenis** — smooth scroll global
6. **Registrar ScrollTrigger** — `gsap.registerPlugin(ScrollTrigger)`
7. **Sincronizar Lenis ↔ ScrollTrigger** — `lenis.on('scroll', ScrollTrigger.update)`
8. **Ocultar PageLoader** — fade-out 0.5s
9. **Ejecutar Hero entrance timeline** — secuencia de animaciones del hero (ver arriba)
10. **Crear ScrollTriggers restantes** — CrosslineReveal, Card Slide-Up, Counter (Sobre Nosotros)

> ScrollTriggers deben crearse **después** de que Splitting haya procesado los títulos, ya que dependen de los `.char`/`.word` generados.

### Formulario de Contacto — Máquina de Estados

Tres estados: `idle` → `submitting` → `success`. Transición controlada por clase CSS en el formulario. No hay backend en este MVP; el éxito se simula con `setTimeout`.

### Navegación — ScrollSpy

Scroll listener (throttled) que detecta qué sección está activa en viewport y resalta el link correspondiente. Usar `ScrollTrigger.create()` con `onEnter`/`onLeaveBack` por sección para mantener sincronización con GSAP.

---

## Otras Decisiones Clave

### Vanilla JS sin framework

El diseño es altamente visual con animaciones GSAP dominantes; no hay estado complejo ni DOM dinámico que justifique React/Vue. Vanilla JS + Vite mantiene el bundle mínimo y da control total sobre el timing de las animaciones.

### Lenis en lugar de smooth scroll nativo

Lenis se eligió porque se integra nativamente con GSAP ScrollTrigger vía `ScrollTrigger.scrollerProxy`, evitando bugs de sincronización que ocurren con smooth scroll casero.

### SVGs inline en lugar de librería de iconos

Todos los iconos (servicios, redes sociales, crossline, flechas) se definen como SVG inline directamente en el HTML. El diseño requiere iconos muy específicos (cocina, baño, casa, etc.) que no existen en librerías estándar, y los SVG inline permiten animar strokes/paths con GSAP y aplicar el color dorado por CSS.
