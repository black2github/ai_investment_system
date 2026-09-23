# MC Calibration Archetypes — Specification v1.0

Дата: 2026-09-21  
Статус: proposed normative  
Область: Conditional Monte Carlo calibration layer  
Принцип: **MC внутри сценарного состояния; факты ≠ предпосылки; valuation ≠ forecast.**

## 1. Назначение

Архетип определяет форму калибровки Conditional Monte Carlo, но не задаёт одинаковые числа всем компаниям.

Общий pipeline:

`Verified Facts → State Vector → Archetype Calibration → Conditional MC → Standalone Distribution → MPC → Optimizer → Stability Test`

Архетип не является инвестиционной оценкой и не меняет state сам по себе.

## 2. Общая схема калибровки

Обязательны для всех классов:

- `ticker`, `as_of`, `archetype`, версии state/model;
- `source_facts` — только проверенные факты с источником и датой;
- `scenario_state` — текущий вектор состояний;
- `revenue_model.segments` — сегменты выручки; каждый сегмент имеет базу, распределение роста и state driver;
- `dependencies` — latent factors + неполные rank correlations;
- `simulation` — horizons 3/5/8Y, timestep, paths, seed;
- `valuation` — способ преобразования операционного исхода в equity value на каждом горизонте;
- `outputs` — median CAGR, P(2x), P(5x), downside, ES5%, max drawdown, scenario metrics;
- `validation` — source completeness, PSD correlation matrix, convergence, no-NaN, constraints;
- все прогнозные числа должны иметь `provenance: model_assumption`, если они не являются фактом.

### 2.1 Запрет общей rank-переменной

Один ранг не может одновременно определять:
- начальный рост;
- долгосрочный рост;
- все margin nodes;
- Y3/Y5/Y8 valuation multiple.

Вместо этого:

`Parameter = loading × CommonLatentFactor + sqrt(1-loading²) × IdiosyncraticShock`

Шоки по горизонтам и узлам коррелированы, но не идентичны.

## 3. Архетип A — mature_positive_margin

### 3.1 Когда применяется

Компания уже имеет положительную, экономически осмысленную operating/FCF margin, а основной вопрос — темп роста и нормализация зрелой маржи.

### 3.2 Margin path

Y0 — фактическая текущая нормализованная маржа и **является допустимым anchor**.

Нормативная форма:

`m_t = m_terminal + (m_0 - m_terminal) × 2^(-t / half_life) + epsilon_t`

где `epsilon_t` — коррелированный ограниченный shock.

Обязательны:
- `current_margin`;
- `terminal_margin_Y5` distribution;
- `terminal_margin_Y8` distribution либо rule;
- `margin_half_life_years`;
- lower/upper bounds;
- shock sigma и persistence.

Y1/Y3/Y5/Y8 могут сохраняться движком как диагностические узлы, но Y1/Y3 не обязаны задаваться вручную.

### 3.3 Revenue

Для каждого сегмента обязательны:
- `base_revenue`;
- `initial_growth_distribution`;
- `long_run_growth_Y8_distribution`;
- `growth_half_life`;
- state driver;
- latent-factor loadings.

### 3.4 Valuation

По умолчанию:
- Y3: FCF multiple, если FCF устойчиво положительный;
- Y5: FCF multiple;
- Y8: FCF multiple с дополнительным maturity compression.

Допускаются `NetIncome`, `EBIT`, `AdjustedEBITDA` или `Revenue` только с `valuation_metric_rationale`.

Если FCF плохо интерпретируется из-за финансовой бизнес-модели, стандартный FCF multiple не обязателен.

## 4. Архетип B — capital_intensive_transition

### 4.1 Когда применяется

Текущий FCF сильно искажён крупным инвестиционным циклом, поэтому Y0 нельзя механически интерполировать к terminal margin.

### 4.2 Margin path

Y0 — факт, **не anchor гладкой интерполяции**.

Обязательна одна из двух форм:

`direct_fcf_nodes`
- Y1;
- Y2;
- Y3;
- Y4 как доля/функция Y5;
- Y5 terminal margin;
- Y8 terminal margin/rule.

или предпочтительная при наличии данных:

`ocf_capex_decomposition`
- operating cash-flow margin path;
- capex/revenue path;
- `FCF margin = OCF margin - capex/revenue`.

Каждый transition node имеет distribution, а не одно число.

Для direct-node режима:
- `Y1`, `Y2`, `Y3`: triangular/PERT distributions;
- `Y4_terminal_fraction`: distribution;
- `Y5_terminal_margin`: distribution;
- monotonicity/causal constraints явно задаются.

### 4.3 Revenue

Как в mature archetype, но разрешены capacity-linked growth drivers:
- compute/power capacity;
- contracted demand/backlog;
- utilization;
- commissioning milestones.

