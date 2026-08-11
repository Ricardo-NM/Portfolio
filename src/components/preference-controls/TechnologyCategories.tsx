import type { CSSProperties } from "react";
import { TECHNOLOGY_CATEGORIES } from "./technologies";
import type { Locale, TechnologyItem } from "./types";

type TechnologyCategoriesProps = {
  label: string;
  locale: Locale;
};

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

export default function TechnologyCategories({
  label,
  locale,
}: TechnologyCategoriesProps) {
  return (
    <div className="technology-category-list" aria-label={label}>
      {TECHNOLOGY_CATEGORIES.map((category) => (
        <article className="technology-category-card" key={category.title.es}>
          <h2>{category.title[locale]}</h2>

          <span className="technology-category-divider" aria-hidden="true" />

          <div className="technology-category-icons">
            {category.items.map((technology) => (
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
