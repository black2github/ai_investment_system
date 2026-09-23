# Joint Simulation Layer — Specification v1.0

Дата: 2026-09-21  
Статус: proposed normative  
Назначение: связать Company Conditional MC в единое распределение портфеля.

## 1. Это не Scenario Engine

`Scenario Engine` и `Joint Simulation Layer` — соседние, но разные слои.

**Scenario Engine** отвечает:
- какие дискретные состояния мира допустимы;
- какова вероятность каждого состояния;
- какие проверенные факты изменяют вероятность сценария;
- какие factor overrides соответствуют сценарию.

**Joint Simulation Layer** отвечает:
- как в одном Monte Carlo path синхронно двигаются факторы разных компаний;
- как общие shocks превращаются в growth / margin / capacity / valuation parameters;
- как сохранить idiosyncratic uncertainty каждой компании.

Нормативный pipeline:

`Scenario Engine → scenario_id/probability/factor_overrides → Joint Simulation Layer → Company MC parameter paths → Joint Portfolio Paths`

До отдельной спецификации Scenario Engine Joint Simulation может работать с:

`BASE scenario, probability = 1.0, no scenario overrides`.

Это позволяет кодировать Optimizer/Stability сейчас и подключить вероятности сценариев позже без изменения интерфейса.

## 2. Три уровня случайности

### Layer A — portfolio root factors

Небольшой набор общих латентных факторов обеспечивает положительно определённую совместную структуру.

Все root factors стандартизированы: стационарное распределение `N(0,1)`.

Quarterly dynamics:

`F_k,t = phi_k * F_k,t-1 + sqrt(1 - phi_k^2) * u_k,t`

`u_t ~ MVN(0, R_root)`

`phi` — persistence, `R_root` — correlation matrix.

### Layer B — economic driver shocks

Driver IDs берутся из `MPC_Driver_Taxonomy_v1.1`.

Для driver `d`:

`RawDriver_d,t = Σ_k lambda_d,k * F_k,t + sigma_idio_d * epsilon_d,t`

После этого driver series стандартизируется до unit variance:

`DriverShock_d,t = RawDriver_d,t / stdev(RawDriver_d)`

Это позволяет использовать один и тот же driver ID в разных компаниях и получать реальную совместную корреляцию.

Driver без `root_loadings` по умолчанию является idiosyncratic:

`DriverShock_d,t = epsilon_d,t`.

### Layer C — company parameter mapping

Каждая компания обязана иметь `driver_parameter_mapping`.

Для target parameter:

`theta_i,j,t = BaseTheta_i,j,t + Σ_d Effect_i,j,d(DriverShock_d,t) + IdiosyncraticParameterShock_i,j,t`

Таким образом:
- общий factor создаёт portfolio co-movement;
- одинаковый driver может иметь разный magnitude у разных компаний;
- company-specific shock сохраняет независимую неопределённость.

## 3. Root factors v1.0

Все параметры ниже — `model_assumption`.

| Root factor | Семантика положительного shock | phi |
|---|---|---:|
| GLOBAL_GROWTH | более сильный глобальный спрос/рост | 0.65 |
| AI_CAPEX_CYCLE | более сильный AI infrastructure investment cycle | 0.75 |
| SEMI_SUPPLY_HEALTH | более здоровая leading-edge semiconductor supply | 0.55 |
| POWER_BUILDOUT | более быстрое строительство power/grid/data-center infrastructure | 0.80 |
| FINANCIAL_CONDITIONS | более лёгкое финансирование / ниже cost of capital | 0.60 |
| SPACE_GOVERNMENT_DEMAND | более сильный государственный/space procurement cycle | 0.75 |
| SPACE_REGULATORY_ACCESS | более благоприятный launch/spectrum regulatory access | 0.70 |
| HEALTHCARE_DEMAND_ACCESS | более сильный medical demand / reimbursement access | 0.70 |
| CONSUMER_RISK_APPETITE | более здоровый consumer credit / risk appetite | 0.55 |
| DIGITAL_PLATFORM_DEMAND | более сильный enterprise software / digital-ad demand | 0.60 |
| CHINA_MARKET_ACCESS | более широкий доступ к китайскому рынку / меньше ограничений | 0.70 |

