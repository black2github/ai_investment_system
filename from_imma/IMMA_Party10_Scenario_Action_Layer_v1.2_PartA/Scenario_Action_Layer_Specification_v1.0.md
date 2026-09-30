# Scenario Action Layer — Specification v1.0

**Партия:** 10, часть A  
**Дата:** 2026-09-30  
**Статус:** proposed normative  
**Зависимости:** Scenario Engine v1.1; Scenario Event Catalog v1.0; Scenario State v1.1; Portfolio Optimizer contract v1.1; Calibration Lifecycle Rules v1.0.

## 1. Назначение

Scenario Action Layer превращает подтверждённое распознавание сценария в **заранее записанную, проверяемую стратегию для решения владельца**. Он не совершает сделок.

Pipeline:

`Dozor evidence -> Scenario Event Catalog -> scenario_state -> confirmed phase -> conditional scenario run -> conditional optimizer -> pre-written strategy -> owner signal -> owner decision`

Инвариант: **Trigger != Decision**.

Слой разделяет четыре объекта:
1. recognition — что произошло и какая фаза подтверждена;
2. conditional picture — как выглядит портфель при probability=1 для этого сценария/фазы;
3. strategy — заранее записанные действия и ограничения;
4. execution — только после отдельного решения владельца.

## 2. Артефакт стратегии

Один файл на сценарий:

`portfolio/_scenarios/strategies/<SCENARIO>_strategy_v1.0.yaml`

Schema: `Scenario_Strategy_Schema_v1.0.yaml`.

Стратегия обязана ссылаться на принятую scenario calibration, scenario set, portfolio registry, owner constraints и hedge allowlist.

Для каждой фазы `phase_strategy` содержит:
- trigger;
- immutable `conditional_run_ref` / `conditional_optimum_ref`;
- owner turnover cap;
- ordered actions;
- exit_rule;
- risk budget before/after;
- lifecycle status;
- staleness/review state.

Часть A не выпускает первые стратегии. Они относятся к части B и должны использовать фактические conditional optimizer runs хоста.

## 3. Trigger semantics

Нормальный торговый trigger стратегии — только `phase.status == confirmed` и `scenario_set.status == normal`.

`candidate` допускает `signal_only` или `prepare_only`. Он **не может** активировать `reduce`, `add`, `hedge` или `cash_target`.

`confirmed` также не активирует стратегию автоматически. Он создаёт сигнал владельцу. Статус `active` появляется только после отдельного owner decision, записанного интегратором.

При `ambiguous_set_conflict` стратегии всех конфликтующих членов блокируются от перехода в `active`; агент показывает конфликтующие события и просит решение/пересмотр вероятностей.

## 4. Conditional run и conditional optimum

Используется правило Scenario Engine v1.1 §21:
- подтверждённая фаза становится `fixed_quarter: 0` в отдельном conditional run;
- последующие фазы сохраняют свои распределения относительно наблюдённого anchor;
- scenario probability в conditional picture = 1.0;
- owner probabilities обычной смеси не переписываются;
- common `path_id` сохраняется.

Conditional optimizer применяет те же owner structural limits и risk rules, плюс scenario-conditional constraints из §8.

Strategy file хранит immutable run refs; он не хранит скрытый пересчёт оптимума.

## 5. Из conditional optimum в действия

Пусть текущий вес инструмента `i` перед подготовкой стратегии равен `w_i`, условный оптимум — `w_i*`.

`delta_i = w_i* - w_i`.

Норматив v1.0:
1. deadband: если `|delta_i| < 0.005` (0.5 п.п. NAV), торговое действие не создаётся; допускается `hold/review`;
2. retained delta округляется **к нулю** с шагом `0.0025` NAV (0.25 п.п.), чтобы округление само не создавало нарушение limit;
3. owner-supplied `turnover_cap_nav` обязателен для фазы, содержащей торговые действия;
4. при дефиците кэша сокращения обрабатываются раньше докупок;
5. внутри сокращений порядок — сначала наибольший требуемый абсолютный negative delta, затем больший scenario marginal-risk contribution, если он доступен;
6. внутри additions — сначала наибольший positive delta условного оптимума при соблюдении всех owner constraints;
7. cash/hedge reservation учитывается до additions, если это явно задано owner_rule;
8. остаток, не вместившийся в turnover cap, переносится в следующие транши — не перераспределяется скрыто между другими бумагами.

Deadband и шаг округления имеют `provenance: model_assumption`; turnover cap — `owner_judgment` и задаётся в части B.

## 6. Стратегия фиксируется заранее; live сверка при подтверждении

При создании/одобрении strategy сохраняется conditional optimum snapshot.

При фактическом `confirmed` хост пересчитывает live conditional optimum на текущих:
- prices/weights;
- принятых calibrations;
- owner constraints;
- optimizer/scenario contracts.

Считается:

`D_inf = max_i |w_i_live* - w_i_stored*|`.

