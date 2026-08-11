import type { CSSProperties } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { type Locale, workExperienceItems } from "../data/workExperience";
import { useSyncedLocale } from "../hooks/useSyncedLocale";
import AnimatedDescription, {
  getDescriptionStartDelay,
} from "./AnimatedDescription";
import AnimatedTitle, { getAnimatedLetterCount } from "./AnimatedTitle";
import RouteBreadcrumb from "./RouteBreadcrumb";

const copy = {
  es: {
    title: "Experiencia laboral",
    subtitle:
      "Experiencia profesional, responsabilidades y proyectos desarrollados a lo largo de mi trayectoria laboral.",
    breadcrumbLabel: "Ruta de navegacion",
    homeRouteLabel: "Ir al inicio",
  },
  en: {
    title: "Work experience",
    subtitle:
      "Professional experience, responsibilities and projects developed throughout my work career.",
    breadcrumbLabel: "Breadcrumb",
    homeRouteLabel: "Go home",
  },
} as const;

const EXPERIENCE_BULLET_ANIMATION_DURATION = 260;
const EXPERIENCE_BULLET_GAP = 80;
const EXPERIENCE_BULLET_LETTER_DELAY = 4;
const EXPERIENCE_BULLET_SEQUENCE_OFFSET = 560;

function getExperienceBulletSequence(details: readonly string[]) {
  let nextDelay = 0;

  const delays = details.map((detail) => {
    const currentDelay = nextDelay;
    const letterCount = getAnimatedLetterCount(detail);

    nextDelay +=
      EXPERIENCE_BULLET_ANIMATION_DURATION +
      letterCount * EXPERIENCE_BULLET_LETTER_DELAY +
      EXPERIENCE_BULLET_GAP;

    return currentDelay;
  });

  return {
    delays,
    duration: nextDelay,
  };
}

function AnimatedExperienceBullet({
  delay,
  detail,
}: {
  delay: number;
  detail: string;
}) {
  let letterIndex = 0;
  const parts = detail.split(/(\s+)/).filter(Boolean);

  return (
    <li
      className="experience-bullet"
      style={
        {
          "--experience-bullet-delay": `${delay}ms`,
        } as CSSProperties
      }
    >
      <span className="screen-reader-text">{detail}</span>
      <span className="experience-bullet-marker" aria-hidden="true" />
      <span className="experience-bullet-copy" aria-hidden="true">
        {parts.map((part, partIndex) => {
          if (/^\s+$/.test(part)) {
            return " ";
          }

          return (
            <span
              className="experience-bullet-word"
              key={`${part}-${partIndex}`}
            >
              {Array.from(part).map((letter) => {
                const currentIndex = letterIndex;
                letterIndex += 1;

                return (
                  <span
                    className="experience-bullet-letter"
                    key={`${detail}-${currentIndex}-${letter}`}
                    style={
                      {
                        "--letter-index": currentIndex,
                      } as CSSProperties
                    }
                  >
                    {letter}
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </li>
  );
}

export default function ExperienceView() {
  const locale = useSyncedLocale() as Locale;
  const labels = copy[locale];
  const [openItem, setOpenItem] = useState("experience-0");
  const [introAnimationsEnabled, setIntroAnimationsEnabled] = useState(true);
  const experienceContentDelay = getDescriptionStartDelay(labels.title);
  const firstCardBulletSequence = getExperienceBulletSequence(
    workExperienceItems[0]?.details[locale] ?? [],
  );

  useEffect(() => {
    if (
      document.documentElement.dataset.suppressEntryAnimations === "locale"
    ) {
      setIntroAnimationsEnabled(false);
      return;
    }

    setIntroAnimationsEnabled(true);

    const introDuration =
      experienceContentDelay +
      EXPERIENCE_BULLET_SEQUENCE_OFFSET +
      firstCardBulletSequence.duration +
      240;
    const introTimer = window.setTimeout(() => {
      setIntroAnimationsEnabled(false);
    }, introDuration);

    return () => window.clearTimeout(introTimer);
  }, [experienceContentDelay, firstCardBulletSequence.duration, locale]);

  const toggleItem = (id: string) => {
    setIntroAnimationsEnabled(false);
    setOpenItem((currentItem) => (currentItem === id ? "" : id));
  };

  return (
    <main
      className="experience-shell experience-shell-work"
      aria-labelledby="experience-title"
    >
      <div className="experience-content">
        <RouteBreadcrumb
          currentLabel={labels.title}
          homeLabel={labels.homeRouteLabel}
          label={labels.breadcrumbLabel}
        />

        <header className="experience-header">
          <AnimatedTitle id="experience-title" text={labels.title} />
          <AnimatedDescription text={labels.subtitle} title={labels.title} />
        </header>

        <section
          className="experience-list"
          aria-label={labels.title}
          style={
            {
              "--experience-content-delay": `${experienceContentDelay}ms`,
            } as CSSProperties
          }
        >
          {workExperienceItems.map((item, index) => {
            const itemId = `experience-${index}`;
            const isOpen = openItem === itemId;
            const bulletSequence = getExperienceBulletSequence(
              item.details[locale],
            );

            return (
              <article
                className="experience-card"
                data-intro-open={
                  introAnimationsEnabled && index === 0 ? "true" : "false"
                }
                key={`${item.company}-${item.date.es}`}
                style={
                  {
                    "--experience-card-index": index,
                  } as CSSProperties
                }
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
                      {item.details[locale].map((detail, bulletIndex) => (
                        <AnimatedExperienceBullet
                          delay={bulletSequence.delays[bulletIndex] ?? 0}
                          detail={detail}
                          key={detail}
                        />
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
