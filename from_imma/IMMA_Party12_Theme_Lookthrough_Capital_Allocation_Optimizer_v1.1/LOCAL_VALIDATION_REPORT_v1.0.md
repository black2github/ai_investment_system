# Party 12 — Local Validation Report

Date: 2026-10-03

## Draft 2020-12 schema validation
- Theme_Taxonomy: **PASS**, errors=0
- Theme_Rules: **PASS**, errors=0
- Theme_Policy: **PASS**, errors=0
- SPCX_Theme: **PASS**, errors=0
- NVDA_Theme: **PASS**, errors=0
- MSFT_Theme: **PASS**, errors=0
- META_Theme: **PASS**, errors=0
- ETN_Theme: **PASS**, errors=0
- CAR_Rules: **PASS**, errors=0
- SPCX_CAR: **PASS**, errors=0

## THM rules
- additive shares / theme refs / fallback / number provenance / abs-OI method: **PASS**, issues=0

## CAR rules
- threshold origin/status + SPCX arithmetic: **PASS**, issues=0

## Portfolio Optimizer v1.1 supersedes
- all v1.0 non-empty lines except title/date/explicitly superseded ScenarioConcentration line retained in order: **PASS**
- missing predecessor text lines: 0
- machine-readable predecessor leaf paths removed: 0
- no-removal check: **PASS**
- added schema leaf paths: 75
- changed common schema leaves: 4

## Terminology
- Russian prohibited calque `провенанс`: **PASS**, files=0

## Numerical spot checks
- SPCX Q2 revenue shares: SPACE=0.123112362, CONNECTIVITY=0.549142565, AI_COMPUTE=0.327745073
- SPCX Q2 capex shares: SPACE=0.063912026, CONNECTIVITY=0.074418858, AI_COMPUTE=0.861669116
- SPCX Q2 AI capex-share minus revenue-share=0.533924044
- SPCX Q1 AI capex-share minus revenue-share=0.589858855

## Intentionally pending
- THM-007 full canonical-driver consistency run on host mpc_inputs files.
- 2026-09-21 AI_TOTAL portfolio baseline remains PENDING_HOST_COMPUTE.
- CAR-X numeric thresholds remain model_assumption / pending_owner_judgment.
- SPCX SOTP is not computed pending independent segment valuation assumptions.
- No calibration is changed by Theme/CAR diagnostics in this package.
