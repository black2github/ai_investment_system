# Party 10 Part A — Local Validation Report

Date: 2026-09-30

- Scenario Strategy schema synthetic fixture: **PASS**, errors=0
- Optimizer scenario policy schema: **PASS**, errors=0
- Scenario State v1.1 example: **PASS**, errors=0
- Scenario State v1.0 -> v1.1 removed schema paths: **0**
- ACT IDs ACT-001…ACT-020 unique/complete: **PASS**
- Owner thresholds 0.10 / -0.40 / 0.25 / 0.60: **PASS**
- Scenario calibration patch in Part A: **NOT EMITTED BY DESIGN** (avoids dangling strategy_ref before Part B).
- GLD calibration: **NOT EMITTED**; only model specification/schema. Flat-0 placeholder is not accepted hedge evidence.

## Not locally claimed
- host Portfolio Optimizer 1.1.0 numerical parity with this policy;
- existence of Part B conditional `_runs`;
- live Dozor state transitions;
- actual GLD return/scenario calibration.

## Draft 2020-12 schema meta-validation
- Scenario_Strategy_Schema_v1.0.yaml: **PASS**
- Portfolio_Optimizer_Scenario_Conditional_Policy_Schema_v1.0.yaml: **PASS**
- Hedge_Instrument_Model_Schema_v1.0.yaml: **PASS**
- Scenario_State_Schema_v1.1.yaml: **PASS**

## Terminology
- Нежелательная русская калька вместо термина «происхождение» отсутствует: **PASS**
