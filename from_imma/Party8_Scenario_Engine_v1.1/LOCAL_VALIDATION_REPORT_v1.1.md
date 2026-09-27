# Scenario Engine v1.1 — Local Validation Report

Date: 2026-09-27

## JSON Schema
- Scenario Event Catalog: **PASS**, errors=0
- Scenario State Example: **PASS**, errors=0
- TAIWAN_SEIZURE v1.1: **PASS**, errors=0
- TAIWAN_QUARANTINE v1.1: **PASS**, errors=0
- CHIP_COLD_WAR v1.1: **PASS**, errors=0

## Semantic checks
- SCN-012 includes uniqueness: **PASS**
- SCN-013 event ownership: **PASS**
- SCN-014 phase criteria/reference integrity: **PASS**
- SCN-015 include/exclude integrity: **PASS**
- modeled event coverage warnings: **0**

## Numerical invariance
- TAIWAN_SEIZURE: inherited numeric changes **0**; fingerprint match = **True**
- TAIWAN_QUARANTINE: inherited numeric changes **0**; fingerprint match = **True**
- CHIP_COLD_WAR: inherited numeric changes **0**; fingerprint match = **True**

## PSD under Joint v1.1
- TAIWAN_SEIZURE: RESTRICTIONS=0.209566, BLOCKADE=0.109141, CONFLICT=0.042001, RECOVERY=0.198910
- TAIWAN_QUARANTINE: RESTRICTIONS=0.209566, QUARANTINE=0.168494, NORMALIZATION_OR_FROZEN=0.208860
- CHIP_COLD_WAR: RACE_TO_PARITY=0.184437, PARITY_BOUNDARY=0.123511, TWO_SYSTEMS=0.163387

## Not locally claimed
- deterministic replay / SCN-011 persistence statistics (host runtime check);
- bitwise 20k scenario output identity (expected because inherited numerical trees are identical; host orchestrator must confirm);
- Dozor event confirmation state transitions against live sources.

## Raw errors
