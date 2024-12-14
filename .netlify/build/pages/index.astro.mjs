import { e as createComponent, r as renderTemplate, m as maybeRenderHead, i as renderComponent, j as renderScript, k as renderSlot, l as renderHead, g as addAttribute, h as createAstro } from '../chunks/astro/server_D0aXAXRg.mjs';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$ReunionButton = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="buttons"> <a class="button is-primary" href="/reuniones"> <span class="icon"> <i class="fas fa-calendar-check"></i> </span> <strong>Programar Reunión</strong> </a> </div>`;
}, "/home/mikel/code/repos/proyectoXabiWeb/src/components/ReunionButton.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Typewriter = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", `<span id="typewriter" data-astro-cid-tnzwls7f></span><span class="cursor" data-astro-cid-tnzwls7f>|</span> <script lang="module" type="module">
  const phrases = [
    "Somos los mejores en SEO",
    "Expertos en Marketing Digital",
    "Estrategias Personalizadas",
    "Resultados Garantizados"
  ];

  document.addEventListener('DOMContentLoaded', () => {
    const typewriter = document.getElementById('typewriter');
    if (!typewriter) return;
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];
      const displayedText = isDeleting
        ? currentPhrase.substring(0, charIndex - 1)
        : currentPhrase.substring(0, charIndex + 1);

      typewriter.textContent = displayedText;

      let delay = isDeleting ? 50 : 150;

      if (!isDeleting && charIndex === currentPhrase.length) {
        delay = 1000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 500;
      }

      isDeleting ? charIndex-- : charIndex++;

      setTimeout(type, delay);
    };

    type();
  });
<\/script> `])), maybeRenderHead());
}, "/home/mikel/code/repos/proyectoXabiWeb/src/components/Typewriter.astro", void 0);

const $$HeroSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="hero-body" data-astro-cid-nlow4r3u> <div class="container p-6" data-astro-cid-nlow4r3u> <div class="columns is-vcentered" data-astro-cid-nlow4r3u> <div class="column" data-astro-cid-nlow4r3u> <h1 class="title is-0 is-size-1-mobile has-text-weight-bold" data-astro-cid-nlow4r3u>Impulsa tu Negocio de Estilismo Canino</h1> <p class="subtitle is-4 has-text-grey" data-astro-cid-nlow4r3u>${renderComponent($$result, "Typewriter", $$Typewriter, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/mikel/code/repos/proyectoXabiWeb/src/components/Typewriter.astro", "client:component-export": "default", "data-astro-cid-nlow4r3u": true })}</p> ${renderComponent($$result, "ReunionButton", $$ReunionButton, { "data-astro-cid-nlow4r3u": true })} </div> <div class="column is-hidden-mobile animate-slide-in" data-astro-cid-nlow4r3u> <figure class="image is-4by3" data-astro-cid-nlow4r3u> <img src="/src/assets/images/dog-grooming.jpg" alt="Dog grooming" class="is-rounded transition-transform hover-effect" data-astro-cid-nlow4r3u> </figure> </div> </div> </div> </div> `;
}, "/home/mikel/code/repos/proyectoXabiWeb/src/components/HeroSection.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="navBarMenu" class="is-fluid is-marginless" data-astro-cid-3ef6ksr2> <nav class="navbar has-shadow is-spaced is-primary" role="navigation" aria-label="main navigation" data-astro-cid-3ef6ksr2> <div class="container" data-astro-cid-3ef6ksr2> <div class="navbar-brand" data-astro-cid-3ef6ksr2> <a class="navbar-item" href="/" data-astro-cid-3ef6ksr2> <strong data-astro-cid-3ef6ksr2>Logo</strong> </a> <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navMenu" data-astro-cid-3ef6ksr2> <span aria-hidden="true" data-astro-cid-3ef6ksr2></span> <span aria-hidden="true" data-astro-cid-3ef6ksr2></span> <span aria-hidden="true" data-astro-cid-3ef6ksr2></span> </a> </div> <div id="navMenu" class="navbar-menu" data-astro-cid-3ef6ksr2> <div class="navbar-start" data-astro-cid-3ef6ksr2> <a class="navbar-item has-text-weight-semibold" href="/" data-astro-cid-3ef6ksr2>
Inicio
</a> <a class="navbar-item has-text-weight-semibold" href="/servicios" data-astro-cid-3ef6ksr2>
Servicios
</a> <a class="navbar-item has-text-weight-semibold" href="/nosotros" data-astro-cid-3ef6ksr2>
Nosotros
</a> <a class="navbar-item has-text-weight-semibold" href="/contacto" data-astro-cid-3ef6ksr2>
Contacto
</a> </div> <div class="navbar-end" data-astro-cid-3ef6ksr2> <div class="navbar-item" data-astro-cid-3ef6ksr2> <div class="buttons" data-astro-cid-3ef6ksr2> ${renderComponent($$result, "ReunionButton", $$ReunionButton, { "data-astro-cid-3ef6ksr2": true })} </div> </div> </div> </div>  </div> </nav> </div> ${renderScript($$result, "/home/mikel/code/repos/proyectoXabiWeb/src/components/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/mikel/code/repos/proyectoXabiWeb/src/components/Header.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  return renderTemplate(_a || (_a = __template(['<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', '><link rel="stylesheet" href="/src/assets/bulma/bulma.min.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"><title>Astro Basics</title>', "</head> <body> ", " ", "  <script type=\"module\">\n	// Check if device is not mobile/tablet\n	if (window.matchMedia(\"(min-width: 1024px)\").matches) {\n		// Add a custom cursor to the page\n		const cursor = document.createElement('div');\n		cursor.style.cssText = 'width: 30px; height: 30px; border-radius: 50%; position: fixed; pointer-events: none; mix-blend-mode: difference; background: white; z-index: 9999;';\n		document.body.appendChild(cursor);\n\n		document.addEventListener('mousemove', (e) => {\n			cursor.style.left = `${e.clientX - 10}px`;\n			cursor.style.top = `${e.clientY - 10}px`;\n		});\n	}\n<\/script></body></html>"], ['<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', '><link rel="stylesheet" href="/src/assets/bulma/bulma.min.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"><title>Astro Basics</title>', "</head> <body> ", " ", "  <script type=\"module\">\n	// Check if device is not mobile/tablet\n	if (window.matchMedia(\"(min-width: 1024px)\").matches) {\n		// Add a custom cursor to the page\n		const cursor = document.createElement('div');\n		cursor.style.cssText = 'width: 30px; height: 30px; border-radius: 50%; position: fixed; pointer-events: none; mix-blend-mode: difference; background: white; z-index: 9999;';\n		document.body.appendChild(cursor);\n\n		document.addEventListener('mousemove', (e) => {\n			cursor.style.left = \\`\\${e.clientX - 10}px\\`;\n			cursor.style.top = \\`\\${e.clientY - 10}px\\`;\n		});\n	}\n<\/script></body></html>"])), addAttribute(Astro2.generator, "content"), renderHead(), renderComponent($$result, "Header", $$Header, {}), renderSlot($$result, $$slots["default"]));
}, "/home/mikel/code/repos/proyectoXabiWeb/src/layouts/Layout.astro", void 0);

