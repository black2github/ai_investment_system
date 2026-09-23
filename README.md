# AI Investment System — workspace инвестиционного дозора

Репозиторий — рабочее пространство (workspace) агента `invest` на платформе OpenClaw и одновременно
нормативный дом всей инвестиционной методологии: модели компаний, реестры портфеля, принятые спецификации,
отчёты сверок и переписка с LLM-методологом. Всё, что здесь лежит, — либо принятый норматив, либо
проверяемый факт с источником, либо явно помеченное допущение. Язык документов — русский; термины
методологии (названия артефактов, статусов, полей) — английские, как в схемах.

Главный принцип системы: **триггер ≠ решение**. Система наблюдает, проверяет по первоисточникам и
формирует Decision Request владельцу; сделок она не совершает и советов сверх зафиксированной стратегии
не даёт. Второй принцип: **ничего не выдумывать** — число без источника не факт, прогноз компании
(`company_guidance`) не равен факту (`actual`), нераскрытое значение не оценивается.

Расчётный движок, утилиты миграции и валидатор живут в отдельном репозитории лаборатории
(`openclaw-lab`: сайдкар `invest-calc`, `calc/engine`, `calc/tools`); здесь хранятся только его
входы (калибровки) и выходы (записи прогонов).

## Архитектура

```
                    AI Investment System
                            │
                     Task / Request              ← inbox/*.request.md (заказ LLM-методологу)
                            │
                Investment Modeling Agent        ← внешняя LLM (сейчас ChatGPT-проект);
                     IMA-01…IMA-11                  роль и скиллы: inbox/received/IMA_Foundation_v1.0/ (proposed_normative)
                            │
                   Candidate Artifacts           ← inbox/received/<TK>_company_state_v1.0.yaml
                            │                       (Company Candidate Schema v1.0.1)
                    Artifact Validator           ← модель artifact_validator в invest-calc (гейт G5):
                     deterministic G0–G5            JSON Schema + правила ART-REF / CAND-REF / DZR
                            │
                        Integrator               ← детерминированные скрипты лаборатории:
            normalize / IDs / binding / merge       канонические ID <TK>-KPI-NN / <TK>-E-NN, слияние с реестром
                            │
                  Canonical Company Model        ← portfolio/<тикер>/{states,kpis,triggers,mpc_inputs}.yaml + state.json
                            │                       (Company Artifact Schema v1.0.4)
                          Dozor                  ← агент invest (OpenClaw): сверка по первоисточникам
                    primary-source G8               (Dozor Verification Protocol v1.1, Source Policy v1.0)
                            │                       → portfolio/<тикер>/_verify/<run_id>.json
                    Acceptance Record            ← state.json → verification, kpi_observations, scenario_state
                            │
           ┌────────────────┴───────────────┐
           │                                │
     Calculation Engine               OpenClaw invest
   RV / MC / MPC / Optimizer          monitoring/events   ← cron-задания: дозор новостей, ценовые сторожа,
   (сайдкар invest-calc,                                     сверки по отчётам, вечерняя сводка
    записи в portfolio/_runs)          │
           └────────────────┬───────────────┘
                            │
                     Decision Request            ← сообщение владельцу в Telegram по шаблонам AGENTS.md
                            │
                          Owner                  ← решения фиксируются в state.json (owner_decisions, fired),
                                                    STATUS.md и _conviction_journal.yaml
```

Четыре роли конвейера и их границы (принято 22.09.2026, детали — inbox/ima-foundation.review.md и
inbox/ima-party2.feedback.md):

| Роль | Кто | Что делает | Чего не делает |
|---|---|---|---|
| Investment Modeling Agent (IMA) | внешняя LLM | модели компаний, методология, калибровки — кандидаты | не присваивает канонические ID, не принимает решений |
| Интегратор | скрипты лаборатории (`calc/tools`) | канонические ID, слияние с реестром владельца, миграции схем | не меняет числа и смыслы |
| Дозор | агент `invest` | сверка KPI / состояний осей / событий по первоисточникам, уведомления | не переписывает канонические файлы, не создаёт сделок |
| Движок | сайдкар `invest-calc` | обратная оценка, Монте-Карло, режим портфеля, валидатор | не использует LLM |

## Что где лежит

