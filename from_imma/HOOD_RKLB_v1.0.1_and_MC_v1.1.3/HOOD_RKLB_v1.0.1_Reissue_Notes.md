# HOOD v1.0.1 + RKLB v1.0.1 — Reissue Notes

Дата: 2026-09-23  
Статус: candidate until host rerun on `company_mc 2.3.1`

## 1. Host findings carried forward

HOOD v1.0 hard gates passed, but intrinsic/full W = 0.198/0.225 was below Mature-A guide.

RKLB v1.0 hard gates and candidate milestone caps passed, but the old hard valuation basis switch created a structural paradox:
higher service margin could lower path value when FCF_multiple replaced a much richer revenue_bridge.

RV calibrations are unchanged and already accepted:
- HOOD: implied CAGR 34.518%, TV share 0.8952, `terminal_dependent`, authoritative run ending `-933181`;
- RKLB: implied CAGR 82.407%, TV share 1.0025, `model_fragile`, authoritative run ending `-904488`.

The full run IDs were not supplied in this message, so `reverse_valuation_ref.run_ref` is not fabricated here.
Integrator should bind the exact authoritative IDs already present on the host.

## 2. Valuation continuity decision

A symmetric linear blend around the static maturity threshold is **not** sufficient.

RKLB central example:
- revenue bridge = 7x revenue;
- FCF multiple = 24x FCF;
- at 8% FCF margin, FCF basis = 1.92x revenue;
- at 12%, only 2.88x revenue.

Therefore blending across 4–12% would be continuous but would still make value fall as margin improves.

v1.1.3 instead adopts **parity-gated linear blend**:

`m_start = max(m_eligibility, M_bridge/M_fcf)`

and blends only from `m_start` to `m_start + 4pp`.

This guarantees continuity and non-decreasing value versus FCF margin for fixed revenue/multiples.

For RKLB central multiples:
`m_start = max(8%, 7/24) = 29.17%`.

The fact that bridge remains dominant until ~29% margin is now an explicit `bridge_dependent` diagnostic, not a hidden cliff.

## 3. HOOD v1.0.1

Centers/modes are unchanged.

Widened intrinsic tails:

- CyclicalTrading initial: `-10/18/45% -> -18/18/58%`;
- CyclicalTrading long-run: `0/8/18% -> -3/8/22%`;
- NetInterest initial: `-12/6/20% -> -18/6/28%`;
- NetInterest long-run: `-2/5/12% -> -5/5/15%`;
- SubscriptionOther initial: `5/20/40% -> 0/20/48%`;
- SubscriptionOther long-run: `3/10/20% -> 0/10/24%`;
- EventContracts stays `-40/20/100%`;
- Y5 margin: `26/34/42% -> 22/34/46%`;
- Y8 margin: `24/32/40% -> 20/32/44%`;
- Y3 multiple: `18/24/30 -> 15/24/34`;
- Y5: `16/22/28 -> 13/22/31`;
- Y8: `14/20/26 -> 11/20/29`.

Joint mappings are unchanged because v1.0 already passed measured MC-G5-013.

Materialized local robustness v1.1.2 after widening:
- growth: `[-0.04197336, 0.04197336]`;
- margin: `[-0.01302944, 0.01302944]`;
- multiple: `[-0.04390213, 0.04591803]`.

Expected host check: intrinsic W should increase; the 0.25 lower guide remains a warning band, not a fitting target.

## 4. RKLB v1.0.1

All numerical calibration parameters are **identical to v1.0**.

Only:
- schema pin `1.0.1 -> 1.0.2`;
- engine pin `company_mc 2.3.0 -> 2.3.1`;
- explanatory mapping notes about the now-normative milestone caps.

No milestone probability, timing, growth, cash, value_uplift, margin or multiple was moved.

Host v1.0 milestone measurements that motivate Rules v1.1.2:
- probability logit sigma: 0.118 / 0.069 (<0.35);
- timing sigma: 0.365 / 0.147 quarter (<1.0).

RKLB must be rerun because valuation semantics changed, not because its calibration was refit.

## 5. Schema fixture C

Companion examples are republished for schema v1.0.2.

The old illustrative `probability_logit_shift=0.20` was reduced to 0.10 because the host measured ~0.40 aggregate sigma for 0.20, above the 0.35 hard cap.

This remains a shape-only fixture; measured MC-G5-013 is still required.

## 6. Acceptance sequence

1. Deploy `company_mc 2.3.1` with parity-gated blend conformance tests.
2. Validate both YAMLs against Schema v1.0.2.
3. Bind exact accepted RV run IDs.
4. Re-run MC-G5-001…013.
5. HOOD: intrinsic/full W diagnostic; local robustness; absolute stress diagnostic.
6. RKLB: growth/margin/multiple plus milestone probability/timing sigma; intrinsic/full W; local robustness.
7. Production 500k deterministic runs.

Do not compare RKLB v1.0.1 output to v1.0 as "calibration drift": the intended delta is specifically the corrected valuation-basis transition.
