# Dozor Verification Protocol v1.2.1

Дата: 2026-09-23  
Статус: proposed consolidated normative  
Supersedes: v1.2  
Report contract: **v1.2.0, без изменения output_report_schema**

v1.2.1 — сводная редакция: полный действующий норматив v1.1 плюс принятая дельта v1.2.
Поведение G8, коды статусов, gate semantics и схема отчёта не меняются.

## 1. Принципы

Один verification run создаёт один immutable report:

`portfolio/<ticker>/_verify/<run_id>.json`.

Нормативные принципы:

- один report / один run_id / один G8;
- Evidence Pack — подсказка, не доказательство;
- Dozor самостоятельно открывает или независимо получает источник;
- `Trigger != Decision`;
- event verification не равно trigger firing;
- техническая недоступность источника не является evidence failure;
- нераскрытые значения не оцениваются.

`state.json` хранит только runtime summary/linkage, полный verification record остаётся в immutable report.

Времена:
- source `as_of` — дата публикации/filing;
- source `recorded_at` — optional date-time фиксации записи в workspace;
- report `as_of` — date-time verification run.

## 2. Секции отчёта

- `items[]` — KPI verification;
- `axis_items[]` — текущие состояния осей;
- `transition_checks[]` — KPI/history-based условия переходов;
- `event_items[]` — дискретные события.

В новых v1.2 reports threshold checks не дублируются в `event_items`.

## 3. KPI verification

Действуют 11 KPI-статусов; их `label_ru`, `runtime_verified`, `gate_effect`,
`default_patch_required` и `semantics` находятся в machine-readable status registry.

### not_found vs not_disclosed

Если раскрыта цель/guidance, но actual той же метрики на отчётную дату в полном доступном наборе источников не найден,
это `not_found`, а не `not_disclosed`.

`not_disclosed` требует явного non-disclosure либо структуры раскрытия, положительно доказывающей, что отдельная
метрика не раскрывается/не выводится.

### Qualifier mismatch

Если number/value_type/unit/period совпадают, а различается только qualifier, используется
`verified_match_with_normalization`.

`qualifier_patch_suggested=true`, `patch_required=false`; интегратор меняет только qualifier, не число и не value_type.

### Range из одной фразы

Одна authoritative citation `50–60%` достаточна для обоих endpoint; две цитаты не требуются.

### Consecutive periods

Dozor подтверждает observation и `period_end`, но не считает N кварталов подряд.
Это делает deterministic transition/state-history evaluator.

### derived_fact basis

Для новых v1.2 reports `found.value/unit/period` и `formula_recomputed_value` приводятся к базе candidate.
Сырые компоненты и промежуточная арифметика остаются в `normalization.steps`.

Старые v1.1 reports с source-basis `found.value` остаются schema-valid.

## 4. Axis verification

Входы:
- states.yaml current state + criteria/criteria_provenance;
- runtime scenario_state;
- KPI items того же report;
- qualitative primary-source evidence;
- optional deterministic `history_evaluation_ref`.

`scenario_state[axis].verified=true` без `verification_run_id` — `legacy_unlinked`, не protocol verification.

Runtime:
- `state_supported` → verified=true + run_id;
- `state_not_supported` → verified=false + run_id + PATCH_REQUIRED;
- `state_pending_verification` → verified=false + run_id; без patch только для canonical pending;
- technical unavailable / evidence conflict не перезаписывают прежний verified и блокируют run соответствующим статусом.

Для canonical:

```yaml
current_state: pending_verification
```

используется:

```yaml
criteria: null
pending_reason: "..."
```

Псевдокритерий не создаётся.

## 5. Observation-window entailment

Факт в более узком окне может подтверждать более широкий lower-bound criterion, только если:

1. metric/event population одинаковы;
2. factual interval целиком вложен в criterion interval;
3. criterion монотонный lower-bound count/amount;
4. factual value уже достигает threshold.

`6 spacecraft within 50 days` может entail `>=3 spacecraft` в содержащем его trailing-90-day window.

Обратное неверно. Исходный период факта не переименовывается.

## 6. transition_checks[]

Используются для регулярных условий переходов.

