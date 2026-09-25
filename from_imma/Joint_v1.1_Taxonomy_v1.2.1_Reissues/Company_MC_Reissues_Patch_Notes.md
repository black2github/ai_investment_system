# Scenario Mapping Company Reissues — Patch Notes

## Scope
Full reissues of five accepted MC calibrations. Intrinsic growth/margin/multiple centers and tails are unchanged. No price/RV fitting was performed.

### NBIS mc v1.0.3
Base: `NBIS_mc_calibration_v1.0.2.yaml` (artifact version `.2`, but internal schema 1.0.1 / engine 2.3.0).
- migrate `schema_version: 1.0.1 → 1.0.2`;
- migrate `calculation_engine_version: company_mc 2.3.0 → company_mc 2.3.1`;
- keep all numerical intrinsic calibration parameters and prior MC-G5-013 resizings unchanged;
- update `negative_fcf_fallback` rationale to the accepted schema>=1.0.2 revenue-bridge-reference semantics, without changing 3x/8x/15x;
- add `ACCELERATOR_PRICE_COMPETITION` (+1 exposure in sidecar): Y2 capex/revenue `-0.008`, Y3 OCF margin `+0.006`.
- valuation result is expected to migrate because schema 1.0.2 activates parity-gated blend; old runs remain reproducibility records.

### NVDA mc v1.0.3
Base: `NVDA_mc_calibration_v1.0.2.yaml` (artifact version `.2`, internal schema 1.0.1 / engine 2.3.0).
- same schema/engine migration as NBIS;
- centers/tails and prior MC-G5-013 resizings unchanged;
- bridge-reference rationale updated without changing 3x/7x/12x;
- add `ACCELERATOR_PRICE_COMPETITION` (-2 exposure): DataCenter growth `-0.012`, Y5 terminal margin `-0.006`, Y5 multiple `-0.02` multiplicative.

### MSFT mc v1.0.1
- add `ACCELERATOR_PRICE_COMPETITION` (+1): Y5 terminal margin `+0.005`, IntelligentCloud initial growth `+0.005`;
- correct `TAIWAN_SUPPLY` to canonical supply-health semantics: IntelligentCloud growth `-0.012 → +0.012`; Y5 log-multiple `-0.008 → +0.008`; adverse direction `+1σ → -1σ`;
- no intrinsic distribution change.

### META mc v1.0.2
- add `ACCELERATOR_PRICE_COMPETITION` (+1): capex/revenue Y2 `-0.006`, OCF margin Y3 `+0.004`;
- correct `TAIWAN_SUPPLY`: Advertising growth `-0.005 → +0.005`; capex/revenue Y2 `+0.004 → -0.004`; adverse direction `+1σ → -1σ`;
- no intrinsic distribution change.

### ASML mc v1.0.2
- add `ACCELERATOR_PRICE_COMPETITION` (-1): EUV_Systems initial growth `-0.006`, Y5 log-multiple `-0.006`;
- no other calibration change.

## Company MC schema compatibility
`Company_MC_Calibration_Schema v1.0.2` has `joint_simulation.layer_version: const '1.0'`. Therefore all five files intentionally retain `layer_version: '1.0'` even though the host Joint contract is reissued as v1.1. This is analogous to retaining `calculation_engine_version: company_mc 2.3.1` while the host executes 2.3.2. Changing the frozen compatibility tag would make the files invalid under the requested schema.

## Exposure-vector consistency
MC calibration does not carry `driver_exposure_vector`. `Scenario_Company_Exposure_Patch_v1.1.yaml` is included to apply the five `ACCELERATOR_PRICE_COMPETITION` exposures and the MSFT/META `TAIWAN_SUPPLY -1→+1` semantic corrections to canonical `mpc_inputs.yaml` without altering unrelated model fields.
