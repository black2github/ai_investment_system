# Company Artifact Schema v1.0.4 — Patch Notes

Дата: 2026-09-22  
Статус: proposed companion patch for Dozor Verification Protocol v1.1  
Candidate Schema: **без изменений, v1.0.1**

Добавлены только поля связи с новым G8:

```yaml
states.yaml:
  sources:
    <source_id>:
      recorded_at: <date-time|null>
```

`as_of` источника остаётся датой публикации/filing документа. `recorded_at` — момент фиксации ссылки/записи в workspace.

В `state.json`:

```yaml
scenario_state:
  <axis>:
    verification_run_id: <string|null>

events_reported:
  - verification_run_id: <string|null>

fired:
  - verification_run_id: <string|null>
```

Старый `scenario_state.*.verified: true` без `verification_run_id` сохраняется, но считается `legacy_unlinked`,
то есть не является подтверждением по Dozor Protocol v1.1 до первого `axis_item`.

G8 может подтвердить факт события и связать `events_reported` с run_id. G8 **не создаёт торговое решение и не
исполняет trigger**. Запись `fired` создаётся отдельным механизмом оценки условия/маршрута; Dozor только может
привязать к ней verification run факта.

Миграции: MIG-117…120. Исторические run_id и `recorded_at` не выдумываются.
