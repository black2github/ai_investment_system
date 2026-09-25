# CRWV MC Calibration v1.0.1 — Patch Notes

Date: 2026-09-25  
Status: proposed_for_host_acceptance  
Supersedes: `CRWV_mc_calibration_v1.0.yaml`

## Scope
Full republication of CRWV MC calibration. The only normative delta is a uniform 0.85 scaling of the three Joint Layer effects mapped to `margin_model.capex_revenue_nodes.Y2`, responding to host MC-G5-013 measured sigma 0.056 > 0.05.

## Changes
| driver | v1.0 | v1.0.1 | scale |
|---|---:|---:|---:|
| `DATA_CENTER_POWER` | -0.018000 | -0.015300 | 0.85 |
| `TAIWAN_SUPPLY` | -0.014000 | -0.011900 | 0.85 |
| `CAPITAL_MARKETS` | -0.014000 | -0.011900 | 0.85 |

## Invariants
- No change to revenue / OCF / capex distribution centers or tails.
- No change to valuation parameters or reverse-valuation reference.
- No change to any other stochastic target, structural support, lag, decay, driver list, latent factor, robustness perturbation, market-path parameter, simulation seed/path count or archetype.
- Schema remains `Company_MC_Calibration_Schema v1.0.2`; `calculation_engine_version` remains `company_mc 2.3.1` per schema const.

## Rationale
Host diagnostic established that exact x0.85 gives measured aggregate sigma approximately 0.048, below the MC-G5-013 margin cap 0.05, while preserving the relative contribution structure of the three economic channels. A deeper x0.80 reduction is not used because it would reduce Joint Layer signal more than required by the hard cap.

## Host acceptance required
Run validator 1.6.0/compatible successor, measured MC-G5-013, dry run with `mapping_warnings=[]`, determinism, intrinsic/full W diagnostic, local robustness v1.1.2, and normative company_mc 2.3.2 500k. Host preview sigma 0.048 is diagnostic until authoritative run.
