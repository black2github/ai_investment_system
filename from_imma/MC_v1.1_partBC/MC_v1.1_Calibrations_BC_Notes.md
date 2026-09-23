# MC v1.1 — Schema v1.0.1 + SPCX/NBIS/NVDA calibrations

Дата: 2026-09-23  
Статус: candidate artifacts for host `artifact_validator` + `reverse_valuation 1.2.0` + `company_mc 2.3.0`

## 1. Schema v1.0.1

Внесены **только три согласованные правки**:

1. `pert`: optional `lambda`, default движка `4.0`.
2. `truncated_normal`: `mean / sd`, а не `sigma`; `min/max` optional, отсутствие означает ±∞ в `dist_ppf`.
3. A/B/C fixtures явно помечены `shape_only`; robustness pass на них не утверждается.

Иных изменений в схеме v1.0 нет.

## 2. SPCX MC v1.1

Текущий state vector:

`A2 / B2 / C1 / D3`.

Flight 14 не произошёл в окне 22–23.09; перенос на 28.09 **не является переходом C1→C2**, поэтому ни один
условный transition effect не встроен в базовую калибровку.

### Что перенесено без изменения чисел из v1.0

- AI growth: `35 / 60 / 90%`, long-run `12 / 25 / 40%`, half-life 2.5Y.
- Connectivity: `12 / 25 / 40%`, long-run `6 / 12 / 20%`, half-life 2Y.
- Space: `5 / 18 / 35%`, long-run `5 / 12 / 25%`, half-life 3Y.
- direct FCF nodes:
  - Y1 `-110 / -75 / -45%`;
  - Y2 `-35 / -15 / +5%`;
  - Y3 `0 / 10 / 18%`;
  - Y4 fraction `55 / 70 / 85%`;
  - Y5 `20 / 27 / 34%`;
  - Y8 `Y5 + Normal(0, 3pp)` in native v2 form.
- valuation:
  - Y3 revenue bridge `8 / 14 / 22x`;
  - Y5 FCF `25 / 32 / 40x`;
  - Y8 FCF `20 / 27 / 35x`.
- market-path sigma `55%`, mean-reversion half-life 2Y.
- 500,000 paths; seed `20260920`; antithetic.

### Dependency translation

Legacy shared/rank dependence is replaced by `growth/margin/valuation + idiosyncratic shock`.

For segment growth loadings:
- AI 0.70;
- Connectivity 0.43;
- Space 0.21.

The latter two approximately preserve the old AI↔Connectivity `rho≈0.30` and AI↔Space `rho≈0.15`
as incomplete common-growth-factor dependence rather than shared rank.

Factor correlations:
- growth↔margin 0.45;
- growth↔valuation 0.20;
- margin↔valuation 0.35.

All are `model_assumption`.

### Reverse valuation reference

Authoritative run:
`20260920T183913Z-reverse_valuation-ab1fb7`.

- implied revenue CAGR 5Y = 76.2964%;
- discount rate = 11%;
- terminal value share of PV = 99.96%;
- Rules v1.1 class = **model_fragile**.

The last item is deliberately kept in the Markdown risk explanation rather than added to company_mc calibration fields.

### Legacy transition expectations — documentation only

They are **not** present in `SPCX_mc_calibration_v1.1.yaml`.

If a future verified state transition occurs, the calibration must be versioned/reissued before the next normative run.

Legacy expectations retained for recalibration context:

- `C1→C2`: AI growth shift `0 / 0 / +3pp`; Space growth `+2 / +5 / +10pp`; no margin/multiple premium from C2 alone.
- `C2→C3`: Space growth `+3 / +7 / +12pp`; margin from Y3 `0 / +2 / +5pp`.
- `D3→D4`: Y2 margin `-25 / -15 / -5pp`; Y3 `-20 / -10 / -5pp`; terminal margin `-8 / -5 / -2pp`.

### Joint mapping

Every non-zero SPCX MPC driver is mapped to a native `company_mc 2.3.0` target; no `not_mapped` waiver and no
unknown `capacity_model.*` target is used.

