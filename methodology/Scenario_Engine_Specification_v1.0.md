# Scenario Engine — Specification v1.0

Дата: 2026-09-25  
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
