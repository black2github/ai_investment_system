# Company Conditional Monte Carlo — Specification v1.1

Дата: 2026-09-23  
Статус: proposed normative, aligned to `company_mc 2.3.0`  
Supersedes/extends: SPCX Conditional MC v1.0 for the generalized company engine  
Depends on:
- MC Calibration Archetypes v1.0 + Rules v1.1
- Joint Simulation Layer v1.0 / `joint_layer 1.0.0`
- Reverse Valuation Rules v1.1
- `company_mc 2.3.0`
- `milestone_mc` slice 3

## 1. Purpose

The model produces **conditional distributions of company equity value** over 3Y/5Y/8Y horizons.

It is not a price target generator and not a trade-decision engine.

Canonical pipeline:

`verified company model → calibration → conditional MC → path values / summary → MPC / Optimizer / Stability → interpretation`

Current market value is allowed only:
- as `equity_value_0` runtime input for returns;
- for `Price_Expectation_Gap`.

It is forbidden to fit growth, margin, milestone probability or valuation multiple distributions to the current price.

---

## 2. Archetypes

### A — `mature_positive_margin`

Use when current positive margin is a valid economic anchor.

Revenue: segment growth with mean reversion.

Margin:

`m_t = m_terminal + (m_0 - m_terminal) * 2^(-t / half_life) + execution_shock_t`

Calibration method:

`mean_reverting_positive_margin`.

### B — `capital_intensive_transition`

Use when current FCF is not a smooth anchor because investment intensity dominates current cash conversion.

Two supported margin methods:

1. `direct_fcf_nodes`
2. `ocf_capex_decomposition`

`ocf_capex_decomposition` is preferred when OCF and capex data support it.

For the decomposition:

`FCF_margin_t = OCF_margin_t - Capex/Revenue_t`.

No independent FCF distribution is added on top of these two components.

### C — `pre_service_or_milestone_driven`

Use when value depends primarily on technical/regulatory/deployment milestones and service onset.

The model contains:
- milestone DAG;
- existing business segments;
- service segments;
- pre-service cash burn;
- service margin ramp;
- dilution proxy;
- milestone-conditioned piecewise valuation.

---

# 3. I1–I3: latent factor dependence

The old shared-rank construction is abolished.

For A/B the common latent factors are:

- `growth`
- `margin`
- `valuation`

The calibration contains their pairwise correlation matrix and `default_loading`.

For a scalar stochastic parameter θ linked to factor F:

`Z_θ = loading * F + sqrt(1 - loading²) * ε_θ`

where:
- `F` is the correlated common factor;
- `ε_θ ~ N(0,1)` is parameter-specific idiosyncratic noise;
- `loading²` is the share of standardized variance attributable to the common factor.

`U_θ = Φ(Z_θ)` is passed through the calibrated distribution PPF.

Revenue segments may override the common loading through:

`revenue_model.segments.<segment>.latent_loading.growth`.

Otherwise `dependencies.default_loading` is used.

### Normative consequence

No parameter is allowed to reuse the rank/order statistic of another parameter directly.

A path can be favorable in growth and unfavorable in valuation because the common-factor correlation is incomplete and each parameter retains idiosyncratic uncertainty.

The factor correlation matrix must be PSD. If the engine repairs it numerically, the repair must be logged.

---

# 4. I4: market path for max drawdown

Fundamental terminal outcomes and the market path are separate layers.

Fundamental equity anchors are generated at:
- t0,
- Y3,
- Y5,
- Y8.

Between anchors the engine uses log-linear interpolation of the fundamental value path and adds mean-reverting market noise.

Calibration fields:

```yaml
market_path_model:
  quarterly_log_price_noise:
    annualized_sigma: ...
  valuation_mean_reversion_half_life_years: ...
```

The noise is used for path-dependent market metrics, principally max drawdown.

The 5Y max-drawdown distribution is therefore **model-dependent**, not a forecast of historical realized volatility.

The exact OU discretization is an engine implementation detail; the economic semantics above are normative.

---

# 5. I5: quarterly revenue path

For each segment:

`g(t) = g_long + (g_init - g_long) * 2^(-t / half_life)`

with t in years.

Quarterly multiplier:

`Revenue_(q+1) = Revenue_q * (1 + g(t_q))^(1/4)`.

Annual revenue used by valuation/output is the sum of the four simulated quarters in that year.

This rule is identical across A/B existing segments.

For archetype C service segments, the same growth logic starts only after the service-onset quarter.

---

# 6. Distribution families

Engine families admitted by calibration v2:

