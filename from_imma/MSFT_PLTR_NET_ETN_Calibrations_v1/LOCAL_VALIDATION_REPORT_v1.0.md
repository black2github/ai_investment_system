# IMMA Batch 4 — Local Validation Report

Date: 2026-09-24

This is a local preflight, not host acceptance. MC-G5-013 measured sigma and intrinsic/full W require validator/company_mc on the host.

## MSFT

- JSON Schema Draft 2020-12 / Company_MC_Calibration_Schema 1.0.2: PASS
- RV local implied CAGR 5Y: 0.1813905244
- RV terminal share / class: 0.894178 / terminal_dependent
- Active Joint drivers: AI_COMPUTE_DEMAND, HYPERSCALER_CAPEX, CLOUD_SOFTWARE_DEMAND, DATA_CENTER_POWER, AI_CLOUD_PRICING, ADVANCED_PACKAGING, HBM_MEMORY, TAIWAN_SUPPLY
- Descriptive Σ|effect| by stochastic target (NOT MC-G5-013 criterion):
  - `margin_model.terminal_margin_Y5`: 0.0260
  - `margin_model.terminal_margin_Y8`: 0.0080
  - `revenue_model.segments.IntelligentCloud.initial_growth`: 0.1020
  - `revenue_model.segments.ProductivityBusinessProcesses.initial_growth`: 0.0200
  - `valuation.Y5.multiple`: 0.0420

## PLTR

- JSON Schema Draft 2020-12 / Company_MC_Calibration_Schema 1.0.2: PASS
- RV local implied CAGR 5Y: 0.5884744465
- RV terminal share / class: 0.934758 / terminal_dependent
- Active Joint drivers: CLOUD_SOFTWARE_DEMAND, GOVERNMENT_DEFENSE, AI_COMPUTE_DEMAND
- Descriptive Σ|effect| by stochastic target (NOT MC-G5-013 criterion):
  - `revenue_model.segments.International.initial_growth`: 0.0150
  - `revenue_model.segments.USCommercial.initial_growth`: 0.0500
  - `revenue_model.segments.USGovernment.initial_growth`: 0.0300
  - `valuation.Y5.multiple`: 0.0350

## NET

- JSON Schema Draft 2020-12 / Company_MC_Calibration_Schema 1.0.2: PASS
- RV local implied CAGR 5Y: 0.6692220992
- RV terminal share / class: 0.957337 / model_fragile
- Active Joint drivers: AI_COMPUTE_DEMAND, CLOUD_SOFTWARE_DEMAND, AI_CLOUD_PRICING
- Descriptive Σ|effect| by stochastic target (NOT MC-G5-013 criterion):
  - `margin_model.terminal_margin_Y5`: 0.0120
  - `revenue_model.segments.CorePlatform.initial_growth`: 0.0650
  - `valuation.Y5.multiple`: 0.0270

## ETN

- JSON Schema Draft 2020-12 / Company_MC_Calibration_Schema 1.0.2: PASS
- RV local implied CAGR 5Y: 0.2011476885
- RV terminal share / class: 0.894402 / terminal_dependent
- Active Joint drivers: HYPERSCALER_CAPEX, DATA_CENTER_POWER, ACQUISITION_INTEGRATION, ELECTRIFICATION_GRID, UTILITY_CAPEX, INDUSTRIAL_RESHORING, AI_COMPUTE_DEMAND
- Descriptive Σ|effect| by stochastic target (NOT MC-G5-013 criterion):
  - `margin_model.terminal_margin_Y5`: 0.0080
  - `revenue_model.segments.ElectricalAmericas.initial_growth`: 0.1120
  - `revenue_model.segments.ElectricalGlobal.initial_growth`: 0.0720
  - `revenue_model.segments.RestAerospaceMobility.initial_growth`: 0.0120
  - `valuation.Y5.multiple`: 0.0120

