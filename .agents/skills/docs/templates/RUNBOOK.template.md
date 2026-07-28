# Runbook & Operations — <System>

> How to run, deploy, observe, and recover. Operational truth — commands must be
> sourced (scripts/CI/manifests), not guessed. Mark `Gap`/`Unknown`.

- **Environments:** _(dev / staging / prod)_ · **Last-synced:** `<commit>`

## Deployment
- **Pipeline:** _(CI/CD, where defined)_
- **Build & release:** _(commands, artifacts)_
- **Rollback:** _(how to revert a release)_
- **Config & secrets:** _(where set; never paste values)_

## Observability
- **Logs:** _(where, format)_ · **Metrics:** _(key SLIs)_ · **Traces:** _(…)_
- **Dashboards / alerts:** _(links)_

## Runbooks (incidents)
### <Symptom / alert>
1. _(diagnosis step)_
2. _(mitigation)_
3. _(escalation / owner)_

## Backups & recovery
_(Backup schedule, restore procedure, RPO/RTO.)_

## Security operations
_(Access control, secret rotation, audit, compliance touchpoints.)_
