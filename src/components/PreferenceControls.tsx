import {
  ChevronDown,
  FolderCode,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Moon,
  Settings,
  Sun,
  X,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import bannerUrl from "../assets/banner.webp";

type Theme = "light" | "dark";
type Locale = "es" | "en";
type ProfileLinkId = "linkedin" | "github" | "resume";
type FlipAvatar = {
  deltaX: number;
  deltaY: number;
  endRadius: string;
  scaleX: number;
  scaleY: number;
  startRadius: string;
  targetLeft: number;
  targetTop: number;
  targetWidth: number;
  targetHeight: number;
};
type FlipProfileLink = FlipAvatar & {
  id: ProfileLinkId;
};

const STORAGE_KEYS = {
  theme: "rn-theme",
  locale: "rn-locale",
} as const;

const copy = {
  es: {
    introHighlight: "Desarrollador Full Stack",
    introRest:
      " especializado en la creación de sistemas digitales, plataformas administrativas y aplicaciones web y móviles. Cuento con experiencia en el análisis, diseño, desarrollo, despliegue y optimización de soluciones funcionales, escalables y bien estructuradas, utilizando distintas herramientas y tecnologías para resolver problemas técnicos y participar en todo el ciclo de desarrollo de software.",
    profileAlt: "Foto de perfil de Ricardo Nava",
    profileHint: "Presiona aqui",
    openProfileLabel: "Abrir panel de perfil",
    closeProfileLabel: "Cerrar panel de perfil",
    profileMenuTitle: "Perfil",
    profileEmail: "lic.ricardo.nm@gmail.com",
    profileLocation: "México",
    profileAboutTitle: "Acerca de",
    profileAbout:
      "Construyo sistemas digitales, plataformas administrativas y aplicaciones web y móviles con enfoque en funcionalidad, estructura, escalabilidad y experiencia de usuario.",
    profileFocusTitle: "Áreas de enfoque",
    focusMobile: "Aplicaciones móviles",
    linkedinLabel: "Abrir perfil de LinkedIn",
    githubLabel: "Abrir perfil de GitHub",
    resumeLabel: "Descargar CV",
    preferencesLabel: "Preferencias del sitio",
    openSettingsLabel: "Abrir preferencias",
    closeSettingsLabel: "Cerrar preferencias",
    languageLabel: "Cambiar idioma a inglés",
    languageText: "ES",
    lightThemeLabel: "Cambiar a tema oscuro",
    darkThemeLabel: "Cambiar a tema claro",
    lightThemeText: "Claro",
    darkThemeText: "Oscuro",
  },
  en: {
    introHighlight: "Full Stack Developer",
    introRest:
      " specialized in building digital systems, administrative platforms, and web and mobile applications. I have experience in the analysis, design, development, deployment, and optimization of functional, scalable, and well-structured solutions, using different tools and technologies to solve technical problems and participate in the full software development lifecycle.",
    profileAlt: "Ricardo Nava profile photo",
    profileHint: "Press here",
    openProfileLabel: "Open profile panel",
    closeProfileLabel: "Close profile panel",
    profileMenuTitle: "Profile",
    profileEmail: "lic.ricardo.nm@gmail.com",
    profileLocation: "Mexico",
    profileAboutTitle: "About",
    profileAbout:
      "I build digital systems, administrative platforms, and web and mobile applications with a focus on functionality, structure, scalability, and user experience.",
    linkedinLabel: "Open LinkedIn profile",
    githubLabel: "Open GitHub profile",
    resumeLabel: "Download resume",
    preferencesLabel: "Site preferences",
    openSettingsLabel: "Open preferences",
    closeSettingsLabel: "Close preferences",
    languageLabel: "Switch language to Spanish",
    languageText: "EN",
    lightThemeLabel: "Switch to dark theme",
    darkThemeLabel: "Switch to light theme",
    lightThemeText: "Light",
    darkThemeText: "Dark",
  },
} as const;

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEYS.theme);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "es";
  }

  return window.localStorage.getItem(STORAGE_KEYS.locale) === "en"
    ? "en"
    : "es";
}

