# MC v1.1 — Schema v1.0.1 + Parts B/C

Contents:
- Company_MC_Calibration_Schema_v1.0.1.yaml
- Company_MC_Calibration_Schema_v1.0.1_examples.yaml
- Company_Conditional_Monte_Carlo_Specification_v1.1.md (accepted text copied for context)
- SPCX_mc_calibration_v1.1.yaml
- NBIS_calibration_v1.0.yaml
- NBIS_mc_calibration_v1.0.yaml
- NVDA_calibration_v1.0.yaml
- NVDA_mc_calibration_v1.0.yaml
- MC_v1.1_Calibrations_BC_Notes.md

Local checks:
- Draft 2020-12 schema valid.
- All three real MC calibrations validate.
- A/B/C example calibrations validate and are explicitly shape_only.
- factor-correlation matrices PSD.
- all non-zero SPCX/NBIS/NVDA MPC drivers are mapped and equal active_drivers.
- SPCX v2 YAML contains no state_transition_effects.
- local deterministic Reverse Valuation equation preflight calculated for NBIS/NVDA.

Host-only checks still required:
- reverse_valuation 1.2.0 authoritative runs for NBIS/NVDA.
- company_mc 2.3.0 dry/full runs, mapping_warnings=[], determinism, robustness pass.
