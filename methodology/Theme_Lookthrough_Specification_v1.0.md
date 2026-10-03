# Theme Look-through — Specification v1.0

Дата: 2026-10-03  
Статус: proposed normative  
Партия: 12

## 1. Назначение
Theme Look-through переводит вес бумаги в аддитивные доли экономических тем по раскрываемым сегментам. Он не заменяет sector_id, MPC driver_exposure_vector, common-cause risk или company calibration.

## 2. Артефакт
Отдельный `portfolio/<ticker>/theme_exposure_v1.0.yaml`; Company Artifact/MPC schema v1.0.5 этой партией не переиздаётся.

## 3. Аддитивность
Внутри каждого basis первичные темы взаимоисключающие и суммируются до 100%. Portfolio theme exposure: `T_theme(w)=Σ_i w_i*share_i,theme`. Aggregate theme (AI_TOTAL) суммирует объявленные primary themes ровно один раз.

## 4. Binding basis
Для owner policy «тема ИИ не наращивается» binding basis = revenue. Capex и operating-income views обязательны как diagnostics распределения капитала, но не подменяют revenue constraint.

## 5. Operating income
Signed segment OI хранится raw. Для аддитивной diagnostics: `OI_abs_share_j=|OI_j|/Σ|OI_k|`. Это не доля прибыли и не owner constraint.

## 6. Не раскрыто
Если segment basis не раскрыт: explicit 100% primary-theme fallback, `provenance=model_assumption`, fallback flag. Он предотвращает ложный ноль, но не может удовлетворить strong-driver consistency THM-007.

## 7. Owner AI_TOTAL V1
Baseline date 2026-09-21. `T_AI_TOTAL(target)<=T_AI_TOTAL(baseline)+tolerance`. Baseline число материализует хост; до этого `PENDING_HOST_COMPUTE`. Перестановки внутри темы допустимы, если сумма не растёт.

## 8. Driver consistency
Driver vector остаётся ordinal -2..+2 sensitivity. Для abs(score)=2 и `strong_share_check`: mapped non-fallback revenue/capex share должен быть >=20% либо нужен explicit exception. 20% = model_assumption, pending owner_judgment. Macro/dependency drivers не обязаны иметь business share.

## 9. Обновление
Новый report, resegmentation, material M&A/spin/disposal или новое segment disclosure запускают обновление ThemeExposure. Calibration lifecycle рассматривается отдельно.

## 10. Валидация
THM-001…012 в `Theme_Lookthrough_Rules_v1.0.yaml`. Double counting, silent omission и перевод driver score в процент бизнеса запрещены.
