# Portfolio Optimizer — Specification v1.1

Дата: 2026-10-03  
Статус: proposed normative  
Связанные слои: `_portfolio.yaml` v1.1, MPC v1.0, Portfolio Stability Test v1.0.

## 1. Принцип

Оптимизатор не отвечает на вопрос «какие компании хорошие».

Он отвечает:

> Какие допустимые веса дают наилучшее распределение результата портфеля при утверждённых ограничениях?

Нормативно используется **constrained multi-objective** без единого ручного score.

## 2. Objective

Основная целевая функция:

`maximize median_portfolio_CAGR_5Y`

при выполнении hard constraints.

Вторичные цели применяются лексикографически, а не через произвольную сумму баллов:

1. максимальный median CAGR 5Y;
2. среди решений в пределах `objective_tolerance` от максимума — лучший ES5%;
3. затем меньшая Scenario Concentration;
4. затем меньший turnover от фактического портфеля.

`objective_tolerance = 0.50 percentage point CAGR` — model assumption, pending owner approval.

Это предотвращает бессмысленную торговлю ради очень небольшого расчётного улучшения CAGR.

## 3. Рекомендуемые portfolio constraints v1.0

Все значения ниже — `model_assumption`, `status: pending_owner_approval`.

### 3.1 Concentration

- single-name hard max: **20% NAV**;
- sector hard max: **30% NAV**;
- top-3 aggregate max: **50% NAV**;
- one common-cause effective exposure max: **35% NAV**;
- unmodeled/unverified target allocation: **0%**.

Текущий фактический портфель может нарушать эти лимиты; нарушение не означает автоматическую продажу. Оно создаёт `constraint_gap` между current и target.

### 3.2 Role limits

До финального Core/Challenger decision MPC тестирует весь диапазон 0–20%.

После классификации:
- Core max: 20%;
- Challenger max на одну бумагу: 8%;
- aggregate Challenger max: 25%;
- Watch target weight: 0%.

### 3.3 Liquidity / dry powder

- minimum dry powder: 5%;
- preferred band: 5–10%;
- hard maximum dry powder в обычном режиме: 15%;
- Stress допускает до 20%;
- Shock допускает до 30%.

Dry powder = cash / T-bills / money-market instruments, как уже определено в `_portfolio.yaml`.

### 3.4 Illiquidity

- illiquid/restricted aggregate max: 10%;
- одна illiquid позиция max: 5%.

Публичная акция не считается illiquid автоматически; используется отдельный implementation/liquidity classifier.

## 4. Risk constraints

Рекомендуемые v1.0 limits, все `pending_owner_approval`:

- `P(portfolio loss >30%, 5Y) <= 20%`;
- `P(portfolio loss >50%, 5Y) <= 10%`;
- `ES5_5Y >= -55%`;
- `ScenarioConcentration`: warning при `>=60%`; hard max `<=70%` (owner_judgment, DR-2026-10-02-01/В2).

Если для текущего universe нет feasible solution, движок не ослабляет лимиты молча. Он возвращает `infeasible` и минимальный набор конфликтующих constraints.

## 5. Correlation and common-cause constraints

Историческая price correlation не является достаточным ограничением.

Optimizer использует:
- market-return correlation;
- scenario-return correlation;
- driver overlap;
- failure-mode common causes.

`effective_common_cause_weight` считается как сумма target weights компаний с material exposure к common cause, с severity factor:

- critical = 1.0;
- high = 0.75;
- medium = 0.50;
- low = 0.25.

Hard max 35% применяется к severity-weighted exposure.

## 6. MPC test range

До присвоения роли:

`portfolio_optimizer_allowed_range = [0%, 20%]`

с grid step **1 percentage point**.

Дополнительно движок обязан проверить:
- фактический текущий вес;
- локальные точки ±0.5 п.п. вокруг central optimum;
- все constraint boundaries.

Таким образом MPC не получает prior weight как anchor.

## 7. Portfolio return engine

Portfolio outcome рассчитывается не как сумма median отдельных компаний.

В каждом совместном MC path:

`PortfolioValue_h = Σ(w_i × RelativeValue_i,h) + DryPowderValue_h + HedgeValue_h`

