import {
  ChevronLeft,
  ChevronRight,
  MonitorUp,
  Network,
  ShieldCheck,
  UserRoundCheck,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { type Locale } from "../data/workExperience";
import { useSyncedLocale } from "../hooks/useSyncedLocale";
import RouteBreadcrumb from "./RouteBreadcrumb";

const copy = {
  es: {
    title: "Logros destacados",
    subtitle:
      "Selección de resultados, mejoras e hitos alcanzados a lo largo de mi experiencia profesional.",
    breadcrumbLabel: "Ruta de navegacion",
    homeRouteLabel: "Ir al inicio",
    experienceLabel: "Experiencia laboral",
    previousLabel: "Ver logro anterior",
    nextLabel: "Ver siguiente logro",
    cardLabel: "Logro",
    priorityLabels: [
      "Producto interno",
      "Centralización",
      "Seguridad y control",
      "Liderazgo",
      "Transformación digital",
    ],
    achievements: [
      {
        owner: "Ricardo Nava Mayoral",
        progress: "100%",
        title: "ERP interno para 30+ colaboradores",
        description:
          "Diseñé, desarrollé y desplegué un ERP interno utilizado simultáneamente por aproximadamente 30 colaboradores de áreas operativas, administrativas y gerenciales.",
        tags: ["ERP", "Full Stack", "Producción", "Despliegue"],
      },
      {
        owner: "Ricardo Nava Mayoral",
        progress: "100%",
        title: "Centralización de operaciones",
        description:
          "Unifiqué en una sola plataforma la documentación, comunicación y seguimiento de operaciones que anteriormente se gestionaban mediante WhatsApp y archivos compartidos manualmente.",
        tags: [
          "Digitalización",
          "Gestión documental",
          "Operaciones",
          "Colaboración",
        ],
      },
      {
        owner: "Ricardo Nava Mayoral",
        progress: "100%",
        title: "Trazabilidad y control de acceso",
        description:
          "Implementé trazabilidad, notificaciones y controles de acceso para mejorar la coordinación entre áreas, reducir omisiones y proteger la información financiera y operativa.",
        tags: [
          "Trazabilidad",
          "Notificaciones",
          "Control de acceso",
          "Seguridad",
        ],
      },
      {
        owner: "Ricardo Nava Mayoral",
        progress: "100%",
        title: "Liderazgo de proyectos digitales",
        description:
          "Participé en 4 proyectos de transformación digital y lideré 2 de ellos, coordinando actividades técnicas, levantamiento de requerimientos y comunicación directa con clientes.",
        tags: ["4 proyectos", "2 liderados", "Requerimientos", "Clientes"],
      },
      {
        owner: "Ricardo Nava Mayoral",
        progress: "100%",
        title: "Digitalización de procesos",
        description:
          "Digitalicé 4 procesos manuales mediante soluciones web adaptadas a las necesidades de cada organización, mejorando el control, seguimiento y eficiencia de sus operaciones.",
        tags: [
          "4 procesos digitalizados",
          "Automatización",
          "Soluciones web",
          "Optimización",
        ],
      },
    ],
  },
  en: {
    title: "Featured achievements",
    subtitle:
      "Selection of results, improvements, and milestones achieved throughout my professional experience.",
    breadcrumbLabel: "Breadcrumb",
    homeRouteLabel: "Go home",
    experienceLabel: "Work experience",
    previousLabel: "View previous achievement",
    nextLabel: "View next achievement",
    cardLabel: "Achievement",
    priorityLabels: [
      "Internal product",
      "Centralization",
      "Security and control",
      "Leadership",
      "Digital transformation",
    ],
    achievements: [
      {
        owner: "Ricardo Nava Mayoral",
        progress: "100%",
        title: "Internal ERP for 30+ collaborators",
        description:
          "Designed, developed, and deployed an internal ERP used simultaneously by approximately 30 collaborators from operational, administrative, and management areas.",
        tags: ["ERP", "Full Stack", "Production", "Deployment"],
      },
      {
        owner: "Ricardo Nava Mayoral",
        progress: "100%",
        title: "Centralization of operations",
        description:
          "Centralized the documentation, communication, and tracking of operations that were previously managed through WhatsApp and manually shared files.",
        tags: [
          "Digitalization",
          "Document Management",
          "Operations",
          "Collaboration",
        ],
      },
      {
        owner: "Ricardo Nava Mayoral",
        progress: "100%",
        title: "Trazability and access control",
        description:
          "Implemented trazability, notifications, and access controls to improve coordination between departments, reduce omissions, and protect financial and operational information.",
        tags: ["Trazability", "Notifications", "Access Control", "Security"],
      },
      {
        owner: "Ricardo Nava Mayoral",
        progress: "100%",
        title: "Leadership in digital projects",
        description:
          "Participated in 4 digital transformation projects and led 2 of them, coordinating technical activities, requirements gathering, and direct communication with clients.",
        tags: ["4 projects", "2 led", "Requirements", "Clients"],
      },
      {
        owner: "Ricardo Nava Mayoral",
        progress: "100%",
        title: "Digitalization of processes",
        description:
          "Digitalized 4 manual processes through web-based solutions tailored to each organization's needs, improving control, tracking, and operational efficiency.",
        tags: [
          "4 processes digitalized",
          "Automation",
          "Web solutions",
          "Optimization",
        ],
      },
    ],
  },
} as const;

const achievementBadges = [
  { Icon: MonitorUp, tone: "product" },
  { Icon: Network, tone: "centralization" },
  { Icon: ShieldCheck, tone: "security" },
  { Icon: UserRoundCheck, tone: "leadership" },
  { Icon: Zap, tone: "transformation" },
] as const;

export default function ExperienceAchievementsView() {
  const locale = useSyncedLocale() as Locale;
  const labels = copy[locale];
  const [activeIndex, setActiveIndex] = useState(0);
  const cardCount = labels.achievements.length;

  const showPrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? cardCount - 1 : currentIndex - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % cardCount);
  };

  const getCardPosition = (index: number) => {
    const offset = (index - activeIndex + cardCount) % cardCount;

    if (offset === 0) {
      return "active";
    }

    if (offset === 1) {
      return "next";
    }

    if (offset === 2) {
      return "third";
    }

    return "hidden";
  };

  return (
    <main className="experience-shell" aria-labelledby="achievements-title">
      <div className="experience-content">
        <RouteBreadcrumb
          currentLabel={labels.title}
          homeLabel={labels.homeRouteLabel}
          label={labels.breadcrumbLabel}
          links={[
            {
              href: "/experience",
              label: labels.experienceLabel,
            },
          ]}
        />

        <header className="experience-header">
          <h1 id="achievements-title">{labels.title}</h1>
          <p>{labels.subtitle}</p>
        </header>

        <section
          className="achievements-deck route-section"
          aria-label={labels.title}
        >
          <div
            className="achievements-stack"
            aria-live="polite"
            aria-roledescription="carousel"
          >
            {labels.achievements.map((achievement, index) => {
              const badge = achievementBadges[index] ?? achievementBadges[0];
              const PriorityIcon = badge.Icon;

              return (
                <article
                  className="achievement-card"
                  data-position={getCardPosition(index)}
                  data-priority-tone={badge.tone}
                  aria-hidden={index !== activeIndex}
                  key={achievement.title}
                >
                  <div className="achievement-card-content">
                    <div className="achievement-card-topline">
                      <span className="achievement-priority">
                        <PriorityIcon
                          size={16}
                          strokeWidth={2.4}
                          aria-hidden="true"
                        />
                        {labels.priorityLabels[index]}
                      </span>
                    </div>

                    <div className="achievement-card-copy">
                      <h2>{achievement.title}</h2>
                      <p>{achievement.description}</p>
                    </div>

                    <div className="achievement-tags" aria-label="Tags">
                      {achievement.tags.map((tag) => (
                        <span className="achievement-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="achievements-deck-controls">
            <button
              type="button"
              className="achievements-deck-button"
              aria-label={labels.previousLabel}
              onClick={showPrevious}
            >
              <ChevronLeft size={20} strokeWidth={2.2} aria-hidden="true" />
            </button>

            <span className="achievements-deck-counter" aria-live="polite">
              {activeIndex + 1} / {cardCount}
            </span>

            <button
              type="button"
              className="achievements-deck-button"
              aria-label={labels.nextLabel}
              onClick={showNext}
            >
              <ChevronRight size={20} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
