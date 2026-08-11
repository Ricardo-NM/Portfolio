import type { PreferenceLabels } from "./copy";
import ProfileLinkIcon from "./ProfileLinkIcon";
import type { Locale, ProfileLinkId } from "./types";

type ProfileLinksProps = {
  className?: string;
  hidden?: boolean;
  labels: PreferenceLabels;
  locale: Locale;
  refs: Record<ProfileLinkId, HTMLAnchorElement | null>;
};

export default function ProfileLinks({
  className = "profile-links",
  hidden = false,
  labels,
  locale,
  refs,
}: ProfileLinksProps) {
  return (
    <div
      className={className}
      aria-label={locale === "es" ? "Enlaces de perfil" : "Profile links"}
    >
      <a
        className="profile-link"
        href="https://www.linkedin.com/in/ricardo-nava-mayoral/"
        target="_blank"
        rel="noreferrer"
        aria-label={labels.linkedinLabel}
        ref={(element) => {
          refs.linkedin = element;
        }}
        data-hidden={hidden}
      >
        <ProfileLinkIcon id="linkedin" />
      </a>

      <a
        className="profile-link"
        href="https://github.com/Ricardo-NM"
        target="_blank"
        rel="noreferrer"
        aria-label={labels.githubLabel}
        ref={(element) => {
          refs.github = element;
        }}
        data-hidden={hidden}
      >
        <ProfileLinkIcon id="github" />
      </a>

      <a
        className="profile-link"
        href="/assets/CV_Ricardo_Nava_Mayoral.pdf"
        download
        aria-label={labels.resumeLabel}
        ref={(element) => {
          refs.resume = element;
        }}
        data-hidden={hidden}
      >
        <ProfileLinkIcon id="resume" />
      </a>
    </div>
  );
}
