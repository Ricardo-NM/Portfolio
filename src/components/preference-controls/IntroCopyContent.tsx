import type { CSSProperties } from "react";
import type { Locale } from "./types";

type IntroCopyContentProps = {
  introHighlight: string;
  introRest: string;
  isDrawer?: boolean;
  locale?: Locale;
};

const INTRO_COPY_LINES_ES = [
  "especializado en la creación de sistemas digitales, plataformas",
  "administrativas y aplicaciones web y móviles. Cuento con experiencia en el análisis, diseño,",
  "desarrollo, despliegue y optimización de soluciones funcionales, escalables y bien",
  "estructuradas, utilizando distintas herramientas y tecnologías para resolver problemas",
  "técnicos y participar en todo el ciclo de desarrollo de software.",
];

const INTRO_COPY_LINES_EN = [
  "specialized in building digital systems, administrative platforms,",
  "and web and mobile applications. I have experience in the analysis, design, development,",
  "deployment, and optimization of functional, scalable, and well-structured solutions,",
  "using different tools and technologies to solve technical problems and participate",
  "in the full software development lifecycle.",
];

export default function IntroCopyContent({
  introHighlight,
  introRest,
  isDrawer = false,
  locale = "es",
}: IntroCopyContentProps) {
  if (isDrawer) {
    return (
      <>
        <strong>{introHighlight}</strong>
        {introRest}
      </>
    );
  }

  const lines = locale === "en" ? INTRO_COPY_LINES_EN : INTRO_COPY_LINES_ES;

  return (
    <>
      <span
        className="intro-copy-line"
        style={{ "--line-index": 0 } as CSSProperties}
      >
        <strong>{introHighlight}</strong> {lines[0]}
      </span>
      {lines.slice(1).map((line, index) => (
        <span
          className="intro-copy-line"
          key={line}
          style={{ "--line-index": index + 1 } as CSSProperties}
        >
          {line}
        </span>
      ))}
    </>
  );
}
