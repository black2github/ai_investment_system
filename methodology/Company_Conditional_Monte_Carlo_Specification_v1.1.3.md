# Company Conditional Monte Carlo — Specification v1.1.3

Дата: 2026-09-23  
Статус: proposed normative consolidated  
Supersedes: v1.1.2  
Engine: `company_mc 2.3.1`  
Calibration schema: `Company_MC_Calibration_Schema v1.0.2`

Depends on:
- MC Calibration Archetypes v1.0 + Rules v1.1
- Joint Simulation Layer v1.0
- Joint Simulation Layer Rules v1.1.2
- Reverse Valuation Rules v1.1
- milestone engine slice
- Portfolio Stability Test v1.0

## 1. Purpose

Модель строит **conditional distributions of company equity value** на горизонтах 3Y/5Y/8Y.

Она не является price-target generator и не исполняет торговые решения.

Pipeline:

`verified company model -> calibration -> conditional MC -> path values / summary -> MPC / Optimizer / Stability -> interpretation`

Текущая рыночная стоимость используется только:
- как runtime `equity_value_0` для расчёта return;
- в `Price_Expectation_Gap`.

Запрещено подгонять growth, margin, milestone probability/timing или valuation multiples под текущую цену.

## 2. Archetypes

### A — mature_positive_margin

Используется, когда текущая положительная margin является экономически валидным anchor.

Revenue: segment growth + mean reversion.

Margin:

`m_t = m_terminal + (m_0 - m_terminal) * 2^(-t / half_life) + execution_shock_t`.

Method: `mean_reverting_positive_margin`.

### B — capital_intensive_transition

Используется, когда текущий FCF не является гладким anchor из-за инвестиционной интенсивности.

Поддерживаются:
- `direct_fcf_nodes`;
- `ocf_capex_decomposition`.

Для decomposition:

`FCF_margin_t = OCF_margin_t - Capex/Revenue_t`.

Нельзя поверх этих компонентов добавлять второй независимый FCF distribution.

### C — pre_service_or_milestone_driven

Используется, когда стоимость зависит от технических/регуляторных/deployment milestones и service onset.

Модель содержит:
- milestone DAG;
- existing segments;
- service segments;
- pre-service burn;
- service margin ramp;
- reduced-form dilution proxy;
- milestone-conditioned valuation.

## 3. I1–I3 — latent-factor dependence

Shared-rank construction запрещён.

Common factors:
- `growth`;
- `margin`;
- `valuation`.

Для stochastic parameter theta:

`Z_theta = loading * F + sqrt(1-loading^2) * epsilon_theta`

`U_theta = Phi(Z_theta)`,

после чего `U_theta` проходит через PPF distribution.

Revenue segments могут переопределять `latent_loading.growth`; иначе используется `dependencies.default_loading`.

Путь может быть сильным по growth и слабым по valuation. Прямой reuse rank/order statistic между параметрами запрещён.

Factor correlation matrix должна быть PSD; repair, если применён engine, логируется.

## 4. I4 — market path / max drawdown

Fundamental anchors формируются на t0/Y3/Y5/Y8.

Между anchors:
- log-linear interpolation fundamental value;
- mean-reverting market noise.

`market_path_model.quarterly_log_price_noise.annualized_sigma` и
`valuation_mean_reversion_half_life_years` относятся к path-dependent market metrics, прежде всего max drawdown.

5Y max drawdown — model-dependent metric, не прогноз historical realized volatility.

## 5. I5 — quarterly revenue

Для каждого segment:

`g(t) = g_long + (g_init - g_long) * 2^(-t / half_life)`

Quarterly multiplier:

`Revenue_(q+1) = Revenue_q * (1+g(t_q))^(1/4)`.

Annual revenue = сумма четырёх simulated quarters.

Для archetype C service segment рост начинается только после service-onset quarter.

## 6. Distribution families

Native families:

- `triangular`: `min/mode/max`;
- `pert`: `min/mode/max`, optional `lambda`, default 4.0;
- `truncated_normal`: `mean/sd`, optional `min/max`, отсутствие = ±infinity;
- `lognormal`: `median/sigma`;
- `deterministic`: `value`.

Это live-parser contract, проверенный для company_mc 2.3.x.

Каждый numerical distribution имеет provenance.

## 7. Numerical provenance

Допустимы:
- `verified_fact`;
- `derived_fact`;
- `model_assumption`;
- `owner_judgment`.

Rules:
- verified_fact -> source_ref;
- derived_fact -> formula;
- model_assumption -> rationale;
- owner_judgment -> owner_decision_ref.

Для engine-native scalar используется соседний `*_meta`.