const $$ServiciosSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="section" data-astro-cid-3xhgqfdj> <div class="container" data-astro-cid-3xhgqfdj> <h2 class="title is-2 has-text-centered" data-astro-cid-3xhgqfdj>Nuestros Servicios</h2> <div class="columns mt-6" data-astro-cid-3xhgqfdj> <div class="column" data-astro-cid-3xhgqfdj> <div class="box has-text-centered" data-astro-cid-3xhgqfdj> <span class="icon is-large has-text-warning" data-astro-cid-3xhgqfdj> <i class="fa fa-cut fa-2x" data-astro-cid-3xhgqfdj></i> </span> <h3 class="title is-4 mt-4" data-astro-cid-3xhgqfdj>Corte de Pelo</h3> <p class="subtitle is-6" data-astro-cid-3xhgqfdj>Descripción del servicio de corte de pelo.</p> </div> </div> <div class="column" data-astro-cid-3xhgqfdj> <div class="box has-text-centered" data-astro-cid-3xhgqfdj> <span class="icon is-large has-text-warning" data-astro-cid-3xhgqfdj> <i class="fa fa-bath fa-2x" data-astro-cid-3xhgqfdj></i> </span> <h3 class="title is-4 mt-4" data-astro-cid-3xhgqfdj>Bañado</h3> <p class="subtitle is-6" data-astro-cid-3xhgqfdj>Descripción del servicio de baño.</p> </div> </div> <div class="column" data-astro-cid-3xhgqfdj> <div class="box has-text-centered" data-astro-cid-3xhgqfdj> <span class="icon is-large has-text-warning" data-astro-cid-3xhgqfdj> <i class="fa fa-paw fa-2x" data-astro-cid-3xhgqfdj></i> </span> <h3 class="title is-4 mt-4" data-astro-cid-3xhgqfdj>Trimming de Uñas</h3> <p class="subtitle is-6" data-astro-cid-3xhgqfdj>Descripción del servicio de trimming de uñas.</p> </div> </div> </div> </div> </section> `;
}, "/home/mikel/code/repos/proyectoXabiWeb/src/components/ServiciosSection.astro", void 0);

const $$SobreNosotrosSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="section" data-astro-cid-27ns7vku> <div class="container p-6" data-astro-cid-27ns7vku> <div class="columns is-vcentered" data-astro-cid-27ns7vku> <div class="column" data-astro-cid-27ns7vku> <h1 class="title is-2 has-text-weight-bold" data-astro-cid-27ns7vku>Sobre Nosotros</h1> <div class="content" data-astro-cid-27ns7vku> <h3 class="title is-4" data-astro-cid-27ns7vku>Nuestra Misión</h3> <p class="subtitle is-5 has-text-grey" data-astro-cid-27ns7vku>
En Woof & Work Marketing, nos dedicamos a revolucionar la presencia digital de empresas mediante estrategias creativas y efectivas. Combinamos el marketing digital con un toque único y amigable, inspirado en la lealtad y entusiasmo que caracterizan a nuestros amigos caninos.
</p> <h3 class="title is-4" data-astro-cid-27ns7vku>Nuestra Visión</h3> <p class="subtitle is-5 has-text-grey" data-astro-cid-27ns7vku>
Aspiramos a ser la agencia de marketing digital líder que transforme la manera en que las empresas conectan con sus audiencias. Queremos crear un espacio donde la creatividad, la innovación y la efectividad se combinen para generar resultados extraordinarios.
</p> <h3 class="title is-4" data-astro-cid-27ns7vku>Nuestros Valores</h3> <ul class="has-text-grey" data-astro-cid-27ns7vku> <li data-astro-cid-27ns7vku>Lealtad - Como nuestros amigos peludos, somos fieles a nuestros clientes y sus objetivos</li> <li data-astro-cid-27ns7vku>Creatividad - Pensamos fuera de la caja para encontrar soluciones únicas</li> <li data-astro-cid-27ns7vku>Compromiso - Nos dedicamos al 100% a cada proyecto</li> <li data-astro-cid-27ns7vku>Adaptabilidad - Evolucionamos constantemente con las tendencias digitales</li> <li data-astro-cid-27ns7vku>Transparencia - Comunicación clara y honesta en todo momento</li> <li data-astro-cid-27ns7vku>Pasión - Amamos lo que hacemos tanto como los perros aman sus juguetes</li> </ul> </div> </div> <div class="column is-hidden-mobile animate-slide-in" data-astro-cid-27ns7vku> <figure class="image hover-effect" data-astro-cid-27ns7vku> <img src="/src/assets/images/social-media-metrics.jpg" alt="Sobre nosotros" data-astro-cid-27ns7vku> </figure> </div> </div> </div> </section> `;
}, "/home/mikel/code/repos/proyectoXabiWeb/src/components/SobreNosotrosSection.astro", void 0);

