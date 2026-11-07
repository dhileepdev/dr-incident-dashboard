import { getState } from "@/lib/blob";

type Incident = {
  id: string;
  title: string;
  severity: string;
  status: string;
  service: string;
  source: string;
  runbook: string;
  createdAt: string;
};

type IncidentsData = {
  incidents: Incident[];
  generatedAt: string;
};

const EMPTY: IncidentsData = {
  incidents: [],
  generatedAt: "—",
};

export async function GET(_request: Request) {
  try {
    const repo = process.env.GITHUB_REPOSITORY;
    if (!repo) throw new Error("GITHUB_REPOSITORY not configured");

    const token = process.env.GITHUB_PAT;
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/alerts/last-run.json`,
      {
        headers: token
          ? { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }
          : { Accept: "application/vnd.github+json" },
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error(`GitHub API: ${res.status}`);

    const data = await res.json();
    const contentBase64 = data.content as string;
    if (!contentBase64) throw new Error("no content field");

    const decoded = Buffer.from(contentBase64, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);

    return Response.json({
      incidents: parsed.incidents ?? [],
      generatedAt: parsed.generatedAt ?? "—",
    });
  } catch {
    const fallback = (await getState<IncidentsData>(EMPTY)) ?? EMPTY;
    return Response.json(fallback, { status: 503 });
  }
}