- `triangular`
- `pert`
- `truncated_normal`
- `lognormal`
- `deterministic`

Schema v1.0 fixes the parameter names for G5:

- triangular: `min/mode/max`
- PERT: `min/mode/max`
- truncated normal: `mean/sigma/min/max`
- lognormal: `median/sigma`
- deterministic: `value`

Every distribution carries provenance.

**Acceptance caveat:** the supplied engine docstrings list the families but do not spell out all distribution-key names. These names must be checked once against the live `company_mc 2.3.0` loader before the schema becomes normative. This is the only A.2 point where the attachment does not fully specify the parser contract.

---

# 7. Numerical provenance

Every numerical calibration parameter must resolve to exactly one:

- `verified_fact`
- `derived_fact`
- `model_assumption`
- `owner_judgment`

Rules:

- `verified_fact` → source reference required;
- `derived_fact` → formula required;
- `model_assumption` → non-empty rationale required;
- `owner_judgment` → owner decision reference required.

For engine-native scalar fields, the schema adds a sibling `*_meta` object.

Example:

```yaml
growth_half_life_years: 2.5
growth_half_life_years_meta:
  provenance: model_assumption
  rationale: "..."
```

For a distribution, provenance is inside the distribution object and applies to its numerical shape parameters.

These metadata fields are validator/G5 metadata and do not change the numerical calculation.

This formalizes the tolerant metadata behavior already present in SPCX v1 calibration; if the live v2 loader rejects `*_meta`, that is an engine-loader defect and should be corrected in a new engine patch rather than removing provenance from the artifact.

---

# 8. Margin models

## 8.1 Mature positive margin

Required:
- current margin;
- Y5 terminal distribution;
- Y8 terminal distribution or `y5_plus_normal`;
- half-life;
- shock sigma/persistence;
- lower/upper bounds.

Current margin may be `verified_fact`/`derived_fact`.
Terminal distributions and mean-reversion parameters are normally `model_assumption`.

## 8.2 Direct FCF nodes

Nodes:
- Y1
- Y2
- Y3
- Y4 terminal fraction
- Y5 terminal margin
- Y8 terminal margin / rule

`monotonic: true`.

This is the generalized equivalent of the SPCX D3 node path.

## 8.3 OCF – capex decomposition

Separate node paths:

`ocf_margin_nodes`
and
`capex_revenue_nodes`.

At every simulated point:

`FCF margin = OCF margin - capex/revenue`.

This method is preferred for capital-intensive companies when both components are observable/modelable separately.

---

# 9. Piecewise valuation — archetypes A/B

Each horizon Y3/Y5/Y8 defines:

`basis + multiple distribution`.

Allowed basis:

- `FCF_multiple`
- `revenue_bridge`
- `EBITDA_multiple`

### FCF_multiple

`Equity_h = Annual_FCF_h * Multiple_h`

subject to the engine's equity-value convention.

### revenue_bridge

`Equity_h = Annual_Revenue_h * Multiple_h`

Used where FCF is not economically mature/stable.

### EBITDA_multiple

Approximation:

`EBITDA_margin ≈ FCF_margin + ebitda_margin_over_fcf`.

Then:

`Equity_h = Annual_EBITDA_h * Multiple_h`.

`ebitda_margin_over_fcf` is explicitly a model assumption unless derived from an independently calibrated bridge.

### negative_fcf_fallback

If the selected FCF/EBITDA basis is not valid because FCF at the horizon is negative, the engine must not multiply negative FCF by a terminal multiple.

It switches to:

`valuation.negative_fcf_fallback`

which in company_mc 2.3.0 is `revenue_bridge`.

---

# 10. valuation_basis and bridge_dependent

Every path/horizon stores a valuation basis.

Engine output basis families:

| Code | Meaning |
|---|---|
| 0 | multiple (`FCF_multiple` or `EBITDA_multiple`) |
| 1 | `revenue_bridge` |
| 2 | `negative_fcf_fallback` |
| 3 | `milestone_conditioned_EV` |
| 4 | `failure_residual` |

Output `valuation_basis_share` reports the fraction of paths using each family.

`bridge_dependent` is a diagnostic derived from the path-basis composition. It does not change states or decisions.

For the current SPCX parity run, Y3 is bridge-dependent because 100% of Y3 paths use the revenue bridge.

The engine attachments do not expose a separate configurable threshold for this boolean; therefore v1.1 defines no calibration field for such a threshold. The authoritative quantitative output is `valuation_basis_share`.

---

# 11. Reverse-Valuation gap diagnostics

Required calibration reference:

