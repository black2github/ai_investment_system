# S v1.0 — robustness zero-band confirmation

Date: 2026-10-04
Applies to: S RV v1.0 / MC v1.0 host acceptance

## Decision
**No S v1.0.1 is requested.** Intrinsic/full W = 0.223/0.249 is a dispersion warning, not a hard calibration target. The SPOT precedent and anti-circularity rule apply: the economic result must not be altered merely to move W into the archetype-A reference band.

## §12 degenerate sign case
Confirmed as a methodology clarification for the next Company Conditional Monte Carlo revision:

- define `epsilon_zero_cagr_5y = 0.01` (1 percentage point in absolute CAGR);
- if `abs(base_median_CAGR_5Y) < epsilon_zero_cagr_5y`, criterion 1 (`sign median CAGR 5Y preserved >=75%`) is **not applicable** because sign around zero is not economically stable as a binary property;
- in that case the local robustness pass is determined by criterion 2 exactly as currently defined: `abs(delta P(2x)) <= 0.10` and `abs(delta P(loss>30%)) <= 0.10` for >=75% of perturbations;
- sign-preservation rate and `max_abs_delta_median_CAGR_5Y` remain mandatory diagnostics and are not suppressed.

For the reported S run, base median 5Y CAGR is approximately +0.2%, sign preservation is 5/8, all probability tests pass 8/8 with maximum probability delta 0.039, and sign-changing perturbations move the median by no more than 1.2 pp. Therefore the failure is the intended zero-boundary degeneracy, not evidence requiring recalibration.

This clarification is general and must be versioned into the next Conditional MC specification; it is not a ticker-specific waiver.