Если `D_inf > 0.02` (2 п.п. NAV), либо изменился optimizer contract, owner constraint, relevant calibration lifecycle state != current, strategy/hedge model стал невалиден — `strategy_review_required=true`.

Это **не обновляет действия автоматически**. Агент показывает расхождение и требует пересмотра/повторного owner approval.

Если `D_inf <= 0.02`, заранее записанная стратегия считается численно актуальной, но решение об активации всё равно принимает владелец.

## 7. Status lifecycle

`draft -> owner_approved -> active -> executed -> retired`.

- `draft`: стратегия подготовлена, торговый сигнал невозможен;
- `owner_approved`: заранее одобрена владельцем, но ещё не активирована событием + новым решением;
- `active`: только после подтверждения фазы **и** отдельного activation decision владельца;
- `executed`: интегратор зафиксировал исполнение/завершение одобренного плана;
- `retired`: стратегия больше не используется.

Phase exit сам по себе не выполняет reversal. `exit_rule` только говорит, какой review/reoptimization должен быть предложен владельцу.

## 8. Scenario-conditional constraints — Optimizer contract v1.1

Owner decision `DR-2026-09-27-01`:

- `p_min = 0.10`;
- `ES5_min = -0.40`;
- `P(loss>30%)_max = 0.25`;
- `ScenarioConcentration_max = 0.60`;
- одинаковые thresholds для всех qualifying adverse scenarios.

Определим adverse burden по принятому Scenario Engine v1.1 §7:

`B_s = p_s * max(0, ES5_BASE - ES5_s)`.

Множество scenario-conditional hard gates:

`S_cond = {s != BASE | probability_status_s = owner_judgment, p_s >= p_min, B_s > 0}`.

Для каждого `s in S_cond`:

`ES5_5Y(w | s) >= -0.40`

`P(R_5Y(w | s) < -0.30) <= 0.25`.

Оценка выполняется на scenario-specific path set с теми же path_id; при вычислении условного constraint scenario имеет probability=1. Это не означает изменение owner probability в mixture.

### 8.1 Порядок feasibility

Hard feasibility gate:
1. portfolio accounting + разрешённые инструменты;
2. owner structural constraints: single-name, sector, top-3, common-cause, Challenger, cash/dry-powder и hedge limits;
3. действующие BASE `risk_5y` constraints;
4. scenario-conditional ES5/P30 для `S_cond`;
5. ScenarioConcentration hard limit, если применим;
6. только затем — неизменённые lexicographic objectives Portfolio Optimizer.

Hard constraints не ослабляются молча. Если feasible set пуст, результат `INFEASIBLE` с перечнем binding constraints; оптимизатор не повышает thresholds сам.

### 8.2 ScenarioConcentration

Используется исходная формула Scenario Engine v1.1 §7. В burden входят все non-BASE scenarios с известными owner probabilities, даже если `p_s < p_min`.

Hard limit `<= 0.60` применяется только если **минимум два** non-BASE scenario имеют `B_s > 0`. Иначе raw value показывается, constraint = not_applicable_single_adverse_scenario.

После ES5 в существующей lexicographic scheme ScenarioConcentration остаётся tie-break: среди эквивалентных feasible portfolios предпочтительнее меньшая concentration.

### 8.3 Изменение probabilities

Любое owner probability change требует нового optimizer run:
- пересчитывается `S_cond`;
- пересчитываются `B_s` и ScenarioConcentration;
- crossing `p_min` добавляет/убирает hard conditional gate;
- calibrations не меняются;
- strategy files не переписываются автоматически;
- conditional optimum refs, чей feasible set изменился, получают staleness/review flag.

Это `rerun_only` на уровне Calibration Lifecycle, если нет отдельного CLR-основания.

## 9. Hedge instruments — V1

Owner V1 разрешает только:
- cash;
- GLD, hard max `10% NAV`.

Short sales, inverse/leveraged inverse ETF и options запрещены.

### 9.1 GLD: решение

**Плоская доходность 0% не является нормативной hedge-моделью.** Она систематически делает GLD похожим на cash без cash yield и не позволяет оптимизатору оценить hedge benefit.

Минимальный норматив — отдельный `Hedge_Instrument_Model`, не company calibration. Он должен содержать:
- quarterly return model (drift + volatility либо empirical bootstrap);
- root/factor linkage с общими path innovations там, где связь экономически обоснована;
- idiosyncratic component;
- scenario-specific mean/volatility overrides для TAIWAN scenarios;
- common path_id;
- источник/окно market data и stress backtest.

Не следует насильно переводить GLD в AI-company driver taxonomy. Если текущих Joint roots недостаточно для реальных-yield/USD/gold-risk механизмов, hedge model хранит собственный market factor и лишь явные cross-root correlations. Любая связь с `INTEREST_RATES` / `FINANCIAL_CONDITIONS` должна быть откалибрована, а не назначена знаком по интуиции.

До принятия GLD hedge model:
- GLD исключается из conditional optimizer как источник ожидаемой hedge alpha/risk benefit;
- он может фигурировать только как `owner_rule`/`review` action до 10% NAV;
- risk budget обязан пометить `hedge_model_missing`, если стратегия упоминает GLD.

