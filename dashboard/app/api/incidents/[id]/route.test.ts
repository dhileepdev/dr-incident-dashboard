/// <reference types="vitest/globals" />
import { PATCH } from "./route";

const mockRequest = new Request("http://localhost/api/incidents/inc-1", {
  method: "PATCH",
  body: JSON.stringify({ status: "acknowledged" }),
});

const mockFetch = vi.spyOn(globalThis, "fetch");

beforeEach(() => {
  process.env.GITHUB_REPOSITORY = "owner/repo";
  mockFetch.mockReset();
});

it("updates incident status via PATCH", async () => {
  mockFetch.mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        content: "eyJpbmNpZGVudHMiOlt7ImlkIjoiaW5jLTEiLCJ0aXRsZSI6IlRlc3QgaW5jaWRlbnQiLCJzZXZlcml0eSI6ImhpZ2giLCJzdGF0dXMiOiJmaXJpbmciLCJzZXJ2aWNlIjoiYXV0aC1zZXJ2aWNlIiwic291cmNlIjoiY2xvdWR3YXRjaCIsInJ1bmJvb2siOiJydW5ib29rcy9oaWdoLXNldmVyaXR5Lm1kIiwiY3JlYXRlZEF0IjoiMjAyNi0xMS0wN1QxMDowMDowMFoifV0sImdlbmVyYXRlZEF0IjoiMjAyNi0xMS0wN1QxMDowMDowMFoifQ==",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  );

  const res = await PATCH(mockRequest, { params: Promise.resolve({ id: "inc-1" }) });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json.incident.status).toBe("acknowledged");
});
