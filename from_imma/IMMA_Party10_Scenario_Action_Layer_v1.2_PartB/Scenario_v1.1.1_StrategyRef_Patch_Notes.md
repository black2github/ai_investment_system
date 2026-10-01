# Scenario v1.1.1 strategy_ref patch notes

Patch only: strategy linkage + as_of/supersedes. Numerical scenario semantics unchanged.
TAIWAN_QUARANTINE host predecessor already has probability=0.175 / owner_judgment; carried forward, not a Part B delta.

## TAIWAN_SEIZURE
- removed: 0
- added: 0
- changed common scalar leaves: 7
- inherited numeric changes: 0
  - `as_of`: `2026-09-27` -> `2026-10-01`
  - `phases[0].strategy_ref`: `None` -> `portfolio/_scenarios/strategies/TAIWAN_SEIZURE_strategy_v1.0.yaml`
  - `phases[1].strategy_ref`: `None` -> `portfolio/_scenarios/strategies/TAIWAN_SEIZURE_strategy_v1.0.yaml`
  - `phases[2].strategy_ref`: `None` -> `portfolio/_scenarios/strategies/TAIWAN_SEIZURE_strategy_v1.0.yaml`
  - `phases[3].strategy_ref`: `None` -> `portfolio/_scenarios/strategies/TAIWAN_SEIZURE_strategy_v1.0.yaml`
  - `strategy_ref`: `None` -> `portfolio/_scenarios/strategies/TAIWAN_SEIZURE_strategy_v1.0.yaml`
  - `supersedes`: `TAIWAN_SEIZURE_v1.0.yaml` -> `TAIWAN_SEIZURE_v1.1.yaml`

## TAIWAN_QUARANTINE
- removed: 0
- added: 0
- changed common scalar leaves: 6
- inherited numeric changes: 0
  - `as_of`: `2026-09-27` -> `2026-10-01`
  - `phases[0].strategy_ref`: `None` -> `portfolio/_scenarios/strategies/TAIWAN_QUARANTINE_strategy_v1.0.yaml`
  - `phases[1].strategy_ref`: `None` -> `portfolio/_scenarios/strategies/TAIWAN_QUARANTINE_strategy_v1.0.yaml`
  - `phases[2].strategy_ref`: `None` -> `portfolio/_scenarios/strategies/TAIWAN_QUARANTINE_strategy_v1.0.yaml`
  - `strategy_ref`: `None` -> `portfolio/_scenarios/strategies/TAIWAN_QUARANTINE_strategy_v1.0.yaml`
  - `supersedes`: `TAIWAN_QUARANTINE_v1.0.yaml` -> `TAIWAN_QUARANTINE_v1.1.yaml`

## CHIP_COLD_WAR
- removed: 0
- added: 0
- changed common scalar leaves: 6
- inherited numeric changes: 0
  - `as_of`: `2026-09-27` -> `2026-10-01`
  - `phases[0].strategy_ref`: `None` -> `portfolio/_scenarios/strategies/CHIP_COLD_WAR_strategy_v1.0.yaml`
  - `phases[1].strategy_ref`: `None` -> `portfolio/_scenarios/strategies/CHIP_COLD_WAR_strategy_v1.0.yaml`
  - `phases[2].strategy_ref`: `None` -> `portfolio/_scenarios/strategies/CHIP_COLD_WAR_strategy_v1.0.yaml`
  - `strategy_ref`: `None` -> `portfolio/_scenarios/strategies/CHIP_COLD_WAR_strategy_v1.0.yaml`
  - `supersedes`: `CHIP_COLD_WAR_v1.0.yaml` -> `CHIP_COLD_WAR_v1.1.yaml`

