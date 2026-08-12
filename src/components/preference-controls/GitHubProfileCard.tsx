import { BookMarked, MapPin, Star, Users } from "lucide-react";
import { useRef } from "react";
import { useLocaleFlip } from "../../hooks/useLocaleFlip";
import type { PreferenceLabels } from "./copy";

type GitHubProfileCardProps = {
  labels: PreferenceLabels;
};

export default function GitHubProfileCard({ labels }: GitHubProfileCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  useLocaleFlip(cardRef, [labels.githubAchievementsLabel]);

  return (
    <article
      className="github-profile-card"
      aria-label={labels.githubProfileSummaryLabel}
      ref={cardRef}
    >
      <div className="github-profile-card-head">
        <img
          src="/assets/profileGitHub.png"
          alt={labels.profileAlt}
          className="github-profile-avatar"
          loading="lazy"
        />

        <div className="github-profile-head-content">
          <div className="github-profile-identity">
            <strong>RICHARD</strong>
            <span>Ricardo-NM</span>
          </div>

          <div className="github-profile-achievements">
            <span className="github-profile-achievements-label">
              {labels.githubAchievementsLabel}
            </span>
            <img
              src="/assets/quickdraw-default-39c6aec8ff89.png"
              alt={labels.githubAchievementsLabel}
              className="github-profile-achievement"
              data-locale-flip-key="github-quickdraw-achievement"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <p className="github-profile-role">Full Stack Developer</p>

      <div className="github-profile-meta-row">
        <p className="github-profile-location">
          <MapPin aria-hidden="true" size={15} strokeWidth={1.8} />
          <strong>Hidalgo, MX (UTC -06:00)</strong>
        </p>

        <a
          className="github-profile-link-badge"
          href="https://github.com/Ricardo-NM"
          target="_blank"
          rel="noreferrer"
          aria-label={labels.githubLabel}
        >
          <span className="github-profile-link-bg" aria-hidden="true" />
          <span className="github-profile-link-icon">
            <span className="github-profile-github-icon" aria-hidden="true" />
          </span>
          <strong className="github-profile-link-text">
            {labels.githubViewProfileLabel}
          </strong>
        </a>
      </div>

      <span className="github-profile-divider" aria-hidden="true" />

      <div className="github-profile-footer">
        <div className="github-profile-stats">
          <p>
            <Users aria-hidden="true" size={15} strokeWidth={1.8} />
            <strong>1</strong>{" "}
            <span className="github-profile-stats-label">
              {labels.githubFollowerLabel}
            </span>
          </p>

          <p>
            <BookMarked aria-hidden="true" size={15} strokeWidth={1.8} />
            <strong>17</strong>{" "}
            <span className="github-profile-stats-label">
              {labels.githubRepositoriesLabel}
            </span>
          </p>
        </div>

        <span className="github-profile-pro-badge">
          <Star aria-hidden="true" size={13} strokeWidth={1.9} />
          <strong>PRO</strong>
        </span>
      </div>
    </article>
  );
}
