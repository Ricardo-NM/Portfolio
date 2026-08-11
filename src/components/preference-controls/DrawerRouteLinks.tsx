import type { MouseEventHandler } from "react";
import RouteIcon from "./RouteIcon";
import type { Locale, RouteItem, RouteLinkId } from "./types";

type DrawerRouteLinksProps = {
  hidden?: boolean;
  label: string;
  locale: Locale;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  refs: Record<RouteLinkId, HTMLSpanElement | null>;
  routeItems: RouteItem[];
  title: string;
};

export default function DrawerRouteLinks({
  hidden = false,
  label,
  locale,
  onClick,
  refs,
  routeItems,
  title,
}: DrawerRouteLinksProps) {
  return (
    <div
      className="profile-route-list"
      aria-label={locale === "es" ? "Secciones" : "Sections"}
    >
      <h4>{title}</h4>
      {routeItems.map((item) => (
        <div className="profile-route-link" key={item.id}>
          <span
            className="profile-route-icon"
            data-hidden={hidden}
            ref={(element) => {
              refs[item.id] = element;
            }}
          >
            <RouteIcon id={item.id} size={20} />
          </span>
          <a
            className="profile-route-title"
            href={item.href}
            aria-label={item.label ?? label}
            onClick={onClick}
          >
            {item.title}
          </a>
        </div>
      ))}
    </div>
  );
}
