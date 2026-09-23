# Joint Simulation Layer Rules v1.1.2

Дата: 2026-09-23  
Статус: proposed normative consolidated  
Supersedes: v1.1.1  
Engine: `company_mc 2.3.1`

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
