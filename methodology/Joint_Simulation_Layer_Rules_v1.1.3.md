# Joint Simulation Layer Rules v1.1.3

Дата: 2026-10-04  
Статус: proposed normative consolidated  
Supersedes: v1.1.2  
Engine: `company_mc 2.5.0`

## 1. Нормативный принцип размерности

Единственный hard criterion — **измеренная sigma суммарного target shift** после воспроизведения реального Joint Layer.

`sum(abs(effect_per_plus_1sigma))` — только описательная величина.

Причина: AR(1) persistence, root-factor correlation и EMA/half-life decay могут давать effective driver sigma существенно выше 1.

## 2. MC-G5-013

Для каждой target path validator:

1. строит те же root/driver paths, что engine;
2. применяет persistence;
3. применяет lag;
4. применяет decay/half-life;
5. применяет transform каждого mapping;
6. складывает все mappings в одну target;
7. измеряет sigma по путям;
8. сравнивает с hard cap.

Никакой постоянный `sigma_eff` не хранится в calibration.

### Hard caps

| Target | Unit | Hard cap |
|---|---:|---:|
| annual growth | absolute annual-rate shift | 0.15 |
| margin | absolute margin shift | 0.05 |
| valuation multiple | log shift `ln(M_shocked/M_base)` | 0.15 |
| milestone probability | aggregate logit shift | **0.35** |
| milestone timing | quarters | **1.0** |

Growth для primary 5Y target измеряется на q20. Y3/Y5/Y8 scalar targets — q12/q20/q32.

Для milestone probability/timing validator использует **тот же effective shock в момент оценки milestone**, который использует engine; фиксированный q20 вместо этого запрещён.

## 3. Design headroom

- Mature A: growth 0.10, margin 0.04, log-multiple 0.12.
- Transition B: growth 0.12, margin 0.04, log-multiple 0.12.
- Milestone C: growth 0.12, margin 0.04, log-multiple 0.12, probability-logit 0.25, timing 0.75 quarter.

Hard cap — gate. Headroom — калибровочная цель, не новый gate.

## 4. Milestone probability

Probability измеряется в **logit-space**, потому что native transform = `probability_logit_shift`.

Hard cap 0.35 не означает постоянные 35 п.п. probability. При p около 0.5–0.8 это обычно соответствует примерно 6–9 п.п. движения probability на 1 sigma и автоматически сжимается около 0/1.

Технический успех/неуспех не должен моделироваться главным образом Joint Layer: основной uncertainty живёт в собственной milestone probability, DAG и failure branches.

## 5. Milestone timing

Native unit = quarters.

Hard cap 1.0 quarter означает: общий macro/sector layer может сдвинуть milestone примерно на квартал при 1 sigma, но не должен сам создавать многолетний технический delay.

Многолетний хвост моделируется `timing`, `delay_retry`, `terminal_failure`.

Первый live reference RKLB дал probability sigma 0.118/0.069 logit и timing sigma 0.365/0.147 quarter — существенно ниже caps. Это conformance evidence, не target.

## 6. Deterministic resize

Если измерено `sigma_measured`, а требуется `sigma_design`, и меняются только линейные effect mappings на этой цели:

`effect_new = effect_old * sigma_design / sigma_measured`.

После resize MC-G5-013 запускается повторно.

## 7. Dispersion diagnostics

Intrinsic/full W bands сохраняются как warnings:

| archetype | intrinsic W | full W | max full/intrinsic |
|---|---:|---:|---:|
| mature_positive_margin | 0.25–0.50 | 0.30–0.60 | 1.50 |
| capital_intensive_transition | 0.40–0.85 | 0.45–1.00 | 1.50 |
| pre_service_or_milestone_driven | 0.60–1.30 | 0.70–1.50 | 1.60 |

Ни один диапазон не является optimization target.


## 8. MC-G5-014 — scenario-visible driver mapping completeness

### 8.1 Purpose

`MC-G5-001` remains unchanged: it enforces mapping completeness for material drivers under the company calibration material-driver rule. `MC-G5-014` is a separate hard gate for **scenario observability**. It prevents a non-zero company exposure from becoming mechanically invisible when an active scenario phase overrides that same driver.

### 8.2 Authoritative scenario-driver set

For validation, construct `scenario_overridden_drivers` dynamically from every non-BASE scenario/phase that is enabled for scenario/conditional company runs or portfolio scenario optimization at validation time:

`scenario_overridden_drivers = union(keys(phase.driver_overrides))`

Presence in `driver_overrides` is sufficient. A record with `mean_shift_sigma = 0` still belongs to the set if it is explicitly overridden (for example through `volatility_multiplier` or persistence); the validator must not infer irrelevance from the mean shift alone.

The static list in §8.6 is a reference snapshot only. It is **not** the source of truth for the gate.

### 8.3 Gate

For every `driver_id` such that:

1. `driver_id ∈ scenario_overridden_drivers`; and
2. `mpc_inputs.driver_exposure_vector[driver_id] != 0`;

