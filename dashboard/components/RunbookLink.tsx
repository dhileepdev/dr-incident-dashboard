export default function RunbookLink({ runbook }: { runbook: string }) {
  return (
    <a
      href={`/${runbook.replace("runbooks/", "")}`}
      target="_blank"
      rel="noreferrer"
      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
    >
      <span>📄</span> {runbook.split("/").pop()}
    </a>
  );
}
