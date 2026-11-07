import React from "react";

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

type StatusAction = {
  status: string;
  label: string;
  color: string;
};

const STATUS_ACTIONS: StatusAction[] = [
  { status: "acknowledged", label: "Acknowledge", color: "text-yellow-600 bg-yellow-50 border-yellow-500" },
  { status: "resolved", label: "Resolve", color: "text-green-600 bg-green-50 border-green-500" },
  { status: "escalated", label: "Escalate", color: "text-red-600 bg-red-50 border-red-500" },
];

export default function IncidentActions({
  incident,
  onUpdate,
}: {
  incident: Incident;
  onUpdate: (updatedIncident: Incident) => void;
}) {
  const [updating, setUpdating] = React.useState<Set<string>>(new Set());

  async function handleStatusChange(newStatus: string) {
    if (updating.has(newStatus)) return;
    setUpdating((prev) => new Set([...prev, newStatus]));

    try {
      const res = await fetch(`/api/incidents/${incident.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        console.error("Failed to update incident status");
        return;
      }

      const data = await res.json();
      onUpdate(data.incident);
    } catch {
      console.error("Failed to update incident status");
    } finally {
      setUpdating((prev) => {
        const next = new Set(prev);
        next.delete(newStatus);
        return next;
      });
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow border">
      <h2 className="font-semibold mb-2">Incident Actions</h2>
      <p className="text-xs text-gray-500 mb-3">Current status: <span className="font-medium">{incident.status}</span></p>
      <div className="flex flex-wrap gap-2">
        {STATUS_ACTIONS.map((action) => {
          const isUpdating = updating.has(action.status);
          const isCurrent = incident.status === action.status;
          return (
            <button
              key={action.status}
              onClick={() => (isCurrent || isUpdating ? undefined : handleStatusChange(action.status))}
              disabled={isCurrent || isUpdating}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                isCurrent
                  ? "bg-gray-200 text-gray-600"
                  : action.color
              }`}
            >
              {isUpdating ? "…" : action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
