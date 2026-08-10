export type Locale = "es" | "en";

export const workExperienceItems = [
  {
    logo: "/assets/experience-one.png",
    role: {
      es: "Desarrollador Full Stack",
      en: "Full Stack Developer",
    },
    company: "ArdabyTec",
    date: {
      es: "Mayo 2025 - Diciembre 2025",
      en: "May 2025 - December 2025",
    },
    details: {
      es: ["texto1", "texto2", "texto3"],
      en: ["text1", "text2", "text3"],
    },
  },
  {
    logo: "/assets/experience-second.png",
    role: {
      es: "Desarrollador Full Stack",
      en: "Full Stack Developer",
    },
    company: "K-PUGA S.A. de C.V",
    date: {
      es: "Enero 2026 - Junio 2026",
      en: "January 2026 - June 2026",
    },
    details: {
      es: ["texto1", "texto2", "texto3"],
      en: ["text1", "text2", "text3"],
    },
  },
] as const;
