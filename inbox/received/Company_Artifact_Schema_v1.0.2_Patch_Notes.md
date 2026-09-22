# Company Artifact Schema v1.0.2 — Minimal Patch

Дата: 2026-09-22  
Статус: proposed patch after acceptance of v1.0.1

Этот патч намеренно содержит только три first-class поля реестра владельца плюс техническое изменение `schema_version` 1.0.1 → 1.0.2.

## Добавлено

### `triggers.yaml → meta.target_weight`

Optional `string | null`, `value_source: owner_via_integrator`.

Хранит выражение владельца дословно, например:

```yaml
target_weight: "5%"
```

или:

```yaml
target_weight: "0% (при подтверждении — до 5% + добавления)"
```

Это **не** нормализованный target Optimizer и не должен интерпретироваться IMA как числовое ограничение.

Допустим как в `registry_only`, так и в `full_model`.

### `triggers.yaml → meta.lot`

Optional `integer | null`, minimum 1, `value_source: owner_via_integrator`.

Хранит размер биржевого/board lot из реестра владельца.

### `triggers.yaml → triggers[].priority`

Optional `string | null`, `value_source: owner_via_integrator`.

Качественный приоритет владельца сохраняется дословно; IMA не назначает и не переписывает его.

## Миграция

`MIG-112`: schema version → `1.0.2`.

`MIG-113`: три поля сохраняются verbatim. Никакой семантической трансформации нет.

## Candidate Schema

`Company Candidate Schema v1.0.1` **не меняется**.

Все три поля принадлежат stateful owner registry и не являются выходом LLM-кандидата.
