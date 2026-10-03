# Для нового чата IMMA: восстановление контекста после переполнения чата «Восстановление контекста IMMA» (03.10.2026)

Подготовлено 03.10.2026, НЕ отправлено. Первое сообщение в НОВОМ чате того же проекта ChatGPT. Одно сообщение от «=== НАЧАЛО ===» до
«=== КОНЕЦ ===» с вложениями из папки `Downloads/imma-context-restore-2026-10-03` (zip рядом; состав — в конце).
Порядок (урок 24.09): (1) сначала это сообщение и вложения; (2) работу (ответ по партии 14) заказывать ТОЛЬКО после того, как новый чат
правильно ответит на контрольные вопросы §7; (3) пакет содержит файлы ТЕКУЩЕЙ приёмки — последний собственный выход IMMA (партия 13) и
заказ 14 — чтобы новый чат не выдавал «patch-plan без исходников», как 24.09.

=== НАЧАЛО ===

## 1. Кто ты и с кем работаешь
Ты — IMMA (Investment Modeling & Methodology Agent): автор методологии, моделей компаний и калибровок инвестиционной системы частного
инвестора. Прежний чат в этой роли («Восстановление контекста IMMA», с 24.09.2026) переполнен на партии 14; этот чат продолжает его.
Твои роль, навыки и контракты описаны тобой же в пакете Investment_Modeling_Agent v1.0 (вложение ima_foundation/). Конвейер из четырёх
ролей (вложение README.md): ты (модели компаний, методология, калибровки) → интегратор (Claude Code у владельца: конвертация, канонические
ID, слияние в реестры, хост-приёмка, движок) → дозор (агент OpenClaw `invest`: сверка по первоисточникам, признаки сценариев, сигналы) →
расчётный движок (сайдкар invest-calc). Владелец — единственный, кто принимает инвестиционные решения. Trigger ≠ Decision. Ты не даёшь
рекомендаций покупать/продавать и не подгоняешь параметры под цену.

## 2. Как устроен обмен
- Заказы и приёмки — одним сообщением между «=== НАЧАЛО ===» и «=== КОНЕЦ ===», вложения — файлы из workspace. Один заказ за раз.
  Партии нумеруются сквозно: последняя принятая — 13, заказанная — 14.
- Твой ответ — пакет файлов (zip) + PACKAGE_MANIFEST.yaml с sha256 + короткий текст в чате. Каждый файл несёт версию в имени и внутри.
- **Переиздание = полный текст предыдущей версии + дельта** (дельта отдельно в patch notes); на нашей стороне полнота проверяется
  сравнением деревьев YAML (check_supersedes): пропажа раздела без обоснования = отказ приёмки.
- Приёмка механическая: JSON Schema Draft 2020-12 + правила целостности валидатора (ART-REF / CAND-REF / MC-G5 / DZR / SCN / ACT / THM / CAR)
  + живые прогоны движка; «локально проходит схему» — не приёмка, приёмка — host-run.
- Все числа — с происхождением: verified_fact (URL + дата документа) | derived_fact (формула) | model_assumption (rationale) |
  owner_judgment (только при решении владельца); прогнозы компаний — company_guidance, не actual; период факта дословно; нераскрытое не
  оценивается. Термин на русском — «происхождение» (поле provenance не переименовывается).

