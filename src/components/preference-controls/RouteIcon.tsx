import {
  BriefcaseBusiness,
  CalendarRange,
  CodeXml,
  FolderCode,
  Mail,
  Trophy,
} from "lucide-react";
import type { RouteLinkId } from "./types";

type RouteIconProps = {
  id: RouteLinkId;
  size?: number;
};

export default function RouteIcon({ id, size = 24 }: RouteIconProps) {
  if (id === "experience") {
    return (
      <BriefcaseBusiness aria-hidden="true" size={size} strokeWidth={2.1} />
    );
  }

  if (id === "technologies") {
    return <CodeXml aria-hidden="true" size={size + 1} strokeWidth={2.1} />;
  }

  if (id === "achievements") {
    return <Trophy aria-hidden="true" size={size} strokeWidth={2.1} />;
  }

  if (id === "projects") {
    return <FolderCode aria-hidden="true" size={size} strokeWidth={2.1} />;
  }

  if (id === "activity") {
    return <CalendarRange aria-hidden="true" size={size} strokeWidth={2.1} />;
  }

  return <Mail aria-hidden="true" size={size} strokeWidth={2.1} />;
}
