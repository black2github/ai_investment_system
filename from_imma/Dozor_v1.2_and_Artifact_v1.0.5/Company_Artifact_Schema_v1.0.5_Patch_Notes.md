# Company Artifact Schema v1.0.5 — Patch Notes

Дата: 2026-09-23  
Статус: proposed companion patch for Dozor Verification Protocol v1.2  
Candidate Schema: **без изменений, v1.0.1**

Изменение одно:

```yaml
state.json:
  kpi_observations:
    - verification_run_id: verify-...-latest
      verification_run_ids:
        - verify-...-first
        - verify-...-second
        - verify-...-latest
```

`verification_run_id` сохраняется для обратной совместимости и всегда означает последний прогон.

`verification_run_ids` — append-only история прогонов, подтвердивших то же наблюдение.

## Identity runtime observation

Повторный прогон **не создаёт новую строку**, если неизменны:
- `kpi_id`;
- `period_end`;
- нормализованное `value` либо `value_range`.

Если при повторной сверке меняется только `observation_qualifier`, `note`, source metadata или verification status,
обновляется существующая строка и добавляется новый run_id.

Если изменился период или нормализованное значение — это новое наблюдение.

## Migration

`MIG-122`:
- если уже есть `verification_run_id`, массив можно детерминированно инициализировать как `[verification_run_id]`;
- более ранние run IDs восстанавливаются только из immutable `_verify/*.json` / git history, если связь однозначна;
- отсутствующие historical IDs не выдумываются.

## qualifier_patch_suggested

Это **не runtime field** и в Artifact Schema его по-прежнему нет.

Он существует только в immutable Dozor report как предложение интегратору. После гармонизации runtime observation
содержит итоговый `observation_qualifier`, но не хранит флаг `qualifier_patch_suggested`.
