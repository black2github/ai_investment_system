# META / ASML Company MC Calibration v1.0.1 — normative reissue
Date: 2026-09-24
Status: normative calibration reissue; host acceptance pending validator/company_mc production run.
Schema: Company_MC_Calibration_Schema 1.0.2. Engine contract: company_mc 2.3.1. Local robustness: Company Conditional MC Specification 1.1.3 / robustness v1.1.2.
## Decision
- Central modes are frozen. No parameter center was moved toward market price, RV, or a dispersion band.
- Tail widening is justified by identified business uncertainty. The dispersion bands remain diagnostics, not fitting targets.
- META: if the authoritative 500k intrinsic W remains around the owner/integrator preview (~0.30), below the B reference band 0.40–0.85, do **not** widen again automatically. Record a low-dispersion warning and reopen only if a concrete omitted risk mechanism is identified.
- ASML: the owner/integrator 20k preview (~0.26 intrinsic W) is consistent with the A reference band floor 0.25, but only the host 500k run is authoritative.
- ASML `Metrology_Inspection` is intentionally unchanged: it is ~2.0% of current quarterly segment revenue in the calibration base and already carries broad initial/long-run ranges; expanding it solely to increase W would be calibration-to-diagnostic fitting.
## META v1.0 → v1.0.1
| Path | v1.0 min/mode/max | v1.0.1 min/mode/max |
|---|---:|---:|
| `revenue_model.segments.Advertising.initial_growth` | 0.05 / 0.2 / 0.38 | -0.05 / 0.2 / 0.46 |
| `revenue_model.segments.Other_RL.initial_growth` | -0.25 / 0.08 / 0.45 | -0.35 / 0.08 / 0.55 |
| `margin_model.capex_revenue_nodes.Y3` | 0.18 / 0.3 / 0.43 | 0.14 / 0.3 / 0.53 |
| `margin_model.capex_revenue_nodes.Y4` | 0.14 / 0.25 / 0.36 | 0.1 / 0.25 / 0.46 |
| `margin_model.capex_revenue_nodes.Y5` | 0.11 / 0.22 / 0.34 | 0.08 / 0.22 / 0.42 |
| `margin_model.capex_revenue_nodes.Y8` | 0.08 / 0.18 / 0.28 | 0.06 / 0.18 / 0.33 |
| `margin_model.ocf_margin_nodes.Y3` | 0.38 / 0.48 / 0.57 | 0.33 / 0.48 / 0.6 |
| `margin_model.ocf_margin_nodes.Y5` | 0.34 / 0.46 / 0.55 | 0.29 / 0.46 / 0.59 |
| `margin_model.ocf_margin_nodes.Y8` | 0.32 / 0.43 / 0.52 | 0.28 / 0.43 / 0.56 |
| `valuation.Y3.multiple` | 4 / 8 / 13 | 2.4 / 8 / 14.2 |
| `valuation.Y5.multiple` | 17 / 25 / 34 | 12 / 25 / 37.75 |
| `valuation.Y8.multiple` | 14 / 21 / 29 | 10.22 / 21 / 31.52 |
| `valuation.negative_fcf_fallback.multiple` | 3 / 6 / 10 | 1.8 / 6 / 10.9 |

Rationale: broaden ad cyclicality/AI monetization tails; explicitly preserve a persistent high-capex path through Y8; widen OCF execution outcomes; broaden valuation regimes. The original capex `min_floor` guardrails were not applied where they would narrow an existing tail.

## ASML v1.0 → v1.0.1
| Path | v1.0 min/mode/max | v1.0.1 min/mode/max |
|---|---:|---:|
| `revenue_model.segments.EUV_Systems.initial_growth` | -0.05 / 0.22 / 0.5 | -0.17 / 0.22 / 0.55 |
| `revenue_model.segments.EUV_Systems.long_run_growth_y8` | -0.03 / 0.12 / 0.25 | -0.09 / 0.12 / 0.3 |
| `revenue_model.segments.DUV_Systems.initial_growth` | -0.25 / 0.05 / 0.3 | -0.3 / 0.05 / 0.35 |
| `revenue_model.segments.DUV_Systems.long_run_growth_y8` | -0.08 / 0.04 / 0.15 | -0.14 / 0.04 / 0.18 |
| `revenue_model.segments.InstalledBaseManagement.initial_growth` | 0 / 0.15 / 0.32 | -0.05 / 0.15 / 0.37 |
| `margin_model.terminal_margin_Y5` | 0.2 / 0.3 / 0.39 | 0.165 / 0.3 / 0.42 |
| `margin_model.terminal_margin_Y8` | 0.18 / 0.28 / 0.36 | 0.145 / 0.28 / 0.39 |
| `valuation.Y3.multiple` | 18 / 28 / 38 | 12.96 / 28 / 42.2 |
| `valuation.Y5.multiple` | 16 / 24 / 32 | 11.68 / 24 / 35.6 |
| `valuation.Y8.multiple` | 13 / 20 / 28 | 10 / 20 / 30.4 |
| `valuation.negative_fcf_fallback.multiple` | 3 / 6 / 9 | 1.92 / 6 / 9.9 |

Rationale: broaden semiconductor-cycle and export/customer timing outcomes in EUV/DUV, modestly broaden installed-base service, widen Y5/Y8 cash-margin regimes and valuation regimes. No floor/ceiling is allowed to make either tail narrower than v1.0.

## Multiple-tail semantics
For every changed multiple: `new_min = old_min - lower_pct * mode`; `new_max = old_max + upper_pct * mode`. This is the host interpretation requested in the order; the mode is unchanged.

## Recalculated local robustness v1.1.2
`sigma_eq=(Q84-Q16)/2`; growth uses base-revenue-weighted RMS segment initial-growth sigma; META B/OCF-capex margin uses `sqrt(sigma_ocf_Y5^2 + sigma_capex_Y5^2)`; ASML A margin uses Y5 terminal-margin sigma; multiple uses log-space Y5 sigma; perturbation is 0.25σ subject to absolute ceilings.

| | growth ±pp | margin ±pp | multiple relative down / up | correlation |
|---|---:|---:|---:|---:|
| META | 0.02837363 | 0.02471873 | -0.05549313 / +0.05875355 | ±0.15 |
| ASML | 0.03389017 | 0.01385158 | -0.05408625 / +0.05717884 | ±0.15 |

These values are materialized into `robustness_tests.Scenario_Robustness.perturbations`. They are perturbation definitions, not a claim that the live robustness pass has already been executed locally.

## Reverse Valuation linkage
- RV calibration files are unchanged. Expected authoritative host runs: META suffix `…-94a270`; ASML suffix `…-2d7985`.
- The supplied v1.0 MC files contain `PENDING_HOST_RUN:*_calibration_v1.0.yaml`. Because the order provides only abbreviated host identifiers, v1.0.1 preserves those strings rather than inventing the missing prefix. The integrator must bind the exact authoritative run_ref during integration.

## Supersedes rule
Each v1.0.1 YAML is a complete copy of its v1.0 tree plus the explicit deltas above and recalculated robustness values. No source path is removed.
