# Recalibration v1.1.1 / v1.0.1 — Notes

Дата: 2026-09-23

## Причина переиздания

Host diagnostics showed that the original mappings made Joint Layer the dominant source of variance:
- SPCX AI initial growth σ(q20) 0.88;
- NBIS AI initial growth σ(q20) 1.06;
- NVDA Data Center initial growth σ(q20) 0.81.

This was a calibration dimensionality defect.

## New sizing

Hard MC-G5-013 caps:
- growth 0.15;
- margin 0.05;
- log multiple 0.15.

Main-growth effects were proportionally rescaled from measured host sigmas to design headroom:
- SPCX: target 0.12, common factor 0.136364;
- NBIS: target 0.12, common factor 0.113208;
- NVDA: target 0.10, common factor 0.123457.

Margin/multiple mappings were additionally reduced where conservative gross effect sums approached/exceeded hard caps.

## Intrinsic uncertainty

Central modes were not changed.

Only tails/spreads of company distributions were widened so that normal company uncertainty is not delegated to Joint Layer.

The host should now run:
1. `intrinsic_run`: mapping disabled;
2. `full_run`: mapping enabled;
3. MC-G5-013;
4. robustness v1.1;
5. dispersion sanity bands.

## Authoritative RV references now embedded

NBIS:
`20260923T133421Z-reverse_valuation-ba01b6`

NVDA:
`20260923T133451Z-reverse_valuation-012879`

## Local checks

- SPCX_mc_calibration_v1.1.1.yaml: schema PASS
- NBIS_mc_calibration_v1.0.1.yaml: schema PASS
- NVDA_mc_calibration_v1.0.1.yaml: schema PASS
- SPCX: central modes/central scalar anchors unchanged PASS
- NBIS: central modes/central scalar anchors unchanged PASS
- NVDA: central modes/central scalar anchors unchanged PASS
- SPCX: conservative |effect| sum margin_model.nodes.Y3=0.0400 <= 0.05
- NBIS: conservative |effect| sum margin_model.ocf_margin_nodes.Y3=0.0400 <= 0.05
- NBIS: conservative |effect| sum margin_model.capex_revenue_nodes.Y1=0.0350 <= 0.05
- NBIS: conservative |effect| sum margin_model.capex_revenue_nodes.Y2=0.0300 <= 0.05
- NVDA: conservative |effect| sum margin_model.terminal_margin_Y5=0.0400 <= 0.05
- SPCX: expected main-growth Joint σ≈0.120 by linear rescaling of measured host σ; host MC-G5-013 must verify
- NBIS: expected main-growth Joint σ≈0.120 by linear rescaling of measured host σ; host MC-G5-013 must verify
- NVDA: expected main-growth Joint σ≈0.100 by linear rescaling of measured host σ; host MC-G5-013 must verify

No claim is made here that live Joint Layer σ, robustness, or dispersion bands pass until the host reruns company_mc.
