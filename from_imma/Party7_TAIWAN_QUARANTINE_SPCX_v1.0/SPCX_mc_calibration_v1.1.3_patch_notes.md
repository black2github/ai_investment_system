# SPCX mc v1.1.3 — Patch Notes

Supersedes: `SPCX_mc_calibration_v1.1.2.yaml`

Migration only; no intrinsic recalibration.

- removed paths: 0
- added paths: 0
- changed scalar leaves: 4

- `as_of`: `2026-09-23` -> `2026-09-25`
- `calculation_engine_version`: `company_mc 2.3.0` -> `company_mc 2.3.1`
- `schema_version`: `1.0.1` -> `1.0.2`
- `valuation.negative_fcf_fallback.multiple.rationale`: `v1.1.2 wider fallback valuation uncertainty; center unchanged.` -> `Schema >=1.0.2 semantics: this is the revenue_bridge_reference_multiple used through the parity-gated crossover region, not only an emergency negative-FCF fallback. v1.1.2 distribution 2/14/30x and center 14x are preserved unchanged; the reissue changes valuation semantics, not calibration centers/tails.`

Centers, tails, mappings, lags/decays, factor correlations and robustness perturbations are unchanged.
