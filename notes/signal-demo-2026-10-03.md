# Демонстрация сигнала слоя действий — 2026-10-03 (scenario_state 1.0.0, run 20261003T161453Z-scenario_state-415bf2)

ВНИМАНИЕ: событие синтетическое (демонстрация формата), state.json не изменялся (apply=false).

Переходы: [('TAIWAN_SEIZURE', 'BLOCKADE', 'not_observed', 'confirmed'), (None, None, 'set:BASE/normal', 'set:TAIWAN_SEIZURE/normal')]

Набор: {'classification': 'TAIWAN_SEIZURE', 'status': 'normal', 'last_probability_review_at': '2026-09-27T00:00:00Z'}

## Сигнал (confirmed, TAIWAN_SEIZURE / BLOCKADE)

```
AG: invest
СЦЕНАРИЙ: TAIWAN_SEIZURE
ФАЗА: BLOCKADE — CONFIRMED 2026-10-03T09:00:00Z

ПОДТВЕРЖДАЮЩИЕ ФАКТЫ:
- EV-TW-FULL-BLOCKADE / TW-F02: критерии EVTWBLK-C01
  Источник: СИНТЕТИЧЕСКИЙ ПРИМЕР — не факт; демонстрация формата сигнала
  Дата: 2026-10-03T08:00:00Z
  Проверка: verified / verify-SCEN-DEMO-2026-10-03

УСЛОВНАЯ КАРТИНА ПОРТФЕЛЯ:
Run: portfolio/_runs/_conditional_runs_partB.json#TAIWAN_SEIZURE|BLOCKADE
Median CAGR 5Y: +11.7%
P(loss>30%) 5Y: +3.0%
ES5 5Y: -34.1%
Условный оптимум: 20260930T230630Z-portfolio_optimizer-052179 (медиана +13.3%, ES5 +8.2%)

СТРАТЕГИЯ: portfolio/_scenarios/strategies/TAIWAN_SEIZURE_strategy_v1.0.yaml
Статус: draft
Проверка актуальности: D_inf=0.0; review_required=false

ДЕЙСТВИЯ ИЗ СТРАТЕГИИ (ДОСЛОВНО):
1. TAIWAN_SEIZURE-BLOCKADE-01-REDUCE-NBIS: reduce ticker:NBIS delta_weight_nav=-0.06; timing=start_after_trading_days 0, tranches 3, interval 1, no_buy_first_trading_days 5; preconditions=['LIVE_OPTIMUM_CURRENT']
2. TAIWAN_SEIZURE-BLOCKADE-02-CASH_TARGET-CASH: cash_target cash:CASH delta_weight_nav=0.02; timing=start_after_trading_days 0, tranches 3, interval 1, no_buy_first_trading_days 5; preconditions=['LIVE_OPTIMUM_CURRENT']
3. TAIWAN_SEIZURE-BLOCKADE-03-ADD-ASTS: add ticker:ASTS delta_weight_nav=0.025; timing=start_after_trading_days 5, tranches 3, interval 1, no_buy_first_trading_days 5; preconditions=['LIVE_OPTIMUM_CURRENT']
4. TAIWAN_SEIZURE-BLOCKADE-04-ADD-LLY: add ticker:LLY delta_weight_nav=0.005; timing=start_after_trading_days 5, tranches 3, interval 1, no_buy_first_trading_days 5; preconditions=['LIVE_OPTIMUM_CURRENT']
5. TAIWAN_SEIZURE-BLOCKADE-05-ADD-META: add ticker:META delta_weight_nav=0.005; timing=start_after_trading_days 5, tranches 3, interval 1, no_buy_first_trading_days 5; preconditions=['LIVE_OPTIMUM_CURRENT']
6. TAIWAN_SEIZURE-BLOCKADE-06-ADD-MSFT: add ticker:MSFT delta_weight_nav=0.005; timing=start_after_trading_days 5, tranches 3, interval 1, no_buy_first_trading_days 5; preconditions=['LIVE_OPTIMUM_CURRENT']

ПЕРЕСМОТР ВЕРОЯТНОСТЕЙ:
Последний review: 2026-09-27T00:00:00Z
Новые defining events после review: EV-TW-FULL-BLOCKADE
probability_review_due: true

Решение за владельцем. Автоисполнение запрещено.
```
