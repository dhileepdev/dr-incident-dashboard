type SourceHealth = {
  name: string;
  healthy: boolean;
  lastChecked: string | null;
};

export default function AlertSourceHealth({
  sources,
}: {
  sources: SourceHealth[];
}) {
  return (
    <div className="bg-white p-4 rounded shadow border">
      <h2 className="font-semibold mb-2">Alert Sources</h2>
      <div className="flex flex-wrap gap-2">
        {sources.map((source) => (
          <div
            key={source.name}
            className={`p-2 rounded text-xs font-medium flex items-center gap-2 ${
              source.healthy
                ? "text-green-600 bg-green-50 border-green-500"
                : "text-red-600 bg-red-50 border-red-500"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                source.healthy ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span>{source.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
