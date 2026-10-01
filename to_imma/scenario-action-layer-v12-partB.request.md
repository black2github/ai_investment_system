# Для передачи IMMA: заказ Scenario_Action_Layer v1.2, часть B — первые стратегии по фазам (TAIWAN_SEIZURE, TAIWAN_QUARANTINE, CHIP_COLD_WAR) на условных оптимумах хоста

Отправлен IMMA 01.10.2026 (владелец), партия 11. Одно сообщение от «=== НАЧАЛО ===» до «=== КОНЕЦ ===» + вложение
`C:\Users\alexe\Downloads\partB-action-layer-to-llm.zip` (12 файлов, манифест внутри): заметка хоста с таблицами, карта условных прогонов
(run_id компаний и файлы путей), 7 полных записей условных оптимумов, состояние сценариев v1.1, ограничения владельца (выдержка
_portfolio.yaml + owner_hedge_instrument_constraints). Партия — следующая по сквозной нумерации (11).

=== НАЧАЛО ===

## 1. Контекст и факты хоста (01.10.2026)
- Часть A принята и внедрена (ваше подтверждение 01.10). Движок: company_mc 2.5.0 conditional_run (§21, с вашим уточнением про
  исторические шоки), portfolio_optimizer 1.1.1 (contract v1.1, S_cond при p_s ≥ p_min и B_s > 0), Scenario_State 1.1 на хосте.
- Выполнены **условные прогоны** всех фаз TAIWAN_SEIZURE (RESTRICTIONS / BLOCKADE / CONFLICT / RECOVERY) и TAIWAN_QUARANTINE
  (RESTRICTIONS / QUARANTINE / NORMALIZATION_OR_FROZEN): 15 калиброванных бумаг × 500k путей на общих path_id (seed 20260920),
  фаза P → fixed_quarter 0, состояние на t0 унаследовано от предыдущей фазы; RESTRICTIONS = безусловные пути (fixed_quarter 0,
  побитовое равенство проверено тестом). Карта run_id и файлов путей — `conditional_runs_partB.json`.
- Выполнены **условные оптимумы** по каждой фазе (Optimizer 1.1.1, лимиты владельца approved_limits_v1_0, потолки Conviction
  Overlay, fixed GLD 2.2 % / UFO 0.2 %, старты current/equal/empty/given от оптимума отбора C2 …-5a6da6; выбран given во всех семи):
  TS RESTRICTIONS …-ea1b90, BLOCKADE …-052179, CONFLICT …-e0569e, RECOVERY …-cad140; Q RESTRICTIONS …-9ef262, QUARANTINE …-49f452,
  NORMALIZATION_OR_FROZEN …-f449b4. Полные записи — в `conditional_optima_runs/`; сводные таблицы — в заметке.
- **Главное наблюдение.** Условные оптимумы семи фаз почти совпадают между собой и с оптимумом BASE-смеси C2 (расхождения ≤ 7 п.п. по
  одной бумаге): под фазами силового Тайваня NBIS 11.5–12.5 % против 18.5 % в C2, ASTS 2.5–3 % против 0, META 2.5–3.5 %; под карантином
  NBIS 16–17 %; RECOVERY / NORMALIZATION возвращают NBIS/NVDA и добавляют META. Везде связывают потолки CRWV/RKLB/SPOT и кэш 17.6–19.6 %.
  Под подтверждённой блокадой текущие веса (18.09) дают ES5 −34 %, условный оптимум +8 %: защита — кэш и снятие концентрации
  NBIS/NVDA/HOOD, не хедж (GLD с плоской доходностью в оптимум не входит, по §9 части A).
- Следствие для формы стратегии: по §5 действия считаются от весов на момент подготовки стратегии. Если считать от текущих весов
  18.09, действия на 80 % состоят из общей перекладки в оптимум отбора (HOOD −14, NBIS −16…−21, NVDA −10…−13, кэш +17…+19 п.п.) и
  не зависят от фазы. Собственно сценарная часть видна от оптимума отбора: TS-фазы — NBIS −6…−7 п.п., ASTS +2.5…+3, META +0.5…+1.5,
  LLY +0.5; RECOVERY — NBIS −2, NVDA −2.5, META +5; карантин — NBIS −1.5…−2.5, META +2.5…+3 (таблица 4б заметки). Просим учесть это
  в п. 2.1.

