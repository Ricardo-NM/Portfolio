import type { CSSProperties } from "react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { ExternalLinkIcon, XIcon } from "lucide-react";
import HomeProjectTechnologies from "./HomeProjectTechnologies";
import HomeProjectGalleryTitle from "./HomeProjectGalleryTitle";
import HomeProjectMedia from "./HomeProjectMedia";
import { TECHNOLOGY_CATEGORIES } from "./technologies";
import type { Locale } from "./types";

type HomeProjectGalleryProps = {
  locale: Locale;
  onFirstProjectEntryStart?: () => void;
  revealDelay: number;
};

const PROJECT_GALLERY_ITEM_ENTRY_MS = 620;
const PROJECT_GALLERY_ITEM_STAGGER_MS = 40;
const PROJECT_GALLERY_INTERACTION_BUFFER_MS = 40;

const PROJECT_TECHNOLOGIES = TECHNOLOGY_CATEGORIES.flatMap(
  (category) => category.items,
);

const PROJECT_GALLERY_TITLE: Record<Locale, string> = {
  en: "My work",
  es: "Mi trabajo",
};

const PROJECT_GALLERY_HINT: Record<Locale, string> = {
  en: "Swipe",
  es: "Desliza",
};

const getProjectTechnology = (label: string) => {
  const technology = PROJECT_TECHNOLOGIES.find((item) => item.label === label);

  if (!technology) {
    throw new Error(`Technology not found: ${label}`);
  }

  return technology;
};

const KUENTAS_TECHNOLOGIES = [
  "Next.js",
  "React",
  "Tailwind CSS",
  "TypeScript",
  "Prisma ORM",
  "PostgreSQL",
  "Docker",
  "ESLint",
].map(getProjectTechnology);

const TOTIS_TECHNOLOGIES = [
  "C#",
  ".NET",
  "JavaScript",
  "CSS",
  "Bootstrap",
  "MySQL",
  "IIS",
].map(getProjectTechnology);

const GESTION_OPERATIVA_TECHNOLOGIES = [
  "React",
  "Tailwind CSS",
  "Node.js",
  "MySQL",
  "VPS Linux",
  "Nginx",
  "PM2",
].map(getProjectTechnology);

const XBOX_CARD_STUDIO_TECHNOLOGIES = [
  "React",
  "Vite",
  "Tailwind CSS",
  "Node.js",
  "Express.js",
  "Axios",
  "Nginx",
  "PM2",
].map(getProjectTechnology);

const SPOTIFY_WEB_PLAYER_TECHNOLOGIES = [
  "React",
  "Vite",
  "Tailwind CSS",
  "TypeScript",
  "Node.js",
].map(getProjectTechnology);