```
README.md               этот файл
STATUS.md               точка возврата трека: что сделано, что закоммичено, очередь решений (обновляется на вехах)
AGENTS.md               инструкция агента invest: программа «Дозор портфеля», шаблоны сообщений, правила сверки, красные линии
SOUL.md IDENTITY.md     персона агента (OpenClaw)
USER.md                 модель владельца для агента (предпочтения, формат общения)
DREAMS.md memory/       память агента (ночная консолидация OpenClaw); в норматив не входит
templates/              шаблоны текстов (final-block-template.md — финальный блок онбординга компании)

methodology/            ПРИНЯТЫЕ нормативы (одна версия каждого; предыдущие версии — в inbox/received/)
  Company_Candidate_Schema_v1.0.1.yaml      формат ответа LLM (кандидат модели компании), JSON Schema
  Company_Artifact_Schema_v1.0.4.yaml       формат канонических файлов компании (5 файлов), каталог полей с владельцем каждого поля
  Source_Policy_v1.0.{yaml,md}              классы источников, guidance ≠ actual, период дословно, технический доступ (SEC User-Agent)
  Dozor_Verification_Protocol_v1.1.{yaml,md} гейт G8: статусы сверки (KPI, оси, события), допуски, схема отчёта, label_ru
  MPC_Driver_Taxonomy_v1.1.{yaml,md}        таксономия драйверов (32) для вектора экспозиции компании
  Marginal_Portfolio_Contribution_*_v1.0    MPC: вклад позиции в портфель — вектор, не score
  Joint_Simulation_Layer_*_v1.0             совместные пути драйверов (root-факторы AR(1)) для MC всех компаний
  MC_Calibration_Archetypes_*_v1.0/v1.1     три архетипа калибровки MC (mature / capital-intensive / milestone-driven)
  SPCX_Conditional_Monte_Carlo_Specification_v1.0.md  условный MC (пилот SpaceX; обобщение — заказ MC v1.1)
  Investment_System_Reverse_Valuation_Specification_v1.0.md, Reverse_Valuation_Rules_v1.1.md  обратная оценка (implied CAGR) и её устойчивость
  Portfolio_Optimizer_*_v1.0, Portfolio_Stability_Test_*_v1.0  оптимизатор (лексикографический) и тест устойчивости
  Portfolio_Drawdown_and_Regime_Rules_v1.0.md          режимы портфеля (Normal / Stress / Shock) по просадкам
  Conviction_Overlay_*_v1.0, Conviction_Journal_Schema_v1.0.yaml  слой убеждения владельца: два лимита, бюджет потери, журнал
  Team_Execution_Axis_*_v1.0                ось «команда и исполнение» (T0–T4)
  AI_COMPUTE_Benchmark_*_v1.0               синтетическая секторная корзина AI_COMPUTE (NBIS/CRWV)

portfolio/
  _portfolio.yaml         портфель владельца: счета, позиции и cost basis, ориентиры, лимиты, слой убеждения (schema v1.1)
  _candidates.yaml        пул компаний: стадия, архетип MC, сектор, тема (theme: AI — политика «не наращивать с 21.09.2026»)
  _conviction_journal.yaml журнал решений слоя убеждения (пометки «доверяю», исключения, 12-месячная проверка)
  _ideas.yaml             идеи и отложенные вопросы
  _scenarios/taiwan.yaml  сценарий «Тайвань» (стадии S1–S3 и действия по позициям)
  _watch/watch-prices.js  многотикерный ценовой сторож (trigger script для OpenClaw)
  _runs/                  записи прогонов движка invest-calc (<run_id>.json: модель, версия, seed, входы, выходы);
                          массивы путей MC (*.npz) в git не входят — воспроизводимы по seed
  <тикер>/                компания (15 папок с моделью: asml asts crwv etn hood lly meta msft nbis net nvda pltr rklb spacex + su/6506/6324/crwd — только реестры)
    thesis.md             тезис владельца и история онбординга
    states.yaml           оси состояния компании: состояния с критериями, текущий вектор, источники (sources с source_class и as_of = дата подачи документа)
    kpis.yaml             критические KPI: пороги Green/Yellow/Red (model_assumption), last_value число|null, value_type, observation_qualifier, source_class, provenance
    triggers.yaml         единственный дом того, ЧТО отслеживаем: триггеры -P- (цена) -E- (подтверждение/переходы) -X- (ломает тезис) -F- (фиксация) -C- (даты);
                          профиль full_model | registry_only; статусы active / planned / due / paused / done / dropped; маршрут (route); автоматизации
    mpc_inputs.yaml       вектор экспозиции к драйверам (−2…+2) и failure modes с common_cause_id
    state.json            runtime-состояние (пишут дозор и интегратор): цена, fired, events_reported, pending_verification,
                          scenario_state (состояния осей + verified + verification_run_id), kpi_observations, calc_runs, verification, info_log
    _verify/<run_id>.json иммутабельные отчёты сверки по протоколу дозора (KPI, оси, события)
    spacex/ дополнительно: calibration_v1.0.yaml (обратная оценка), mc_calibration_v1.0.yaml (условный MC), watch-price.js

inbox/                  переписка с LLM-методологом и владельцем
  *.request.md          заказы для LLM (текст между «=== НАЧАЛО ===» и «=== КОНЕЦ ===» отправляется как есть; вложения перечислены в конце)
  *.feedback.md         приёмка полученных артефактов и обратная связь исполнителя-дозора по прогонам
  *.review.md, *.assessment.md, *.summary.md  разборы и сводки
  received/             ВСЁ полученное от LLM как получено (модели компаний партий 1–5, пакеты методологии, схемы всех версий,
                        IMA_Foundation_v1.0/ — манифест роли, реестр скиллов IMA-01…08, контракты, golden cases (ещё не принят),
                        примеры отчётов); принятое копируется в methodology/, здесь остаётся архив
```

