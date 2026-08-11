import { Languages, Moon, Settings, Sun } from "lucide-react";
import type { FocusEvent } from "react";
import type { PreferenceLabels } from "./copy";
import type { Locale, Theme } from "./types";

type PreferencesFloatProps = {
  isOpen: boolean;
  labels: PreferenceLabels;
  nextLocale: Locale;
  nextTheme: Theme;
  onClose: () => void;
  onMouseLeave: () => void;
  onOpen: () => void;
  onSetLocale: (locale: Locale) => void;
  onSetTheme: (theme: Theme) => void;
  onToggle: () => void;
  settingsLabel: string;
  theme: Theme;
  themeLabel: string;
  themeText: string;
};

export default function PreferencesFloat({
  isOpen,
  labels,
  nextLocale,
  nextTheme,
  onClose,
  onMouseLeave,
  onOpen,
  onSetLocale,
  onSetTheme,
  onToggle,
  settingsLabel,
  theme,
  themeLabel,
  themeText,
}: PreferencesFloatProps) {
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget;

    if (
      !(nextFocusedElement instanceof Node) ||
      !event.currentTarget.contains(nextFocusedElement)
    ) {
      onClose();
    }
  };

  return (
    <div
      className="preferences-float"
      onMouseLeave={onMouseLeave}
      onFocus={onOpen}
      onBlur={handleBlur}
    >
      <button
        className="settings-button"
        type="button"
        onMouseEnter={onOpen}
        onClick={onToggle}
        aria-controls="site-preferences"
        aria-expanded={isOpen}
        aria-label={settingsLabel}
        data-open={isOpen}
      >
        <Settings aria-hidden="true" size={26} strokeWidth={1.75} />
      </button>

      <div
        className="preference-controls"
        id="site-preferences"
        aria-label={labels.preferencesLabel}
        aria-hidden={!isOpen}
        data-open={isOpen}
        onMouseEnter={onOpen}
      >
        <button
          className="preference-button"
          type="button"
          tabIndex={isOpen ? 0 : -1}
          onClick={() => onSetLocale(nextLocale)}
          aria-label={labels.languageLabel}
        >
          <Languages aria-hidden="true" size={16} strokeWidth={1.8} />
          <span>{labels.languageText}</span>
        </button>

        <button
          className="preference-button"
          type="button"
          tabIndex={isOpen ? 0 : -1}
          onClick={() => onSetTheme(nextTheme)}
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
}
