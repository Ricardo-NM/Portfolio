import { ChevronRight, Home } from "lucide-react";

type RouteBreadcrumbProps = {
  currentLabel: string;
  homeLabel: string;
  label: string;
};

export default function RouteBreadcrumb({
  currentLabel,
  homeLabel,
  label,
}: RouteBreadcrumbProps) {
  return (
    <nav className="route-breadcrumb" aria-label={label}>
      <a className="route-breadcrumb-home" href="/" aria-label={homeLabel}>
        <Home aria-hidden="true" size={17} strokeWidth={2} />
      </a>
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
