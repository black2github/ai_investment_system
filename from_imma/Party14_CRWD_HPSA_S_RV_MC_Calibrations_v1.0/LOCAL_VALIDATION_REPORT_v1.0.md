# Party 14 — local preflight validation v1.0

Build as_of: 2026-10-02

This report is a **local preflight**, not host acceptance. Authoritative acceptance remains: reverse_valuation sidecar → artifact_validator calibration mode → MC-G5-013 measured sigma with host correlation/persistence semantics → normative 500k common-path run.

## CRWD_mc_calibration_v1.0.yaml
- JSON Schema Draft 2020-12 errors: **0**
- Static MC-G5-013 preflight (RSS of local per-target effects; diagnostic only, not host measured sigma):
  - `revenue_model.segments.Subscription.initial_growth`: annual_growth, RSS=0.032311, cap=0.15, static_within_cap=True
  - `margin_model.terminal_margin_Y5`: margin, RSS=0.015000, cap=0.05, static_within_cap=True
  - `valuation.Y5.multiple`: valuation_log, RSS=0.020000, cap=0.15, static_within_cap=True

## HPSA_mc_calibration_v1.0.yaml
- JSON Schema Draft 2020-12 errors: **0**
- Static MC-G5-013 preflight (RSS of local per-target effects; diagnostic only, not host measured sigma):
  - `revenue_model.segments.Legacy_HPS_pre_AEG.initial_growth`: annual_growth, RSS=0.034191, cap=0.15, static_within_cap=True
  - `margin_model.terminal_margin_Y5`: margin, RSS=0.015000, cap=0.05, static_within_cap=True
  - `valuation.Y5.multiple`: valuation_log, RSS=0.018000, cap=0.15, static_within_cap=True

## S_mc_calibration_v1.0.yaml
- JSON Schema Draft 2020-12 errors: **0**
- Static MC-G5-013 preflight (RSS of local per-target effects; diagnostic only, not host measured sigma):
  - `revenue_model.segments.Platform.initial_growth`: annual_growth, RSS=0.031623, cap=0.15, static_within_cap=True
  - `valuation.Y5.multiple`: valuation_log, RSS=0.023324, cap=0.15, static_within_cap=True
  - `margin_model.terminal_margin_Y5`: margin, RSS=0.008000, cap=0.05, static_within_cap=True

## Reverse valuation deterministic preflight
- CRWD implied 5Y revenue CAGR: 60.5322589942%; PV terminal share: 0.940509.
- HPS.A implied 5Y revenue CAGR: 15.8630460578%; PV terminal share: 0.856877. AEG is excluded from Q2 operating base.
- S implied 5Y revenue CAGR: 28.5775396003%; PV terminal share: 0.924725. Starting 4.0% FCF margin is explicitly model_assumption normalization.

## Deliberate non-claims
- `PENDING_HOST_RUN:*` is intentional; no fabricated run_ref.
- No host MC dispersion, deterministic repeatability, or 500k outcome statistics are claimed by this package.
- HPS.A AEG financing capacity is not treated as funded debt; exact funded principal is undisclosed and left null.
- CRWD SBC and M&A burden remain explicit risks/failure channels; central valuation parameters were not reverse-fitted to observed price.
- Trigger ≠ Decision. Package contains no portfolio trade instruction.