```yaml
reverse_valuation_ref:
  run_ref: ...
  implied_revenue_cagr_5y: ...
  discount_rate: ...
```

### RV Growth Gap

`RV_Growth_Gap = implied_revenue_CAGR_RV_5Y - median_revenue_CAGR_MC_5Y`

### Price Expectation Gap

Let:

`MedianPV_MC_5Y = median_MC_equity_value_5Y / (1 + discount_rate)^5`

Then:

`Price_Expectation_Gap = current_equity_value / MedianPV_MC_5Y`.

Interpretation:
- diagnostic only;
- no automatic Valuation-axis transition;
- not an optimization target for calibration.

The reverse-valuation stability class and `terminal_value_share_of_pv` remain authoritative in the referenced RV run under Reverse Valuation Rules v1.1; company_mc 2.3.0 only requires the two numeric fields above for gap calculations.

---

# 12. Robustness v1.1

The base calibration is perturbed along:

- growth modes;
- margin nodes;
- terminal multiples;
- factor correlations.

Per perturbation run the engine records:
- median CAGR 5Y;
- ΔP(2x,5Y);
- ΔP(loss>30%,5Y).

Pass rule:

1. sign of median CAGR 5Y is preserved in at least 75% of robustness runs; AND
2. both absolute probability deltas are within `delta_tolerance` in at least 75% of runs.

Default/current calibration convention uses `delta_tolerance = 0.10`.

The 75% fraction is an engine/methodology constant in v1.1 and is not a calibration field.

---

# 13. Joint Simulation Layer

Without an external Scenario Engine, BASE is used.

Joint Layer generates standardized driver shocks from common root-factor paths.

For a stochastic target:

1. take driver shock;
2. apply `lag_quarters`;
3. apply exponential/EMA decay with `decay_half_life_quarters`;
4. normalize/evaluate as effective shock in sigma units;
5. apply configured transform.

### Temporal application

- revenue growth targets: effective shock is applied quarter by quarter;
- scalar Y3 margin/multiple target: use effective shock at q12;
- scalar Y5 target: q20;
- scalar Y8 target: q32.

This engine interpretation is **approved for v1.1** because it makes scalar horizon targets conditional on the same temporal driver path without introducing a second arbitrary aggregation rule.

Supported A/B transforms in company_mc 2.3.0:
- `additive_pp`
- `multiplicative_pct`
- `log_multiplier`

Milestone slice additionally supports:
- `probability_logit_shift`
- `timing_quarters_shift`

`categorical_transition_probability_shift` is not admitted by calibration schema v1.0 because it is not documented as implemented in company_mc 2.3.0.

Unknown target paths such as `capacity_model.*` must be rejected by G5 for accepted calibration, even though the engine can return a `mapping_warning`. Accepted calibrations target only engine-known paths.

---

# 14. Structural support, knockout and adverse stress

`stochastic_targets` and `structural_support` remain different concepts.

### stochastic target

Defines path-to-path covariance/sensitivity.

### structural support

Defines how much of the **central calibration** is attributed to a favorable driver.

### knockout

`remove_structural_support`

removes the declared central contribution.

It is not equal to a −1σ stochastic shock.

`not_applicable` is allowed when the driver contributes no positive structural support.

### adverse_driver_stress

Applies a constant `driver_sigma` shock in the adverse direction through the normal mapping machinery.

---

# 15. Material-driver completeness

The accepted external material-driver rule remains:

- abs exposure == 2; or
- terminal-value sensitivity share >=10%; or
- 1σ shift changes median 5Y CAGR by >=1 pp; or
- driver participates in a critical/high failure mode.

Every material driver must have a native `driver_parameter_mapping` entry.

### Important engine alignment

The supplied company_mc 2.3.0 documents do **not** define a native:

`mapping_status: not_mapped`

field.

Therefore Calibration Schema v1.0 does not invent one.

A material driver with no applicable supported target is a calibration validation failure / methodology issue, not a silently accepted `not_mapped` record. If the owner wants explicit waivers inside calibration YAML, the engine/schema must be extended in a later version.

---

# 16. Archetype C — milestone model

## 16.1 Dependency graph

Milestones are evaluated in topological order.

A milestone becomes eligible only after all `requires` milestones succeed.

Own timing is a delay distribution in quarters.

Actual milestone time:

`max(prerequisite completion quarters) + own delay`.

## 16.2 Bernoulli and dependence

Each milestone has marginal success probability p.

The engine uses a latent execution component plus idiosyncratic noise so milestone successes are not independent.

This is **approved**.

The exact latent execution implementation is internal to `milestone_mc`; no additional calibration field beyond the common dependency/loading machinery documented by the engine is introduced in v1.1.

