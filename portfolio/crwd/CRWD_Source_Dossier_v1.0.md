# CRWD — Source Dossier v1.0

As of: 2026-10-03

## Primary sources

- Q2 FY2027 Exhibit 99.1: https://www.sec.gov/Archives/edgar/data/1535527/000153552726000029/crwd-20260826xex991.htm
- Q2 FY2027 Form 10-Q: https://www.sec.gov/Archives/edgar/data/1535527/000153552726000031/crwd-20260731.htm
- Price source: https://finance.yahoo.com/quote/CRWD/

## Reproducible Q2 facts

From Exhibit 99.1:
- revenue: $1.47B, +26% YoY;
- subscription revenue: $1.40B, +27% YoY;
- ARR: $5.84B, +25% YoY;
- net new ARR: $332.8M, +51% YoY;
- Falcon Flex ending ARR: >$2.29B, +101% YoY;
- GAAP operating loss: $33.2M;
- non-GAAP operating income: $371.6M;
- free cash flow: $377.4M;
- cash flow from operations: $530.3M;
- module adoption 6+/7+/8+: 51% / 35% / 26%;
- FY2027 net-new-ARR growth guidance midpoint: +34%.

From Form 10-Q:
- cash and cash equivalents: $5.013847B;
- long-term debt: $0.746216B;
- deferred revenue: $3.497144B current + $1.345066B non-current = $4.842210B;
- goodwill: $1.363294B at 2026-01-31 -> $2.251426B at 2026-07-31;
- six-month goodwill growth = 2.251426 / 1.363294 - 1 = 0.651460;
- goodwill increase is associated with acquisitions including SGNL and Seraphic;
- one operating/reportable segment.

## Model formulas

- non-GAAP operating margin = 371.6 / 1470.897 = 0.252635
- FCF margin = 377.4 / 1470.897 = 0.256578

## Registry merge note

The Project snapshot available to IMMA confirms that `portfolio/crwd` previously existed only as owner-registry `triggers.yaml + state.json`, but the exact legacy bytes are not present in the materialized Party13 source set. Therefore this package does **not** fabricate old owner fields. Host integration must preserve any pre-existing owner `target_weight`, lot/priority, fired/events history and owner notes when replacing the registry-only folder with the full model.
