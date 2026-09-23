# Company Conditional Monte Carlo — Specification v1.1.1

Дата: 2026-09-23  
Статус: proposed normative patch over accepted v1.1  
Engine: `company_mc 2.3.0`

Все положения v1.1 сохраняются, кроме уточнений ниже.

## 13A. Dimensional control of Joint driver mappings

Joint Layer моделирует общую экономическую ко-движуху. Он не должен быть единственным источником company uncertainty.

Для одного target path эффекты всех драйверов складываются движком. Поэтому `effect_per_plus_1sigma` определяется не
как полный standalone shock данного драйвера, а как **маргинальный вклад после учёта уже существующих mappings**.

Нормативный hard gate: `MC-G5-013` из `Joint_Simulation_Layer_Rules_v1.1`.

Для каждого target path artifact_validator обязан:
1. воспроизвести Joint driver paths;
2. применить lag/decay/transform как `company_mc 2.3.0`;
3. получить суммарный target perturbation;
4. измерить σ по путям;
5. отклонить калибровку при превышении размерностного cap.

Caps:
- annual growth: `σ <= 0.15` абсолютного annual growth rate;
- margin: `σ <= 0.05` absolute margin;
- valuation multiple: `σ <= 0.15` для `ln(M_shocked/M_base)`.

Рост измеряется на q20, поскольку 5Y — Primary Optimization Horizon.
Horizon scalar nodes измеряются в нативном квартале: Y3 q12, Y5 q20, Y8 q32.

## 13B. Variance allocation

Собственные parameter distributions и latent/idiosyncratic layer компании несут:
- execution uncertainty;
- segment growth uncertainty;
- margin path uncertainty;
- terminal-value uncertainty.

Joint Layer добавляет:
- общую макро/секторную covariance;
- общие supply/demand/power/capital-market shocks.

Joint Layer не должен «спасать» слишком узкую standalone calibration.

Для диагностики обязательны два dry runs:
- intrinsic: mapping disabled;
- full: mapping enabled.

Показатель `q95-q5` 5Y equity CAGR используется только как plausibility warning по archetype bands из
`Joint_Simulation_Layer_Rules_v1.1`. Это не calibration target и не разрешает подгонку под цену.

## 13C. Anti-circularity extension

`MC-G5-009` дополнен практическим тестом:

Если `abs(RV_Growth_Gap) <= 1 pp`, калибратор обязан приложить `independent_growth_evidence_bridge` в Markdown
обосновании: раскрытые operating facts → объяснение min/mode/max growth distribution.

Это не новое поле company_mc YAML.

Совпадение MC growth с price-implied RV не является дефектом само по себе, но без независимой operating bridge
считается подозрением на circular calibration и блокирует semantic acceptance.

## 20A. Dispersion sanity

Archetype-specific ranges в Joint Rules v1.1 являются warning bands.

При выходе за band требуется review причин, но G5 v1.1.1 не подгоняет параметры автоматически.