## 16.3 Failure branches

- `terminal_failure`: milestone and dependent branch do not complete;
- `delay_retry`: retry with calibrated retry probability after calibrated retry delay.

## 16.4 Revenue after service onset

Existing segments continue under ordinary segment-growth logic.

Service segments start only when `service_onset_milestone` is reached.

They specify:
- initial annual revenue;
- post-service growth;
- long-run Y8 growth;
- growth half-life.

## 16.5 Cash and dilution — engine interpretation C1

Before service onset:
- pre-service burn is drawn quarterly;
- available net cash is reduced.

If cash would fall below zero, the shortfall is treated as raised capital.

Existing-holder value is reduced by:

`raised * (1 + dilution_penalty)`.

### Decision on C1

**Approved for v1.1 as a reduced-form conservative dilution/financing proxy, not as an accounting identity or exact cap-table model.**

Reason:
- it preserves current engine behavior and deterministic comparability;
- it penalizes funding dependence without requiring a modeled future share price/share count;
- exact dilution depends on financing valuation and cannot be inferred from burn alone.

Constraints:
- `dilution_penalty >= 0`;
- value is `model_assumption` with rationale;
- sensitivity to this parameter should be examined for milestone-driven companies where external funding is material.

A later explicit financing/share-count model may replace C1 only with a new engine/spec version.

## 16.6 Archetype-C valuation hierarchy

At each horizon:

1. terminal failure → `failure_residual`
2. no service onset → `milestone_conditioned_EV`
3. service onset but service FCF margin < `fcf_maturity_margin` → `revenue_bridge`
4. mature service → `FCF_multiple`

### failure_residual

`NetCash_h + ReferenceValue * residual_on_failure`

### milestone_conditioned_EV

`NetCash_h + ReferenceValue * Σ(value_uplift of achieved milestones)`

G5 requires:

`Σ value_uplift <= 1`.

This avoids reference-value over-allocation across milestones.

---

# 17. State transitions are not native v2 calibration inputs

A critical alignment finding from the supplied attachments:

`state_transition_effects` exists in SPCX v1.0 calibration but is **not present in the documented company_mc 2.3.0 v2 calibration contract**.

Therefore Schema v1.0 intentionally excludes it.

Normative behavior today:
- base calibration corresponds to the confirmed current state vector;
- after a confirmed state transition, the calibration is regenerated/updated before the next normative run.

If the system needs dormant conditional deltas (for example SPCX C1→C2) to live inside the v2 YAML and be automatically applied when state changes, that is a real engine feature request and should be implemented as `company_mc >=2.3.1` with a versioned schema change.

The specification does not pretend that company_mc 2.3.0 already supports it.

---

# 18. Anti-double-counting

A single mechanism must not be applied simultaneously through:
- scenario driver mean shift;
- structural-support removal/addition;
- manual change to the same central growth/margin/multiple parameter;

unless an explicit methodology exception documents why the effects are economically distinct.

---

# 19. Determinism and portfolio-path alignment

For the same:
- calibration,
- engine version,
- global seed,
- path count/chunk convention,

the result is deterministic.

Joint paths use common `path_id`.

For portfolio aggregation all companies must share compatible:
- `global_seed`;
- chunk/path indexing;
- path count;
- Joint Layer regime.

A common seed without Joint Layer economic mappings does not create economically meaningful cross-company dependence.

---

# 20. G5 validation scope

`Company_MC_Calibration_Schema_v1.0.yaml` validates the document shape.

The artifact validator must additionally enforce the `x-g5-cross-rules`, including:
- material-driver completeness against `mpc_inputs.yaml`;
- supported target paths;
- transform/path compatibility;
- milestone DAG validity;
- uplift sum <=1;
- distribution ordering;
- PSD/correlation constraints;
- anti-circularity/provenance completeness.

The JSON Schema cannot express all external-file and graph constraints by itself.

---

# 21. Engine-alignment findings before B/C calibrations

Three points matter before accepting live calibrations:

1. **Distribution key names.** The attachments list distribution families but not every parser key. Schema v1.0 uses the conventional keys listed in §6. They must be checked once against the live loader.
2. **`state_transition_effects`.** Not native in the documented v2 contract. SPCX B cannot both be “pure v2 2.3.0” and have automatically applied dormant transition effects without an engine/schema extension.
3. **Explicit `not_mapped`.** Not native in 2.3.0. Accepted calibration should either map every material driver to a supported target or fail G5; explicit waiver needs a future version.

Everything else requested in A maps directly to documented company_mc 2.3.0 behavior.
