# Agent Scenario Signal Contract v1.0

Дата: 2026-09-30. Партия 10, часть A.

## Confirmed phase — strategy exists

```text
AG: invest
СЦЕНАРИЙ: <scenario_id>
ФАЗА: <phase_id> — CONFIRMED <confirmed_at>

ПОДТВЕРЖДАЮЩИЕ ФАКТЫ:
- <event_id> / <fact_id>: <краткий факт>
  Источник: <source_ref>
  Дата: <observed_at>
  Проверка: verified / <verification_run_id>

УСЛОВНАЯ КАРТИНА ПОРТФЕЛЯ:
Run: <conditional_run_ref>
Median CAGR 5Y: <...>
P(loss>30%) 5Y: <...>
ES5 5Y: <...>
Условный оптимум: <conditional_optimum_ref>

СТРАТЕГИЯ: <strategy_ref>
Статус: <owner_approved|active|...>
Проверка актуальности: D_inf=<...>; review_required=<true|false>

ДЕЙСТВИЯ ИЗ СТРАТЕГИИ (ДОСЛОВНО):
1. <action_id>: <action_type> <target> <magnitude>; timing=<...>; preconditions=<...>
...

ПЕРЕСМОТР ВЕРОЯТНОСТЕЙ:
Последний review: <date>
Новые defining events после review: <...>
probability_review_due: <true|false>

Решение за владельцем. Автоисполнение запрещено.
```

Агент не перефразирует magnitude, timing или preconditions так, чтобы смысл действия изменился.

## Confirmed phase — strategy_ref is null

```text
AG: invest
СЦЕНАРИЙ: <scenario_id>
ФАЗА: <phase_id> — CONFIRMED <confirmed_at>
ПОДТВЕРЖДАЮЩИЕ ФАКТЫ: ...
УСЛОВНАЯ КАРТИНА ПОРТФЕЛЯ: ...
СТРАТЕГИЯ: отсутствует (strategy_ref = null). Торговые действия не сформированы.
Решение за владельцем. Автоисполнение запрещено.
```

## candidate

Candidate-signal содержит только evidence, недостающие criteria и при необходимости подготовительный `review`. Торговые действия не выдаются.

## ambiguous_set_conflict

Первой строкой после заголовка:

`СТАТУС НАБОРА: AMBIGUOUS_SET_CONFLICT — автоматическая активация всех стратегий заблокирована.`

Далее перечисляются конфликтующие events/scenarios и отдельные conditional pictures. Решение за владельцем.
