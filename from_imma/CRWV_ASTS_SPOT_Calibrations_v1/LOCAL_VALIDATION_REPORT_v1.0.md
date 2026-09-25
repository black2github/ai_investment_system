# LOCAL VALIDATION REPORT v1.0

Date: 2026-09-25

## Schema validation
- `CRWV_mc_calibration_v1.0.yaml`: **PASS** (0 errors)
- `ASTS_mc_calibration_v1.0.yaml`: **PASS** (0 errors)
- `spot/states.yaml`: **PASS** (0 errors)
- `spot/kpis.yaml`: **PASS** (0 errors)
- `spot/triggers.yaml`: **PASS** (0 errors)
- `spot/mpc_inputs.yaml`: **PASS** (0 errors)
- `spot/state.json`: **PASS** (0 errors)

## Mapping integrity
- Active-driver equality / target path resolution: **PASS**

## Reverse Valuation local preflight
- CRWV implied 5Y revenue CAGR: **29.164669%**; terminal PV share **1.1622**.
- ASTS implied 5Y revenue CAGR: **130.028855%**; terminal PV share **1.0161**.
- These are local equation checks, not authoritative sidecar run_refs or stability classifications.

## Robustness perturbations v1.1.2
- CRWV: `{'growth_modes_pp': [-0.09276442, 0.09276442], 'margin_nodes_pp': [-0.03354064, 0.03354064], 'terminal_multiple_pct': [-0.06757918, 0.07247712], 'correlation_rho': [-0.15, 0.15]}`
- ASTS: `{'growth_modes_pp': [-0.09512022, 0.09512022], 'margin_nodes_pp': [-0.02227806, 0.02227806], 'terminal_multiple_pct': [-0.05040812, 0.05308398], 'correlation_rho': [-0.15, 0.15]}`

## Host-only gates not claimed locally
- MC-G5-013 measured aggregate target sigma (root correlations + persistence + lag + decay).
- company_mc dry-run mapping_warnings / deterministic run on host implementation.
- intrinsic/full W and normative 500k outputs.
- probability-response local stability pass/fail.

No host-only gate is represented as passed by this package.
