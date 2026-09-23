# Conviction Overlay — Specification v1.0

Дата: 2026-09-21  
Статус: proposed normative / additive  
Базовый слой: Portfolio Optimizer v1.0

Conviction Overlay не меняет objective Portfolio Optimizer и не создаёт сделки. Он разделяет лимит нового вложенного капитала и концентрацию по рыночной стоимости, заменяет единый single-name cap на per-asset loss-budget cap, допускает ограниченный owner conviction override, вводит Team & Execution и журналирует counterfactual. `Trigger != Decision` сохраняется.

## 1. Invested Capital Limit и Market Value Limit

### 1.1 Invested Capital Limit

`invested_capital_share_i = consolidated_open_cost_basis_i / portfolio_risk_capital_basis`

`portfolio_risk_capital_basis = Σ open_cost_basis_i + cash_and_cash_equivalents`

Предлагаемые параметры v1.0 — `model_assumption`, `pending_owner_approval`:

- standard per-name invested-capital limit: 12%;
- conviction per-name invested-capital limit: 20%;
- sector invested-capital limit: 30%.

Лимит управляет только новыми покупками/докупками. Legacy position не продаётся из-за старого превышения basis-limit, но новая покупка не должна увеличивать `invested_capital_gap`, кроме разрешённого conviction override.

### 1.2 Cost basis по двум счетам

Basis ведётся на уровне lot: account, ticker, acquisition date, quantity, local price, fees, currency, trade-date FX, base-currency basis, source type, legacy flag.

`cost_basis_base = (quantity × acquisition_price_local + fees_local) × fx_to_base_at_acquisition`

Перевод между счетами не является новой инвестицией и сохраняет исходный basis. Cash dividend не увеличивает basis бумаги, пока остаётся cash. Dividend reinvestment создаёт новый lot и считается новым вложенным капиталом. Split/stock dividend не являются новым вложением; basis перераспределяется. Spin-off требует broker/issuer allocation, иначе `pending_verification`.

На `system_inception_date` все существующие lots получают `legacy_at_system_start: true`. Если legacy basis уже выше лимита, `incremental_buy_capacity = 0` до роста denominator, изменения лимита или допустимого conviction override.

### 1.3 Рыночная концентрация

Для бумаги хранятся два уровня:

1. `target_market_cap_i` — лимит Optimizer/новых покупок;
2. `hard_loss_budget_cap_i` — граница максимального заранее принятого ущерба NAV.

Если `target_market_cap_i < actual_market_weight_i <= hard_loss_budget_cap_i`, создаётся `soft concentration_gap`: продажа не требуется, новые покупки блокируются, включается enhanced monitoring.

Если `actual_market_weight_i > hard_loss_budget_cap_i`, создаётся `hard_loss_budget_breach` и Decision Request на снижение риска. Автоматической сделки нет.

## 2. Индивидуальный cap из loss budget

### 2.1 Plausible drawdown

Основная формула:

`plausible_drawdown_i = max(abs(ES5_terminal_return_5Y), abs(Q25_max_drawdown_5Y))`

Если max-drawdown model недоступна:

`plausible_drawdown_i = abs(ES5_terminal_return_5Y)`

Bounds — `model_assumption`: 25–90%.

Fallback до первого нормативного MC:

- `mature_positive_margin`: 55%;
- `capital_intensive_transition`: 75%;
- `pre_service_or_milestone_driven`: 85%.

После первого standalone MC fallback запрещён.

### 2.2 Hard cap

`raw_hard_cap_i = L_max / plausible_drawdown_i`

`hard_loss_budget_cap_i = clamp(raw_hard_cap_i, min_cap, max_cap)`

Предлагаемые параметры — `pending_owner_approval`:

Standard: `L_max_standard = 8% NAV`, min cap 5%, max cap 30%.

Conviction: `L_max_conviction = 15% NAV`, min cap 5%, max cap 45%.

### 2.3 Buffer для Optimizer

Чтобы победитель мог вырасти выше target без немедленного hard breach:

`target_market_cap_i = safety_buffer × hard_loss_budget_cap_i`

Предлагаемый `safety_buffer = 0.75`, `model_assumption`.

Optimizer получает `single_name_max_i = target_market_cap_i` вместо константы 20%.

Пример: plausible drawdown 60%, standard Lmax 8% → hard cap 13.3%, target cap 10.0%. Рост с 10% до 12% блокирует новые покупки, но не создаёт sell-request. Выше 13.3% возникает hard loss-budget breach.

## 3. Секторные лимиты

Предлагаемые параметры — `pending_owner_approval`:

- sector invested-capital limit 30%;
- sector market soft limit 35%;
- sector market hard limit 45%.

Conviction бумаги не ослабляет sector/common-cause limits автоматически. Выше soft — блок новых покупок сектора и monitoring; выше hard — Decision Request.

## 4. Conviction Tag

Conviction — owner override только single-name loss budget/cap. Он не повышает expected return, не меняет Company MC, не является target weight и не отменяет sector/common-cause constraints.

