# IMMA Calibration & Model Rationale — CRWV / ASTS / SPOT v1.0

Date: 2026-09-25

## 1. Scope and normative contracts

This package contains CRWV archetype B and ASTS archetype C Reverse Valuation + Conditional MC calibrations, plus a Company Artifact Schema v1.0.5 company model for SPOT. `calculation_engine_version` remains `company_mc 2.3.1` because Schema v1.0.2 contains that const; host execution may use 2.3.2, whose change is seed isolation only. No parameter is fitted to current market price. All host-only diagnostics (MC-G5-013 measured sigma, intrinsic/full W, dry-run mapping warnings, normative 500k outputs) remain pending host acceptance.

## 2. CRWV — explicit decisions

**Archetype:** B `capital_intensive_transition`. H1 raw FCF is deeply negative because OCF $3.663B minus PP&E/internal-use software purchases $14.117B = -$10.454B, while Q2 capex/revenue is 3.65x. The model therefore uses `ocf_capex_decomposition`, not a mature single-margin anchor.

**Revenue segmentation:** one segment, `CoreCloud`. CoreWeave does not separately disclose stable revenue for “contracted capacity” versus “new capacity”; inventing that split would violate the no-estimation rule. Contract backlog and power capacity are evidence for the trajectory, not synthetic segments.

**OCF anchor:** central early OCF is anchored to adjusted EBITDA 59% less H1 cash-interest burden of $806M / $4.653B = 17.3%, giving ~41.7%. Reported H1 OCF margin ~78.7% is not extrapolated because working-capital/prepayment timing can temporarily elevate OCF.

**Debt / enterprise-to-equity:** valuation remains equity FCF based. Debt is not double-subtracted from equity value; leverage enters the economics through lower OCF tails, INTEREST_RATES / CAPITAL_MARKETS mappings, the RV discount rate, and terminal multiple rationale. This preserves the accepted Reverse Valuation convention while making debt-service/refinancing risk explicit.

**Customer concentration:** top-three customers are 72% of Q2 revenue. `CUSTOMER_CONCENTRATION` is a failure common cause, not a canonical MPC driver root. No synthetic root is created. The risk is represented by broad intrinsic growth/margin tails, lower common-factor loading, and a recalibration trigger if the concentration failure materializes.

**±1 mappings:** ADVANCED_PACKAGING and HBM_MEMORY are not activated separately because their supply effect would double-count TAIWAN_SUPPLY; ELECTRIFICATION_GRID and UTILITY_CAPEX are subsumed in DATA_CENTER_POWER; ACQUISITION_INTEGRATION is medium and not separately material at current scale. This also limits correlated mappings per target after the ETN MC-G5-013 lesson.

**RV local preflight:** implied 5Y revenue CAGR = 29.1647%; terminal-value share = 1.162. This is diagnostic only and should be replaced by host run_ref/classification.

## 3. ASTS — explicit decisions

**Archetype:** C `pre_service_or_milestone_driven`. Q2 revenue ($31.5M) is gateway delivery + U.S. government milestone revenue; the 10-Q states SpaceMobile Service has not generated revenue. Current raw burn margin is not a scalable margin anchor.

**Milestones:** four conditional milestones are modeled with quarter distributions rather than point dates: sustained launch cadence; multi-market regulatory readiness; commercial SpaceMobile service onset; continuous key-market coverage. The last is grounded in ASTS's primary-source statement that approximately 45–60 BB satellites can enable continuous coverage in key markets. FCC authorization for the planned 248-satellite network is treated as an existing fact; multi-market operating approvals remain uncertain.

**Liquidity / dilution:** `cash_model.net_cash_0 = $3.7B` is explicitly a legacy-field burn-reserve proxy using company-reported pro-forma liquidity after the July financing, not accounting net cash after debt. H1 OCF + PP&E cash use was ~$1.004B, ~0.502B/quarter. The latest July convertible financing reported <2% effective dilution, but future funding uncertainty is represented by a 25% reduced-form dilution penalty; this is a model assumption, not a forecast.

**Revenue sharing:** initial service revenue and service margin are model assumptions for the MNO-partner model. Backlog $1.30B and >60 MNO partnerships support the existence of commercial demand but are not mechanically converted into service revenue.

**Critical failures:** LAUNCH_OPERATIONS_FAILURE receives a launch-milestone knockout under the canonical LAUNCH_ECONOMICS driver; SPACE_REGULATORY_SPECTRUM_DELAY receives a regulatory-milestone knockout under SPACE_REGULATION. SPACE_SYSTEMS_EXECUTION has no canonical driver root, so no fabricated mapping is added; it remains intrinsic milestone/idiosyncratic uncertainty and a trigger for recalibration.

**RV local preflight:** implied 5Y revenue CAGR = 130.0289%; terminal-value share = 1.016. The extreme implied growth is expected for a pre-service valuation and should produce a model-risk/fragility flag rather than parameter fitting.

## 4. SPOT — company-model decisions

Spotify is a Luxembourg foreign private issuer. Q2 2026 interim financial statements are on **Form 6-K / IAS 34**, not Form 10-Q. Q2 revenue was €4.777B, MAUs 777M, Premium subscribers 300M, Premium ARPU €4.89, gross margin 33.4%, operating income €655M; H1 FCF was €1.621B on €9.310B revenue (~17.41%). The five axes are Audience Scale, Premium Monetization, Ad Monetization, Unit Economics, and Profitability/Cash. Churn/retention is not invented because it is not separately disclosed in the selected Q2 sources.

The proposed sector is `INTERNET_PLATFORMS`, explicitly **provisional** with no benchmark ID. The model uses existing MPC taxonomy v1.1 drivers only; content royalty economics remain failure modes/common causes rather than an invented driver.

Primary sources:
- Spotify Q2 2026 Form 6-K / interim report: https://www.sec.gov/Archives/edgar/data/1639920/000162828026052543/spot-20260630x6xk.htm
- Spotify Q2 2026 Update, Exhibit 99.1: https://www.sec.gov/Archives/edgar/data/1639920/000114036126031044/ef20078867_ex99-1.htm
- Spotify FY2025 Form 20-F: https://www.sec.gov/Archives/edgar/data/1639920/000162828026006874/ck0001639920-20251231.htm

## 5. Host acceptance gates

1. RV engine 1.2.0 validation and authoritative run_ref/stability class.
2. MC validator 1.6.0 / Schema 1.0.2.
3. MC-G5-013 measured aggregate sigma, especially ASTS milestone probability/timing targets.
4. Dry run: no mapping warnings and deterministic output.
5. Intrinsic/full W diagnostics: B guide 0.40–0.85, C guide 0.60–1.30; warning is not a fitting target.
6. Local robustness v1.1.2 probability response.
7. Normative 500k host run, seed 20260920.
8. SPOT five canonical files validate against Company Artifact Schema v1.0.5; Dozor facts remain pending.
