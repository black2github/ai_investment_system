# IMMA Party 18 — MC-G5-014 structural exceptions / mappings

Date: 2026-10-04

This package closes the 17 scenario-mapping completeness gaps from the host audit after Joint Rules v1.1.3.

## Design
- **6 direct mappings**: independent valuation channels for INTEREST_RATES / CAPITAL_MARKETS.
- **11 structured exceptions**: duplicate/substitute channels or company-level immaterial channels.
- No distribution center is changed.
- No effect size is fitted to scenario results or market price.
- `Trigger ≠ Decision`; this package changes model observability only.

## Direct MC reissues
- `ETN_mc_calibration_v1.0.3.yaml`
- `MSFT_mc_calibration_v1.0.2.yaml`
- `NET_mc_calibration_v1.0.1.yaml`
- `PLTR_mc_calibration_v1.0.1.yaml`

## Canonical mpc_inputs reissues
- `CRWV_mpc_inputs_v1.0.2.yaml`
- `ETN_mpc_inputs_v1.0.3.yaml`
- `MSFT_mpc_inputs_v1.0.2.yaml`
- `NET_mpc_inputs_v1.0.1.yaml`
- `PLTR_mpc_inputs_v1.0.1.yaml`
- `SPOT_mpc_inputs_v1.0.1.yaml`
- `HPSA_mpc_inputs_v1.0.2.yaml`

## Review artifacts
- `MC_G5_014_Closure_Matrix_v1.0.yaml`
- `PARTY18_DECISIONS_v1.0.md`
- per-file patch notes
- `LOCAL_VALIDATION_REPORT_v1.0.md`
- `PACKAGE_MANIFEST.yaml`

Host measured MC-G5-013 and MC-G5-014 are authoritative.