Validator metadata не меняет numerical calculation.

## 8. Margin models

### 8.1 A — mean_reverting_positive_margin

Required:
- current margin;
- Y5/Y8 terminal distributions;
- half-life;
- shock sigma/persistence;
- bounds.

### 8.2 B — direct_fcf_nodes

Nodes:
- Y1;
- Y2;
- Y3;
- Y4 terminal fraction;
- Y5 terminal margin;
- Y8 terminal margin/rule.

### 8.3 B — ocf_capex_decomposition

Отдельно моделируются:
- `ocf_margin_nodes`;
- `capex_revenue_nodes`.

`FCF_margin = OCF_margin - capex/revenue`.

## 9. Valuation A/B — continuous FCF/revenue crossover

### 9.1 Explicit horizon basis

Y3/Y5/Y8 могут использовать:
- `FCF_multiple`;
- `revenue_bridge`;
- `EBITDA_multiple`.

Если horizon явно `revenue_bridge`, crossover rule не применяется.

Если horizon = `FCF_multiple`, engine также имеет `negative_fcf_fallback` = revenue bridge.

### 9.2 Почему hard switch запрещён

Hard rule:

`FCF < 0 -> revenue bridge`
`FCF >= 0 -> FCF multiple`

может создавать отрицательный скачок стоимости при улучшении компании: около нулевой положительной FCF margin
`FCF * multiple` может быть намного ниже `Revenue * bridge_multiple`.

Такой разрыв является engine/model-structure defect, а не экономическим tail.

### 9.3 Normative rule: parity-gated linear blend

Для path/horizon:

`R = annual revenue`
`m = FCF margin`
`M_R = sampled revenue-bridge multiple`
`M_F = sampled FCF multiple`

Candidate values:

`V_R = R * M_R`
`V_F(m) = R * m * M_F`.

Operational eligibility для A/B:

`m_elig = 0`.

Value-parity margin:

`m_parity = M_R / M_F`.

Blend start:

`m_start = max(m_elig, m_parity)`.

Blend width — methodology constant:

`Delta = 0.04` absolute FCF-margin points (4 п.п.).

Rules:

1. `m < 0`:
   `V = V_R`, basis = `negative_fcf_fallback`.

2. `0 <= m < m_start`:
   `V = V_R`, basis = `crossover_bridge`.

3. `m_start <= m < m_start + Delta`:

   `w = (m - m_start) / Delta`

   `V = (1-w) * V_R + w * V_F(m)`

   basis = `basis_blend`.

4. `m >= m_start + Delta`:
   `V = V_F(m)`, basis = `FCF_multiple`.

### 9.4 Properties

Поскольку `m_start >= M_R/M_F`, в начале blend:

`V_F(m_start) >= V_R`.

Следовательно linear blend непрерывен и не убывает по m при фиксированных R/M_R/M_F.

Это принципиально отличается от симметричного blend вокруг произвольного maturity threshold.

### 9.5 Почему не symmetric [threshold-Delta, threshold+Delta]

RKLB live case показал центрально:

`M_R = 7x revenue`
`M_F = 24x FCF`
`maturity threshold = 8%`.

При margin 8%:

`V_F/R = 1.92x`

и даже при 12%:

`V_F/R = 2.88x`,

что ниже 7x revenue bridge.

Симметричный linear blend 4–12% был бы continuous, но всё равно уменьшал бы стоимость при улучшении margin.

Поэтому v1.1.3 использует **parity-gated**, а не threshold-centered blend.

## 10. valuation_basis / bridge diagnostics

Basis codes v1.1.3:

| Code | Meaning |
|---|---|
| 0 | multiple (`FCF_multiple` / `EBITDA_multiple`) |
| 1 | explicit/pre-maturity `revenue_bridge` |
| 2 | `negative_fcf_fallback` |
| 3 | `milestone_conditioned_EV` |
| 4 | `failure_residual` |
| 5 | `crossover_bridge` — FCF operationally eligible, но FCF basis ещё ниже bridge |
| 6 | `basis_blend` — parity-gated transition band |

`valuation_basis_share` обязателен как authoritative quantitative diagnostic.

`bridge_dependent` является diagnostic only и должен считаться true/affected, если существенная доля paths использует codes 1/2/5/6.

Дополнительные engine diagnostics v1.1.3:
- `basis_parity_margin` по horizon/path;
- share `crossover_bridge`;
- share `basis_blend`;
- optional `parity_unreachable` если crossover не достигается в допустимой margin области.

Эти diagnostics не меняют state автоматически.

## 11. Reverse-Valuation gap diagnostics

Required calibration ref:

