# HPS.A Scenario Mapping Decision v1.0

## Added channels
- `CAPITAL_MARKETS -> valuation.Y5.multiple`: negative scenario shifts represent risk-off/refinancing stress and now reduce valuation.
- `TAIWAN_SUPPLY -> Legacy_HPS_pre_AEG.initial_growth`: indirect data-center deployment timing; no direct HPS Taiwan manufacturing dependence is assumed.

## Deliberate non-mappings
- `AI_COMPUTE_DEMAND`: reviewed-immaterial as a separate mapping because HPS.A already maps `DATA_CENTER_POWER` and `HYPERSCALER_CAPEX`; adding all three to the same target would double-count the same data-center causal chain.
- `UTILITY_CAPEX` / `INDUSTRIAL_RESHORING`: retained as economic exposures but not separate stochastic mappings at current granularity; `ELECTRIFICATION_GRID` is the accepted structural channel.
- `CHINA_REVENUE`: zero until the first factual AEG consolidated anchor (Q3 2026). Post-AEG geography belongs to CLR-2 re-anchoring, not a retroactive Q2 estimate.
- `GOVERNMENT_DEFENSE`, `SEMICONDUCTOR_WFE`: no direct economic channel identified at current evidence level.

## Interpretation
HPS.A remains less directly Taiwan-sensitive than semiconductor names, but it is no longer mechanically scenario-invariant. Its diversification benefit must be earned by the recomputed paths, not by missing driver mappings.
