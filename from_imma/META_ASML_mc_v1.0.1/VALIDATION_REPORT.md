# Local validation report — META / ASML MC v1.0.1

Generated 2026-09-24. This is a local preflight, not host acceptance.

## META
- JSON Schema Draft 2020-12 against Company_MC_Calibration_Schema_v1.0.2: **PASS**
- Supersedes tree completeness (removed paths): **0**
- Triangular mode changes: **0**
- Changed leaf values: **32** (tail endpoints + robustness perturbations only)

## ASML
- JSON Schema Draft 2020-12 against Company_MC_Calibration_Schema_v1.0.2: **PASS**
- Supersedes tree completeness (removed paths): **0**
- Triangular mode changes: **0**
- Changed leaf values: **28** (tail endpoints + robustness perturbations only)

## Scope limitations
- `company_mc 2.3.1` executable and host `artifact_validator 1.6.0` are not present in the restoration package, so no claim of a production 500k MC run, MC-G5-013 re-execution, or local robustness outcome is made here.
- MC-G5-013 mapping coefficients themselves are unchanged from v1.0; host preview reported the patched copies pass, but authoritative confirmation remains the host run.
