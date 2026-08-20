import { Home } from "lucide-react";
import type { AnimationEvent, CSSProperties, MouseEvent } from "react";
import { useEffect, useState } from "react";
import RouteIcon from "./RouteIcon";
import type { RouteItem } from "./types";

const NAV_ICON_SIZE = 20;

type FloatingNavProps = {
  currentPath: string;
  disabled?: boolean;
  entryAnimated?: boolean;
  entryReady?: boolean;
  hidden?: boolean;
  hideRouteNavItems: boolean;
  homeLabel: string;
  label: string;
  onEntryComplete?: () => void;
  routeItems: RouteItem[];
  routeLinksHidden: boolean;
};

export default function FloatingNav({
  currentPath,
  disabled = false,
  entryAnimated = false,
  entryReady = true,
  hidden = false,
  hideRouteNavItems,
  homeLabel,
  label,
  onEntryComplete,
  routeItems,
  routeLinksHidden,
}: FloatingNavProps) {
  const [optimisticPath, setOptimisticPath] = useState<string | null>(null);
  const navItems = [
    {
      href: "/",
      label: homeLabel,
    },
    ...routeItems,
  ];
  const activePath = optimisticPath ?? currentPath;

  useEffect(() => {
    if (optimisticPath === currentPath) {
      setOptimisticPath(null);
    }
  }, [currentPath, optimisticPath]);

  return (
    <nav
      className="home-route-links"
      aria-label={label}
      data-hidden={hidden || routeLinksHidden}
      data-instant-hidden={hidden}
      data-entry-animated={entryAnimated}
      data-entry-disabled={disabled}
      data-entry-ready={entryReady}
    >
      {navItems.map((item, index) => {
        const isActive = activePath === item.href;
        const routeId = "id" in item ? item.id : undefined;
        const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
          if (disabled) {
            event.preventDefault();
            return;
          }

          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          ) {
            return;
          }

          setOptimisticPath(item.href);

          if (event.detail > 0) {
            event.currentTarget.blur();
          }
        };
        const handleAnimationEnd = (
          event: AnimationEvent<HTMLAnchorElement>,
        ) => {
          if (
            event.currentTarget !== event.target ||
            event.animationName !== "home-route-link-slide-scale-in" ||
            index !== navItems.length - 1
          ) {
            return;
          }

          onEntryComplete?.();
        };

        return (
          <a
            className="home-route-link"
            href={item.href}
            aria-disabled={disabled || undefined}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.label}
            data-active={isActive}
            data-entry-disabled={disabled}
            data-route-id={routeId}
            data-route-hidden={Boolean(routeId && hideRouteNavItems)}
            onAnimationEnd={handleAnimationEnd}
            onClick={handleClick}
            key={item.href}
            tabIndex={disabled ? -1 : undefined}
            style={{ "--nav-item-index": index } as CSSProperties}
          >
            {routeId ? (
              <RouteIcon id={routeId} size={NAV_ICON_SIZE} />
            ) : (
              <Home aria-hidden="true" size={NAV_ICON_SIZE} strokeWidth={2.1} />
            )}
          </a>
        );
      })}
    </nav>
  );
}
