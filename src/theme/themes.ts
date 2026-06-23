// src/theme/themes.ts
// Definition of multiple app themes with precise color codes for football-inspired layouts

export interface ThemeConfig {
  id: string;
  nameEn: string;
  nameAr: string;
  nameFr: string;
  nameEs: string;
  descriptionEn: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionEs: string;
  colors: {
    bg: string;
    surface: string;
    card: string;
    primary: string;
    secondary: string;
    text: string;
    muted: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
}

export const THEMES: ThemeConfig[] = [
  {
    id: "dark-neon",
    nameEn: "Dark Neon",
    nameAr: "النيون المظلم",
    nameFr: "Néon Sombre",
    nameEs: "Neón Oscuro",
    descriptionEn: "Default premium dark gaming style with cyan-light accents.",
    descriptionAr: "النمط الجيمينج الاحترافي اللامع مع لمسات سيان المضيئة.",
    descriptionFr: "Style de jeu sombre haut de gamme avec des accents néon cyan.",
    descriptionEs: "Estilo gaming oscuro premium por defecto con brillo cian.",
    colors: {
      bg: "#020617",      // Slate 950
      surface: "#0b1329", // Midnight deep
      card: "#0f172a",    // Slate 900
      primary: "#00d4ff", // Electric Cyan
      secondary: "#a855f7", // Purple
      text: "#f8fafc",    // Slate 50
      muted: "#94a3b8",   // Slate 400
      border: "#1e293b",  // Slate 800
      success: "#10b981", // Emerald 500
      warning: "#f59e0b", // Amber 500
      danger: "#ef4444"   // Red 500
    }
  },
  {
    id: "stadium-blue",
    nameEn: "Stadium Blue",
    nameAr: "أزرق الاستاد",
    nameFr: "Bleu Stade",
    nameEs: "Azul Estadio",
    descriptionEn: "Clean stadium theme colored like night illumination lights.",
    descriptionAr: "ألوان مبهجة تحاكي إضاءة ملاعب ركلات الليل الزرقاء.",
    descriptionFr: "Thème bleu épuré inspiré de l'éclairage nocturne d'un terrain.",
    descriptionEs: "Azul nítido inspirado en la iluminación nocturna de los estadios.",
    colors: {
      bg: "#080c14",
      surface: "#0e172a",
      card: "#1e293b",
      primary: "#3b82f6", // Blue
      secondary: "#00d4ff",
      text: "#f1f5f9",
      muted: "#94a3b8",
      border: "#273549",
      success: "#34d399",
      warning: "#f59e0b",
      danger: "#ef4444"
    }
  },
  {
    id: "grass-green",
    nameEn: "Grass Green",
    nameAr: "الأخضر العشبي",
    nameFr: "Vert Pelouse",
    nameEs: "Césped Verde",
    descriptionEn: "Vibrant football pitch theme with fresh green lines.",
    descriptionAr: "شكل النجيل الطبيعي الملهم لعشاق التكتيك الكلاسيكي في الملعب.",
    descriptionFr: "Thème pelouse de football vibrante avec des lignes vertes fraîches.",
    descriptionEs: "Inspirado en el césped natural y la pizarra táctica tradicional.",
    colors: {
      bg: "#041a12",      // Custom grass dark shade
      surface: "#09291d",
      card: "#0d3b2a",
      primary: "#10b981", // Emerald
      secondary: "#38bdf8",
      text: "#f0fdf4",
      muted: "#86efac",
      border: "#154a37",
      success: "#22c55e",
      warning: "#f59e0b",
      danger: "#ef4444"
    }
  },
  {
    id: "classic-light",
    nameEn: "Classic Light",
    nameAr: "النمط المضيء",
    nameFr: "Clair Classique",
    nameEs: "Modo Claro",
    descriptionEn: "Bright layout that enhances readability in open daylight.",
    descriptionAr: "الوضع الفاتح بتباين عالي للرؤية بوضوح تحت أشعة الشمس.",
    descriptionFr: "Style clair et épuré pour une meilleure lisibilité au soleil.",
    descriptionEs: "Diseño luminoso y limpio de alto contraste para exteriores.",
    colors: {
      bg: "#f8fafc",      // Slate 50
      surface: "#f1f5f9", // Slate 100
      card: "#ffffff",    // Pure white
      primary: "#2563eb", // Blue 600
      secondary: "#475569", // Slate 600
      text: "#0f172a",    // Slate 900
      muted: "#64748b",   // Slate 500
      border: "#cbd5e1",  // Slate 300
      success: "#16a34a", // Green 600
      warning: "#d97706", // Amber 600
      danger: "#dc2626"   // Red 600
    }
  },
  {
    id: "amoled-black",
    nameEn: "AMOLED Black",
    nameAr: "سواد أموليد تام",
    nameFr: "Noir AMOLED",
    nameEs: "AMOLED Puro",
    descriptionEn: "Pure black theme that saves battery power on mobile OLED screens.",
    descriptionAr: "اللون الأسود الخالص لتوفير طاقة شاشات الموبايل الحديثة في الملعب.",
    descriptionFr: "Thème noir pur idéal pour économiser la batterie sur écran OLED.",
    descriptionEs: "Negro absoluto para ahorrar energía en pantallas OLED de móviles.",
    colors: {
      bg: "#000000",
      surface: "#0a0a0a",
      card: "#121212",
      primary: "#00fbff", // Bright neon cyan
      secondary: "#f43f5e",
      text: "#ffffff",
      muted: "#a3a3a3",
      border: "#262626",
      success: "#10b981",
      warning: "#f59e0b",
      danger: "#ef4444"
    }
  }
];
