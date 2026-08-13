import type { CSSProperties } from "react";
import { forwardRef, useEffect, useRef, useState } from "react";
import type { Locale } from "./types";

type HomeProjectGalleryProps = {
  locale: Locale;
  revealDelay: number;
};

const PROJECT_GALLERY_IMAGES = [
  {
    alt: {
      en: "Project 1 preview",
      es: "Vista previa del proyecto 1",
    },
    src: "/assets/projects/project1.svg",
  },
  {
    alt: {
      en: "Project 2 preview",
      es: "Vista previa del proyecto 2",
    },
    src: "/assets/projects/project2.svg",
  },
  {
    alt: {
      en: "Project 3 preview",
      es: "Vista previa del proyecto 3",
    },
    src: "/assets/projects/project3.svg",
  },
  {
    alt: {
      en: "Project 4 preview",
      es: "Vista previa del proyecto 4",
    },
    src: "/assets/projects/project4.svg",
  },
] as const;

const HomeProjectGallery = forwardRef<HTMLDivElement, HomeProjectGalleryProps>(
  ({ locale, revealDelay }, ref) => {
    const [isRevealReady, setIsRevealReady] = useState(revealDelay === 0);
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const itemRefs = useRef<Array<HTMLElement | null>>([]);
    const revealTimersRef = useRef<number[]>([]);

    useEffect(() => {
      if (isRevealReady) {
        return;
      }

      const timer = window.setTimeout(() => {
        setIsRevealReady(true);
      }, revealDelay);

      return () => {
        window.clearTimeout(timer);
      };
    }, [isRevealReady, revealDelay]);

    useEffect(() => {
      if (!isRevealReady) {
        return;
      }

      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

      if (mediaQuery.matches) {
        setVisibleItems(
          new Set(PROJECT_GALLERY_IMAGES.map((_, index) => index)),
        );
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => {
              const aIndex = Number(
                (a.target as HTMLElement).dataset.projectIndex ?? 0,
              );
              const bIndex = Number(
                (b.target as HTMLElement).dataset.projectIndex ?? 0,
              );

              return aIndex - bIndex;
            })
            .forEach((entry, entryIndex) => {
              const index = Number(
                (entry.target as HTMLElement).dataset.projectIndex ?? 0,
              );
              const timer = window.setTimeout(() => {
                setVisibleItems((current) => {
                  const next = new Set(current);

                  next.add(index);

                  return next;
                });
              }, entryIndex * 120);

              revealTimersRef.current.push(timer);
              observer.unobserve(entry.target);
            });
        },
        {
          rootMargin: "0px 0px -8% 0px",
          threshold: 0.16,
        },
      );

      itemRefs.current.forEach((item) => {
        if (item) {
          observer.observe(item);
        }
      });

      return () => {
        observer.disconnect();
        revealTimersRef.current.forEach((timer) => {
          window.clearTimeout(timer);
        });
        revealTimersRef.current = [];
      };
    }, [isRevealReady]);

    return (
      <div className="intro-tooling home-project-gallery-shell" ref={ref}>
        <div
          className="home-project-gallery"
          aria-label={
            locale === "es" ? "Galeria de proyectos" : "Project gallery"
          }
          data-reveal-ready={isRevealReady}
        >
          {PROJECT_GALLERY_IMAGES.map((project, index) => (
            <figure
              className="home-project-gallery-item"
              data-project-index={index}
              data-visible={visibleItems.has(index)}
              key={project.src}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              style={
                {
                  "--project-index": index,
                } as CSSProperties
              }
            >
              <img
                src={project.src}
                alt={project.alt[locale]}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </figure>
          ))}
        </div>
      </div>
    );
  },
);

HomeProjectGallery.displayName = "HomeProjectGallery";

export default HomeProjectGallery;
