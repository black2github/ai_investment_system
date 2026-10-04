# NET mpc_inputs patch notes — Party 18

- Reissue version: `1.0.1`
- Reason: structured MC-G5-014 exception migration.
- Exposure scores are unchanged.
- Failure modes are unchanged from the accepted company model.
- Added `driver_interpretation.<driver>.scenario_mapping_exception` objects with `review_ref: IMMA-P18-MCG5-014-20261004`.
- `DATA_CENTER_POWER`: `substitute_channel`; substitutes: AI_COMPUTE_DEMAND.
- `HYPERSCALER_CAPEX`: `substitute_channel`; substitutes: AI_COMPUTE_DEMAND, CLOUD_SOFTWARE_DEMAND.
