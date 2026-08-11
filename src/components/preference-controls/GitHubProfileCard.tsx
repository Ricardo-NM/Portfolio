import { BookMarked, MapPin, Star, Users } from "lucide-react";
import type { PreferenceLabels } from "./copy";

type GitHubProfileCardProps = {
  labels: PreferenceLabels;
};

export default function GitHubProfileCard({ labels }: GitHubProfileCardProps) {
  return (
    <article
      className="github-profile-card"
      aria-label={labels.githubProfileSummaryLabel}
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
            <span>{labels.githubAchievementsLabel}</span>
            <img
              src="/assets/quickdraw-default-39c6aec8ff89.png"
              alt={labels.githubAchievementsLabel}
              className="github-profile-achievement"
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
          <span className="github-profile-github-icon" aria-hidden="true" />
          <strong>{labels.githubViewProfileLabel}</strong>
        </a>
      </div>

      <span className="github-profile-divider" aria-hidden="true" />

      <div className="github-profile-footer">
        <div className="github-profile-stats">
          <p>
            <Users aria-hidden="true" size={15} strokeWidth={1.8} />
            <strong>1</strong> {labels.githubFollowerLabel}
          </p>

          <p>
            <BookMarked aria-hidden="true" size={15} strokeWidth={1.8} />
            <strong>17</strong> {labels.githubRepositoriesLabel}
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
