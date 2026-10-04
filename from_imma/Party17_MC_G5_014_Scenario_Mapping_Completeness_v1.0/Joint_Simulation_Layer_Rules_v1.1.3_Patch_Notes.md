# Joint Simulation Layer Rules v1.1.3 — Patch Notes

Date: 2026-10-04
Supersedes: v1.1.2

## Delta

- Adds hard gate **MC-G5-014** for scenario-visible driver mapping completeness.
- MC-G5-001 and MC-G5-013 are unchanged.
- Authoritative scenario driver set is resolved dynamically from active `phase.driver_overrides`; the bundled 14-driver list is reference-only.
- A non-zero MPC exposure to a scenario-overridden driver requires either a direct `driver_parameter_mapping` or a structured exception under `mpc_inputs.driver_interpretation[driver_id].scenario_mapping_exception`.
- `reviewed-immaterial` free text alone is not a waiver.
- Adds structured reason codes and substitute-channel validation.
- Engine dependency metadata updated to `company_mc 2.5.0`; no numerical engine semantics are changed by this rules patch.

## Migration / adoption

For a new or reissued calibration accepted under v1.1.3, MC-G5-014 is a hard error. Existing accepted calibrations are not numerically modified by this methodology reissue; when revalidated for a new scenario-dependent run, missing structured exceptions/mappings must be remediated before that run is treated as scenario-observable. Any newly added mapping requires MC-G5-013 remeasurement.
