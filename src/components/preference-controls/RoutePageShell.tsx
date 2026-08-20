import type { CSSProperties, ReactNode } from "react";
import AnimatedDescription, {
  getDescriptionStartDelay,
  getMobileContentStartDelay,
} from "../AnimatedDescription";
import AnimatedTitle from "../AnimatedTitle";
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
    <main
      className="experience-shell"
      aria-labelledby={titleId}
      style={
        {
          "--route-description-start-delay": `${getDescriptionStartDelay(title)}ms`,
          "--route-description-start-delay-mobile": `${getMobileContentStartDelay(title, subtitle)}ms`,
        } as CSSProperties
      }
    >
      <div className="experience-content">
        <RouteBreadcrumb
          currentLabel={title}
          homeLabel={homeLabel}
          label={breadcrumbLabel}
        />

        <header className="experience-header">
          <AnimatedTitle id={titleId} text={title} />
          <AnimatedDescription text={subtitle} title={title} />
        </header>

        {children}
      </div>
    </main>
  );
}