## 2. Заказ, часть B
2.1 **Стратегии** по Scenario_Strategy_Schema v1.0: `TAIWAN_SEIZURE_STRATEGY` (4 фазы), `TAIWAN_QUARANTINE_STRATEGY` (3 фазы),
    `CHIP_COLD_WAR_STRATEGY` — по решению владельца 01.10 **только review** (действия типа review при PARITY_BOUNDARY: пересмотр
    вероятностей и экспозиций NVDA/ASML, без предзаписанных сделок). Для TS/Q — `basis: conditional_optimum` с `conditional_optimum_ref`
    на run_id выше и `conditional_run_ref` на соответствующие прогоны компаний (из карты). **Базовые веса для дельт**: просим задать
    стратегии в двух слоях или выбрать один и обосновать: (а) от текущих весов 18.09.2026 (как есть сейчас); (б) от оптимума отбора
    C2 (портфель после отбора). Наша рекомендация — (б) как содержательная стратегия фазы, с явной оговоркой в стратегии, что до
    завершения отбора действует общий сигнал «перекладка в оптимум отбора», а не фазовый.
2.2 **Ограничители исполнения (решение владельца 01.10, owner_judgment)**: `turnover_cap_nav` = 0.15 NAV на один сигнал; транши — 3,
    по торговым дням; `no_buy_first_trading_days` = 5 (перенос правила из legacy taiwan.yaml); `candidate_policy: signal_only` (стадия
    candidate — только уведомление, без подготовительных действий). Правило §5 (deadband 0.005, округление к нулю 0.0025,
    сокращения раньше докупок при дефиците кэша, остаток в следующие транши) — применить к дельтам из п. 2.1.
2.3 **risk_budget_under_scenario** before/after — derived_fact из прогонов: before = текущие веса под фазой, after = условный оптимум
    (оба числа есть в записях `conditional_optima_runs/*.json`: `current_portfolio.return_distribution_Y5` и `portfolio_downside.Y5`).
2.4 **exit_rule** по фазам: предложите режимы из enum (`review_only` / `rerun_conditional_optimum` / `hold_until_owner_review` /
    `owner_defined_reversal`) с обоснованием; для RECOVERY и NORMALIZATION_OR_FROZEN условные оптимумы уже посчитаны — можно
    ссылаться на них как на «целевую картину после выхода» без автоматического разворота (Action Layer §7).
2.5 **status** всех стратегий — `draft` (owner_approved ставит владелец после чтения); `staleness.review_required: false`,
    `last_checked_at` = дата подготовки, `max_abs_target_diff: 0.0`.
2.6 **Patch v1.1.1** трёх калибровок сценариев со `strategy_ref` (по вашему patch-plan), без изменения численной семантики; `as_of` /
    `supersedes` по действующему правилу.
2.7 **GLD**: в стратегиях — только `owner_rule` / `review` до 10 % NAV (ACT-019), `hedge_model_missing` в risk budget, если GLD
    упоминается. Заказ Hedge_Instrument_Model для GLD владелец пока не делает (GLD остаётся фиксированной позицией 2.2 %).

## 3. Критерии приёмки
Три файла стратегий проходят Scenario_Strategy_Schema v1.0 и ACT-001…020 (мы реализуем ACT-правила в валидаторе при приёмке и
прогоним); все числа с происхождением; `conditional_optimum_ref` / `conditional_run_ref` ссылаются на run_id из вложения; дельты
воспроизводимы по §5 из весов оптимума и базовых весов (укажите базу явно); patch v1.1.1 — check_supersedes без пропаж. Термины
прежние: для поля provenance — «происхождение».

=== КОНЕЦ ===