The first host comparison should use as historical baseline:
`20260922T062152Z-company_mc-e169f2`:
- median CAGR 5Y `-14.923%`;
- P(loss>30%,5Y) `0.96326`;
- P(loss>50%,5Y) `0.669762`;
- ES5 `-0.73608`;
- median Y5 equity value `$897.22B`;
- robustness `pass=true`.

Because the v1.1 document now activates Joint driver mappings, zero-mean driver paths can change dispersion and
nonlinear medians slightly even though all legacy segment/margin/multiple central numbers are unchanged.
Flight 14 itself causes **no** numerical state change because C1 remains C1.

## 3. NBIS Reverse Valuation v1.0

State vector:

`N3 / E3 / Capacity_Secured=pending_verification / K3 / F2`.

Verified/derived base inputs:

- price: `$236.12`, close 2026-09-22, Yahoo;
- shares: `271,855,218` as of 2026-06-30;
- equity value: `$64.190B`;
- TTM revenue: `$1.3551B`;
- H1 FCF proxy: `4.5041 - 8.1303 = -$3.6262B`;
- current H1 FCF margin: `-3.6953`;
- net debt: `$503.6M`.

Model assumptions:
- discount `12%`, stress `10–15%`;
- terminal FCF margin `18 / 25 / 32%`;
- FCF multiple `22 / 28 / 34x`;
- margin path `Y1 -75% → Y2 -10% → Y3 +10% → Y4 70% terminal → Y5 terminal`.

This is deliberately a K3 normalization model, not an extrapolation of H1 OCF, which is heavily affected by customer prepayments.

### Local deterministic preflight

Using the documented Reverse Valuation v1.0 equation:

- implied revenue CAGR 5Y = **64.303%**;
- terminal value share of PV = **1.003995**;
- expected Rules v1.1 stability class = **model_fragile**.

The share exceeds 1.0 because negative discounted interim FCF offsets part of terminal PV; this is economically
possible under the metric definition and is a strong model-risk flag.

`NBIS_mc_calibration_v1.0.yaml` temporarily references this local preflight as
`PENDING_HOST_RUN:NBIS_calibration_v1.0.yaml`. On acceptance, replace only `run_ref` with the authoritative sidecar
run ID; the expected CAGR/discount-rate fields should be checked against that run.

## 4. NBIS MC v2

Archetype: `capital_intensive_transition`.

### Revenue

Q2 base:
- AI cloud `$574.9M`;
- Other/residual `$7.4M = 582.3 - 574.9`.

AI starting annual growth is `70 / 120 / 180%`: materially below reported 514% YoY while still representing N3
contracted scale.

### Margin

Chosen method: **`ocf_capex_decomposition`**, because Q2/H1 disclose both OCF and purchases of PPE/intangibles.

Median FCF-margin path implied by component medians:
- Y1 `1.50 - 2.30 = -80%`;
- Y2 `0.75 - 0.85 = -10%`;
- Y3 `0.50 - 0.40 = +10%`;
- Y4 `0.46 - 0.28 = +18%`;
- Y5 `0.44 - 0.22 = +22%`;
- Y8 `0.40 - 0.15 = +25%`.

Thus the MC cash path remains consistent with the independent Reverse Valuation normalization without duplicating
an independent FCF distribution.

### Valuation

- Y3 revenue bridge `8 / 12 / 16x`;
- Y5 FCF `22 / 28 / 34x`;
- Y8 FCF `17 / 22 / 28x`;
- negative-FCF fallback `5 / 8 / 12x revenue`.

All 13 non-zero MPC drivers are mapped to native targets. Failure-mode links remain in mapping `note`, not in new fields.

## 5. NVDA Reverse Valuation v1.0

State vector:

`D4 / M3 / B4 / S2 / X2`.

Base inputs:
- price `$228.87`, close 2026-09-22;
- shares `24.1B` as of 2026-08-21 (10-Q reports the value rounded);
- derived equity value ≈ `$5.515767T`;
- TTM revenue `$302.970B`;
- H1 company-defined FCF `$69.895B`;
- H1 FCF margin `0.3930`;
- net cash `$23.220B`.

