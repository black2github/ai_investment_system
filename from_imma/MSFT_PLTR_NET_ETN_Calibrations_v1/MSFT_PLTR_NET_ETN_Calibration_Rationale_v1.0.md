# IMMA — MSFT / PLTR / NET / ETN Calibration Rationale v1.0

Date: 2026-09-24
Status: proposed for host acceptance

## 1. Normative basis

- Company MC Calibration Schema 1.0.2; `calculation_engine_version` intentionally remains `company_mc 2.3.1` because this is the schema const. The host may execute 2.3.2; its stated delta is only ticker-specific RNG seeding, not valuation semantics.
- Conditional MC 1.1.3: archetype selection by cash-flow anchor, parity-gated bridge/FCF transition, local robustness 0.25σ.
- Joint Layer Rules 1.1.2: MC-G5-013 is measured aggregate sigma. `Σ|effect|` below is only a conservative/descriptive screen, never the acceptance criterion.
- Reverse Valuation Rules 1.1: RV is diagnostic; assumptions are not fitted to the quoted market price.

## 2. Explicit fork decisions

### MSFT — archetype A retained

Q4 cash capex is ~39.8% of revenue, but Q4 GAAP cash flow still gives positive FCF of about 21.8% of revenue. Therefore the positive cash-margin anchor is economically meaningful and the model remains `mature_positive_margin` (A), rather than switching to B solely because capex intensity is high. Capex normalization is expressed in the margin path and in the negative HYPERSCALER_CAPEX mapping.

### PLTR — SBC / dilution treatment

The anchor is GAAP-defined FCF (`OCF − PP&E`), not adjusted FCF. H1 2026 GAAP-defined FCF margin is ~58.7%. SBC is not added back a second time and no adjusted-FCF margin is used. Long-run dilution/SBC economics are represented as a reduced-form normalization of terminal cash margin (Y5 mode 36%, Y8 mode 32%) plus unusually broad valuation-multiple tails. This avoids inventing a future share-count path. If SBC/revenue or net share issuance remains structurally elevated, the calibration must be patched rather than silently absorbed.

### NET — FCF margin and archetype

Q2 GAAP-defined FCF is positive: approximately 56.384M on 696.061M revenue, or ~8.1%. Therefore NET remains archetype A. H1 FCF margin (~10.5%) is only a cross-check; the current MC anchor is the latest-quarter ~8.1% so the calibration stays consistent with P1. Workers/AI is not modeled as a separate segment because the company does not separately disclose that revenue/ARR.

### ETN — perimeter

Boyd Thermal and Ultra PCS are already closed and are inside the current perimeter. Mobility remains inside the calibration until the Reverse Morris Trust actually closes because current reported revenue/equity still includes that economic claim. The RMT close is a recalibration event; no standalone Mobility consideration is invented. `RestAerospaceMobility` therefore uses Q2 Aerospace + Mobility revenue.

## 3. Reverse Valuation preflight

Local deterministic preflight uses the normative equation only; host `reverse_valuation 1.2.0` run IDs remain authoritative.

| Ticker | Implied revenue CAGR 5Y | Terminal value share | Stability |
|---|---:|---:|---|
| MSFT | 18.14% | 0.894 | terminal_dependent |
| PLTR | 58.85% | 0.935 | terminal_dependent |
| NET | 66.92% | 0.957 | model_fragile |
| ETN | 20.11% | 0.894 | terminal_dependent |

NET is intentionally `model_fragile` in RV because current equity value combined with thin present cash margin makes the 5Y reverse solution terminal-dominated. This is a model-risk flag, not a reason to change the operating calibration or fit a higher terminal margin.

## 4. MC distribution design

All four use broad intrinsic growth/margin/multiple tails before Joint Layer mappings. Modes are operating assumptions anchored to disclosed growth/cash economics and explicit mean reversion. The A-band for intrinsic W (0.25–0.50) is a diagnostic warning band, not a fitting target; authoritative W is left to the host engine.

Bridge-reference multiples are treated as primary valuation parameters under schema ≥1.0.2: MSFT 6.5x vs 26x FCF (parity ~25%), PLTR 11x vs 30x (~36.7%), NET 5.5x vs 28x (~19.6%), ETN 3.1x vs 22x (~14.1%). These parities are deliberately near the Y5 cash-margin centers, so the crossover is economically continuous rather than an emergency fallback.

## 5. Driver materiality decisions


### MSFT

Mapped material drivers: AI_COMPUTE_DEMAND, HYPERSCALER_CAPEX, CLOUD_SOFTWARE_DEMAND, DATA_CENTER_POWER, AI_CLOUD_PRICING, ADVANCED_PACKAGING, HBM_MEMORY, TAIWAN_SUPPLY.

Explicit non-material decisions:
- `GOVERNMENT_DEFENSE` — ±1; no ≥10% terminal sensitivity or high/critical direct failure-mode dependence in current registry.
- `INTEREST_RATES` — −1; valuation sensitivity represented in intrinsic multiple tails; no separate material mapping at current sizing.
- `ACQUISITION_INTEGRATION` — +1; no acquisition currently dominates MSFT terminal economics.
- `ELECTRIFICATION_GRID` — ±1 candidate but secondary to DATA_CENTER_POWER for MSFT as buyer.
- `UTILITY_CAPEX` — ±1 candidate but secondary to DATA_CENTER_POWER.
- `DIGITAL_AD_DEMAND` — ±1; advertising is not a dominant modeled segment/terminal driver.

