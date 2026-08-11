import { ChevronDown, X } from "lucide-react";
import type {
  CSSProperties,
  FocusEvent as ReactFocusEvent,
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
} from "react";
import { useEffect, useRef, useState } from "react";
import { navigate } from "astro:transitions/client";
import bannerUrl from "../assets/banner.webp";
import ContactForm from "./preference-controls/ContactForm";
import ContactLeaveModal from "./preference-controls/ContactLeaveModal";
import ContactSuccessModal from "./preference-controls/ContactSuccessModal";
import DrawerRouteLinks from "./preference-controls/DrawerRouteLinks";
import FloatingNav from "./preference-controls/FloatingNav";
import GitHubActivity from "./preference-controls/GitHubActivity";
import GitHubProfileCard from "./preference-controls/GitHubProfileCard";
import IntroCopyContent from "./preference-controls/IntroCopyContent";
import PreferencesFloat from "./preference-controls/PreferencesFloat";
import ProfileDrawerMeta from "./preference-controls/ProfileDrawerMeta";
import ProfileLinkIcon from "./preference-controls/ProfileLinkIcon";
import ProfileLinks from "./preference-controls/ProfileLinks";
import RoutePageShell from "./preference-controls/RoutePageShell";
import RouteIcon from "./preference-controls/RouteIcon";
import TechnologyCategories from "./preference-controls/TechnologyCategories";
import {
  CONTACT_LEAVE_FADE_DURATION_MS,
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_SUCCESS_AUTO_CLOSE_MS,
  MONTH_LABELS,
  STORAGE_KEYS,
  UNSAFE_CONTACT_MESSAGE_PATTERN,
} from "./preference-controls/constants";
import { preferenceCopy } from "./preference-controls/copy";
import type {
  ContactSubmitStatus,
  ContributionDay,
  FlipAvatar,
  FlipIntroCopy,
  FlipProfileLink,
  FlipRouteLink,
  GitHubContributionTooltip,
  GitHubContributions,
  GitHubContributionsStatus,
  Locale,
  PreferenceControlsProps,
  ProfileLinkId,
  RouteItem,
  RouteLinkId,
  Theme,
} from "./preference-controls/types";
import {
  getCurrentPath,
  getInitialLocale,
  getInitialTheme,
} from "./preference-controls/utils";

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
  const [contactForm, setContactForm] = useState({
    email: "",
    message: "",
    name: "",
  });
  const [contactSubmitStatus, setContactSubmitStatus] =
    useState<ContactSubmitStatus>("idle");
  const [isContactSuccessModalOpen, setIsContactSuccessModalOpen] =
    useState(false);
  const [pendingContactNavigation, setPendingContactNavigation] = useState<
    string | null
  >(null);
  const [isContactLeaveClosing, setIsContactLeaveClosing] = useState(false);
  const [isContactNavigationConfirming, setIsContactNavigationConfirming] =
    useState(false);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const flipTimerRef = useRef<number | undefined>(undefined);
  const routeNavRevealTimerRef = useRef<number | undefined>(undefined);
  const githubRequestInFlightRef = useRef(false);
  const allowContactNavigationRef = useRef(false);
  const contactFormDirtyRef = useRef(false);
  const contactLeaveCloseTimerRef = useRef<number | undefined>(undefined);
  const contactSuccessCloseTimerRef = useRef<number | undefined>(undefined);
  const contactLeaveCancelRef = useRef<HTMLButtonElement>(null);
  const contactSuccessModalRef = useRef<HTMLElement>(null);
  const contactLeaveSourceRef = useRef<Element | null>(null);
  const introLayoutRef = useRef<HTMLDivElement>(null);
  const introCopyRef = useRef<HTMLParagraphElement>(null);
  const introToolingRef = useRef<HTMLDivElement>(null);
  const mainGithubActivityRef = useRef<HTMLDivElement>(null);
  const mainGithubCalendarScrollRef = useRef<HTMLDivElement>(null);
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
    projects: null,
    technologies: null,
    activity: null,
    contact: null,
  });
  const drawerRouteMeasureRefs = useRef<
    Record<RouteLinkId, HTMLSpanElement | null>
  >({
    experience: null,
    projects: null,
    technologies: null,
    activity: null,
    contact: null,
  });
  const profileDrawerShellRef = useRef<HTMLElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
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
      const detail = (
        event as CustomEvent<{
          open?: boolean;
          routeRevealDelayMs?: number;
        }>
      ).detail;

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

    window.addEventListener("rn-profile-drawer-toggle", syncProfileDrawerState);

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

      if (contactLeaveCloseTimerRef.current) {
        window.clearTimeout(contactLeaveCloseTimerRef.current);
      }

      if (contactSuccessCloseTimerRef.current) {
        window.clearTimeout(contactSuccessCloseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mode !== "activity") {
      return;
    }

    if (githubContributions || githubRequestInFlightRef.current) {
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

  useEffect(() => {
    if (mode !== "activity" || !githubContributions) {
      return;
    }

    const scrollElement = mainGithubCalendarScrollRef.current;

    if (!scrollElement) {
      return;
    }

    const scrollToLatestMonth = () => {
      if (!window.matchMedia("(max-width: 720px)").matches) {
        return;
      }

      scrollElement.scrollLeft = scrollElement.scrollWidth;
    };
    const animationFrame = window.requestAnimationFrame(scrollToLatestMonth);

    window.addEventListener("resize", scrollToLatestMonth);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", scrollToLatestMonth);
    };
  }, [githubContributions, mode]);

  const nextTheme = theme === "light" ? "dark" : "light";
  const nextLocale = locale === "es" ? "en" : "es";
  const labels = preferenceCopy[locale];
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
  const isContactFormDirty =
    contactForm.name.trim().length > 0 ||
    contactForm.email.trim().length > 0 ||
    contactForm.message.trim().length > 0;
  const contactMessageLength = contactForm.message.length;
  const isContactMessageUnsafe = UNSAFE_CONTACT_MESSAGE_PATTERN.test(
    contactForm.message,
  );
  const isContactFormValid =
    contactForm.name.trim().length > 0 &&
    contactForm.message.trim().length > 0 &&
    contactMessageLength <= CONTACT_MESSAGE_MAX_LENGTH &&
    !isContactMessageUnsafe &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email.trim());
  const isContactSubmitting = contactSubmitStatus === "sending";
  const isContactLeaveModalOpen = pendingContactNavigation !== null;
  const updateContactFormValue = (
    field: keyof typeof contactForm,
    value: string,
  ) => {
    const nextValue =
      field === "message" ? value.slice(0, CONTACT_MESSAGE_MAX_LENGTH) : value;
    const nextContactForm = {
      ...contactForm,
      [field]: nextValue,
    };

    contactFormDirtyRef.current =
      nextContactForm.name.trim().length > 0 ||
      nextContactForm.email.trim().length > 0 ||
      nextContactForm.message.trim().length > 0;
    if (contactSubmitStatus === "error") {
      setContactSubmitStatus("idle");
    }
    setContactForm(nextContactForm);
  };
  const handleContactSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!isContactFormValid || isContactSubmitting) {
      return;
    }

    setContactSubmitStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify({
          email: contactForm.email.trim(),
          locale,
          message: contactForm.message.trim(),
          name: contactForm.name.trim(),
          theme,
        }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Contact request failed.");
      }

      setContactForm({
        email: "",
        message: "",
        name: "",
      });
      contactFormDirtyRef.current = false;
      setContactSubmitStatus("success");
      setIsContactSuccessModalOpen(true);

      if (contactSuccessCloseTimerRef.current) {
        window.clearTimeout(contactSuccessCloseTimerRef.current);
      }

      contactSuccessCloseTimerRef.current = window.setTimeout(() => {
        setIsContactSuccessModalOpen(false);
        contactSuccessCloseTimerRef.current = undefined;
      }, CONTACT_SUCCESS_AUTO_CLOSE_MS);
    } catch {
      setContactSubmitStatus("error");
    }
  };
  const closeContactLeaveModal = () => {
    if (isContactNavigationConfirming || isContactLeaveClosing) {
      return;
    }

    setIsContactLeaveClosing(true);

    if (contactLeaveCloseTimerRef.current) {
      window.clearTimeout(contactLeaveCloseTimerRef.current);
    }

    contactLeaveCloseTimerRef.current = window.setTimeout(() => {
      setPendingContactNavigation(null);
      setIsContactLeaveClosing(false);
      contactLeaveSourceRef.current = null;
      contactLeaveCloseTimerRef.current = undefined;
    }, CONTACT_LEAVE_FADE_DURATION_MS);
  };
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

  useEffect(() => {
    contactFormDirtyRef.current = isContactFormDirty;
  }, [isContactFormDirty]);

  useEffect(() => {
    if (mode !== "contact" && mode !== "chrome") {
      return;
    }

    const getInternalNavigationHref = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      ) {
        return null;
      }

      const eventTarget = event.composed
        ? event.composedPath()[0]
        : event.target;

      if (!(eventTarget instanceof Element)) {
        return null;
      }

      const link = eventTarget.closest("a, area");

      if (!(link instanceof HTMLAnchorElement)) {
        return null;
      }

      const href = link.getAttribute("href");

      if (
        !href ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self")
      ) {
        return null;
      }

      const nextUrl = new URL(href, window.location.href);

      if (nextUrl.origin !== window.location.origin) {
        return null;
      }

      const nextPath = nextUrl.pathname.replace(/\/$/, "") || "/";

      if (nextPath === "/contact") {
        return null;
      }

      contactLeaveSourceRef.current = link;

      return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
    };
    const hasContactFormContent = () => {
      const form = document.querySelector<HTMLFormElement>(".contact-form");

      if (!form) {
        return contactFormDirtyRef.current;
      }

      const formData = new FormData(form);

      return ["name", "email", "message"].some((field) => {
        const value = formData.get(field);

        return typeof value === "string" && value.trim().length > 0;
      });
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        !hasContactFormContent() ||
        allowContactNavigationRef.current ||
        event.defaultPrevented
      ) {
        return;
      }

      const href = getInternalNavigationHref(event);

      if (!href) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setIsContactLeaveClosing(false);

      if (contactLeaveCloseTimerRef.current) {
        window.clearTimeout(contactLeaveCloseTimerRef.current);
        contactLeaveCloseTimerRef.current = undefined;
      }

      setPendingContactNavigation(href);
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasContactFormContent() || allowContactNavigationRef.current) {
        return;
      }

      event.preventDefault();
      Reflect.set(event, "returnValue", "");
    };

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [mode]);

  useEffect(() => {
    if (!isContactLeaveModalOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    contactLeaveCancelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeContactLeaveModal();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".contact-leave-modal button:not(:disabled)",
        ),
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    closeContactLeaveModal,
    isContactLeaveModalOpen,
    isContactLeaveClosing,
    isContactNavigationConfirming,
  ]);

  useEffect(() => {
    if (!isContactSuccessModalOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const focusTimer = window.setTimeout(() => {
      contactSuccessModalRef.current?.focus();
    }, 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (contactSuccessCloseTimerRef.current) {
        window.clearTimeout(contactSuccessCloseTimerRef.current);
        contactSuccessCloseTimerRef.current = undefined;
      }

      setIsContactSuccessModalOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [isContactSuccessModalOpen]);
  const githubCalendarStyle = {
    "--github-week-count": githubContributions?.weeks.length ?? 53,
  } as CSSProperties;
  const formatGitHubTooltipDate = (date: string) => {
    if (locale !== "es") {
      return date;
    }

    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
  };
  const getGitHubDayTooltip = (day: ContributionDay) => {
    const displayDate = formatGitHubTooltipDate(day.date);

    return locale === "es"
      ? `${day.contributionCount} ${
          day.contributionCount === 1 ? "contribución" : "contribuciones"
        } el ${displayDate}`
      : `${day.contributionCount} ${
          day.contributionCount === 1 ? "contribution" : "contributions"
        } on ${displayDate}`;
  };
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
  const routeItems = [
    {
      href: "/experience",
      id: "experience",
      label: labels.experienceNavLabel,
      title: labels.experienceRouteTitle,
    },
    {
      href: "/projects",
      id: "projects",
      label: labels.projectsNavLabel,
      title: labels.projectsRouteTitle,
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
  ] satisfies RouteItem[];
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
      scaleX: sourceRect.width / targetRect.width,
      scaleY: sourceRect.height / targetRect.height,
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
      projects: getNavbarRouteElement("projects"),
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
  const returnFocusFromProfileMenu = () => {
    const activeElement = document.activeElement;

    if (
      activeElement instanceof HTMLElement &&
      profileDrawerShellRef.current?.contains(activeElement)
    ) {
      activeElement.blur();
    }

    profilePictureRef.current?.focus({ preventScroll: true });
  };
  const closeProfileMenu = () => {
    const sourceRect = drawerAvatarRef.current?.getBoundingClientRect();
    const targetRect = profilePictureRef.current?.getBoundingClientRect();
    const introSourceRect = drawerAboutRef.current?.getBoundingClientRect();
    const introTargetRect = introCopyRef.current?.getBoundingClientRect();
    const navRouteRefs = {
      experience: getNavbarRouteElement("experience"),
      projects: getNavbarRouteElement("projects"),
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

    returnFocusFromProfileMenu();
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
    returnFocusFromProfileMenu();
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
  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      drawerCloseRef.current?.focus({ preventScroll: true });
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [isProfileMenuOpen]);
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
  const cancelContactNavigation = () => {
    closeContactLeaveModal();
  };
  const confirmContactNavigation = () => {
    if (
      !pendingContactNavigation ||
      isContactNavigationConfirming ||
      isContactLeaveClosing
    ) {
      return;
    }

    allowContactNavigationRef.current = true;
    setIsContactLeaveClosing(true);
    setIsContactNavigationConfirming(true);
    const sourceElement = contactLeaveSourceRef.current ?? undefined;

    if (contactLeaveCloseTimerRef.current) {
      window.clearTimeout(contactLeaveCloseTimerRef.current);
      contactLeaveCloseTimerRef.current = undefined;
    }

    void navigate(pendingContactNavigation, {
      sourceElement,
    }).finally(() => {
      allowContactNavigationRef.current = false;
      setIsContactNavigationConfirming(false);
      setIsContactLeaveClosing(false);
      contactLeaveSourceRef.current = null;
      setPendingContactNavigation(null);
    });
  };
  const contactLeaveModal = (
    <ContactLeaveModal
      cancelRef={contactLeaveCancelRef}
      isClosing={isContactLeaveClosing}
      isConfirming={isContactNavigationConfirming}
      isOpen={isContactLeaveModalOpen}
      labels={labels}
      onCancel={cancelContactNavigation}
      onConfirm={confirmContactNavigation}
    />
  );
  const floatingNav = (hidden = false) => (
    <FloatingNav
      currentPath={currentPath}
      hidden={hidden}
      hideRouteNavItems={hideRouteNavItems}
      homeLabel={labels.homeRouteLabel}
      label={labels.homeNavLabel}
      routeItems={routeItems}
      routeLinksHidden={flipRouteLinks.length > 0}
    />
  );
  const preferencesFloat = (
    <PreferencesFloat
      isOpen={isPreferencesOpen}
      labels={labels}
      nextLocale={nextLocale}
      nextTheme={nextTheme}
      onClose={() => setIsPreferencesOpen(false)}
      onMouseLeave={queueClosePreferences}
      onOpen={openPreferences}
      onSetLocale={setLocale}
      onSetTheme={setTheme}
      onToggle={togglePreferences}
      settingsLabel={settingsLabel}
      theme={theme}
      themeLabel={themeLabel}
      themeText={themeText}
    />
  );

  if (mode === "chrome" || mode === "preferences") {
    return (
      <>
        {floatingNav(isProfileMenuOpen)}
        {preferencesFloat}
        {contactLeaveModal}
      </>
    );
  }

  if (mode === "technologies") {
    return (
      <>
        <RoutePageShell
          breadcrumbLabel={labels.breadcrumbLabel}
          homeLabel={labels.homeRouteLabel}
          subtitle={labels.technologiesSubtitle}
          title={labels.skillsTitle}
          titleId="technologies-title"
        >
          <section
            className="technology-categories route-section"
            aria-label={labels.skillsTitle}
          >
            <TechnologyCategories label={labels.skillsTitle} locale={locale} />
          </section>
        </RoutePageShell>
        {contactLeaveModal}
      </>
    );
  }

  if (mode === "projects") {
    return (
      <>
        <RoutePageShell
          breadcrumbLabel={labels.breadcrumbLabel}
          homeLabel={labels.homeRouteLabel}
          subtitle={labels.projectsSubtitle}
          title={labels.projectsRouteTitle}
          titleId="projects-title"
        />
        {contactLeaveModal}
      </>
    );
  }

  if (mode === "activity") {
    return (
      <>
        <RoutePageShell
          breadcrumbLabel={labels.breadcrumbLabel}
          homeLabel={labels.homeRouteLabel}
          subtitle={labels.activitySubtitle}
          title={labels.githubActivityTitle}
          titleId="activity-title"
        >
          <GitHubActivity
            activityRef={mainGithubActivityRef}
            calendarStyle={githubCalendarStyle}
            className="route-github-activity route-section"
            contributions={githubContributions}
            labels={labels}
            locale={locale}
            maxContributions={githubMaxContributions}
            monthMarkers={githubMonthMarkers}
            onHideTooltip={hideGitHubDayTooltip}
            onShowTooltip={showGitHubDayTooltip}
            scrollRef={mainGithubCalendarScrollRef}
            status={githubContributionsStatus}
            tooltipForDay={getGitHubDayTooltip}
          />

          <GitHubProfileCard labels={labels} />
        </RoutePageShell>

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
        <RoutePageShell
          breadcrumbLabel={labels.breadcrumbLabel}
          homeLabel={labels.homeRouteLabel}
          subtitle={labels.contactSubtitle}
          title={labels.contactRouteTitle}
          titleId="contact-title"
        >
          <ContactForm
            contactForm={contactForm}
            contactMessageLength={contactMessageLength}
            isContactFormValid={isContactFormValid}
            isContactMessageUnsafe={isContactMessageUnsafe}
            isContactSubmitting={isContactSubmitting}
            labels={labels}
            maxLength={CONTACT_MESSAGE_MAX_LENGTH}
            onSubmit={handleContactSubmit}
            onUpdateValue={updateContactFormValue}
            submitStatus={contactSubmitStatus}
          />
        </RoutePageShell>
        <ContactSuccessModal
          isOpen={isContactSuccessModalOpen}
          labels={labels}
          modalRef={contactSuccessModalRef}
        />
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

          <ProfileLinks
            hidden={isProfileMenuOpen || flipProfileLinks.length > 0}
            labels={labels}
            locale={locale}
            refs={mainLinkRefs.current}
          />
        </div>

        <div className="intro-main">
          <p
            className="intro-copy"
            data-hidden={isProfileMenuOpen || Boolean(flipIntroCopy)}
            ref={introCopyRef}
          >
            <IntroCopyContent
              introHighlight={labels.introHighlight}
              introRest={labels.introRest}
            />
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
          <ProfileLinks
            className="profile-links profile-drawer-links"
            labels={labels}
            locale={locale}
            refs={drawerLinkMeasureRefs.current}
          />
        </div>
        <div className="profile-drawer-name-row">
          <h3>Ricardo Nava Mayoral</h3>
          <span />
        </div>
        <ProfileDrawerMeta
          educationText={educationText}
          profileEmail={profileEmail}
          profileLocation={profileLocation}
          projectsText={projectsText}
        />
        <div className="profile-drawer-section profile-about">
          <h4>{labels.aboutTitle}</h4>
          <p className="profile-about-text" ref={drawerAboutMeasureRef}>
            <IntroCopyContent
              introHighlight={labels.introHighlight}
              introRest={labels.introRest}
            />
          </p>
        </div>
        <DrawerRouteLinks
          label={labels.drawerNavigationTitle}
          locale={locale}
          refs={drawerRouteMeasureRefs.current}
          routeItems={routeItems}
          title={labels.drawerNavigationTitle}
        />
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
          <ProfileLinkIcon id={link.id} />
        </span>
      ))}

      {flipRouteLinkStyles.map((link) => (
        <span
          className="flip-route-link"
          style={link.style}
          aria-hidden="true"
          key={link.id}
        >
          <RouteIcon id={link.id} size={link.iconSize} />
        </span>
      ))}

      {flipIntroCopyStyle && (
        <div
          className="flip-intro-copy"
          data-variant={flipIntroCopy.variant}
          style={flipIntroCopyStyle}
          aria-hidden="true"
        >
          <p>
            <IntroCopyContent
              introHighlight={labels.introHighlight}
              introRest={labels.introRest}
            />
          </p>
        </div>
      )}

      <aside
        className="profile-drawer-shell"
        data-open={isProfileMenuOpen}
        aria-hidden={!isProfileMenuOpen}
        inert={!isProfileMenuOpen}
        ref={profileDrawerShellRef}
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
              ref={drawerCloseRef}
            >
              <X aria-hidden="true" size={18} strokeWidth={1.8} />
            </button>
          </div>

          <div className="profile-drawer-cover">
            <img src={bannerUrl.src} alt="" aria-hidden="true" />
          </div>

          <div className="profile-drawer-cover-row">
            <ProfileLinks
              className="profile-links profile-drawer-links"
              hidden={Boolean(flipProfileLinks.length)}
              labels={labels}
              locale={locale}
              refs={drawerLinkRefs.current}
            />

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

          <ProfileDrawerMeta
            educationText={educationText}
            profileEmail={profileEmail}
            profileLocation={profileLocation}
            projectsText={projectsText}
          />

          <div className="profile-drawer-section profile-about">
            <h4>{labels.aboutTitle}</h4>
            <p
              className="profile-about-text"
              data-hidden={Boolean(flipIntroCopy)}
              ref={drawerAboutRef}
            >
              <IntroCopyContent
                introHighlight={labels.introHighlight}
                introRest={labels.introRest}
              />
            </p>
          </div>

          <DrawerRouteLinks
            hidden={flipRouteLinks.length > 0}
            label={labels.drawerNavigationTitle}
            locale={locale}
            onClick={closeProfileMenuForRoute}
            refs={drawerRouteRefs.current}
            routeItems={routeItems}
            title={labels.drawerNavigationTitle}
          />
        </section>
      </aside>
    </>
  );
}
