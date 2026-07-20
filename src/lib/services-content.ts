/**
 * Contenido de las landings de servicio (/servicios/[slug]).
 *
 * BORRADOR revisable (YMYL): tono empático dirigido a padres, condicional
 * ("suele", "puede ayudar a"), SIN promesas de curación, sin cifras ni
 * estadísticas inventadas, sin testimonios. Toda afirmación clínica debe
 * validarla la doctora antes de publicar (ver lista en PLAN-DESARROLLO.md).
 *
 * Cada servicio define además su "tema visual" (watermark, variantes de
 * Backdrop, palabra acentuada) para que las 5 landings hereden el lenguaje
 * disruptivo sin ser idénticas.
 */

import type { FAQItem } from "@/components/ui/FAQAccordion";

export type BackdropVariant = "blobs" | "waves" | "iris" | "dots";

export type ServiceTheme = {
  /** Palabra-gráfico gigante de fondo en el hero. */
  watermark: string;
  /** Variante de Backdrop del hero (varía entre servicios). */
  heroBackdrop: BackdropVariant;
  /** Variante de Backdrop de las secciones intermedias. */
  midBackdrop: BackdropVariant;
  /** Espeja las capas decorativas para variar la composición. */
  flip?: boolean;
};

export type ServiceContent = {
  slug: string;
  /** Nombre corto para encabezados y breadcrumb. */
  nombre: string;
  /** <title> de la página (sin marca; el template la añade). */
  metaTitle: string;
  metaDescription: string;
  /** Cluster de keywords del servicio (meta keywords + guía del copy). */
  keywords: string[];
  /** serviceType para el JSON-LD Service. */
  serviceType: string;
  theme: ServiceTheme;

  hero: {
    eyebrow: string;
    /** Titular fragmentado: línea pequeña + palabra grande + acento itálico. */
    tituloPre: string;
    tituloGrande: string;
    tituloAccent: string;
    lead: string;
    /** Mensaje prellenado del CTA de WhatsApp. */
    whatsappMessage: string;
  };

  queEs: {
    titulo: string;
    parrafos: string[];
    /** Señales que los padres pueden observar en casa. */
    senalesTitulo: string;
    senales: string[];
  };

  tipos: {
    titulo: string;
    intro: string;
    items: { nombre: string; descripcion: string }[];
  };

  tratamiento: {
    titulo: string;
    parrafos: string[];
    /** En qué puede ayudar la terapia (condicional, sin promesas). */
    puntos: string[];
  };

  proceso: {
    titulo: string;
    intro: string;
    pasos: { titulo: string; descripcion: string }[];
  };

  paraQuien: {
    titulo: string;
    intro: string;
    perfiles: string[];
    /** Nota YMYL de cierre (derivación / no sustituye valoración). */
    nota: string;
  };

  faq: FAQItem[];
};

