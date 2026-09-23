# Dozor Verification Protocol v1.2

Дата: 2026-09-23  
Статус: proposed normative  
Gate: `G8_SOURCE_VERIFICATION`

v1.2 сохраняет один immutable report / один `run_id` / один G8, но разводит две разные сущности:
**проверку условия перехода** и **проверку дискретного события**.

## 1. transition_checks[]

Новая секция предназначена для регулярных условий вида:

- revenue >= X;
- backlog < X;
- margin >= X;
- два квартала подряд;
- бинарный KPI сменился 1→0.

Результаты:

- `met` — условие подтверждённо выполнено;
- `not_met` — условие подтверждённо не выполнено;
- `pending_history` — нужны предыдущие периоды из детерминированной истории.

`met` и `not_met` оба дают gate `pass`.

`not_met` **не является pending**.

Даже `met` не создаёт автоматически `fired`, state transition или инвестиционное действие:
`Trigger != Decision`.

## 2. event_items[] — только discrete facts

Для новых v1.2 reports `event_items[].claim_type` обязателен и равен `discrete_event`.

Примеры:
- запуск;
- новый контракт;
- решение регулятора;
- финансирование;
- M&A;
- авария/инцидент.

Старые v1.1 reports, где KPI threshold checks были записаны как `event_unconfirmed`, остаются schema-valid.

### condition_not_met

Статус добавлен в event registry:

```text
condition_not_met
label_ru: условие не выполнено
runtime_verified: false
patch_required: false
gate_effect: pass
```

Он не попадает в pending.

В новых v1.2 reports для обычного KPI-threshold transition предпочтителен
`transition_checks.result=not_met`; `condition_not_met` остаётся совместимым статусом для event-style watchers.

## 3. Canonical pending axis

Если canonical current state:

```yaml
current_state: pending_verification
```

v1.2 не требует выдумывать criterion состояния:

```yaml
criteria: null
pending_reason: "actual contracted power not disclosed..."
```

Статус `state_pending_verification` остаётся pending, но без patch, если canonical state уже pending.

Старые v1.1 axis_items с псевдокритерием сохраняют обратную совместимость.

## 4. Observation-window entailment

Узкое окно может доказать широкий lower-bound criterion только если одновременно:

1. один и тот же metric/event population;
2. интервал факта целиком находится внутри окна критерия;
3. criterion — монотонный lower-bound (`>= N`, не average/rate);
4. значение факта уже >= threshold.

Пример:

`6 spacecraft within 50 days`

может подтвердить:

`>=3 spacecraft in containing trailing 90 days`.

Обратное неверно.

Период факта **не переименовывается** в 90 дней. В report используется
`criterion_checks.window_entailment`.

## 5. derived_fact basis

Для нового v1.2 report:

`found.value` всегда приводится к **той же базе**, что и candidate.

ASTS-KPI-09:

не:

```text
found.value = H1 source sum
formula_recomputed_value = annualized
```

а:

```text
candidate.last_value = 2.008854 USD B/year
found.value = 2.008854 USD B/year
formula_recomputed_value = 2.008854
```

Слагаемые H1:

`145,212k + 859,215k = 1.004427B; ×2`

остаются в `normalization.steps`.

Старый v1.1 report остаётся валиден, но это не preferred v1.2 form.

## 6. qualifier_patch_suggested

Флаг существует **только в verification report**.

Он не добавляется в `state.json`.

Интегратор может гармонизировать `observation_qualifier`; runtime хранит уже нормализованное наблюдение и историю
verification run IDs.

## 7. История verification run IDs

Artifact Schema v1.0.5 вводит:

```yaml
verification_run_ids: [...]
```

`verification_run_id` остаётся alias последнего прогона.

Если `kpi_id + period_end + normalized value/value_range` не изменились, новая строка observation не создаётся.
Новый run_id добавляется в существующий массив.

## 8. Overall aggregation

`condition_not_met` и transition `not_met` не создают pending.

`pending_history`, `event_unconfirmed`, declared pending KPI/axis — создают
`PASS_WITH_DECLARED_PENDING`, если нет более сильного PATCH/BLOCKED статуса.

Таким образом ASTS-вариант, где все 10 переходов **положительно проверены как not_met**, имеет итог PASS,
а не PASS_WITH_DECLARED_PENDING.