```yaml
reverse_valuation_ref:
  run_ref: ...
  implied_revenue_cagr_5y: ...
  discount_rate: ...
```

`RV_Growth_Gap = implied_revenue_CAGR_RV_5Y - median_revenue_CAGR_MC_5Y`.

`MedianPV_MC_5Y = median_MC_equity_value_5Y / (1+discount_rate)^5`.

`Price_Expectation_Gap = current_equity_value / MedianPV_MC_5Y`.

Оба gap — diagnostics, не calibration target и не auto-transition Valuation axis.

RV stability class остаётся authoritative в referenced Reverse Valuation run.

## 12. Robustness v1.1.2 — local stability

Фиксированные большие perturbations больше не определяют hard robustness pass.

Sigma-equivalent:

`sigma_eq = (Q84-Q16)/2`.

Для multiple:

`sigma_log = (ln Q84 - ln Q16)/2`.

Growth reference:
base-revenue-weighted RMS sigma_eq segment `initial_growth`.

Margin reference:
- A: sigma_eq Y5 terminal margin;
- B/direct: sigma_eq Y5 terminal FCF margin;
- B/OCF-capex: sqrt(sigma_ocf_Y5^2 + sigma_capex_Y5^2);
- C: service Y5 terminal-margin sigma_eq, пока не заменено отдельной C-методологией.

Local perturbation:

`delta_local = 0.25 * sigma_reference`.

Absolute ceilings:
- growth <=10 п.п.;
- margin <=5 п.п.;
- multiple <=20% relative.

Correlation perturbation остаётся ±0.15.

Pass:
1. sign median CAGR 5Y preserved >=75%;
2. `abs(delta P(2x)) <=0.10` и `abs(delta P(loss>30%)) <=0.10` >=75%.

### Absolute stress sensitivity

Старая сетка:
- growth ±10pp;
- margin ±5pp;
- multiple ±20%;
- correlation ±0.15

остаётся diagnostic only и не определяет `robustness.pass`.

## 13. Joint Simulation Layer / MC-G5-013

Joint Layer добавляет shared co-movement, а не заменяет собственную uncertainty компании.

Measured aggregate sigma — единственный hard dimensional criterion.

Validator воспроизводит:
- root correlations;
- persistence;
- lag;
- decay/half-life;
- transform;
- сумму mappings в один target.

Hard caps:
- growth: sigma <=0.15 absolute annual-rate shift;
- margin: sigma <=0.05;
- valuation: sigma <=0.15 log-multiple;
- milestone probability: sigma <=0.35 aggregate logit shift;
- milestone timing: sigma <=1.0 quarter.

Design headroom:
- A: 0.10 / 0.04 / 0.12;
- B: 0.12 / 0.04 / 0.12;
- C: 0.12 / 0.04 / 0.12 плюс probability 0.25 logit, timing 0.75 quarter.

`sum(abs(effect))` descriptive only.

### Temporal application

Growth targets — quarter by quarter.

Y3/Y5/Y8 scalar nodes — q12/q20/q32.

Milestone probability/timing — effective shock в нативный момент, когда milestone layer применяет target.
Нельзя заменять этот момент фиксированным q20.

Supported transforms:
- additive_pp;
- multiplicative_pct;
- log_multiplier;
- probability_logit_shift;
- timing_quarters_shift.

Unknown mapping targets отклоняются G5.

## 14. Structural support / knockout / adverse stress

`stochastic_targets` и `structural_support` различаются.

Structural support описывает часть central calibration, поддержанную favorable driver.

`remove_structural_support` удаляет central contribution и не равен -1sigma stochastic shock.

`adverse_driver_stress` применяет constant driver sigma через обычный mapping path.

## 15. Material-driver completeness

Material driver, если:
- abs exposure ==2; или
- terminal-value sensitivity share >=10%; или
- 1sigma shift меняет median 5Y CAGR >=1pp; или
- driver входит в critical/high failure mode.

Каждый material driver имеет native mapping.

`not_mapped` waiver в calibration YAML не вводится.

## 16. Archetype C — milestone model

### 16.1 DAG

Milestones вычисляются topologically.

Milestone eligible после успеха всех `requires`.

Actual timing = completion prerequisites + own timing delay.

### 16.2 Bernoulli dependence

Каждая milestone имеет marginal p.

Latent execution + idiosyncratic component создают зависимость между milestones без shared-rank "вечного победителя".

### 16.3 Failure

- `terminal_failure`;
- `delay_retry` с retry probability и retry delay.

### 16.4 Service revenue

Existing segments продолжаются независимо.

Service segments стартуют только после `service_onset_milestone`.

### 16.5 Cash/dilution C1