const PROJECT_GALLERY_IMAGES = [
  {
    alt: {
      en: "Project 1 preview",
      es: "Vista previa del proyecto 1",
    },
    badge: {
      en: "Fintech",
      es: "Fintech",
    },
    description: {
      en: "Web application in development for managing personal financial information from a private dashboard. Includes custom authentication, secure sessions, password recovery, multilingual support, and initial views for payments, calendar, statistics, and settings.",
      es: "Aplicación web en desarrollo para administrar información financiera personal desde un panel privado. Incluye autenticación propia, sesiones seguras, recuperación de contraseña, soporte multilenguaje y vistas iniciales para pagos, calendario, estadísticas y configuración.",
    },
    dominantColor: "52 58 62",
    cardWidth: "34rem",
    links: {
      github: "https://github.com/Ricardo-NM/KUENTAS",
    },
    mediaAspectRatio: "4 / 3",
    src: "/assets/projects/project1.svg",
    technologies: KUENTAS_TECHNOLOGIES,
    title: "KUENTAS",
  },
  {
    alt: {
      en: "Project 3 preview",
      es: "Vista previa del proyecto 3",
    },
    badge: {
      en: "Operations",
      es: "Operaciones",
    },
    description: {
      en: "Private system focused on centralizing operational, administrative, and document processes related to logistics management, reference tracking, document control, invoicing, reports, internal communication, and human resources activities.",
      es: "Sistema privado orientado a centralizar procesos operativos, administrativos y documentales relacionados con gestión logística, seguimiento de referencias, control de documentos, facturación, reportes, comunicación interna y actividades de recursos humanos.",
    },
    dominantColor: "56 145 213",
    cardWidth: "34rem",
    links: {
      github: "https://github.com/Ricardo-NM/K-PUGA-Docs",
      live: "https://ricardo-nm.github.io/K-PUGA-Docs/",
    },
    mediaAspectRatio: "16 / 9",
    src: "/assets/projects/ERPComercioExterior/Banner.png",
    technologies: GESTION_OPERATIVA_TECHNOLOGIES,
    title: "ERP para comercio exterior",
    videoSrc: "/assets/projects/ERPComercioExterior/Demo.webm",
  },
  {
    alt: {
      en: "Project 4 preview",
      es: "Vista previa del proyecto 4",
    },
    badge: {
      en: "Gaming",
      es: "Gaming",
    },
    description: {
      en: "Web tool created for the gaming community that lets you sync your Xbox profile and manually customize a player card with a premium aesthetic. Designed in a 9:16 format with dynamic gradients, custom badges, game metrics, and real statistics, crafted especially for sharing on social media.",
      es: "Herramienta web creada para la comunidad gamer que permite sincronizar tu perfil de Xbox y personalizar manualmente una tarjeta de jugador con estética premium. Diseñada con formato 9:16, degradados dinámicos, insignias personalizadas, métricas de juegos y estadísticas reales, diseñadas especialmente para compartir en redes sociales.",
    },
    dominantColor: "13 28 54",
    cardWidth: "30rem",
    links: {
      github: "https://github.com/Ricardo-NM/xbox-card-studio",
      live: "https://xcs.rnm.com.mx/",
    },
    mediaAspectRatio: "16 / 9",
    src: "/assets/projects/XboxCardStudio/Banner.png",
    technologies: XBOX_CARD_STUDIO_TECHNOLOGIES,
    title: "Xbox Card Studio",
    videoSrc: "/assets/projects/XboxCardStudio/Demo.webm",
  },
  {
    alt: {
      en: "Project 2 preview",
      es: "Vista previa del proyecto 2",
    },
    badge: {
      en: "Inventory",
      es: "Inventario",
    },
    description: {
      en: "Web system focused on the management and operational control of accounting fixed assets. Its purpose is to centralize information, facilitate internal requests, maintain movement traceability, and support the generation of documents related to assignments, retirements, returns, and transfers.",
      es: "Sistema web orientado a la gestión y control operativo de activos fijos contables. Su propósito es centralizar información, facilitar solicitudes internas, mantener trazabilidad de movimientos y apoyar la generación de documentos relacionados con asignaciones, bajas, devoluciones y traspasos.",
    },
    dominantColor: "135 169 19",
    cardWidth: "30rem",
    links: {
      github: "https://github.com/Ricardo-NM/totis-gdb-docs",
      live: "https://ricardo-nm.github.io/totis-gdb-docs/",
    },
    mediaAspectRatio: "4 / 3",
    src: "/assets/projects/project3.svg",
    technologies: TOTIS_TECHNOLOGIES,
    title: "Totis® | Gestión de bienes",
  },
  {
    alt: {
      en: "Spotify Web Player preview",
      es: "Vista previa de Spotify Web Player",
    },
    badge: {
      en: "Music",
      es: "Música",
    },
    description: {
      en: "Web music player widget. The project recreates a player-style experience with a song carousel, playback queue, favorites, volume controls, shuffle, and animated transitions.\n\nThe app queries the Spotify Web API through a local proxy, automatically completes cover art, artists, title, album, and duration, and calculates dynamic colors from each song cover.",
      es: "Widget web de reproductor musical. El proyecto recrea una experiencia tipo player con carrusel de canciones, cola de reproducción, favoritos, controles de volumen, shuffle y transiciones animadas.\n\nLa app consulta Spotify Web API desde un proxy local, completa automáticamente portada, artistas, título, álbum y duración, y calcula colores dinámicos desde la portada de cada canción.",
    },
    dominantColor: "30 215 96",
    cardWidth: "34rem",
    links: {
      github: "https://github.com/Ricardo-NM/SpotifyWebPlayer",
    },
    mediaAspectRatio: "16 / 9",
    src: "/assets/projects/SpotifyWebPlayer/Banner.png",
    technologies: SPOTIFY_WEB_PLAYER_TECHNOLOGIES,
    title: "Spotify Web Player",
    videoSrc: "/assets/projects/SpotifyWebPlayer/Demo.webm",
  },
] as const;

