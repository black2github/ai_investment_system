# AI Investment System — workspace инвестиционного дозора

Репозиторий — рабочее пространство (workspace) агента `invest` на платформе OpenClaw и одновременно
нормативный дом всей инвестиционной методологии: модели компаний, реестры портфеля, принятые спецификации,
отчёты сверок и переписка с IMMA (ролью внешней LLM-методолога). Всё, что здесь лежит, — либо принятый норматив, либо
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
                     Task / Request              ← to_imma/*.request.md (заказ LLM-методологу)
                            │
                Investment Modeling Agent        ← внешняя LLM (сейчас ChatGPT-проект);
                     IMA-01…IMA-11                  роль и скиллы: from_imma/IMA_Foundation_v1.0/ (proposed_normative)
                            │
                   Candidate Artifacts           ← from_imma/<TK>_company_state_v1.0.yaml
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

Четыре роли конвейера и их границы (принято 22.09.2026, детали — to_imma/ima-foundation.review.md и
to_imma/ima-party2.feedback.md):

| Роль | Кто | Что делает | Чего не делает |
|---|---|---|---|
| IMMA — Investment Modeling & Methodology Agent (в пакете Foundation роль названа IMA, Investment Modeling Agent; проектирование методологии там — зарезервированный скилл IMA-12) | внешняя LLM (сейчас ChatGPT-проект) | модели компаний, методология, калибровки — кандидаты | не присваивает канонические ID, не принимает решений |
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

methodology/            ПРИНЯТЫЕ нормативы (одна версия каждого; предыдущие версии — в from_imma/)
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

to_imma/                наши тексты для IMMA (Investment Modeling & Methodology Agent — роль внешней LLM):
  *.request.md          заказы (текст между «=== НАЧАЛО ===» и «=== КОНЕЦ ===» отправляется как есть; вложения перечислены в конце)
  *.feedback.md         приёмка полученных артефактов; обратная связь агента-дозора по прогонам (тоже адресована IMMA)
  *.review.md, *.validation-report.md, *.sync.md  разборы и отчёты проверок, переданные IMMA как вложения
from_imma/              ВСЁ полученное от IMMA как получено: модели компаний партий 1–5, пакеты методологии, схемы всех версий,
                        IMA_Foundation_v1.0/ (манифест роли, реестр скиллов IMA-01…08, контракты, golden cases — ещё не принят),
                        MC_v1.1_partA/, примеры отчётов; принятое копируется в methodology/, здесь остаётся архив
notes/                  внутренние документы, никому не адресованные: сводки и разборы переписок, отчёты покрытия, шаблон ввода позиций
```

## Форматы и версии

- Каждый принятый норматив имеет версию в имени файла и внутри (`version`, `schema_version`); в `methodology/`
  лежит только действующая версия, история — в `from_imma/` и в git. Исключение — закреплённые версии: схема
  калибровки MC v1.0.1 остаётся рядом с v1.0.2, потому что принятые калибровки SPCX/NBIS/NVDA привязаны к ней и к
  семантике движка 2.3.0 (жёсткий переключатель базы оценки); калибровки схемы ≥1.0.2 считаются движком 2.3.1 с
  непрерывной сменой базы (parity-gated blend, Conditional MC v1.1.3). Какая семантика применена, движок пишет в
  выход прогона (`valuation_crossover.mode`); валидатор выбирает схему по `schema_version` файла.
- Канонические файлы компании несут `schema_version` (сейчас `1.0.5`). Миграции схемы выполняет утилита
  лаборатории построчно, без переформатирования (инварианты: ID, состояния и условия не меняются; повторный
  запуск ничего не меняет).
- Провенанс каждого числа: `verified_fact` (с URL и датой документа) | `derived_fact` (с формулой) |
  `model_assumption` (с обоснованием) | `owner_judgment` | `normative_rule`.
- Значения KPI: `last_value` — только число или `null`; форма наблюдения — `observation_qualifier`
  (`exact | approximate | lower_bound | upper_bound | range | not_separately_disclosed | pending_verification`);
  природа — `value_type` (`actual | company_guidance | analyst_estimate`).
- Отчёт сверки (`_verify/<run_id>.json`): `protocol_version`, `items[]` (KPI), `axis_items[]`,
  `transition_checks[]` (проверки условий переходов: met | not_met | pending_history), `event_items[]` (только
  дискретные события), `summary.overall_status` ∈ PASS | PASS_WITH_DECLARED_PENDING | PATCH_REQUIRED |
  BLOCKED_TECHNICAL | BLOCKED_SOURCE_CONFLICT. В сообщениях владельцу статусы даются по-русски с кодом в скобках
  (`label_ru`). История сверок наблюдения — `kpi_observations[].verification_run_ids` (наблюдение не дублируется,
  пока не изменились период и значение).

## Приёмка нормативов от IMMA

Правила приняты 23.09.2026 после дефекта Dozor v1.2 (переиздание содержало только дельту: схема и живые отчёты
проходили, а семь принципов и правила KPI из v1.1 выпали — заметить это можно было только по diff).

1. **Переиздание = полный текст предыдущей версии + дельта.** Удаление раздела допустимо только с явным
   обоснованием в ответе IMMA. Этот абзац входит в каждый заказ переиздания, а не подразумевается.
2. **Полнота замены проверяется механически**, а не глазами: `calc/tools/check_supersedes.py <старая> <новая>`
   (лаборатория) сравнивает деревья YAML/JSON и печатает всё, что пропало; отказ при любой пропаже без явного
   решения (`--allow <путь>`). Запускается на каждой приёмке вместе со схемной валидацией и живыми
   отчётами/прогонами; результат — в текст приёмки.
3. **Гейт «один дом у факта».** Норматив считается принятым только когда предыдущая версия уходит из
   `methodology/` (остаётся в `from_imma/` и в git). Если старый файл приходится оставить (как v1.1 протокола до
   сводной v1.2.1), приёмка условная: это пишется в `STATUS.md` и в приёмку для IMMA вместе с заказом сводной
   редакции.
4. Порядок приёмки не меняется: независимая валидация (схемы, реестры, отчёты, прогоны движка) → приёмка/заказ
   исправлений в `to_imma/` → интеграция (methodology, миграция, валидатор, `AGENTS.md`) → снимок git с тегом по
   содержанию (`snapshot-artifact-v1.0.5`, `dozor-v1.2`, …) → точка возврата в `STATUS.md`.
5. **Смена чата IMMA** (переполнение контекста, 24.09.2026): новый чат получает пакет восстановления
   (`to_imma/imma-context-restore.request.md` + вложения: README, вся `methodology/`, пакет роли, последние приёмки)
   и допускается к работе только после верных ответов на контрольные вопросы. В пакет обязательно входят **и файлы
   текущей приёмки** (калибровки/отчёты, по которым ещё не принято решение), иначе новый чат не сможет выпустить
   переиздание «полный текст + дельта» — урок META/ASML v1.0.1.

## Жизненный цикл модели компании

1. **Заказ** — `to_imma/<тема>.request.md`; владелец передаёт текст IMMA вместе с вложениями.
2. **Кандидат** — ответ LLM кладётся в `from_imma/` (`<TK>_company_state_v1.0.yaml` по Candidate Schema).
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

- Теги git: `S0` — до миграции к схеме артефактов (22.09.2026), `S1` — v1.0.1, `S2` — v1.0.3, `S3` — v1.0.4,
  `snapshot-artifact-v1.0.5` — v1.0.5 + протокол дозора v1.2 (23.09.2026). Снимки нужны для golden cases и
  conformance-прогонов (воспроизведение модели «до исправления»). С 23.09 теги называются по содержанию:
  `<что>-v<версия>` для нормативов (`snapshot-artifact-v1.0.5`, `dozor-v1.2`, `mc-spec-v1.1.2`), `<трек>-<веха>`
  для процессных точек; описание тега (`-m`) — полное. Старые `S0…S3` не переименовываются (на `S0` ссылаются
  тесты миграции).
- Коммиты и push — по запросу владельца; в коммит попадают только перечисленные файлы. Файлы памяти агента
  (`DREAMS.md`, `memory/`) коммитятся отдельно, в норматив не входят.
- Переводы строк и кодировка файлов сохраняются как есть (CRLF/LF смешаны исторически; UTF-8 без BOM).
- Точка возврата и очередь решений — всегда в `STATUS.md`; там же ссылки на прогоны (`run_id`) и коммиты.
