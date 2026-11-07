import { put } from "@vercel/blob";

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

const STATE_KEY = "dashboard-state.json";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !["firing", "acknowledged", "resolved", "escalated"].includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    // Read current incidents from GitHub API (authoritative source)
    const repo = process.env.GITHUB_REPOSITORY;
    let incidents: Incident[] = [];

    if (repo) {
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

      if (res.ok) {
        const data = await res.json();
        const contentBase64 = data.content as string;
        if (contentBase64) {
          const decoded = Buffer.from(contentBase64, "base64").toString("utf-8");
          const parsed = JSON.parse(decoded);
          incidents = parsed.incidents ?? [];
        }
      }
    }

    const incidentIndex = incidents.findIndex((i) => i.id === id);
    if (incidentIndex === -1) {
      return Response.json({ error: "Incident not found" }, { status: 404 });
    }

    incidents[incidentIndex] = { ...incidents[incidentIndex], status };

    // Persist updated state to Vercel Blob
    try {
      await put(STATE_KEY, JSON.stringify({ incidents, generatedAt: new Date().toISOString() }), {
        access: "public",
      });
    } catch {
      // Blob not configured locally — state update still returned
    }

    return Response.json({ incident: incidents[incidentIndex] });
  } catch {
    return Response.json({ error: "Failed to update incident" }, { status: 500 });
  }
}
