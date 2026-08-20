import { Languages, Moon, Settings, Sun } from "lucide-react";
import type { FocusEvent, PointerEvent } from "react";
import { useRef } from "react";
import type { PreferenceLabels } from "./copy";
import type { Locale, Theme } from "./types";

type PreferencesFloatProps = {
  disabled?: boolean;
  entryAnimated?: boolean;
  entryReady?: boolean;
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
  disabled = false,
  entryAnimated = false,
  entryReady = true,
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
  const ignoreTouchFocusOpenRef = useRef(false);

  const handlePointerDownCapture = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    ignoreTouchFocusOpenRef.current = event.pointerType !== "mouse";
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget;

    if (
      !(nextFocusedElement instanceof Node) ||
      !event.currentTarget.contains(nextFocusedElement)
    ) {
      onClose();
    }
  };
  const handleOpen = () => {
    if (ignoreTouchFocusOpenRef.current) {
      ignoreTouchFocusOpenRef.current = false;
      return;
    }

    if (disabled) {
      return;
    }

    onOpen();
  };
  const handlePointerEnter = (
    event: PointerEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    if (event.pointerType === "mouse") {
      onOpen();
    }
  };
  const handleToggle = () => {
    ignoreTouchFocusOpenRef.current = false;

    if (disabled) {
      return;
    }

    onToggle();
  };

  return (
    <div
      className="preferences-float"
      data-entry-animated={entryAnimated}
      data-entry-disabled={disabled}
      data-entry-ready={entryReady}
      onMouseLeave={onMouseLeave}
      onPointerDownCapture={handlePointerDownCapture}
      onFocus={handleOpen}
      onBlur={handleBlur}
    >
      <button
        className="settings-button"
        type="button"
        disabled={disabled}
        onPointerEnter={handlePointerEnter}
        onClick={handleToggle}
        aria-controls="site-preferences"
        aria-expanded={isOpen}
        aria-label={settingsLabel}
        data-open={isOpen}
      >
        <Settings aria-hidden="true" size={20} strokeWidth={1.9} />
      </button>

      <div
        className="preference-controls"
        id="site-preferences"
        aria-label={labels.preferencesLabel}
        aria-hidden={!isOpen}
        data-open={isOpen}
        onPointerEnter={handlePointerEnter}
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