const $$Astro = createAstro();
const $$TestimonioItem = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TestimonioItem;
  const { nombre, comentario } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="box"> <h3 class="title is-4">${nombre}</h3> <p class="content">${comentario}</p> </div>`;
}, "/home/mikel/code/repos/proyectoXabiWeb/src/components/TestimonioItem.astro", void 0);

const $$TestimoniosCarousel = createComponent(($$result, $$props, $$slots) => {
  const testimonios = [
    {
      nombre: "Cl\xEDnica Veterinaria PetCare",
      comentario: "Gracias a su estrategia de marketing digital, hemos aumentado nuestras consultas en un 40%. El contenido que crean sobre cuidado animal es excepcional."
    },
    {
      nombre: "Peluquer\xEDa Canina Happy Dogs",
      comentario: "La gesti\xF3n de nuestras redes sociales ha sido transformadora. Nuestros clientes valoran mucho el contenido educativo sobre el cuidado del pelaje."
    },
    {
      nombre: "Tienda de Mascotas PawParadise",
      comentario: "Las campa\xF1as de email marketing han sido clave para fidelizar a nuestros clientes. Nuestras ventas online se han duplicado."
    },
    {
      nombre: "Centro de Adiestramiento K9",
      comentario: "El posicionamiento SEO nos ha ayudado a llegar a m\xE1s due\xF1os de mascotas. Su comprensi\xF3n del sector animal es invaluable."
    },
    {
      nombre: "Hospital Veterinario San Mart\xEDn",
      comentario: "Su experiencia en marketing veterinario nos ha permitido destacar en un mercado muy competitivo. Los resultados han superado nuestras expectativas."
    },
    {
      nombre: "Pet Shop Huellitas",
      comentario: "Desde que implementamos su estrategia de marketing digital, hemos visto un incremento significativo en clientes nuevos y mejores rese\xF1as online."
    },
    {
      nombre: "Centro Veterinario Norte",
      comentario: "La campa\xF1a de redes sociales que dise\xF1aron captur\xF3 perfectamente la esencia de nuestro servicio. Estamos muy satisfechos con los resultados."
    },
    {
      nombre: "Spa Canino Luxury Pets",
      comentario: "Su enfoque en marketing de contenidos nos ha ayudado a educar a nuestros clientes sobre la importancia del bienestar animal."
    },
    {
      nombre: "Cl\xEDnica Felina MiauSalud",
      comentario: "Las estrategias de marketing espec\xEDficas para gatos nos han permitido llegar a un nicho muy espec\xEDfico. Excelente trabajo."
    },
    {
      nombre: "Pet Hotel Lucky",
      comentario: "Gracias a su gesti\xF3n de marketing, nuestra ocupaci\xF3n ha aumentado un 60%. Su conocimiento del sector mascotas es impresionante."
    }
  ];
  return renderTemplate`${maybeRenderHead()}<div class="container" data-astro-cid-uri3jt2f> <div class="slider-mask" data-astro-cid-uri3jt2f> <div class="slider-track" data-astro-cid-uri3jt2f> ${testimonios.map((testimonio) => renderTemplate`<div class="slider-item" data-astro-cid-uri3jt2f> ${renderComponent($$result, "TestimonioItem", $$TestimonioItem, { "nombre": testimonio.nombre, "comentario": testimonio.comentario, "data-astro-cid-uri3jt2f": true })} </div>`)} ${testimonios.map((testimonio) => renderTemplate`<div class="slider-item" data-astro-cid-uri3jt2f> ${renderComponent($$result, "TestimonioItem", $$TestimonioItem, { "nombre": testimonio.nombre, "comentario": testimonio.comentario, "data-astro-cid-uri3jt2f": true })} </div>`)} </div> </div> </div> `;
}, "/home/mikel/code/repos/proyectoXabiWeb/src/components/TestimoniosCarousel.astro", void 0);

const $$TestimoniosSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="testimonios"> <h2 class="title is-3 has-text-centered">Testimonios</h2> <!-- Comentarios de clientes --> ${renderComponent($$result, "TestimoniosCarousel", $$TestimoniosCarousel, {})} </section>`;
}, "/home/mikel/code/repos/proyectoXabiWeb/src/components/TestimoniosSection.astro", void 0);

