import { ChevronDown, ChevronUp, Trophy } from "lucide-react";
import { useState } from "react";
import { type Locale, workExperienceItems } from "../data/workExperience";
import { useSyncedLocale } from "../hooks/useSyncedLocale";
import RouteBreadcrumb from "./RouteBreadcrumb";

const copy = {
  es: {
    title: "Experiencia laboral",
    subtitle:
      "Experiencia profesional, responsabilidades y proyectos desarrollados a lo largo de mi trayectoria laboral.",
    breadcrumbLabel: "Ruta de navegacion",
    homeRouteLabel: "Ir al inicio",
    achievementsLabel: "Logros destacados",
  },
  en: {
    title: "Work experience",
    subtitle:
      "Professional experience, responsibilities and projects developed throughout my work career.",
    breadcrumbLabel: "Breadcrumb",
    homeRouteLabel: "Go home",
    achievementsLabel: "Featured achievements",
  },
} as const;

export default function ExperienceView() {
  const locale = useSyncedLocale() as Locale;
  const labels = copy[locale];
  const [openItem, setOpenItem] = useState("experience-0");

  const toggleItem = (id: string) => {
    setOpenItem((currentItem) => (currentItem === id ? "" : id));
  };

  return (
    <main className="experience-shell" aria-labelledby="experience-title">
      <div className="experience-content">
        <RouteBreadcrumb
          currentLabel={labels.title}
          homeLabel={labels.homeRouteLabel}
          label={labels.breadcrumbLabel}
        />

        <header className="experience-header">
          <h1 id="experience-title">{labels.title}</h1>
          <p>{labels.subtitle}</p>
        </header>

        <div className="experience-achievements-action">
          <a
            className="experience-achievements-link"
            href="/experience/achievements"
          >
            <Trophy aria-hidden="true" size={18} strokeWidth={2.1} />
            <span>{labels.achievementsLabel}</span>
          </a>
        </div>

        <section className="experience-list" aria-label={labels.title}>
          {workExperienceItems.map((item, index) => {
            const itemId = `experience-${index}`;
            const isOpen = openItem === itemId;

            return (
              <article
                className="experience-card"
                key={`${item.company}-${item.date.es}`}
              >
                <button
                  type="button"
                  className="experience-card-toggle"
                  aria-controls={`${itemId}-details`}
                  aria-expanded={isOpen}
                  onClick={() => toggleItem(itemId)}
                >
                  <span className="experience-logo" aria-hidden="true">
                    <img src={item.logo} alt="" loading="lazy" />
                  </span>

                  <span className="experience-card-summary">
                    <span>
                      <span className="experience-role">
                        {item.role[locale]}
                      </span>
                      <span className="experience-company">{item.company}</span>
                    </span>

                    <span className="experience-card-meta">
                      <time>{item.date[locale]}</time>
                      <span
                        className="experience-chevron-stack"
                        aria-hidden="true"
                      >
                        <ChevronDown
                          className="experience-chevron experience-chevron-down"
                          size={21}
                          strokeWidth={2.2}
                        />
                        <ChevronUp
                          className="experience-chevron experience-chevron-up"
                          size={21}
                          strokeWidth={2.2}
                        />
                      </span>
                    </span>
                  </span>
                </button>

                <div
                  className="experience-card-panel"
                  id={`${itemId}-details`}
                  aria-hidden={!isOpen}
                  data-open={isOpen ? "true" : "false"}
                >
                  <div className="experience-card-panel-inner">
                    <ul className="experience-bullets">
                      {item.details[locale].map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
