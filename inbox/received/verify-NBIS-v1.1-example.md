# NBIS v1.1 example notes

Это **пример отчёта по новой схеме**, построенный из первого живого KPI-run v1.0 и принятой NBIS company-model
структуры. Он нужен для теста схемы/исполнителя; это не новый живой run и не заменяет `verify-NBIS-20260922T201443Z`.

Состав:
- 11 KPI;
- 5 axis_items;
- 1 event_item;
- overall `PASS_WITH_DECLARED_PENDING`.

KPI-05 специально показывает новое правило qualifier normalization:
`source=approximate`, `candidate=exact` → `verified_match_with_normalization`,
`qualifier_patch_suggested=true`, без PATCH_REQUIRED.

Capacity_Secured остаётся `state_pending_verification`: 5 GW — guidance, а actual KPI-11 в полном проверенном
наборе источников не найден.

Event item подтверждает только Q2-disclosure факт, релевантный NBIS-E-01; он не утверждает выполнение
мультиквартального условия NBIS-E-01 и не создаёт `fired`.
