/**
 * Fuente de verdad de datos de contacto, negocio y navegación.
 * Datos reales confirmados por la doctora (Ortoptika-Preguntas-Doctora, sesión 9).
 */

const WHATSAPP_NUMBER = "573213394829"; // formato E.164 sin "+" para wa.me
const WHATSAPP_DEFAULT_MESSAGE =
  "Hola, me gustaría agendar una cita de ortóptica / terapia visual.";

export const SITE_CONFIG = {
  name: "Ortoptika Terapia",
  shortName: "Ortoptika",
  url: "https://ortoptikaterapia.com", // dominio comprado
  locale: "es_CO",

  profesional: "Yeimmy Paola Barragan",
  titulo: "Optómetra — Especialista en Ortóptica y Terapia Visual",

  descripcion:
    "Ortóptica y terapia visual en Colombia, con atención presencial en Ibagué, Tolima. Tratamiento de estrabismo, ojo vago (ambliopía), problemas de visión binocular y optometría pediátrica.",

  // Contacto — canal principal: WhatsApp. Email de respaldo (Gmail de la
  // doctora; migrar a contacto@ortoptikaterapia.com cuando exista ese buzón).
  telefono: "+57 321 3394829",
  telefonoHref: "tel:+573213394829",
  whatsappNumber: WHATSAPP_NUMBER,
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_DEFAULT_MESSAGE,
  )}`,
  email: "ortoptika.2020@gmail.com",

  // Ubicación
  direccion: {
    clinica: "Clínica Medicadiz – Sede Samaria",
    calle: "Cra. 12 sur #93-21, Consultorio 212",
    ciudad: "Ibagué",
    departamento: "Tolima",
    pais: "Colombia",
    completa:
      "Clínica Medicadiz – Sede Samaria, Cra. 12 sur #93-21, Consultorio 212, Ibagué, Tolima, Colombia",
    // Coordenadas reales del pin de Google Business (verificadas en Maps).
    lat: 4.4252077 as number | null,
    lng: -75.1763545 as number | null,
  },

  // Ficha de Google Business ya creada. El CID es el identificador estable del
  // lugar: sobrevive a cambios de nombre/dirección, a diferencia de la URL
  // larga con /place/<nombre>/@lat,lng que Maps genera al compartir.
  googleMapsCid: "10961633092813368645",
  googleMapsUrl: "https://maps.google.com/?cid=10961633092813368645",

  // Horarios reales confirmados por la doctora: solo atiende martes a jueves.
  horarios: {
    dias: "Martes a jueves",
    turnos: ["8:00 a. m. – 12:00 p. m.", "2:00 p. m. – 6:00 p. m."],
    texto: "Martes a jueves: 8:00 a. m. – 12:00 p. m. y 2:00 p. m. – 6:00 p. m.",
    cerrado: "Lunes, viernes y fines de semana: cerrado",
  },

  social: {
    instagram: "https://www.instagram.com/ortoptikaterapia/",
    instagramHandle: "@ortoptikaterapia",
    // Facebook confirmado como activo por la doctora, URL aún pendiente de
    // que nos la comparta — no enlazar hasta tenerla.
    facebook: null as string | null,
  },

  // Credenciales y trayectoria reales (confirmadas por la doctora).
  // Nota: NO se publica el número de cédula (ReTHUS), a pedido explícito
  // de la doctora — solo el registro CTNPO, que sí autorizó mostrar.
  credenciales: {
    tituloOptometra: "Optómetra — Universidad de La Salle, Bogotá (2004)",
    especializacion:
      "Especialista en Ortóptica y Terapia Visual — Universidad de La Salle, Bogotá (2021)",
    registroProfesional: "Registro profesional 1368 CTNPO — Consejo Técnico Nacional Profesional de Optometría",
    aniosExperiencia: 22,
    aniosComoOrtoptista: 6,
    formacionAdicional: [
      "Especialización en Salud Colectiva — Universidad Gama Filho, Río de Janeiro, Brasil (2005)",
      "Especialización en Salud Pública — Fundación Oswaldo Cruz, Río de Janeiro, Brasil (2009)",
      "Curso de Procesamiento Visual — Centro Internacional de Educación Continuada Latinoamérica, Estereoptik & Eyebix Performance (2020)",
      "Congreso Visión y Deporte SVVT LATAM (2020)",
    ],
  },

  // Embed del mapa para /contacto. Se construye desde el CID (no desde
  // coordenadas sueltas) para que el pin salga rotulado "Ortoptika Terapia"
  // con su tarjeta de dirección, y no como un punto anónimo.
  googleMapsEmbed:
    "https://maps.google.com/maps?cid=10961633092813368645&hl=es&z=17&output=embed",

  // Google Tag Manager — contenedor real (creado el 7-sep-2026).
  // El guard hasRealGtmId() deja de bloquear la inyección con este valor.
  gtmId: "GTM-K829BB3C",
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
