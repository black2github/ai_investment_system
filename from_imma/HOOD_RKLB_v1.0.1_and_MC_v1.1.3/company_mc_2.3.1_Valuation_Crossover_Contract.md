# company_mc 2.3.1 — Valuation Crossover Implementation Contract

## Function

Inputs per path/horizon:
- annual revenue `R`;
- FCF margin `m`;
- sampled revenue bridge multiple `M_R`;
- sampled FCF multiple `M_F`;
- operational eligibility margin `m_elig`;
- `Delta = 0.04`.

Preconditions:
- `R >= 0`;
- `M_R > 0`;
- `M_F > 0`.

Derived:
- `V_R = R * M_R`;
- `V_F = R * m * M_F`;
- `m_parity = M_R / M_F`;
- `m_start = max(m_elig, m_parity)`.

Pseudo-code:

```python
if m < m_elig:
    return V_R, PRE_ELIGIBILITY_BRIDGE

if m < m_start:
    return V_R, CROSSOVER_BRIDGE

if m < m_start + 0.04:
    w = (m - m_start) / 0.04
    value = (1 - w) * V_R + w * V_F
    return value, BASIS_BLEND

return V_F, FCF_MULTIPLE
```

For A/B:
- if `m < 0`, basis code remains `negative_fcf_fallback`;
- `m_elig = 0`.

For C:
- failure/no-service branches are resolved before this function;
- `m_elig = valuation.fcf_maturity_margin`.

## Required properties

For fixed `R/M_R/M_F`:
- continuity at `m_elig` where applicable;
- continuity at `m_start`;
- continuity at `m_start + 0.04`;
- non-decreasing value as m increases.

## Output basis codes

- 0 FCF/multiple
- 1 explicit or pre-maturity revenue bridge
- 2 negative_fcf_fallback
- 3 milestone_conditioned_EV
- 4 failure_residual
- 5 crossover_bridge
- 6 basis_blend

## RKLB central illustration

`M_R=7`, `M_F=24`, `m_elig=0.08`.

`m_parity = 7/24 = 0.291667`.

Therefore:
- 8–29.17% margin: bridge remains 7x revenue;
- 29.17–33.17%: linear blend;
- above 33.17%: FCF basis.

This is intentionally visible as bridge dependence rather than hidden by a discontinuous downward switch.
