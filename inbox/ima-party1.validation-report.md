# Party 1 — отчёт проверки Company Artifact Schema v1.0 по 13 принятым моделям (2026-09-22)

Инструмент: jsonschema 4.26 (Draft 2020-12), файлы workspace на коммите df6029d (снимок S0).

## A. Результат по NBIS (эталон партии)
- Ошибок до миграции: states 1 / kpis 35 / triggers 11 / mpc_inputs 1 / state.json 14 — ВСЕ из списка §7 пояснения.
- После детерминированной миграции по §7 (сухой прогон в памяти): 0 ошибок во всех пяти файлах.
- x-full-example валидируется Candidate Schema: 0 ошибок. Обе схемы — корректные JSON Schema.

## B. Ошибки по всем 13 моделям (итого на компанию)
nbis 62, nvda 58, hood 56, crwv 67, asts 72, lly 67, net 94, etn 87, meta 65, asml 69, rklb 63, pltr 63, msft 64

## C. Класс «миграция» (новые обязательные поля / нормализация значений) — покрывается §7, расширить список на все компании

- kpis.yaml `<root>`: 'schema_version' is a required property — x13
- kpis.yaml `critical_kpis`: 'provenance' is a required property — x132
- kpis.yaml `critical_kpis`: 'source_class' is a required property — x132
- kpis.yaml `critical_kpis`: 'value_type' is a required property — x125
- kpis.yaml `critical_kpis/last_value`: '<0.01' is not of type 'number', 'null' — x1
- kpis.yaml `critical_kpis/last_value`: <v> is not of type 'number', 'null' — x2
- mpc_inputs.yaml `<root>`: 'driver_vector_provenance' is a required property — x10
- mpc_inputs.yaml `<root>`: 'schema_version' is a required property — x13
- state.json `<root>`: 'schema_version' is a required property — x13
- state.json `conviction`: 'provenance' is a required property — x1
- state.json `kpi_observations`: 'provenance' is a required property — x131
- state.json `kpi_observations/value`: '<0.01' is not of type 'number', 'null' — x1
- state.json `kpi_observations/value`: <v> is not of type 'number', 'null' — x2
- states.yaml `<root>`: 'schema_version' is a required property — x13
- states.yaml `semantics`: 'evidence_required' is a required property — x10
- states.yaml `semantics`: 'numeric_thresholds_provenance' is a required property — x10
- triggers.yaml `<root>`: 'schema_version' is a required property — x13
- triggers.yaml `triggers`: 'condition_provenance' is a required property — x128

## D. Класс «пробел схемы» — поля, реально существующие в принятых моделях, но запрещённые схемой (additionalProperties:false) или иной формы