### PLTR

Mapped material drivers: CLOUD_SOFTWARE_DEMAND, GOVERNMENT_DEFENSE, AI_COMPUTE_DEMAND.

Explicit non-material decisions:
- `INTEREST_RATES` — −1; captured in broad intrinsic valuation tails, not ≥10% terminal share driver.
- `CAPITAL_MARKETS` — +1; direct operating linkage is secondary for current contracted enterprise/government demand.
- `INDUSTRIAL_RESHORING` — +1; demand linkage is diffuse and not a high/critical failure mode.
- `GOVERNMENT_CONTRACT_COMPLIANCE` is a critical failure mode but is not synthesized as a new stochastic root: no canonical taxonomy driver/event probability is supplied. Attaching it to `GOVERNMENT_DEFENSE` would conflate demand with compliance. It remains trigger/recalibration risk; broad intrinsic government-growth/valuation tails are not claimed to be its calibrated event probability.

### NET

Mapped material drivers: AI_COMPUTE_DEMAND, CLOUD_SOFTWARE_DEMAND, AI_CLOUD_PRICING.

Explicit non-material decisions:
- `HYPERSCALER_CAPEX` — +1; competition/cost linkage is indirect and secondary to AI_COMPUTE_DEMAND/CLOUD_SOFTWARE_DEMAND.
- `DATA_CENTER_POWER` — +1; Cloudflare does not bear hyperscaler-scale owned-capacity power capex in the same way; secondary operating channel.
- `INTEREST_RATES` — −1; captured by intrinsic valuation tails.
- `CAPITAL_MARKETS` — +1; no direct ≥10% terminal channel.
- `INTERNET_INFRASTRUCTURE_OUTAGE` is critical but has no canonical root/event probability in the supplied taxonomy. A synthetic outage knockout would invent frequency/severity. Therefore no native knockout shift is added in v1.0; outage evidence must trigger recalibration/decision workflow. Intrinsic tails are not claimed to encode outage probability.

### ETN

Mapped material drivers: HYPERSCALER_CAPEX, DATA_CENTER_POWER, ACQUISITION_INTEGRATION, ELECTRIFICATION_GRID, UTILITY_CAPEX, INDUSTRIAL_RESHORING, AI_COMPUTE_DEMAND.

Explicit non-material decisions:
- `SEMICONDUCTOR_WFE` — +1; semiconductor fabs are a subset of broader industrial/electrical demand, not a dominant direct terminal driver.
- `GOVERNMENT_DEFENSE` — +1; aerospace/defense exposure is material operationally but below current portfolio-level material-driver threshold for this calibration.
- `INTEREST_RATES` — −1; broad multiple/debt tails capture rate sensitivity; no separate ≥10% driver mapping.
- `AEROSPACE_CYCLE` — +1; Rest segment is only part of revenue and does not dominate terminal value.

## 6. Local robustness v1.1.2

| Ticker | growth modes | margin nodes | terminal multiple | corr |
|---|---:|---:|---:|---:|
| MSFT | ±0.02470 | ±0.01521 | -0.0604 / +0.0642 | ±0.15 |
| PLTR | ±0.06257 | ±0.01954 | -0.0715 / +0.0771 | ±0.15 |
| NET | ±0.02826 | ±0.01954 | -0.0733 / +0.0791 | ±0.15 |
| ETN | ±0.02555 | ±0.01032 | -0.0568 / +0.0602 | ±0.15 |

The perturbation magnitudes are fully recalculated from each company’s own distributions using v1.1.2 `0.25 × sigma_reference` with ceilings. The actual probability-response pass requires the host company_mc run.

## 7. MC-G5-013 preflight

All mapped instantaneous effect sizes were intentionally kept below the dimensional hard caps by wide margin. The validation report records `Σ|effect|` per target only as a descriptive screen. This does **not** replace MC-G5-013: host validator 1.6.0 must reproduce root correlations, persistence, lag, decay and transforms and measure aggregate sigma.

## 8. Provenance / anti-circularity

- Market prices use the order-provided dated closes only to calculate `equity_value_0` for reverse valuation. They do not set growth/margin/multiple modes.
- Company facts come from the supplied registry source URLs (SEC filings / issuer IR).
- Company guidance (for example ETN FY2026 organic growth 11–13%) remains guidance, not actual.
- Any later Dozor v1.2.1 discrepancy is a calibration patch input; it is not silently normalized.

## 9. Host acceptance requested

Run: RV → validator 1.6.0 / schema 1.0.2 → MC-G5-001…013 → dry-run/mapping warnings/determinism → intrinsic/full W → local robustness v1.1.2 → stress diagnostic → normative 500k with seed 20260920. Replace each `PENDING_HOST_RUN:*` with the authoritative RV run_ref only after host acceptance.
