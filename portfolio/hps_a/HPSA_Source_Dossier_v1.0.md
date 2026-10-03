# HPS.A — Source Dossier v1.0

As of: 2026-10-03
Currency: CAD unless otherwise stated.

## Primary sources

- exact issuer-hosted Q2 2026 Report / MD&A / interim statements:
  https://americas.hammondpowersolutions.com/-/media/Project/HPS/shared/Investor-Relations/2026-YEAR-ITEMS/Q2-2026/2026-HPS-Q2-Report_FINAL.pdf
- Q2 results press release PDF:
  https://emea.hammondpowersolutions.com/-/media/Project/HPS/shared/Investor-Relations/2026-YEAR-ITEMS/Q2-2026/Q2-2026-Financial-Results-Press-Release---073026.pdf
- AEG acquisition close:
  https://asia.hammondpowersolutions.com/news/2026/june/hps-completes-acquisition-of-aeg-power-solutions
- AEG initial transaction announcement:
  https://americas.hammondpowersolutions.com/news/2026/february/hps-aeg-power-solutions-aquisition
- SEDAR+ public document search:
  https://www.sedarplus.ca/csa-party/relay.html?target=csa-party&url=https%3A%2F%2Fwww.sedarplus.ca%2Fcsa-party%2Fservice%2Fcreate.html%3FtargetAppCode%3Dcsa-party%26service%3DsearchDocuments
- price source / required symbol:
  https://finance.yahoo.com/quote/HPS-A.TO/ (`HPS-A.TO`)

### SEDAR+ direct-link note

SEDAR+ public documents use generated `records/document.html?id=...` / `Generate URL` links. A stable direct Q2-2026 document ID for HPS was not independently returned by the public search index in this session. The package therefore does **not** invent one. Dozor uses the exact issuer-hosted Q2 Report above, while the SEDAR+ search endpoint is retained as the regulator source channel. Host may add the generated regulator document URL when deterministically recovered.

## Reproducible Q2 facts

- sales C$324.802M, +44.7% YoY;
- U.S. & Mexico C$272.691M, +73.0% YoY;
- Canada C$44.669M, -23.7% YoY;
- backlog +96.9% YoY;
- backlog -3.1% vs Q4 2025 and -6.9% vs Q1 2026;
- gross margin 31.5%;
- adjusted EBITDA C$53.247M = 0.163937 of sales;
- net earnings C$9.394M, -29.8% YoY;
- cash used by operations C$6.4M;
- working capital = 17.7% of sales;
- Q2 capex C$6.217M;
- FY2026 capex guidance C$35M-C$40M;
- dividend in the Q2 reporting package C$0.275/share;
- Q2 excludes AEG revenue/operating costs because transaction closed after quarter end.

## AEG

- closing date: 2026-06-29;
- approximate EV: C$365M, all cash; HPS also repays AEG bank debt;
- 2025 AEG revenue disclosed at initial announcement: approximately C$326M;
- business expands HPS into power quality / conversion and creates Integrated Electrical Solutions;
- Q3 will include a full quarter of AEG results and associated acquisition debt.

## FX/tariff evidence

Q2 Report explicitly states:
- U.S./Mexico sales were affected by USD/CAD translation;
- gross-margin improvement included prior pricing actions intended to offset direct/indirect tariff input costs.

## Owner-registry preservation

`portfolio/_ideas.yaml` on 2026-09-17 contained:
- ticker HPS.A / TSX / Yahoo `HPS-A.TO`;
- `price_at_idea = 232.89 CAD`;
- return condition: backlog + orders >=20% YoY AND valuation <=20x forward earnings.

This historical owner condition is preserved as `HPSA-LEGACY-01`; it is **not** normalized into the company-model state thresholds.