## 4. Root correlation v1.0

Недиагональные пары, не перечисленные ниже, равны 0. Матрица симметрична, diagonal = 1.

Корреляции — `model_assumption`.

- GLOBAL_GROWTH ↔ AI_CAPEX_CYCLE = 0.35
- GLOBAL_GROWTH ↔ FINANCIAL_CONDITIONS = 0.35
- GLOBAL_GROWTH ↔ CONSUMER_RISK_APPETITE = 0.45
- GLOBAL_GROWTH ↔ DIGITAL_PLATFORM_DEMAND = 0.55
- GLOBAL_GROWTH ↔ HEALTHCARE_DEMAND_ACCESS = 0.10
- GLOBAL_GROWTH ↔ POWER_BUILDOUT = 0.25
- GLOBAL_GROWTH ↔ SEMI_SUPPLY_HEALTH = 0.15
- GLOBAL_GROWTH ↔ CHINA_MARKET_ACCESS = 0.10
- AI_CAPEX_CYCLE ↔ SEMI_SUPPLY_HEALTH = 0.30
- AI_CAPEX_CYCLE ↔ POWER_BUILDOUT = 0.45
- AI_CAPEX_CYCLE ↔ DIGITAL_PLATFORM_DEMAND = 0.30
- AI_CAPEX_CYCLE ↔ FINANCIAL_CONDITIONS = 0.20
- SEMI_SUPPLY_HEALTH ↔ CHINA_MARKET_ACCESS = 0.20
- FINANCIAL_CONDITIONS ↔ CONSUMER_RISK_APPETITE = 0.40
- FINANCIAL_CONDITIONS ↔ DIGITAL_PLATFORM_DEMAND = 0.20
- FINANCIAL_CONDITIONS ↔ CHINA_MARKET_ACCESS = 0.05
- SPACE_GOVERNMENT_DEMAND ↔ GLOBAL_GROWTH = 0.05
- SPACE_GOVERNMENT_DEMAND ↔ FINANCIAL_CONDITIONS = 0.05
- SPACE_GOVERNMENT_DEMAND ↔ SPACE_REGULATORY_ACCESS = 0.10
- SPACE_REGULATORY_ACCESS ↔ GLOBAL_GROWTH = 0.05
- HEALTHCARE_DEMAND_ACCESS ↔ CONSUMER_RISK_APPETITE = 0.05

Эта v1.0 матрица проверена как positive semidefinite. Движок всё равно обязан валидировать PSD при загрузке и после scenario overrides.

## 5. Driver → root mapping

Ниже базовые mappings v1.0. `idio_weight` добавляет driver-specific shock. После суммирования series стандартизируется, поэтому loadings не обязаны давать variance=1.

Примеры основных drivers:

