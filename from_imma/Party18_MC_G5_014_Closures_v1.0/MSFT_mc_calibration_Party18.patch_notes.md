# MSFT MC calibration patch notes — Party 18

- Supersedes: `MSFT_mc_calibration_v1.0.1.yaml`
- Reissue: `MSFT_mc_calibration_v1.0.2.yaml`
- Reason: MC-G5-014 scenario-mapping completeness.
- Unchanged: revenue/margin/valuation distribution nodes and modes, correlations, seed, simulation paths, robustness perturbations, reverse-valuation reference.
- Changed: `as_of`; `joint_simulation.active_drivers`; appended direct mapping(s) below.
- `INTEREST_RATES` → `valuation.Y5.multiple`, `log_multiplier`, effect `-0.018` per +1σ.

Effect sizes are `model_assumption`; they were not fitted to scenario returns or market price. Host must remeasure MC-G5-013 and dry-run determinism.
