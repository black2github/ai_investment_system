# SPOT v1.0 + ETN MC v1.0.2 — Calibration Rationale

Date: 2026-09-25

## 1. SPOT currency decision

**Decision: the calibration is fully EUR-denominated.**

Spotify reports under IFRS/IAS 34 in EUR, while its ordinary shares trade on NYSE in USD. Converting every accounting node into USD would make the model depend on one point-in-time FX conversion and would create false precision. Therefore revenue, cash, debt, FCF margins and valuation are all expressed in EUR.

The market bridge is deterministic:
- NYSE close: USD 509.45 on 2026-09-18.
- ECB reference rate on the same date: 1 EUR = 1.1460 USD.
- Issued shares at 2026-06-30: 210,241,268; treasury shares: 4,657,063; shares outstanding used = 205,584,205.
- EUR-equivalent share price = 509.45 / 1.1460 = 444.546248.
- Equity value = 509.45 × 205,584,205 / 1.1460 = EUR 91.392B.

The user's 20 September snapshot refers to the last regular NYSE close, which was 18 September; there is no ECB weekend fixing. No extra FX premium is added to the discount rate. FX remains a portfolio-layer issue, matching the ASML principle.

## 2. SPOT Reverse Valuation

State vector: **A3 / P3 / D1 / M3 / C3**.

Base-period facts:
- TTM revenue = FY2025 EUR 17.186B + H1 2026 EUR 9.310B - H1 2025 EUR 8.383B = **EUR 18.113B**.
- H1 2026 FCF = EUR 1.621B / EUR 9.310B revenue = **17.41%**.
- Cash + short-term investments = **EUR 9.388B**.
- Exchangeable Notes matured and were settled in March 2026; at 2026-06-30 Spotify reported no outstanding indebtedness other than leases. For the accepted RV balance convention: debt current = 0, debt noncurrent = 0, net_debt = **-EUR 9.388B**.
- Q2 gross margin = 33.4%; operating margin = 13.7%. These are operating anchors, not direct RV targets.

Assumptions:
- discount rate base **10.0%**, stress **8.5–12.0%**;
- terminal FCF margin **12/18/24%**;
- terminal FCF multiple **16/24/32x**;
- mature mean-reversion margin path: 17.41% → 17.5% → 17.6% → 17.8% → 17.9% → 18.0%.

Local deterministic preflight gives implied 5Y revenue CAGR **9.25%**, terminal-value share **0.828**. This is a local diagnostic only; host `reverse_valuation 1.2.0` is authoritative. The expected stability classification is **terminal_dependent**, not fitted.

## 3. SPOT MC segmentation

Exactly two segments are used.

### Premium
Q2 revenue EUR 4.331B. Current observed origins are subscriber growth (+9%) and ARPU (+7%), while Premium revenue grew +15%. They are not modeled as separate revenue segments because the company reports one Premium segment and the MC schema's company revenue layer is segment-based. Instead, both origins are retained in the provenance/rationale of the Premium growth distribution.

Initial growth: **2% / 14% / 28%**. Long-run Y8: **2% / 8% / 16%**.

### AdSupported
Q2 revenue EUR 0.446B. Revenue grew only +1% while Ad-Supported MAUs grew +14%; that monetization gap is treated as the D1 state, not measurement noise.

Initial growth: **-20% / 5% / 35%**. Long-run Y8: **-2% / 8% / 20%**.

No third segment is introduced.

## 4. SPOT content economics and FCF

Archetype A is retained because FCF is already positive and economically meaningful.

`mean_reverting_positive_margin` starts at **17.41%**. Y5 terminal distribution is **10% / 18% / 27%**, Y8 **10% / 18% / 28%**. Content royalties, podcast/audiobook economics, product reinvestment and working-capital variability are represented in the intrinsic margin tails.

`CONTENT_COST_INFLATION` is a failure-mode/common-cause concept, not a canonical continuous driver in the current taxonomy. No synthetic driver is created.

## 5. Valuation and revenue bridge

Primary basis is FCF multiple:
- Y3: **16 / 30 / 46x**
- Y5: **12 / 24 / 38x**
- Y8: **10 / 20 / 32x**

