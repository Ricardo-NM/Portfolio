import { type Locale, workExperienceItems } from "../data/workExperience";
import { useSyncedLocale } from "../hooks/useSyncedLocale";
import RouteBreadcrumb from "./RouteBreadcrumb";

const copy = {
  es: {
    title: "Experiencia laboral",
    subtitle:
      "Resumen de empleos, roles y responsabilidades representadas con contenido de ejemplo.",
    breadcrumbLabel: "Ruta de navegacion",
    homeRouteLabel: "Ir al inicio",
  },
  en: {
    title: "Work experience",
    subtitle:
      "Summary of jobs, roles, and responsibilities represented with sample content.",
    breadcrumbLabel: "Breadcrumb",
    homeRouteLabel: "Go home",
  },
} as const;

export default function ExperienceView() {
  const locale = useSyncedLocale() as Locale;
  const labels = copy[locale];

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

        <section className="experience-list" aria-label={labels.title}>
          {workExperienceItems.map((item) => (
            <article
              className="experience-card"
              key={`${item.company}-${item.date.es}`}
            >
              <span className="experience-logo" aria-hidden="true">
                <img src={item.logo} alt="" loading="lazy" />
              </span>

              <div className="experience-card-content">
                <div className="experience-card-heading">
                  <div>
                    <h2>{item.role[locale]}</h2>
                    <p>{item.company}</p>
                  </div>
                  <time>{item.date[locale]}</time>
                </div>

                <ul className="experience-bullets">
                  {item.details[locale].map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
