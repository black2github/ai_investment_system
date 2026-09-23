# Company Artifact Schema v1.0.3 — Minimal Patch Notes

Дата: 2026-09-22  
Статус: proposed patch over accepted v1.0.2  
Candidate Schema: **без изменений, v1.0.1**

## 1. `triggers[].status = paused`

В enum добавлен `paused`.

Семантика:

- условие продолжает наблюдаться;
- факт/событие продолжает журналироваться;
- действие триггера не исполняется;
- уведомление о покупке/действии не отправляется;
- статус обратим решением владельца;
- прежний статус может сохраняться в `note`.

Отличия:

- `planned`: триггер определён, но ещё не взведён;
- `paused`: ранее действующий/существующий триггер временно подавлен владельцем;
- `dropped`: окончательно снят;
- `done`: закрыт/завершён.

`Trigger != Decision` сохраняется.

## 2. ART-REF-015

Проверка action-text на executable trade semantics применяется к:

`active | planned | due`

и пропускается для:

`paused | dropped | done`.

Это не разрешает paused-триггеру исполнять действие; наоборот, его runtime semantics — non-executing / non-notifying.

## 3. Место хранения Dozor report — подтверждено

Принята предложенная раскладка:

```text
portfolio/<ticker>/_verify/<run_id>.json
```

Полный отчёт:
- иммутабельный;
- валидируется схемой Dozor Verification Protocol;
- не дублируется целиком в `state.json`.

В `state.json` хранится только runtime linkage:

```yaml
verification:
  run_id: verify-...
  as_of: "2026-09-22T19:42:00Z"
  overall_status: PASS

kpi_observations:
  - kpi_id: NBIS-KPI-...
    ...
    verification_run_id: verify-...
```

`info_log` может содержать человекочитаемую строку о прогоне, но не является authoritative verification record.

## 4. `as_of`: два разных понятия

Они намеренно имеют разный формат:

- `states.sources.*.as_of` / source-document `as_of` — **date**, дата публикации/filing документа;
- Dozor report `as_of` и `state.json.verification.as_of` — **date-time**, момент verification run.

Их нельзя взаимозаменять.

## 5. Dozor v1.1

В v1.0.3 Dozor Protocol не меняется.

После первого живого NBIS verification run v1.1 должен расширить **тот же verification report**, а не вводить два независимых протокола:

- `axis_items[]` — проверка evidence текущего `scenario_state[axis]`, включая `qualitative_primary_source`;
- `event_items[]` — проверка E-/X-event evidence по Source Policy, включая правило двух first-tier media при отсутствии первичного источника.

Причина: KPI, current-state evidence и event evidence используют один Source Policy, один `run_id`, один immutable audit trail и один G8 gate. Отдельные протоколы создавали бы ненужное расхождение статусов и хранения.

Конкретные item schemas и status mapping для axis/event будут зафиксированы в Dozor Verification Protocol v1.1 после реального NBIS run.

## 6. Миграция

- `MIG-114`: единый bump `schema_version → 1.0.3`;
- `MIG-115`: существующий `paused` сохраняется без изменения ID/state/condition/note;
- `MIG-116`: verification linkage исторически не backfill'ится — поля появляются только после реальных verification runs.

Других изменений относительно v1.0.2 нет.
