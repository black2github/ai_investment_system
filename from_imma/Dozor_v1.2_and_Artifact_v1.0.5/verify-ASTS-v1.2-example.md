# ASTS v1.2 example

Это schema/example migration из живого v1.1 run `verify-ASTS-20260923T060714Z`, а не новый живой Dozor run.

Изменения формы:
- 10 threshold-transition records перенесены из `event_items` в `transition_checks`;
- все 10 имеют `result=not_met`, поэтому не являются pending;
- один реальный launch fact оставлен как `event_items[].claim_type=discrete_event`;
- `Constellation_Deployment` использует явный `window_entailment` 50→90 дней;
- ASTS-KPI-09 `found.value` приведён к candidate annualized basis;
- итог становится `PASS`, потому что pending items отсутствуют.

Фактические evidence/value/status KPI и осей взяты из живого v1.1 report; пример не создаёт нового факта или run history.
