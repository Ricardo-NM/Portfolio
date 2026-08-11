import type { ReactNode } from "react";
import RouteBreadcrumb from "../RouteBreadcrumb";

type RoutePageShellProps = {
  breadcrumbLabel: string;
  children?: ReactNode;
  homeLabel: string;
  subtitle: string;
  title: string;
  titleId: string;
};

export default function RoutePageShell({
  breadcrumbLabel,
  children,
  homeLabel,
  subtitle,
  title,
  titleId,
}: RoutePageShellProps) {
  return (
    <main className="experience-shell" aria-labelledby={titleId}>
      <div className="experience-content">
        <RouteBreadcrumb
          currentLabel={title}
          homeLabel={homeLabel}
          label={breadcrumbLabel}
        />

        <header className="experience-header">
          <h1 id={titleId}>{title}</h1>
          <p>{subtitle}</p>
        </header>

        {children}
      </div>
    </main>
  );
}