export default function PreferenceControls() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [flipAvatar, setFlipAvatar] = useState<FlipAvatar | null>(null);
  const [flipProfileLinks, setFlipProfileLinks] = useState<FlipProfileLink[]>(
    [],
  );
  const closeTimerRef = useRef<number | undefined>(undefined);
  const flipTimerRef = useRef<number | undefined>(undefined);
  const drawerAvatarRef = useRef<HTMLDivElement>(null);
  const drawerLinkRefs = useRef<
    Record<ProfileLinkId, HTMLAnchorElement | null>
  >({
    linkedin: null,
    github: null,
    resume: null,
  });
  const drawerLinkMeasureRefs = useRef<
    Record<ProfileLinkId, HTMLAnchorElement | null>
  >({
    linkedin: null,
    github: null,
    resume: null,
  });
  const mainLinkRefs = useRef<Record<ProfileLinkId, HTMLAnchorElement | null>>({
    linkedin: null,
    github: null,
    resume: null,
  });
  const profilePictureRef = useRef<HTMLButtonElement>(null);
  const drawerAvatarMeasureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEYS.locale, locale);
  }, [locale]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }

      if (flipTimerRef.current) {
        window.clearTimeout(flipTimerRef.current);
      }
    };
  }, []);

  const nextTheme = theme === "light" ? "dark" : "light";
  const nextLocale = locale === "es" ? "en" : "es";
  const labels = copy[locale];
  const themeLabel =
    theme === "light" ? labels.lightThemeLabel : labels.darkThemeLabel;
  const themeText =
    theme === "light" ? labels.lightThemeText : labels.darkThemeText;
  const profileAbout =
    locale === "es"
      ? "Apasionado por la tecnología y el desarrollo de soluciones, con pensamiento lógico y analítico para resolver problemas complejos. Me especializo en integrar diversas herramientas y tecnologías para crear soluciones eficientes, escalables y orientadas a aportar valor."
      : "Passionate about technology and solution development, with logical and analytical thinking to solve complex problems. I specialize in integrating diverse tools and technologies to create efficient, scalable solutions focused on delivering value.";
  const databaseBadge = locale === "es" ? "Bases de datos" : "Databases";
  const workExperienceTitle =
    locale === "es" ? "Experiencia laboral" : "Work experience";
  const workExperienceItems =
    locale === "es"
      ? [
          {
            logo: "/assets/experience-one.png",
            role: "Desarrollador Full Stack",
            company: "ArdabyTec",
            date: "Mayo 2025 - Diciembre 2025",
          },
          {
            logo: "/assets/experience-second.png",
            role: "Desarrollador Full Stack",
            company: "K-PUGA S.A. de C.V",
            date: "Enero 2026 - Junio 2026",
          },
        ]
      : [
          {
            logo: "/assets/experience-one.png",
            role: "Full Stack Developer",
            company: "ArdabyTec",
            date: "May 2025 - December 2025",
          },
          {
            logo: "/assets/experience-second.png",
            role: "Full Stack Developer",
            company: "K-PUGA S.A. de C.V",
            date: "January 2026 - June 2026",
          },
        ];
  const educationText =
    locale === "es"
      ? "Licenciatura en Ciencias Computacionales"
      : "Bachelor's Degree in Computer Science";
  const projectsText =
    locale === "es" ? "+10 Proyectos desarrollados" : "+10 Projects developed";
  const profileLocation =
    locale === "es" ? "Hidalgo, México" : "Hidalgo, Mexico";
  const profileEmail = "lic.ricardo.nm@gmail.com";
  const settingsLabel = isPreferencesOpen
    ? labels.closeSettingsLabel
    : labels.openSettingsLabel;
  const openPreferences = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }

    setIsPreferencesOpen(true);
  };
  const queueClosePreferences = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      setIsPreferencesOpen(false);
      closeTimerRef.current = undefined;
    }, 140);
  };
  const togglePreferences = () => {
    if (window.matchMedia("(hover: hover)").matches) {
      openPreferences();
      return;
    }

    setIsPreferencesOpen((current) => !current);
  };
  const queueFlipCleanup = () => {
    if (flipTimerRef.current) {
      window.clearTimeout(flipTimerRef.current);
    }

    flipTimerRef.current = window.setTimeout(() => {
      setFlipAvatar(null);
      setFlipProfileLinks([]);
      flipTimerRef.current = undefined;
    }, 620);
  };
  const playAvatarFlip = (
    sourceRect: DOMRect,
    targetRect: DOMRect,
    startRadius: string,
    endRadius: string,
  ) => {
    setFlipAvatar({
      deltaX: sourceRect.left - targetRect.left,
      deltaY: sourceRect.top - targetRect.top,
      endRadius,
      scaleX: sourceRect.width / targetRect.width,
      scaleY: sourceRect.height / targetRect.height,
      startRadius,
      targetLeft: targetRect.left,
      targetTop: targetRect.top,
      targetWidth: targetRect.width,
      targetHeight: targetRect.height,
    });

    queueFlipCleanup();
  };
  const playProfileLinkFlips = (
    sourceRefs: Record<ProfileLinkId, HTMLAnchorElement | null>,
    targetRefs: Record<ProfileLinkId, HTMLAnchorElement | null>,
  ) => {
    const nextFlips = (Object.keys(sourceRefs) as ProfileLinkId[]).flatMap(
      (id) => {
        const sourceRect = sourceRefs[id]?.getBoundingClientRect();
        const targetRect = targetRefs[id]?.getBoundingClientRect();

        if (!sourceRect || !targetRect) {
          return [];
        }

        return [
          {
            id,
            deltaX: sourceRect.left - targetRect.left,
            deltaY: sourceRect.top - targetRect.top,
            endRadius: "999px",
            scaleX: sourceRect.width / targetRect.width,
            scaleY: sourceRect.height / targetRect.height,
            startRadius: "999px",
            targetLeft: targetRect.left,
            targetTop: targetRect.top,
            targetWidth: targetRect.width,
            targetHeight: targetRect.height,
          },
        ];
      },
    );

    setFlipProfileLinks(nextFlips);
    queueFlipCleanup();
  };
  const openProfileMenu = () => {
    const sourceRect = profilePictureRef.current?.getBoundingClientRect();
    const targetRect = drawerAvatarMeasureRef.current?.getBoundingClientRect();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    setIsProfileMenuOpen(true);

    if (!sourceRect || !targetRect || prefersReducedMotion) {
      return;
    }

    playAvatarFlip(sourceRect, targetRect, "0.75rem", "999px");
    playProfileLinkFlips(mainLinkRefs.current, drawerLinkMeasureRefs.current);
  };
  const closeProfileMenu = () => {
    const sourceRect = drawerAvatarRef.current?.getBoundingClientRect();
    const targetRect = profilePictureRef.current?.getBoundingClientRect();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (sourceRect && targetRect && !prefersReducedMotion) {
      playAvatarFlip(sourceRect, targetRect, "999px", "0.75rem");
      playProfileLinkFlips(drawerLinkRefs.current, mainLinkRefs.current);
    } else {
      setFlipAvatar(null);
      setFlipProfileLinks([]);
    }

    setIsProfileMenuOpen(false);
  };
  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeProfileMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileMenuOpen, closeProfileMenu]);
  const flipAvatarStyle =
    flipAvatar &&
    ({
      "--flip-delta-x": `${flipAvatar.deltaX}px`,
      "--flip-delta-y": `${flipAvatar.deltaY}px`,
      "--flip-end-radius": flipAvatar.endRadius,
      "--flip-scale-x": flipAvatar.scaleX,
      "--flip-scale-y": flipAvatar.scaleY,
      "--flip-start-radius": flipAvatar.startRadius,
      "--flip-target-left": `${flipAvatar.targetLeft}px`,
      "--flip-target-top": `${flipAvatar.targetTop}px`,
      "--flip-target-width": `${flipAvatar.targetWidth}px`,
      "--flip-target-height": `${flipAvatar.targetHeight}px`,
    } as CSSProperties);
  const flipProfileLinkStyles = flipProfileLinks.map(
    (link) =>
      ({
        id: link.id,
        style: {
          "--flip-delta-x": `${link.deltaX}px`,
          "--flip-delta-y": `${link.deltaY}px`,
          "--flip-end-radius": link.endRadius,
          "--flip-scale-x": link.scaleX,
          "--flip-scale-y": link.scaleY,
          "--flip-start-radius": link.startRadius,
          "--flip-target-left": `${link.targetLeft}px`,
          "--flip-target-top": `${link.targetTop}px`,
          "--flip-target-width": `${link.targetWidth}px`,
          "--flip-target-height": `${link.targetHeight}px`,
        } as CSSProperties,
      }) satisfies { id: ProfileLinkId; style: CSSProperties },
  );
  const renderProfileLinkIcon = (id: ProfileLinkId) => {
    if (id === "resume") {
      return (
        <svg
          className="profile-link-svg"
          aria-hidden="true"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="currentColor"
        >
          <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2v9.255S12 12 8 12s-5 1.755-5 1.755V2a1 1 0 0 1 1-1h5.5z" />
        </svg>
      );
    }

    return (
      <span
        className={`profile-link-icon profile-link-icon-${id}`}
        aria-hidden="true"
      />
    );
  };

  return (
    <>
      <div className="intro-layout">
        <div className="profile-media">
          <p
            className="profile-hint"
            data-hidden={isProfileMenuOpen || Boolean(flipAvatar)}
          >
            <span>{labels.profileHint}</span>
            <ChevronDown aria-hidden="true" size={15} strokeWidth={1.8} />
          </p>

          <button
            className="profile-picture-frame profile-picture-button"
            type="button"
            ref={profilePictureRef}
            onClick={openProfileMenu}
            aria-label={labels.openProfileLabel}
            data-hidden={isProfileMenuOpen || Boolean(flipAvatar)}
          >
            <img
              src="/assets/profilePicture.jpeg"
              alt={labels.profileAlt}
              className="profile-picture"
              loading="eager"
            />
          </button>

          <div
            className="profile-links"
            aria-label={locale === "es" ? "Enlaces de perfil" : "Profile links"}
          >
            <a
              className="profile-link"
              href="https://www.linkedin.com/in/ricardo-nava-mayoral/"
              target="_blank"
              rel="noreferrer"
              aria-label={labels.linkedinLabel}
              ref={(element) => {
                mainLinkRefs.current.linkedin = element;
              }}
              data-hidden={isProfileMenuOpen || flipProfileLinks.length > 0}
            >
              {renderProfileLinkIcon("linkedin")}
            </a>

            <a
              className="profile-link"
              href="https://github.com/Ricardo-NM"
              target="_blank"
              rel="noreferrer"
              aria-label={labels.githubLabel}
              ref={(element) => {
                mainLinkRefs.current.github = element;
              }}
              data-hidden={isProfileMenuOpen || flipProfileLinks.length > 0}
            >
              {renderProfileLinkIcon("github")}
            </a>

            <a
              className="profile-link"
              href="/assets/CV_Ricardo_Nava_Mayoral.pdf"
              download
              aria-label={labels.resumeLabel}
              ref={(element) => {
                mainLinkRefs.current.resume = element;
              }}
              data-hidden={isProfileMenuOpen || flipProfileLinks.length > 0}
            >
              {renderProfileLinkIcon("resume")}
            </a>
          </div>
        </div>

        <p className="intro-copy">
          <strong>{labels.introHighlight}</strong>
          {labels.introRest}
        </p>
      </div>

      <div className="profile-drawer-measure" aria-hidden="true">
        <div className="profile-drawer-header">
          <h2>{labels.profileMenuTitle}</h2>
          <span className="profile-drawer-close" />
        </div>
        <div className="profile-drawer-cover">
          <img src={bannerUrl.src} alt="" aria-hidden="true" />
        </div>
        <div className="profile-drawer-identity">
          <div className="profile-drawer-avatar" ref={drawerAvatarMeasureRef}>
            <img
              src="/assets/profilePicture.jpeg"
              alt=""
              className="profile-picture"
            />
          </div>
        </div>
        <div className="profile-drawer-name-row">
          <h3>Ricardo Nava Mayoral</h3>
          <span />
        </div>
        <p className="profile-drawer-role">
          <Mail aria-hidden="true" size={16} strokeWidth={1.8} />
          <span>{profileEmail}</span>
        </p>
        <div className="profile-drawer-tags">
          <span>Full Stack</span>
          <span>Web</span>
          <span>Mobile</span>
          <span>UI/UX</span>
          <span>{databaseBadge}</span>
        </div>
        <div className="profile-links profile-drawer-links">
          <a
            className="profile-link"
            href="https://www.linkedin.com/in/ricardo-nava-mayoral/"
            ref={(element) => {
              drawerLinkMeasureRefs.current.linkedin = element;
            }}
          >
            {renderProfileLinkIcon("linkedin")}
          </a>

          <a
            className="profile-link"
            href="https://github.com/Ricardo-NM"
            ref={(element) => {
              drawerLinkMeasureRefs.current.github = element;
            }}
          >
            {renderProfileLinkIcon("github")}
          </a>

          <a
            className="profile-link"
            href="/assets/CV_Ricardo_Nava_Mayoral.pdf"
            ref={(element) => {
              drawerLinkMeasureRefs.current.resume = element;
            }}
          >
            {renderProfileLinkIcon("resume")}
          </a>
        </div>
      </div>

      {flipAvatarStyle && (
        <div className="flip-avatar" style={flipAvatarStyle} aria-hidden="true">
          <img
            src="/assets/profilePicture.jpeg"
            alt=""
            className="profile-picture"
          />
        </div>
      )}

      {flipProfileLinkStyles.map((link) => (
        <span
          className="flip-profile-link"
          style={link.style}
          aria-hidden="true"
          key={link.id}
        >
          {renderProfileLinkIcon(link.id)}
        </span>
      ))}

      <aside
        className="profile-drawer-shell"
        data-open={isProfileMenuOpen}
        aria-hidden={!isProfileMenuOpen}
        inert={!isProfileMenuOpen}
      >
        <button
          className="profile-drawer-backdrop"
          type="button"
          onClick={closeProfileMenu}
          tabIndex={-1}
          aria-label={labels.closeProfileLabel}
        />

        <section
          className="profile-drawer"
          aria-label={labels.profileMenuTitle}
        >
          <div className="profile-drawer-header">
            <h2>{labels.profileMenuTitle}</h2>
            <button
              className="profile-drawer-close"
              type="button"
              onClick={closeProfileMenu}
              aria-label={labels.closeProfileLabel}
            >
              <X aria-hidden="true" size={18} strokeWidth={1.8} />
            </button>
          </div>

          <div className="profile-drawer-cover">
            <img src={bannerUrl.src} alt="" aria-hidden="true" />
          </div>

          <div className="profile-drawer-identity">
            <div
              className="profile-drawer-avatar"
              ref={drawerAvatarRef}
              data-flip-active={Boolean(flipAvatar)}
            >
              <img
                src="/assets/profilePicture.jpeg"
                alt={labels.profileAlt}
                className="profile-picture"
              />
            </div>
            <span className="profile-drawer-check" aria-hidden="true">
              ✓
            </span>
          </div>

          <div className="profile-drawer-name-row">
            <h3>Ricardo Nava Mayoral</h3>
            <span aria-hidden="true" />
          </div>
          <p className="profile-drawer-role">
            <Mail aria-hidden="true" size={16} strokeWidth={1.8} />
            <span>{profileEmail}</span>
          </p>
          <div
            className="profile-drawer-tags"
            aria-label={locale === "es" ? "Especialidades" : "Specialties"}
          >
            <span>Full Stack</span>
            <span>Web</span>
            <span>Mobile</span>
            <span>UI/UX</span>
            <span>{databaseBadge}</span>
          </div>

          <div
            className="profile-links profile-drawer-links"
            aria-label={locale === "es" ? "Enlaces de perfil" : "Profile links"}
          >
            <a
              className="profile-link"
              href="https://www.linkedin.com/in/ricardo-nava-mayoral/"
              target="_blank"
              rel="noreferrer"
              aria-label={labels.linkedinLabel}
              ref={(element) => {
                drawerLinkRefs.current.linkedin = element;
              }}
              data-hidden={Boolean(flipProfileLinks.length)}
            >
              {renderProfileLinkIcon("linkedin")}
            </a>

            <a
              className="profile-link"
              href="https://github.com/Ricardo-NM"
              target="_blank"
              rel="noreferrer"
              aria-label={labels.githubLabel}
              ref={(element) => {
                drawerLinkRefs.current.github = element;
              }}
              data-hidden={Boolean(flipProfileLinks.length)}
            >
              {renderProfileLinkIcon("github")}
            </a>

            <a
              className="profile-link"
              href="/assets/CV_Ricardo_Nava_Mayoral.pdf"
              download
              aria-label={labels.resumeLabel}
              ref={(element) => {
                drawerLinkRefs.current.resume = element;
              }}
              data-hidden={Boolean(flipProfileLinks.length)}
            >
              {renderProfileLinkIcon("resume")}
            </a>
          </div>

          <div className="profile-drawer-section">
            <h4>{labels.profileAboutTitle}</h4>
            <p>{profileAbout}</p>
          </div>

          <div className="profile-drawer-meta">
            <span>
              <GraduationCap aria-hidden="true" size={16} strokeWidth={1.8} />
              {educationText}
            </span>
            <span>
              <MapPin aria-hidden="true" size={16} strokeWidth={1.8} />
              {profileLocation}
            </span>
            <span>
              <FolderCode aria-hidden="true" size={16} strokeWidth={1.8} />
              {projectsText}
            </span>
          </div>

          <div className="profile-drawer-section profile-work">
            <h4>{workExperienceTitle}</h4>
            <div className="profile-work-list">
              {workExperienceItems.map((item) => (
                <article className="profile-work-item" key={item.company}>
                  <span className="profile-work-badge" aria-hidden="true">
                    <img src={item.logo} alt="" loading="lazy" />
                  </span>
                  <div className="profile-work-content">
                    <h5>{item.role}</h5>
                    <p className="profile-work-company">{item.company}</p>
                    <p className="profile-work-date">{item.date}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </aside>

      <div
        className="preferences-float"
        onMouseLeave={queueClosePreferences}
        onFocus={openPreferences}
        onBlur={(event) => {
          const nextFocusedElement = event.relatedTarget;

          if (
            !(nextFocusedElement instanceof Node) ||
            !event.currentTarget.contains(nextFocusedElement)
          ) {
            setIsPreferencesOpen(false);
          }
        }}
      >
        <button
          className="settings-button"
          type="button"
          onMouseEnter={openPreferences}
          onClick={togglePreferences}
          aria-controls="site-preferences"
          aria-expanded={isPreferencesOpen}
          aria-label={settingsLabel}
          data-open={isPreferencesOpen}
        >
          <Settings aria-hidden="true" size={26} strokeWidth={1.75} />
        </button>

        <div
          className="preference-controls"
          id="site-preferences"
          aria-label={labels.preferencesLabel}
          aria-hidden={!isPreferencesOpen}
          data-open={isPreferencesOpen}
          onMouseEnter={openPreferences}
        >
          <button
            className="preference-button"
            type="button"
            tabIndex={isPreferencesOpen ? 0 : -1}
            onClick={() => setLocale(nextLocale)}
            aria-label={labels.languageLabel}
          >
            <Languages aria-hidden="true" size={16} strokeWidth={1.8} />
            <span>{labels.languageText}</span>
          </button>

          <button
            className="preference-button"
            type="button"
            tabIndex={isPreferencesOpen ? 0 : -1}
            onClick={() => setTheme(nextTheme)}
            aria-label={themeLabel}
          >
            {theme === "light" ? (
              <Sun aria-hidden="true" size={16} strokeWidth={1.8} />
            ) : (
              <Moon aria-hidden="true" size={16} strokeWidth={1.8} />
            )}
            <span>{themeText}</span>
          </button>
        </div>
      </div>
    </>
  );
}
