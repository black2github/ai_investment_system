# Для передачи другой LLM: Investment Modeling Agent v1.0 Foundation — разбор и заказ второго среза

Черновик 22.09.2026, НЕ отправлен. Вставляется одним сообщением от «=== НАЧАЛО ===» до «=== КОНЕЦ ===» вместе с
вложениями из папки Downloads/ima-foundation-to-llm (список в конце).

=== НАЧАЛО ===

## Контекст
Пакет Investment_Modeling_Agent_v1.0_foundation (24 файла) получен и разобран со стороны действующего конвейера.
Полный разбор — во вложении `ima-foundation.review.md`; главный вывод: пакет формализует только сторону LLM.
Вторая половина конвейера — интегратор (конвертация ответа LLM и слияние в реестры владельца), дозор (агент OpenClaw,
сверка по первоисточникам) и расчётный движок (сайдкар invest-calc) — в пакете названа одним словом, а именно там была
вся ручная работа при приёме 14 моделей. Пакет в норматив НЕ принят; ниже — что нужно, чтобы принять.

Факты из приёма 14 моделей, которые пакет должен учитывать:
- формат ответа LLM менялся между партиями (партия 1: states=dict, kpis=list; партия 2+: states.axes, kpis.items;
  партия 5 потребовала отдельный конвертер); «компиляцию» в формат workspace делал интегратор (вложение
  `integrator/apply_batch.py`), а не LLM;
- канонические ID переходов присваивал интегратор при слиянии (`<TK>-E-NN` из proposed_transitions_without_ids),
  legacy-триггеры реестра владельца привязывались к осям через binding map (вложение `integrator/apply_merge.py`);
- сверку KPI дозор вёл по kpis.yaml (поля source_url / verified / last_value); часть сверок шла вне агента
  (SEC 403 без User-Agent, усечение web_fetch); правила дозора — во вложении `dozor_AGENTS.md`;
- схема калибровки MC v2 уже зафиксирована движком (company_mc 2.3.0, архетипы A/B/C, joint_simulation,
  driver_parameter_mapping) — вложения `engine/*`.

## Заказ 1. Три недостающих норматива (по фактическим файлам, не с чистого листа)
1.1 **Company Artifact Schema v1.0** — схема конечных артефактов компании в формате workspace: `states.yaml`,
    `kpis.yaml`, `triggers.yaml`, `mpc_inputs.yaml`, `state.json`. Эталон формата — вложение `portfolio_nbis/*`
    (принятая модель NBIS после слияния). Нужно: обязательные и необязательные поля, типы, enum, ссылочная целостность
    (переход → ось/состояние/KPI; KPI → source_policy; триггер → axis/kpis), правило numeric_or_null для last_value,
    provenance по Provenance_Schema v1.0 для каждого материального числа, версия схемы в заголовке файла. Разделить:
    что выпускает LLM (candidate, локальные ID) и что добавляет интегратор при слиянии (канонические ID, котировки,
    route, info_log).
1.2 **Source Policy v1.0** — единый документ вместо source_policy внутри каждого kpis.yaml и правил в AGENTS.md:
    разрешённые источники и приоритет (SEC > IR > стенограммы > агрегаторы только для цены и капитализации),
    обязательный as_of и URL документа, правило guidance ≠ actual с типизацией (value_type: actual | company_guidance |
    analyst_estimate), периодная семантика (LTM / квартал / «within 50 days» сохраняется дословно), запрет оценивать
    нераскрытые значения (null + not_separately_disclosed), технические требования доступа (SEC User-Agent).
1.3 **Dozor Verification Protocol v1.0** (гейт G8) — контракт сверки: вход — kpis.yaml кандидата + EvidencePack LLM
    (формат evidence_item из Intermediate_Artifacts_Schema должен быть потребляем дозором); выход — отчёт по каждому
    KPI со статусом found | mismatch | not_found | period_mismatch | source_not_allowed, найденным значением, цитатой
    и URL; допуски (округление, единицы); правило перевода в PATCH_REQUIRED; что делать, когда источник недоступен
    технически (не not_found, а unverifiable_technical).

