# IMA Schema Party 1 — Candidate Schema v1.0 + Company Artifact Schema v1.0

Дата: 2026-09-22  
Статус: `proposed_normative`  
Основание: фактический workspace-эталон `portfolio_nbis/{states.yaml,kpis.yaml,triggers.yaml,mpc_inputs.yaml,state.json}` и действующие интеграторы `apply_batch.py` / `apply_merge.py`.

## 1. Граница ответственности

Партия фиксирует две разные схемы.

### Company Candidate Schema v1.0

Это **строгий формат ответа LLM** после IMA-07 `Compile Candidate Model Package`.

LLM выпускает только:

- локальные `source_ref`;
- оси и состояния;
- текущий state proposal;
- KPI с локальными ID, `source_ref`, `provenance`, строго числовым `last_value | null`;
- переходы с локальными ID без канонических `<TICKER>-E-NN`;
- полный driver vector объявленной таксономии;
- failure modes с локальными ID;
- `candidate_schema_version: "1.0"`.

LLM **не выпускает**:

- канонические KPI/trigger/failure-mode IDs;
- котировки;
- `route`;
- automation status;
- `fired`;
- `events_reported`;
- `info_log`;
- `calc_runs`;
- runtime verification flags;
- conviction runtime state;
- переписанный `state.json`.

Полный NBIS-пример находится машиночитаемо прямо в
`Company_Candidate_Schema_v1.0.yaml → x-full-example`.

### Company Artifact Schema v1.0

Это **канонический workspace-формат** после минимального Integrator.

Он описывает:

- `states.yaml`;
- `kpis.yaml`;
- `triggers.yaml`;
- `mpc_inputs.yaml`;
- `state.json`.

`Company_Artifact_Schema_v1.0.yaml → field_catalog` содержит для каждого поля эталонных пяти файлов:

- `classification`: `required | optional | deprecated | required_when_*`;
- `type`;
- `enum`, если применим;
- `value_source`;
- `mutation_authority`;
- примечание.

Проверка покрытия эталона: **170 структурных путей NBIS, 0 неклассифицированных**. В каталоге 192 строк с учётом новых v1-полей.

## 2. Канонические ID

Канонический ID является stateful resource workspace и не принадлежит LLM.

Правило:

| Объект | Candidate | Canonical Artifact | Авторитет |
|---|---|---|---|
| KPI | `kpi_01` | `NBIS-KPI-01` | Integrator |
| Transition | `transition_01` | `NBIS-E-01` или следующий свободный ID | Integrator |
| Failure mode | `fm_01` | `NBIS-FM-01` | Integrator |
| Axis | semantic key `Demand_Monetization` | тот же semantic key | LLM candidate, проверяет Integrator |
| State code | `N3` | `N3` | LLM candidate, immutable внутри версии модели |
| Common cause | `AI_OVERBUILD` | registry ID | LLM ссылается, Integrator валидирует |

При merge с legacy registry Integrator обязан читать **актуальное** состояние реестра, сохранять существующие IDs и назначать новые только из свободного диапазона.

## 3. Нормализация numeric values

В v1 запрещены старые формы:

```yaml
last_value: ">40"
```

и:

```yaml
last_value: [0.5, 0.6]
```

Нормативные формы:

```yaml
last_value: 40
observation_qualifier: lower_bound
```

и:

```yaml
last_value: null
observation_qualifier: range
value_range:
  min: 0.5
  max: 0.6
```

Это правило применяется и к будущим runtime KPI observations.

`value_type` обязателен:

```text
actual | company_guidance | analyst_estimate
```

Поэтому NBIS 5 GW YE2026 является:

```yaml
last_value: 5.0
value_type: company_guidance
target_date: 2026-12-31
```

а actual contracted power, если не раскрыт отдельно:

```yaml
last_value: null
value_type: actual
observation_qualifier: pending_verification
```

## 4. Source classes

Партия 1 фиксирует только enum, необходимый для схемы:

```text
regulatory_filing
issuer_ir_release
issuer_investor_presentation
issuer_transcript
first_tier_media
market_data_provider
other_primary
```

Приоритет, допустимость по типам факта, технические правила SEC/User-Agent и verification policy будут нормативно определены в `Source Policy v1.0` в партии 2.

Старое `kpis.yaml → source: SEC | IR` классифицировано как `deprecated`.

Старый встроенный `kpis.yaml → source_policy` также `deprecated`; он сохранён в Artifact Schema только для чтения legacy workspace до миграции.

## 5. Candidate → Canonical mapping

