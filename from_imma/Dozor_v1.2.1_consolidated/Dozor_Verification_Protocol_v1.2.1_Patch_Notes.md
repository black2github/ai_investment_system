# Dozor Verification Protocol v1.2.1 — Patch Notes

Тип: consolidation/editorial repair. **Семантика не изменена.**

Возвращено из v1.1:
- `principles` — 7 принципов;
- полный `kpi_rules`;
- полный storage contract, включая `state_json_contains_only_summary_and_runtime_links`;
- `axis_verification.inputs`, `legacy_rule`, `runtime_write_rules`;
- `event_verification.independence_rule`, `runtime_write_rules`;
- `gate_aggregation.rules`;
- `semantics` у всех legacy KPI/axis/event statuses.

Сохранена без изменений вся дельта v1.2:
- `transition_checks[]`;
- `condition_not_met`;
- canonical pending axis с `criteria:null + pending_reason`;
- window entailment;
- derived_fact candidate-basis rule;
- qualifier_patch_suggested report-only;
- runtime verification history;
- pending/non-pending aggregation.

Дополнен только норматив migration text для уже принятого MIG-122:
(a) collapse legacy duplicate observations;
(b) backfill run IDs из immutable reports по candidate value и runtime_verified=true;
(c) numeric identity (`3 == 3.0`).

`output_report_schema` идентична принятой v1.2.
