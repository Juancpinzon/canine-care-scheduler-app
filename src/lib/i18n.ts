export type Language = 'en' | 'es';

export const translations = {
  en: {
    // Nav
    nav_services: "Services",
    nav_pricing: "Pricing",
    nav_how_it_works: "How it works",
    nav_book: "Book Now",
    nav_book_short: "Book",
    
    // Hero
    hero_badge: "Luxury Dog Grooming",
    hero_title_1: "Your dog deserves",
    hero_title_highlight: "the extraordinary",
    hero_subtitle: "Premium grooming services in Kissimmee.\nBook in minutes — no calls, no waiting.",
    hero_btn_primary: "Book appointment now",
    hero_btn_secondary: "View services",
    
    // Stats
    stat_clients: "Happy clients",
    stat_rating: "Rating",
    stat_love: "With love",

    // Services
    services_eyebrow: "Our services",
    services_title: "The highest standard\nfor your best friend",
    services_from: "From",
    services_popular: "Popular",
    services_full_groom: "Bath, professional blowout, breed-specific haircut, nail trim, ear cleaning, and long-lasting perfume.",
    services_minigroom: "Full bath with premium shampoo, professional blowout, and monthly maintenance trim.",
    services_luxury_bath: "Bath with luxury products, hydrating coat mask, and exclusive cologne.",
    
    // Addons
    addons_title: "Add-on Services",
    
    // Process
    process_eyebrow: "Process",
    process_title: "Booking has never\nbeen this easy",
    process_step1_title: "Choose the service",
    process_step1_desc: "Select the ideal treatment based on your dog's size and coat type.",
    process_step2_title: "Choose date & time",
    process_step2_desc: "Check real-time availability. No calls, no WhatsApp, 24/7.",
    process_step3_title: "Instant confirmation",
    process_step3_desc: "You receive an email confirmation and an automatic reminder 24 hours before.",

    // Gallery
    gallery_eyebrow: "Gallery",
    gallery_title: "Our Work",

    // CTA
    cta_title_1: "Ready for the ",
    cta_title_highlight: "Q4 experience",
    cta_title_2: "?",
    cta_subtitle: "Your dog deserves it · Kissimmee, FL · @q4paws",
    cta_btn: "Book my appointment now",

    // Footer
    footer_admin: "Admin Access",
  },
  es: {
    // Nav
    nav_services: "Servicios",
    nav_pricing: "Precios",
    nav_how_it_works: "Cómo funciona",
    nav_book: "Reservar ahora",
    nav_book_short: "Reservar",
    
    // Hero
    hero_badge: "Peluquería canina de lujo",
    hero_title_1: "Tu perro merece",
    hero_title_highlight: "lo extraordinario",
    hero_subtitle: "Servicios de grooming premium en Kissimmee.\nReserva en minutos — sin llamadas, sin esperas.",
    hero_btn_primary: "Reservar cita ahora",
    hero_btn_secondary: "Ver servicios",
    
    // Stats
    stat_clients: "Clientes felices",
    stat_rating: "Calificación",
    stat_love: "Con amor",

    // Services
    services_eyebrow: "Nuestros servicios",
    services_title: "El estándar más alto\npara tu mejor amigo",
    services_from: "Desde",
    services_popular: "Popular",
    services_full_groom: "Baño, secado profesional, corte según raza, uñas, limpieza de orejas y perfume de larga duración.",
    services_minigroom: "Baño completo con shampoo premium, secado profesional y arreglo de mantenimiento mensual.",
    services_luxury_bath: "Baño con productos de lujo, mascarilla hidratante para el pelaje y colonia exclusiva.",
    
    // Addons
    addons_title: "Servicios adicionales",
    
    // Process
    process_eyebrow: "Proceso",
    process_title: "Reservar nunca fue\ntan fácil",
    process_step1_title: "Elige el servicio",
    process_step1_desc: "Selecciona el tratamiento ideal según el tamaño y tipo de pelaje de tu perro.",
    process_step2_title: "Elige fecha y hora",
    process_step2_desc: "Consulta disponibilidad en tiempo real. Sin llamadas, sin WhatsApp, 24/7.",
    process_step3_title: "Confirmación inmediata",
    process_step3_desc: "Recibes confirmación por correo y un recordatorio automático 24 horas antes.",

    // Gallery
    gallery_eyebrow: "Galería",
    gallery_title: "Nuestro Trabajo",

    // CTA
    cta_title_1: "¿Lista para la ",
    cta_title_highlight: "experiencia Q4",
    cta_title_2: "?",
    cta_subtitle: "Tu perro se lo merece · Kissimmee, FL · @q4paws",
    cta_btn: "Reservar mi cita ahora",

    // Footer
    footer_admin: "Acceso administrador",
  }
};

export type TranslationKey = keyof typeof translations.en;
