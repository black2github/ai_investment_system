# Party 9 — Local Validation Report

Date: 2026-09-27

## Registry schema
- Draft 2020-12 validation: **PASS**
- errors: `0`
- CLR IDs exactly CLR-1…CLR-6: **PASS**
- every CLR has detector/artifact/response/urgency: **PASS**
- default response belongs to allowed responses: **PASS**
- subrule responses are declared by parent response.allowed: **PASS**

## Terminology
- Russian prose contains no word `провенанс`: **PASS**
- YAML field name `provenance` is not renamed by this package.

## Lifecycle-specific numeric policy
- base_period_max_age_quarters: `2`
- money/operating quantity materiality: `0.05`
- backlog/RPO materiality: `0.1`
- margin/growth/rate absolute threshold: `0.02`
- share-count materiality: `0.01`

These thresholds belong to Lifecycle and do not duplicate company trigger thresholds or MC-G5-013.

## Cross-normative boundary
- Dozor criteria: referenced, not copied.
- Reverse-Valuation trigger conditions: referenced, not copied.
- MC-G5-013 algorithm/caps: referenced, not copied into the registry.
- Conditional MC diagnostics: referenced as non-bases.
- Exchange/reissue formatting: referenced; full-text + delta rule is not redefined structurally.

## Errors
- none
