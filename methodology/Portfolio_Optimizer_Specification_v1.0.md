# Portfolio Optimizer — Specification v1.0

Дата: 2026-09-21  
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
- `ScenarioConcentration <= 60%` — warning выше 50%, hard limit 60%.

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
