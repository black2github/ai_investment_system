# Scenario Engine v1.1 — Patch Notes

## Normative intent

v1.1 is a semantic recognition-layer extension. No v1.0 numerical scenario semantics change.

Added:
- global Scenario Event Catalog + schema;
- scenario `scope` with includes/excludes/base_when/narrative;
- phase `entry_criteria` / `exit_criteria`;
- fact-item `event_id`;
- outcome mapping for `GEOTECH_REGIME_8Y_V1`;
- runtime `scenario_state` schema;
- confirmed-phase conditional-run rule;
- nullable scenario/phase `strategy_ref` extension points;
- SCN-012…015.

## Current predecessor baseline

TAIWAN_SEIZURE and CHIP_COLD_WAR owner probabilities were updated on 2026-09-25 after the original v1.0 package:
- TAIWAN_SEIZURE = 0.10, owner_judgment;
- CHIP_COLD_WAR = 0.07, owner_judgment.

Those probability values are treated as part of the current canonical predecessor, not as v1.1 changes.
TAIWAN_QUARANTINE remains pending_owner_judgment.

## Numerical invariance

All inherited numeric leaves of the three current predecessor calibrations are identical in v1.1. New numeric values exist only in the semantic Event Catalog recognition thresholds and do not enter ordinary scenario path generation.

## Owner outcome decisions encoded

- full blockade without conflict -> TAIWAN_SEIZURE (conservative mapping);
- quarantine / partial blockade without combat -> TAIWAN_QUARANTINE;
- military-AI sufficiency below leading-edge parity -> BASE;
- leading-edge parity / two systems -> CHIP_COLD_WAR;
- full chain superiority -> Western disengagement -> OUTSIDE_SET;
- future parity-then-seizure -> future CHIP_COLD_WAR_THEN_SEIZURE with probability repartition, not an additive probability.

## Legacy action-layer seam

Recognition content from `portfolio/_scenarios/taiwan.yaml` moves into events/scope/criteria. Position actions, cash reallocation, target residual positions and timing remain outside Scenario Engine and belong to the future Scenario Action Layer.