const $$ContactoSection = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="section"> <div class="container"> <h2 class="title is-2 has-text-centered">Contáctanos</h2> <p class="subtitle is-5 has-text-centered has-text-grey mb-6">¿Quieres impulsar tu negocio en el sector de mascotas? Déjanos tus datos y nos pondremos en contacto contigo.</p> <div class="columns is-centered"> <div class="column is-8"> <form class="box" action="/api/enviar-contacto" method="POST"> <div class="field"> <label class="label">Nombre completo *</label> <div class="control"> <input class="input" type="text" id="nombre" name="nombre" required> </div> </div> <div class="field"> <label class="label">Nombre de la empresa</label> <div class="control"> <input class="input" type="text" id="empresa" name="empresa"> </div> </div> <div class="columns"> <div class="column"> <div class="field"> <label class="label">Email *</label> <div class="control"> <input class="input" type="email" id="email" name="email" required> </div> </div> </div> <div class="column"> <div class="field"> <label class="label">Teléfono</label> <div class="control"> <input class="input" type="tel" id="telefono" name="telefono"> </div> </div> </div> </div> <div class="field"> <label class="label">Tipo de negocio *</label> <div class="control"> <div class="select is-fullwidth"> <select id="tipo" name="tipo" required> <option value="">Selecciona una opción</option> <option value="veterinaria">Veterinaria</option> <option value="tienda">Tienda de mascotas</option> <option value="peluqueria">Peluquería canina</option> <option value="otro">Otro</option> </select> </div> </div> </div> <div class="field"> <label class="label">Mensaje *</label> <div class="control"> <textarea class="textarea" id="mensaje" name="mensaje" rows="4" required></textarea> </div> </div> <div class="field"> <div class="control"> <button type="submit" class="button is-primary is-fullwidth">Enviar mensaje</button> </div> </div> </form> <div id="mensaje-respuesta" class="notification is-hidden mt-4"></div> </div> </div> </div> </section> ${renderScript($$result, "/home/mikel/code/repos/proyectoXabiWeb/src/components/ContactoSection.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/mikel/code/repos/proyectoXabiWeb/src/components/ContactoSection.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroSection", $$HeroSection, {})} ${renderComponent($$result2, "ServiciosSection", $$ServiciosSection, {})} ${renderComponent($$result2, "SobreNosotrosSection", $$SobreNosotrosSection, {})} ${renderComponent($$result2, "TestimoniosSection", $$TestimoniosSection, {})} ${renderComponent($$result2, "ContactoSection", $$ContactoSection, {})} ` })}`;
}, "/home/mikel/code/repos/proyectoXabiWeb/src/pages/index.astro", void 0);

const $$file = "/home/mikel/code/repos/proyectoXabiWeb/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
