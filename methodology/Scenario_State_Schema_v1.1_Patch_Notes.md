# Scenario State Schema v1.1 — Patch Notes

Supersedes: `Scenario_State_Schema_v1.0`.

Semantic change: action/signal runtime linkage only; recognition semantics unchanged.

Added to both scenario and phase runtime:
- `strategy_ref`
- `strategy_status`
- `last_signal_at`
- `last_signal_id`

Added to scenario runtime:
- `strategy_review_required`
- `strategy_review_reason`

Removed schema paths relative to v1.0: **0**.

The existing statuses `not_observed | candidate | confirmed | exited`, evidence records, confirmed quarter and conditional anchor are unchanged.
