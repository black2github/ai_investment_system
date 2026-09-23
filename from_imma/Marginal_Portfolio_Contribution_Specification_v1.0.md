# Marginal Portfolio Contribution — спецификация v1.0

Дата: 2026-09-20  
Статус: нормативная методология  
Термин: **Marginal Portfolio Contribution (MPC)** — предельный вклад кандидата в свойства всего портфеля по сравнению с портфелем без него.

## 1. Место в конвейере

Нормативная последовательность:

`Candidate → Company Model → Valuation → Conditional MC → MPC → Portfolio Optimizer → Portfolio Stability Test → Core/Challenger decision → target weights`

MPC не заменяет Portfolio Optimizer. Он формирует портфельные признаки кандидата, которые оптимизатор использует вместе с standalone-распределением доходности и ограничениями.

Основное правило:

> **Standalone attractiveness ≠ Portfolio attractiveness.**

Компания может иметь привлекательное собственное распределение доходности, но слабый MPC, если она дублирует уже имеющиеся драйверы, failure modes или сценарную экспозицию.

## 2. Анти-якорное правило

`initial_portfolio_hypothesis` запрещено использовать как вход MPC.

Нельзя:
- давать преимущество компании потому, что она была в прежнем Core;
- использовать прежний target weight как начальную точку оптимизации;
- штрафовать кандидата за отсутствие в прежнем списке.

Допускается только ex-post сравнение после завершения расчёта.

## 3. Входы

### 3.1 Standalone distribution

Из Conditional MC:
- CAGR distributions 3Y/5Y/8Y;
- P(2x), P(5x);
- P(loss >30%), P(loss >50%);
- ES5%;
- max drawdown distribution;
- Persistence Ratio;
- Scenario Robustness;
- Scenario Concentration.

### 3.2 Рыночная корреляция

Минимум:
- weekly total-return correlation, 3Y rolling, если история доступна;
- 1Y rolling как sensitivity;
- stress correlation на периодах market Stress/Shock.

Историческая корреляция — наблюдение, не причинное доказательство.

### 3.3 Корреляция экономических драйверов

Для каждой компании формируется `driver_exposure_vector`.

Нормативные категории v1.0:
- AI_COMPUTE_DEMAND
- HYPERSCALER_CAPEX
- SEMICONDUCTOR_WFE
- ADVANCED_PACKAGING
- HBM_MEMORY
- EDA_DESIGN_COMPLEXITY
- CLOUD_SOFTWARE_DEMAND
- DATA_CENTER_POWER
- LAUNCH_ECONOMICS
- SATELLITE_CONNECTIVITY
- GOVERNMENT_DEFENSE
- INTEREST_RATES
- CAPITAL_MARKETS
- CHINA_REVENUE
- TAIWAN_SUPPLY
- ACQUISITION_INTEGRATION

Экспозиция каждого драйвера:
`-2 strong_negative, -1 negative, 0 immaterial, +1 positive, +2 strong_positive`.

Значение должно иметь evidence/ref или `model_assumption`.

### 3.4 Пересечение экономических экспозиций

Для пары компаний:

`DriverOverlap_ij = weighted_cosine_similarity(abs(exposure_i), abs(exposure_j))`

Знак драйвера анализируется отдельно через `DriverDirectionConflict`: одинаковый фактор может быть положительным для одной компании и отрицательным для другой.

Вес драйвера определяется scenario engine; при отсутствии утверждённых весов используется equal-weight и ставится `provisional: true`.

### 3.5 Failure modes

Каждая Company Model передаёт набор failure modes:
- `failure_id`;
- описание;
- axis/state;
- вероятность или band, если утверждены;
- severity;
- common_cause_id;
- evidence.

Примеры common cause: hyperscaler capex slowdown, Taiwan disruption, AI overbuild, acquisition integration failure.

`FailureModeOverlap` — доля material failure modes кандидата, имеющих общий `common_cause_id` с текущим портфелем, взвешенная по severity.

### 3.6 Scenario exposure

Для каждого нормативного сценария хранится conditional return/distribution компании. MPC измеряет, улучшает ли кандидат портфель в сценариях, где текущий портфель наиболее слаб.

### 3.7 Liquidity / implementation

Входы:
- средний дневной оборот;
- размер позиции;
- торговая валюта;
- lot constraints;
- доступность инструмента;
- transaction-cost estimate.

Это constraint layer, а не инвестиционная привлекательность.

## 4. Базовый контрфактический расчёт

Для кандидата `i` создаются два портфеля:

