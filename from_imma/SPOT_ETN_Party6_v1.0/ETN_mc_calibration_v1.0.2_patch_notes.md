# ETN mc_calibration v1.0.2 — Patch Notes

Supersedes: `ETN_mc_calibration_v1.0.1.yaml`

Reason: Joint Simulation Layer v1.1 assigns root mapping to `INDUSTRIAL_RESHORING`, increasing measured aggregate sigma for `revenue_model.segments.ElectricalAmericas.initial_growth` from 0.141 under Joint v1.0 to 0.160 under Joint v1.1, above the 0.15 growth cap.

Host diagnostic on an uncommitted copy:
- uniform x0.90 -> measured sigma ~0.143 (PASS);
- uniform x0.85 -> ~0.136.

Decision: use x0.90, the smallest host-tested correction that clears the hard cap.

Changed values only:
- `HYPERSCALER_CAPEX` / `revenue_model.segments.ElectricalAmericas.initial_growth`: `0.01875` -> `0.016875` (x0.90)
- `DATA_CENTER_POWER` / `revenue_model.segments.ElectricalAmericas.initial_growth`: `0.015` -> `0.0135` (x0.90)
- `ELECTRIFICATION_GRID` / `revenue_model.segments.ElectricalAmericas.initial_growth`: `0.015` -> `0.0135` (x0.90)
- `UTILITY_CAPEX` / `revenue_model.segments.ElectricalAmericas.initial_growth`: `0.015` -> `0.0135` (x0.90)
- `INDUSTRIAL_RESHORING` / `revenue_model.segments.ElectricalAmericas.initial_growth`: `0.01125` -> `0.010125` (x0.90)
- `AI_COMPUTE_DEMAND` / `revenue_model.segments.ElectricalAmericas.initial_growth`: `0.009` -> `0.0081` (x0.90)

Mechanical local deep diff:
- removed paths: 0
- added paths: 0
- changed scalar leaves: 6
- expected changed scalar leaves: 6

No centers, tails, other targets, lag/decay parameters, robustness values, valuation parameters or reverse-valuation references are changed.