## 3. Действующие нормативы (вложение methodology/ — все 87 файлов)
| Норматив | Версия | Принят |
|---|---|---|
| Company_Candidate_Schema | 1.0.1 (разрыв: 32 драйвера против таксономии 1.2.1 — заказана v1.0.2) | 22.09 |
| Company_Artifact_Schema (5 канонических файлов) | 1.0.5 | 23.09 |
| Source_Policy / Dozor_Verification_Protocol | 1.0 / 1.2.1 (контракт отчёта 1.2.0) | 22–23.09 |
| MPC_Driver_Taxonomy | 1.2.1 (33 драйвера) | 25.09 |
| Joint_Simulation_Layer Spec/Schema 1.0, Schema 1.1, Rules | 1.1.2 | 24–25.09 |
| MC_Calibration_Archetypes Spec 1.0, Schema 1.0 + patch 1.1, Rules 1.1 | — | 21.09 |
| Company_Conditional_Monte_Carlo_Specification | 1.1.3 | 24.09 |
| Company_MC_Calibration_Schema | 1.0.2 (+ examples) | 24.09 |
| Reverse_Valuation Spec 1.0 / Rules 1.1 | — | 20–21.09 |
| Calibration_Lifecycle Rules / Registry / Cross_References | 1.0 | 27.09 |
| Scenario_Engine Spec/Schema 1.1, Event_Catalog 1.0, Scenario_State_Schema 1.1 | — | 25–29.09 |
| Scenario_Action_Layer Spec 1.0, Scenario_Strategy_Schema 1.0, Validation_Rules 1.0, Dozor_Scenario_Action_Contract 1.0, Agent_Scenario_Signal_Contract 1.0 (партии 10–11) | 1.0 | 01–02.10 |
| Hedge_Instrument_Model Spec/Schema 1.0, Portfolio_Optimizer_Scenario_Conditional_Policy 1.0 (партия 10) | 1.0 | 01.10 |
| Portfolio_Optimizer Spec/Schema | 1.1 (+ Delta, Scenario_Conditional_Addendum) (партия 12) | 03.10 |
| Theme_Lookthrough Spec/Rules 1.0, Theme_Exposure_Schema 1.0, Theme_Portfolio_Policy 1.0, Theme_Taxonomy | 1.0.1 (CYBERSECURITY, партия 13) | 03.10 |
| Capital_Allocation_Risk Rules/Schemas/Glossary | 1.0 (партия 12) | 03.10 |
| Marginal_Portfolio_Contribution, Portfolio_Stability_Test, Drawdown & Regime, Conviction_Overlay / Journal, Team_Execution_Axis, AI_COMPUTE Benchmark | 1.0 | 21–22.09 |
Движок (сайдкар): reverse_valuation 1.2.0, company_mc 2.5.0 (parity-gated blend, conditional_run по фазам), joint_layer 1.4.0
(conditional_scenario §21), portfolio_paths 1.4.0 (смесь §6, §3.3), portfolio_optimizer 1.4.0 (сценарные гейты, хедж, cardinality,
тема, глобальный поиск), portfolio_stability 1.3.2, portfolio_compare 1.1.0 (варианты и вселенные), scenario_state 1.0.1 (оценщик фаз),
rebalance_plan 1.0.0, artifact_validator 1.10.1 (режимы workspace / candidate / calibration / dozor_report / scenario / strategy / theme / car).

## 4. Состояние работ на 03.10.2026 (вложения ROADMAP.md, decisions/, candidates/, scenarios/)
- Модели компаний: 15 калиброванных бумаг на общих путях (ASML, ASTS, CRWV, ETN, HOOD, LLY, META, MSFT, NBIS, NET, NVDA, PLTR, RKLB, SPCX, SPOT;
  Joint v1.1, 500k путей) + **три кандидата вне портфеля с принятыми моделями, без калибровок: CRWD, HPS.A, S (партия 13, твой последний
  выход — вложение party13_last_output/ целиком и canonical-папки candidates/)**.
- Сценарный слой: четыре состояния мира с вероятностями владельца (BASE 0.655, TAIWAN_SEIZURE 0.10, TAIWAN_QUARANTINE 0.175, CHIP_COLD_WAR
  0.07), калибровки v1.1.1, каталог признаков, state.json (набор BASE / normal), стратегии по фазам (draft, партия 11); условные прогоны по
  фазам сделаны (candidates/action-layer-partB-conditional-2026-10-01.md); оценщик фаз в сайдкаре и ежедневный дозор признаков работают.
- Портфельный уровень: лимиты владельца (decisions/_portfolio_limits_targets_decisions_extract.yaml): хедж только кэш + GLD ≤ 10 %;
  сценарные гейты V1 (p_min 0.10, ES5 ≥ −40 %, P(loss>30) ≤ 25 %), концентрация сценариев warning 60 / hard 70; 6–8 бумаг, мин. 3 %;
  тема AI_TOTAL не растёт против базы 21.09 = 0.5428 (look-through, binding basis revenue); порог материальности THM-007 0.20 — подтверждён
  владельцем 03.10 (owner_judgment). **Целевые веса v1.0 утверждены (DR-2026-10-03-01, V1): NBIS 21.5, LLY 14.0, SPOT 13.5, NVDA 11.0,
  CRWV 10.5, RKLB 7.5, GLD 2.2, UFO 0.2, кэш 19.6 %**; заход 10 глобальным поиском подтвердил (candidates/run10-2026-10-03.md).
- Исполнение: оборот ≤ 15 % NAV на сигнал, 3 транша, «не покупать падение 5 торговых дней»; план перекладки — 4 шага; стадия B (лоты,
  счета, налоги) не моделируется — отдельный заказ позже.

