# Company Candidate Schema v1.0.2 — Patch Notes

- Full-text reissue of v1.0.1.
- Adds missing `ACCELERATOR_PRICE_COMPETITION` to `mpc_inputs.driver_exposure_vector`, bringing the schema vector to all 33 driver IDs in `MPC_Driver_Taxonomy_v1.2.1`.
- Retains and makes version-current `CAND-REF-014`: `keys(driver_exposure_vector) == taxonomy(driver_taxonomy_version).driver_ids`.
- Updates `candidate_schema_version` / CAND-REF-017 to `1.0.2` and the embedded full example to taxonomy `1.2.1`.
- No fields or rules from v1.0.1 are removed.
