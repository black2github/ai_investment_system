# META / ASML MC v1.0.1 — tail-expansion patch notes

**Status:** NON-NORMATIVE PATCH PLAN. These files are not substitutes for the complete v1.0.1 calibrations.
A normative reissue must contain the complete v1.0 calibration plus the delta below and must pass the mechanical
`check_supersedes.py` test.

## LLY v1.0 — anti-circularity confirmation

LLY v1.0 is accepted unchanged. The intended calibration logic was independent of market price / reverse valuation:
the tirzepatide growth center was anchored to operating evidence supplied in the order — tirzepatide +73% YoY,
company revenue +48% YoY, volume +60% and realized price -13% — together with explicit mean reversion and concentration
risk. Reverse valuation was a diagnostic output, not an input used to choose the growth center. The resulting +2.3 pp
RV gap is therefore an admissible coincidence under §23, not a calibration target.

Because the base `LLY_mc_calibration_v1.0.yaml` is not present in the recovery package, this note deliberately does not
invent or restate an exact numeric mode that cannot be verified from the source file.

## META v1.0 → v1.0.1

Host evidence: intrinsic/full W 0.214/0.250; q5..q95 5Y CAGR +0.3%..+25%; P(loss>30)=0.004. This is too narrow as a
representation of a capital-intensive transition with current capex/revenue around 51% and current FCF margin around
1.3%. The v1.0.1 change therefore broadens only distributions, not centers.

The patch deliberately adds an asymmetric adverse tail to Advertising growth and, more importantly, a persistent
high-capex branch at Y3-Y5/Y8. OCF and valuation distributions are broadened independently so that a failed or delayed
AI-capacity payback can arise from more than one latent channel. No driver mapping coefficient is increased merely to
manufacture dispersion; MC-G5-013 limits remain unchanged.

Archetype-B W=0.40-0.85 remains a diagnostic orientation. The patch is **not** to be iterated until W reaches 0.40.
One host run is evaluated economically; if W remains below 0.40, the result is documented rather than fitted.

## ASML v1.0 → v1.0.1

Host evidence: intrinsic/full W 0.214/0.246; P(loss>30)=0.339; growth -10 pp moved P(loss>30) by about +0.40. The
central economics are therefore sensitive, but the unconditional input distributions understate the cyclicality around
them.

v1.0.1 broadens EUV and DUV initial and long-run growth, with DUV carrying the larger downside regime; Installed Base
is widened modestly because it is structurally steadier. Y5/Y8 FCF-margin tails and valuation multiples are broadened,
while all centers and all EUR-denominated facts remain unchanged.

As with META, the archetype-A 0.25-0.50 band is diagnostic, not a calibration objective.

## Required normative reissue procedure

1. Start from the exact accepted/rejected host input `META_mc_calibration_v1.0.yaml` / `ASML_mc_calibration_v1.0.yaml`.
2. Apply only the operations in the corresponding PATCH_PLAN.
3. Recompute v1.1.2 materialized robustness perturbations from the new distribution sigmas.
4. Increment only the artifact version metadata required by the house convention; keep schema_version=1.0.2 and
   calculation_engine_version=`company_mc 2.3.1`.
5. Run `check_supersedes.py old new`; zero unexplained missing paths is mandatory.
6. Run validator 1.6.0 / MC-G5-001..013 / dry-run / determinism / intrinsic+full W / local stability / 500k normative run.
7. Do not alter RV calibrations: accepted host refs remain `…-94a270` (META) and `…-2d7985` (ASML).
