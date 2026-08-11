import { Home } from "lucide-react";
import RouteIcon from "./RouteIcon";
import type { RouteItem } from "./types";

type FloatingNavProps = {
  currentPath: string;
  hidden?: boolean;
  hideRouteNavItems: boolean;
  homeLabel: string;
  label: string;
  routeItems: RouteItem[];
  routeLinksHidden: boolean;
};

export default function FloatingNav({
  currentPath,
  hidden = false,
  hideRouteNavItems,
  homeLabel,
  label,
  routeItems,
  routeLinksHidden,
}: FloatingNavProps) {
  const navItems = [
    {
      href: "/",
      label: homeLabel,
    },
    ...routeItems,
  ];

  return (
    <nav
      className="home-route-links"
      aria-label={label}
      data-hidden={hidden || routeLinksHidden}
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
            {routeId ? (
              <RouteIcon id={routeId} />
            ) : (
              <Home aria-hidden="true" size={24} strokeWidth={2.1} />
            )}
          </a>
        );
      })}
    </nav>
  );
}
