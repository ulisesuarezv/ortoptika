/**
 * Fuente de verdad de datos de contacto, negocio y navegación.
 * Datos reales confirmados (ver memoria del proyecto).
 * Horarios = placeholder hasta confirmar con la doctora.
 */

const WHATSAPP_NUMBER = "573213394829"; // formato E.164 sin "+" para wa.me
const WHATSAPP_DEFAULT_MESSAGE =
  "Hola, me gustaría agendar una cita de ortóptica / terapia visual.";

export const SITE_CONFIG = {
  name: "Ortoptika Terapia",
  shortName: "Ortoptika",
  url: "https://ortoptikaterapia.com", // dominio asumido (aún no comprado)
  locale: "es_CO",

  profesional: "Yeimmy Paola Barragan",
  titulo: "Optómetra — Especialista en Ortóptica y Terapia Visual",

  descripcion:
    "Ortóptica y terapia visual en Colombia, con atención presencial en Ibagué, Tolima. Tratamiento de estrabismo, ojo vago (ambliopía), problemas de visión binocular y optometría pediátrica.",

  // Contacto — canal único: WhatsApp
  telefono: "+57 321 3394829",
  telefonoHref: "tel:+573213394829",
  whatsappNumber: WHATSAPP_NUMBER,
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_DEFAULT_MESSAGE,
  )}`,

  // Ubicación
  direccion: {
    clinica: "Clínica Medicadiz – Sede Samaria",
    calle: "Cra. 12 sur #93-21, Consultorio 212",
    ciudad: "Ibagué",
    departamento: "Tolima",
    pais: "Colombia",
    completa:
      "Clínica Medicadiz – Sede Samaria, Cra. 12 sur #93-21, Consultorio 212, Ibagué, Tolima, Colombia",
    // Coordenadas por confirmar (para schema geo en /contacto, sesión 5).
    lat: null as number | null,
    lng: null as number | null,
  },

  // Horarios — PLACEHOLDER, por confirmar con la doctora
  horarios: {
    porConfirmar: true,
    semana: "Lunes a viernes: por confirmar",
    sabado: "Sábado: por confirmar",
    domingo: "Domingo: cerrado",
  },

  social: {
    instagram: "https://www.instagram.com/ortoptikaterapia/",
    instagramHandle: "@ortoptikaterapia",
  },

  // Pendiente: embed URL de Google Maps (sesión 5)
  googleMapsEmbed: "",

  // Google Tag Manager — PLACEHOLDER hasta crear el contenedor real.
  // Mientras siga el valor "GTM-XXXXXXX", el layout NO inyecta ningún script.
  gtmId: "GTM-XXXXXXX",
} as const;

/** true sólo cuando gtmId es un contenedor real (no el placeholder). */
export function hasRealGtmId(): boolean {
  return /^GTM-[A-Z0-9]+$/.test(SITE_CONFIG.gtmId) && !SITE_CONFIG.gtmId.includes("X");
}

/**
 * Devuelve un enlace de WhatsApp con mensaje personalizado opcional.
 */
export function whatsappLink(message?: string): string {
  const text = message ?? WHATSAPP_DEFAULT_MESSAGE;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Servicios (los 5 del brief). Contenido a validar por la doctora.
 * Usados para nav, ServicesGrid y sitemap en sesiones posteriores.
 */
export const SERVICES = [
  {
    slug: "estrabismo",
    titulo: "Estrabismo",
    resumen: "Tratamiento de ojos desviados en niños y adultos.",
  },
  {
    slug: "ambliopia",
    titulo: "Ambliopía (ojo vago)",
    resumen: "Terapia para el ojo perezoso más allá del parche.",
  },
  {
    slug: "terapia-visual",
    titulo: "Terapia visual",
    resumen: "Rehabilitación visual con ejercicios personalizados.",
  },
  {
    slug: "vision-binocular",
    titulo: "Visión binocular",
    resumen: "Visión doble, fatiga visual e insuficiencia de convergencia.",
  },
  {
    slug: "optometria-pediatrica",
    titulo: "Optometría pediátrica",
    resumen: "Detección temprana de problemas visuales en la infancia.",
  },
] as const;

export type Service = (typeof SERVICES)[number];

/**
 * Navegación principal del sitio.
 */
export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/servicios/terapia-visual", label: "Servicios" },
  { href: "/contacto", label: "Contacto" },
] as const;
