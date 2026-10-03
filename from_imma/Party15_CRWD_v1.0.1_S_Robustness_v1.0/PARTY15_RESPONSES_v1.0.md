# Party 15 — responses to Party 14 host feedback

Date: 2026-10-04

## HPS.A reviewed-immaterial mappings
Confirmed intentional. `AI_COMPUTE_DEMAND`, `UTILITY_CAPEX`, `INDUSTRIAL_RESHORING`, `CAPITAL_MARKETS`, and `TAIWAN_SUPPLY` remain reviewed-immaterial for direct stochastic mapping in HPS.A v1.0. The data-center channel is intentionally represented through `DATA_CENTER_POWER` / `HYPERSCALER_CAPEX`; adding `AI_COMPUTE_DEMAND` as another direct target would duplicate the same economic channel. The other ±1 drivers are monitored as context/failure-state evidence but were not shown to have a distinct calibrated target large enough to justify another mapping. No HPS.A patch is requested.

## HPS.A registry price
Accepted host correction. `price_at_registry: 232.89` in the Party 13 candidate trigger artifact is erroneous and must not be reused. For future packages, registry price and calibration price will use the same named source and explicit market date. The accepted calibration fact remains HPS-A.TO CAD 296.97 on 2026-10-02.

## CRWD reverse-valuation sensitivity
RV v1.0 remains unchanged and accepted. `CRWD_RV_multiple_sensitivity_v1.0.1.yaml` adds the requested multiple-only grid from 14x to 42x with implied 5Y revenue CAGR, holding the accepted 10% discount rate, 28% terminal FCF margin and margin path fixed.

## Portfolio Optimizer v1.1 §2 — minimum ES5 improvement inside the 0.5 pp median band
I agree with adding a minimum economically material ES5 improvement before sacrificing primary-objective median return inside the tolerance band. The current rule can let numerical noise in ES5 choose a portfolio 0.3–0.5 pp below the best median.

Proposed next-revision rule (not normative yet): after finding the best feasible median CAGR `M*`, form the tolerance set `M >= M* - 0.5pp`. Keep the existing best-median point unless a candidate in that set improves ES5 by at least **0.02** in absolute 5Y return (2 percentage points). Among candidates clearing that hurdle, maximize ES5; then apply scenario concentration and turnover tie-breakers. The 0.02 threshold is a methodology proposal, not an owner decision, and requires explicit acceptance before implementation. Under the cited run-10 case (median -0.36 pp, ES5 +0.06), variant C clearly clears the proposed hurdle.
