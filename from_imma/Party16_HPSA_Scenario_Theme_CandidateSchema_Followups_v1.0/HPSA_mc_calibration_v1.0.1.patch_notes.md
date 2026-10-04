# HPS.A MC Calibration v1.0.1 — Patch Notes

## Scope
Full-text reissue of `HPSA_mc_calibration_v1.0.yaml`. Distribution centers, triangular nodes, correlations, seed, idiosyncratic process, reverse-valuation reference and robustness perturbation definitions are unchanged.

## Delta
1. Added `CAPITAL_MARKETS` to `joint_simulation.active_drivers` and a Y5 valuation mapping: `+1σ -> +0.025` log-multiple, lag 0Q, half-life 6Q. A negative scenario shock therefore compresses valuation/refinancing conditions.
2. Added `TAIWAN_SUPPLY` to `joint_simulation.active_drivers` and an indirect demand mapping: `+1σ -> +1.0pp` to Legacy HPS pre-AEG initial growth, lag 1Q, half-life 6Q. This is a customer data-center deployment timing channel, not direct Taiwan manufacturing dependence.
3. No direct mapping is added for `AI_COMPUTE_DEMAND`: HPS.A already receives AI/data-center demand through `DATA_CENTER_POWER` and `HYPERSCALER_CAPEX`; a separate mapping would double-count the same causal chain.
4. No direct mapping is added for `INDUSTRIAL_RESHORING` or `UTILITY_CAPEX`: these overlap with the accepted `ELECTRIFICATION_GRID` structural channel at the current calibration granularity.
5. No `CHINA_REVENUE` mapping before Q3 2026: AEG is excluded from the operating anchor until the first factual consolidated period; geographic post-AEG exposure is a CLR-2 re-anchor item after Q3 reporting.

## Anti-circularity
The patch is motivated by missing scenario transmission, not by the optimizer weight or market price. No center was moved and no tail was widened.
