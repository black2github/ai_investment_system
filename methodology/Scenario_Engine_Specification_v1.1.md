# Scenario Engine — Specification v1.1

Дата: 2026-09-27  
Статус: proposed normative  
Назначение: нормативный дом дискретных многоквартальных состояний мира, которые воздействуют на Joint Simulation Layer только через общие drivers/root correlations и не меняют Company Calibration напрямую.

## 1. Граница слоя

Pipeline:

`Scenario Engine -> phased driver/root overrides -> Joint Simulation Layer -> Company MC -> Joint Portfolio Paths -> Stability/MPC/Optimizer`

Scenario Engine определяет допустимые сценарии, вероятности, фазовую динамику и factor overrides. Joint Layer сохраняет общие path shocks и company mappings. Company Calibration не переписывается сценарием.

`Trigger != Decision`. Сценарий и его вероятность не являются торговой рекомендацией.

## 2. Scenario set и вероятности

Один нормативный run использует один `mutual_exclusion_set`. Сценарии внутри него взаимоисключающие. `BASE` существует всегда и не требует отдельной калибровки.

Для non-BASE сценариев вероятность является `owner_judgment`. До решения владельца допускается `probability: null`, `probability_status: pending_owner_judgment`; тогда разрешены scenario-specific runs, но запрещены mixture metrics, ScenarioConcentration и §3.3 Stability probability perturbations.

После задания вероятностей:

`p_BASE = 1 - sum(p_non_BASE)`

Hard validation: все `p >= 0`, `sum(p_non_BASE) <= 1`; итоговая сумма вместе с BASE равна 1 с tolerance `1e-12`.

## 3. Фазы

Сценарий содержит упорядоченный список `phases`. Каждая фаза задаёт **целевое состояние относительно BASE**, а не инкремент к предыдущей фазе.

### 3.1 effective_from

Поддерживаются:
- `fixed_quarter`: один квартал от `t0`;
- `triangular_quarter`: целочисленный draw `min/mode/max`;
- anchor `t0` или `phase:<phase_id>`; при phase-anchor draw является offset от фактического старта указанной фазы.

Timing draw выполняется один раз на `(scenario_id, path_id, phase_id)` и общий для всех компаний данного path.

### 3.2 ramp и duration

`ramp_quarters` — число кварталов линейного перехода от предыдущего активного состояния к целевому состоянию фазы.

`duration_quarters`:
- положительное целое — plateau после ramp;
- `until_next_phase` — до старта следующей фазы;
- `until_end` — до конца горизонта.

Если integer-duration заканчивается раньше следующей фазы, состояние линейно возвращается к BASE за `decay_quarters`; при `decay_quarters=0` возврат ступенчатый.

### 3.3 Override semantics

В каждой фазе отсутствующий driver означает BASE: `mean_shift_sigma=0`, `volatility_multiplier=1`, `persistence_override=null`. Это запрещает неявное наследование старого шока.

Для driver `d` в квартале `t`:

`ScenarioDriver_d,t = mu_d,t + vol_d,t * BaseDriver_d,t(persistence_override_d,t)`

где `mu` измеряется в σ стандартизированного BASE driver. `volatility_multiplier > 0`. `persistence_override`, если задан, находится в `[0, 0.99]`; `null` означает базовую persistence semantics Joint Layer.

Override применяется **после генерации root shocks / стандартизации driver path и до company driver_parameter_mapping**, как требует интерфейс Joint Layer. Structural support Company Calibration не удаляется и не добавляется.

Во время ramp:
- `mean_shift_sigma` интерполируется линейно;
- `log(volatility_multiplier)` интерполируется линейно, то есть volatility меняется геометрически;
- `persistence_override` интерполируется линейно, если оба конца заданы; если один конец `null`, до середины ramp используется старое значение, после середины — новое. Движок обязан записать этот переход в diagnostics.

## 4. Root correlation overrides

Фаза может переопределять отдельные пары root correlations. Неуказанные пары берутся из Joint Layer BASE matrix.