Корреляции задаются через общий Scenario/latent-factor layer.

Оптимизация по standalone medians запрещена.

## 8. Исполнение и два брокерских счёта

Оптимизация состоит из двух стадий.

### Stage A — continuous target weights

Получаем экономически оптимальные consolidated weights без привязки к счёту.

### Stage B — execution projection

Target weights переводятся в количества по двум счетам с учётом:
- доступного инструмента;
- валюты;
- market lot;
- fractional-share availability;
- transaction costs;
- существующего количества;
- денежных остатков на каждом счёте;
- запрета short, если отдельно не разрешён.

Execution allocator минимизирует:

`tracking_error_to_target + transaction_cost_penalty + account_constraint_penalty`

и не меняет экономический optimizer objective.

## 9. Лоты

Для каждой бумаги:

`quantity = k × lot_size`

если брокер/биржа требует lot size.

Если fractional shares доступны, `lot_size` может быть меньше 1 согласно broker capability.

Нельзя использовать прежний вес как способ обойти lot constraint.

## 10. Опционный хедж

Опционный hedge — overlay, а не причина держать 100 акций.

Для стандартного equity option contract:

`hedgeable_shares = floor(position_shares / 100) × 100`

Остаток может оставаться незащищённым либо хеджироваться другим инструментом.

Optimizer не округляет базовую позицию до 100 акций только ради опционов.

Если владелец задаёт обязательный hedge coverage, execution layer проверяет его feasibility отдельно.

## 11. Current portfolio ≠ target portfolio

Фактические веса используются для:
- turnover;
- налогов/издержек, если данные доступны;
- implementation feasibility.

Они не являются lower bound или target anchor.

`initial_portfolio_hypothesis` вообще не входит в optimization input. Сравнение с ней выполняется только ex-post.

## 12. Output

Optimizer возвращает:
- central target weights;
- feasible weight band каждого актива;
- dry powder;
- portfolio median CAGR 3/5/8Y;
- ES5%, loss probabilities, drawdown;
- sector/driver/common-cause concentrations;
- binding constraints;
- constraint gaps versus current portfolio;
- execution projection по двум счетам;
- ex-post prior comparison;
- stability-test reference;
- `decision: none`.

## 13. Infeasibility

Если hard constraints несовместимы:

1. результат `infeasible`;
2. список конфликтующих constraints;
3. minimum relaxation needed по каждому;
4. никаких автоматически ослабленных ограничений.

Решение об изменении лимитов остаётся за владельцем.


## 14. Scenario-conditional risk constraints — v1.1

Для каждой оцениваемой точки `w`:

`B_s(w) = p_s × max(0, ES5_BASE(w) - ES5_s(w))`.

Eligible set:

`S_cond(w) = {s != BASE | probability_status=owner_judgment AND p_s >= 0.10 AND B_s(w) > 0}`.

Для каждого `s ∈ S_cond(w)`:

- `ES5_5Y(w | s) >= -40%`;
- `P(loss>30%)_5Y(w | s) <= 25%`.

Числа — `owner_judgment`, DR-2026-09-27-01.

Scenario-specific metrics считаются на common `path_id` и conditional scenario picture с `probability=1`. Owner mixture probabilities не переписываются.

Если BASE paths технически недоступны для candidate point и `B_s(w)` нельзя вычислить, используется консервативный fallback: gates проверяются для всех non-BASE scenarios с `p_s >=0.10`; output обязан поставить `conservative_eligibility_fallback=true`.

### 14.1 ScenarioConcentration v1.1

Формула burden остаётся Scenario Engine v1.1 §7.

В concentration входят **все** non-BASE scenarios с известной owner probability, включая `p_s <0.10`.

- warning: `>=60%`;
- hard max: `<=70%`;
- hard limit применяется только если минимум два non-BASE scenarios имеют `B_s(w)>0`;
- иначе raw value остаётся diagnostic.

ScenarioConcentration остаётся tie-break после ES5 среди otherwise-equivalent feasible portfolios.

## 15. Cardinality и минимальный вес позиции

Решение владельца 03.10.2026:

