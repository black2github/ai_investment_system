# Party 16 Local Validation Report v1.0

## JSON Schema / Draft 2020-12 preflight
- `HPSA_mc_calibration_v1.0.1.yaml`: 0 schema errors
- `SPCX_theme_exposure_v1.0.yaml`: 0 schema errors
- `META_theme_exposure_v1.0.yaml`: 0 schema errors
- `NBIS_theme_exposure_v1.0.yaml`: 0 schema errors
- `CRWV_theme_exposure_v1.0.yaml`: 0 schema errors
- `Company_Candidate_Schema_v1.0.2.yaml`: 0 schema errors

## Supersedes completeness
- HPSA MC v1.0 -> v1.0.1 missing leaf paths: 0
- Candidate Schema v1.0.1 -> v1.0.2 missing leaf paths: 0

## HPS.A MPC direction consistency
- Corrected canonical MPC signs: CAPITAL_MARKETS -1 -> +1 and TAIWAN_SUPPLY -1 -> +1, because Taxonomy v1.2.1 defines score sign as impact of a positive driver shock. |score| is unchanged.

## HPS.A MC-G5-013 static mapping sanity
- Added initial-growth mapping magnitude: 0.010 pp per +1σ TAIWAN_SUPPLY; prior host measured growth aggregate σ = 0.114. Host measured aggregate σ remains authoritative and must be rerun.
- Added valuation mapping magnitude: 0.025 log-multiple per +1σ CAPITAL_MARKETS; prior host measured valuation aggregate σ = 0.032. Host measured aggregate σ remains authoritative and must be rerun.
- Distribution nodes/modes and RV reference unchanged; no local claim of host acceptance.

## Theme arithmetic
- SPCX Q2 revenue shares sum to 1.0; Space 0.123112, Connectivity 0.549143, AI 0.327745.
- META Q2 revenue shares sum to 1.0; FoA 0.992911, Reality Labs 0.007089.
- NBIS disclosed segment-revenue shares sum to 1.0 on 585.9m segment denominator; AI cloud 0.981225, Avride 0.001707, TripleTen 0.017068.
- CRWV Q2 revenue is non-fallback 100% AI_CLOUD_COMPUTE based on disclosed cloud-computing revenue model.

## Limits
- This preflight does not replace host artifact_validator 1.10.1, measured MC-G5-013, dry run, scenario reruns, or optimizer rerun 11.