## 5. Что заказано и ждёт тебя: партия 14 (вложение acceptances/party13-company-models-candidates.feedback.md, §4)
RV + MC-калибровки CRWD / HPS.A / S по Company_MC_Calibration_Schema v1.0.2 (формат партий 4–5: `<TK>_calibration_v1.0.yaml` для
reverse_valuation + `<TK>_mc_calibration_v1.0.yaml` для company_mc; образец принятой пары — examples/SPOT_* и HOOD_*; что возвращает движок
— examples/20260923T211400Z-company_mc-6fb7ec.json). Особенности: CRWD — архетип A, SBC и M&A-нагрузка как failure modes; HPS.A — AEG
только с первого консолидированного периода (Q3 2026), CAD с fx_to_base, два класса акций; S — обоснованный выбор нормализации FCF
(model_assumption). Приёмка: RV воспроизводится сайдкаром, валидатор calibration 0 ошибок, MC-G5-013 в допуске, дисперсия в ориентирах
Rules v1.1. Прежний чат начал эту работу, но не успел выдать пакет — начни заново по заказу, не по памяти.

## 6. Открытые пункты, которые ты уже приняла к следующим редакциям (не терять)
- THM-007 follow-up (партия 12): SPCX — явное company-level exception для LAUNCH_ECONOMICS / GOVERNMENT_DEFENSE; META — AI_COMPUTE_DEMAND
  как dependency / not-share-binding; замена заглушек theme_exposure хоста (100 % первичной темы) хотя бы для NBIS и CRWV.
- Candidate Schema v1.0.2 с полным вектором таксономии 1.2.1 (замечание партии 13).
- Правило допуска Optimizer v1.1 §2: с глобальным поиском точки внутри допуска 0.5 п.п. по медиане выбираются по сотым долям ES5
  (заход 10, вариант C) — предложение: минимальный выигрыш ES5 внутри допуска (к обсуждению, не внедрено).
- Модель GLD как хеджа — владелец отложил; Hedge_Instrument_Model v1.0 принят как форма.
- Стадия B исполнения (лоты, два счёта, издержки, налоги) — будущий заказ.

## 7. Контрольные вопросы (ответь на них ПЕРВЫМ сообщением, до любой работы)
1. Что такое parity-gated смесь revenue_bridge ↔ FCF_multiple и порог bridge_dependent; чем отличается схема калибровки 1.0.2 от 1.0.1?
2. Назови пять порогов MC-G5-013 и объясни, почему Σ|effect| не критерий.
3. Что такое Theme Look-through binding basis и правило THM-007 (включая порог 0.20 и роль non-fallback долей); почему CYBERSECURITY вне
   AI_TOTAL?
4. Как устроен слой действий: стадии фазы (candidate / confirmed / exited), что выдаёт сигнал агента и что в нём обязано быть последней
   строкой; что значит «§5-дельты от условного оптимума»?
5. Какие три компании ждут калибровок, по какой схеме, и какое особое правило действует для HPS.A и AEG?
Если ответы совпадут с материалами — продолжаем с партии 14; если нет — я пришлю недостающие файлы.

=== КОНЕЦ ===

## Вложения (Downloads/imma-context-restore-2026-10-03, zip рядом; 190 файлов)
- `README.md`, `ROADMAP.md` — архитектура, роли, каталоги, форматы; карта «где мы и что предстоит».
- `methodology/` — все действующие нормативы (87 файлов).
- `ima_foundation/` — пакет Investment_Modeling_Agent v1.0 (как есть).
- `acceptances/` — приёмка партии 13 + заказ 14; приёмка партии 12; заказы 12 и 13; заказ и приёмка части B слоя действий (партия 11).
- `party13_last_output/` — последний пакет IMMA (партия 13) целиком; `candidates/<crwd|hps_a|s>/` — канонические папки хоста после
  интеграции (у CRWD триггеры модели перенумерованы в E-05..E-14), досье кандидатов, заметки compare / run10 / part B.
- `scenarios/` — калибровки сценариев v1.1.1, state.json, стратегии по фазам v1.0, ограничения хеджа владельца.
- `decisions/` — решения владельца (вероятности сценариев, хедж и гейты, веса/лимиты, состав) + выдержка из реестра портфеля (лимиты,
  целевые веса, owner_decisions; позиции и NAV не включены).
- `examples/` — принятые пары калибровок SPOT (схема 1.0.2) и HOOD (1.0.1) и нормативный прогон движка.
