import { ChevronRight, Home } from "lucide-react";

type RouteBreadcrumbProps = {
  currentLabel: string;
  homeLabel: string;
  label: string;
  links?: Array<{
    href: string;
    label: string;
  }>;
};

export default function RouteBreadcrumb({
  currentLabel,
  homeLabel,
  label,
  links = [],
}: RouteBreadcrumbProps) {
  return (
    <nav className="route-breadcrumb" aria-label={label}>
      <a className="route-breadcrumb-home" href="/" aria-label={homeLabel}>
        <Home aria-hidden="true" size={17} strokeWidth={2} />
      </a>
      {links.map((link) => (
        <span className="route-breadcrumb-segment" key={link.href}>
          <ChevronRight
            aria-hidden="true"
            className="route-breadcrumb-separator"
            size={15}
            strokeWidth={2}
          />
          <a className="route-breadcrumb-link" href={link.href}>
            {link.label}
          </a>
        </span>
      ))}
      <ChevronRight
        aria-hidden="true"
        className="route-breadcrumb-separator"
        size={15}
        strokeWidth={2}
      />
      <span className="route-breadcrumb-current" aria-current="page">
        {currentLabel}
      </span>
    </nav>
  );
}
