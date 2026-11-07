# High Severity Incident Runbook

## Purpose
Response procedure for critical-severity incidents (P1) affecting core platform availability.

## Trigger
Automatic when any alert with `severity: critical` and `status: firing` is detected for more than 5 minutes.

## Immediate Actions
1. Page the on-call engineer.
2. Incident Commander declares P1 and opens incident channel.
3. Scribe starts timeline documentation.
4. Communications notifies stakeholders.

## Mitigation Checklist
- [ ] Confirm alert validity (not a monitoring false positive).
- [ ] Identify affected service(s) and region(s).
- [ ] Apply failover to secondary region if available.
- [ ] Scale affected service if resource exhaustion.
- [ ] Rollback recent deployments if correlated with incident start.
- [ ] Enable circuit breakers to protect downstream dependencies.

## Resolution Criteria
- [ ] Service health checks return OK for 15 consecutive minutes.
- [ ] Error rate below 0.1%.
- [ ] No customer-facing impact reported.

## Post-Incident
- Postmortem within 48 business hours.
- Action items tracked to closure.

---

**Public-safe version:** No real customer data, internal architecture, or credentials.