Для каждой фазовой target matrix обязательна PSD-проверка. Normative engine **не чинит** не-PSD matrix автоматически: calibration invalid. Во время ramp используется convex interpolation предыдущей и новой PSD matrices; convex combination PSD matrices остаётся PSD.

Для common-random-number сопоставимости BASE/scenario рекомендуется генерировать одинаковые iid innovation vectors по `path_id` и применять соответствующий matrix square root каждой фазовой correlation matrix.

## 5. Детерминизм

Нормативная адресация RNG:
- root/common innovations: `(global_seed, path_id, factor_id, quarter)`;
- phase timing: `(global_seed, scenario_id, path_id, phase_id, timing)`;
- scenario sampling, если используется sampling вместо weighted mixture: `(global_seed, path_id, scenario_set_id)`.

Реализация hash/SeedSequence может отличаться, но один и тот же input hash + seed обязан давать идентичный output.

## 6. Portfolio mixture

Предпочтительный нормативный способ — не пересэмплировать scenario label, а объединять scenario-specific path distributions как weighted empirical distribution. Для каждого scenario имеется одинаковое число `N` path_id, и каждый outcome получает вес `p_s/N`.

Median, quantiles, loss probabilities и ES считаются по weighted empirical distribution. Это устраняет дополнительный Monte Carlo noise от случайного выбора scenario.

## 7. Scenario contribution и ScenarioConcentration

Нелинейные median/ES не представляются как аддитивная сумма сценариев. Поэтому используются прозрачные diagnostics относительно BASE.

Для метрики median terminal return/value:

`MedianImpact_s = p_s * (Median_s - Median_BASE)`.

Для ES5, где меньшее значение хуже:

`ES5Impact_s = p_s * (ES5_s - ES5_BASE)`.

Adverse ES burden:

`B_s = p_s * max(0, ES5_BASE - ES5_s)`.

`ScenarioConcentration = max_s(B_s) / sum_s(B_s)` для non-BASE сценариев. Если `sum B_s == 0`, значение `0` и diagnostic `no_adverse_scenario_burden=true`.

Optimizer: warning >50%, hard limit >60%, как в Portfolio Optimizer v1.0. Это риск-концентрация, а не probability concentration и не NAV exposure.

## 8. Stability Test §3.3

При заданных owner probabilities:
1. Для каждого non-BASE scenario: `p_s * 0.75` и `p_s * 1.25`, затем renormalize всех сценариев включая BASE.
2. `one-scenario-up`: scenario с максимальным `B_s` получает `+0.10` absolute probability; 10 п.п. пропорционально забираются у всех остальных сценариев по их текущей probability. Если donor mass <0.10, perturbation invalid, silent clipping запрещён.
3. После каждого perturbation пересчитываются weighted mixture, ScenarioConcentration и Optimizer.

Если probability pending, эти тесты возвращают `not_testable_pending_owner_probability`.

## 9. Mapping coverage

Scenario Engine никогда не создаёт company-specific growth/margin shift. Если driver есть в scenario, но отсутствует в `joint_simulation.active_drivers`/`driver_parameter_mapping` компании, компания не реагирует на этот driver.

Отчёт обязан показать:
- `scenario_drivers_applicable`;
- `scenario_drivers_unmapped`;
- `scenario_drivers_explicitly_immaterial`;
- mapping version/hash.

Пробел mapping не разрешается скрытой эвристикой.

## 10. Anti-double-counting

Запрещено одновременно отражать один механизм через scenario driver shift и ручной company parameter override. `structural_support` остаётся частью BASE calibration. Исключение возможно только с явным `double_count_exception` и rationale; v1.0 scenarios таких исключений не используют.

## 11. Отчёт движка

