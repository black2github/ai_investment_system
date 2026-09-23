# HOOD + RKLB Calibration Notes

Дата: 2026-09-23  
Статус: candidate calibrations for host validation  
Normative engine: `company_mc 2.3.0`  
Schema: `Company_MC_Calibration_Schema v1.0.1`

## 1. Общий принцип

Калибровки не подгонялись к текущей цене. Цена используется только в Reverse Valuation и затем в runtime
`equity_value_0` / диагностике Price_Expectation_Gap.

Для обеих компаний использован close 18.09.2026 из переданного workspace:
HOOD `$119.82`, RKLB `$64.57`. Это сохраняет одну дату с текущим portfolio snapshot.

До живого Dozor-run по HOOD/RKLB факты считаются принятыми company artifacts + host-check. Если Dozor изменит
использованный KPI, применяется patch calibration без изменения методологической версии.

## 2. HOOD Reverse Valuation

State vector: `S3 / R3 / P3 / C1 / G2`.

Equity shares = `790M Class A + 109M Class B = 899M`.

TTM revenue = `4,473M FY2025 + 2,375M H1'26 - 1,916M H1'25 = 4,932M`.

### Нормализованный economic FCF

GAAP OCF Robinhood нельзя механически использовать как FCF: он включает крупные изменения segregated cash,
receivables/payables to users, securities borrowed/loaned и другие brokerage financing balances.

Поэтому current margin строится от net income и ordinary operating adjustments, исключая эти financing flows.
SBC остаётся экономическим расходом и **не добавляется обратно**.

H1 normalized CFO:
`919 + 46 + 92 + 2 - 106 - 23 + 4 - 65 - 186 + 73 - 2 + 166 = 920M`.

После PPE 21M и capitalized software 21M:
`FCF = 878M`, margin = **36.968%**.

RV assumptions:
- discount 11%, stress 9–14%;
- terminal FCF margin 28/34/40%;
- terminal FCF multiple 16/22/28x;
- short mature normalization 36% → 35% → 34%.

Local equation preflight:
- implied revenue CAGR 5Y = **34.518%**;
- terminal value share = **0.8952**;
- expected class = **terminal_dependent**.

## 3. HOOD MC

Archetype: `mature_positive_margin`.

`EventContracts` выделен отдельно: Q2 revenue 156M ≈12% total revenue и >10x YoY, но продукт имеет отдельный
регуляторный failure mode, поэтому он не превращён в постоянный структурный growth factor.

Segments:
- CyclicalTrading = `776 - 156 = 620M`;
- EventContracts = `156M`;
- NetInterest = `389M`;
- SubscriptionOther = `143M`.

Centers initial growth:
- CyclicalTrading 18%;
- EventContracts 20%, tails −40%…+100%;
- NetInterest 6%;
- SubscriptionOther 20%.

Current margin = normalized economic FCF margin **36.968%**.
Y5 margin 26/34/42%, Y8 24/32/40%.
FCF multiples: Y3 18/24/30x; Y5 16/22/28x; Y8 14/20/26x.

Mapped all seven non-zero MPC drivers:
`CLOUD_SOFTWARE_DEMAND, INTEREST_RATES, CAPITAL_MARKETS, ACQUISITION_INTEGRATION,
CONSUMER_CREDIT, CRYPTO_CYCLE, FINTECH_REGULATION`.

Crypto maps to CyclicalTrading, not EventContracts. FINTECH_REGULATION directly maps to EventContracts,
margin and valuation.

Local robustness v1.1.2:
- growth `[-0.0353015, 0.0353015]`;
- margin `[-0.00868629, 0.00868629]`;
- multiple `[-0.02931379, 0.03019904]`.

## 4. RKLB Reverse Valuation

State vector: `E2 / N1 / S3 / B3 / C2`.

Common-equivalent economic shares:
`598,180,438 common + 40,951,250 participating convertible preferred = 639,131,688`.

TTM revenue:
`601.799 + 434.414 - 267.067 = 769.146M`.

H1 FCF proxy:
`-134.407M OCF - 53.112M PPE/software = -187.519M`,
margin = **-43.166%**.

Net cash before acquisition commitments:
`2,387.590M cash+securities - 14.845M debt = 2,372.745M`.

RV:
- discount 12.5%, stress 10–16%;
- terminal FCF margin 12/20/28%;
- terminal multiple 18/24/30x;
- Y1 −35%, Y2 −15%, Y3 0%, Y4 60% terminal, Y5 terminal.

Local preflight:
- implied revenue CAGR 5Y = **82.407%**;
- terminal value share = **1.0025**;
- expected class = **model_fragile**.