- `AI_COMPUTE_DEMAND`: AI_CAPEX_CYCLE 0.85, GLOBAL_GROWTH 0.20, idio 0.35
- `HYPERSCALER_CAPEX`: AI_CAPEX_CYCLE 0.80, FINANCIAL_CONDITIONS 0.15, idio 0.35
- `SEMICONDUCTOR_WFE`: AI_CAPEX_CYCLE 0.50, GLOBAL_GROWTH 0.30, idio 0.45
- `ADVANCED_PACKAGING`: SEMI_SUPPLY_HEALTH 0.65, AI_CAPEX_CYCLE 0.35, idio 0.35
- `HBM_MEMORY`: SEMI_SUPPLY_HEALTH 0.55, AI_CAPEX_CYCLE 0.45, idio 0.35
- `EDA_DESIGN_COMPLEXITY`: AI_CAPEX_CYCLE 0.40, DIGITAL_PLATFORM_DEMAND 0.25, idio 0.60
- `CLOUD_SOFTWARE_DEMAND`: DIGITAL_PLATFORM_DEMAND 0.75, GLOBAL_GROWTH 0.25, idio 0.35
- `DATA_CENTER_POWER`: POWER_BUILDOUT 0.75, AI_CAPEX_CYCLE 0.30, idio 0.35
- `LAUNCH_ECONOMICS`: SPACE_GOVERNMENT_DEMAND 0.25, SPACE_REGULATORY_ACCESS 0.20, idio 0.75
- `SATELLITE_CONNECTIVITY`: GLOBAL_GROWTH 0.25, SPACE_GOVERNMENT_DEMAND 0.25, idio 0.70
- `GOVERNMENT_DEFENSE`: SPACE_GOVERNMENT_DEMAND 0.80, GLOBAL_GROWTH 0.10, idio 0.35
- `INTEREST_RATES`: FINANCIAL_CONDITIONS -0.90, idio 0.25
- `CAPITAL_MARKETS`: FINANCIAL_CONDITIONS 0.90, idio 0.25
- `CHINA_REVENUE`: CHINA_MARKET_ACCESS 0.80, GLOBAL_GROWTH 0.15, idio 0.35
- `TAIWAN_SUPPLY`: SEMI_SUPPLY_HEALTH 0.90, idio 0.25
- `AI_CLOUD_PRICING`: AI_CAPEX_CYCLE 0.60, idio 0.55
- `HEALTHCARE_DEMAND`: HEALTHCARE_DEMAND_ACCESS 0.80, GLOBAL_GROWTH 0.10, idio 0.40
- `REIMBURSEMENT_PRICING`: HEALTHCARE_DEMAND_ACCESS 0.60, idio 0.60
- `ELECTRIFICATION_GRID`: POWER_BUILDOUT 0.75, GLOBAL_GROWTH 0.15, idio 0.40
- `UTILITY_CAPEX`: POWER_BUILDOUT 0.65, GLOBAL_GROWTH 0.20, FINANCIAL_CONDITIONS 0.15, idio 0.40
- `AEROSPACE_CYCLE`: SPACE_GOVERNMENT_DEMAND 0.50, GLOBAL_GROWTH 0.25, idio 0.55
- `CONSUMER_CREDIT`: CONSUMER_RISK_APPETITE 0.80, FINANCIAL_CONDITIONS 0.20, idio 0.35
- `CRYPTO_CYCLE`: CONSUMER_RISK_APPETITE 0.55, FINANCIAL_CONDITIONS 0.35, idio 0.50
- `DIGITAL_AD_DEMAND`: DIGITAL_PLATFORM_DEMAND 0.70, CONSUMER_RISK_APPETITE 0.20, GLOBAL_GROWTH 0.20, idio 0.35
- `SPACE_REGULATION`: SPACE_REGULATORY_ACCESS -0.90, idio 0.25

Drivers вроде `ACQUISITION_INTEGRATION`, `DRUG_PIPELINE`, `PATENT_EXCLUSIVITY`, `FINTECH_REGULATION` в v1.0 остаются primarily idiosyncratic, пока не появится обоснованный общий фактор.

## 6. Scenario interface

Scenario Engine передаёт:

```yaml
scenario:
  id:
  probability:
  effective_from:
  driver_overrides:
    DRIVER_ID:
      mean_shift_sigma:
      volatility_multiplier:
      persistence_override:
  root_correlation_overrides: []
```

Scenario Engine не задаёт company revenue напрямую. Он сдвигает общие drivers, после чего company mapping преобразует shocks в параметры.

### 6.1 Тайвань

Пример интерфейса, **не нормативная калибровка сценария**:

- `TAIWAN_SUPPLY`: сильный отрицательный mean shift;
- `CHINA_REVENUE`: отрицательный shift;
- `AI_COMPUTE_DEMAND`: возможный краткосрочный отрицательный shift;
- scenario может повысить correlation между semiconductor-related drivers.

### 6.2 WAR-ECONOMY

Пример интерфейса, **не нормативная калибровка**:

