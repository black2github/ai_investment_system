# CRWD MC Calibration v1.0.1 — patch notes

Date: 2026-10-04
Supersedes: `CRWD_mc_calibration_v1.0.yaml`
Schema: Company_MC_Calibration_Schema v1.0.2

## Reason
Host dispersion diagnostic for v1.0 was intrinsic/full W = 0.156/0.182, below the archetype-A warning band. The host requested a tail-only reissue.

## Normative delta
No centers/modes, Joint-Layer mappings, factor correlations, market-path noise, seed, path count, current margin, reverse-valuation assumptions, or failure-mode logic were changed. No parameter was fitted to price.

Widened intrinsic tails:
- Subscription initial growth: `14/25/36%` -> `-5/25/55%`.
- Subscription Y8 long-run growth: `6/13/20%` -> `-2/13/28%`.
- Services initial growth: `0/14/30%` -> `-16/14/44%`.
- Services Y8 long-run growth: `0/8/15%` -> `-7/8/23%`.
- Terminal FCF margin Y5: `18/28/36%` -> `10/28/46%`.
- Terminal FCF margin Y8: `18/30/38%` -> `12/30/48%`.
- FCF multiple Y3: `18/32/50x` -> `12/32/56x`.
- FCF multiple Y5: `14/26/42x` -> `8/26/46x`.
- FCF multiple Y8: `12/22/36x` -> `8/22/40x`.
- Margin hard clip moved from `8..42%` to `4..50%` solely so the widened intrinsic margin tails are not truncated.

Robustness local perturbation sizes were recomputed from the new intrinsic distributions. MC-G5-013 driver mappings were not enlarged.

## Acceptance target
The archetype-A dispersion band remains a diagnostic, not a fitting objective. The patch is designed to remove the implausibly narrow intrinsic distribution; host `company_mc 2.5.0` remains authoritative for measured intrinsic/full W and MC-G5-013.