## 5. RKLB MC — первый live archetype C

Existing segments:
- Launch: Q2 44.6M; Q2 YoY −4%, H1 launch revenue вырос примерно 32%;
- SpaceSystems: Q2 189.5M, +94% YoY; H1 +76%.

Service segment:
- `Neutron`, появляется после `NEUTRON_FIRST_ORBITAL`.

Собственная спутниковая группировка **не включена** как milestone: в принятой company model нет достаточной
канонической оси/KPI/trigger для выделения такого value branch.

### Milestone DAG

1. `NEUTRON_FIRST_ORBITAL`: p=0.72, timing 1/2/4 quarters, uplift 0.30, `delay_retry`.
2. `NEUTRON_REPEAT_FLIGHT`: requires first orbital, p=0.75, timing 1/2/4, uplift 0.25, `delay_retry`.
3. `NEUTRON_REUSE_CADENCE`: requires repeat flight, p=0.55, timing 2/5/8, uplift 0.20, `terminal_failure`.

Company statement о target delivery Stage-1 tank to launch pad in Q4 2026 и narrowing end-2026 launch window
трактуется как company_guidance, не actual date.

Value uplift sum = 0.75.

### Cash / valuation

Pre-service burn 70/100/160M per quarter anchored to H1 FCF burn ≈93.8M/quarter, но остаётся model_assumption.

`dilution_penalty=0.20` — accepted reduced-form financing proxy.

Pre-maturity revenue bridge 4/7/11x; mature FCF multiple 18/24/30x; FCF maturity threshold 8%.

## 6. Proposed milestone dimensional limits — B.3

Для первого archetype-C предлагаю после host-run закрепить в `Joint_Simulation_Layer_Rules v1.1.2`:

**Probability target**
- измерять aggregate σ в **logit-space**;
- hard cap: `σ[Δlogit(p)] <= 0.35`;
- design headroom: `<= 0.25`.

При p≈0.5–0.8 hard cap порядка 6–9 п.п. вероятности на 1σ, но естественно сжимается у границ.

**Timing target**
- native unit: quarter shift;
- hard cap: `σ[Δ timing] <= 1.0 quarter`;
- design headroom: `<= 0.75 quarter`.

Смысл: общий Joint Layer может сдвигать timing примерно на квартал, но не должен сам создавать многолетний
технический delay; такой риск живёт в timing distribution, delay_retry и terminal_failure.

Measurement идентичен MC-G5-013: actual Joint paths, correlations, persistence, lag, decay, сумма mappings по цели.
`Σ|effect|` — descriptive only.

До принятия caps RKLB mappings консервативны: probability effect 0.02–0.035 logit per driver,
timing 0.08–0.12 quarter per driver.

## 7. RKLB robustness v1.1.2 — provisional C interpretation

Для первого live C case materialized local robustness:
- growth σref = revenue-weighted RMS σ_eq existing-segment initial growth;
- margin σref = σ_eq Neutron Y5 service margin;
- multiple σref = log-space σ_eq `multiple_fcf`;
- perturbation = 0.25σ с accepted ceilings.

Получилось:
- growth `[-0.0366982, 0.0366982]`;
- margin `[-0.01085786, 0.01085786]`;
- multiple `[-0.02688411, 0.02762683]`.

Если live C run покажет, что такой reference плохо отражает milestone-conditioned economics, это повод для
отдельной методологической версии, а не для подгонки RKLB.

## 8. Local validation

- HOOD_mc_calibration_v1.0.yaml: Schema v1.0.1 PASS
- RKLB_mc_calibration_v1.0.yaml: Schema v1.0.1 PASS
- HOOD: all non-zero MPC drivers mapped and active_drivers aligned PASS
- RKLB: all non-zero MPC drivers mapped and active_drivers aligned PASS
- RKLB milestone DAG references/value_uplift sum PASS

Локально не утверждаются host-only checks:
- `mapping_warnings=[]`;
- measured MC-G5-013 σ;
- intrinsic/full W;
- robustness pass;
- authoritative RV run IDs;
- 500k convergence/determinism.

## 9. Host acceptance sequence

1. RV HOOD/RKLB → заменить `PENDING_HOST_RUN:*`.
2. calibration validator / G5.
3. measured MC-G5-013 growth/margin/log-multiple.
4. RKLB: отдельно measured aggregate σ probability-logit и timing-quarter targets.
5. intrinsic/full W.
6. local robustness v1.1.2.
7. old absolute stress grid — diagnostic only.
8. 500k deterministic production run.
