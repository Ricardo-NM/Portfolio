import type {
  CSSProperties,
  FocusEvent as ReactFocusEvent,
  MouseEvent as ReactMouseEvent,
  Ref,
} from "react";
import type { PreferenceLabels } from "./copy";
import type { ContributionDay, GitHubContributions, GitHubContributionsStatus, Locale } from "./types";
import { getContributionLevel } from "./utils";

type MonthMarker = {
  label: string;
  weekIndex: number;
};

type GitHubActivityProps = {
  activityRef?: Ref<HTMLDivElement>;
  calendarStyle: CSSProperties;
  className?: string;
  contributions: GitHubContributions | null;
  hidden?: boolean;
  labels: PreferenceLabels;
  locale: Locale;
  maxContributions: number;
  monthMarkers: MonthMarker[];
  onHideTooltip: () => void;
  onShowTooltip: (
    event: ReactMouseEvent<HTMLSpanElement> | ReactFocusEvent<HTMLSpanElement>,
    text: string,
  ) => void;
  scrollRef?: Ref<HTMLDivElement>;
  status: GitHubContributionsStatus;
  tooltipForDay: (day: ContributionDay) => string;
};

export default function GitHubActivity({
  activityRef,
  calendarStyle,
  className = "",
  contributions,
  hidden = false,
  labels,
  locale,
  maxContributions,
  monthMarkers,
  onHideTooltip,
  onShowTooltip,
  scrollRef,
  status,
  tooltipForDay,
}: GitHubActivityProps) {
  return (
    <div
      className={`github-activity ${className}`.trim()}
      aria-hidden={hidden}
      data-hidden={hidden}
      ref={activityRef}
    >
      <h4>{labels.githubActivityTitle}</h4>
      <div className="github-calendar-panel" data-state={status}>
        {status === "loading" && (
          <p className="github-calendar-message">
            {labels.githubActivityLoading}
          </p>
        )}

        {status === "error" && (
          <p className="github-calendar-message">
            {labels.githubActivityError}
          </p>
        )}

        {contributions && (
          <>
            <div
              className="github-calendar-scroll"
              ref={scrollRef}
              onScroll={onHideTooltip}
            >
              <div className="github-calendar-track" style={calendarStyle}>
                <div className="github-calendar-months" aria-hidden="true">
                  {monthMarkers.map((marker) => (
                    <span
                      key={`${marker.label}-${marker.weekIndex}`}
                      style={
                        {
                          gridColumn: `${marker.weekIndex + 1}`,
                        } as CSSProperties
                      }
                    >
                      {marker.label}
                    </span>
                  ))}
                </div>

                <div
                  className="github-calendar-grid"
                  aria-label={labels.githubActivityTitle}
                >
                  {contributions.weeks.map((week, weekIndex) =>
                    week.contributionDays.map((day) => {
                      const level = getContributionLevel(
                        day.contributionCount,
                        maxContributions,
                      );
                      const tooltipText = tooltipForDay(day);

                      return (
                        <span
                          aria-label={tooltipText}
                          className="github-calendar-day"
                          data-level={level}
                          key={day.date}
                          onBlur={onHideTooltip}
                          onFocus={(event) => onShowTooltip(event, tooltipText)}
                          onMouseEnter={(event) =>
                            onShowTooltip(event, tooltipText)
                          }
                          onMouseLeave={onHideTooltip}
                          onMouseMove={(event) =>
                            onShowTooltip(event, tooltipText)
                          }
                          style={
                            {
                              gridColumn: `${weekIndex + 1}`,
                              gridRow: `${day.weekday + 1}`,
                            } as CSSProperties
                          }
                        />
                      );
                    }),
                  )}
                </div>
              </div>
            </div>

            <div className="github-calendar-footer">
              <strong>
                {locale === "es"
                  ? `${contributions.totalContributions} contribuciones en el último año`
                  : `${contributions.totalContributions} contributions in the last year`}
              </strong>
              <span className="github-calendar-legend">
                <span className="github-calendar-legend-label">
                  {labels.githubActivityLess}
                </span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <i aria-hidden="true" data-level={level} key={level} />
                ))}
                <span className="github-calendar-legend-label">
                  {labels.githubActivityMore}
                </span>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