| Candidate path | Canonical destination | Действие Integrator |
|---|---|---|
| `ticker/company/exchange/as_of` | headers всех файлов; `triggers.meta` | копирует/нормализует, не придумывает economics |
| `sources[]` | `states.sources.<source_ref>` | превращает список в map; сохраняет class/url/as_of |
| `states.axes.*` | `states.yaml → axes.*` | копирует semantic model |
| `states.axes.*.current` | `states.axes.*.current` | копирует snapshot proposal |
| `states.axes.*.current` | `state.json → scenario_state.*.state` | seed runtime state с `verified:false` до дозора |
| `states.axes.*.current_evidence_refs` | `states.axes.*.source_refs` | сохраняет ссылки на source refs |
| `kpis.items[].local_id` | `kpis.critical_kpis[].id` | назначает следующий канонический `<TK>-KPI-NN`; сохраняет local→canonical map |
| `kpis.items[].source_ref` | `source_ref/source_class/source_url` KPI | разрешает через candidate `sources[]` |
| `kpis.items[].last_value/value_type/...` | `kpis.critical_kpis[]` | копирует нормализованное значение; `verified:false` до дозора |
| `transitions.items[].local_id` | `triggers.triggers[].id` | назначает следующий свободный `<TK>-E-NN` |
| `transitions.items[].kpi_refs` | `triggers[].kpis` | переписывает local KPI refs по local→canonical map |
| `transitions.items[].axis/from/to/condition/period/level` | соответствующие trigger fields | копирует |
| candidate transition | `triggers[].class/step/action/source/status/fired` | Integrator добавляет runtime/template fields; LLM их не задаёт |
| `mpc_inputs.driver_exposure_vector` | `mpc_inputs.yaml` | копирует после сверки taxonomy version |
| `failure_modes[].local_id` | `failure_modes[].failure_id` | назначает канонический `<TK>-FM-NN` |
| candidate failure mode semantics | canonical failure mode | копирует `common_cause_id/severity/name` |
| — | `mpc_inputs.benchmark` | Integrator добавляет из актуальной portfolio methodology; не из candidate |
| — | `triggers.automations` | Integrator/Dozor runtime |
| — | `triggers.route/rules/meta.price_*` | Integrator |
| — | `state.json.price` | Integrator/market-data runtime |
| — | `state.json.fired/events_reported/pending_verification` | Dozor runtime |
| — | `state.json.info_log` | Dozor/Integrator runtime |
| — | `state.json.kpi_observations` | Dozor runtime |
| — | `state.json.calc_runs` | calculation engine через workspace integration |
| — | `state.json.conviction` | owner decision через Integrator |

## 6. Referential Integrity

Машиночитаемые правила находятся:

- Candidate: `x-integrity-rules`;
- Canonical artifacts: `integrity_rules`.

Ключевые обязательные проверки G5:

1. transition axis существует;
2. `from/to` существуют в состояниях указанной оси;
3. trigger KPI refs существуют;
4. axis source refs разрешаются;
5. KPI source class принадлежит Source Policy;
6. материальные числа имеют Provenance;
7. `last_value` = `number | null`;
8. `value_type` строго типизирован;
9. runtime scenario axis/state разрешается в `states.yaml`;
10. runtime KPI observation ссылается на canonical KPI;
11. canonical IDs уникальны;
12. canonical IDs назначаются только Integrator;
13. driver vector ровно соответствует объявленной taxonomy version;
14. `trigger != decision`;
15. schema version присутствует во всех пяти canonical files.

## 7. Что в эталонном NBIS требует одноразовой структурной миграции

Artifact Schema v1.0 намеренно строгая и не объявляет прежние технические дефекты нормативом.

Принятая NBIS-модель **семантически является эталоном**, но перед валидацией v1 требует детерминированной migration-only операции:

- добавить `schema_version: "1.0"` во все пять файлов;
- добавить KPI `source_class`;
- добавить KPI `provenance`;
- заполнить обязательный `value_type` для KPI;
- NBIS-KPI-06: список диапазона → `last_value:null + value_range`;
- NBIS-KPI-07: строка `>40` → число `40 + lower_bound`;
- добавить `condition_provenance:model_assumption` state-transition triggers;
- аналогично нормализовать range/lower-bound в `state.json.kpi_observations`;
- добавить provenance runtime observations;
- если присутствует `conviction`, добавить `provenance: owner_judgment`.

**Ни один canonical ID, state, KPI meaning или trigger condition при этой миграции не меняется.**

## 8. Поля, форма которых пока не выводится из NBIS reference

В эталоне пусты:

- `state.json.state_transitions`;
- `state.json.calc_runs`;
- top-level runtime `fired/events_reported/pending_verification`.

Поэтому v1 классифицирует сами поля, но не придумывает строгую item-schema без фактического примера. Для `state_transitions` и `calc_runs` items временно допускается object с `additionalProperties:true`.

Это сознательный `schema_deferred`, а не попытка заполнить пробел модельными догадками. Их item-schema следует ужесточить по фактическому workspace в следующих версиях без изменения семантики Party 1.

## 9. Граница с партиями 2–3

Эта партия **не определяет**:

- порядок и приоритет источников;
- технический SEC access;
- Dozor match tolerances;
- verification status transitions;
- atomic merge/idempotency algorithm;
- Acceptance Record;
- executable golden cases.

Она только создаёт строгий вход LLM и строгий canonical target, чтобы по ним можно было написать G5 validator.