- counted equity positions: **6…8**;
- counted equity либо `0`, либо `>=3% NAV`;
- cash, GLD и UFO исключены из cardinality count.

Определение:

`I_i = 1`, если security входит в counted equity universe и `w_i > 0`, иначе `0`.

`positions_count = Σ I_i`.

Hard structural constraints:

`positions_min <= positions_count <= positions_max`

и для каждой counted equity:

`w_i = 0 OR w_i >= min_position_weight`.

V1:
- `positions_min = 6`;
- `positions_max = 8`;
- `min_position_weight = 0.03`.

Cardinality/min-weight применяются раньше risk gates и objectives и не отменяют single-name/sector/top-3/common-cause/role caps.

Fixed ETF и cash не могут искусственно выполнять `positions_min`.

### 15.1 Диагностические варианты

Один selection cycle обязан показывать рядом:

1. `CARDINALITY_6`: `positions_min=6`, `positions_max=6`;
2. `CARDINALITY_8`: `positions_min=6`, `positions_max=8`;
3. `NO_CARDINALITY_LIMIT`: `positions_min=null`, `positions_max=null`.

`min_position_weight=3%` сохраняется во всех трёх вариантах, чтобы измерять именно цену ограничения числа бумаг.

Сравнение выполняется на одинаковых universe, paths и остальных constraints.

Constraint price против `NO_CARDINALITY_LIMIT`:

- `MedianCost_pp = MedianCAGR_variant - MedianCAGR_unlimited`;
- `ES5Cost_pp = ES5_variant - ES5_unlimited`;
- дополнительно positions_count, turnover и binding constraints.

Отрицательный `MedianCost_pp` = потеря median CAGR. Положительный `ES5Cost_pp` = улучшение ES5.

## 16. Theme Look-through owner constraint

Optimizer принимает `Theme_Portfolio_Policy_v1.0.yaml`.

Для `AI_THEME_NOT_INCREASE_V1`:

`T_AI_TOTAL(w) = Σ_i w_i × revenue_share_i,AI_TOTAL`.

После материализации baseline:

`T_AI_TOTAL(target) <= T_AI_TOTAL(2026-09-21) + tolerance`.

Это owner structural constraint.

Покупка отдельной AI-linked бумаги разрешена, если aggregate theme не растёт.

Hard enforcement разрешён только когда:
- ThemeExposure существует для каждой counted equity;
- отсутствующее segment disclosure представлено explicit 100% primary-theme fallback;
- baseline numeric status = `MATERIALIZED`.

MPC driver score запрещено использовать как substitute для theme share.

## 17. Feasibility order v1.1

1. portfolio accounting / allowed instruments / fixed positions;
2. owner structural constraints:
   - cardinality / min position;
   - theme policy;
   - single-name / sector / top-3;
   - common-cause;
   - roles/challenger;
   - dry powder;
   - liquidity/hedge limits;
3. BASE 5Y risk constraints;
4. scenario-conditional ES5/P30 gates;
5. ScenarioConcentration hard gate, если applicable;
6. lexicographic objectives §2.

Hard constraints не ослабляются молча.

## 18. Probability and policy changes

Любое owner probability change запускает новый optimizer run.

Crossing `p_min=0.10` может изменить eligible scenario set. Поскольку `B_s(w)>0` зависит от candidate point, eligibility вычисляется на каждой point.

Изменение cardinality, min_position_weight, theme baseline/policy, scenario thresholds или concentration thresholds меняет optimizer run contract, но само по себе не меняет company calibrations.

Stored conditional optima/strategies получают staleness review по Scenario Action Layer и не переписываются автоматически.

## 19. Output additions v1.1

Дополнительно к §12:

- `contract_version`;
- `positions_count`;
- `cardinality_variant`;
- `min_position_weight`;
- `theme_lookthrough`;
- `theme_constraint_status`;
- `scenario_conditional_gates`;
- `gated_at_optimum`;
- `scenario_concentration_warning`;
- `scenario_concentration_hard_status`;
- `constraint_price_vs_no_cardinality_limit`;
- `minimum_relaxations`.

`decision: none` сохраняется.
