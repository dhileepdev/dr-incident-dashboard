import IncidentCard from "./IncidentCard";

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

export default function IncidentList({
  incidents,
}: {
  incidents: Incident[];
}) {
  const bySeverity = incidents.reduce(
    (acc, inc) => {
      acc[inc.severity] = (acc[inc.severity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="bg-white p-4 rounded shadow border">
      <h2 className="font-semibold mb-2">Incidents</h2>
      {incidents.length === 0 ? (
        <p className="text-sm text-gray-500">No active incidents</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-xs font-semibold text-gray-600 uppercase">
                By severity
              </p>
              <div className="flex gap-2">
                {["critical", "high", "medium", "low"].map((sev) => (
                  <div
                    key={sev}
                    className="flex-1 text-center p-2 rounded text-xs font-medium"
                    style={{
                      backgroundColor:
                        sev === "critical"
                          ? "#fef2f2"
                          : sev === "high"
                            ? "#fff7ed"
                            : sev === "medium"
                              ? "#fefce8"
                              : "#eff6ff",
                      color:
                        sev === "critical"
                          ? "#991b1b"
                          : sev === "high"
                            ? "#9c4221"
                            : sev === "medium"
                              ? "#713f12"
                              : "#1e3a8a",
                    }}
                  >
                    {sev}: {bySeverity[sev] || 0}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-xs font-semibold text-gray-600 uppercase">
                Total
              </p>
              <p className="text-xl font-bold">{incidents.length}</p>
            </div>
          </div>
          {incidents.map((inc) => (
            <IncidentCard key={inc.id} incident={inc} />
          ))}
        </>
      )}
    </div>
  );
}
