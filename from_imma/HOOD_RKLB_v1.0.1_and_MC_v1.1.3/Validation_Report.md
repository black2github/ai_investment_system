# Validation Report — MC v1.1.3 / HOOD+RKLB v1.0.1

- HOOD_mc_calibration_v1.0.1.yaml: Schema v1.0.2 PASS
- RKLB_mc_calibration_v1.0.1.yaml: Schema v1.0.2 PASS
- fixture A: schema PASS
- fixture B: schema PASS
- fixture C: schema PASS
- HOOD central modes unchanged vs v1.0: PASS
- RKLB all numerical calibration parameters unchanged vs v1.0: PASS
- parity-gated crossover numerical monotonicity smoke tests: PASS
- RKLB central crossover continuity smoke tests: PASS

Not executed locally:
- live company_mc 2.3.1;
- measured MC-G5-013 on host Joint paths;
- intrinsic/full W;
- local robustness engine pass;
- 500k production convergence/determinism.