На компанию и портфель сохраняются:
- scenario_id, phase start draws и phase state по кварталам;
- scenario-specific CAGR 3/5/8Y, q05/q50/q95, P(loss>30), P(loss>50), P(2x), ES5;
- mixture metrics при известных probabilities;
- MedianImpact/ES5Impact/B_s/ScenarioConcentration;
- breakdown `delta_vs_BASE` по driver через deterministic one-driver-at-a-time reruns, если requested; сумма driver deltas не объявляется точной декомпозицией при нелинейностях;
- unmapped/immaterial driver flags;
- PSD diagnostics и correlation-matrix hash;
- deterministic input hash/global_seed.

## 12. Validation

Hard checks:
- JSON Schema Draft 2020-12;
- уникальные scenario_id/phase_id;
- phase dependency graph acyclic;
- sampled phase starts monotonically compatible for every path;
- volatility >0; persistence in [0,0.99];
- каждый driver существует в canonical taxonomy;
- root names существуют в Joint Layer;
- каждая target root correlation matrix PSD (tolerance min eigenvalue >= -1e-10);
- probability contract;
- deterministic replay;
- same path_id/common innovations across companies;
- no hidden company overrides;
- coverage report present.

## 13. Совместимость с company_mc 2.3.2

2.3.2 уже умеет constant-horizon `scenario.driver_overrides`. Для v1.0 Scenario Engine необходим orchestration layer, который материализует квартальные phase overrides. До реализации фаз calibration можно прогнать только в compatibility mode как constant phase snapshot; такой run помечается `non_normative_compatibility_run`.

Company calibrations не меняются из-за сценария. Исключение — отдельно принятый mapping/taxonomy patch, который проходит собственную host validation/MC-G5-013.


## 14. Machine-verifiable semantic composition

v1.1 adds a semantic recognition layer without changing v1.0 numerical semantics. `effective_from`, phase timing draws, ramps, durations, driver overrides, root-correlation overrides, persistence, mixture rules, ScenarioConcentration and Stability §3.3 remain unchanged.

The new semantic layer answers four distinct questions:

1. `Scenario_Event_Catalog_v1.0.yaml`: what observable event has occurred?
2. `scope`: which mutually-exclusive scenario member contains or excludes that event?
3. `entry_criteria` / `exit_criteria`: which phase is recognized by Dozor/runtime state?
4. `outcome_mapping`: how the owner's natural-language outcome maps to exactly one modeled member, BASE, or explicit `OUTSIDE_SET`.

Recognition criteria never replace phase timing distributions in an unconditional scenario run. They are used for monitoring, probability review, conditional reruns and owner-facing explanations.

`Trigger != Decision` remains mandatory.

### 14.1 BASE semantics (`base_when`)

BASE is not a peaceful pre-race counterfactual. BASE represents the current observed structural regime already embedded in company calibration centers. In `GEOTECH_REGIME_8Y_V1`, this includes the ongoing 2026 semiconductor/AI/defense race and can include Chinese domestic compute sufficient for military AI, provided the leading-edge parity, Taiwan quarantine/full-blockade and armed-conflict defining events remain unconfirmed.

Accordingly, `CHIP_COLD_WAR/RACE_TO_PARITY` means acceleration above the current BASE race toward parity, not the onset of the race.

## 15. Scenario Event Catalog

The normative global catalog is `Scenario_Event_Catalog_v1.0.yaml`.

Each modeled `event_id` has:
- observable definition;
- exactly one `assigned_member` in the relevant scenario set (`BASE` or one non-BASE scenario);
- `observable_criteria` referencing stable `fact_id` values;
- typed comparison/operator, threshold/window where a numeric rule is useful;
- explicit disambiguation from neighboring events;
- `meta.provenance` and rationale for every model threshold.

Thresholds in the event catalog are `model_assumption` unless a source explicitly defines the threshold. They are recognition rules, not claims that the event has occurred.

`external_events` are explicit owner-relevant outcomes that are outside the current mutually-exclusive modeled set. They are not silently forced into BASE or an existing scenario.

## 16. Scenario `scope`

Every v1.1 calibration contains:

