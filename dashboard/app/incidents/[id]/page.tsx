"use client";

import IncidentCard from "@/components/IncidentCard";
import IncidentActions from "@/components/IncidentActions";
import RunbookLink from "@/components/RunbookLink";

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

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `https://api.github.com/repos/owner/repo/contents/alerts/last-run.json`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_PAT
          ? { Authorization: `Bearer ${process.env.GITHUB_PAT}` }
          : {}),
      },
      cache: "no-store",
    }
  );

  let incident: Incident | null = null;

  if (res.ok) {
    const data = await res.json();
    const contentBase64 = data.content as string;
    if (contentBase64) {
      const decoded = Buffer.from(contentBase64, "base64").toString("utf-8");
      const parsed = JSON.parse(decoded);
      incident = parsed.incidents?.find((i: Incident) => i.id === id) ?? null;
    }
  }

  if (!incident) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Incident Not Found</h1>
        <p className="text-gray-500">Incident "{id}" could not be found.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Incident {incident.id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow border">
          <h2 className="font-semibold mb-2">Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Title</dt>
              <dd>{incident.title}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Service</dt>
              <dd>{incident.service}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Source</dt>
              <dd>{incident.source}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Created</dt>
              <dd>{new Date(incident.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <h2 className="font-semibold mb-2">Status & Severity</h2>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              incident.severity === "critical"
                ? "text-red-600 bg-red-50"
                : incident.severity === "high"
                  ? "text-orange-600 bg-orange-50"
                  : incident.severity === "medium"
                    ? "text-yellow-600 bg-yellow-50"
                    : "text-blue-600 bg-blue-50"
            }`}>
              {incident.severity}
            </span>
            <span className={`px-2 py-1 rounded text-xs border ${
              incident.status === "firing"
                ? "border-red-500 text-red-600 bg-red-50"
                : incident.status === "resolved"
                  ? "border-green-500 text-green-600 bg-green-50"
                  : "border-yellow-500 text-yellow-600 bg-yellow-50"
            }`}>
              {incident.status}
            </span>
          </div>
          <div className="mt-2">
            <RunbookLink runbook={incident.runbook} />
          </div>
        </div>
      </div>
      <IncidentCard incident={incident} />
      <IncidentActions incident={incident} onUpdate={(updated) => {
        // In a client component with Blob persistence, state updates
        // are reflected via the PATCH response; re-fetch would be needed
        // for full sync. For demo purposes, the PATCH response updates locally.
      }} />
    </main>
  );
}
