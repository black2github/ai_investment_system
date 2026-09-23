# Company Conditional Monte Carlo — Specification v1.1.2

Дата: 2026-09-23  
Статус: proposed normative patch over v1.1.1  
Engine: `company_mc 2.3.0`

Все правила v1.1.1 сохраняются. Изменяются два раздела: sizing Joint Layer и robustness.

## 1. Joint target sizing

MC-G5-013 из `Joint_Simulation_Layer_Rules_v1.1.1` является единственным hard dimensional gate.

Gross sum `Σ|effect_per_plus_1sigma|` не используется как proxy для σ.

## 2. Robustness: local stability ≠ stress test

Прежние фиксированные perturbations:
- growth ±10 pp;
- margin ±5 pp;
- terminal multiple ±20%

смешивали две разные задачи:
- локальную устойчивость к изменению центрального допущения;
- стресс-тест хвоста.

В v1.1.2 они разделены.

### 2.1 Local Robustness — hard pass

Параметрическая ширина переводится в sigma-equivalent:

`σ_eq = (Q84 - Q16) / 2`.

Для terminal multiple расчёт выполняется в log-space:

`σ_log = (ln Q84 - ln Q16) / 2`.

Growth reference:
base-revenue-weighted RMS `σ_eq` распределений `initial_growth` сегментов.

Margin reference:
- archetype A: `σ_eq(Y5 terminal margin)`;
- archetype B/direct: `σ_eq(Y5 terminal FCF margin)`;
- archetype B/OCF-capex: `sqrt(σ_ocf_Y5² + σ_capex_Y5²)`;
- archetype C: соответствующий service-margin reference после отдельной C-спецификации.

Local perturbation:

`delta_local = 0.25 * σ_reference`.

Absolute ceilings сохраняются, чтобы local test не превратился обратно в stress:
- growth: max 10 pp;
- margin: max 5 pp;
- multiple: max 20% relative move.

Для multiple:
- up = `exp(0.25*σ_log)-1`;
- down = `exp(-0.25*σ_log)-1`,
после применения ceiling.

Correlation perturbation остаётся ±0.15.

Pass rule не меняется:
1. sign(median CAGR 5Y) preserved in >=75% runs;
2. `|ΔP(2x)| <= 0.10` and `|ΔP(loss>30%)| <= 0.10` in >=75% runs.

### Почему 0.25σ, а не 0.5σ

Calibration robustness — локальная проверка, а не второй Stability Test.

Сдвиг центра на 0.25σ достаточно велик, чтобы выявить зависимость результата от конкретной точки mode,
но не дублирует уже существующие severe perturbations Portfolio Stability Test.

### 2.2 Absolute Stress Sensitivity — diagnostic only

Validator дополнительно может запускать прежнюю сетку:
- growth ±10 pp;
- margin ±5 pp;
- multiple ±20%;
- correlation ±0.15.

Она сохраняется в отчёте как sensitivity diagnostic, но не определяет `robustness.pass`.

Это полезно: например SPCX/NVDA могут быть локально устойчивы, но экономически чувствительны к большому
valuation/growth stress. Такая чувствительность должна быть видна, а не превращаться в schema/calibration failure.

## 3. Dispersion sanity

Intrinsic/full W bands остаются warnings, не targets.

Если Transition B имеет intrinsic W ниже 0.40, сначала рассматривается расширение собственных revenue/margin/valuation
distributions при неизменных центральных anchors.

Joint Layer не используется для искусственного доведения W до диапазона.

## 4. Anti-circularity

Правило v1.1.1 сохраняется: при `|RV_Growth_Gap| <= 1 pp` обязателен независимый operating-evidence bridge.
