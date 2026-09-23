# Company Conditional Monte Carlo v1.1.3 — Patch Notes

Delta от принятой v1.1.2:

1. Engine pin: `company_mc 2.3.1`.
2. Hard discontinuous switch revenue_bridge <-> FCF_multiple запрещён.
3. Принят `parity_gated_linear_blend_v1`:
   - operational eligibility;
   - dynamic value-parity margin `M_bridge/M_fcf`;
   - blend start = max(eligibility, parity);
   - linear blend шириной 4 п.п.;
   - после band используется FCF basis.
4. Новые basis diagnostics: `crossover_bridge` и `basis_blend`.
5. Правило применяется:
   - A/B: negative_fcf_fallback <-> FCF_multiple;
   - C: post-service revenue_bridge <-> FCF_multiple.
6. Symmetric blend вокруг fixed maturity threshold **не принят**: он делает функцию continuous, но не гарантирует monotonicity. На RKLB 7x revenue vs 24x FCF при 8–12% margin он всё равно снижал бы value.
7. В полный текст встроены ранее принятые v1.1.2 robustness и MC-G5-013 semantics.
8. Milestone caps синхронизированы с Joint Rules v1.1.2: 0.35 logit / 1.0 quarter.

Численные company calibration centers этим патчем не меняются.