- `scope.includes[]`: modeled catalog events uniquely assigned to this scenario, each linked to a phase;
- `scope.excludes[]`: events that, if confirmed as defining outcomes, prevent this scenario from being the sole current member;
- `scope.base_when`: observations that remain compatible with BASE and therefore must not be treated as non-BASE scenario confirmation;
- `scope.narrative`: one short deterministic explanation suitable for an owner-facing agent;
- `event_catalog_ref` and `outcome_mapping_ref`.

`includes` are a partitioning device: an event cannot appear in `includes` of two members of one `mutual_exclusion_set`.

Shared precursors are therefore represented as BASE-compatible events or fact criteria rather than duplicated `includes`. In particular, `EV-TW-RESTRICTIONS` is a shared precursor for both Taiwan scenarios and does not by itself select either one.

If different defining events from different members are confirmed at the same time, the set enters `ambiguous_set_conflict`; the agent/integrator must request scenario-set/probability review rather than inventing precedence.

## 17. Phase entry and exit criteria

Each phase has non-empty `entry_criteria` and `exit_criteria`.

Criterion reference types:
- `event_id`;
- `fact_id`;
- `system_condition: scenario_horizon_reached` for a terminal phase.

Dozor/integrator semantics:
- `not_observed`: no positive evidence for entry criteria;
- `candidate`: at least one entry criterion has positive verified evidence, but not all required entry criteria are confirmed;
- `confirmed`: **all** phase `entry_criteria` are satisfied with required verification;
- `exited`: **all** phase `exit_criteria` are satisfied, or the terminal system condition is reached.

A criterion with `verification_required: true` is satisfied only by Dozor `verified` evidence. `pending_verification`, `not_disclosed` and `source_unavailable_technical` do not satisfy it.

These states affect monitoring and conditional reruns only. In an ordinary unconditional Monte Carlo run the engine still samples phase starts from `effective_from` exactly as in v1.0.

## 18. Mutual-exclusion outcome mapping

`Scenario_Event_Catalog_v1.0.yaml` contains `mutual_exclusion_sets[].outcome_mapping`.

For `GEOTECH_REGIME_8Y_V1` the normative owner-wording mapping is:

- continued 2026 technology/defense race without parity/Taiwan crisis -> `BASE`;
- China sufficient for operational military AI but below leading-edge parity -> `BASE`;
- Taiwan quarantine / partial blockade without combat -> `TAIWAN_QUARANTINE`;
- full blockade, even without confirmed combat -> `TAIWAN_SEIZURE` under the current conservative owner mapping;
- invasion/armed conflict -> `TAIWAN_SEIZURE`;
- leading-edge parity followed by persistent bifurcated systems -> `CHIP_COLD_WAR`;
- full Chinese-chain superiority followed by Western strategic disengagement from Taiwan -> `OUTSIDE_SET` until a separate calibration is accepted.

Future `CHIP_COLD_WAR_THEN_SEIZURE`, if introduced, is a new member with its own unconditional joint probability. Existing probabilities must then be repartitioned by the owner; it cannot be added on top of current member probabilities.

## 19. Validation additions

The following checks are added to the inherited v1.0 checks:

### SCN-012 — unique scenario includes
Within one `mutual_exclusion_set`, no `event_id` may appear in `scope.includes` of more than one scenario.

### SCN-013 — event ownership
Every modeled event in the global catalog must have exactly one `assigned_member`, which must be either `BASE` or a member of the set. If assigned to a non-BASE scenario, the event must appear exactly once in that scenario's `scope.includes`. Explicit `external_events` are excluded from this rule and must map only to `OUTSIDE_SET` outcomes.

### SCN-014 — phase criteria integrity
Every phase must have non-empty `entry_criteria` and `exit_criteria`. Every referenced `event_id` must exist in the event catalog; every `fact_id` must exist in one of the scenario fact catalogs used by the set.

### SCN-015 — include/exclude integrity and coverage
For each scenario, `scope.includes` and `scope.excludes` must be disjoint. A modeled event not mentioned by any scenario scope/base rule/outcome mapping is a warning (`scenario_event_coverage_gap`), not an automatic reassignment.

