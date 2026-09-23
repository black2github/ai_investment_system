# LLY + META + ASML — Calibration Notes

Дата: 2026-09-24  
Статус: candidate calibrations until host acceptance  
Schema: `Company_MC_Calibration_Schema v1.0.2`  
Engine: `company_mc 2.3.1`  
Simulation: `500000 paths / seed 20260920 / antithetic=true`

## 1. Общая методика

Все calibration centers заданы из operating evidence и model assumptions; текущая рыночная цена не использовалась для подбора growth/margin/multiple.

Reverse Valuation использует цену только как market-implied constraint. `Price_Expectation_Gap` остаётся выходной диагностикой.

Все ненулевые MPC drivers получили native mapping. Waiver `not_mapped` не использован.

Joint effects намеренно консервативны перед host MC-G5-013: persistent AR(1)+decay может усиливать одиночный `effect_per_plus_1sigma`.

Intrinsic distributions сразу шире ранних v1.0 HOOD-калибровок, чтобы company-specific uncertainty не переносилась в Joint Layer только ради достижения W-band.

## 2. LLY — mature_positive_margin

State vector:

`D4 / P3 / M2 / R3 / F3`.

### Reverse Valuation

Market:
- 18.09.2026 close: `$1,152.93`;
- shares outstanding: `941,357,065` as of 03.08.2026;
- equity value: `$1085.319B`.

TTM revenue:

`65.179 + 42.773 - 28.286 = 79.666B USD`.

Current simple FCF margin:

`(16.023 OCF - 5.259 PP&E capex) / 42.773 = 25.17%`.

RV assumptions:
- discount `8.0 / 9.5 / 12.5%`;
- terminal FCF margin `23 / 30 / 37%`;
- terminal FCF multiple `18 / 25 / 32x`;
- mature-capex path: 26% → 28% → 29% → 30%.

Local equation preflight:
- implied revenue CAGR 5Y = **20.627%**;
- terminal value share = **0.8931**;
- expected class = **terminal_dependent**.

Patent/exclusivity rationale is explicit: the 2025 10-K lists Mounjaro/Zepbound compound patents through 2036 U.S., 2037 major Europe, 2040 Japan. The 5Y terminal is before that cliff; the Y8 MC multiple is compressed because the persistence horizon gets closer.

### MC segments

`Tirzepatide`:
- base Q2 revenue 14.871B;
- actual YoY +73.3%;
- consolidated price contribution -13%, volume +60%;
- initial growth `5 / 35 / 80%`;
- long-run Y8 `-5 / 12 / 28%`.

`RestOfPortfolio`:
- base Q2 = `22.974 - 14.871 = 8.103B`;
- initial `-10 / 10 / 30%`;
- long-run `-5 / 6 / 18%`.

Orforglipron is **not** a separate segment in v1.0: the accepted KPI confirms a next-generation milestone, but no separately disclosed commercial revenue base exists in the supplied company artifacts. Pipeline upside therefore lives in RestOfPortfolio distributions + `DRUG_PIPELINE` mapping, not in an invented zero-base segment or archetype-C milestone.

Margin:
- current 25.17%;
- Y5 `20 / 31 / 40%`;
- Y8 `18 / 28 / 37%`.

Valuation:
- Y3 `18 / 28 / 38x`;
- Y5 `16 / 25 / 34x`;
- Y8 `12 / 20 / 28x`;
- revenue-bridge reference `3 / 6 / 10x`.

Local robustness v1.1.2:
`growth [-0.03540712, 0.03540712]; margin [-0.0108756, 0.0108756]; multiple [-0.03864506, 0.04019853]`.

All nine non-zero drivers are mapped. `REIMBURSEMENT_PRICING` and `PATENT_EXCLUSIVITY` primarily affect franchise growth, cash margin and valuation duration rather than a generic total-growth shock.

## 3. META — capital_intensive_transition

State vector:

`A3 / U2 / P2 / C3 / R3`.

### Reverse Valuation

Market:
- 18.09.2026 close `$665.75`;
- shares = `2,205,128,509 Class A + 342,377,716 Class B = 2,547,506,225`;
- equity value = `$1.696T`.

TTM revenue:

`200.966 + 117.111 - 89.830 = 228.247B USD`.

Latest-quarter FCF margin:

`0.784 / 60.801 = 1.29%`.

This is intentionally not treated as a mature anchor: Q2 capex including finance-lease principal was 31.08B = 51.1% of revenue.

RV:
- discount `8.0 / 9.5 / 12.5%`;
- terminal FCF margin `18 / 25 / 32%`;
- multiple `17 / 24 / 31x`;
- path 8% → 15% → 20% → 23% → 25%.

Local preflight:
- implied revenue CAGR 5Y = **12.029%**;
- TV share = **0.9051**;
- expected class = **terminal_dependent**.

### MC

Segments:
- Advertising: 59.363B Q2, actual ~+27% YoY; initial `5 / 20 / 38%`;
- Other_RL: 1.438B residual; initial `-25 / 8 / 45%`.

Advertising rationale keeps impressions (+14%) and price (+12%) as two operating drivers of one revenue segment rather than fake independent revenue segments.

`ocf_capex_decomposition`:
- Q2 implied OCF margin ≈ 52.41%;
- capex nodes center: 50% Y1 → 38% Y2 → 30% Y3 → 22% Y5 → 18% Y8;
- OCF nodes center: 50% → 49% → 48% → 46% → 43%.

