import type { APIRoute } from "astro";
import { loadEnv } from "vite";

const serverProcess = globalThis as typeof globalThis & {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

type GitHubContributionDay = {
  contributionCount: number;
  date: string;
  weekday: number;
};

type GitHubContributionWeek = {
  contributionDays: GitHubContributionDay[];
};

type GitHubContributionResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: GitHubContributionWeek[];
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
};

const GITHUB_LOGIN = "Ricardo-NM";
const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const GITHUB_CALENDAR_UTC_OFFSET_MINUTES = -6 * 60;

const contributionQuery = `
  query GitHubContributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

function padDatePart(value: number) {
  return value.toString().padStart(2, "0");
}

function getFixedOffsetDateParts(date: Date) {
  const offsetDate = new Date(
    date.getTime() + GITHUB_CALENDAR_UTC_OFFSET_MINUTES * 60 * 1000,
  );

  return {
    dateString: [
      offsetDate.getUTCFullYear(),
      padDatePart(offsetDate.getUTCMonth() + 1),
      padDatePart(offsetDate.getUTCDate()),
    ].join("-"),
    day: offsetDate.getUTCDate(),
    hours: offsetDate.getUTCHours(),
    milliseconds: offsetDate.getUTCMilliseconds(),
    minutes: offsetDate.getUTCMinutes(),
    month: offsetDate.getUTCMonth(),
    seconds: offsetDate.getUTCSeconds(),
    year: offsetDate.getUTCFullYear(),
  };
}

function formatDateTimeWithFixedOffset(parts: ReturnType<typeof getFixedOffsetDateParts>) {
  return `${parts.dateString}T${padDatePart(parts.hours)}:${padDatePart(
    parts.minutes,
  )}:${padDatePart(parts.seconds)}.${parts.milliseconds
    .toString()
    .padStart(3, "0")}-06:00`;
}

export const GET: APIRoute = async () => {
  const token =
    serverProcess.process?.env?.GITHUB_TOKEN ??
    loadEnv("", ".", "").GITHUB_TOKEN;

  if (!token) {
    return new Response(
      JSON.stringify({ message: "GITHUB_TOKEN is not configured." }),
      {
        headers: { "content-type": "application/json" },
        status: 500,
      },
    );
  }

  const now = new Date();
  const toParts = getFixedOffsetDateParts(now);
  const fromLocalDate = new Date(
    Date.UTC(
      toParts.year - 1,
      toParts.month,
      toParts.day,
      toParts.hours,
      toParts.minutes,
      toParts.seconds,
      toParts.milliseconds,
    ),
  );
  const fromParts = getFixedOffsetDateParts(
    new Date(
      fromLocalDate.getTime() -
        GITHUB_CALENDAR_UTC_OFFSET_MINUTES * 60 * 1000,
    ),
  );

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    body: JSON.stringify({
      query: contributionQuery,
      variables: {
        from: formatDateTimeWithFixedOffset(fromParts),
        login: GITHUB_LOGIN,
        to: formatDateTimeWithFixedOffset(toParts),
      },
    }),
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    return new Response(
      JSON.stringify({ message: "GitHub request failed." }),
      {
        headers: { "content-type": "application/json" },
        status: response.status,
      },
    );
  }

  const payload = (await response.json()) as GitHubContributionResponse;
  const calendar =
    payload.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar || payload.errors?.length) {
    return new Response(
      JSON.stringify({
        message:
          payload.errors?.[0]?.message ?? "GitHub contribution data is empty.",
      }),
      {
        headers: { "content-type": "application/json" },
        status: 502,
      },
    );
  }

  return new Response(
    JSON.stringify({
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks
        .map((week) => ({
          contributionDays: week.contributionDays.filter(
            (day) => day.date <= toParts.dateString,
          ),
        }))
        .filter((week) => week.contributionDays.length > 0),
    }),
    {
      headers: {
        "cache-control": "public, max-age=1800",
        "content-type": "application/json",
      },
    },
  );
};