### 4.4 Valuation

- Y3: `revenue_bridge` допустим, если FCF находится около нуля/отрицателен; output помечается `bridge_dependent: true`;
- Y5/Y8: FCF multiple после предполагаемой нормализации;
- если Y5 FCF всё ещё отрицателен в пути, применяется заранее заданный fallback valuation rule, а не отрицательный FCF multiple.

## 5. Архетип C — pre_service_or_milestone_driven

### 5.1 Когда применяется

Основная будущая экономика зависит от дискретных технологических/регуляторных/коммерческих milestones, а текущая прибыльность не отражает будущую модель.

### 5.2 State/Milestone layer

Обязательны:
- `milestones`;
- probability/conditional probability для каждого milestone;
- зависимости между milestones;
- сроки/окна;
- state transition mapping;
- failure/partial-success branches.

Пример:

`launch success → regulatory/commercial readiness → service onset → utilization → margin scale`

Вероятности должны быть калибровочными model assumptions либо выводиться из утверждённого Scenario Engine; LLM не генерирует их во время расчёта.

### 5.3 Margin path

Не требуется искусственная FCF-margin curve до возникновения экономически значимой выручки.

Обязательны:
- cash-burn / capex trajectory до service onset;
- service gross/operating/FCF margin distribution после monetization milestone;
- terminal margin distribution только для путей, где коммерциализация состоялась.

### 5.4 Valuation

Piecewise valuation:

- pre-service / milestone not reached: cash-adjusted residual / revenue bridge / milestone-conditioned EV;
- service validated but FCF immature: revenue or EBITDA multiple;
- scaled monetization: FCF multiple.

Каждый путь обязан сохранять `valuation_basis` и `milestone_state`.

## 6. Обязательные distribution types

v1.0 разрешает:
- triangular;
- PERT/beta-PERT;
- truncated normal;
- lognormal;
- categorical/discrete;
- deterministic formula.

Использование distribution должно иметь:
- параметры;
- bounds;
- provenance;
- causal rationale.

## 7. Terminal multiple

Multiple не выбирается из текущей цены.

Обязательные источники калибровки:
1. экономическая зрелость и state;
2. исторический диапазон самой компании, если релевантен;
3. peer/reference range, если экономически сопоставим;
4. reverse valuation как **diagnostic**, но не как центр MC.

Multiple Y3/Y5/Y8 не используют один rank. Разрешён общий valuation latent factor с неполными horizon-specific shocks.

## 8. Компания → архетип

| Компания | Архетип | Модификация |
|---|---|---|
| SPCX | capital_intensive_transition | direct FCF nodes v1.0; AI/Starlink/Space segments; Y3 bridge-dependent |
| NBIS | capital_intensive_transition | предпочтительно OCF-capex decomposition; AI cloud capacity/backlog |
| CRWV | capital_intensive_transition | leverage + contracted-power + customer-concentration overlay |
| NVDA | mature_positive_margin | high-growth semiconductor; supply-cycle and China overlay |
| HOOD | mature_positive_margin | financial-platform modifier; terminal metric may be Net Income/EBITDA rather than standard FCF |
| LLY | mature_positive_margin | pharma pipeline/pricing/manufacturing overlay |
| META | mature_positive_margin | high-capex overlay; ad monetization + AI capex |
| ASML | mature_positive_margin | cyclical-WFE normalization; EUV/China/customer-capex overlay |
| MSFT | mature_positive_margin | high-capex cloud overlay; Azure/M365 |
| NET | mature_positive_margin | low-current-FCF modifier; Y3 revenue bridge allowed if FCF multiple unstable |
| PLTR | mature_positive_margin | high-growth/high-margin software; government/commercial split |
| ETN | mature_positive_margin | industrial-cycle normalization; electrification/backlog |
| RKLB | pre_service_or_milestone_driven | existing Electron/Space Systems core + Neutron milestone overlay |
| ASTS | pre_service_or_milestone_driven | pre-SpaceMobile-service; deployment/regulatory/service-onset milestones |

## 9. Общий output contract

Каждый calibration run выдаёт:
- operating paths;
- valuation paths;
- terminal basis by path;
- CAGR 3/5/8Y;
- P(2x), P(5x);
- P(loss>30%), P(loss>50%), ES5%;
- max drawdown model-dependent;
- scenario variance;
- Persistence Ratio;
- assumptions hash;
- archetype/version.

## 10. Anti-circularity

Текущая цена используется для расчёта доходности и reverse valuation.

Она **не используется** для выбора:
- growth distribution;
- margin distribution;
- milestone probability;
- terminal multiple.

Иначе MC превращается в подгонку к рынку.
