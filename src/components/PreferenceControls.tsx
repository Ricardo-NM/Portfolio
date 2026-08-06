import { Languages, Moon, Settings, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";
type Locale = "es" | "en";

const STORAGE_KEYS = {
  theme: "rn-theme",
  locale: "rn-locale"
} as const;

const copy = {
  es: {
    introHighlight: "Desarrollador Full Stack",
    introRest:
      " especializado en la creación de sistemas digitales, plataformas administrativas y aplicaciones web y móviles. Cuento con experiencia en el análisis, diseño, desarrollo, despliegue y optimización de soluciones funcionales, escalables y bien estructuradas, utilizando distintas herramientas y tecnologías para resolver problemas técnicos y participar en todo el ciclo de desarrollo de software.",
    profileAlt: "Foto de perfil de Ricardo Nava",
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
    darkThemeText: "Oscuro"
  },
  en: {
    introHighlight: "Full Stack Developer",
    introRest:
      " specialized in building digital systems, administrative platforms, and web and mobile applications. I have experience in the analysis, design, development, deployment, and optimization of functional, scalable, and well-structured solutions, using different tools and technologies to solve technical problems and participate in the full software development lifecycle.",
    profileAlt: "Ricardo Nava profile photo",
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
    darkThemeText: "Dark"
  }
} as const;

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEYS.theme);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "es";
  }

  return window.localStorage.getItem(STORAGE_KEYS.locale) === "en" ? "en" : "es";
}

export default function PreferenceControls() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const closeTimerRef = useRef<number | undefined>(undefined);

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
    };
  }, []);

  const nextTheme = theme === "light" ? "dark" : "light";
  const nextLocale = locale === "es" ? "en" : "es";
  const labels = copy[locale];
  const themeLabel = theme === "light" ? labels.lightThemeLabel : labels.darkThemeLabel;
  const themeText = theme === "light" ? labels.lightThemeText : labels.darkThemeText;
  const settingsLabel = isPreferencesOpen ? labels.closeSettingsLabel : labels.openSettingsLabel;
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

  return (
    <>
      <div className="intro-layout">
        <div className="profile-media">
          <div className="profile-picture-frame">
            <img src="/assets/profilePicture.jpeg" alt={labels.profileAlt} className="profile-picture" loading="eager" />
          </div>

          <div className="profile-links" aria-label={locale === "es" ? "Enlaces de perfil" : "Profile links"}>
            <a
              className="profile-link"
              href="https://www.linkedin.com/in/ricardo-nava-mayoral/"
              target="_blank"
              rel="noreferrer"
              aria-label={labels.linkedinLabel}
            >
              <span className="profile-link-icon profile-link-icon-linkedin" aria-hidden="true" />
            </a>

            <a
              className="profile-link"
              href="https://github.com/Ricardo-NM"
              target="_blank"
              rel="noreferrer"
              aria-label={labels.githubLabel}
            >
              <span className="profile-link-icon profile-link-icon-github" aria-hidden="true" />
            </a>

            <a
              className="profile-link"
              href="/assets/CV_Ricardo_Nava_Mayoral.pdf"
              download
              aria-label={labels.resumeLabel}
            >
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
            </a>
          </div>
        </div>

        <p className="intro-copy">
          <strong>{labels.introHighlight}</strong>
          {labels.introRest}
        </p>
      </div>

      <div
        className="preferences-float"
        onMouseLeave={queueClosePreferences}
        onFocus={openPreferences}
        onBlur={(event) => {
          const nextFocusedElement = event.relatedTarget;

          if (!(nextFocusedElement instanceof Node) || !event.currentTarget.contains(nextFocusedElement)) {
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
