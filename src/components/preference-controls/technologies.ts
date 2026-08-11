import type { Locale, TechnologyItem } from "./types";

export const TECHNOLOGY_CATEGORIES = [
  {
    title: {
      es: "FRONTEND",
      en: "FRONTEND",
    },
    items: [
      {
        label: "JavaScript",
        icon: "javascript.svg",
        color: "#f7df1e",
      },
      { label: "TypeScript", icon: "typescript.svg", color: "#3178c6" },
      { label: "HTML5", icon: "html5.svg", color: "#e34f26" },
      { label: "CSS", icon: "css.svg", color: "#663399" },
      {
        label: "Tailwind CSS",
        icon: "tailwindcss.svg",
        color: "#06b6d4",
        lightColor: "#164e63",
      },
      {
        label: "React",
        icon: "react.svg",
        color: "#61dafb",
        lightColor: "#134e5e",
      },
      {
        label: "Expo",
        icon: "expo.svg",
        color: "#000020",
        darkColor: "#ffffff",
      },
      { label: "Flutter", icon: "flutter.svg", color: "#02569b" },
      {
        label: "Next.js",
        icon: "nextdotjs.svg",
        color: "#000000",
        darkColor: "#ffffff",
      },
    ],
  },
  {
    title: {
      es: "BACKEND",
      en: "BACKEND",
    },
    items: [
      { label: "C#", icon: "csharp.svg", color: "#9a5196" },
      { label: ".NET", icon: "dotnet.svg", color: "#512bd4" },
      { label: "Node.js", icon: "nodedotjs.svg", color: "#5fa04e" },
      { label: "NestJS", icon: "nestjs.svg", color: "#e0234e" },
      {
        label: "Express.js",
        icon: "express.svg",
        color: "#000000",
        darkColor: "#ffffff",
      },
      {
        label: "Prisma ORM",
        icon: "prisma.svg",
        color: "#2d3748",
        darkColor: "#ffffff",
      },
    ],
  },
  {
    title: {
      es: "BASES DE DATOS",
      en: "DATABASES",
    },
    items: [
      { label: "MongoDB", icon: "mongodb.svg", color: "#47a248" },
      { label: "MySQL", icon: "mysql.svg", color: "#4479a1" },
      { label: "PostgreSQL", icon: "postgresql.svg", color: "#4169e1" },
      { label: "Redis", icon: "redis.svg", color: "#ff4438" },
    ],
  },
  {
    title: {
      es: "HERRAMIENTAS",
      en: "TOOLS",
    },
    items: [
      { label: "Git", icon: "git.svg", color: "#f05032" },
      {
        label: "GitHub",
        icon: "github.svg",
        color: "#181717",
        darkColor: "#ffffff",
      },
      { label: "Docker", icon: "docker.svg", color: "#2496ed" },
      { label: "ESLint", icon: "eslint.svg", color: "#4b32c3" },
      { label: "Figma", icon: "figma.svg", color: "#f24e1e" },
      {
        label: "VPS Linux",
        icon: "linux.svg",
        color: "#fcc624",
        lightColor: "#1d1d1f",
      },
      { label: "Nginx", icon: "nginx.svg", color: "#009639" },
      { label: "PM2", icon: "pm2.svg", color: "#2b037a", darkColor: "#8e6cff" },
      { label: "IIS", icon: "iis.svg", color: "#0078d4" },
    ],
  },
] satisfies Array<{
  items: TechnologyItem[];
  title: Record<Locale, string>;
}>;