## Форматы и версии

- Каждый принятый норматив имеет версию в имени файла и внутри (`version`, `schema_version`); в `methodology/`
  лежит только действующая версия, история — в `inbox/received/` и в git.
- Канонические файлы компании несут `schema_version` (сейчас `1.0.4`). Миграции схемы выполняет утилита
  лаборатории построчно, без переформатирования (инварианты: ID, состояния и условия не меняются; повторный
  запуск ничего не меняет).
- Провенанс каждого числа: `verified_fact` (с URL и датой документа) | `derived_fact` (с формулой) |
  `model_assumption` (с обоснованием) | `owner_judgment` | `normative_rule`.
- Значения KPI: `last_value` — только число или `null`; форма наблюдения — `observation_qualifier`
  (`exact | approximate | lower_bound | upper_bound | range | not_separately_disclosed | pending_verification`);
  природа — `value_type` (`actual | company_guidance | analyst_estimate`).
- Отчёт сверки (`_verify/<run_id>.json`): `protocol_version`, `items[]` (KPI), `axis_items[]`, `event_items[]`,
  `summary.overall_status` ∈ PASS | PASS_WITH_DECLARED_PENDING | PATCH_REQUIRED | BLOCKED_TECHNICAL |
  BLOCKED_SOURCE_CONFLICT. В сообщениях владельцу статусы даются по-русски с кодом в скобках (`label_ru`).

## Жизненный цикл модели компании

1. **Заказ** — `inbox/<тема>.request.md`; владелец передаёт текст LLM вместе с вложениями.
2. **Кандидат** — ответ LLM кладётся в `inbox/received/` (`<TK>_company_state_v1.0.yaml` по Candidate Schema).
3. **Интеграция** — скрипты лаборатории конвертируют кандидата в пять канонических файлов, присваивают
   канонические ID, привязывают legacy-триггеры реестра владельца к осям; валидатор G5 проверяет папку.
4. **Сверка** — дозор по протоколу открывает первоисточники, пишет отчёт в `_verify/`, обновляет runtime в
   `state.json`; расхождения → Decision Request, канонические файлы не правятся молча.
5. **Расчёты** — калибровки (обратная оценка, условный MC) → прогоны движка → записи в `_runs/`, ссылки в
   `state.json → calc_runs`.
6. **Наблюдение** — cron-задания агента: ценовые сторожа (скрипт, модель только при смене зоны), дозор новостей
   (ежедневно), сверки после отчётов, вечерняя сводка. Каждое подтверждённое событие — запись в `state.json` и
   одно сообщение владельцу.
7. **Решение** — только владелец; фиксируется в `state.json` (`owner_decisions`, `fired[].status`) и в журнале.

## Снимки и соглашения

- Теги git: `S0` — до миграции к схеме артефактов (22.09.2026), `S1` — v1.0.1, `S2` — v1.0.3, `S3` — v1.0.4.
  Снимки нужны для golden cases и conformance-прогонов (воспроизведение модели «до исправления»).
- Коммиты и push — по запросу владельца; в коммит попадают только перечисленные файлы. Файлы памяти агента
  (`DREAMS.md`, `memory/`) коммитятся отдельно, в норматив не входят.
- Переводы строк и кодировка файлов сохраняются как есть (CRLF/LF смешаны исторически; UTF-8 без BOM).
- Точка возврата и очередь решений — всегда в `STATUS.md`; там же ссылки на прогоны (`run_id`) и коммиты.
