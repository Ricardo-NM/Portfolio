export type Theme = "light" | "dark";
export type Locale = "es" | "en";
export type ProfileLinkId = "linkedin" | "github" | "resume";
export type RouteLinkId =
  | "experience"
  | "achievements"
  | "projects"
  | "technologies"
  | "activity"
  | "contact";

export type FlipAvatar = {
  deltaX: number;
  deltaY: number;
  endRadius: string;
  scaleX: number;
  scaleY: number;
  startRadius: string;
  targetLeft: number;
  targetTop: number;
  targetWidth: number;
  targetHeight: number;
};

export type FlipProfileLink = FlipAvatar & {
  id: ProfileLinkId;
};

export type FlipRouteLink = FlipAvatar & {
  id: RouteLinkId;
  iconSize: number;
};

export type FlipIntroCopy = FlipAvatar & {
  variant: "drawer" | "intro";
};

export type ContributionDay = {
  contributionCount: number;
  date: string;
  weekday: number;
};

export type ContributionWeek = {
  contributionDays: ContributionDay[];
};

export type GitHubContributions = {
  totalContributions: number;
  weeks: ContributionWeek[];
};

export type GitHubContributionsStatus = "idle" | "loading" | "error";

export type GitHubContributionTooltip = {
  left: number;
  text: string;
  top: number;
};

export type PreferenceControlsMode =
  | "chrome"
  | "home"
  | "preferences"
  | "projects"
  | "technologies"
  | "activity"
  | "contact";

export type PreferenceControlsProps = {
  mode?: PreferenceControlsMode;
};

export type ContactSubmitStatus = "idle" | "sending" | "success" | "error";

export type RouteItem = {
  href: string;
  id: RouteLinkId;
  label: string;
  title: string;
};

export type TechnologyItem = {
  color: string;
  darkColor?: string;
  icon: string;
  label: string;
  lightColor?: string;
};
