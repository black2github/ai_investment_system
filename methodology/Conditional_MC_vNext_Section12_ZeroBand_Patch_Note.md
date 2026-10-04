# Conditional MC — proposed next-edition §12 clarification

Status: **methodology clarification accepted in Party 15; pending incorporation into the next full normative reissue.**

Add parameter `epsilon_zero_cagr_5y = 0.01` (absolute CAGR units). If `abs(base_median_cagr_5y) < epsilon_zero_cagr_5y`, the robustness criterion requiring preservation of the sign of median 5Y CAGR is **not applicable**, because the base case is inside the zero band and small economically immaterial perturbations can flip a binary sign.

For a zero-band case, robustness pass/fail is determined by the probability-metric criterion already in §12 (`|ΔP(2x)| <= 0.10` and `|ΔP(loss>30%)| <= 0.10` for every required perturbation). Sign-preservation rate and maximum absolute median-CAGR change remain reported diagnostics.

This is a general rule, not a ticker-specific waiver.