Company 2026 capex outlook `$130–145B` is used only as **company_guidance** in rationale, not as actual.

Valuation:
- Y3 explicit revenue bridge `4 / 8 / 13x`;
- Y5 FCF `17 / 25 / 34x`;
- Y8 `14 / 21 / 29x`;
- crossover bridge reference `3 / 6 / 10x`.

The 6x center is an economic reference, not a price-fit: at a ~24% FCF margin, 25x FCF is ~6x revenue, reducing artificial parity-cliff risk under 2.3.1.

Local robustness:
`growth [-0.0186658, 0.0186658]; margin [-0.01693688, 0.01693688]; multiple [-0.03601179, 0.03735708]`.

All 11 non-zero MPC drivers are mapped. The seven ±1 drivers are retained with small effects rather than silently waived.

## 4. ASML — mature_positive_margin, EUR

State vector:

`D3 / E3 / M3 / X1 / I3`.

**Calibration currency is EUR throughout.** Portfolio USD FX translation is outside this company calibration.

Market:
- Euronext Amsterdam close 18.09.2026: `€1,446.00`;
- issued/outstanding shares at 28.06.2026: `384.1M`;
- equity value = **€555.409B**.

TTM sales:

`32.6673 + 18.0934 - 15.4332 = 35.3275B EUR`.

### Normalized FCF bridge

Raw H1 OCF was `-0.4815B`, but H1 working-capital/tax timing movements totalled `-6.7791B`, dominated by receivables and contract liabilities.

Normalized OCF before those timing movements:

`-0.4815 - (-6.7791) = 6.2976B`.

Less:
- PP&E `0.7018B`;
- intangible purchases `0.0923B`;

normalized economic FCF = `5.5035B`, margin = **30.42%**.

This is a derived normalization, not a company KPI. Raw H1 cash flow remains visible in the formula.

RV:
- discount `8.0 / 9.5 / 12.0%`;
- terminal margin `23 / 30 / 37%`;
- multiple `17 / 24 / 31x`.

Local preflight:
- implied revenue CAGR 5Y = **25.126%**;
- TV share = **0.8923**;
- expected class = **terminal_dependent**.

ASML-KPI-02 (`€43–45B` FY2026 outlook, midpoint €44B) is treated only as **company_guidance** in rationale. It is not used as an actual base-period fact.

### MC segments

Technology mix is disclosed semiannually, so system segment bases use H1/2 average quarterly values:

- EUV Systems: `(EXE 1.1889 + NXE 6.7085)/2 = 3.9487B EUR/q`;
- DUV Systems: `(ArFi 3.3317 + ArF dry 0.3673 + KrF 0.7726 + I-line 0.1131)/2 = 2.2924B`;
- Metrology & Inspection: `0.1810B`;
- Installed Base Management: `2.6246B`.

This avoids misclassifying metrology as DUV while still keeping the requested economic blocks visible.

Centers:
- EUV initial 22%;
- DUV 5%;
- Metrology 10%;
- IBM 15%.

Margin:
- normalized current 30.42%;
- Y5 `20 / 30 / 39%`;
- Y8 `18 / 28 / 36%`.

Valuation:
- Y3 `18 / 28 / 38x`;
- Y5 `16 / 24 / 32x`;
- Y8 `13 / 20 / 28x`;
- crossover bridge reference `3 / 6 / 9x`.

Local robustness:
`growth [-0.02676631, 0.02676631]; margin [-0.01031963, 0.01031963]; multiple [-0.0357927, 0.03712137]`.

All 11 non-zero MPC drivers are mapped. `CHINA_REVENUE` maps mainly to DUV and valuation; the company artifacts disclose China as 15.9% of H1 total sales but do not provide a separate China-by-technology split, so no unsupported numeric DUV-China fraction is invented.

## 5. Local validation

- LLY_mc_calibration_v1.0.yaml: Schema v1.0.2 PASS
- META_mc_calibration_v1.0.yaml: Schema v1.0.2 PASS
- ASML_mc_calibration_v1.0.yaml: Schema v1.0.2 PASS
- LLY: all non-zero MPC drivers mapped; active_drivers aligned PASS
- META: all non-zero MPC drivers mapped; active_drivers aligned PASS
- ASML: all non-zero MPC drivers mapped; active_drivers aligned PASS

Local deterministic RV preflight:
- LLY: CAGR 0.206266, TV share 0.893146, class terminal_dependent;
- META: CAGR 0.120287, TV share 0.905118, class terminal_dependent;
- ASML: CAGR 0.251258, TV share 0.892271, class terminal_dependent.

Not executed locally:
- host `reverse_valuation 1.2.0` run IDs;
- `company_mc 2.3.1` mapping_warnings;
- measured MC-G5-013 sigma;
- intrinsic/full W;
- local robustness engine pass;
- 500k host convergence/determinism.

## 6. Host acceptance sequence

1. Run three RV calibrations and replace `PENDING_HOST_RUN:*` with authoritative run IDs.
2. Validate schema v1.0.2 and MC-G5-001…013.
3. Dry-run on 2.3.1; require `mapping_warnings=[]`.
4. Measure MC-G5-013 aggregate sigma.
5. Run intrinsic/full W diagnostics.
6. Run local robustness v1.1.2.
7. Run old absolute stress grid as diagnostic only.
8. Run deterministic 500k production calibration.