`negative_fcf_fallback` is treated under schema >=1.0.2 semantics as the **revenue-bridge reference multiple**, not as an emergency-only tail. Its **2.0 / 4.3 / 7.0x** distribution is a first-class valuation parameter. Center parity is 4.3 / 24 = **17.9% FCF margin**, deliberately near the 18% Y5 margin center.

## 6. Joint mapping decisions

Mapped as material:
- `DIGITAL_AD_DEMAND` → AdSupported initial growth;
- `CAPITAL_MARKETS` → Y5 valuation multiple;
- `INTEREST_RATES` → Y5 valuation multiple, adverse direction +1σ;
- `AI_CLOUD_PRICING` → small cost-only Y5 margin channel; it is **not** a SPOT revenue driver.

Reviewed as immaterial / no company-MC mapping:
- `AI_COMPUTE_DEMAND`: AI personalization exists, but no separately disclosed revenue/FCF channel supports a material continuous mapping.
- `CLOUD_SOFTWARE_DEMAND`: taxonomy semantics are enterprise/cloud software demand; using it as a proxy for consumer music engagement would be semantic leakage.
- `ACQUISITION_INTEGRATION`: no currently disclosed acquisition is material enough to satisfy the material-driver rule.

Failure-mode decisions:
- `CONSUMER_ENGAGEMENT_SLOWDOWN` and `SUBSCRIPTION_PRICING_ELASTICITY`: no canonical root; captured by intrinsic Premium growth tails and triggers, **no synthetic knockout**.
- `DIGITAL_AD_DEMAND_SLOWDOWN`: linked to `DIGITAL_AD_DEMAND`; structural support can be removed.
- `CONTENT_COST_INFLATION`: intrinsic margin tails / recalibration trigger; no fabricated root.
- `AI_CONTENT_INVESTMENT_OVERRUN`: `AI_CLOUD_PRICING` is only a partial cost channel, so no knockout.
- `PLATFORM_REGULATORY_PRESSURE`: trigger/recalibration risk; no unrelated regulation driver is substituted.

Sector remains `INTERNET_PLATFORMS` provisional. A paired ticker is **not required for this company calibration**; sector-benchmark breadth is a portfolio/benchmark governance issue, not a reason to alter SPOT parameters.

## 7. Robustness v1.1.2

Derived from the actual distributions:
- growth sigma reference = **0.065048**, local perturbation = **±0.016262**;
- margin sigma reference = **0.036938**, local perturbation = **±0.009234**;
- Y5 log-multiple sigma = **0.232765**, local log perturbation = 0.058191, equivalent relative move **-5.65% / +5.99%**;
- correlation perturbation = **±0.15**.

No parameter was moved to hit the archetype-A W band. Host intrinsic/full W remains an acceptance diagnostic.

## 8. ETN v1.0.2

Joint v1.1 makes `INDUSTRIAL_RESHORING` correlated with the other Electrical Americas drivers. Host measured sigma rose from 0.141 to 0.160. The host already tested uniform scaling ×0.90 and measured sigma ≈0.143 ≤0.15.

Therefore v1.0.2 applies exactly **×0.90** to the six existing effects on `revenue_model.segments.ElectricalAmericas.initial_growth` and changes nothing else:

- `HYPERSCALER_CAPEX`: `0.01875` → `0.016875`
- `DATA_CENTER_POWER`: `0.015` → `0.0135`
- `ELECTRIFICATION_GRID`: `0.015` → `0.0135`
- `UTILITY_CAPEX`: `0.015` → `0.0135`
- `INDUSTRIAL_RESHORING`: `0.01125` → `0.010125`
- `AI_COMPUTE_DEMAND`: `0.009` → `0.0081`

This preserves relative driver structure and uses the smallest host-tested correction that clears the hard cap. Centers, intrinsic distributions, all other targets, lags/decays, robustness and RV are unchanged.

## 9. Host gates

Not claimed locally:
- authoritative RV run;
- measured MC-G5-013 under host Joint v1.1;
- intrinsic/full W;
- probability-response robustness pass;
- normative 500k BASE and scenario runs.

These remain validator 1.7.0 / company_mc 2.3.2 acceptance outputs.
