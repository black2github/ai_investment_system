# IMA Schema Party 1 — Patch v1.0.1

Дата: 2026-09-22  
Статус: proposed patch to conditionally accepted Party 1  
Основание: независимый прогон Company Artifact Schema v1.0 по 13 принятым моделям на workspace snapshot S0 (`df6029d`).

## 1. Scope

Патч расширяет схему, не изменяя принятые ID, состояния, экономические смыслы или trigger semantics.

SPCX намеренно **не входит** в v1.0.1. Его старый формат требует отдельного решения о миграции.

Новые LLM-ответы после принятия патча должны использовать только `Company Candidate Schema v1.0.1`.

## 2. Решения по разделу D validation report

| # | Проблема | Решение v1.0.1 | Класс |
|---|---|---|---|
| 1 | `states.sources.*` object vs string | Object `{source_class,url,as_of,type,...}` — нормативная форма. Scalar URL остаётся deprecated migration input. Candidate — object-only. | (a)+(b) |
| 2 | qualitative axes | `axes.*.evidence_type`, `axes.*.verification_rule`, runtime `scenario_state.*.evidence_type` — first-class optional. | (a) |
| 3 | source window | `observation_window_days` — first-class in KPI candidate/artifact/runtime observation. | (a) |
| 4 | `value_type` used as qualifier | Normative `value_type` remains `actual/company_guidance/analyst_estimate`; `lower_bound/upper_bound/approximate` migrate to `observation_qualifier`, with `value_type=actual`. | (c migration) |
| 5 | binary thresholds | `thresholds.binary: true` permits green/red without yellow. Non-binary KPI still requires green/yellow/red. | (a) |
| 6 | accepted semantic metadata | `primary_only`, `existing_trigger_policy`, `accounting_note`, `changelog`, zone labels, `driver_exposure_semantics`, benchmark `methodology_ref`, trigger numeric-threshold provenance are first-class. `thresholds_provenance` is deprecated alias to `numeric_thresholds_provenance`. | (a)+(b) |
| 7 | registry-only trigger registries | `triggers.yaml.profile = full_model | registry_only`. `rules` and `fired` conditional; legacy strategy meta / window / route ref supported. Cross-file axis/KPI integrity applies only to `full_model`. | (a) |
| 8 | `automations._note` | Deprecated input accepted; normative root field is `automations_note`; migration moves value. | (b) |
| 9 | state runtime fields | `owner_decisions`, root `source`, `price.symbol/note`, observation `why/note/window`, `verified:null` are first-class. Normative `notes` is `array<string>`; scalar legacy form is deprecated migration input. | (a)+(b) |
| 10 | YAML dates | No semantic schema relaxation. Validator performs pre-validation ISO string normalization for YAML native date/datetime values. | validator rule |

## 3. Source object

Normative canonical form:

```yaml
sources:
  SOME_Q2_10Q:
    source_class: regulatory_filing
    url: https://...
    as_of: "2026-06-30"
    type: SEC 10-Q
```

`type` is a human/document label and does not replace `source_class`.

A legacy scalar URL or object lacking `source_class/as_of` is a migration input, not the final canonical shape.

## 4. Qualitative evidence

For ASTS-like regulatory state:

```yaml
axes:
  Regulatory_Spectrum:
    evidence_type: qualitative_primary_source
    verification_rule: >
      Current state is supported by explicit issuer/regulatory language;
      binary KPI is a declared deterministic derivation.
```

Runtime may preserve the same type in:

```yaml
scenario_state:
  Regulatory_Spectrum:
    evidence_type: qualitative_primary_source
```

This closes GC-006 without pretending that the source disclosed a numeric count.

## 5. Observation windows

A source statement such as “six spacecraft within 50 days” is represented as:

```yaml
observation_window_days: 50
```

It must not be relabeled as a trailing-90-day aggregate unless the latter is separately calculated from dated events.

## 6. Binary KPI

```yaml
thresholds:
  binary: true
  green: "=1"
  red: "=0"
```

For non-binary KPI, `yellow` remains required.

## 7. `value_type` and `observation_qualifier`

These represent different semantics:

- `value_type`: economic/source nature — `actual | company_guidance | analyst_estimate`;
- `observation_qualifier`: measurement form — `exact | approximate | lower_bound | upper_bound | range | not_separately_disclosed | pending_verification`.

Known migration:

```text
legacy value_type=lower_bound
→ value_type=actual
→ observation_qualifier=lower_bound
```

Same for `upper_bound` and `approximate`.

## 8. Trigger profiles

### full_model

Company has canonical model artifacts. `rules` and per-trigger `fired` are required after migration.

### registry_only

Owner registry can exist without `states.yaml`, `kpis.yaml`, `mpc_inputs.yaml`. `rules` and `fired` are optional. Strategy metadata and `window` are first-class.

`registry_only` does not weaken `trigger != decision`.

## 9. Runtime `verified`

For `state.json.kpi_observations[].verified`:

- `true` = verified match;
- `false` = verification performed and result is negative/mismatch under runtime protocol;
- `null` = has not yet been verified.

Dozor Verification Protocol v1.0 in Party 2 will own the richer verification status taxonomy.

## 10. Notes

Normative runtime form:

```yaml
notes:
  - first note
  - second note
```

Scalar `notes: "..."` is deprecated and migrated deterministically to a one-element list.

## 11. Date normalization

PyYAML can parse an unquoted date as a native date object. G5 must normalize native YAML date/datetime objects to ISO-8601 strings **before** JSON Schema validation.

This is serialization normalization, not a change in business semantics.

## 12. Machine-readable migrations

`Company_Artifact_Schema_v1.0.1.yaml` contains `known_migrations_v1_0_to_v1_0_1`.

Important rules include:
- scalar/object source normalization;
- `thresholds_provenance → numeric_thresholds_provenance`;
- legacy qualifier split from `value_type`;
- binary threshold marker;
- `automations._note → automations_note`;
- scalar notes → list;
- trigger profile/default fields;
- ISO date normalization.

## 13. Candidate delta

Candidate v1.0.1 remains deliberately narrower than workspace artifacts. It adds only content the LLM is legitimately responsible for:

- source object metadata;
- qualitative axis evidence metadata;
- KPI observation window;
- binary threshold marker;
- MPC `driver_exposure_semantics`;
- MPC benchmark metadata.

Canonical IDs, price/runtime data, `route`, `fired`, `info_log`, `calc_runs` remain outside Candidate Schema.

## 14. Self-test performed

The patch package was checked with Draft 2020-12:

- Candidate schema itself valid;
- all five embedded artifact schemas valid;
- updated NBIS candidate example validates;
- synthetic fixtures covering qualitative axes, binary KPI, 50-day window, source objects, full-model triggers, registry-only triggers, MPC semantics and runtime nullable verification validate.

The authoritative acceptance test remains the owner's deterministic migration + G5 run on the 13-model S0/S1 workspace. This package does not claim SPCX compatibility.
