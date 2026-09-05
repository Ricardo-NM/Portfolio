import { type CSSProperties, useRef } from "react";
import { useLocaleFlip } from "../../hooks/useLocaleFlip";
import { TECHNOLOGY_CATEGORIES } from "./technologies";
import TechnologyLogoCarousel from "./TechnologyLogoCarousel";
import type { Locale } from "./types";

type TechnologyCategoriesProps = {
  label: string;
  locale: Locale;
};

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
          <TechnologyLogoCarousel items={category.items} />
        </article>
      ))}
    </div>
  );
}