- `GOVERNMENT_DEFENSE`: положительный shift;
- `AEROSPACE_CYCLE`: положительный shift;
- `CAPITAL_MARKETS`: возможный отрицательный shift;
- другие drivers меняются только если Scenario Engine явно задаёт это.

Ни вероятности, ни magnitude этих сценариев v1.0 Joint Layer не определяет.

## 7. driver_parameter_mapping — обязательная часть Company Calibration

Для каждого material driver компания обязана указать:

- какие параметры он меняет;
- направление;
- эффект на `+1 sigma DriverShock`;
- lag;
- persistence/decay;
- structural baseline support;
- Stability knockout;
- adverse stress direction.

Пример:

```yaml
driver_parameter_mapping:
  - driver_id: AI_COMPUTE_DEMAND
    material: true
    stochastic_targets:
      - path: revenue_model.segments.AI.initial_growth
        transform: additive_pp
        effect_per_plus_1sigma: 0.12
        lag_quarters: 0
    structural_support:
      - path: revenue_model.segments.AI.initial_growth.mode
        contribution: 0.08
    stability:
      knockout:
        mode: remove_structural_support
        shifts:
          - path: revenue_model.segments.AI.initial_growth.mode
            delta: -0.08
      adverse_driver_stress:
        driver_sigma: -1.0
```

`effect_per_plus_1sigma` и `structural_support` — разные вещи.

- Первое создаёт path-to-path covariance.
- Второе описывает часть central calibration, которая зависит от наличия благоприятного driver и которую можно удалить в Stability Test.

## 8. Driver knockout

Старое правило Stability §3.5 уточняется.

### 8.1 Для положительного structural support

`knockout = remove_structural_support`.

То есть удаляется только явно записанный baseline uplift.

### 8.2 Для отрицательной exposure

Если driver не создаёт положительный structural support, `knockout` может быть `not_applicable`.

Тогда обязательна секция `adverse_driver_stress`, которая задаёт неблагоприятное направление factor shock.

Движок не должен превращать отрицательный driver в искусственный положительный эффект.

## 9. Material driver

Driver считается material для company calibration, если выполнено хотя бы одно:

- `abs(driver_exposure_vector) = 2`;
- driver влияет на ≥10% median terminal value;
- изменение driver на 1σ сдвигает median 5Y CAGR ≥1 п.п.;
- driver участвует в critical/high failure mode.

Пороговые значения — `model_assumption`.

Material drivers обязаны иметь `driver_parameter_mapping`.

## 10. Joint-path generation

Для каждого path:

1. выбрать scenario согласно Scenario Engine probabilities;
2. сгенерировать root-factor trajectory;
3. применить scenario overrides;
4. получить standardized driver trajectories;
5. для каждой компании преобразовать drivers в company parameters;
6. добавить company idiosyncratic shocks;
7. выполнить Company MC;
8. сохранить `RelativeValue_i,h`;
9. передать общий path Optimizer.

Один `path_id` должен соответствовать одному и тому же набору root/driver shocks для всех компаний.

## 11. Reproducibility

Joint run хранит:

- `joint_model_version`;
- Scenario Engine version;
- root-factor registry version;
- correlation matrix hash;
- company calibration versions;
- driver mapping hashes;
- seed;
- scenario sample per path;
- root/driver factor realization hash;
- optimizer run reference.

## 12. Validation

Обязательные checks:

- root matrix PSD;
- no missing material-driver mapping;
- no duplicate path IDs;
- same factor path delivered to all companies;
- scenario probabilities sum to 1;
- factor shocks approximately unit variance in BASE long-run simulation;
- standalone marginal distributions from joint engine statistically match standalone MC within tolerance;
- correlation perturbation in Stability changes realized joint correlations in ожидаемом направлении.

## 13. Anti-double-counting

Один экономический механизм нельзя одновременно внести:
- через scenario mean shift;
- через driver structural-support shift;
- через ручной company growth shift

без явного `double_count_exception`.

При scenario run structural support остаётся частью базовой calibration; Scenario Engine меняет factor realization вокруг неё.