## 20. Runtime `scenario_state`

Runtime state lives in `portfolio/_scenarios/state.json` and conforms to `Scenario_State_Schema_v1.0.yaml`.

For every scenario and phase it stores:
- `status ∈ {not_observed, candidate, confirmed, exited}`;
- confirmed event/fact IDs;
- timestamps and source references;
- Dozor `verification_status` and immutable verification run ID where available;
- confirmed quarter;
- current owner probability / probability status;
- last probability-review timestamp.

Set-level state also stores `classification` and `status ∈ {normal, ambiguous_set_conflict, outside_set_review}`.

`scenario_state` is a runtime artifact. It does not mutate the calibration YAML.

## 21. Confirmed-phase conditional run

A confirmed phase has priority over its calibration timing distribution **only in a conditional scenario run**.

If phase `P` is confirmed at observed date/quarter:
1. define conditional-run `t0` as the quarter containing `P.confirmed_at`;
2. materialize `P.effective_from` as `fixed_quarter: 0` for that conditional run;
3. phases before `P` are historical and excluded from the forward horizon;
4. later phases retain their accepted timing distributions, re-anchored to the observed start of `P` where their anchor references `P` or a later phase;
5. compute the conditional scenario-specific portfolio picture with scenario probability `1.0`;
6. do **not** overwrite owner probabilities or the normal mixture; mixture update is a separate owner decision/review.

Unconditional normative runs remain bitwise governed by the original calibration timing distributions.

## 22. Strategy extension points and owner-agent signal

v1.1 reserves nullable `strategy_ref` at scenario and phase level. No action semantics are introduced yet.

Future `Scenario_Action_Layer` owns precommitted strategy content such as reductions, additions, hedges and cash targets, with `model_assumption | owner_judgment` origin and conditional-optimizer evidence.

When a phase moves to `confirmed`, the owner agent's signal contract is:
- scenario ID and phase ID;
- confirmation timestamp;
- confirmed `event_id` / `fact_id`;
- sources and verification status;
- current conditional portfolio picture under the scenario;
- `strategy_ref`;
- pre-recorded actions from that strategy if a strategy exists;
- explicit reminder that the trigger is not the decision.

If `strategy_ref == null`, the agent must not invent portfolio actions; it reports the recognition state and requests/awaits the owner's decision.

## 23. Seam with legacy `portfolio/_scenarios/taiwan.yaml`

Moved into v1.1 recognition layer:
- `signal_sources` -> event/fact preferred/fallback sources;
- `confirmation_rule` -> verification requirement / event criteria;
- stage `id`, `name`, `signal` -> event definitions, scope and phase entry/exit criteria;
- legacy stage references -> `links.legacy_action_scenario_refs`.

Reserved for future action layer v1.2:
- `actions`;
- `cash_reallocation`;
- target residual position logic;
- trading-day timing instructions;
- stage action sequencing;
- action lifecycle/status.

The legacy `automation` field is delivery/watcher configuration, not Scenario Engine numerical semantics.

## 24. v1.0 -> v1.1 compatibility

v1.1 is a semantic-only extension.

Unchanged:
- phase order and timing distributions;
- ramps/durations/decays;
- all driver override numbers;
- all root-correlation override numbers;
- persistence semantics;
- path RNG;
- portfolio mixture;
- ScenarioConcentration;
- Stability §3.3.

Required migration additions:
- `as_of`, `supersedes`;
- `scope`;
- phase `entry_criteria`, `exit_criteria`, nullable `strategy_ref`;
- scenario nullable `strategy_ref`, `state_ref`;
- `fact_catalog[].event_id`.

A v1.1-aware orchestrator must ignore semantic fields for ordinary unconditional path generation. Therefore, given the same numerical calibration, seed and engine version, v1.0 and v1.1 scenario paths are expected to be bitwise identical.
