# ETN MC Calibration v1.0.1 — Patch Notes

Дата: 2026-09-24
Статус: normative candidate for host acceptance
Supersedes: `ETN_mc_calibration_v1.0.yaml`
Schema: Company_MC_Calibration_Schema v1.0.2
Declared engine compatibility: `company_mc 2.3.1` (schema const); host runtime: 2.3.2.

## Причина переиздания
Host validator 1.6.0 измерил aggregate target-shift sigma для `revenue_model.segments.ElectricalAmericas.initial_growth` = **0.189**, выше MC-G5-013 growth cap 0.15. Причина — совместное действие шести положительно коррелированных root drivers и persistence; `Σ|effect|` не используется как критерий.

## Методологическое решение
Все шесть эффектов на один и тот же target уменьшены равномерно на **25% (×0.75)**. Это сохраняет относительный вклад драйверов и не переносит нагрузку искусственно на менее коррелированные цели. Host diagnostic на непринятой v1.0 показал, что ×0.75 даёт измеренную sigma ≈ **0.141**, то есть проходит cap 0.15; ×0.70 давал ≈0.132 и потому был бы более сильным уменьшением, чем требуется.

| driver_id | v1.0 | v1.0.1 | scaling |
|---|---:|---:|---:|
| HYPERSCALER_CAPEX | 0.025 | 0.01875 | ×0.75 |
| DATA_CENTER_POWER | 0.02 | 0.015 | ×0.75 |
| ELECTRIFICATION_GRID | 0.02 | 0.015 | ×0.75 |
| UTILITY_CAPEX | 0.02 | 0.015 | ×0.75 |
| INDUSTRIAL_RESHORING | 0.015 | 0.01125 | ×0.75 |
| AI_COMPUTE_DEMAND | 0.012 | 0.009 | ×0.75 |

## Что не изменено
- Все intrinsic distributions и их centers/modes.
- Revenue/margin/valuation tails.
- Все остальные stochastic targets и structural_support.
- Driver set, lags, decay half-lives, transforms, materiality and failure-mode notes.
- Robustness v1.1.2 perturbations: они выводятся из intrinsic distributions, которые не менялись.
- `reverse_valuation_ref`, RV calibration and ETN perimeter decision.
- `calculation_engine_version: company_mc 2.3.1` сохранён по const schema v1.0.2.

## Host acceptance expectation
Повторно проверить validator 1.6.0 MC-G5-001…013, measured sigma по ElectricalAmericas growth, dry run/mapping warnings, determinism и normative 500k. Intrinsic W не должен измениться; full W может немного снизиться вследствие уменьшения joint-driver contribution.
