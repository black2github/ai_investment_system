# Dozor -> Scenario Action Contract v1.0

Дата: 2026-09-30. Партия 10, часть A.

## 1. Граница ответственности

Dozor подтверждает observable criteria и источники. Он не выбирает probability, portfolio action или strategy status `active`.

## 2. Scenario event item

Для каждого проверенного observable criterion Dozor сохраняет namespaced item:

```yaml
event_id: EV-TW-QUARANTINE
criterion_id: EVTWQ-C01
fact_id: TQ-F01
observed_at: 2026-10-05T12:00:00Z
observed_value: 3
normalized_unit: vessels
operator: count_gte
threshold: 3
window_days: 30
verification_status: verified
source_refs:
  - <primary-source-ref>
verification_run_id: <immutable-run-id>
```

`operator/threshold/window_days` копируются из принятого Event Catalog; Dozor их не редактирует.

## 3. Event resolution

- `any_of`: event confirmed после первого verified satisfied criterion;
- `all_of`: все criteria verified+satisfied;
- `k_of_n`: минимум required_count criteria verified+satisfied.

`pending_verification`, `not_disclosed`, `source_unavailable_technical` не считаются satisfied. `source_conflict` блокирует event confirmation.

## 4. Scenario state

Integrator/state evaluator, а не Dozor LLM, вычисляет:
- `candidate`: есть verified positive evidence, но event/phase entry ещё неполон;
- `confirmed`: все phase entry_criteria satisfied;
- `exited`: все exit_criteria satisfied.

Dozor записывает evidence/run IDs; deterministic evaluator изменяет status.

## 5. ambiguous_set_conflict

Если одновременно confirmed defining events, принадлежащие разным non-BASE members одного set, set_state становится `ambiguous_set_conflict`.

Следствия:
- action activation blocked;
- agent signal перечисляет оба/все defining events;
- conditional pictures можно считать отдельно;
- owner probability/scenario-set review обязателен;
- Dozor не выбирает «победивший» сценарий.

## 6. Exit

Exit criteria верифицируются тем же способом. `exited` не означает автоматический reversal strategy; Action Layer выдаёт exit review signal.
