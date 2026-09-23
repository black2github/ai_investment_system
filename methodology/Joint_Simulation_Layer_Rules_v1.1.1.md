# Joint Simulation Layer Rules v1.1.1

Дата: 2026-09-23  
Статус: proposed normative patch over accepted v1.1  
Engine: `company_mc 2.3.0`

## 1. MC-G5-013: измеренная σ — единственный нормативный критерий размерности

Правило `Σ|effect| <= cap` удаляется как acceptance heuristic.

Причина: при persistent AR(1) driver path и EMA/half-life aggregation эффективный шок на q12/q20/q32
не обязан иметь σ=1. Один mapping с `effect=0.04` может дать target σ около 0.08.

Поэтому валидатор обязан использовать только фактическую процедуру MC-G5-013:

1. воспроизвести Joint Layer paths с root correlations;
2. применить driver persistence;
3. применить lag;
4. применить decay/half-life ровно как `company_mc 2.3.0`;
5. сложить эффекты всех drivers, mapping-ящихся в один target path;
6. измерить σ суммарного target perturbation;
7. сравнить с cap.

Никакой поправочный коэффициент `σ_eff` в калибровке не хранится: он зависит одновременно от persistence,
decay, correlation structure и горизонта и должен рассчитываться валидатором.

Hard caps без изменений:
- annual growth: 0.15;
- absolute margin: 0.05;
- log-multiple: 0.15.

Design headroom:
- Mature A: growth 0.10, margin 0.04, log-multiple 0.12.
- Transition B: growth 0.12, margin 0.04, log-multiple 0.12.
- Milestone C: growth 0.12, margin 0.04, log-multiple 0.12; milestone probability/timing — после первого live C calibration.

`Σ|effect|` разрешено выводить только как descriptive diagnostic. Оно не доказывает прохождение MC-G5-013.

## 2. Re-sizing existing mappings

Если validator уже измерил `sigma_measured`, а нужен `sigma_design`, и меняются только линейные
`effect_per_plus_1sigma` mappings на этой цели, допустим deterministic resize:

`effect_new = effect_old * sigma_design / sigma_measured`.

После resize MC-G5-013 всё равно запускается заново; линейная оценка не заменяет gate.

## 3. Dispersion diagnostics

Intrinsic/full W bands из v1.1 сохраняются как warnings.

Acceptance не требует подгонять W к диапазону; но `intrinsic W` ниже нижней границы требует semantic review
и, если причина — слишком узкие company distributions, widening выполняется в собственных distributions,
а не через Joint Layer.
