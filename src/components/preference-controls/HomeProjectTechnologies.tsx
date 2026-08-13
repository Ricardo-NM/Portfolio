import type { CSSProperties } from "react";
import type { TechnologyItem } from "./types";

type HomeProjectTechnologiesProps = {
  label: string;
  technologies: readonly TechnologyItem[];
};

export default function HomeProjectTechnologies({
  label,
  technologies,
}: HomeProjectTechnologiesProps) {
  return (
    <div className="home-project-card-technologies" aria-label={label}>
      {technologies.map((technology) => (
        <span
          aria-label={technology.label}
          className="home-project-card-technology"
          data-label={technology.label}
          key={technology.label}
          role="img"
          tabIndex={0}
        >
          <span
            aria-hidden="true"
            className="home-project-card-technology-icon"
            style={
              {
                "--technology-icon-url": `url("/assets/icons/Technologies/${technology.icon}")`,
              } as CSSProperties
            }
          />
        </span>
      ))}
    </div>
  );
}