const HomeProjectGallery = forwardRef<HTMLDivElement, HomeProjectGalleryProps>(
  ({ locale, onFirstProjectEntryStart, revealDelay }, ref) => {
    const [isRevealReady, setIsRevealReady] = useState(revealDelay === 0);
    const [selectedProjectIndex, setSelectedProjectIndex] = useState<
      number | null
    >(null);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [isSmallViewport, setIsSmallViewport] = useState(false);
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const [interactiveItems, setInteractiveItems] = useState<Set<number>>(
      new Set(),
    );
    const itemRefs = useRef<Array<HTMLElement | null>>([]);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const hasNotifiedFirstProjectEntryStartRef = useRef(false);
    const revealTimersRef = useRef<number[]>([]);
    const interactionTimersRef = useRef<number[]>([]);
    const selectedProject =
      selectedProjectIndex === null
        ? null
        : PROJECT_GALLERY_IMAGES[selectedProjectIndex];
    const firstProjectRowSize = Math.min(3, PROJECT_GALLERY_IMAGES.length);
    const isFirstProjectRowVisible = PROJECT_GALLERY_IMAGES.slice(
      0,
      firstProjectRowSize,
    ).every((_, index) => visibleItems.has(index));
    useEffect(() => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const updateMotionPreference = () => {
        setPrefersReducedMotion(mediaQuery.matches);
      };

      updateMotionPreference();
      mediaQuery.addEventListener("change", updateMotionPreference);

      return () => {
        mediaQuery.removeEventListener("change", updateMotionPreference);
      };
    }, []);

    useEffect(() => {
      const mediaQuery = window.matchMedia("(max-width: 820px)");
      const updateViewportSize = () => {
        setIsSmallViewport(mediaQuery.matches);
      };

      updateViewportSize();
      mediaQuery.addEventListener("change", updateViewportSize);

      return () => {
        mediaQuery.removeEventListener("change", updateViewportSize);
      };
    }, []);

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
        const allProjectIndexes = new Set(
          PROJECT_GALLERY_IMAGES.map((_, index) => index),
        );

        setVisibleItems(allProjectIndexes);
        setInteractiveItems(allProjectIndexes);
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
                if (
                  index === 0 &&
                  !hasNotifiedFirstProjectEntryStartRef.current
                ) {
                  hasNotifiedFirstProjectEntryStartRef.current = true;
                  onFirstProjectEntryStart?.();
                }

                setVisibleItems((current) => {
                  const next = new Set(current);

                  next.add(index);

                  return next;
                });

                const interactionDelay =
                  PROJECT_GALLERY_ITEM_ENTRY_MS +
                  index * PROJECT_GALLERY_ITEM_STAGGER_MS +
                  PROJECT_GALLERY_INTERACTION_BUFFER_MS;

                const interactionTimer = window.setTimeout(() => {
                  setInteractiveItems((current) => {
                    const next = new Set(current);

                    next.add(index);

                    return next;
                  });
                }, interactionDelay);

                interactionTimersRef.current.push(interactionTimer);
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
        interactionTimersRef.current.forEach((timer) => {
          window.clearTimeout(timer);
        });
        revealTimersRef.current = [];
        interactionTimersRef.current = [];
      };
    }, [isRevealReady]);

    useEffect(() => {
      if (!selectedProject) {
        return;
      }

      closeButtonRef.current?.focus({ preventScroll: true });
      const previousHtmlOverflow = document.documentElement.style.overflow;
      const previousBodyOverflow = document.body.style.overflow;

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setSelectedProjectIndex(null);
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.documentElement.style.overflow = previousHtmlOverflow;
        document.body.style.overflow = previousBodyOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [selectedProject]);

    return (
      <>
        <div className="intro-tooling home-project-gallery-shell" ref={ref}>
          {isRevealReady && (
            <HomeProjectGalleryTitle
              hint={PROJECT_GALLERY_HINT[locale]}
              hintVisible={isFirstProjectRowVisible}
              id="home-project-gallery-title"
              text={PROJECT_GALLERY_TITLE[locale]}
            />
          )}

          <div
            className="home-project-gallery"
            aria-labelledby="home-project-gallery-title"
            aria-label={
              locale === "es" ? "Galería de proyectos" : "Project gallery"
            }
            data-reveal-ready={isRevealReady}
          >
            {PROJECT_GALLERY_IMAGES.map((project, index) => {
              const isProjectVisible = visibleItems.has(index);
              const isProjectInteractive = interactiveItems.has(index);

              return (
                <figure
                  className="home-project-gallery-item"
                  data-project-index={index}
                  data-visible={isProjectVisible}
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
                  <button
                    className="home-project-gallery-trigger"
                    type="button"
                    onClick={() => {
                      if (!isProjectInteractive) {
                        return;
                      }

                      setSelectedProjectIndex(index);
                    }}
                    aria-label={
                      locale === "es"
                        ? `Ver detalle de ${project.title}`
                        : `View ${project.title} details`
                    }
                    data-interactive={isProjectInteractive}
                    disabled={!isProjectInteractive}
                  >
                    <HomeProjectMedia
                      alt={project.alt[locale]}
                      imageSrc={project.src}
                      isVideoEnabled={
                        !selectedProject &&
                        isProjectVisible &&
                        !prefersReducedMotion &&
                        !isSmallViewport
                      }
                      loading={index === 0 ? "eager" : "lazy"}
                      playback="hover"
                      videoSrc={
                        "videoSrc" in project ? project.videoSrc : undefined
                      }
                    />
                  </button>
                </figure>
              );
            })}
          </div>
        </div>

        {selectedProject && (
          <div
            className="home-project-card-backdrop"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedProjectIndex(null);
              }
            }}
            style={
              {
                "--project-accent": selectedProject.dominantColor,
                "--project-card-width": selectedProject.cardWidth,
                "--project-media-aspect-ratio":
                  selectedProject.mediaAspectRatio,
              } as CSSProperties
            }
          >
            <article
              className="home-project-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="home-project-card-title"
            >
              <button
                className="home-project-card-close"
                type="button"
                onClick={() => setSelectedProjectIndex(null)}
                aria-label={
                  locale === "es" ? "Cerrar proyecto" : "Close project"
                }
                ref={closeButtonRef}
              >
                <XIcon aria-hidden="true" size={15} strokeWidth={1.8} />
              </button>

              <div className="home-project-card-media">
                <HomeProjectMedia
                  alt={selectedProject.alt[locale]}
                  imageSrc={selectedProject.src}
                  isVideoEnabled={!prefersReducedMotion}
                  loading="eager"
                  videoSrc={
                    "videoSrc" in selectedProject
                      ? selectedProject.videoSrc
                      : undefined
                  }
                />
              </div>

              <div className="home-project-card-body">
                <div className="home-project-card-heading">
                  <h2 id="home-project-card-title">{selectedProject.title}</h2>
                  <div
                    className="home-project-card-actions"
                    aria-label={
                      locale === "es" ? "Enlaces del proyecto" : "Project links"
                    }
                  >
                    <a
                      className="home-project-card-action"
                      href={selectedProject.links.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={
                        locale === "es"
                          ? `Abrir GitHub de ${selectedProject.title}`
                          : `Open ${selectedProject.title} GitHub`
                      }
                    >
                      <span
                        className="home-project-card-action-icon home-project-card-action-icon-github"
                        aria-hidden="true"
                      />
                    </a>
                    {"live" in selectedProject.links && (
                      <a
                        className="home-project-card-action"
                        href={selectedProject.links.live}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={
                          locale === "es"
                            ? `Abrir proyecto ${selectedProject.title}`
                            : `Open ${selectedProject.title} project`
                        }
                      >
                        <ExternalLinkIcon
                          aria-hidden="true"
                          size={23}
                          strokeWidth={1.9}
                        />
                      </a>
                    )}
                  </div>
                </div>

                {selectedProject.description[locale]
                  .split("\n\n")
                  .map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}

                <HomeProjectTechnologies
                  label={
                    locale === "es"
                      ? `Tecnologías utilizadas en ${selectedProject.title}`
                      : `Technologies used in ${selectedProject.title}`
                  }
                  technologies={selectedProject.technologies}
                />
              </div>
            </article>
          </div>
        )}
      </>
    );
  },
);

HomeProjectGallery.displayName = "HomeProjectGallery";

export default HomeProjectGallery;