Schema: `Hedge_Instrument_Model_Schema_v1.0.yaml`.

## 10. Dozor -> event -> scenario_state contract

Dozor проверяет **наблюдаемые критерии** Event Catalog, а не action strategy.

Scenario event verification record должен содержать:
- event_id;
- criterion_id;
- fact_id;
- observed value / normalized value;
- operator + threshold из Event Catalog;
- source refs и даты;
- verification_status;
- immutable Dozor run_id.

Dozor не решает, какую сделку совершать.

State transition evaluator:
1. criterion positive but event logic not fully satisfied -> phase/scenario may become `candidate`;
2. event confirmed + все phase entry_criteria satisfied -> `confirmed`;
3. все exit_criteria satisfied -> `exited`;
4. defining events разных members одного mutual_exclusion_set одновременно confirmed -> set_state `ambiguous_set_conflict`.

Dozor statuses `pending_verification`, `source_unavailable_technical`, `not_disclosed` не удовлетворяют required observable criterion. `source_conflict` блокирует confirmation до разрешения.

## 11. Signal contract

При переходе фазы в `confirmed` агент владельца формирует сигнал по `Agent_Scenario_Signal_Contract_v1.0.md`.

Если `strategy_ref == null`:
- показывается только recognition + conditional portfolio picture;
- action text не генерируется.

Если strategy существует:
- действия выводятся **дословно из принятого strategy artifact**;
- показывается strategy status и staleness/live-optimum check;
- при `review_required=true` вместо активации выводится запрос пересмотра;
- сообщение заканчивается: `Решение за владельцем. Автоисполнение запрещено.`

## 12. Probability review

Confirmed event/phase является входом в действующее правило пересмотра probabilities (`DR-2026-09-25-01`, п.5). Action Layer не изменяет probability самостоятельно.

Signal обязан показать:
- дату последнего probability review;
- какие defining events подтверждены после неё;
- `probability_review_due: true|false` по host rule.

## 13. Scenario State v1.1

`Scenario_State_Schema_v1.1.yaml` добавляет к scenario и phase runtime:
- `strategy_ref`;
- `strategy_status`;
- `last_signal_at`;
- `last_signal_id`;

На scenario level также:
- `strategy_review_required`;
- `strategy_review_reason`.

Recognition semantics v1.0 не меняются.

## 14. strategy_ref patch к scenario calibrations

Scenario Engine v1.1 уже допускает nullable `strategy_ref`.

В **части A** три scenario calibration не переиздаются: реальные strategy files ещё не существуют, а ACT-004 запрещает dangling refs.

В части B после создания стратегий выпускается patch `v1.1.1` соответствующей scenario calibration, меняющий только:
- top-level `strategy_ref`;
- phase-level `strategy_ref` там, где есть отдельный phase strategy anchor;
- `as_of/supersedes` по действующему exchange rule, если это требует canonical file format.

Численная scenario semantics не меняется.

## 15. ACT validation rules

Normative machine-readable registry: `Scenario_Action_Validation_Rules_v1.0.yaml`.

Основные группы:
- referential integrity;
- owner instrument/weight limits;
- origin for all numbers;
- conditional-run integrity;
- owner approval before active;
- candidate/ambiguous conflict blocks;
- live-optimum staleness;
- risk-budget run refs;
- GLD model gate;
- Trigger != Decision.

## 16. Совместимость и versioning

Новый Action Layer — v1.0 artifact family в составе Scenario workflow v1.2.

Portfolio Optimizer scenario-conditional contract — **v1.1**: это semantic reissue относительно v1.0 по Calibration Lifecycle §13. Существующие BASE objective/constraints не переопределяются, добавляется hard scenario feasibility layer.

Scenario State Schema `1.0 -> 1.1` — reissue: recognition поля сохранены, добавлены action/signal state fields.

Strategy artifact имеет собственный SemVer. В части B первая стратегия каждого сценария = v1.0.0/filename `v1.0` по workspace convention; дальнейшие изменения следуют Calibration Lifecycle semantic rules по смыслу patch/reissue.

## 17. Старый `portfolio/_scenarios/taiwan.yaml`

Из legacy action layer в новый слой переносится только форма полезных action semantics:
- reduce/add/hold/cash allocation;
- timing/tranches;
- no-buy window;
- explicit preconditions;
- exit/review behavior.

Старые тикеры/веса/проценты не наследуются автоматически и не считаются owner approval для нового 15-name portfolio.

## 18. Часть B

Первыми strategy artifacts после передачи conditional runs хоста:
- `TAIWAN_SEIZURE_strategy_v1.0.yaml`;
- `TAIWAN_QUARANTINE_strategy_v1.0.yaml`;
- `CHIP_COLD_WAR_strategy_v1.0.yaml` — по умолчанию `review` only, если владелец не задаст торговую стратегию.

Часть B обязана пройти ACT-001…ACT-020 и ссылаться на реальные immutable `_runs` conditional optima.
