# Incident Response Runbook

## Purpose
Standardized response procedure for high-severity incidents affecting customer-facing services.

## Scope
Applies to all production services in the DR landing zone (AWS ap-southeast-2).

## Roles
- **Incident Commander**: Overall response lead, declares severity, authorizes rollback.
- **Scribe**: Documents timeline and decisions.
- **Communications**: Sends status updates to stakeholders.

## Phases

### 1. Detect & Triage (0–15 min)
- Confirm the alert is not a false positive.
- Identify affected services and blast radius.
- Assign Incident Commander and Scribe.
- Open an incident channel.

### 2. Mitigate (15–60 min)
- Apply immediate mitigation (scale, rollback, circuit breaker, failover).
- Document all changes in the incident channel.
- Update incident status to `acknowledged`.

### 3. Resolve (60+ min)
- Identify root cause.
- Apply permanent fix.
- Verify service recovery via health checks.
- Update incident status to `resolved`.

### 4. Post-Incident (within 48h)
- Write postmortem with timeline, root cause, and action items.
- Review and close the incident.

## Escalation
If mitigation does not restore service within 60 minutes, escalate to the on-call engineering manager.

---

**Public-safe version:** All customer names, internal hostnames, account IDs, and proprietary procedures removed.
