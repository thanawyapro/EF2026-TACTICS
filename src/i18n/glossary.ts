// src/i18n/glossary.ts
// Standardized eFootball tactical glossary for consistent terminology across languages

export interface GlossaryTerm {
  ar: string; // Egyptian-friendly modern Arabic
  en: string; // Correct product English
  fr: string; // Natural French football terms
  es: string; // Neutral Spanish football terms
}

export const GLOSSARY: Record<string, GlossaryTerm> = {
  formation: {
    ar: "التشكيلة",
    en: "Formation",
    fr: "Formation",
    es: "Formación"
  },
  teamPlaystyle: {
    ar: "أسلوب اللعب الجماعي",
    en: "Team Playstyle",
    fr: "Style de jeu d'équipe",
    es: "Estilo de juego de equipo"
  },
  possessionGame: {
    ar: "استحواذ",
    en: "Possession Game",
    fr: "Jeu de possession",
    es: "Juego de posesión"
  },
  quickCounter: {
    ar: "مرتدات سريعة",
    en: "Quick Counter",
    fr: "Contre-attaque rapide",
    es: "Contraataque rápido"
  },
  longBallCounter: {
    ar: "كرة طويلة مضادة",
    en: "Long Ball Counter",
    fr: "Contre-attaque de ballons longs",
    es: "Contraataque de balones largos"
  },
  outWide: {
    ar: "لعب على الأطراف",
    en: "Out Wide",
    fr: "Sur les ailes",
    es: "Por las bandas"
  },
  longBall: {
    ar: "كرات طويلة",
    en: "Long Ball",
    fr: "Long ballon",
    es: "Balón largo"
  },
  individualInstructions: {
    ar: "تعليمات فردية",
    en: "Individual Instructions",
    fr: "Instructions individuelles",
    es: "Instrucciones individuales"
  },
  playerRoles: {
    ar: "أدوار اللاعبين",
    en: "Player Roles",
    fr: "Rôles des joueurs",
    es: "Roles de jugadores"
  },
  savedPlans: {
    ar: "خططي",
    en: "Saved Plans",
    fr: "Plans sauvegardés",
    es: "Planes guardados"
  },
  smartCoach: {
    ar: "مدربك الذكي",
    en: "Smart Coach",
    fr: "Coach Intelligent",
    es: "Entrenador Inteligente"
  },
  buildYourPlan: {
    ar: "ابني خطتك",
    en: "Build Your Plan",
    fr: "Créer votre plan",
    es: "Crea tu plan"
  },
  analyzeMatch: {
    ar: "حلّل ماتشك",
    en: "Analyze Match",
    fr: "Analyser le match",
    es: "Analiza tu partido"
  },
  counterOpponent: {
    ar: "خطة ضد خصم",
    en: "Counter Opponent",
    fr: "Contrer l'adversaire",
    es: "Plan contra rival"
  },
  lossOfControl: {
    ar: "فقدان السيطرة",
    en: "Loss of control",
    fr: "Perte de contrôle",
    es: "Pérdida de control"
  },
  mainProblem: {
    ar: "المشكلة الكبرى",
    en: "Main problem",
    fr: "Problème principal",
    es: "Problema principal"
  },
  recommendedFormation: {
    ar: "التشكيلة الأنسب",
    en: "Recommended formation",
    fr: "Formation recommandée",
    es: "Formación recomendada"
  },
  whatToAvoid: {
    ar: "تراجع وسلوك خاطئ تجنبه",
    en: "What to avoid",
    fr: "Ce qu'il faut éviter",
    es: "Qué evitar"
  }
};
