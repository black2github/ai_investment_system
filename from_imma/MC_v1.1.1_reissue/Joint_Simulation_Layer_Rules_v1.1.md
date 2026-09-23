# Joint Simulation Layer Rules v1.1

Дата: 2026-09-23  
Статус: proposed normative  
Основание: live-run SPCX/NBIS/NVDA выявил размерностный дефект калибровки, а не движка.

## MC-G5-013 — Aggregate Target Shift Sigma

Каждый `effect_per_plus_1sigma` является **маргинальным вкладом** в общий target budget.

Запрещено калибровать 10 драйверов по принципу «каждый по отдельности способен сдвинуть growth на 10 п.п.»,
а затем складывать все десять через коррелированный Joint Layer.

Для каждого target path G5 воспроизводит Joint Layer на 20,000 путях с `calibration.simulation.seed`,
включая root correlations, persistence, lag и decay, и измеряет σ **суммарного** сдвига.

Hard caps:

| target | measurement | σ max |
|---|---|---:|
| annual growth | absolute annual-rate shift, q20 | 0.15 |
| margin | absolute margin shift at target evaluation quarter | 0.05 |
| valuation multiple | `ln(M_shocked/M_base)` at horizon quarter | 0.15 |

Для horizon nodes используется нативная временная семантика движка: Y3→q12, Y5→q20, Y8→q32.

Design headroom:
- Mature A: growth 0.10, margin 0.035, log-multiple 0.10.
- Transition B: growth 0.12, margin 0.04, log-multiple 0.12.
- Milestone C: пока те же growth/margin/multiple budgets; probability/timing caps отложены до первого live C-run.

Hard cap — acceptance gate. Design headroom — цель калибратора, чтобы sampling noise или новая корреляция не
подняли документ прямо к границе.

## Разграничение дисперсии

`intrinsic_run`:
Joint driver mappings выключены; собственные distributions, latent factors и idiosyncratic shocks компании остаются.

`full_run`:
обычный Joint Layer включён.

Диагностика:

`W = q95(CAGR equity 5Y) - q5(CAGR equity 5Y)`.

Ориентиры, **не цели подгонки**:

| archetype | intrinsic W | full W | max full/intrinsic |
|---|---:|---:|---:|
| mature_positive_margin | 25–50 п.п. | 30–60 п.п. | 1.50 |
| capital_intensive_transition | 40–85 п.п. | 45–100 п.п. | 1.50 |
| pre_service_or_milestone_driven | 60–130 п.п. | 70–150 п.п. | 1.60 |

Если intrinsic ниже диапазона — сначала расширяется собственная неопределённость параметров компании, а не Joint Layer.

Если `W_full/W_intrinsic` выше лимита — Joint Layer фактически стал главным генератором риска, что противоречит его роли
как слоя общей ко-движухи.

Эти диапазоны не основаны на исторической волатильности цены и не используются как optimization target. Они являются
model-assumption sanity bands и должны пересматриваться на golden/live cases.