at least one of the following MUST hold:

A. `driver_parameter_mapping` contains one or more entries with the same `driver_id`; or

B. an explicit scenario-mapping exception exists in `mpc_inputs.driver_interpretation[driver_id].scenario_mapping_exception` and satisfies §8.4.

If neither A nor B holds, validation fails with `MC-G5-014` severity `error`.

The rule is sign-agnostic: `+1`, `-1`, `+2`, and `-2` are all non-zero exposures. The rule does not require one mapping per scenario or per phase; one economically valid company mapping can transmit multiple scenario overrides through the same driver.

### 8.4 Exception contract

An exception is permitted only when omission of a direct mapping is intentional and reviewable. The exception object MUST contain:

- `status: approved_exception`;
- `reason_code`, one of:
  - `substitute_channel` — the scenario effect is intentionally transmitted through other mapped driver(s);
  - `no_causal_channel` — exposure is monitored qualitatively, but the current company model has no defensible quantitative target channel;
  - `immaterial_at_company_level` — non-zero MPC exposure is retained for monitoring, but quantitative effect is judged below calibration materiality;
  - `not_applicable_until_anchor` — mapping would become valid only after a specified accounting/operational anchor (for example first consolidated period after an acquisition);
- non-empty `rationale`;
- `provenance` in the system provenance vocabulary;
- non-empty `review_ref` identifying the calibration review / lifecycle decision that accepted the exception.

Additional requirements:

- For `reason_code: substitute_channel`, `substitute_driver_ids` MUST be non-empty, each substitute driver MUST exist in the same taxonomy, and at least one substitute driver MUST have a live `driver_parameter_mapping` entry in the calibration.
- For `reason_code: not_applicable_until_anchor`, `anchor_condition` MUST be non-empty.
- For all other reason codes, `substitute_driver_ids` MAY be empty but the rationale MUST explicitly state why no quantitative mapping is preferable to a weak/double-counted mapping.
- A bare `reviewed-immaterial`, comment, or free-text rationale outside this exception object does not waive MC-G5-014.
- Exception acceptance does not change the MPC exposure score and does not assert scenario immunity. Optimizer/reporting diagnostics SHOULD surface the exception so that "no modeled sensitivity" is distinguishable from "modeled neutral sensitivity".

The exception location uses the already schema-permitted open object `mpc_inputs.driver_interpretation`; no change to Company MC Calibration Schema v1.0.2 is required for this rule.

### 8.5 Validator algorithm

For each calibration:

1. resolve its canonical `mpc_inputs` and taxonomy version;
2. resolve the active scenario catalog used by the requested run/acceptance context;
3. build the union of overridden driver IDs across all in-scope phases;
4. for each such driver with company exposure != 0, test for a direct mapping;
5. if absent, validate the structured exception contract;
6. emit one result per driver:
   - `mapped`;
   - `exception_substitute_channel`;
   - `exception_no_causal_channel`;
   - `exception_immaterial_at_company_level`;
   - `exception_not_applicable_until_anchor`;
   - or `error_unmapped_scenario_visible_driver`.

The validator report MUST record at least: `driver_id`, exposure score, scenario IDs/phases in which the driver is overridden, mapping count, exception status/reason, and substitute driver IDs if present.

### 8.6 Reference snapshot — scenario-overridden drivers as of 2026-10-04

Derived from `TAIWAN_SEIZURE_v1.1.1`, `TAIWAN_QUARANTINE_v1.1.1`, and `CHIP_COLD_WAR_v1.1.1`:

1. `ACCELERATOR_PRICE_COMPETITION`
2. `ADVANCED_PACKAGING`
3. `AI_CLOUD_PRICING`
4. `AI_COMPUTE_DEMAND`
5. `CAPITAL_MARKETS`
6. `CHINA_REVENUE`
7. `DATA_CENTER_POWER`
8. `GOVERNMENT_DEFENSE`
9. `HBM_MEMORY`
10. `HYPERSCALER_CAPEX`
11. `INDUSTRIAL_RESHORING`
12. `INTEREST_RATES`
13. `SEMICONDUCTOR_WFE`
14. `TAIWAN_SUPPLY`

This snapshot is descriptive. A scenario-catalog change automatically changes the authoritative set without requiring a Joint Rules version bump, provided the validator resolves the same active scenario artifacts used by the engine run.

### 8.7 Relationship to MC-G5-001 and MC-G5-013

- `MC-G5-001`: company-materiality completeness gate; unchanged.
- `MC-G5-014`: scenario-observability completeness gate; new.
- `MC-G5-013`: aggregate target-shift sigma gate; applies after mappings required by 001/014 have been resolved. Adding a mapping to satisfy 014 MUST trigger a fresh MC-G5-013 measurement and dry run.

No mapping magnitude may be chosen merely to make a scenario result look plausible or to improve optimizer output. Mapping existence follows causal model structure; magnitude follows calibration evidence/assumption discipline and remains subject to MC-G5-013 and anti-circularity.
