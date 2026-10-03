# IMMA Party 13 — CRWD / HPS.A / S Company Models

Status: proposed for host acceptance  
Date: 2026-10-03

## Scope

Three company-model candidates and canonical folders:
- CRWD — CrowdStrike Holdings, NASDAQ, USD
- HPS.A — Hammond Power Solutions, TSX, CAD, Yahoo `HPS-A.TO`
- S — SentinelOne, NYSE, USD

Each company folder contains:
- Candidate Schema v1.0.1 candidate;
- `states.yaml`;
- `kpis.yaml`;
- `triggers.yaml`;
- `mpc_inputs.yaml`;
- `state.json`;
- `theme_exposure_v1.0.yaml`;
- source dossier.

No RV/MC calibration is included. Calibration is the next gate after 100% host Dozor/folder acceptance.

## Theme decision

Theme Taxonomy v1.0.1 adds `CYBERSECURITY` as a separate primary theme and links it to `CLOUD_SOFTWARE_DEMAND` for THM-007.
`CYBERSECURITY` is not part of `AI_TOTAL`.

## HPS.A

The model treats Q2 as pre-AEG consolidated perimeter and AEG as a closed-but-not-yet-consolidated transition.
Historic owner idea metadata from 2026-09-17 is preserved where deterministically available.

## Trigger semantics

Trigger != Decision. Confirmed state transitions produce a Decision Request and CLR-2 calibration review; no trigger contains an automatic trade.