- kpis.yaml `critical_kpis`: Additional properties are not allowed ('observation_window_days' was unexpected) — asts
- kpis.yaml `critical_kpis/thresholds`: 'yellow' is a required property — asts
- kpis.yaml `critical_kpis/value_type`: 'approximate' is not one of ['actual', 'company_guidance', 'analyst_estimate'] — crwv
- kpis.yaml `critical_kpis/value_type`: 'lower_bound' is not one of ['actual', 'company_guidance', 'analyst_estimate'] — asts, rklb
- kpis.yaml `critical_kpis/value_type`: 'upper_bound' is not one of ['actual', 'company_guidance', 'analyst_estimate'] — asts
- kpis.yaml `zone_semantics`: Additional properties are not allowed ('green', 'red', 'yellow' were unexpected) — lly
- mpc_inputs.yaml `<root>`: Additional properties are not allowed ('driver_exposure_semantics' was unexpected) — asml, lly, meta
- mpc_inputs.yaml `benchmark`: Additional properties are not allowed ('methodology_ref' was unexpected) — crwv
- state.json `<root>`: Additional properties are not allowed ('owner_decisions', 'source' were unexpected) — etn, net
- state.json `kpi_observations`: Additional properties are not allowed ('note', 'observation_window_days' were unexpected) — asts
- state.json `kpi_observations`: Additional properties are not allowed ('why' was unexpected) — net
- state.json `kpi_observations/value_type`: 'approximate' is not one of ['actual', 'company_guidance', 'analyst_estimate', None] — crwv
- state.json `kpi_observations/value_type`: 'lower_bound' is not one of ['actual', 'company_guidance', 'analyst_estimate', None] — rklb
- state.json `kpi_observations/verified`: None is not of type 'boolean' — net
- state.json `notes`: ['2026-09-17: реестр заведён по финальному блоку обсуждения; предпосылки не проверены — разовое задание aiinfra-facts-verify', '2026-09-17: report-check по Q2 2 — net
- state.json `notes`: ['2026-09-17: реестр заведён по финальному блоку обсуждения; предпосылки не проверены — разовое задание aiinfra-facts-verify', '2026-09-17: FACTS-VERIFY-etn — 4 — etn
- state.json `price`: Additional properties are not allowed ('note', 'symbol' were unexpected) — etn, net
- state.json `scenario_state/Regulatory_Spectrum`: Additional properties are not allowed ('evidence_type' was unexpected) — asts
- states.yaml `<root>`: Additional properties are not allowed ('changelog' was unexpected) — asts
- states.yaml `axes/Regulatory_Spectrum`: Additional properties are not allowed ('evidence_type', 'verification_rule' were unexpected) — asts
- states.yaml `semantics`: Additional properties are not allowed ('primary_only', 'thresholds_provenance' were unexpected) — asts, crwv, lly, meta, msft, pltr, rklb
- states.yaml `semantics`: Additional properties are not allowed ('existing_trigger_policy', 'primary_only', 'thresholds_provenance' were unexpected) — etn, net
- states.yaml `semantics`: Additional properties are not allowed ('accounting_note', 'primary_only', 'thresholds_provenance' were unexpected) — asml
- states.yaml `sources/ASML_IR_Q2_RELEASE`: {url,...} (объект вместо строки?) — asml
- states.yaml `sources/ASML_IR_Q2_RESULTS`: {url,...} (объект вместо строки?) — asml
- states.yaml `sources/ASML_SEC_Q2_6K`: {url,...} (объект вместо строки?) — asml
- states.yaml `sources/ASML_SEC_Q2_INTERIM`: {url,...} (объект вместо строки?) — asml
- states.yaml `sources/ASML_SEC_Q2_PRESENTATION`: {url,...} (объект вместо строки?) — asml
- states.yaml `sources/ASML_SEC_Q2_USGAAP`: {url,...} (объект вместо строки?) — asml
- states.yaml `sources/ASTS_Q2_2026_10Q`: {url,...} (объект вместо строки?) — asts
- states.yaml `sources/ASTS_Q2_2026_RELEASE`: {url,...} (объект вместо строки?) — asts
- states.yaml `sources/CRWV_2026_CONVERT_PRESENTATION`: {url,...} (объект вместо строки?) — crwv
- states.yaml `sources/CRWV_Q2_2026_10Q`: {url,...} (объект вместо строки?) — crwv
- states.yaml `sources/CRWV_Q2_2026_RELEASE`: {url,...} (объект вместо строки?) — crwv
- states.yaml `sources/ETN_Q2_2026_10Q`: {url,...} (объект вместо строки?) — etn
- states.yaml `sources/ETN_Q2_2026_IR`: {url,...} (объект вместо строки?) — etn
- states.yaml `sources/ETN_Q2_2026_RELEASE`: {url,...} (объект вместо строки?) — etn
- states.yaml `sources/LLY_Q2_2026_10Q`: {url,...} (объект вместо строки?) — lly
- states.yaml `sources/LLY_Q2_2026_RELEASE_IR`: {url,...} (объект вместо строки?) — lly
- states.yaml `sources/LLY_Q2_2026_RELEASE_SEC`: {url,...} (объект вместо строки?) — lly
- states.yaml `sources/META_Q2_2026_10Q`: {url,...} (объект вместо строки?) — meta
- states.yaml `sources/META_Q2_2026_RELEASE_IR`: {url,...} (объект вместо строки?) — meta
- states.yaml `sources/META_Q2_2026_RELEASE_SEC`: {url,...} (объект вместо строки?) — meta
- states.yaml `sources/MSFT_FY2026_10K`: {url,...} (объект вместо строки?) — msft
- states.yaml `sources/MSFT_FY2026_Q4_CALL`: {url,...} (объект вместо строки?) — msft
- states.yaml `sources/MSFT_FY2026_Q4_METRICS`: {url,...} (объект вместо строки?) — msft
- states.yaml `sources/MSFT_FY2026_Q4_RELEASE`: {url,...} (объект вместо строки?) — msft
- states.yaml `sources/NET_Q2_2026_10Q`: {url,...} (объект вместо строки?) — net
- states.yaml `sources/NET_Q2_2026_RELEASE`: {url,...} (объект вместо строки?) — net
- states.yaml `sources/PLTR_Q2_2026_10Q`: {url,...} (объект вместо строки?) — pltr
- states.yaml `sources/PLTR_Q2_2026_PRESENTATION`: {url,...} (объект вместо строки?) — pltr
- states.yaml `sources/PLTR_Q2_2026_RELEASE`: {url,...} (объект вместо строки?) — pltr
- states.yaml `sources/RKLB_Q2_2026_10Q`: {url,...} (объект вместо строки?) — rklb
- states.yaml `sources/RKLB_Q2_2026_RELEASE`: {url,...} (объект вместо строки?) — rklb
- triggers.yaml `<root>`: 'rules' is a required property — etn, net
- triggers.yaml `automations/_note`: 'дозор событий по этим триггерам ещё не заведён (очередь); вечерняя сводка обходит папку' is not of type 'object' — asml, asts, crwv, lly, meta, msft, pltr, rklb
- triggers.yaml `meta`: Additional properties are not allowed ('currency', 'fiscal_year', 'horizon', 'price_at_strategy', 'scenario', 'status_in_basket', 'strategy_date', 'strategy_sou — etn, net
- triggers.yaml `meta`: 'source_artifact' is a required property — etn, net
- triggers.yaml `meta`: 'price_source' is a required property — etn, net
- triggers.yaml `meta`: 'price_at_registry' is a required property — etn, net
- triggers.yaml `meta`: 'position' is a required property — etn, net
- triggers.yaml `meta/registry_updated`: datetime.date(2026, 9, 21) is not of type 'string' — etn, net
- triggers.yaml `route/steps`: Additional properties are not allowed ('ref' was unexpected) — etn, net
- triggers.yaml `rules`: Additional properties are not allowed ('all_numeric_thresholds_provenance' was unexpected) — asml, lly, meta
- triggers.yaml `triggers`: Additional properties are not allowed ('window' was unexpected) — etn, net
- triggers.yaml `triggers`: 'fired' is a required property — etn, net

## E. Вне проверки
- spacex: старый формат (states 78 / kpis 53 / triggers 132 ошибки) — нужна отдельная миграция или явный статус legacy.
- su, 6506, 6324, crwd: модели компаний не заказывались (только triggers.yaml + state.json реестра владельца) — triggers 13–30 ошибок, state.json 8; схема triggers.yaml должна допускать реестр без модели.