Model assumptions:
- discount `10%`, stress `8–13%`;
- terminal FCF margin `30 / 36 / 42%`;
- FCF multiple `20 / 25 / 30x`;
- short mature margin normalization: `108% / 105% / 102%` of terminal in Y1/Y2/Y3, terminal from Y4.

### Local deterministic preflight

- implied revenue CAGR 5Y = **23.710%**;
- terminal value share of PV = **0.889398**;
- expected Rules v1.1 stability class = **terminal_dependent**.

As for NBIS, authoritative class/run ID belongs to the host `reverse_valuation 1.2.0` run.

## 6. NVDA MC v2

Archetype: `mature_positive_margin`.

Segments:
- Data Center `$89.023B/Q`;
- Other `$7.198B/Q = 96.221 - 89.023`.

Starting growth:
- Data Center `45 / 65 / 90%`;
- Other `8 / 18 / 30%`.

Margin:
- current H1 FCF margin `0.3930`;
- Y5 terminal `30 / 36 / 42%`;
- Y8 terminal `28 / 34 / 40%`;
- mean-reversion half-life 2Y;
- execution shock sigma 3.5pp, persistence 0.45;
- bounds 18–50%.

Valuation:
- Y3 FCF `24 / 30 / 36x`;
- Y5 `20 / 25 / 30x`;
- Y8 `17 / 22 / 27x`;
- negative-FCF revenue fallback `5 / 7 / 10x`.

All 13 non-zero MPC drivers are mapped to native targets. The six ±2 drivers requested in the order
(AI_COMPUTE_DEMAND, HYPERSCALER_CAPEX, ADVANCED_PACKAGING, HBM_MEMORY, DATA_CENTER_POWER, TAIWAN_SUPPLY)
receive explicit structural/sensitivity treatment; ±1 drivers remain mapped as smaller stochastic channels.

## 7. Provenance / anti-circularity

No MC growth, margin, milestone, loading or multiple parameter was solved from the current share price.

Price enters only:
- RV inversion;
- company_mc runtime `equity_value_0`;
- return/gap diagnostics.

Company guidance is not written as actual.

Every numerical MC calibration parameter is typed through distribution provenance or sibling `*_meta`.

## 8. Local validation performed

- SPCX_mc_calibration_v1.1.yaml: JSON Schema PASS
- NBIS_mc_calibration_v1.0.yaml: JSON Schema PASS
- NVDA_mc_calibration_v1.0.yaml: JSON Schema PASS
- fixture A: shape_only schema PASS
- fixture B: shape_only schema PASS
- fixture C: shape_only schema PASS
- SPCX: factor-correlation PSD PASS (min eigenvalue 0.5152)
- NBIS: factor-correlation PSD PASS (min eigenvalue 0.5444)
- NVDA: factor-correlation PSD PASS (min eigenvalue 0.6328)
- SPCX: all non-zero MPC drivers mapped; active_drivers alignment PASS
- NBIS: all non-zero MPC drivers mapped; active_drivers alignment PASS
- NVDA: all non-zero MPC drivers mapped; active_drivers alignment PASS
- SPCX: state_transition_effects absent from v2 YAML PASS
- NBIS_calibration_v1.0.yaml: YAML parse PASS
- NVDA_calibration_v1.0.yaml: YAML parse PASS

Reverse Valuation preflight is a local implementation of the published equation, **not** a sidecar run.

## 9. Required host acceptance checks

This environment does not contain the private live `company_mc 2.3.0` / `reverse_valuation 1.2.0` service, so I do
not claim host run IDs, `mapping_warnings=[]`, determinism or robustness pass for B/C.

On your side, acceptance sequence should be:

1. `artifact_validator calibration` against Schema v1.0.1 + MC-G5-001…012.
2. Run NBIS/NVDA reverse valuation; replace the two `PENDING_HOST_RUN:*` references with authoritative run IDs.
3. `company_mc 2.3.0`, same seed twice → hashes/key metrics identical.
4. Confirm `mapping_warnings=[]`.
5. Confirm robustness v1.1 `pass=true`.
6. SPCX: compare with `...-e169f2`; investigate only deltas caused by native v2 dependency/joint-mapping form because state remains C1.
