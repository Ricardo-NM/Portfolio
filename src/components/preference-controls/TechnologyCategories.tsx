import type { CSSProperties } from "react";
import { useRef } from "react";
import { useLocaleFlip } from "../../hooks/useLocaleFlip";
import { TECHNOLOGY_CATEGORIES } from "./technologies";
import type { Locale, TechnologyItem } from "./types";

type TechnologyCategoriesProps = {
  label: string;
  locale: Locale;
};

const TECHNOLOGIES_HIDDEN_FROM_ROUTE = new Set(["Bootstrap", "Vite"]);

function TechnologyVisual({ technology }: { technology: TechnologyItem }) {
  return (
    <span
      aria-hidden="true"
      className="technology-category-icon"
      style={
        {
          "--technology-icon-url": `url("/assets/icons/Technologies/${technology.icon}")`,
        } as CSSProperties
      }
    />
  );
}

function AnimatedTechnologyTitle({ text }: { text: string }) {
  let letterIndex = 0;
  const parts = text.split(/(\s+)/).filter(Boolean);

  return (
    <h2 aria-label={text} className="technology-category-title">
      {parts.map((part, partIndex) => {
        if (/^\s+$/.test(part)) {
          return " ";
        }

        return (
          <span
            aria-hidden="true"
            className="technology-category-title-word"
            key={`${part}-${partIndex}`}
          >
            {Array.from(part).map((letter) => {
              const currentIndex = letterIndex;
              letterIndex += 1;

              return (
                <span
                  className="technology-category-title-letter"
                  key={`${text}-${currentIndex}-${letter}`}
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
    </h2>
  );
}

export default function TechnologyCategories({
  label,
  locale,
}: TechnologyCategoriesProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useLocaleFlip(listRef, [locale]);

  return (
    <div className="technology-category-list" aria-label={label} ref={listRef}>
      {TECHNOLOGY_CATEGORIES.map((category, categoryIndex) => (
        <article
          className="technology-category-card"
          key={category.title.es}
          style={
            {
              "--technology-card-index": categoryIndex,
            } as CSSProperties
          }
        >
          <AnimatedTechnologyTitle text={category.title[locale]} />

          <span
            className="technology-category-divider"
            data-locale-flip-key={`${category.title.es}-divider`}
            aria-hidden="true"
          />

          <div
            className="technology-category-icons"
            data-locale-flip-key={`${category.title.es}-icons`}
          >
            {category.items
              .filter(
                (technology) =>
                  !TECHNOLOGIES_HIDDEN_FROM_ROUTE.has(technology.label),
              )
              .map((technology, technologyIndex) => (
                <span
                  aria-label={technology.label}
                  className="technology-category-item"
                  data-label={technology.label}
                  key={technology.label}
                  role="img"
                  style={
                    {
                      "--technology-brand-color": technology.color,
                      "--technology-brand-color-dark":
                        technology.darkColor ?? technology.color,
                      "--technology-brand-color-light":
                        technology.lightColor ?? technology.color,
                      "--technology-icon-index": technologyIndex,
                    } as CSSProperties
                  }
                  tabIndex={0}
                >
                  <TechnologyVisual technology={technology} />
                </span>
              ))}
          </div>
        </article>
      ))}
    </div>
  );
}