`P0 = текущий оптимизируемый набор без i`

`P1(w) = P0 + кандидат i с тестовым весом w`

Тестовые веса берутся из допустимого диапазона Portfolio Optimizer, а не из prior weight.

Для каждого `w` пересчитываются:
- median CAGR 5Y;
- ES5%;
- P(loss >30%);
- P(loss >50%);
- portfolio volatility;
- max drawdown distribution;
- scenario losses;
- scenario concentration;
- factor/driver concentration;
- failure-mode concentration.

MPC — вектор изменений `Metric(P1) - Metric(P0)`, а не один score.

## 5. Нормативный выход

```yaml
mpc_output:
  ticker:
  run_id:
  portfolio_state_hash:
  tested_weights: []

  standalone:
    median_cagr_5y:
    es5:
    p_loss_30:
    persistence_ratio:

  marginal:
    delta_median_cagr_5y_by_weight: {}
    delta_es5_by_weight: {}
    delta_p_loss_30_by_weight: {}
    delta_max_drawdown_by_weight: {}
    delta_scenario_concentration_by_weight: {}
    delta_driver_concentration_by_weight: {}
    delta_failure_mode_concentration_by_weight: {}

  overlaps:
    market_correlation:
    driver_overlap:
    failure_mode_overlap:
    scenario_overlap:

  diversification:
    helps_weak_scenarios: []
    worsens_weak_scenarios: []
    unique_positive_drivers: []
    duplicated_drivers: []
    unique_failure_modes: []
    duplicated_failure_modes: []

  implementation:
    constraints_pass:
    breaches: []

  classification:
    portfolio_contribution:
      return: [improves, neutral, worsens]
      downside: [improves, neutral, worsens]
      diversification: [improves, neutral, worsens]
      robustness: [improves, neutral, worsens]

  decision: "none"
```

`decision: none` обязателен: MPC не принимает инвестиционное решение.

## 6. Нет единого MPC-score

Запрещено сворачивать return, downside, diversification и robustness в одно число без отдельной версии методологии.

Причина: +1% ожидаемого CAGR и ухудшение tail risk нельзя объективно сложить без явно утверждённой utility function владельца.

Portfolio Optimizer решает trade-off в рамках своих constraints и objective.

## 7. Что означает «добавляет портфелю»

MPC должен отвечать на четыре отдельных вопроса:

1. **Return:** повышается ли распределение ожидаемой доходности?
2. **Downside:** улучшаются ли ES5%, P(loss>30/50%) и drawdown?
3. **Diversification:** появляются ли независимые драйверы или защита слабых сценариев?
4. **Robustness:** остаётся ли эффект при sensitivity/stability perturbations?

Компания может улучшать один слой и ухудшать другой. Такой результат не считается противоречием.

## 8. Pairwise experiment

Для SNPS/CDNS выполняются три расчёта:
- портфель + SNPS;
- портфель + CDNS;
- портфель + SNPS + CDNS.

Это позволяет отличить:
- standalone attractiveness каждой компании;
- взаимозаменяемость;
- пользу совместного владения.

Если обе компании имеют высокую standalone attractiveness, но в комбинации почти не улучшают return/downside/robustness относительно лучшей одиночной позиции, система фиксирует `redundant_exposure`, но не выбирает победителя сама.

## 9. Core / Challenger

Core/Challenger присваивается после MPC, Optimizer и Stability Test.

Минимальная логика:
- Core требует не только standalone thesis, но и устойчивого положительного портфельного вклада при допустимом весе;
- Challenger может иметь сильную standalone thesis, но повышенную неопределённость состояния, valuation или MPC;
- Watch может быть фундаментально интересен, но не проходить текущие portfolio constraints.

Это классификация роли в системе, не рейтинг качества компании.

## 10. Stability Test

После оптимизации:
- perturb expected returns;
- perturb correlations;
- perturb scenario probabilities;
- perturb terminal assumptions;
- исключить по одному крупному driver;
- повторить optimization.

Если включение кандидата или его вес резко исчезают при малом изменении входов, MPC получает `robustness: worsens/unstable`, даже если central run выглядит привлекательным.

## 11. Версионность

Каждый MPC run хранит:
- Company Model version;
- Conditional MC version;
- Scenario Engine version;
- portfolio state hash;
- correlation window;
- driver taxonomy version;
- failure-mode taxonomy version;
- optimizer version;
- timestamp.

Результат нельзя переносить на другой состав портфеля без повторного расчёта: MPC по определению зависит от окружающего портфеля.
