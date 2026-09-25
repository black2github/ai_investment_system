# Scenario Engine v1.0 — Local Validation Report

Date: 2026-09-25

## JSON Schema
- TAIWAN_SEIZURE_v1.0.yaml: PASS (0 errors)
- CHIP_COLD_WAR_v1.0.yaml: PASS (0 errors)

## Taxonomy supersedes
- Old paths missing in v1.2: **0**
- Existing v1.1 tree retained; only version/as_of/supersedes values change and `added_v1_2` is added.

## PSD phase matrices
- TAIWAN_SEIZURE/RESTRICTIONS: min eigenvalue = `0.209566` -> PASS
- TAIWAN_SEIZURE/BLOCKADE: min eigenvalue = `0.109141` -> PASS
- TAIWAN_SEIZURE/CONFLICT: min eigenvalue = `0.042001` -> PASS
- TAIWAN_SEIZURE/RECOVERY: min eigenvalue = `0.198910` -> PASS
- CHIP_COLD_WAR/RACE_TO_PARITY: min eigenvalue = `0.184437` -> PASS
- CHIP_COLD_WAR/PARITY_BOUNDARY: min eigenvalue = `0.123511` -> PASS
- CHIP_COLD_WAR/TWO_SYSTEMS: min eigenvalue = `0.163387` -> PASS

## Scope not executable locally
- Phase-aware Scenario Engine runtime does not yet exist on this host.
- No normative 500k scenario run, mixture, ScenarioConcentration or Stability §3.3 is claimed.
- Proposed ACCELERATOR_PRICE_COMPETITION company mappings require full company reissue and host MC-G5-013 before normative use.

## Expected host acceptance
- scenario schema validation
- phase dependency/timing deterministic replay
- PSD verification
- same common innovations/path_id across BASE/scenarios/companies
- scenario-specific 500k runs
- coverage diagnostics
- after owner probabilities: mixture metrics + ScenarioConcentration + Stability §3.3

## Mapping semantic gate
- Existing MSFT/META `TAIWAN_SUPPLY` signs conflict with canonical supply-health semantics. Proposed corrections are included in `Scenario_Company_Mapping_Patch_v1.0.yaml`.
- Until host-accepted company reissues exist, normative scenario runs must exclude those old channels with `excluded_semantic_mismatch`.
