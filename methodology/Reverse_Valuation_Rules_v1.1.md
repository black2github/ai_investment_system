# Reverse Valuation — правила v1.1 (дополнение к спецификации v1.0)

Дата: 2026-09-20. Источник: ответ другой LLM на результат первого нормативного прогона SPCX
(run 20260920T183913Z-reverse_valuation-ab1fb7); принято в дозор 20.09.2026. Спецификация v1.0 не меняется,
правила ниже — новая версия методологии (Constitution §26: изменения явные, версией).

## 1. Устойчивость модели: `terminal_value_share_of_pv`

Показатель — диагностика устойчивости модели, а не основание для смены состояния Valuation.
Высокая доля терминальной стоимости не создаёт переход V4→V5 и не отменяет переход, условия которого выполнены.

```yaml
reverse_valuation_stability_rule:
  metric: terminal_value_share_of_pv
  thresholds:
    stable:             "< 0.80"
    terminal_dependent: ">= 0.80 and < 0.95"
    model_fragile:      ">= 0.95"
  effects:
    stable:             { valuation_transition_allowed: true }
    terminal_dependent: { valuation_transition_allowed: true, require_sensitivity_evidence: true }
    model_fragile:      { valuation_transition_allowed: true, require_sensitivity_evidence: true, require_explicit_model_risk_flag: true }
```

Движок (`reverse_valuation` ≥ 1.2.0) выдаёт `model_stability` с классом и флагами; Decision Request при
`model_fragile` обязан содержать строку «Риск модели: результат почти целиком определяется 2031 годом» и
сетку чувствительности. SPCX на 20.09.2026: 0.9996 → `model_fragile`.

## 2. Переходы оси Valuation — только по базовому случаю калибровки

```yaml
valuation_transition_evaluation_rule:
  applies_to: [SPCX-E-31, SPCX-E-32, SPCX-E-33]
  evaluation_case: calibration_base_case
  base_case_definition:
    discount_rate: calibration.discount_rate.base
    terminal_fcf_margin: calibration.terminal_fcf_margin.base
    terminal_fcf_multiple: calibration.terminal_fcf_multiple.base
    margin_transition: calibration.margin_transition
  sensitivity_grid:
    purpose: [robustness_analysis, model_risk_analysis, decision_request_context]
    may_trigger_state_transition: false
```

Ячейки сетки чувствительности не являются альтернативными состояниями мира и не вызывают переход.
Пример: ячейка 34% / 40x → CAGR 61% означает «даже при очень щедрых терминальных допущениях цена требует
61% роста в год», а не «SPCX в V5».

## 3. Фальсификация допущения D3 (траектория маржи Y1–Y3)

KPI не «доказывают маржу −75%», они доказывают экономический механизм: capex прошёл пик, а compute и выручка
продолжают масштабироваться. Поэтому проверки оформлены как recalibration-триггеры внутри оси
Capital_Intensity без смены состояния (`transition: null`): SPCX-E-34/E-35 — контрольная точка Y1
(30.06.2027), SPCX-E-36/E-37 — контрольная точка Y2 (30.06.2028). Пороги — модельные, не guidance компании:
Y1: capex ≤ $15B, AI capex ≤ $12B, compute ≥ 2.0 GW, AI revenue ≥ $4.0B, выручка ≥ $10.0B (подтверждение);
провал — capex > $18B ИЛИ AI capex > $15B ИЛИ compute < 2.0 GW ИЛИ AI revenue < $3.0B ИЛИ выручка < $9.0B.
Y2: capex ≤ $10B, AI capex ≤ $7B, compute ≥ 3.0 GW, AI revenue ≥ $7.0B, выручка ≥ $15.0B; провал —
capex > $15B ИЛИ AI capex > $10B ИЛИ compute < 2.5 GW ИЛИ AI revenue < $5.0B ИЛИ выручка < $12.0B.
Y3 подтверждается не косвенно, а фактом: OCF − capex > 0 и FCF-маржа > 0 два квартала подряд — отдельный
триггер, заводится при приближении Y3. Известный долг v1.1: у E-35/E-37 условие «ИЛИ» чувствительно к
квартальному шуму (1.95 GW вместо 2.0); в следующей версии — зоны warning / fail.

## 4. Связь с реестром

Правила 1–2 реализуются движком; правило 3 — триггерами SPCX-E-34…E-37 в `triggers.yaml` (status planned до
контрольных дат; проверка — spacex-report-check по отчёту за Q2 2027 и Q2 2028).
