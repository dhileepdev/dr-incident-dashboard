# DR Incident Command Dashboard

Standalone portfolio project: Next.js dashboard on Vercel showing live
incidents with runbooks and an incident-commander view (ack/resolve/escalate).

Consumes synthetic alert data (see `dr-synthetic-alerts`) and persists
incident-commander state via Vercel Blob.

## What it demonstrates

- **Synthetic alert aggregation**: dashboard reads incident data from the
  synthetic alerts source (`alerts/last-run.json` via GitHub API).
- **Incident dashboard** (Vercel): polls alert data every 30s, shows incident
  list with severity/status cards, alert-source health, and an incident-detail
  page with runbook links.
- **Incident commander**: Acknowledge / Resolve / Escalate via a protected
  server-side API route (`/api/incidents/[id]` PATCH) that persists to Vercel
  Blob — no client-side token exposure.

## Repository layout

```
dashboard/
  app/
    page.tsx            # Server-rendered shell with polling
    api/
      incidents/route.ts          # GET: read alerts/last-run.json from GitHub
      incidents/[id]/route.ts     # PATCH: update incident status via Vercel Blob
  components/
    IncidentList.tsx
    IncidentCard.tsx
    IncidentActions.tsx   # Acknowledge / Resolve / Escalate
    RunbookLink.tsx
    AlertSourceHealth.tsx
    LastUpdated.tsx
  lib/
    blob.ts         # getState/setState via Vercel Blob
    poll.ts         # startPoll: 30s polling with stale fallback
  e2e/
    smoke.test.ts   # Playwright: incident list renders
runbooks/
  incident-response.md  # Sanitized incident response runbook
  high-severity.md      # Sanitized P1 runbook
  .env.example         # GITHUB_PAT, BLOB_READ_WRITE_TOKEN
vercel.json           # Vercel rewrite: /(.*) -> /dashboard/$1
```

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [Vercel](https://vercel.com/) account (Blob + GitHub integration)

## Local development

```bash
cd dashboard
cp .env.example .env.local   # fill in GITHUB_PAT, BLOB_READ_WRITE_TOKEN
npm install
npm run dev                  # http://localhost:3000
npm run build                # production build
npm test                     # vitest unit tests
npx playwright test          # Playwright e2e smoke test
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, add a new project and set the **root directory** to `dashboard/`.
3. Add these environment variables in Vercel project settings:

| Variable | Purpose |
|----------|---------|
| `GITHUB_PAT` | GitHub personal access token (`repo` scope) for reading the alerts repo and repo contents |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token for state persistence |
| `GITHUB_REPOSITORY` | Set automatically by Vercel when connected to GitHub |

4. Deploy. The dashboard polls every 30s and deploys on every push to `dashboard/`.

## E2E smoke test

```bash
cd dashboard
npx playwright install chromium   # one-time browser install
npx playwright test               # runs e2e/smoke.test.ts
```

The smoke test loads the dashboard and asserts the incident list and alert
source health sections render.

## License

MIT
