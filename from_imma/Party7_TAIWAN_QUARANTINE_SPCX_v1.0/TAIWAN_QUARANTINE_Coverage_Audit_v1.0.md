# TAIWAN_QUARANTINE v1.0 — Coverage Audit

Scenario drivers: ADVANCED_PACKAGING, AI_COMPUTE_DEMAND, CAPITAL_MARKETS, CHINA_REVENUE, GOVERNMENT_DEFENSE, HBM_MEMORY, SEMICONDUCTOR_WFE, TAIWAN_SUPPLY

| Ticker | Applicable mapped drivers | Assessment |
|---|---|---|
| NBIS | ADVANCED_PACKAGING, AI_COMPUTE_DEMAND, CAPITAL_MARKETS, HBM_MEMORY, TAIWAN_SUPPLY | mapped |
| NVDA | ADVANCED_PACKAGING, AI_COMPUTE_DEMAND, CAPITAL_MARKETS, CHINA_REVENUE, GOVERNMENT_DEFENSE, HBM_MEMORY, SEMICONDUCTOR_WFE, TAIWAN_SUPPLY | mapped |
| HOOD | CAPITAL_MARKETS | mapped |
| LLY | host_round2_reported_1_to_2_channels | Raw accepted LLY MC not locally materialized; accepted scenario round 2 reported 1–2 applicable channels. Host coverage is authoritative. |
| META | ADVANCED_PACKAGING, AI_COMPUTE_DEMAND, HBM_MEMORY, TAIWAN_SUPPLY | mapped |
| ASML | ADVANCED_PACKAGING, AI_COMPUTE_DEMAND, CHINA_REVENUE, HBM_MEMORY, SEMICONDUCTOR_WFE, TAIWAN_SUPPLY | mapped |
| RKLB | CAPITAL_MARKETS, GOVERNMENT_DEFENSE | mapped |
| MSFT | ADVANCED_PACKAGING, AI_COMPUTE_DEMAND, HBM_MEMORY, TAIWAN_SUPPLY | mapped |
| NET | AI_COMPUTE_DEMAND | mapped |
| PLTR | AI_COMPUTE_DEMAND, GOVERNMENT_DEFENSE | mapped |
| ETN | AI_COMPUTE_DEMAND | mapped |
| SPOT | CAPITAL_MARKETS | mapped |
| ASTS | CAPITAL_MARKETS, GOVERNMENT_DEFENSE | mapped |
| SPCX | ADVANCED_PACKAGING, AI_COMPUTE_DEMAND, CAPITAL_MARKETS, GOVERNMENT_DEFENSE, HBM_MEMORY, TAIWAN_SUPPLY | mapped |
| CRWV | AI_COMPUTE_DEMAND, CAPITAL_MARKETS, TAIWAN_SUPPLY | mapped |

- Scenario drivers without an active company mapping do not affect that company.
- Narrow coverage is not auto-expanded solely to increase scenario sensitivity.
- `TAIWAN_SUPPLY` retains supply-health semantics.
- Host Scenario validator coverage report is authoritative.
