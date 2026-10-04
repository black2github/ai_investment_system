# Local Validation Report v1.0

Date: 2026-10-04
Scope: IMMA Party 17 / Joint Rules v1.1.3 / MC-G5-014.

## Checks

- YAML parse: PASS for Joint Rules v1.1.3, scenario-driver reference, validator fixtures.
- Supersedes completeness vs Joint Rules v1.1.2 YAML: PASS; **0 missing leaf paths**.
- Scenario driver reference vs dynamic union of `driver_overrides` in TAIWAN_SEIZURE_v1.1.1, TAIWAN_QUARANTINE_v1.1.1, CHIP_COLD_WAR_v1.1.1: PASS; **14 == 14**, symmetric difference empty.
- Validator fixtures: 6/6 expected outcomes reproduced by local reference implementation.
- No company calibration numeric parameters modified.
- Company_MC_Calibration_Schema v1.0.2 change required: **NO**. Exception data is carried under the existing open `mpc_inputs.driver_interpretation` object.

## Normative effect

MC-G5-014 is a new hard acceptance gate for new/reissued calibrations under Joint Rules v1.1.3. It is independent of MC-G5-001 and precedes MC-G5-013 remeasurement when a new mapping is added.

## Host work

Implement dynamic active-scenario resolution, structured exception validation, report fields, and fixtures in `artifact_validator`. Host acceptance remains authoritative.
