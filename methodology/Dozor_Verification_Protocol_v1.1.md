# Dozor Verification Protocol v1.1

Дата: 2026-09-22  
Статус: proposed normative  
Supersedes: v1.0, обратно совместим по отчёту

## 1. Один G8, один report

KPI, текущие состояния осей и событийные факты E-/X-триггеров проверяются в одном immutable отчёте:

`portfolio/<ticker>/_verify/<run_id>.json`

Секции:
- `items[]` — KPI;
- `axis_items[]` — current-state evidence;
- `event_items[]` — факты событий.

Старый отчёт v1.0 остаётся валиден: `axis_items` и `event_items` optional.

## 2. KPI: уточнения после первого NBIS run

### Guidance есть, actual нет

Если источник сообщает 5 GW **target/guidance**, но не сообщает фактическую законтрактованную мощность на дату отчёта,
для KPI actual используется `not_found`, если нет отдельного доказательства `not_disclosed`.

Guidance не является доказательством actual и не является доказательством non-disclosure.

### Qualifier mismatch

Источник:

`approximately $5.7B`

кандидат:

`5.7 exact`

Если число, value_type, unit и period совпадают, v1.1:

- `verified_match_with_normalization`;
- `normalization.steps += "qualifier: source=approximate, candidate=exact"`;
- `qualifier_patch_suggested=true`;
- `patch_required=false`.

Это разрешает интегратору детерминированно исправить **форму наблюдения**, не меняя число или экономический смысл.

Если расходится `value_type`, например guidance записан как actual, это по-прежнему `mismatch_semantics` и PATCH_REQUIRED.

### Range

Фраза `50–60%` является одним достаточным evidence excerpt для диапазона. Не требуется две отдельные цитаты;
нужно, чтобы оба endpoint присутствовали и совпали после нормализации.

## 3. Axis verification

`axis_items[]` подтверждает именно записанный current state.

`state_supported` → `scenario_state[axis].verified=true` + `verification_run_id`.

`state_not_supported` → false + run_id + PATCH_REQUIRED.

`state_pending_verification` → false + run_id. Без PATCH только если canonical state уже `pending_verification`;
если concrete state был записан без достаточного evidence — PATCH_REQUIRED.

Технический отказ или конфликт evidence не перезаписывает старый runtime flag: run блокируется и требует повторной сверки/разрешения конфликта.

Старый `verified:true` без run_id = `legacy_unlinked`; это не protocol verification.

Для `qualitative_primary_source` ось может быть подтверждена прямой цитатой первоисточника без искусственного numeric KPI,
если это разрешено моделью оси и `verification_rule`.

## 4. N кварталов подряд

G8 **не считает** последовательные кварталы.

Dozor подтверждает observation + `period_end`.

Счётчик/условие `N consecutive quarters` вычисляет детерминированный transition/state-history evaluator по
истории `kpi_observations`.

Если сама current-state criterion требует N периодов, `state_supported` требует ссылку `history_evaluation_ref`;
без неё — `state_pending_verification`.

## 5. Events

`event_confirmed_primary` — разрешённый первичный источник.

Если первичного источника нет/он недоступен, два независимых first-tier media → `event_confirmed_two_media`.

Одна новость, перепечатанная двумя сайтами, не является двумя независимыми источниками.

`event_item` подтверждает **факт**, но не переход состояния и не действие.

Dozor может записать/связать `events_reported` с run_id. Dozor не создаёт `fired` и не исполняет action.
Отдельный trigger evaluator может позже использовать подтверждённый факт и, если условие выполнено, создать runtime trigger state.

## 6. Dates

Три разных времени:

- source `as_of`: date публикации/filing документа;
- source `recorded_at`: optional date-time фиксации записи в workspace;
- report `as_of`: date-time запуска verification.

## 7. Русские label

Нормативный словарь теперь находится в `status_registry.*.*.label_ru`.

В machine files остаются исходные коды статусов. В сообщении владельцу отображается:

`<label_ru> (<status_code>)`.

## 8. Overall status

Приоритет:

`BLOCKED_SOURCE_CONFLICT > BLOCKED_TECHNICAL > PATCH_REQUIRED > PASS_WITH_DECLARED_PENDING > PASS`.

`Trigger != Decision` сохраняется на всех уровнях.
