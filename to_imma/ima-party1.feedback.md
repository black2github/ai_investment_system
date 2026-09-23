# Для передачи другой LLM: приёмка партии 1 (Candidate Schema v1.0 + Company Artifact Schema v1.0) — принято условно, патч v1.0.1

Черновик 22.09.2026, НЕ отправлен. Вставляется одним сообщением от «=== НАЧАЛО ===» до «=== КОНЕЦ ===» с одним
вложением: `party1-validation-report.md` (Downloads).

=== НАЧАЛО ===

## Результат приёмки партии 1
Проверено на нашей стороне независимо (jsonschema 4.26, Draft 2020-12), по файлам workspace на git-снимке S0
(коммит df6029d, 238 файлов; git в workspace заведён):
- обе схемы — корректные JSON Schema; x-full-example проходит Candidate Schema без ошибок;
- NBIS: ошибки до миграции ровно те, что перечислены в §7 пояснения (states 1 / kpis 35 / triggers 11 / mpc 1 /
  state.json 14); после детерминированной миграции по §7 (сухой прогон) — 0 ошибок во всех пяти файлах.
Критерии приёмки партии по эталону NBIS выполнены. **Партия принята условно**: схема построена по одному эталону, а
прогон по остальным 12 принятым моделям (NVDA, HOOD, CRWV, ASTS, LLY, NET, ETN, META, ASML, RKLB, PLTR, MSFT) выявил
поля, которые реально существуют в принятых артефактах, но схемой запрещены (additionalProperties: false) или имеют
иную форму. Полный отчёт — во вложении (разделы C «миграция» и D «пробел схемы»).

## Заказ: патч Company Artifact Schema v1.0.1 (и, где нужно, Candidate Schema v1.0.1)
Правило патча: расширять, не переписывать; принятые ID, состояния и смыслы не трогать; каждое добавленное поле —
в field_catalog с классификацией и владельцем. По каждому пункту раздела D нужно одно из трёх решений: (а) поле
входит в схему как first-class, (б) поле объявляется deprecated с правилом миграции, (в) поле — ошибка артефакта,
чинится миграцией. Наши предложения:

1. **`states.yaml → sources.*` — объект, а не строка.** В 10 моделях из 13 источник — объект {url, type, as_of, …};
   строка (только URL) — в NBIS, NVDA, HOOD. Нормативной должна быть объектная форма (с source_class), строковая — deprecated. Это же
   касается Candidate Schema `sources[]`.
2. **Качественные оси (golden case GC-006, ASTS).** `axes.*.evidence_type`, `axes.*.verification_rule`,
   `scenario_state.*.evidence_type` — first-class: именно они кодируют «качественное регуляторное свидетельство,
   бинарный KPI с объявленной деривацией». Запрет этих полей противоречит вашему же golden case.
3. **Окно наблюдения (golden case GC-005, ASTS).** `critical_kpis[].observation_window_days` и то же в
   `kpi_observations[]` — first-class (сохранение «within 50 days» дословно требует поля, а не примечания).
4. **`value_type` в старых файлах несёт квалификатор** (`lower_bound`, `upper_bound`, `approximate` — ASTS, RKLB, CRWV).
   Согласны с разделением на value_type + observation_qualifier (enum в Candidate Schema уже содержит exact /
   approximate / lower_bound / upper_bound / range / not_separately_disclosed / pending_verification — этого
   достаточно); нужно правило миграции «старый value_type ∈ {lower_bound, upper_bound, approximate} →
   observation_qualifier, value_type := actual» в известных миграциях Artifact Schema и в kpi_observations.
5. **Бинарные KPI без жёлтой зоны** (`thresholds.yellow` отсутствует, ASTS): для evidence_type: binary допустить
   thresholds из двух зон или явный `binary: true`.
6. **`states.yaml → semantics`**: поля `primary_only`, `thresholds_provenance` (7 моделей), `existing_trigger_policy`
   (NET/ETN), `accounting_note` (ASML); `states.yaml → changelog` (ASTS); `kpis.yaml → zone_semantics.green/yellow/red`
   (LLY); `mpc_inputs → driver_exposure_semantics` (ASML/LLY/META), `benchmark.methodology_ref` (CRWV);
   `triggers.yaml → rules.all_numeric_thresholds_provenance` (ASML/LLY/META). Предложение: `thresholds_provenance` →
   deprecated в пользу `numeric_thresholds_provenance` (миграция переименованием), остальное — optional first-class.
7. **Реестр владельца без модели компании и legacy-реестры (NET/ETN, а также SU/6506/6324/CRWD, где модели не
   заказывались).** triggers.yaml должен валидироваться в двух профилях: `registry_only` (нет states/kpis/mpc;
   `rules` optional; meta с полями `currency, fiscal_year, horizon, price_at_strategy, scenario, status_in_basket,
   strategy_date, strategy_source…`; триггеры с `window`, без `fired` до первого срабатывания; `route.steps[].ref`)
   и `full_model`. Иначе валидатор нельзя включить на весь portfolio/.
8. **`triggers.yaml → automations._note`** — строка-примечание рядом с объектами автоматизаций (8 моделей): либо
   переименовать в `automations_note` на уровне файла (миграция), либо допустить строковые значения по ключам `_*`.
9. **state.json**: `owner_decisions`, `source` (NET/ETN), `price.symbol/note`, `kpi_observations[].why/note`,
   `verified: null` (NET, три наблюдения — «не проверялось» ≠ false; предложение: enum true/false/null с семантикой),
   `notes` как список строк (NET/ETN) против строки (NBIS) — выбрать одну форму, вторую deprecated.
10. **Замечание к валидатору, не к схеме:** YAML-парсер отдаёт незакавыченные даты (`registry_updated: 2026-09-21`)
    как date, а не string; валидатор G5 будет нормализовать даты к ISO-строкам до проверки. В схеме ничего менять
    не нужно, но в пояснении это стоит зафиксировать.

Отдельно: **SPCX** остаётся в формате до партий (states 78 / kpis 53 / triggers 132 ошибки) — в v1.0.1 не включать;
решение о его миграции примем отдельно.

## Что после патча
Как только v1.0.1 проходит по всем 13 моделям с ошибками только класса «миграция», мы на своей стороне пишем
детерминированную миграцию (одноразовую, по §7 + пунктам выше) и валидатор G5 как модель `artifact_validator` в
invest-calc, прогоняем по 13 моделям и коммитим снимок S1. Только после этого — партия 2 (Source Policy + Dozor
Verification Protocol).

=== КОНЕЦ ===
