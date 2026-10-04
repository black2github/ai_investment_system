# PLTR MC calibration patch notes — Party 18

- Supersedes: `PLTR_mc_calibration_v1.0.yaml`
- Reissue: `PLTR_mc_calibration_v1.0.1.yaml`
- Reason: MC-G5-014 scenario-mapping completeness.
- Unchanged: revenue/margin/valuation distribution nodes and modes, correlations, seed, simulation paths, robustness perturbations, reverse-valuation reference.
- Changed: `as_of`; `joint_simulation.active_drivers`; appended direct mapping(s) below.
- `CAPITAL_MARKETS` → `valuation.Y5.multiple`, `log_multiplier`, effect `+0.015` per +1σ.
- `INTEREST_RATES` → `valuation.Y5.multiple`, `log_multiplier`, effect `-0.025` per +1σ.

Effect sizes are `model_assumption`; they were not fitted to scenario returns or market price. Host must remeasure MC-G5-013 and dry-run determinism.