До service onset quarterly burn уменьшает net cash.

Если cash уходит ниже нуля, shortfall = raised capital.

Existing-holder value penalty:

`raised * (1 + dilution_penalty)`.

Это reduced-form conservative financing/dilution proxy, а не exact cap-table accounting.

### 16.6 Continuous valuation hierarchy C

Порядок:

1. terminal failure -> `failure_residual`;
2. no service onset -> `milestone_conditioned_EV`;
3. service onset, но margin < `fcf_maturity_margin` -> `revenue_bridge`;
4. service onset и margin >= eligibility -> parity-gated crossover между revenue bridge и FCF multiple;
5. после crossover blend -> `FCF_multiple`.

Для C:

`m_elig = fcf_maturity_margin`.

`m_parity = M_revenue_bridge / M_fcf`.

`m_start = max(m_elig, m_parity)`.

До `m_start` сохраняется bridge; затем linear blend шириной 4 п.п.; после него FCF basis.

Таким образом операционная зрелость является **необходимым**, но не достаточным условием смены basis: FCF basis также должен достичь value parity.

### failure_residual

`NetCash_h + ReferenceValue * residual_on_failure`.

### milestone_conditioned_EV

`NetCash_h + ReferenceValue * sum(value_uplift achieved milestones)`.

G5: `sum(value_uplift) <= 1`.

## 17. State transitions

`state_transition_effects` не являются native calibration input.

Calibration соответствует подтверждённому current state vector.

После подтверждённого transition calibration переиздаётся до следующего normative run.

## 18. Anti-double-counting

Один механизм не применяется одновременно через:
- scenario mean shift;
- structural support change;
- manual central-parameter change

без явного documented exception.

## 19. Determinism / portfolio alignment

Same calibration + engine version + seed + path count/chunk convention -> deterministic result.

Portfolio aggregation требует совместимых:
- global seed;
- path indexing;
- path count;
- Joint Layer regime.

## 20. G5 validation

Schema проверяет shape.

Validator дополнительно проверяет:
- material-driver completeness;
- supported paths/transforms;
- milestone DAG;
- uplift sum <=1;
- distribution ordering;
- PSD;
- provenance;
- anti-circularity;
- MC-G5-013 measured sigma.

### Engine conformance test: valuation monotonicity

Для company_mc 2.3.1 обязателен unit/conformance test:

при фиксированных Revenue, M_R, M_F и остальных параметрах увеличение FCF margin не должно уменьшать equity value
на FCF/revenue crossover path.

Проверяются точки:
- eligibility boundary;
- `m_start`;
- `m_start + 0.04`.

Value должна быть continuous с numerical tolerance.

Это engine conformance test, а не calibration parameter-fitting gate.

## 21. Schema / engine alignment

Schema v1.0.2:
- pin `company_mc 2.3.1`;
- calibration shape остаётся v1.0.1-compatible;
- новых valuation-transition fields нет;
- blend width 4 п.п. — methodology constant;
- milestone caps отражены в `x-g5-cross-rules`.

По-прежнему отсутствуют:
- `state_transition_effects`;
- native `not_mapped`;
- `categorical_transition_probability_shift`;
- unknown `capacity_model.*`.

## 22. Dispersion sanity

Diagnostic:

`W = q95(CAGR equity 5Y) - q5(CAGR equity 5Y)`.

Bands:
- A intrinsic 0.25–0.50, full 0.30–0.60;
- B intrinsic 0.40–0.85, full 0.45–1.00;
- C intrinsic 0.60–1.30, full 0.70–1.50.

Max full/intrinsic:
- A/B 1.50;
- C 1.60.

Bands — warnings, не optimization targets.

Если intrinsic ниже band, сначала рассматривается widening собственных distributions при неизменных centers.

## 23. Anti-circularity

Current market price нельзя использовать для calibration parameters.

Если `abs(RV_Growth_Gap) <=1pp`, semantic acceptance требует independent operating-evidence bridge:

`verified operating facts -> rationale for min/mode/max growth`.

Совпадение MC и RV само по себе допустимо; отсутствие независимого evidence bridge — нет.

## 24. Interpretation of valuation crossover

Новая continuity rule не "исправляет" дорогую/дешёвую компанию и не гарантирует привлекательную доходность.

Если bridge multiple значительно выше FCF-equivalent valuation, модель может долго оставаться bridge-dependent.
Это должно проявляться через:
- high `basis_parity_margin`;
- high crossover_bridge/basis_blend share;
- `bridge_dependent`;
- sensitivity to bridge multiple.

Такой результат является model-risk / Decision Request input, а не поводом подгонять multiples к цене.
