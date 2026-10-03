# IMMA Party 14 — CRWD / HPS.A / S RV + MC calibrations v1.0

Scope: §4 of party13-company-models-candidates.feedback.md. Built from the accepted Party 13 company models and source dossiers, with market inputs through 2026-10-02.

Files:
- CRWD_calibration_v1.0.yaml / CRWD_mc_calibration_v1.0.yaml
- HPSA_calibration_v1.0.yaml / HPSA_mc_calibration_v1.0.yaml (`ticker: HPS.A` inside artifacts)
- S_calibration_v1.0.yaml / S_mc_calibration_v1.0.yaml
- LOCAL_VALIDATION_REPORT_v1.0.md
- PACKAGE_MANIFEST.yaml

Calibration choices:
- CRWD: archetype A (`mature_positive_margin`). SBC dilution and acquisition/goodwill burden are kept as explicit risks; they do not raise the center of margin/multiple assumptions.
- HPS.A: archetype A with M&A transition. Q2 operating base is pre-AEG. AEG enters operating calibration only from the first factual consolidated period (Q3 2026). Purchase price/facility capacities are recorded as a subsequent event; undisclosed funded principal is not estimated. CAD→USD reference is included for portfolio conversion, while the RV itself is internally CAD-consistent.
- S: archetype A with unsettled cash conversion. Current FCF margin is normalized to 4.0% as `model_assumption`, explicitly reconciling FY2026 positive FCF, H1 FY2027 positive YTD FCF and Q2 standalone negative FCF. The negative lower tail remains in MC.

Host acceptance is still required. `PENDING_HOST_RUN:*` is intentional and must be replaced only by actual sidecar output.

Trigger ≠ Decision. This package is methodology/calibration only and contains no buy/sell instruction.
