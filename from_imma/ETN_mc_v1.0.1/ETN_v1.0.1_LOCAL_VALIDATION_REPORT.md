# ETN v1.0.1 — Local Validation Report

- YAML parse: PASS.
- `schema_version`: 1.0.2.
- `calculation_engine_version`: `company_mc 2.3.1`.
- Full supersedes tree: PASS — no removed or added YAML paths.
- Deep semantic diff count: **6**; expected: 6.
- Changed nodes: only six `effect_per_plus_1sigma` values targeting `revenue_model.segments.ElectricalAmericas.initial_growth`.
- Triangular distribution modes changed: **0**.
- Intrinsic distribution endpoints changed: **0**.
- Other stochastic targets changed: **0**.
- `robustness_tests` changed: **0**.
- Local company_mc / validator execution: NOT RUN in this environment.
- Host-provided diagnostic basis: exact ×0.75 scaling produced measured sigma ≈0.141 on preview, below MC-G5-013 cap 0.15. This must be re-verified on authoritative host-run.

## Deep diff
- `driver_parameter_mapping[0].stochastic_targets[0].effect_per_plus_1sigma`: `0.025` → `0.01875`
- `driver_parameter_mapping[1].stochastic_targets[0].effect_per_plus_1sigma`: `0.02` → `0.015`
- `driver_parameter_mapping[3].stochastic_targets[0].effect_per_plus_1sigma`: `0.02` → `0.015`
- `driver_parameter_mapping[4].stochastic_targets[0].effect_per_plus_1sigma`: `0.02` → `0.015`
- `driver_parameter_mapping[5].stochastic_targets[0].effect_per_plus_1sigma`: `0.015` → `0.01125`
- `driver_parameter_mapping[6].stochastic_targets[0].effect_per_plus_1sigma`: `0.012` → `0.009`
