# MC Calibration Archetypes — Rules v1.1

Дата: 2026-09-21  
Изменяет: `MC Calibration Archetypes v1.0`  
v1.0 не переписывается.

## 1. Новые обязательные секции common_schema

Каждая company calibration теперь обязана содержать:

- `joint_simulation`
- `driver_parameter_mapping`

## 2. joint_simulation

Минимальная структура:

```yaml
joint_simulation:
  layer_version: "1.0"
  active_drivers:
    - DRIVER_ID
  company_idiosyncratic_factors:
    - id:
      distribution:
      persistence:
  path_alignment:
    use_global_path_id: true
```

`active_drivers` должны быть subset MPC Driver Taxonomy v1.1.

## 3. driver_parameter_mapping

Для каждого material driver:

```yaml
driver_parameter_mapping:
  - driver_id:
    material: true
    stochastic_targets:
      - path:
        transform:
        effect_per_plus_1sigma:
        lag_quarters:
        decay_half_life_quarters:
    structural_support:
      - path:
        contribution:
    stability:
      knockout:
        mode:
        shifts: []
      adverse_driver_stress:
        driver_sigma:
```

Допустимые transforms v1.1:
- `additive_pp`
- `multiplicative_pct`
- `log_multiplier`
- `probability_logit_shift`
- `timing_quarters_shift`
- `categorical_transition_probability_shift`

## 4. Structural support ≠ stochastic sensitivity

`stochastic_targets` создают covariance внутри MC.

`structural_support` описывает, какая часть central calibration зависит от благоприятного material driver.

Stability knockout удаляет только structural support.

Нельзя использовать `effect_per_plus_1sigma` как knockout автоматически.

## 5. Negative exposures

Для driver с отрицательной exposure `knockout` может быть `not_applicable`, если благоприятный structural support отсутствует.

В таком случае обязателен `adverse_driver_stress`, например:

```yaml
stability:
  knockout:
    mode: not_applicable
  adverse_driver_stress:
    driver_sigma: 1.0
```

где `+1 sigma` следует семантике самого driver. Например для `INTEREST_RATES` +1σ означает более высокие ставки.

## 6. Scenario integration

Company calibration не хранит scenario probabilities.

Она только объявляет driver mappings.

Scenario Engine передаёт factor shifts в Joint Simulation Layer, а тот применяет company mapping.

## 7. Backward compatibility

SPCX MC v1.0 может работать standalone без новых секций.

Но первая calibration, создаваемая после этой версии правил, должна содержать обе секции, чтобы не требовать миграции перед MPC/Optimizer.
