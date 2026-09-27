# Party 7 — TAIWAN_QUARANTINE v1.0 + SPCX migration

Date: 2026-09-25

## TAIWAN_QUARANTINE

Separate mutually exclusive scenario, not an internal branch of TAIWAN_SEIZURE. Scenario Engine v1.0 has no conditional branches; escalation into armed conflict belongs to TAIWAN_SEIZURE.

Probability remains `pending_owner_judgment`. The owner-supplied 15–20% through end-2028 is orientation only.

Phase design:
- RESTRICTIONS: copied from TAIWAN_SEIZURE for comparability.
- QUARANTINE: q1/q2/q4 from t0; non-kinetic but persistent gray-zone pressure.
- NORMALIZATION_OR_FROZEN: q4/q8/q12 after QUARANTINE, ramp 4 quarters, until horizon end.

PSD minimum eigenvalues under Joint v1.1:
- RESTRICTIONS: 0.209566
- QUARANTINE: 0.168494
- NORMALIZATION_OR_FROZEN: 0.208860

## Question 3.5 — BASE

**BASE already contains the current strategic semiconductor/AI/defense race as the observed 2026 regime.**

Company centers are calibrated to current operating facts; Joint BASE shocks are zero-centered deviations around those centers. Therefore current elevated capex, WFE, power buildout, defense procurement, reshoring and the prevailing rate environment are already embedded where company evidence supports them.

`CHIP_COLD_WAR/RACE_TO_PARITY` must therefore mean **acceleration of the current race above BASE toward parity**, not the onset of a race from a peaceful baseline.

No Joint-root recentering and no company-calibration reissue are required for this clarification.

## Question 3.6 — compound scenario

Preferred future implementation: **separate `CHIP_COLD_WAR_THEN_SEIZURE` scenario** rather than Scenario Engine tree semantics.

If introduced, the owner must repartition unconditional probabilities across mutually exclusive members. It cannot be added on top of the existing 0.10 TAIWAN_SEIZURE and 0.07 CHIP_COLD_WAR probabilities.

Until the owner supplies that split, retain current behavior: parity evidence is a trigger to review scenario probabilities; no automatic probability update.

## Monitoring evidence

Current public evidence supports the monitoring design but does not establish that a quarantine is active:
- Taiwan MND publishes daily aircraft/PLAN/official-ship counts, including eastern-ADIZ activity.
- Taiwan CGA has reported PRC coast-guard patrol activity east of Taiwan.
- CSIS has described coast-guard-led inspection/boarding as a plausible gray-zone quarantine mechanism.
- Reuters reported in September 2026 that an approximately USD 14B Taiwan arms package remained delayed.
- RTX and Lockheed Martin disclose missile-production expansion activity; exact Taiwan-relevant cadence must be used only when explicitly disclosed.

## SPCX v1.1.3

Semantics-only migration:
- schema_version 1.0.1 -> 1.0.2
- calculation_engine_version company_mc 2.3.0 -> company_mc 2.3.1
- as_of 2026-09-23 -> 2026-09-25
- fallback rationale -> revenue_bridge_reference_multiple / parity-gated semantics

Intrinsic centers, tails, mappings and robustness are unchanged. Migration delta is accepted by design and must not be back-fit away.
