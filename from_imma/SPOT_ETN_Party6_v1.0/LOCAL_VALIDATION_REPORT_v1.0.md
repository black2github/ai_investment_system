# Party 6 — Local Validation Report

Date: 2026-09-25

## SPOT
- `SPOT_mc_calibration_v1.0.yaml` against Company_MC_Calibration_Schema v1.0.2: **PASS**
- schema errors: 0
- mapping target path errors: 0
- `active_drivers == driver_parameter_mapping`: **PASS**
- RV required structural fields missing: 0
- local RV implied 5Y revenue CAGR: `0.0925467565`
- local RV terminal-value share: `0.827569` -> diagnostic `terminal_dependent`
- robustness references:
  - growth sigma `0.0650478795` -> ±`0.01626197`
  - margin sigma `0.0369375587` -> ±`0.00923439`
  - Y5 log multiple sigma `0.2327649044` -> relative `-0.05653049` / `+0.05991766`

## ETN
- `ETN_mc_calibration_v1.0.2.yaml` against Company_MC_Calibration_Schema v1.0.2: **PASS**
- schema errors: 0
- supersedes deep diff removed paths: `0`
- supersedes deep diff added paths: `0`
- changed scalar leaves: `6`
- host-provided preview x0.90 measured sigma: `~0.143 <= 0.15`; not independently reproduced locally.

## Not locally executable / not claimed
- validator 1.7.0 measured MC-G5-013 under Joint v1.1
- company_mc 2.3.2 dry-run/determinism
- intrinsic/full W
- robustness probability-response pass
- normative 500k BASE/scenario runs