export const SERVICES_CONTENT: Record<string, ServiceContent> = {
  /* ------------------------------------------------------------------ */
  /* 01 · ESTRABISMO                                                     */
  /* ------------------------------------------------------------------ */
  estrabismo: {
    slug: "estrabismo",
    nombre: "Estrabismo",
    metaTitle: "Tratamiento de estrabismo en Colombia — ortóptica en Ibagué",
    metaDescription:
      "Tratamiento de estrabismo (ojos desviados) con ortóptica y terapia visual en Colombia. Valoración presencial de niños y adultos en Ibagué, trabajo coordinado con oftalmología. Agenda por WhatsApp.",
    keywords: [
      "estrabismo tratamiento",
      "estrabismo en Colombia",
      "qué es el estrabismo",
      "estrabismo Ibagué",
      "ojos desviados niños",
      "tratamiento estrabismo sin cirugía",
      "ortóptica estrabismo",
      "terapia visual estrabismo",
      "estrabismo en adultos",
    ],
    serviceType: "Ortóptica y terapia visual para estrabismo",
    theme: {
      watermark: "alinear",
      heroBackdrop: "iris",
      midBackdrop: "waves",
    },
    hero: {
      eyebrow: "Servicio · Estrabismo",
      tituloPre: "Cuando los ojos",
      tituloGrande: "no miran",
      tituloAccent: "al mismo lugar",
      lead: "El estrabismo es la desviación de uno o ambos ojos: mientras un ojo mira al frente, el otro puede girarse hacia adentro, afuera, arriba o abajo. Notarlo en tu hijo puede asustar, pero hay mucho que se puede hacer: el primer paso es una valoración completa para entender qué tipo de desviación es y qué la está causando.",
      whatsappMessage:
        "Hola, quiero agendar una valoración por estrabismo (ojos desviados).",
    },
    queEs: {
      titulo: "Qué es el estrabismo",
      parrafos: [
        "En una visión alineada, los dos ojos apuntan al mismo objeto y el cerebro fusiona ambas imágenes en una sola. En el estrabismo esa coordinación se pierde: uno de los ojos se desvía, de forma constante o solo en algunos momentos (cuando el niño está cansado, enfermo o mirando de cerca, por ejemplo).",
        "Más allá de lo estético, lo importante es lo que ocurre dentro del sistema visual: cuando los ojos no trabajan alineados, el cerebro puede empezar a ignorar la imagen del ojo desviado para evitar ver doble. Con el tiempo, eso puede afectar el desarrollo de la visión de ese ojo (ambliopía u “ojo vago”) y de la visión en profundidad.",
        "Por eso la recomendación general es no esperar a “ver si se corrige solo”: una desviación que persiste más allá de los primeros meses de vida merece una valoración profesional, y cuanto antes se estudie, más opciones de manejo suele haber.",
      ],
      senalesTitulo: "Señales que puedes observar en casa",
      senales: [
        "Un ojo que se desvía hacia adentro o hacia afuera, siempre o por momentos",
        "Ojos que se ven “descuadrados” en las fotos con flash",
        "Tu hijo cierra o guiña un ojo con la luz del sol",
        "Tuerce o inclina la cabeza para mirar",
        "Se queja de ver doble o de que “se le mueven las letras”",
        "Tropieza o calcula mal las distancias con más frecuencia de lo esperado",
      ],
    },
    tipos: {
      titulo: "Tipos y causas frecuentes",
      intro:
        "No todos los estrabismos son iguales, y el tipo de desviación orienta el manejo. En la valoración se estudia hacia dónde se desvía el ojo, con qué frecuencia y en qué condiciones aparece.",
      items: [
        {
          nombre: "Endotropía (hacia adentro)",
          descripcion:
            "El ojo se desvía hacia la nariz. En algunos niños se relaciona con hipermetropía no corregida: el esfuerzo de enfoque arrastra al ojo hacia adentro, y parte del manejo puede ser la corrección óptica adecuada.",
        },
        {
          nombre: "Exotropía (hacia afuera)",
          descripcion:
            "El ojo se desvía hacia la sien. Con frecuencia es intermitente: aparece con el cansancio, la fiebre o al mirar de lejos, y la familia la nota “a ratos”. Que sea intermitente no significa que no deba valorarse.",
        },
        {
          nombre: "Desviaciones verticales",
          descripcion:
            "Un ojo queda más alto o más bajo que el otro (hipertropía / hipotropía). Suelen acompañarse de posiciones compensatorias de la cabeza y requieren un estudio cuidadoso de los músculos que mueven el ojo.",
        },
        {
          nombre: "Constante o intermitente",
          descripcion:
            "La desviación puede estar presente todo el tiempo o solo en ciertos momentos. Los estrabismos intermitentes suelen tener mejor punto de partida para el trabajo ortóptico, porque el sistema visual conserva momentos de alineación.",
        },
      ],
    },
    tratamiento: {
      titulo: "Cómo se aborda desde la ortóptica",
      parrafos: [
        "El manejo del estrabismo depende del tipo, la causa y la edad, y muchas veces es un trabajo en equipo con oftalmología. La ortóptica y la terapia visual no sustituyen la cirugía cuando está indicada: la complementan antes o después, y en algunos casos —según el diagnóstico— pueden ser el eje del tratamiento.",
        "El punto de partida siempre es el mismo: una valoración completa que mida la desviación, estudie cómo fusiona el cerebro las imágenes de ambos ojos y descarte causas que requieran manejo médico. A partir de ahí se define un plan individual.",
      ],
      puntos: [
        "Corrección óptica precisa cuando la desviación se relaciona con el esfuerzo de enfoque",
        "Ejercicios para ampliar la capacidad de fusión y la coordinación de ambos ojos",
        "Trabajo del control de la desviación en los estrabismos intermitentes",
        "Manejo de la ambliopía asociada, si existe, para que ambos ojos aporten al sistema",
        "Coordinación con oftalmología cuando el caso requiere valoración quirúrgica o médica",
      ],
    },
    proceso: {
      titulo: "Cómo es el proceso",
      intro:
        "Cada caso es distinto, pero el camino suele tener estas etapas. La duración depende del tipo de desviación, la edad y la constancia con los ejercicios.",
      pasos: [
        {
          titulo: "Valoración inicial completa",
          descripcion:
            "Historia clínica y de desarrollo, medición de la desviación en distintas posiciones de mirada, estado refractivo (si necesita fórmula) y evaluación de cómo colaboran ambos ojos.",
        },
        {
          titulo: "Diagnóstico y plan explicado con claridad",
          descripcion:
            "Te explico qué tipo de desviación encontramos, qué papel puede tener la terapia en tu caso y, si hace falta valoración oftalmológica, te lo digo directamente y coordinamos.",
        },
        {
          titulo: "Sesiones de terapia + ejercicios en casa",
          descripcion:
            "Sesiones periódicas en consulta y una rutina corta para la casa. La constancia en casa es una parte central del avance: el sistema visual aprende con repetición.",
        },
        {
          titulo: "Controles y ajustes del plan",
          descripcion:
            "Se re-mide la desviación y la fusión a intervalos regulares, se ajustan los ejercicios y se define cuándo espaciar o cerrar el proceso.",
        },
      ],
    },
    paraQuien: {
      titulo: "Para quién es esta valoración",
      intro:
        "El estrabismo no es solo cosa de niños: también aparece o se descompensa en adultos, y en ellos también puede trabajarse.",
      perfiles: [
        "Bebés y niños con desviación visible de un ojo, constante o por momentos",
        "Niños con diagnóstico de estrabismo que van a cirugía o ya fueron operados, como apoyo antes o después",
        "Adultos con estrabismo de la infancia que quieren valorar opciones hoy",
        "Adultos con desviación o visión doble de aparición reciente (requiere descartar primero causas médicas)",
      ],
      nota: "Importante: una desviación ocular o visión doble que aparece de forma súbita en un adulto debe ser valorada pronto por un médico para descartar causas neurológicas. Esta página es informativa y no sustituye una valoración profesional individual.",
    },
    faq: [
      {
        question: "¿El estrabismo de mi hijo se corregirá solo con el tiempo?",
        answer:
          "En los primeros meses de vida es normal que los ojos de un bebé se desalineen ocasionalmente, porque la coordinación aún está madurando. Pero una desviación constante, o que persiste después de los primeros meses, no suele resolverse sola y merece valoración profesional. Consultar a tiempo no compromete a nada: permite saber qué está pasando y decidir con información.",
      },
      {
        question: "¿El estrabismo solo se opera?",
        answer:
          "No siempre. El manejo depende del tipo de estrabismo y su causa: algunos casos se manejan con corrección óptica y terapia visual, otros requieren cirugía, y muchos se benefician de combinar ambas cosas. La cirugía actúa sobre los músculos del ojo; la terapia trabaja la parte funcional —cómo el cerebro usa y coordina los dos ojos—. En la valoración te explico qué aplica en tu caso y, si corresponde cirugía, se coordina con oftalmología.",
      },
      {
        question: "¿A qué edad se puede empezar a tratar?",
        answer:
          "La valoración puede hacerse desde bebés: no se necesita que el niño hable ni lea, existen pruebas objetivas adaptadas a cada edad. El tipo de tratamiento sí varía con la edad, y en general, cuanto antes se detecta una desviación, más opciones de manejo hay durante el desarrollo visual.",
      },
      {
        question: "¿Un adulto con estrabismo todavía puede hacer algo?",
        answer:
          "Sí, en muchos casos vale la pena valorarlo. En adultos, el trabajo se orienta según el objetivo: mejorar el control de la desviación, manejar la visión doble o la fatiga, o apoyar el resultado de una cirugía. Lo que se puede lograr depende de cada caso, y eso es precisamente lo que se estudia en la valoración inicial.",
      },
      {
        question: "¿Cuánto dura el tratamiento?",
        answer:
          "No hay una duración única: depende del tipo de desviación, la edad, el objetivo y la constancia con los ejercicios en casa. Lo que sí te puedo asegurar es que el plan se revisa con controles periódicos, se ajusta según el avance real y te voy explicando en cada etapa dónde estamos.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 02 · AMBLIOPÍA (OJO VAGO)                                           */
  /* ------------------------------------------------------------------ */
  ambliopia: {
    slug: "ambliopia",
    nombre: "Ambliopía (ojo vago)",
    metaTitle: "Ambliopía u ojo vago: tratamiento en Colombia — Ibagué",
    metaDescription:
      "Tratamiento de la ambliopía (ojo vago u ojo perezoso) en Colombia: corrección óptica, oclusión bien indicada y terapia visual activa más allá del parche. Atención presencial en Ibagué. Agenda por WhatsApp.",
    keywords: [
      "ojo vago tratamiento",
      "ambliopía en Colombia",
      "qué es la ambliopía",
      "ambliopía Ibagué",
      "ojo vago niños",
      "ojo perezoso tratamiento",
      "parche ojo vago",
      "terapia visual ambliopía",
      "ambliopía en adultos",
    ],
    serviceType: "Terapia visual para ambliopía (ojo vago)",
    theme: {
      watermark: "despertar",
      heroBackdrop: "blobs",
      midBackdrop: "dots",
      flip: true,
    },
    hero: {
      eyebrow: "Servicio · Ambliopía",
      tituloPre: "Un ojo que",
      tituloGrande: "aprende",
      tituloAccent: "a ver de nuevo",
      lead: "La ambliopía —conocida como ojo vago u ojo perezoso— ocurre cuando un ojo no desarrolla toda la visión que podría, aunque su estructura esté sana. Suele pasar desapercibida porque el otro ojo compensa. La buena noticia: detectada y tratada a tiempo, suele responder al tratamiento, y hoy ese tratamiento va más allá del parche.",
      whatsappMessage:
        "Hola, quiero agendar una valoración por ambliopía (ojo vago).",
    },
    queEs: {
      titulo: "Qué es la ambliopía",
      parrafos: [
        "Ver no es solo cosa del ojo: es un trabajo conjunto entre el ojo y el cerebro. Durante la infancia, el cerebro aprende a usar la información de cada ojo. Si por alguna razón un ojo envía una imagen borrosa o desalineada durante ese periodo, el cerebro tiende a apoyarse en el ojo “bueno” y a dejar de lado al otro. Ese ojo relegado no desarrolla toda su agudeza: eso es la ambliopía.",
        "Lo tramposo de la ambliopía es que casi nunca duele ni se nota: el niño ve “bien” con los dos ojos abiertos porque el ojo dominante hace el trabajo. Muchos casos se descubren en un examen visual de rutina, no porque la familia note algo. Por eso los controles visuales en la infancia son tan importantes, incluso sin síntomas.",
        "El tratamiento aprovecha la capacidad del cerebro de aprender (neuroplasticidad). Esa capacidad es mayor en la infancia, y por eso la detección temprana importa tanto; aun así, la evidencia actual sugiere que el sistema visual conserva cierta plasticidad más allá de la niñez, de modo que un diagnóstico tardío también merece valoración.",
      ],
      senalesTitulo: "Señales que pueden hacer sospechar",
      senales: [
        "Un ojo desviado, aunque sea de forma sutil o solo en fotos",
        "El niño protesta o se frustra mucho cuando le tapan un ojo en concreto",
        "Se acerca demasiado a los libros o a las pantallas",
        "Entrecierra los ojos o inclina la cabeza para fijarse en algo",
        "Dificultades para calcular distancias (atrapar una pelota, bajar escaleras)",
        "Antecedentes familiares de ojo vago, estrabismo o fórmulas altas desde niños",
      ],
    },
    tipos: {
      titulo: "Por qué aparece: causas frecuentes",
      intro:
        "La ambliopía es la consecuencia; la causa está en lo que impidió que ese ojo enviara una imagen nítida y alineada durante el desarrollo. Identificarla es clave, porque el tratamiento empieza por corregirla.",
      items: [
        {
          nombre: "Ambliopía refractiva",
          descripcion:
            "Uno de los ojos tiene un defecto refractivo mayor que el otro (anisometropía) o ambos tienen fórmulas altas sin corregir. La imagen de ese ojo llega borrosa de forma crónica y el cerebro la descarta. Es de las causas más silenciosas: el niño no tiene forma de saber que ve distinto.",
        },
        {
          nombre: "Ambliopía estrábica",
          descripcion:
            "Cuando hay estrabismo, el cerebro suprime la imagen del ojo desviado para no ver doble. Si siempre se desvía el mismo ojo, ese ojo queda fuera del desarrollo. Estrabismo y ambliopía van de la mano con frecuencia, y se tratan de forma conjunta.",
        },
        {
          nombre: "Ambliopía por deprivación",
          descripcion:
            "Algo bloquea físicamente el paso de la luz durante el desarrollo: una catarata congénita, un párpado caído (ptosis), una opacidad. Es la menos frecuente y la que requiere manejo médico más urgente; el papel de la terapia llega después de resolver la causa.",
        },
      ],
    },
    tratamiento: {
      titulo: "Más allá del parche: cómo se trata hoy",
      parrafos: [
        "El parche (oclusión del ojo dominante) sigue siendo una herramienta válida y útil: obliga al cerebro a usar el ojo ambliope. Pero usado solo, tiene limitaciones conocidas: es difícil de sostener en el tiempo, puede frustrar al niño y entrena al ojo de forma pasiva y aislada.",
        "El enfoque actual combina tres frentes, ajustados a cada caso: corregir la causa (casi siempre, la fórmula óptica precisa y actualizada), estimular el ojo ambliope (oclusión bien dosificada u otras formas de penalización) y —donde la terapia visual aporta su parte— entrenar activamente ese ojo y reintegrarlo al trabajo en equipo con el otro, que es el objetivo final: dos ojos que colaboran.",
      ],
      puntos: [
        "Corrección óptica precisa como base de todo el tratamiento",
        "Oclusión dosificada según el caso, con pautas claras y realistas para la familia",
        "Ejercicios activos del ojo ambliope: fijación, seguimiento, discriminación de detalle",
        "Trabajo binocular progresivo para que ambos ojos aprendan a colaborar",
        "Acompañamiento a la familia: qué hacer en casa y cómo sostener la constancia sin batallas",
      ],
    },
    proceso: {
      titulo: "Cómo es el proceso",
      intro:
        "El tratamiento de la ambliopía es un proceso de meses, no de días, y la constancia pesa más que cualquier técnica. Así lo acompañamos:",
      pasos: [
        {
          titulo: "Valoración y búsqueda de la causa",
          descripcion:
            "Medición de la agudeza de cada ojo con pruebas adaptadas a la edad, estudio refractivo completo y evaluación de alineación y visión binocular, para saber qué tipo de ambliopía es.",
        },
        {
          titulo: "Corrección de la causa y plan",
          descripcion:
            "Si hay fórmula pendiente, se corrige primero: a veces solo con los lentes ya hay avance. Sobre esa base se define el plan de oclusión y ejercicios, explicado sin tecnicismos.",
        },
        {
          titulo: "Terapia activa en consulta y en casa",
          descripcion:
            "Sesiones periódicas y una rutina corta de ejercicios en casa, pensada para la edad del niño y adaptada para que sea sostenible (y, dentro de lo posible, un juego y no un castigo).",
        },
        {
          titulo: "Controles de agudeza y ajustes",
          descripcion:
            "La agudeza del ojo ambliope se re-mide a intervalos regulares. Con esos datos se ajusta la dosis de oclusión y la dificultad de los ejercicios, y se decide cuándo cerrar el proceso y cómo vigilar después.",
        },
      ],
    },
    paraQuien: {
      titulo: "Para quién es esta valoración",
      intro:
        "La ambliopía se puede sospechar, pero solo se confirma midiendo. Estas situaciones son motivo razonable de consulta:",
      perfiles: [
        "Niños con diagnóstico reciente de ojo vago que van a empezar tratamiento",
        "Niños que ya usan parche y a los que cuesta sostenerlo, o cuyo avance se ha estancado",
        "Niños con estrabismo o con fórmulas muy distintas entre un ojo y otro",
        "Familias con antecedentes de ambliopía que quieren descartar en sus hijos",
        "Adolescentes y adultos con ojo vago no tratado que quieren saber si hoy hay algo que hacer",
      ],
      nota: "La información de esta página es orientativa. El diagnóstico de ambliopía y la indicación de su tratamiento requieren un examen presencial; ante cualquier duda sobre la visión de tu hijo, la mejor decisión suele ser valorarlo pronto.",
    },
    faq: [
      {
        question: "¿El parche es suficiente para tratar el ojo vago?",
        answer:
          "El parche es una herramienta útil y bien establecida, pero rara vez es todo el tratamiento. Antes de ocluir hay que corregir la causa (por ejemplo, la fórmula óptica), y la oclusión funciona mejor cuando se acompaña de estimulación activa del ojo ambliope y de trabajo binocular. Además, la dosis importa: no todos los casos necesitan las mismas horas de parche, y una pauta bien ajustada es más fácil de sostener.",
      },
      {
        question: "¿Hasta qué edad se puede tratar la ambliopía?",
        answer:
          "La respuesta al tratamiento suele ser mejor cuanto más temprano se empieza, porque la plasticidad del sistema visual es mayor en la infancia. Ahora bien, la evidencia actual indica que esa plasticidad no desaparece por completo con la edad, así que un diagnóstico tardío no significa automáticamente que no haya nada que hacer: merece una valoración individual honesta, sin prometer de más ni descartar de menos.",
      },
      {
        question: "¿Cómo sé si mi hijo tiene ojo vago si no se le nota nada?",
        answer:
          "Esa es exactamente la dificultad: en muchos casos no se nota nada, porque el ojo dominante compensa y el niño no sabe que ve distinto con cada ojo. La única forma fiable de saberlo es un examen visual que mida cada ojo por separado, con pruebas adaptadas a la edad. Por eso se recomiendan controles visuales en la infancia aunque no haya síntomas.",
      },
      {
        question: "¿Mi hijo tendrá que usar el parche todo el día?",
        answer:
          "No necesariamente. La pauta de oclusión se dosifica según la profundidad de la ambliopía, la edad y la respuesta al tratamiento; muchos casos se manejan con pautas parciales. La pauta se revisa en cada control y el objetivo es que sea eficaz y sostenible para el niño y para la familia.",
      },
      {
        question: "¿Cuánto tarda en verse el avance?",
        answer:
          "Depende de la causa, la profundidad de la ambliopía, la edad y la constancia. En los controles se mide la agudeza de forma objetiva, así que el avance no se estima “a ojo”: se ve en los resultados de cada revisión, y el plan se ajusta con esos datos. Lo importante es sostener el proceso, porque los avances se consolidan con el tiempo.",
      },
      {
        question: "¿La ambliopía puede volver después del tratamiento?",
        answer:
          "En algunos casos puede haber retrocesos tras suspender el tratamiento, sobre todo si se interrumpe de golpe. Por eso el cierre del proceso se hace de forma gradual y con controles de vigilancia posteriores, para detectar y manejar a tiempo cualquier recaída.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 03 · TERAPIA VISUAL                                                 */
  /* ------------------------------------------------------------------ */
  "terapia-visual": {
    slug: "terapia-visual",
    nombre: "Terapia visual",
    metaTitle: "Terapia visual en Colombia — consulta presencial en Ibagué",
    metaDescription:
      "Terapia visual y ortóptica en Colombia: programa personalizado de ejercicios para mejorar el enfoque, la coordinación de los ojos y el confort visual en niños y adultos. Consulta presencial en Ibagué. Agenda por WhatsApp.",
    keywords: [
      "terapia visual en Colombia",
      "ortóptica en Colombia",
      "qué es la ortóptica",
      "qué es la terapia visual",
      "terapia visual Ibagué",
      "ortóptica Ibagué",
      "ejercicios visuales niños",
      "entrenamiento visual",
      "insuficiencia de convergencia",
      "fatiga visual estudio",
    ],
    serviceType: "Terapia visual y ortóptica",
    theme: {
      watermark: "entrenar",
      heroBackdrop: "waves",
      midBackdrop: "iris",
    },
    hero: {
      eyebrow: "Servicio · Terapia visual",
      tituloPre: "La visión también",
      tituloGrande: "se entrena",
      tituloAccent: "paso a paso",
      lead: "Ver bien es mucho más que ver nítido. Enfocar sin fatiga, mover los ojos con precisión al leer, coordinar ambos ojos como un equipo: todas esas habilidades se pueden evaluar y, cuando fallan, entrenar. Eso es la terapia visual: un programa de ejercicios personalizado, progresivo y supervisado.",
      whatsappMessage:
        "Hola, quiero información sobre la terapia visual y agendar una valoración.",
    },
    queEs: {
      titulo: "Qué es la terapia visual",
      parrafos: [
        "La terapia visual (u ortóptica) es un programa de ejercicios diseñado para mejorar habilidades visuales concretas: la capacidad de enfocar y mantener el enfoque, la coordinación entre ambos ojos, los movimientos oculares de seguimiento y de salto (los que usamos al leer), y la integración de todo eso con la atención y el movimiento.",
        "No es magia ni gimnasia genérica para “fortalecer el ojo”: cada ejercicio apunta a una habilidad medida como deficiente en la evaluación, con una progresión de dificultad definida y con controles que verifican el avance de forma objetiva. Es, en esencia, un proceso de aprendizaje del sistema visual, aprovechando la capacidad del cerebro de crear y afinar conexiones.",
        "Un examen visual convencional suele centrarse en la agudeza (ver nítido de lejos) y en la salud ocular. La evaluación para terapia visual va más allá: estudia cómo trabaja la visión en las tareas reales —leer, escribir, sostener la atención de cerca— que es donde muchos problemas se esconden con una agudeza “perfecta”.",
      ],
      senalesTitulo: "Señales de que las habilidades visuales pueden estar fallando",
      senales: [
        "Se salta renglones o pierde el punto al leer, o usa el dedo para no perderse",
        "Dolor de cabeza o cansancio en los ojos tras leer o usar pantallas un rato",
        "Ve borroso o doble por momentos al estudiar",
        "Evita leer o rinde muy por debajo de lo esperado pese a “ver bien”",
        "Se acerca mucho al papel, o tuerce la cabeza al escribir",
        "Cierra o se tapa un ojo para leer o ver televisión",
      ],
    },
    tipos: {
      titulo: "Qué habilidades se trabajan",
      intro:
        "La evaluación determina cuáles de estas áreas necesitan entrenamiento; el plan combina las que apliquen a cada caso.",
      items: [
        {
          nombre: "Acomodación (enfoque)",
          descripcion:
            "La capacidad de enfocar a distintas distancias y sostener el enfoque sin fatiga. Cuando falla, leer se vuelve borroso o agotador aunque la fórmula esté bien.",
        },
        {
          nombre: "Vergencias (trabajo en equipo de los ojos)",
          descripcion:
            "Los dos ojos deben converger al mirar de cerca y mantener la alineación sin esfuerzo. La insuficiencia de convergencia —una de las disfunciones más frecuentes— es también de las que mejor suele responder al entrenamiento.",
        },
        {
          nombre: "Motilidad ocular (movimientos al leer)",
          descripcion:
            "Seguimientos suaves y saltos precisos de un punto a otro. Al leer, los ojos saltan de palabra en palabra: si esos saltos son imprecisos, el niño se pierde, relee o se salta renglones.",
        },
        {
          nombre: "Integración visual",
          descripcion:
            "Coordinar la visión con la mano (escribir, copiar del tablero), con el cuerpo y con la atención. Es la capa que conecta las habilidades visuales con el rendimiento en tareas reales.",
        },
      ],
    },
    tratamiento: {
      titulo: "Cómo funciona el programa",
      parrafos: [
        "Cada programa es individual: parte de la evaluación, define objetivos concretos y medibles, y avanza por niveles de dificultad. Las sesiones en consulta introducen y supervisan los ejercicios; la práctica corta y frecuente en casa consolida lo aprendido, igual que ocurre al aprender un instrumento o un deporte.",
        "Es importante ser claros con el alcance: la terapia visual trata problemas visuales, no trastornos del aprendizaje. Un niño con dislexia, por ejemplo, necesita el abordaje psicopedagógico que corresponde; lo que sí puede hacer la terapia es resolver las dificultades visuales que a veces se suman al cuadro y hacen la lectura aún más costosa. Cuando el caso lo requiere, se trabaja en coordinación con los otros profesionales del niño.",
      ],
      puntos: [
        "Programa individual basado en la evaluación, no ejercicios genéricos",
        "Objetivos concretos y medibles, revisados en cada control",
        "Sesiones supervisadas en consulta + rutina breve en casa",
        "Progresión por niveles: la dificultad sube cuando la habilidad se consolida",
        "Coordinación con oftalmología, pediatría o el colegio cuando el caso lo pide",
      ],
    },
    proceso: {
      titulo: "Cómo es el proceso",
      intro:
        "De la primera consulta al alta, el proceso está diseñado para que siempre sepas en qué punto está y qué sigue.",
      pasos: [
        {
          titulo: "Evaluación de habilidades visuales",
          descripcion:
            "Más allá de la agudeza: enfoque, vergencias, movimientos oculares y cómo rinde la visión en tareas de cerca. Con esto se identifica qué habilidades están por debajo de lo esperado.",
        },
        {
          titulo: "Plan con objetivos claros",
          descripcion:
            "Te explico qué encontramos, qué habilidades vamos a entrenar, con qué frecuencia y cómo mediremos el avance. Sin jerga: con ejemplos de cómo se nota en el día a día.",
        },
        {
          titulo: "Entrenamiento progresivo",
          descripcion:
            "Sesiones periódicas en consulta y ejercicios cortos en casa. Los ejercicios cambian a medida que se consolidan las habilidades: el programa evoluciona contigo.",
        },
        {
          titulo: "Re-evaluación y cierre",
          descripcion:
            "Los objetivos se re-miden con las mismas pruebas de la evaluación inicial. Cuando las habilidades se normalizan y se automatizan, el programa se cierra de forma gradual.",
        },
      ],
    },
    paraQuien: {
      titulo: "Para quién es la terapia visual",
      intro:
        "La terapia visual se indica tras una evaluación que confirme una disfunción entrenable. Estos perfiles suelen beneficiarse de una valoración:",
      perfiles: [
        "Niños en etapa escolar con fatiga, dolor de cabeza o bajo rendimiento lector pese a ver “bien”",
        "Niños y adultos con insuficiencia de convergencia u otras disfunciones binoculares",
        "Personas con estrabismo o ambliopía, como parte de su plan de tratamiento",
        "Estudiantes y adultos con alta demanda de trabajo en pantalla y síntomas de fatiga visual",
        "Casos derivados por oftalmología, pediatría o el colegio para evaluación funcional de la visión",
      ],
      nota: "La terapia visual no sustituye el examen de salud ocular ni el manejo médico u oftalmológico cuando está indicado, y no es un tratamiento para los trastornos del aprendizaje. Esta página es informativa; el plan concreto se define siempre tras una evaluación individual.",
    },
    faq: [
      {
        question: "¿La terapia visual tiene respaldo científico?",
        answer:
          "Depende de para qué se use, y es justo decirlo así. Para algunas condiciones —el ejemplo más claro es la insuficiencia de convergencia— existe evidencia sólida de que el entrenamiento supervisado funciona. Para otras aplicaciones la evidencia es más limitada y el criterio profesional pesa más. En la valoración te digo con honestidad qué se puede esperar en tu caso concreto y qué no.",
      },
      {
        question: "¿En qué se diferencia de un examen visual normal?",
        answer:
          "El examen convencional responde sobre todo dos preguntas: ¿ve nítido? y ¿está sano el ojo? La evaluación para terapia visual añade una tercera: ¿cómo trabaja la visión en las tareas reales? Mide el enfoque sostenido, la coordinación de ambos ojos y los movimientos oculares de la lectura. Muchos niños con síntomas tienen agudeza perfecta: su dificultad está en estas otras habilidades.",
      },
      {
        question: "¿Cuánto dura un programa de terapia visual?",
        answer:
          "Depende de la disfunción, la edad y la constancia con la práctica en casa; no es serio prometer una cifra sin evaluar. Lo que sí es fijo es el método: objetivos medibles desde el inicio y controles periódicos que muestran el avance real, de modo que la duración se va ajustando con datos y no con sensaciones.",
      },
      {
        question: "¿Sirve para adultos o es solo para niños?",
        answer:
          "También para adultos. El sistema visual adulto conserva capacidad de aprendizaje, y disfunciones como la insuficiencia de convergencia o la fatiga acomodativa se entrenan a cualquier edad. De hecho, los adultos suelen ser muy buenos pacientes de terapia: entienden el objetivo y son constantes con los ejercicios.",
      },
      {
        question: "¿La terapia visual puede curar la dislexia o el TDAH?",
        answer:
          "No, y desconfía de quien lo prometa. La dislexia y el TDAH son trastornos del neurodesarrollo que requieren su propio abordaje profesional. Lo que la terapia visual puede hacer es tratar las disfunciones visuales que a veces coexisten con ellos y añaden dificultad a la lectura o al estudio. Si la visión funciona mejor, el niño afronta su proceso de aprendizaje con una carga menos; pero son caminos distintos y complementarios.",
      },
      {
        question: "¿Los ejercicios en casa son obligatorios?",
        answer:
          "Son parte importante del método: la práctica corta y frecuente es lo que consolida las habilidades entre sesiones, como en cualquier aprendizaje. Diseño rutinas breves y adaptadas a la edad, y trabajamos juntos para que encajen de forma realista en la vida de la familia.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 04 · VISIÓN BINOCULAR                                               */
  /* ------------------------------------------------------------------ */
  "vision-binocular": {
    slug: "vision-binocular",
    nombre: "Visión binocular",
    metaTitle: "Visión binocular: evaluación y terapia en Colombia — Ibagué",
    metaDescription:
      "Evaluación y tratamiento de problemas de visión binocular en Colombia: visión doble, fatiga visual al leer, insuficiencia de convergencia y dificultades de enfoque. Consulta presencial en Ibagué. Agenda por WhatsApp.",
    keywords: [
      "qué es la visión binocular",
      "visión doble tratamiento",
      "insuficiencia de convergencia Colombia",
      "visión binocular Ibagué",
      "visión doble causas",
      "insuficiencia de convergencia tratamiento",
      "fatiga visual al leer",
      "dolor de cabeza al estudiar",
      "problemas de enfoque visual",
    ],
    serviceType: "Evaluación y terapia de la visión binocular",
    theme: {
      watermark: "en equipo",
      heroBackdrop: "dots",
      midBackdrop: "blobs",
      flip: true,
    },
    hero: {
      eyebrow: "Servicio · Visión binocular",
      tituloPre: "Dos ojos,",
      tituloGrande: "un equipo",
      tituloAccent: "que debe coordinarse",
      lead: "Tus dos ojos captan dos imágenes ligeramente distintas y el cerebro las funde en una sola, con profundidad. Cuando ese trabajo en equipo falla, aparecen síntomas que rara vez se relacionan con la visión: dolor de cabeza al estudiar, fatiga con las pantallas, visión doble o borrosa por momentos. Y lo más frustrante: el examen de agudeza puede salir perfecto.",
      whatsappMessage:
        "Hola, quiero agendar una evaluación de visión binocular (fatiga visual / visión doble al leer).",
    },
    queEs: {
      titulo: "Qué es la visión binocular",
      parrafos: [
        "La visión binocular es la capacidad de usar los dos ojos como un solo sistema: apuntarlos con precisión al mismo punto, fusionar sus imágenes en una sola y extraer de esa fusión la percepción de profundidad. Es un equilibrio activo que el sistema visual mantiene sin que lo notemos… mientras funciona bien.",
        "Cuando el equilibrio es frágil, el sistema lo compensa a base de esfuerzo. Ese esfuerzo extra es invisible, pero se paga: en cansancio, dolor de cabeza, borrosidad intermitente, lentitud al leer o rechazo a las tareas de cerca. Es un patrón típico del estudiante que “ve bien” pero termina agotado tras media hora de estudio.",
        "Estos problemas son frecuentes y a menudo pasan desapercibidos precisamente porque la agudeza visual —lo que se mide en un examen estándar— puede ser normal. Detectarlos requiere una evaluación específica de cómo colaboran los ojos y cómo se sostiene el enfoque.",
      ],
      senalesTitulo: "Síntomas frecuentes",
      senales: [
        "Dolor de cabeza o de ojos tras leer, estudiar o usar pantallas",
        "Visión doble o borrosa por momentos, sobre todo de cerca",
        "Las letras “se mueven”, “bailan” o se juntan al leer",
        "Somnolencia o pérdida de concentración rápida en tareas de cerca",
        "Necesidad de releer, saltos de renglón, lectura más lenta de lo esperado",
        "Cerrar o taparse un ojo para leer con comodidad",
      ],
    },
    tipos: {
      titulo: "Disfunciones más frecuentes",
      intro:
        "Bajo el término “problemas de visión binocular” hay varias disfunciones concretas, cada una con su manejo. La evaluación distingue cuál (o cuáles) están presentes.",
      items: [
        {
          nombre: "Insuficiencia de convergencia",
          descripcion:
            "A los ojos les cuesta converger y mantenerse apuntando de cerca: leer se convierte en una lucha contra la visión doble o borrosa. Es de las disfunciones más comunes y de las que mejor suele responder al entrenamiento supervisado.",
        },
        {
          nombre: "Exceso de convergencia",
          descripcion:
            "Lo contrario: los ojos convergen de más al mirar de cerca. Suele producir borrosidad y dolor de cabeza con el trabajo de cerca, y su manejo puede combinar lentes específicos con terapia.",
        },
        {
          nombre: "Disfunciones acomodativas",
          descripcion:
            "El sistema de enfoque responde con lentitud, se fatiga antes de tiempo o le cuesta cambiar de distancia (del cuaderno al tablero, por ejemplo). Frecuentes en edad escolar y muy ligadas al rendimiento en clase.",
        },
        {
          nombre: "Forias descompensadas",
          descripcion:
            "Una tendencia latente de los ojos a desviarse que el sistema normalmente compensa; cuando la demanda supera la reserva (jornadas largas de pantalla, estudio intenso), aparecen los síntomas. El objetivo del manejo es devolverle al sistema margen de sobra.",
        },
      ],
    },
    tratamiento: {
      titulo: "Cómo se tratan",
      parrafos: [
        "El manejo depende de la disfunción encontrada y de la demanda visual de cada persona; no hay una receta única. En general se combinan tres herramientas: la corrección óptica adecuada (a veces con lentes específicos para la distancia de trabajo), la terapia visual para entrenar las habilidades deficientes y, en casos concretos, prismas que alivian el esfuerzo de alineación.",
        "El objetivo del tratamiento no es solo que desaparezcan los síntomas, sino que el sistema visual recupere reservas: que leer una hora no consuma el esfuerzo de tres. Por eso los controles miden tanto los síntomas como las habilidades, hasta que ambos se normalizan.",
      ],
      puntos: [
        "Evaluación completa de vergencias, acomodación y motilidad, además de la agudeza",
        "Corrección óptica ajustada a la distancia real de trabajo o estudio",
        "Terapia visual con progresión medible para ampliar las reservas del sistema",
        "Prismas u otras ayudas ópticas cuando el caso concreto lo indica",
        "Pautas de higiene visual realistas para el estudio y las pantallas",
      ],
    },
    proceso: {
      titulo: "Cómo es el proceso",
      intro:
        "Desde la primera consulta hasta el alta, con objetivos medibles en cada etapa:",
      pasos: [
        {
          titulo: "Evaluación binocular completa",
          descripcion:
            "Se mide cómo convergen y divergen los ojos, cómo responde el enfoque y cuánta reserva tiene el sistema, además del estado refractivo. Se identifica la disfunción concreta.",
        },
        {
          titulo: "Diagnóstico y plan de manejo",
          descripcion:
            "Te explico qué disfunción hay, por qué produce exactamente tus síntomas y qué combinación de lentes, terapia o ayudas ópticas propongo para tu caso.",
        },
        {
          titulo: "Entrenamiento y seguimiento",
          descripcion:
            "Sesiones de terapia con progresión de dificultad y ejercicios breves en casa. Los síntomas suelen ser lo primero que mejora; el trabajo continúa hasta consolidar las habilidades.",
        },
        {
          titulo: "Alta con reservas",
          descripcion:
            "El proceso se cierra cuando las habilidades se normalizan y se mantienen sin esfuerzo consciente. Se dan pautas para sostener el resultado y señales de alerta para volver a control.",
        },
      ],
    },
    paraQuien: {
      titulo: "Para quién es esta evaluación",
      intro:
        "Si la agudeza es buena pero la visión “cansa”, la respuesta suele estar en la binocularidad. Perfiles frecuentes en consulta:",
      perfiles: [
        "Estudiantes (niños, adolescentes, universitarios) con fatiga o dolor de cabeza al estudiar",
        "Personas que trabajan muchas horas en pantalla con síntomas de esfuerzo visual",
        "Niños que evitan leer, pierden el renglón o rinden por debajo de lo esperado con agudeza normal",
        "Personas con visión doble intermitente de cerca ya estudiada médicamente",
        "Casos derivados de oftalmología para manejo funcional de una disfunción binocular",
      ],
      nota: "Atención: una visión doble de aparición súbita, constante o acompañada de otros síntomas neurológicos debe valorarse pronto por un médico antes que por terapia. Esta página es informativa y no sustituye una valoración profesional individual.",
    },
    faq: [
      {
        question: "Mi hijo ve bien en los exámenes del colegio, ¿puede aun así tener un problema visual?",
        answer:
          "Sí. Los tamizajes escolares suelen medir la agudeza de lejos, y muchos problemas binoculares no afectan la agudeza: afectan la resistencia. Un niño puede leer la última línea de la cartilla y aun así ver borroso o doble tras veinte minutos de lectura. Si hay síntomas con el estudio, vale la pena una evaluación binocular específica aunque los tamizajes salgan normales.",
      },
      {
        question: "¿Qué es la insuficiencia de convergencia?",
        answer:
          "Es una disfunción en la que a los ojos les cuesta apuntar juntos a un objeto cercano y mantenerse ahí: al leer, el sistema lucha por sostener la alineación y aparecen fatiga, borrosidad o visión doble. Es frecuente, muchas veces pasa desapercibida y es una de las condiciones en las que la terapia visual supervisada cuenta con mejor respaldo de evidencia.",
      },
      {
        question: "¿La visión doble siempre es grave?",
        answer:
          "No siempre, pero siempre hay que estudiarla. Una diplopía intermitente de cerca, de larga evolución, suele corresponder a una disfunción binocular manejable. En cambio, una visión doble que aparece de forma súbita o constante requiere valoración médica pronta para descartar causas neurológicas o musculares antes de plantear cualquier terapia. En consulta, ese criterio de derivación se aplica siempre.",
      },
      {
        question: "¿Esto explica el dolor de cabeza de mi hijo al estudiar?",
        answer:
          "Puede ser una de las causas, y es de las que con más frecuencia se pasan por alto, precisamente porque el niño “ve bien”. No es la única posible: por eso la evaluación mide las habilidades concretas y, si la visión no resulta ser el origen, también es información valiosa para seguir buscando con el pediatra.",
      },
      {
        question: "¿Los prismas son para siempre?",
        answer:
          "Depende del caso y del objetivo. A veces se usan como alivio mientras la terapia amplía las reservas del sistema, y luego se retiran; en otros casos son la solución estable más razonable. Es una decisión que se toma —y se revisa— con datos de los controles, no una condena permanente.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 05 · OPTOMETRÍA PEDIÁTRICA                                          */
  /* ------------------------------------------------------------------ */
  "optometria-pediatrica": {
    slug: "optometria-pediatrica",
    nombre: "Optometría pediátrica",
    metaTitle: "Optometría pediátrica — examen visual para niños en Ibagué, Colombia",
    metaDescription:
      "Examen visual para bebés y niños con pruebas adaptadas a cada edad: detección temprana de ambliopía, estrabismo y defectos refractivos. Atención presencial en Ibagué para familias de toda Colombia. Agenda por WhatsApp.",
    keywords: [
      "optometría pediátrica Colombia",
      "examen visual infantil",
      "cuándo llevar a un niño al optómetra",
      "optometría pediátrica Ibagué",
      "examen visual niños Ibagué",
      "optómetra para niños",
      "examen de ojos bebé",
      "primera cita visual niño",
      "detección temprana problemas visuales",
    ],
    serviceType: "Optometría pediátrica",
    theme: {
      watermark: "crecer",
      heroBackdrop: "blobs",
      midBackdrop: "waves",
    },
    hero: {
      eyebrow: "Servicio · Optometría pediátrica",
      tituloPre: "Ojos que están",
      tituloGrande: "creciendo",
      tituloAccent: "merecen su propio examen",
      lead: "La visión de un niño no viene terminada de fábrica: se desarrolla durante los primeros años de vida, y en ese periodo los problemas detectados a tiempo suelen tener mejor manejo. Un examen visual pediátrico no necesita que tu hijo lea ni que “colabore perfecto”: existen pruebas para cada edad, desde bebés.",
      whatsappMessage:
        "Hola, quiero agendar un examen visual pediátrico para mi hijo/a.",
    },
    queEs: {
      titulo: "Qué es un examen visual pediátrico",
      parrafos: [
        "Es una evaluación completa de la visión adaptada a la edad del niño: mide si necesita fórmula (y de cuánto), si los ojos están alineados y trabajan en equipo, si cada ojo desarrolla la agudeza esperada para su edad y si las habilidades visuales acompañan lo que la etapa escolar le exige.",
        "La diferencia con un examen de adultos no es solo el tamaño de la silla. En los niños se usan métodos objetivos —que no dependen de que el niño responda “mejor uno o mejor dos”—, se compara cada resultado con lo esperado para su edad y se dedica el tiempo necesario a que el niño esté tranquilo: un niño con miedo no se deja examinar bien.",
        "Los niños casi nunca se quejan de ver mal, por una razón simple: no saben cómo ven los demás. Un niño que siempre ha visto borroso cree que el mundo es así. Por eso la detección no puede depender de que el niño avise: depende de los controles y de la observación de los adultos.",
      ],
      senalesTitulo: "Señales para consultar sin esperar al control",
      senales: [
        "Se acerca mucho a los libros, cuadernos o pantallas",
        "Entrecierra los ojos o tuerce la cabeza para mirar",
        "Un ojo desviado, aunque sea sutil o solo en fotos y videos",
        "Se frota los ojos con frecuencia o le molesta la luz",
        "Dolor de cabeza tras el colegio o las tareas",
        "Evita leer, pierde el renglón o rinde por debajo de lo esperado",
        "Nació prematuro o hay antecedentes familiares de fórmulas altas, estrabismo u ojo vago",
      ],
    },
    tipos: {
      titulo: "Qué se evalúa, según la edad",
      intro:
        "Cada etapa del desarrollo visual tiene sus preguntas clave. El examen se adapta a la edad y responde las de esa etapa.",
      items: [
        {
          nombre: "Bebés (primer año)",
          descripcion:
            "¿Fija la mirada y sigue objetos? ¿Los ojos están alineados? ¿Hay defectos refractivos altos o diferencias grandes entre un ojo y otro? Todo con pruebas objetivas que no requieren respuesta verbal.",
        },
        {
          nombre: "Primera infancia (1–5 años)",
          descripcion:
            "La etapa de mayor desarrollo visual y la ventana clave para detectar ambliopía y estrabismo. Se mide agudeza con optotipos de figuras, alineación, estereopsis (visión en profundidad) y estado refractivo.",
        },
        {
          nombre: "Etapa escolar (6–12 años)",
          descripcion:
            "La demanda visual se dispara: leer, copiar del tablero, horas de cerca. Además de la agudeza, se evalúan enfoque, coordinación binocular y movimientos oculares de lectura, que sostienen el rendimiento escolar.",
        },
        {
          nombre: "Adolescencia",
          descripcion:
            "Etapa de cambios refractivos (la miopía suele avanzar aquí) y de máxima exposición a pantallas. Se controla la evolución de la fórmula y los síntomas de fatiga visual, con pautas realistas de uso digital.",
        },
      ],
    },
    tratamiento: {
      titulo: "Qué pasa después del examen",
      parrafos: [
        "Del examen sale una de tres rutas, y las tres son buenas noticias. La más frecuente: todo se está desarrollando dentro de lo esperado, y sales con la tranquilidad y la fecha del próximo control. La segunda: hay algo que corregir —una fórmula, por ejemplo— y se resuelve con la prescripción adecuada y seguimiento.",
        "La tercera ruta es la que justifica todo lo demás: detectar a tiempo una condición que necesita tratamiento —una ambliopía, un estrabismo, una disfunción binocular—. En ese caso te explico con calma qué encontramos y armamos el plan, que puede incluir terapia visual aquí mismo o, si el caso lo requiere, coordinación con oftalmología pediátrica.",
      ],
      puntos: [
        "Informe claro de resultados, explicado sin tecnicismos",
        "Prescripción de fórmula solo cuando está indicada, con criterio pediátrico",
        "Plan de tratamiento si se detecta ambliopía, estrabismo o disfunción binocular",
        "Derivación coordinada a oftalmología cuando el caso lo necesita",
        "Calendario de controles según la edad y los hallazgos",
      ],
    },
    proceso: {
      titulo: "Cómo es la cita",
      intro:
        "Pensada para que el niño colabore sin presión —y para que tú salgas con respuestas claras.",
      pasos: [
        {
          titulo: "Conversamos primero",
          descripcion:
            "Qué has observado en casa, cómo va en el colegio, antecedentes del embarazo y de la familia. Esa historia orienta el examen tanto como las pruebas.",
        },
        {
          titulo: "Examen adaptado a su edad",
          descripcion:
            "Pruebas en formato de juego cuando la edad lo pide, métodos objetivos cuando el niño no puede responder, y pausas si las necesita. Sin forzar: un niño tranquilo se examina mejor.",
        },
        {
          titulo: "Resultados explicados con calma",
          descripcion:
            "Te muestro qué evaluamos y qué significa cada hallazgo, respondo todas tus preguntas y te doy el plan por escrito: corrección, tratamiento, derivación o simplemente el próximo control.",
        },
        {
          titulo: "Seguimiento en el tiempo",
          descripcion:
            "La visión infantil cambia con el crecimiento. Los controles periódicos permiten vigilar el desarrollo y ajustar a tiempo lo que haga falta.",
        },
      ],
    },
    paraQuien: {
      titulo: "Cuándo traer a tu hijo",
      intro:
        "No hace falta esperar síntomas. Como orientación general —el calendario exacto se ajusta a cada niño—:",
      perfiles: [
        "Un primer examen durante el primer año de vida, sobre todo si hubo prematurez o antecedentes familiares",
        "Un control en la primera infancia, antes de iniciar la etapa escolar",
        "Controles periódicos durante la etapa escolar, aunque no haya síntomas",
        "Consulta sin esperar al control si aparece cualquiera de las señales de esta página",
        "Revisión si el colegio, el pediatra o un tamizaje reportan cualquier duda visual",
      ],
      nota: "Estas pautas son orientativas y no sustituyen las indicaciones del pediatra ni la valoración individual de cada niño. Si algo de lo que has leído te resonó, la consulta sirve exactamente para eso: salir de la duda.",
    },
    faq: [
      {
        question: "¿A qué edad debería hacerle el primer examen visual a mi hijo?",
        answer:
          "No hay que esperar a que lea ni a que se queje: la recomendación general es un primer examen dentro del primer año de vida, otro control en la primera infancia antes de escolarizar, y revisiones periódicas en etapa escolar. Si hay antecedentes familiares, prematurez o cualquier señal de las que describimos arriba, se consulta sin esperar al calendario.",
      },
      {
        question: "Mi hijo es muy pequeño y no sabe letras, ¿cómo lo van a examinar?",
        answer:
          "Con pruebas diseñadas para su edad. Hay optotipos de figuras y símbolos para niños que no leen, y métodos objetivos —como la retinoscopía— que miden el estado refractivo sin necesidad de ninguna respuesta del niño. Hasta un bebé puede examinarse: se evalúa cómo fija, cómo sigue objetos y cómo responden sus ojos a la luz.",
      },
      {
        question: "¿El examen le va a doler o a asustar?",
        answer:
          "El examen no duele. La cita está pensada para hacerse en formato de juego y al ritmo del niño, con pausas si hacen falta. Si en algún momento se requiriera un examen con dilatación pupilar (unas gotas que pueden molestar un poco y dejar visión borrosa unas horas), te lo explico antes y decidimos juntos cómo y cuándo hacerlo.",
      },
      {
        question: "En el colegio le hicieron un tamizaje y salió bien, ¿es suficiente?",
        answer:
          "Los tamizajes escolares son valiosos como filtro, pero son limitados: suelen medir solo la agudeza de lejos. No evalúan el enfoque sostenido, la coordinación de ambos ojos ni los movimientos de lectura, que es donde se esconden muchos problemas en edad escolar. Un tamizaje normal con síntomas presentes (dolor de cabeza, rechazo a la lectura) sigue siendo motivo de examen completo.",
      },
      {
        question: "¿Las pantallas le están dañando los ojos a mi hijo?",
        answer:
          "Lo que mejor describe la evidencia actual no es un “daño” directo, sino los efectos del uso intensivo de cerca: fatiga visual, y una asociación entre menos tiempo al aire libre y más progresión de miopía. Más útil que el miedo son las pautas: pausas frecuentes, buena distancia e iluminación, y tiempo de juego al aire libre. En la consulta las repasamos adaptadas a la edad de tu hijo.",
      },
      {
        question: "¿Necesito una orden médica para traerlo?",
        answer:
          "Para una valoración particular en consulta no necesitas orden médica: puedes agendar directamente por WhatsApp. Si vienes derivada por el pediatra o el colegio, trae el reporte si lo tienes: esa información ayuda a orientar el examen.",
      },
    ],
  },
};

/** Orden canónico de servicios (el mismo de SERVICES en constants.ts). */
export const SERVICE_SLUGS = Object.keys(SERVICES_CONTENT);
