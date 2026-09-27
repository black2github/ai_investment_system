# Calibration Lifecycle v1.0 — строки перекрёстных ссылок для следующих редакций

Партия 9. Эти строки предлагаются как **ссылки**, без переноса чужих критериев в Lifecycle.

## Dozor Verification Protocol — CLR-1

> Если `verified_fact`, используемый принятой RV/MC-калибровкой, отличается от канонического проверенного значения либо новый отчёт делает базовый период устаревшим, Dozor фиксирует результат проверки; необходимость и тип изменения калибровки определяются `Calibration_Lifecycle_Rules v1.0`, CLR-1. Dozor не выбирает calibration parameters.

## Company Artifact Schema / triggers.yaml — CLR-2

> Подтверждённый state transition или accepted recalibration trigger может требовать пересмотра RV/MC-калибровки; маршрутизация выполняется по `Calibration_Lifecycle_Rules v1.0`, CLR-2. Trigger ≠ Decision.

Если позже нужен машиночитаемый field, безопасная точка расширения:

```yaml
calibration_lifecycle_ref: CLR-2
```

Само поле не вводится этой партией в Company Artifact Schema.

## Reverse Valuation Rules v1.1 §3 — CLR-2

> Recalibration triggers внутри оси, включая triggers без смены state label, являются частным случаем `Calibration_Lifecycle_Rules v1.0`, CLR-2; критерии самого trigger остаются в Reverse Valuation Rules/company artifacts.

## Joint Simulation Layer Rules / MC-G5-013 — CLR-4

> После принятого изменения Joint root mapping, root correlation, persistence semantics или driver construction все company MC calibrations подлежат lifecycle-ревалидации по `Calibration_Lifecycle_Rules v1.0`, CLR-4; конкретная проверка measured aggregate target sigma выполняется действующим MC-G5-013.

## Company Conditional MC — CLR-4

> Изменение Joint Layer, calibration schema или engine semantics обрабатывается через `Calibration_Lifecycle_Rules v1.0`, CLR-4. Valuation-basis/dispersion diagnostics сами по себе не являются основанием для перекалибровки.

## Exchange / reissue rule

> При `patch`, `reissue` или `archetype_change` изменённый calibration artifact передаётся полным текстом; отдельная дельта/patch notes обязательна, `supersedes` обязателен. Старые файлы и calc runs остаются записями воспроизводимости.

Lifecycle только ссылается на это правило и не дублирует формат механического `check_supersedes`.
