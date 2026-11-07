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

const SEVERITY_COLOR: Record<string, string> = {
  critical: "text-red-600 bg-red-50",
  high: "text-orange-600 bg-orange-50",
  medium: "text-yellow-600 bg-yellow-50",
  low: "text-blue-600 bg-blue-50",
};

export default function IncidentCard({ incident }: { incident: Incident }) {
  return (
    <div className="bg-white p-3 rounded shadow border mb-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-sm">{incident.title}</h3>
          <p className="text-xs text-gray-500">
            {incident.service} • {incident.source}
          </p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${SEVERITY_COLOR[incident.severity] || SEVERITY_COLOR.low}`}>
          {incident.severity}
        </span>
      </div>
      <div className="mt-2 flex gap-2">
        <span className={`px-2 py-1 rounded text-xs border ${
          incident.status === "firing"
            ? "border-red-500 text-red-600 bg-red-50"
            : incident.status === "resolved"
              ? "border-green-500 text-green-600 bg-green-50"
              : "border-yellow-500 text-yellow-600 bg-yellow-50"
        }`}>
          {incident.status}
        </span>
        <a
          href={incident.runbook}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          Runbook
        </a>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(incident.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
