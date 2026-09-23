# Для передачи IMMA: приёмка Dozor Verification Protocol v1.2 + Company Artifact Schema v1.0.5 — ПРИНЯТЫ, интегрированы; заказ сводной редакции v1.2.1

Черновик 23.09.2026, НЕ отправлен. Одно сообщение от «=== НАЧАЛО ===» до «=== КОНЕЦ ===», без вложений.

=== НАЧАЛО ===

## 1. Независимая проверка на нашей стороне — всё проходит
- Обе схемы корректны (jsonschema 4.26, Draft 2020-12): output_report_schema v1.2 и все пять файловых схем v1.0.5.
- Реестр статусов полон: 11 KPI / 5 осей / 6 событий / 3 transition_result / 5 итогов — у каждого label_ru,
  runtime_verified, gate_effect, default_patch_required; enum схемы и реестр совпадают без остатка.
- По схеме v1.2 проходят: настоящий отчёт v1.0 (verify-NBIS-20260922T201443Z — он у нас есть, ваш
  реконструированный fixture не понадобился), оба живых v1.1 (NBIS run2, ASTS) и полный пример ASTS v1.2.
- Пример ASTS v1.2 семантически согласован: KPI-09 found в базе кандидата (2.008854 USD B/year, слагаемые H1 в
  normalization.steps); единственное событие — discrete_event; все 10 transition_checks — not_met с
  runtime_verified false / patch_required false; window_entailment 50→90 дней с сохранённым периодом факта; counts
  по всем четырём секциям совпадают с записями; итог PASS выводится по старшинству. Ссылочная целостность
  transition_checks против triggers.yaml/states.yaml ASTS (trigger_id, ось, from/to, kpi_item_refs) — без замечаний;
  значения и статусы KPI — те же, что в живом v1.1 (кроме перебазированного KPI-09).
- Artifact Schema v1.0.5 по 13 моделям: 0 ошибок (кроме ожидаемой смены schema_version); fixture с
  verification_run_ids проходит, дубликат в списке ловится uniqueItems.

## 2. Интеграция выполнена
- methodology/: Dozor_Verification_Protocol_v1.2.{yaml,md}, Company_Artifact_Schema_v1.0.5.yaml (v1.0.4 снята).
- Миграция всех 17 папок portfolio (13 моделей + 4 реестра) к v1.0.5 (MIG-121/122), снимок S4. Валидатор 1.5.0:
  ART-REF-030/031, протокол v1.2 (реестр transition_result, DZR-011 ссылки transition_checks, DZR-012 база
  derived_fact, DZR-014 criteria:null у pending-оси, DZR-015 not_met/condition_not_met без правки, DZR-010 — итог по
  старшинству с pending только от not_found / state_pending_verification / event_unconfirmed / pending_history);
  17/17 папок pass, отчёты v1.0/v1.1/v1.2 pass. Инструкция дозора переведена на v1.2.
- MIG-122 на живых данных потребовал двух уточнений, которых в патч-ноте нет; мы их приняли как правила миграции
  и просим внести в норматив:
  (а) **уже существующие дубликаты**: у NBIS после прогонов v1.0 и v1.1 в state.json лежали по две строки на KPI
      (legacy-строка run1 без run_id — схема v1.0.3 поля не знала — и строка run2). Правило: дубликаты по тождеству
      наблюдения схлопываются в одну строку: остаётся строка, привязанная к прогону, недостающие поля (value_raw и
      т.п.) добираются из дубликата;
  (б) **восстановление ранних run_id из иммутабельных отчётов**: run_id отчёта добавляется наблюдению, если в
      отчёте есть item с тем же kpi_id, runtime_verified=true и candidate.last_value/value_range, равными значению
      наблюдения (candidate, не found — found у v1.0/v1.1 может быть в базе источника). Результат для NBIS:
      11 наблюдений, KPI-01..10 → [run1, run2], KPI-11 → [run2] (в run1 был not_found — не привязан);
  (в) тождество значения — численное: 3 и 3.0 — одно наблюдение.

## 3. Дефект пакета — просим сводную редакцию v1.2.1 (без изменения семантики)
Dozor_Verification_Protocol_v1.2.yaml объявлен «supersedes v1.1», но содержит только дельту: из v1.1 выпали
нормативные разделы principles (7 принципов), storage-флаги, kpi_rules (not_found_vs_not_disclosed с примером,
qualifier_difference, range_from_single_phrase), axis_verification.inputs / legacy_rule / runtime_write_rules,
event_verification.independence_rule / runtime_write_rules, gate_aggregation.rules, поле semantics у 20 из 25 статусов
(осталось у 5 новых). У нас теперь два нормативных дома у одного протокола (v1.2 для нового, v1.1 для выпавшего) —
это нарушает наше правило «один дом у факта». То же в Company_Artifact_Schema_v1.0.5.yaml: выпал блок
known_migrations_v1_0_3_to_v1_0_4 (MIG-117..120), остальная цепочка на месте.
Заказ: (1) Dozor_Verification_Protocol_v1.2.1 = полный текст v1.1 + дельта v1.2 (те же статусы, схема, правила —
ничего не менять по смыслу; добавить MIG-122 (а)–(в) из §2 в runtime_history); (2) в следующем патче Artifact
Schema вернуть known_migrations_v1_0_3_to_v1_0_4; (3) правило на будущее: переиздание файла = полный предыдущий
текст + дельта, а дельта отдельно описывается в patch notes. Сводную редакцию примем без повторной живой
проверки — только diff к v1.2 + прогон трёх отчётов по схеме.

## 4. Что дальше у нас
Следующие живые прогоны дозора — уже по v1.2 (первый — NVDA или HOOD, по решению владельца), затем остальные
модели; отчётный сезон Q3 — с конца октября. Заказ калибровок HOOD + RKLB готовим отдельно. Партия 3 IMA (Roles &
Seams, Integration Protocol, Golden Cases v0.2, Acceptance Record) — после v1.2.1.

=== КОНЕЦ ===
