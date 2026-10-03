# Party 13 — Local Validation Report

Date: 2026-10-03

## JSON Schema / folder validation
### CRWD
- candidate: **PASS**, errors=0
- states: **PASS**, errors=0
- kpis: **PASS**, errors=0
- triggers: **PASS**, errors=0
- mpc_inputs: **PASS**, errors=0
- state: **PASS**, errors=0
- theme: **PASS**, errors=0
### HPS.A
- candidate: **PASS**, errors=0
- states: **PASS**, errors=0
- kpis: **PASS**, errors=0
- triggers: **PASS**, errors=0
- mpc_inputs: **PASS**, errors=0
- state: **PASS**, errors=0
- theme: **PASS**, errors=0
### S
- candidate: **PASS**, errors=0
- states: **PASS**, errors=0
- kpis: **PASS**, errors=0
- triggers: **PASS**, errors=0
- mpc_inputs: **PASS**, errors=0
- state: **PASS**, errors=0
- theme: **PASS**, errors=0

- Theme Taxonomy v1.0.1 schema: **PASS**, errors=0

## Structural / source checks
- custom integrity: **PASS**, issues=0
- every canonical KPI has a concrete `source_url`: **PASS**
- canonical `mpc_inputs` contain all 33 taxonomy v1.2.1 drivers: **PASS**
- Candidate Schema v1.0.1 vector contains its normative 32-driver set and declares `ACCELERATOR_PRICE_COMPETITION` as schema gap: **PASS**

## THM-007 strong-driver check
- CRWD: CLOUD_SOFTWARE_DEMAND=+2; non-fallback mapped share=1.000; **PASS**
- S: CLOUD_SOFTWARE_DEMAND=+2; non-fallback mapped share=1.000; **PASS**

## Dozor acceptance status
- Party13 files are source-complete and locally schema-valid.
- Immutable host Dozor verification run IDs are intentionally `PENDING_HOST_RUN`; this package does not invent them.
- RV/MC calibration is intentionally absent until host candidate/folder + Dozor acceptance.

## HPS.A regulator-link limitation
- Exact issuer-hosted Q2 Report URL is present and machine-reproducible.
- SEDAR+ public search channel is present.
- A stable direct SEDAR+ Q2 document ID was not independently recovered; no synthetic regulator URL was created.

## Errors / issues
- none
