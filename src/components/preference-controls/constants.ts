export const STORAGE_KEYS = {
  theme: "rn-theme",
  locale: "rn-locale",
} as const;

export const CONTACT_LEAVE_FADE_DURATION_MS = 180;
export const CONTACT_SUCCESS_AUTO_CLOSE_MS = 3000;
export const CONTACT_MESSAGE_MAX_LENGTH = 1200;
export const UNSAFE_CONTACT_MESSAGE_PATTERN =
  /<\s*\/?\s*(script|iframe|object|embed|link|meta|style|form|input|button|textarea|svg|math|img|video|audio|source|base)\b|javascript\s*:|data\s*:\s*(text\/html|application\/javascript)|on[a-z]+\s*=/i;

export const MONTH_LABELS = {
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
