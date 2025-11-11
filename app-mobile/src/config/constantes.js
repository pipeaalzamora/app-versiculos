// Configuración de la aplicación
export const CONFIGURACION = {
  // URL del backend - Usar producción (Android bloquea HTTP en Expo Go)
  URL_BACKEND: "https://backend-livid-rho-81.vercel.app",

  // Configuración de anuncios
  FRECUENCIA_ANUNCIOS: 5, // Mostrar anuncio cada X búsquedas

  // Configuración de caché
  DURACION_CACHE: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
  MAX_ITEMS_HISTORIAL: 50,

  // Timeouts
  TIMEOUT_API: 10000, // 10 segundos

  // Versión de la Biblia
  VERSION_BIBLIA: "rv1960",
};

// IDs de AdMob - Configurar con tus propios IDs
export const IDS_ADMOB = {
  android: {
    idApp: "ca-app-pub-9533784425967946~7514255091",
    banner: "ca-app-pub-9533784425967946/5921971829",
    intersticial: "ca-app-pub-9533784425967946/1234567890", // TODO: Actualizar con ID real
  },
  ios: {
    idApp: "ca-app-pub-9533784425967946~7514255091",
    banner: "ca-app-pub-9533784425967946/9224165856",
    intersticial: "ca-app-pub-9533784425967946/0987654321", // TODO: Actualizar con ID real
  },
};

// Temas de colores
export const TEMAS = {
  claro: {
    background: "#F5F7FA",
    surface: "#FFFFFF",
    primary: "#4A90E2",
    primaryDark: "#3A7BC8",
    text: "#2C3E50",
    textSecondary: "#34495E",
    textLight: "#95A5A6",
    border: "#E1E8ED",
    shadow: "#000000",
  },
  oscuro: {
    background: "#1A1A2E",
    surface: "#16213E",
    primary: "#4A90E2",
    primaryDark: "#3A7BC8",
    text: "#EAEAEA",
    textSecondary: "#B8B8B8",
    textLight: "#7F8C8D",
    border: "#2C3E50",
    shadow: "#000000",
  },
};