Результаты:
- `met` — условие выполнено;
- `not_met` — положительно не выполнено;
- `pending_history` — нужен history evaluator.

`met` и `not_met` имеют gate `pass`; `not_met` не pending и не требует patch.

Даже `met` не создаёт `fired`, state transition или инвестиционное действие.

Если текущий период уже логически делает consecutive/AND condition ложным, допустим `not_met` без расчёта прошлых периодов.

## 7. event_items[]

В новых v1.2 reports это только `claim_type=discrete_event`:
launch, contract, regulatory decision, financing, acquisition, incident и другие разовые факты.

Primary source → `event_confirmed_primary`.

При отсутствии доступного primary source нужны два независимых approved first-tier media для
`event_confirmed_two_media`; syndicated copies/mirrors одного сообщения не считаются независимыми.

Runtime rules:
- confirmed fact может создать/связать `events_reported` с run_id;
- G8 не создаёт `fired`;
- `event_unconfirmed` — pending;
- `event_contradicted` — PATCH_REQUIRED;
- technical unavailable — BLOCKED_TECHNICAL.

`condition_not_met`:
- label_ru: «условие не выполнено»;
- runtime_verified=false;
- patch_required=false;
- gate_effect=pass.

Для KPI-threshold transitions предпочтителен `transition_checks.result=not_met`.

## 8. qualifier_patch_suggested

Поле существует только в immutable verification report и не записывается в `state.json`.

После гармонизации runtime хранит итоговый `observation_qualifier`.

## 9. Runtime history и MIG-122

`verification_run_id` остаётся alias последнего run.

`verification_run_ids[]` — append-only история повторных подтверждений того же observation.

Identity:

`kpi_id + period_end + normalized value/value_range`.

Числа сравниваются численно после нормализации: `3 == 3.0`.

### MIG-122(a) — legacy duplicates

Если уже есть несколько строк одного observation identity:
- схлопнуть в одну;
- предпочесть строку, уже связанную с verification run;
- недостающие поля (`value_raw`, note/source metadata и т.п.) добрать из дубликата;
- заполненные поля не перезаписывать только из-за расхождения дубликата;
- объединить все детерминированно восстановимые run IDs;
- упорядочить их по report run time;
- `verification_run_id` = последний run.

### MIG-122(b) — backfill из immutable reports

Добавить report.run_id можно только если item:
- имеет тот же `kpi_id`;
- `runtime_verified == true`;
- `candidate.last_value` или `candidate.value_range` численно совпадает с runtime observation.

Сравнивается `candidate`, не `found`, потому что старый `found` мог быть в source basis.

`not_found` с runtime_verified != true run к observation не привязывает.

### MIG-122(c) — numeric identity

Integer/float representation не влияет на identity; для range численно совпадают оба endpoint.

Невосстановимые historical run IDs не выдумываются.

## 10. Gate aggregation

Precedence:

`BLOCKED_SOURCE_CONFLICT > BLOCKED_TECHNICAL > PATCH_REQUIRED > PASS_WITH_DECLARED_PENDING > PASS`.

BLOCKED_SOURCE_CONFLICT:
- KPI `source_conflict`;
- axis `evidence_conflict`.

BLOCKED_TECHNICAL:
- required source unavailable;
- для event возможен accepted two-media fallback по Source Policy.

PATCH_REQUIRED:
- любой item/check с `patch_required=true`.

Pending:
- declared KPI `not_found` для уже pending candidate;
- `state_pending_verification`;
- `event_unconfirmed`;
- transition `pending_history`.

Не pending:
- event `condition_not_met`;
- transition `not_met`;
- transition `met`.

Если blocked/patch/pending отсутствуют → `PASS`.

## 11. Backward compatibility

Output report schema **не изменена относительно v1.2**.

Валидны report `protocol_version`:
- `1.0.0`;
- `1.1.0`;
- `1.2.0`.

v1.2.1 — версия сводной normative methodology, не новый report-contract shape.

## 12. Правило будущих переизданий

Superseding normative file = **полный предыдущий норматив + дельта**.

Нельзя требовать чтения superseded file для восстановления действующего правила.

Delta отдельно публикуется в patch notes.

Перед публикацией обязательны structural diff и regression по historical/live fixtures.
