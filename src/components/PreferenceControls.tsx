import {
  BriefcaseBusiness,
  ChevronDown,
  CodeXml,
  FolderCode,
  FolderGit2,
  GraduationCap,
  Home,
  Languages,
  Mail,
  MapPin,
  MessageSquareText,
  Moon,
  Settings,
  Sun,
  X,
} from "lucide-react";
import type {
  CSSProperties,
  FocusEvent as ReactFocusEvent,
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  Ref,
} from "react";
import { useEffect, useRef, useState } from "react";
import bannerUrl from "../assets/banner.webp";
import RouteBreadcrumb from "./RouteBreadcrumb";

type Theme = "light" | "dark";
type Locale = "es" | "en";
type ProfileLinkId = "linkedin" | "github" | "resume";
type RouteLinkId = "experience" | "technologies" | "activity" | "contact";
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
type FlipRouteLink = FlipAvatar & {
  id: RouteLinkId;
  iconSize: number;
};
type FlipIntroCopy = FlipAvatar & {
  variant: "drawer" | "intro";
};
type ContributionDay = {
  contributionCount: number;
  date: string;
  weekday: number;
};
type ContributionWeek = {
  contributionDays: ContributionDay[];
};
type GitHubContributions = {
  totalContributions: number;
  weeks: ContributionWeek[];
};
type GitHubContributionsStatus = "idle" | "loading" | "error";
type GitHubContributionTooltip = {
  left: number;
  text: string;
  top: number;
};
type PreferenceControlsMode =
  | "chrome"
  | "home"
  | "preferences"
  | "technologies"
  | "activity"
  | "contact";
