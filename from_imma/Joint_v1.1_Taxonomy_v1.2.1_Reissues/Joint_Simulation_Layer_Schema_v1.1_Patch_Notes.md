# Joint Simulation Layer Schema v1.1 — Patch Notes

## Supersedes
`Joint_Simulation_Layer_Schema_v1.0.yaml` in full. No v1.0 structural path is intentionally removed.

## Normative deltas
1. Adds root mapping for `INDUSTRIAL_RESHORING`:
   - `AI_CAPEX_CYCLE: 0.30`
   - `POWER_BUILDOUT: 0.35`
   - `GLOBAL_GROWTH: 0.20`
   - `idio_weight: 0.60`
2. Adds the normative root mapping for `ACCELERATOR_PRICE_COMPETITION`:
   - `AI_CAPEX_CYCLE: 0.35`
   - `SEMI_SUPPLY_HEALTH: 0.30`
   - `idio_weight: 0.65`
3. The above **replaces** the provisional `Joint_Simulation_Layer_Driver_Patch_v1.0.yaml` mapping `{AI_CAPEX_CYCLE: 0.20, SEMI_SUPPLY_HEALTH: 0.25, CHINA_MARKET_ACCESS: 0.35, idio_weight: 0.70}`.
4. `CHINA_MARKET_ACCESS` is deliberately removed from accelerator-price competition. Cross-border market access is already represented by `CHINA_REVENUE`; retaining it here would mix product price/performance competition with access restrictions and double-count the `CHIP_COLD_WAR` channel.
5. Codifies the accepted innovation-level `persistence_override` semantics: root innovations after the current phase correlation state + the same BASE idiosyncratic driver innovation, normalized in the current state, then AR(1) recursion at requested rho. `null` is bypass; root phi and company mapping decay are unchanged.
6. Explicitly preserves the v1.0 `unspecified_driver_default: idiosyncratic`. In v1.1 the following intentionally remain without root mapping: `ACQUISITION_INTEGRATION`, `DRUG_PIPELINE`, `BIOPHARMA_MANUFACTURING_CAPACITY`, `PHARMA_REGULATION`, `PATENT_EXCLUSIVITY`, `FINTECH_REGULATION`.
7. Adds validator-level plateau semantics for persistence: approximately unit variance and empirical lag-1 approximately rho after warm-up; insufficient plateau length is diagnostic, not failure.

## Anti-double-counting rationale
The new driver is a product-economics axis. `CHINA_REVENUE` remains the access axis and `TAIWAN_SUPPLY` remains the physical/supply-health axis. Scenario mean shifts may move all three, but their BASE covariance channels remain semantically distinct.
