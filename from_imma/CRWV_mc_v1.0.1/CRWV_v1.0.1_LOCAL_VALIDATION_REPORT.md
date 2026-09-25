# CRWV MC v1.0.1 — Local Validation Report

Date: 2026-09-25

## Supersedes integrity
- Removed paths: **0**
- Added paths: **0**
- Changed scalar nodes: **3**
- Changed nodes are exactly the three `effect_per_plus_1sigma` values targeting `margin_model.capex_revenue_nodes.Y2`.

## Delta
- `DATA_CENTER_POWER`: `-0.018` -> `-0.0153` (x0.85)
- `TAIWAN_SUPPLY`: `-0.014` -> `-0.0119` (x0.85)
- `CAPITAL_MARKETS`: `-0.014` -> `-0.0119` (x0.85)

## Invariants checked
- YAML parses successfully.
- `schema_version` remains 1.0.2.
- `calculation_engine_version` remains `company_mc 2.3.1`.
- No distribution node, mode/center, valuation node, robustness node, lag or decay changed.
- Driver mapping structure and all paths are preserved.

## Host-only checks not claimed locally
- Measured MC-G5-013 sigma. Host preview supplied by integrator: ~0.048 for Y2 capex target at x0.85.
- Dry-run `mapping_warnings=[]` / runtime determinism.
- Intrinsic/full W and normative 500k outputs.
- Robustness response metrics.
