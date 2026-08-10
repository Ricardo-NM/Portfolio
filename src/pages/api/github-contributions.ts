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

  const to = new Date();
  const from = new Date(to);
  from.setFullYear(from.getFullYear() - 1);

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    body: JSON.stringify({
      query: contributionQuery,
      variables: {
        from: from.toISOString(),
        login: GITHUB_LOGIN,
        to: to.toISOString(),
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
      weeks: calendar.weeks,
    }),
    {
      headers: {
        "cache-control": "public, max-age=1800",
        "content-type": "application/json",
      },
    },
  );
};