## Заказ 2. Роли и стыки; машиночитаемые golden cases
2.1 **Roles & Seams v1.0** — документ о четырёх ролях конвейера: LLM (IMA), интегратор, дозор, движок. Для каждой:
    что принимает, что выпускает, какие гейты исполняет (G0–G5 — детерминированные, естественный дом — модель
    artifact_validator в реестре invest-calc с версией в calculation_engine_version; G6 — IMA-08; G8 — дозор).
    Явный авторитет ID: LLM выпускает локальные ID, канонические присваивает интегратор при слиянии; PatchProposal
    ссылается на канонические. Транспорт в Model Adapter: как задача попадает к модели и результат обратно (сейчас —
    файл заказа в inbox + share-ссылка + папка Downloads + конвертер; для агента OpenClaw — сообщение или cron; для
    API — прямой вызов). Выровнять формат наших заказов (inbox/*.request.md) со Skill_Runtime_Envelope.
2.2 **Golden_Case_Catalog v0.2** — те же 11 кейсов, но каждое ожидание в машиночитаемом виде: путь в артефакте по
    схеме 1.1 → ожидаемое типизированное значение (пример: kpis.items[id=NBIS-KPI-xx].value_type == company_guidance;
    kpis.items[...].last_value == null), плюс предпосылка «snapshot до исправления» — что именно должно лежать в
    снимке (список файлов и версий). Предпосылка с нашей стороны: workspace будет переведён под git до первого прогона.
2.3 **Исполнитель conformance.** Автор 14 принятых моделей — этот же проект с памятью о принятых ответах. Предлагаем:
    исполнитель первого conformance-прогона (NBIS, затем ASML/ASTS/META/CRWV) — другая модель через OpenRouter в
    OpenClaw (Sonnet 5 / DeepSeek), а этот проект — независимый рецензент по IMA-08 (review_policy:
    independent_model_or_fresh_context_preferred). Просьба подтвердить или обосновать иное.

## Заказ 3. Контракты IMA-09/10/11 сразу, привязанные к схеме движка
Не откладывать до стабилизации IMA-01..08: схема калибровки уже зафиксирована движком (вложения
engine/engine_calibration_schema_docstrings.md, engine/company_mc_v2_design.md §4). Нужны контракты:
- **IMA-09 Reverse_Valuation_Calibration** — входы и выходы по Reverse_Valuation_Rules v1.1;
- **IMA-10 Conditional_MC_Calibration** — выход = калибровка в схеме company_mc 2.3.0 (архетип A/B/C, распределения
  triangular / pert / truncated_normal / lognormal / deterministic, latent factors, кусочная оценка; для C —
  milestone_model / cash_model / service_segments); постусловия: ни один параметр не подогнан под текущую цену,
  каждый материальный параметр типизирован по Provenance, reverse_valuation_ref присутствует, simulation.seed и
  версия движка указаны (calculation_engine_version: company_mc 2.3.0);
- **IMA-11 Joint_Driver_Mapping** — выход = joint_simulation + driver_parameter_mapping (stochastic_targets /
  structural_support / stability.knockout / adverse_driver_stress) только по целям, которые движок знает (иначе —
  mapping_warnings), с обязательной проверкой «все material drivers из mpc_inputs имеют mapping».
Первый живой вызов IMA-10/11 — заказ калибровок NBIS и NVDA после Flight 14 (23.09), в формате Skill_Runtime_Envelope.

## Порядок принятия
Пакет принимается в норматив после: (1) заказ 1 — схема артефактов, source policy, протокол дозора; (2) git в
workspace и первый conformance NBIS на другой модели; (3) G5-валидатор в invest-calc. До этого IMA Foundation —
proposed_normative, ссылаться на него как на принятый нельзя.

Ограничения прежние: trigger ≠ decision; все числовые параметры — model_assumption / owner_judgment; ID существующих
записей не переписывать; принятые методологии не менять без новой версии.

=== КОНЕЦ ===

## Вложения (папка Downloads/ima-foundation-to-llm)
- `ima-foundation.review.md` — полный разбор пакета со стороны конвейера.
- `portfolio_nbis/` — states.yaml, kpis.yaml, triggers.yaml, mpc_inputs.yaml, state.json, thesis.md (эталон формата
  workspace после слияния).
- `dozor_AGENTS.md` — правила агента-дозора (источники, SEC User-Agent, формат уведомлений).
- `integrator/apply_batch.py`, `integrator/apply_merge.py` — конвертер приёма партии и слияние в реестр владельца
  (binding map, присвоение канонических ID).
- `engine/engine_calibration_schema_docstrings.md`, `engine/company_mc_v2_design.md` — схема калибровки, которую читает
  движок (company_mc 2.3.0, milestone_mc, joint_layer).
