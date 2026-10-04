# Party 18 — Local Validation Report

Date: 2026-10-04
Review ref: `IMMA-P18-MCG5-014-20261004`

## Scope
Close all 17 MC-G5-014 gaps identified by host audit across CRWV, ETN, MSFT, NET, PLTR, SPOT and HPS.A.

## Closure count
- gaps: 17
- direct mappings: 6
- structured exceptions: 11
- companies: 7

## Schema checks
- Company Artifact Schema v1.0.5 / `mpc_inputs.yaml`: **7/7 PASS, 0 errors**
- Company MC Calibration Schema v1.0.2: **4/4 PASS, 0 errors**
- YAML parse: **PASS**
- taxonomy vector length: **33/33 for all seven mpc_inputs**
- structured exception required fields: **PASS**
- substitute-channel live-mapping resolution: **PASS**
- HPS.A v1.0.1 → v1.0.2 leaf preservation: **0 lost leaf paths**

## MC reissues
Direct mappings were added only to:
- ETN: INTEREST_RATES
- MSFT: INTEREST_RATES
- NET: INTEREST_RATES, CAPITAL_MARKETS
- PLTR: INTEREST_RATES, CAPITAL_MARKETS

All revenue / margin / valuation distribution nodes and modes remain unchanged. The reissues change `as_of`,
`joint_simulation.active_drivers`, and append the listed mappings.

Static added log-multiple effects are individually <= 0.025 and the sum of newly added effects per target remains
well below the MC-G5-013 valuation cap 0.15. This is a conservative design check only; **host measured sigma is authoritative**.

## MC-G5-014 closure preflight
Every one of the 17 audited (ticker, driver) pairs resolves to exactly one Party18 closure:
- direct mapping, or
- `driver_interpretation.<driver>.scenario_mapping_exception`.

For `substitute_channel`, at least one substitute has a live mapping in the accepted or Party18 calibration.

## Supersedes boundary
- Four MC source files were materialized from the accepted Project artifacts and reissued from their full text.
- HPS.A canonical mpc_inputs v1.0.1 was available as the accepted Party16 full text; supersedes check is exact.
- For CRWV / ETN / MSFT / NET / PLTR / SPOT canonical mpc_inputs, the current host bytes are not present in the 03.10 restore archive.
  Party18 therefore republishes full schema-v1.0.5 objects reconstructed from the accepted company models, taxonomy migrations and current
  version state. Host `check_supersedes` remains authoritative for these six files; any host-only metadata must be preserved by the Integrator
  if it differs. The economic exposure scores used for the 17 audited drivers are unchanged.

## Required host acceptance
1. `artifact_validator` workspace/company validation for seven mpc_inputs.
2. `artifact_validator calibration` for four MC reissues under Joint v1.1 / Rules v1.1.3.
3. MC-G5-014 audit over all 18 securities: expected **0 gaps**.
4. Measured MC-G5-013, dry run and determinism for ETN/MSFT/NET/PLTR.
5. Scenario reruns only for the four names with new mappings.

Result: **PASS_LOCAL_PREFLIGHT**
