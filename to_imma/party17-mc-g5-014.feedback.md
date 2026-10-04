# Для передачи IMMA: приёмка партии 17 — Joint Rules v1.1.3 (MC-G5-014) ПРИНЯТ и внедрён в валидатор; ревизия 18 калибровок — 17 пробелов у 7 бумаг; заказ партии 18 — структурные исключения / mapping

Отправлен IMMA 04.10.2026 (владелец), партия 17 → заказ партии 18. Одно сообщение от «=== НАЧАЛО ===» до «=== КОНЕЦ ===», без вложений (список пробелов — в тексте).

=== НАЧАЛО ===

## 1. Партия 17 принята (IMMA_Party17_MC_G5_014_Scenario_Mapping_Completeness_v1.0)
- Joint_Simulation_Layer_Rules v1.1.3 — полнота переиздания подтверждена (к v1.1.2: пропаж 0; MC-G5-001 / 013 не изменены); установлены
  в methodology вместе со справочником Scenario_Overridden_Driver_Reference и фикстурами.
- MC-G5-014 реализован в валидаторе 1.12.0 точно по §8: множество шокируемых драйверов строится **динамически** из действующих калибровок
  сценариев (последние версии в portfolio/_scenarios; присутствие в driver_overrides достаточно) — для TAIWAN_SEIZURE / QUARANTINE /
  CHIP_COLD_WAR v1.1.1 получилось ровно 14 драйверов вашего снимка §8.6; контракт исключений §8.4 проверяется полностью (status,
  reason_code, rationale, provenance из словаря, review_ref; substitute_channel — заместители в таксономии и хотя бы один с живым mapping;
  not_applicable_until_anchor — anchor_condition); отчёт §8.5 — outputs.scenario_mapping.drivers (driver_id, exposure, сценарии|фазы,
  mapping_count, статус исключения, заместители). Все 6 ваших фикстур — ожидаемые результаты. Дефолты режима calibration переведены на
  Joint Schema v1.1 / Rules v1.1.3.

## 2. Ревизия действующих калибровок (18 бумаг, без прогонов движка)
Ошибок MC-G5-014 — **17 у 7 бумаг**, все экспозиции ±1 (у остальных 11 бумаг пробелов нет):
| бумага (mc) | драйверы без mapping и без структурного исключения |
|---|---|
| CRWV v1.0.1 | ADVANCED_PACKAGING (+1), HBM_MEMORY (+1) |
| ETN v1.0.2 | GOVERNMENT_DEFENSE (+1), INTEREST_RATES (−1), SEMICONDUCTOR_WFE (+1) |
| MSFT v1.0.1 | GOVERNMENT_DEFENSE (+1), INTEREST_RATES (−1) |
| NET v1.0 | CAPITAL_MARKETS (+1), DATA_CENTER_POWER (+1), HYPERSCALER_CAPEX (+1), INTEREST_RATES (−1) |
| PLTR v1.0 | CAPITAL_MARKETS (+1), INDUSTRIAL_RESHORING (+1), INTEREST_RATES (−1) |
| SPOT v1.0 | AI_COMPUTE_DEMAND (+1) |
| HPS.A v1.0.1 | AI_COMPUTE_DEMAND (+1), INDUSTRIAL_RESHORING (+1) — ваши обоснования партии 16 (дублирование DATA_CENTER_POWER / HYPERSCALER_CAPEX и ELECTRIFICATION_GRID) нужны как структурный объект |
По правилу миграции v1.1.3 принятые калибровки остаются принятыми; хост не считает их сценарно-наблюдаемыми до закрытия пробелов.

## 3. Заказ партии 18: закрыть 17 пробелов
Для каждого случая — либо структурное исключение `scenario_mapping_exception` в mpc_inputs (переиздание mpc_inputs vX.Y+1 полным текстом,
review_ref = ваш идентификатор ревизии), либо mapping в mc-калибровке (переиздание полным текстом + patch notes; центры не трогать; хост
перемерит MC-G5-013 и сделает сухой прогон). Ориентиры по нашему чтению: INTEREST_RATES (−1) у ETN / MSFT / NET / PLTR — скорее mapping на
мультипликатор (как CAPITAL_MARKETS у HPS.A), чем исключение; NET: DATA_CENTER_POWER / HYPERSCALER_CAPEX (+1) — возможно substitute_channel
через AI_COMPUTE_DEMAND / CLOUD_SOFTWARE_DEMAND, если они замкнуты; GOVERNMENT_DEFENSE у ETN / MSFT — вероятно no_causal_channel или
immaterial_at_company_level. Решение по каждому — ваше; просим не выбирать величины по сценарному результату (§8.7).
После партии 18: хост перепроверит MC-G5-014 по всем 18, пересчитает пути под сценариями только для бумаг с новыми mapping и — по
одобрению владельца — заход в режиме вселенной.

## 4. Открытое
Порог ES5 0.02 (§2 Optimizer) — у владельца. DR по кандидатам решён V0 (состав без изменений) — возврат после отчёта HPS.A за Q3 2026.

=== КОНЕЦ ===
