import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { type Locale, workExperienceItems } from "../data/workExperience";

const STORAGE_KEYS = {
  locale: "rn-locale",
} as const;

const copy = {
  es: {
    title: "Experiencia laboral",
    subtitle:
      "Resumen de empleos, roles y responsabilidades representadas con contenido de ejemplo.",
    backLabel: "Volver al inicio",
  },
  en: {
    title: "Work experience",
    subtitle:
      "Summary of jobs, roles, and responsibilities represented with sample content.",
    backLabel: "Back home",
  },
} as const;

function getInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "es";
  }

  return window.localStorage.getItem(STORAGE_KEYS.locale) === "en"
    ? "en"
    : "es";
}

export default function ExperienceView() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const labels = copy[locale];

  useEffect(() => {
    const syncLocale = () => setLocale(getInitialLocale());

    window.addEventListener("storage", syncLocale);

    return () => {
      window.removeEventListener("storage", syncLocale);
    };
  }, []);

  return (
    <main className="experience-shell" aria-labelledby="experience-title">
      <div className="experience-content">
        <a className="experience-back-link" href="/">
          <ArrowLeft aria-hidden="true" size={17} strokeWidth={2} />
          <span>{labels.backLabel}</span>
        </a>

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