Рекомендуемый максимум активных conviction tags: 3 (`model_assumption`, `pending_owner_approval`).

Для активации обязательны: все material axes verified; нет material `pending_verification`; negative transitions и X-triggers заведены и active; daily news/event watch active; standalone MC либо явно temporary fallback; owner journal entry создана до override; записаны дата, цена, market/cost-basis weights, rationale, Lmax и caps; active count не превышает лимит.

Статусы: `active`, `suspended`, `revoked`, `expired`, `under_review`.

`active → suspended` автоматически при: confirmed downward E2/E3 transition; двух подряд reporting periods ухудшения Critical KPI; hard loss-budget breach; более двух пропущенных daily-watch runs; неполном покрытии critical negative triggers; material axis становится pending verification.

`active → revoked` при X-trigger либо E3 transition с `thesis_break=true`.

Conviction не возвращается автоматически: требуется новая owner entry с новым state snapshot, rationale, risk budget и counterfactual.

## 5. State-based rebalancing

Само `market_weight > target_market_cap` не является sell trigger. Оно создаёт `soft concentration_gap`, блокирует новые покупки и усиливает мониторинг.

Decision Request на ребалансировку возникает при confirmed material axis downshift, двух подряд периодах ухудшения Critical KPI, X-trigger или suspended/revoked conviction.

Hard exception:

`actual_weight_i × plausible_drawdown_i > L_max_active`

→ `MANDATORY_RISK_REDUCTION_REVIEW`.

Расчётный вес для восстановления бюджета:

`weight_to_restore_budget = L_max_active / plausible_drawdown_i`

Это обязательный review/Decision Request, не автоматическая сделка.

## 6. Team & Execution Axis

Проверяемая execution-history и непроверяемый остаток owner trust разделяются.

Team state влияет только на `company_idiosyncratic_execution_sigma`, а не на median growth или terminal multiple.

`execution_sigma_multiplier = clamp(verified_multiplier(T) × owner_judgment_multiplier, 0.80, 1.20)`

Verified multipliers (`model_assumption`): T0 1.10, T1 1.05, T2 1.00, T3 0.95, T4 0.90.

`owner_judgment_multiplier` допустим 0.90–1.10, provenance=`owner_judgment`, срок действия максимум 12 месяцев. Таким образом совокупный effect ограничен ±20%.

## 7. Проспективный Conviction Journal

Каждый override регистрируется до результата: decision_id, ticker, дата/цена, NAV, market/cost-basis weight, base optimizer cap/weight, conviction cap, verified state, Critical KPI, active negative/X triggers, MC version, owner rationale, falsifiable claims, `what_would_change_my_mind`, counterfactual optimizer run и review date +12 месяцев.

Counterfactual замораживается на момент решения и не пересчитывается задним числом.

Через 12 месяцев считаются: total return, max drawdown, NAV contribution, loss-budget breach count/days, state downgrades, KPI deterioration, фактический вклад override, вклад frozen counterfactual, paired difference, return vs non-conviction portfolio и sector benchmark.

## 8. Skill vs luck

Один winner не считается доказательством навыка.

`insufficient_evidence`: <8 завершённых 12m episodes. Параметры не меняются.

`provisional_signal`: ≥8 episodes, ≥3 companies, ≥24 months coverage, median paired excess >0, ≥60% episodes outperform counterfactual. Автоматического повышения параметров нет.

`supported_repeatability`: ≥15 episodes, ≥3 companies, ≥36 months coverage, median paired excess >0, ≥60% outperform, 90% bootstrap CI mean paired excess полностью >0, hard-loss-budget breach rate ≤10%.

`not_supported`: при ≥15 episodes 90% bootstrap CI полностью <0 либо breach rate >20%.

Иначе `inconclusive`.

Даже `supported_repeatability` не меняет параметры автоматически. Annual Review может предложить изменение `L_max_conviction` максимум ±1 п.п. NAV за review и `max_active_conviction_tags` максимум ±1. Owner утверждает изменение.

## 9. Взаимодействие с MPC/Optimizer

MPC считается без conviction bias.

Central optimizer использует standard `single_name_max_i`. Conviction run повторяет тот же optimizer и меняет только `single_name_max_i` конкретной бумаги на conviction target cap; остальные constraints неизменны.

Обязателен `optimizer_without_conviction_override` как counterfactual.

## 10. Output

```yaml
conviction_overlay_output:
  ticker:
  invested_capital:
    actual_share:
    limit:
    gap:
    incremental_buy_capacity:
  market_value:
    actual_weight:
    target_cap:
    hard_loss_budget_cap:
    concentration_gap:
  conviction:
    status:
    l_max_active:
    qualification_pass:
    suspension_reasons: []
  team_execution:
    state:
    verified_sigma_multiplier:
    owner_judgment_multiplier:
    combined_sigma_multiplier:
  actions:
    block_new_buys:
    decision_request:
    decision: none
```
