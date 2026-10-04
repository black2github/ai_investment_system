# Party 18 — MC-G5-014 closure decisions

Review ref: `IMMA-P18-MCG5-014-20261004`

## Principle
A direct mapping is used when the driver has a distinct economically material quantitative channel in the current calibration.
A structured exception is used when adding another stochastic target would double-count an already-live channel, or when the
company-level effect is below the current calibration's materiality/disclosure resolution. No choice or effect size was selected
from scenario-return results.

## Closure matrix
| Ticker | Driver | Exposure | Closure | Detail |
|---|---|---:|---|---|
| CRWV | ADVANCED_PACKAGING | +1 | exception | substitute_channel → TAIWAN_SUPPLY |
| CRWV | HBM_MEMORY | +1 | exception | substitute_channel → TAIWAN_SUPPLY |
| ETN | GOVERNMENT_DEFENSE | +1 | exception | immaterial_at_company_level |
| ETN | INTEREST_RATES | -1 | mapping | mapping `valuation.Y5.multiple` -0.015 |
| ETN | SEMICONDUCTOR_WFE | +1 | exception | substitute_channel → INDUSTRIAL_RESHORING |
| MSFT | GOVERNMENT_DEFENSE | +1 | exception | immaterial_at_company_level |
| MSFT | INTEREST_RATES | -1 | mapping | mapping `valuation.Y5.multiple` -0.018 |
| NET | CAPITAL_MARKETS | +1 | mapping | mapping `valuation.Y5.multiple` +0.015 |
| NET | DATA_CENTER_POWER | +1 | exception | substitute_channel → AI_COMPUTE_DEMAND |
| NET | HYPERSCALER_CAPEX | +1 | exception | substitute_channel → AI_COMPUTE_DEMAND, CLOUD_SOFTWARE_DEMAND |
| NET | INTEREST_RATES | -1 | mapping | mapping `valuation.Y5.multiple` -0.025 |
| PLTR | CAPITAL_MARKETS | +1 | mapping | mapping `valuation.Y5.multiple` +0.015 |
| PLTR | INDUSTRIAL_RESHORING | +1 | exception | substitute_channel → CLOUD_SOFTWARE_DEMAND |
| PLTR | INTEREST_RATES | -1 | mapping | mapping `valuation.Y5.multiple` -0.025 |
| SPOT | AI_COMPUTE_DEMAND | +1 | exception | immaterial_at_company_level |
| HPS.A | AI_COMPUTE_DEMAND | +1 | exception | substitute_channel → DATA_CENTER_POWER, HYPERSCALER_CAPEX |
| HPS.A | INDUSTRIAL_RESHORING | +1 | exception | substitute_channel → ELECTRIFICATION_GRID |

## Direct-mapping sizing
- `INTEREST_RATES` is valuation-only here. No synthetic revenue or financing effect is introduced.
- ETN `-0.015` log-multiple: mature industrial duration, consistent with system-scale rate sensitivity.
- MSFT `-0.018`: mature positive-FCF software/cloud duration.
- NET / PLTR `-0.025`: longer-duration high-multiple software equities.
- NET / PLTR `CAPITAL_MARKETS +0.015`: risk-appetite / duration channel only; no external-funding dependence is assumed.
- Magnitudes are model assumptions chosen before scenario reruns. Host measured MC-G5-013 remains authoritative.

## Structured exceptions
Substitute-channel exceptions require a live mapping for at least one listed substitute under Joint Rules v1.1.3.
`immaterial_at_company_level` does not assert zero economic exposure; it says the driver is below the calibration's
standalone stochastic-target resolution and therefore must not create a fake independent channel.
