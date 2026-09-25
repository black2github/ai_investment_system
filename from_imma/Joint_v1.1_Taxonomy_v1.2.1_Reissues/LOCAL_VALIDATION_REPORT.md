# Local Validation Report — Joint v1.1 / Taxonomy v1.2.1 / five MC reissues

Date: 2026-09-25

## 1. YAML / Company MC schema
All package YAML files parse successfully.

Validated the five MC reissues against the accepted `Company_MC_Calibration_Schema_v1.0.2.yaml` (Draft 2020-12) recovered from the normative methodology package:

- `NBIS_mc_calibration_v1.0.3.yaml` — PASS
- `NVDA_mc_calibration_v1.0.3.yaml` — PASS
- `MSFT_mc_calibration_v1.0.1.yaml` — PASS
- `META_mc_calibration_v1.0.2.yaml` — PASS
- `ASML_mc_calibration_v1.0.2.yaml` — PASS

Compatibility fields intentionally remain schema-bound:
- `calculation_engine_version: company_mc 2.3.1` (host may execute 2.3.2)
- `joint_simulation.layer_version: '1.0'` because Company MC Schema v1.0.2 has a literal const. Joint v1.1 is the external runtime contract.

## 2. Full supersedes / structural completeness
Deep structural comparison against the immediate normative predecessors:

| Reissue | Missing old paths | Triangular distributions changed |
|---|---:|---:|
| NBIS v1.0.3 vs v1.0.2 | 0 | 0 |
| NVDA v1.0.3 vs v1.0.2 | 0 | 0 |
| MSFT v1.0.1 vs v1.0 | 0 | 0 |
| META v1.0.2 vs v1.0.1 | 0 | 0 |
| ASML v1.0.2 vs v1.0.1 | 0 | 0 |

All mapping target paths resolve in their own calibration trees. For every reissue, the set of `joint_simulation.active_drivers` equals the set of `driver_parameter_mapping[].driver_id`.

NBIS/NVDA common scalar changes outside the newly appended mapping are limited to `as_of`, `schema_version`, `calculation_engine_version`, and the non-numeric `negative_fcf_fallback` rationale. MSFT/META additionally contain only the requested Taiwan semantic sign/rationale/adverse-direction corrections. ASML has no pre-existing scalar calibration change other than `as_of`.

## 3. Joint v1.1 supersedes
A reconstructed v1.0 tree compared to v1.1 shows **0 missing old paths**. v1.1 adds:
- innovation-level scenario persistence semantics;
- `INDUSTRIAL_RESHORING` root mapping;
- `ACCELERATOR_PRICE_COMPETITION` root mapping;
- explicit list/rule for intentionally idiosyncratic drivers;
- persistence plateau validation semantics;
- detailed v1.1 scenario-override execution steps.

The old `joint_path_algorithm` values are retained verbatim for supersedes compatibility.

## 4. Taxonomy v1.2.1 relocation
The only intentional old-path disappearance is the top-level subtree:
- `added_v1_2`
- `added_v1_2[0]`
- `added_v1_2[0].id`
- `added_v1_2[0].meaning`
- `added_v1_2[0].promotion_reason`

Exactly the same three scalar values are recreated under `drivers.added_v1_2[0]`. This requires explicit allow-listing in mechanical `check_supersedes` and is documented in the taxonomy patch notes.

## 5. Descriptive mapping-budget screen (NOT MC-G5-013)
`sum(abs(effect_per_plus_1sigma))` remains descriptive only. Post-reissue values on newly touched targets are:

- NBIS capex Y2 0.0251; OCF Y3 0.0299 (margin cap 0.05)
- NVDA DataCenter growth 0.0824 (growth cap 0.15); terminal margin 0.0318 (margin cap 0.05); Y5 multiple gross effect 0.0958 (log-multiple cap 0.15)
- MSFT IntelligentCloud growth 0.107; terminal margin 0.031; Y5 log-multiple gross effect 0.042
- META capex Y2 0.024; OCF Y3 0.008; Advertising growth gross effect 0.050
- ASML EUV growth 0.076; Y5 log-multiple gross effect 0.026

These figures do **not** prove MC-G5-013, because root correlations, AR persistence, lag and EMA/half-life decay can make measured sigma differ materially from the gross sum. Authoritative acceptance remains validator 1.7.0 using the actual Joint v1.1 runtime.

## 6. Not claimed locally
- measured MC-G5-013 pass under Joint v1.1;
- dry-run `mapping_warnings=[]` from host company_mc;
- 500k BASE results;
- NBIS/NVDA parity-gated migration result/basis shares;
- robustness probability-response pass after migration;
- scenario 500k results.

These are host acceptance items by design.
