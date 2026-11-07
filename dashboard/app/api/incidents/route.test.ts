/// <reference types="vitest/globals" />
import { GET } from "./route";

const mockRequest = new Request("http://localhost/api/incidents");

const mockFetch = vi.spyOn(globalThis, "fetch");

const GITHUB_CONTENT_API =
  "https://api.github.com/repos/owner/repo/contents/alerts/last-run.json";
const BLOB_URL = "https://public.blob.vercel-storage.com/dashboard-state.json";

beforeEach(() => {
  process.env.GITHUB_REPOSITORY = "owner/repo";
  mockFetch.mockReset();
});

it("returns incidents from alerts/last-run.json", async () => {
  const alerts = {
    incidents: [
      {
        id: "inc-1000",
        title: "High auth-service latency detected",
        severity: "critical",
        status: "firing",
        service: "auth-service",
        source: "cloudwatch",
        runbook: "runbooks/high-severity.md",
        createdAt: "2026-11-07T10:00:00Z",
      },
    ],
    generatedAt: "2026-11-07T10:00:00Z",
  };

  mockFetch.mockImplementation((url: string | Request | URL) => {
    const u = String(url);
    if (u === GITHUB_CONTENT_API) {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            content: Buffer.from(JSON.stringify(alerts)).toString("base64"),
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );
    }
    if (u === BLOB_URL) {
      return Promise.resolve(new Response(null, { status: 404 }));
    }
    return Promise.resolve(new Response(null, { status: 404 }));
  });

  const res = await GET(mockRequest);
  const json = await res.json();
  expect(json.incidents).toBeDefined();
  expect(json.incidents.length).toBe(1);
  expect(json.incidents[0].severity).toBe("critical");
});