type PreferenceControlsProps = {
  mode?: PreferenceControlsMode;
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
    profileFocusTitle: "Áreas de enfoque",
    focusMobile: "Aplicaciones móviles",
    linkedinLabel: "Abrir perfil de LinkedIn",
    githubLabel: "Abrir perfil de GitHub",
    githubActivityTitle: "Actividad de GitHub",
    githubActivityLoading: "Cargando actividad...",
    githubActivityError: "No se pudo cargar la actividad.",
    githubActivityLess: "Menos",
    githubActivityMore: "Mas",
    skillsTitle: "Habilidades y Tecnologías",
    technologiesSubtitle:
      "Herramientas, lenguajes y plataformas que uso para crear productos digitales completos.",
    activitySubtitle:
      "Resumen visual de mis contribuciones recientes en GitHub.",
    aboutTitle: "Acerca de mí",
    resumeLabel: "Descargar CV",
    breadcrumbLabel: "Ruta de navegacion",
    homeNavLabel: "Navegación principal",
    homeRouteLabel: "Ir al inicio",
    drawerNavigationTitle: "Navegación",
    experienceRouteTitle: "Experiencia laboral",
    technologiesRouteTitle: "Habilidades y Tecnologías",
    activityRouteTitle: "Actividad de GitHub",
    contactRouteTitle: "Contacto",
    experienceNavLabel: "Ver experiencia laboral",
    technologiesNavLabel: "Ver habilidades y tecnologías",
    activityNavLabel: "Ver actividad de GitHub",
    contactNavLabel: "Ver contacto",
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
    linkedinLabel: "Open LinkedIn profile",
    githubLabel: "Open GitHub profile",
    githubActivityTitle: "GitHub activity",
    githubActivityLoading: "Loading activity...",
    githubActivityError: "Activity could not be loaded.",
    githubActivityLess: "Less",
    githubActivityMore: "More",
    skillsTitle: "Skills and Technologies",
    technologiesSubtitle:
      "Tools, languages, and platforms I use to build complete digital products.",
    activitySubtitle:
      "Visual summary of my recent GitHub contributions.",
    aboutTitle: "About me",
    resumeLabel: "Download resume",
    breadcrumbLabel: "Breadcrumb",
    homeNavLabel: "Main navigation",
    homeRouteLabel: "Go home",
    drawerNavigationTitle: "Navigation",
    experienceRouteTitle: "Work experience",
    technologiesRouteTitle: "Skills and Technologies",
    activityRouteTitle: "GitHub activity",
    contactRouteTitle: "Contact",
    experienceNavLabel: "View work experience",
    technologiesNavLabel: "View skills and technologies",
    activityNavLabel: "View GitHub activity",
    contactNavLabel: "View contact",
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

const MONTH_LABELS = {
  es: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
} as const;

const TECHNOLOGIES = [
  { label: "JavaScript", icon: "javascript.svg" },
  { label: "TypeScript", icon: "typescript.svg" },
  { label: "HTML5", icon: "html5.svg" },
  { label: "CSS", icon: "css.svg" },
  { label: "Tailwind CSS", icon: "tailwindcss.svg" },
  { label: "React", icon: "react.svg" },
  { label: "Expo", icon: "expo.svg" },
  { label: "Prisma ORM", icon: "prisma.svg" },
  { label: "Flutter", icon: "flutter.svg" },
  { label: "C#", icon: "csharp.svg" },
  { label: ".NET", icon: "dotnet.svg" },
  { label: "Node.js", icon: "nodedotjs.svg" },
  { label: "Next.js", icon: "nextdotjs.svg" },
  { label: "NestJS", icon: "nestjs.svg" },
  { label: "Express.js", icon: "express.svg" },
  { label: "MongoDB", icon: "mongodb.svg" },
  { label: "MySQL", icon: "mysql.svg" },
  { label: "PostgreSQL", icon: "postgresql.svg" },
  { label: "Redis", icon: "redis.svg" },
  { label: "Git", icon: "git.svg" },
  { label: "GitHub", icon: "github.svg" },
  { label: "VPS Linux", icon: "linux.svg" },
  { label: "Nginx", icon: "nginx.svg" },
  { label: "PM2", icon: "pm2.svg" },
  { label: "IIS", icon: "iis.svg" },
  { label: "Docker", icon: "docker.svg" },
  { label: "ESLint", icon: "eslint.svg" },
  { label: "Figma", icon: "figma.svg" },
] as const;

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

function getCurrentPath() {
  if (typeof window === "undefined") {
    return "/";
  }

  return window.location.pathname.replace(/\/$/, "") || "/";
}

function getContributionLevel(count: number, maxCount: number) {
  if (count <= 0 || maxCount <= 0) {
    return 0;
  }

  return Math.min(4, Math.max(1, Math.ceil((count / maxCount) * 4)));
}

export default function PreferenceControls({
  mode = "home",
}: PreferenceControlsProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [currentPath, setCurrentPath] = useState(getCurrentPath);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [hideRouteNavItems, setHideRouteNavItems] = useState(false);
  const [flipAvatar, setFlipAvatar] = useState<FlipAvatar | null>(null);
  const [flipProfileLinks, setFlipProfileLinks] = useState<FlipProfileLink[]>(
    [],
  );
  const [flipRouteLinks, setFlipRouteLinks] = useState<FlipRouteLink[]>([]);
  const [flipIntroCopy, setFlipIntroCopy] = useState<FlipIntroCopy | null>(
    null,
  );
  const [introToolingOffset, setIntroToolingOffset] = useState(0);
  const [githubContributions, setGithubContributions] =
    useState<GitHubContributions | null>(null);
  const [githubContributionsStatus, setGithubContributionsStatus] =
    useState<GitHubContributionsStatus>("idle");
  const [githubContributionTooltip, setGithubContributionTooltip] =
    useState<GitHubContributionTooltip | null>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const flipTimerRef = useRef<number | undefined>(undefined);
  const routeNavRevealTimerRef = useRef<number | undefined>(undefined);
  const githubRequestInFlightRef = useRef(false);
  const introLayoutRef = useRef<HTMLDivElement>(null);
  const introCopyRef = useRef<HTMLParagraphElement>(null);
  const introToolingRef = useRef<HTMLDivElement>(null);
  const mainGithubActivityRef = useRef<HTMLDivElement>(null);
  const drawerAboutRef = useRef<HTMLParagraphElement>(null);
  const drawerAboutMeasureRef = useRef<HTMLParagraphElement>(null);
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
  const drawerRouteRefs = useRef<Record<RouteLinkId, HTMLSpanElement | null>>({
    experience: null,
    technologies: null,
    activity: null,
    contact: null,
  });
  const drawerRouteMeasureRefs = useRef<
    Record<RouteLinkId, HTMLSpanElement | null>
  >({
    experience: null,
    technologies: null,
    activity: null,
    contact: null,
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
    window.dispatchEvent(new Event("rn-preferences-change"));
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEYS.locale, locale);
    window.dispatchEvent(new Event("rn-preferences-change"));
  }, [locale]);

  useEffect(() => {
    const syncPreferences = () => {
      setTheme(getInitialTheme());
      setLocale(getInitialLocale());
    };

    window.addEventListener("storage", syncPreferences);
    window.addEventListener("rn-preferences-change", syncPreferences);

    return () => {
      window.removeEventListener("storage", syncPreferences);
      window.removeEventListener("rn-preferences-change", syncPreferences);
    };
  }, []);

  useEffect(() => {
    const syncCurrentPath = () => {
      setCurrentPath(getCurrentPath());
    };

    window.addEventListener("popstate", syncCurrentPath);
    document.addEventListener("astro:page-load", syncCurrentPath);

    return () => {
      window.removeEventListener("popstate", syncCurrentPath);
      document.removeEventListener("astro:page-load", syncCurrentPath);
    };
  }, []);

  useEffect(() => {
    if (mode !== "chrome" && mode !== "preferences") {
      return;
    }

    const syncProfileDrawerState = (event: Event) => {
      const detail = (event as CustomEvent<{
        open?: boolean;
        routeRevealDelayMs?: number;
      }>).detail;

      if (routeNavRevealTimerRef.current) {
        window.clearTimeout(routeNavRevealTimerRef.current);
        routeNavRevealTimerRef.current = undefined;
      }

      if (detail?.open) {
        setIsProfileMenuOpen(true);
        setHideRouteNavItems(true);
        return;
      }

      if (detail?.routeRevealDelayMs) {
        setIsProfileMenuOpen(false);
        setHideRouteNavItems(true);
        routeNavRevealTimerRef.current = window.setTimeout(() => {
          setHideRouteNavItems(false);
          routeNavRevealTimerRef.current = undefined;
        }, detail.routeRevealDelayMs);
        return;
      }

      setIsProfileMenuOpen(false);
      setHideRouteNavItems(false);
    };

    window.addEventListener(
      "rn-profile-drawer-toggle",
      syncProfileDrawerState,
    );

    return () => {
      window.removeEventListener(
        "rn-profile-drawer-toggle",
        syncProfileDrawerState,
      );

      if (routeNavRevealTimerRef.current) {
        window.clearTimeout(routeNavRevealTimerRef.current);
      }
    };
  }, [mode]);

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

  useEffect(() => {
    if (mode !== "activity") {
      return;
    }

    if (
      githubContributions ||
      githubRequestInFlightRef.current
    ) {
      return;
    }

    const controller = new AbortController();

    githubRequestInFlightRef.current = true;
    setGithubContributionsStatus("loading");

    fetch("/api/github-contributions", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("GitHub contributions request failed.");
        }

        return response.json() as Promise<GitHubContributions>;
      })
      .then((data) => {
        setGithubContributions(data);
        setGithubContributionsStatus("idle");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          setGithubContributionsStatus("idle");
          return;
        }

        setGithubContributionsStatus("error");
      })
      .finally(() => {
        githubRequestInFlightRef.current = false;
      });

    return () => {
      controller.abort();
    };
  }, [githubContributions, mode]);

  const nextTheme = theme === "light" ? "dark" : "light";
  const nextLocale = locale === "es" ? "en" : "es";
  const labels = copy[locale];
  const themeLabel =
    theme === "light" ? labels.lightThemeLabel : labels.darkThemeLabel;
  const themeText =
    theme === "light" ? labels.lightThemeText : labels.darkThemeText;
  const educationText =
    locale === "es"
      ? "Licenciatura en Ciencias Computacionales"
      : "Bachelor's Degree in Computer Science";
  const projectsText =
    locale === "es" ? "+10 Proyectos desarrollados" : "+10 Projects developed";
  const profileLocation =
    locale === "es" ? "Hidalgo, México" : "Hidalgo, Mexico";
  const profileEmail = "lic.ricardo.nm@gmail.com";
  const monthLabels = MONTH_LABELS[locale];
  const githubMonthMarkers =
    githubContributions?.weeks.flatMap((week, weekIndex, weeks) => {
      const firstDay = week.contributionDays[0];

      if (!firstDay) {
        return [];
      }

      const month = new Date(`${firstDay.date}T00:00:00`).getMonth();
      const previousFirstDay = weeks[weekIndex - 1]?.contributionDays[0];
      const previousMonth = previousFirstDay
        ? new Date(`${previousFirstDay.date}T00:00:00`).getMonth()
        : undefined;

      if (weekIndex !== 0 && month === previousMonth) {
        return [];
      }

      return [{ label: monthLabels[month], weekIndex }];
    }) ?? [];
  const githubMaxContributions = Math.max(
    0,
    ...(githubContributions?.weeks.flatMap((week) =>
      week.contributionDays.map((day) => day.contributionCount),
    ) ?? []),
  );
  const githubCalendarStyle = {
    "--github-week-count": githubContributions?.weeks.length ?? 53,
  } as CSSProperties;
  const getGitHubDayTooltip = (day: ContributionDay) =>
    locale === "es"
      ? `${day.contributionCount} ${
          day.contributionCount === 1 ? "contribución" : "contribuciones"
        } el ${day.date}`
      : `${day.contributionCount} ${
          day.contributionCount === 1 ? "contribution" : "contributions"
        } on ${day.date}`;
  const showGitHubDayTooltip = (
    event: ReactMouseEvent<HTMLSpanElement> | ReactFocusEvent<HTMLSpanElement>,
    text: string,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setGithubContributionTooltip({
      left: rect.left + rect.width / 2,
      text,
      top: rect.top - 7,
    });
  };
  const hideGitHubDayTooltip = () => {
    setGithubContributionTooltip(null);
  };
  const getIntroToolingOffset = () => {
    const introCopy = introCopyRef.current;
    const introTooling = introToolingRef.current;

    if (!introCopy || !introTooling) {
      return 0;
    }

    const introCopyRect = introCopy.getBoundingClientRect();
    const introToolingRect = introTooling.getBoundingClientRect();

    return Math.round(Math.max(0, introToolingRect.top - introCopyRect.top));
  };
  const settingsLabel = isPreferencesOpen
    ? labels.closeSettingsLabel
    : labels.openSettingsLabel;
  const renderRouteIcon = (id: RouteLinkId, size = 24) => {
    if (id === "experience") {
      return (
        <BriefcaseBusiness aria-hidden="true" size={size} strokeWidth={2.1} />
      );
    }

    if (id === "technologies") {
      return <CodeXml aria-hidden="true" size={size + 1} strokeWidth={2.1} />;
    }

    if (id === "activity") {
      return <FolderGit2 aria-hidden="true" size={size} strokeWidth={2.1} />;
    }

    return (
      <MessageSquareText aria-hidden="true" size={size} strokeWidth={2.1} />
    );
  };
  const routeItems = [
    {
      href: "/experience",
      id: "experience",
      label: labels.experienceNavLabel,
      title: labels.experienceRouteTitle,
    },
    {
      href: "/technologies",
      id: "technologies",
      label: labels.technologiesNavLabel,
      title: labels.technologiesRouteTitle,
    },
    {
      href: "/activity",
      id: "activity",
      label: labels.activityNavLabel,
      title: labels.activityRouteTitle,
    },
    {
      href: "/contact",
      id: "contact",
      label: labels.contactNavLabel,
      title: labels.contactRouteTitle,
    },
  ] satisfies Array<{
    href: string;
    id: RouteLinkId;
    label: string;
    title: string;
  }>;
  const navItems = [
    {
      href: "/",
      icon: <Home aria-hidden="true" size={24} strokeWidth={2.1} />,
      label: labels.homeRouteLabel,
    },
    ...routeItems.map((item) => ({
      ...item,
      icon: renderRouteIcon(item.id),
    })),
  ];
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
      setFlipRouteLinks([]);
      setFlipIntroCopy(null);
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
  const getNavbarRouteElement = (id: RouteLinkId) =>
    document.querySelector<HTMLElement>(
      `.home-route-link[data-route-id="${id}"]`,
    );
  const getRouteFlipIconSize = (targetElement: HTMLElement | null) => {
    if (targetElement?.classList.contains("home-route-link")) {
      return 24;
    }

    return 20;
  };
  const playRouteLinkFlips = (
    sourceRefs: Record<RouteLinkId, HTMLElement | null>,
    targetRefs: Record<RouteLinkId, HTMLElement | null>,
  ) => {
    const nextFlips = (Object.keys(sourceRefs) as RouteLinkId[]).flatMap(
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
            endRadius: "0.55rem",
            iconSize: getRouteFlipIconSize(targetRefs[id]),
            scaleX: sourceRect.width / targetRect.width,
            scaleY: sourceRect.height / targetRect.height,
            startRadius: "0.58rem",
            targetLeft: targetRect.left,
            targetTop: targetRect.top,
            targetWidth: targetRect.width,
            targetHeight: targetRect.height,
          },
        ];
      },
    );

    setFlipRouteLinks(nextFlips);
    queueFlipCleanup();
  };
  const playIntroCopyFlip = (
    sourceRect: DOMRect,
    targetRect: DOMRect,
    variant: FlipIntroCopy["variant"],
  ) => {
    setFlipIntroCopy({
      deltaX: Math.round(sourceRect.left - targetRect.left),
      deltaY: Math.round(sourceRect.top - targetRect.top),
      endRadius: "0",
      scaleX: 1,
      scaleY: 1,
      startRadius: "0",
      targetLeft: Math.round(targetRect.left),
      targetTop: Math.round(targetRect.top),
      targetWidth: Math.round(targetRect.width),
      targetHeight: Math.round(targetRect.height),
      variant,
    });

    queueFlipCleanup();
  };
  const openProfileMenu = () => {
    const sourceRect = profilePictureRef.current?.getBoundingClientRect();
    const targetRect = drawerAvatarMeasureRef.current?.getBoundingClientRect();
    const introSourceRect = introCopyRef.current?.getBoundingClientRect();
    const introTargetRect =
      drawerAboutMeasureRef.current?.getBoundingClientRect();
    const navRouteRefs = {
      experience: getNavbarRouteElement("experience"),
      technologies: getNavbarRouteElement("technologies"),
      activity: getNavbarRouteElement("activity"),
      contact: getNavbarRouteElement("contact"),
    };
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    setIntroToolingOffset(getIntroToolingOffset());
    setIsProfileMenuOpen(true);
    window.dispatchEvent(
      new CustomEvent("rn-profile-drawer-toggle", {
        detail: { open: true },
      }),
    );

    if (!sourceRect || !targetRect || prefersReducedMotion) {
      return;
    }

    playAvatarFlip(sourceRect, targetRect, "0.75rem", "999px");
    playProfileLinkFlips(mainLinkRefs.current, drawerLinkMeasureRefs.current);
    playRouteLinkFlips(navRouteRefs, drawerRouteMeasureRefs.current);

    if (introSourceRect && introTargetRect) {
      playIntroCopyFlip(introSourceRect, introTargetRect, "drawer");
    }
  };
  const closeProfileMenu = () => {
    const sourceRect = drawerAvatarRef.current?.getBoundingClientRect();
    const targetRect = profilePictureRef.current?.getBoundingClientRect();
    const introSourceRect = drawerAboutRef.current?.getBoundingClientRect();
    const introTargetRect = introCopyRef.current?.getBoundingClientRect();
    const navRouteRefs = {
      experience: getNavbarRouteElement("experience"),
      technologies: getNavbarRouteElement("technologies"),
      activity: getNavbarRouteElement("activity"),
      contact: getNavbarRouteElement("contact"),
    };
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const shouldAnimateClose = Boolean(
      sourceRect && targetRect && !prefersReducedMotion,
    );

    if (shouldAnimateClose && sourceRect && targetRect) {
      playAvatarFlip(sourceRect, targetRect, "999px", "0.75rem");
      playProfileLinkFlips(drawerLinkRefs.current, mainLinkRefs.current);
      playRouteLinkFlips(drawerRouteRefs.current, navRouteRefs);

      if (introSourceRect && introTargetRect) {
        playIntroCopyFlip(introSourceRect, introTargetRect, "intro");
      }
    } else {
      setFlipAvatar(null);
      setFlipProfileLinks([]);
      setFlipRouteLinks([]);
      setFlipIntroCopy(null);
    }

    setIsProfileMenuOpen(false);
    window.dispatchEvent(
      new CustomEvent("rn-profile-drawer-toggle", {
        detail: {
          open: false,
          routeRevealDelayMs: shouldAnimateClose ? 600 : 0,
        },
      }),
    );
  };
  const closeProfileMenuForRoute: MouseEventHandler<HTMLAnchorElement> = (
    _event,
  ) => {
    setFlipAvatar(null);
    setFlipProfileLinks([]);
    setFlipRouteLinks([]);
    setFlipIntroCopy(null);
    window.dispatchEvent(
      new CustomEvent("rn-profile-drawer-toggle", {
        detail: { open: false },
      }),
    );
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
  const flipRouteLinkStyles = flipRouteLinks.map(
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
        iconSize: link.iconSize,
      }) satisfies { id: RouteLinkId; iconSize: number; style: CSSProperties },
  );
  const flipIntroCopyStyle =
    flipIntroCopy &&
    ({
      "--flip-delta-x": `${flipIntroCopy.deltaX}px`,
      "--flip-delta-y": `${flipIntroCopy.deltaY}px`,
      "--flip-end-radius": flipIntroCopy.endRadius,
      "--flip-scale-x": flipIntroCopy.scaleX,
      "--flip-scale-y": flipIntroCopy.scaleY,
      "--flip-start-radius": flipIntroCopy.startRadius,
      "--flip-target-left": `${flipIntroCopy.targetLeft}px`,
      "--flip-target-top": `${flipIntroCopy.targetTop}px`,
      "--flip-target-width": `${flipIntroCopy.targetWidth}px`,
      "--flip-target-height": `${flipIntroCopy.targetHeight}px`,
    } as CSSProperties);
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
  const renderIntroCopyContent = () => (
    <>
      <strong>{labels.introHighlight}</strong>
      {labels.introRest}
    </>
  );
  const renderGitHubActivity = ({
    activityRef,
    className = "",
    hidden = false,
    scrollRef,
  }: {
    activityRef?: Ref<HTMLDivElement>;
    className?: string;
    hidden?: boolean;
    scrollRef?: Ref<HTMLDivElement>;
  }) => (
    <div
      className={`github-activity ${className}`.trim()}
      aria-hidden={hidden}
      data-hidden={hidden}
      ref={activityRef}
    >
      <h4>{labels.githubActivityTitle}</h4>
      <div
        className="github-calendar-panel"
        data-state={githubContributionsStatus}
      >
        {githubContributionsStatus === "loading" && (
          <p className="github-calendar-message">
            {labels.githubActivityLoading}
          </p>
        )}

        {githubContributionsStatus === "error" && (
          <p className="github-calendar-message">{labels.githubActivityError}</p>
        )}

        {githubContributions && (
          <>
            <div
              className="github-calendar-scroll"
              ref={scrollRef}
              onScroll={hideGitHubDayTooltip}
            >
              <div className="github-calendar-track" style={githubCalendarStyle}>
                <div className="github-calendar-months" aria-hidden="true">
                  {githubMonthMarkers.map((marker) => (
                    <span
                      key={`${marker.label}-${marker.weekIndex}`}
                      style={
                        {
                          gridColumn: `${marker.weekIndex + 1}`,
                        } as CSSProperties
                      }
                    >
                      {marker.label}
                    </span>
                  ))}
                </div>

                <div
                  className="github-calendar-grid"
                  aria-label={labels.githubActivityTitle}
                >
                  {githubContributions.weeks.map((week, weekIndex) =>
                    week.contributionDays.map((day) => {
                      const level = getContributionLevel(
                        day.contributionCount,
                        githubMaxContributions,
                      );
                      const tooltipText = getGitHubDayTooltip(day);

                      return (
                        <span
                          aria-label={tooltipText}
                          className="github-calendar-day"
                          data-level={level}
                          key={day.date}
                          onBlur={hideGitHubDayTooltip}
                          onFocus={(event) =>
                            showGitHubDayTooltip(event, tooltipText)
                          }
                          onMouseEnter={(event) =>
                            showGitHubDayTooltip(event, tooltipText)
                          }
                          onMouseLeave={hideGitHubDayTooltip}
                          onMouseMove={(event) =>
                            showGitHubDayTooltip(event, tooltipText)
                          }
                          style={
                            {
                              gridColumn: `${weekIndex + 1}`,
                              gridRow: `${day.weekday + 1}`,
                            } as CSSProperties
                          }
                        />
                      );
                    }),
                  )}
                </div>
              </div>
            </div>

            <div className="github-calendar-footer">
              <strong>
                {locale === "es"
                  ? `${githubContributions.totalContributions} contribuciones en el último año`
                  : `${githubContributions.totalContributions} contributions in the last year`}
              </strong>
              <span className="github-calendar-legend">
                {labels.githubActivityLess}
                {[0, 1, 2, 3, 4].map((level) => (
                  <i aria-hidden="true" data-level={level} key={level} />
                ))}
                {labels.githubActivityMore}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
  const renderTechnologyGrid = () => (
    <div className="technology-grid" aria-label={labels.skillsTitle}>
      {TECHNOLOGIES.map((technology) => (
        <span
          aria-label={technology.label}
          className="technology-item"
          data-label={technology.label}
          key={technology.label}
          role="img"
          tabIndex={0}
        >
          <span
            aria-hidden="true"
            className="technology-icon"
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
  const renderPreferencesFloat = () => (
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
  );
  const renderFloatingNav = (hidden = false) => (
    <nav
      className="home-route-links"
      aria-label={labels.homeNavLabel}
      data-hidden={hidden || flipRouteLinks.length > 0}
      data-instant-hidden={hidden}
    >
      {navItems.map((item) => {
        const isActive = currentPath === item.href;
        const routeId = "id" in item ? item.id : undefined;

        return (
          <a
            className="home-route-link"
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.label}
            data-active={isActive}
            data-route-id={routeId}
            data-route-hidden={Boolean(routeId && hideRouteNavItems)}
            key={item.href}
          >
            {item.icon}
          </a>
        );
      })}
    </nav>
  );
  const renderDrawerRouteLinks = (
    refs: Record<RouteLinkId, HTMLSpanElement | null>,
    hidden = false,
    onClick?: MouseEventHandler<HTMLAnchorElement>,
  ) => (
    <div
      className="profile-route-list"
      aria-label={locale === "es" ? "Secciones" : "Sections"}
    >
      <h4>{labels.drawerNavigationTitle}</h4>
      {routeItems.map((item) => (
        <div
          className="profile-route-link"
          key={item.id}
        >
          <span
            className="profile-route-icon"
            data-hidden={hidden}
            ref={(element) => {
              refs[item.id] = element;
            }}
          >
            {renderRouteIcon(item.id, 20)}
          </span>
          <a
            className="profile-route-title"
            href={item.href}
            aria-label={item.label}
            onClick={onClick}
          >
            {item.title}
          </a>
        </div>
      ))}
    </div>
  );

  if (mode === "chrome" || mode === "preferences") {
    return (
      <>
        {renderFloatingNav(isProfileMenuOpen)}
        {renderPreferencesFloat()}
      </>
    );
  }

  if (mode === "technologies") {
    return (
      <>
        <main className="experience-shell" aria-labelledby="technologies-title">
          <div className="experience-content">
            <RouteBreadcrumb
              currentLabel={labels.skillsTitle}
              homeLabel={labels.homeRouteLabel}
              label={labels.breadcrumbLabel}
            />

            <header className="experience-header">
              <h1 id="technologies-title">{labels.skillsTitle}</h1>
              <p>{labels.technologiesSubtitle}</p>
            </header>

            <section className="profile-skills route-section">
              {renderTechnologyGrid()}
            </section>
          </div>
        </main>

      </>
    );
  }

  if (mode === "activity") {
    return (
      <>
        <main className="experience-shell" aria-labelledby="activity-title">
          <div className="experience-content">
            <RouteBreadcrumb
              currentLabel={labels.githubActivityTitle}
              homeLabel={labels.homeRouteLabel}
              label={labels.breadcrumbLabel}
            />

            <header className="experience-header">
              <h1 id="activity-title">{labels.githubActivityTitle}</h1>
              <p>{labels.activitySubtitle}</p>
            </header>

            {renderGitHubActivity({
              activityRef: mainGithubActivityRef,
              className: "route-github-activity route-section",
            })}
          </div>
        </main>

        {githubContributionTooltip && (
          <div
            className="github-calendar-tooltip"
            role="tooltip"
            style={
              {
                "--tooltip-left": `${githubContributionTooltip.left}px`,
                "--tooltip-top": `${githubContributionTooltip.top}px`,
              } as CSSProperties
            }
          >
            {githubContributionTooltip.text}
          </div>
        )}

      </>
    );
  }

  if (mode === "contact") {
    return (
      <>
        <main className="experience-shell" aria-labelledby="contact-title">
          <div className="experience-content">
            <RouteBreadcrumb
              currentLabel={labels.contactRouteTitle}
              homeLabel={labels.homeRouteLabel}
              label={labels.breadcrumbLabel}
            />

            <header className="experience-header">
              <h1 id="contact-title">{labels.contactRouteTitle}</h1>
            </header>
          </div>
        </main>

      </>
    );
  }

  return (
    <>
      <div
        className="intro-layout"
        data-profile-open={isProfileMenuOpen}
        ref={introLayoutRef}
        style={
          {
            "--intro-tooling-offset": `${introToolingOffset}px`,
          } as CSSProperties
        }
      >
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

        <div className="intro-main">
          <p
            className="intro-copy"
            data-hidden={isProfileMenuOpen || Boolean(flipIntroCopy)}
            ref={introCopyRef}
          >
            {renderIntroCopyContent()}
          </p>

        </div>
      </div>

      <div className="profile-drawer-measure" aria-hidden="true">
        <div className="profile-drawer-header">
          <h2>{labels.profileMenuTitle}</h2>
          <span className="profile-drawer-close" />
        </div>
        <div className="profile-drawer-cover">
          <img src={bannerUrl.src} alt="" aria-hidden="true" />
        </div>
        <div className="profile-drawer-cover-row">
          <div className="profile-drawer-identity">
            <div className="profile-drawer-avatar" ref={drawerAvatarMeasureRef}>
              <img
                src="/assets/profilePicture.jpeg"
                alt=""
                className="profile-picture"
              />
            </div>
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
        <div className="profile-drawer-name-row">
          <h3>Ricardo Nava Mayoral</h3>
          <span />
        </div>
        <div className="profile-drawer-meta">
          <span>
            <Mail aria-hidden="true" size={16} strokeWidth={1.8} />
            {profileEmail}
          </span>
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
        <div className="profile-drawer-section profile-about">
          <h4>{labels.aboutTitle}</h4>
          <p className="profile-about-text" ref={drawerAboutMeasureRef}>
            {renderIntroCopyContent()}
          </p>
        </div>
        {renderDrawerRouteLinks(drawerRouteMeasureRefs.current)}
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

      {flipRouteLinkStyles.map((link) => (
        <span
          className="flip-route-link"
          style={link.style}
          aria-hidden="true"
          key={link.id}
        >
          {renderRouteIcon(link.id, link.iconSize)}
        </span>
      ))}

      {flipIntroCopyStyle && (
        <div
          className="flip-intro-copy"
          data-variant={flipIntroCopy.variant}
          style={flipIntroCopyStyle}
          aria-hidden="true"
        >
          <p>{renderIntroCopyContent()}</p>
        </div>
      )}

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

          <div className="profile-drawer-cover-row">
            <div
              className="profile-links profile-drawer-links"
              aria-label={
                locale === "es" ? "Enlaces de perfil" : "Profile links"
              }
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
          </div>

          <div className="profile-drawer-name-row">
            <h3>Ricardo Nava Mayoral</h3>
            <span aria-hidden="true" />
          </div>

          <div className="profile-drawer-meta">
            <span>
              <Mail aria-hidden="true" size={16} strokeWidth={1.8} />
              {profileEmail}
            </span>
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

          <div className="profile-drawer-section profile-about">
            <h4>{labels.aboutTitle}</h4>
            <p
              className="profile-about-text"
              data-hidden={Boolean(flipIntroCopy)}
              ref={drawerAboutRef}
            >
              {renderIntroCopyContent()}
            </p>
          </div>

          {renderDrawerRouteLinks(
            drawerRouteRefs.current,
            flipRouteLinks.length > 0,
            closeProfileMenuForRoute,
          )}

        </section>
      </aside>

    </>
  );
}
