# Scenario Action Layer v1.2 — Part B Action Derivation Report

Дата: 2026-10-01
Партия 10, часть B.

## База дельт
`20260929T225008Z-portfolio_optimizer-5a6da6` — оптимум отбора C2. Его 15 security weights сохранены.
Для сопоставимости с conditional optima применены уже действующие fixed positions: GLD=0.0220, UFO=0.0017; cash residual=0.1763.
Это убирает искусственную cash-delta от самого факта фиксации GLD 2.2%. GLD не становится фазовым действием.

До завершения общей перекладки в C2 фазовые стратегии не применяются к весам 18.09; selection rebalance — отдельный сигнал.

## Дельты после deadband/rounding

### TAIWAN_SEIZURE
| phase | optimum | actions | gross turnover |
|---|---|---|---:|
| RESTRICTIONS | `20260930T230041Z-portfolio_optimizer-ea1b90` | NBIS -0.0700, CASH +0.0200, ASTS +0.0300, META +0.0150, LLY +0.0050 | 0.1400 |
| BLOCKADE | `20260930T230630Z-portfolio_optimizer-052179` | NBIS -0.0600, CASH +0.0200, ASTS +0.0250, LLY +0.0050, META +0.0050, MSFT +0.0050 | 0.1200 |
| CONFLICT | `20260930T231229Z-portfolio_optimizer-e0569e` | NBIS -0.0650, CASH +0.0200, ASTS +0.0250, MSFT +0.0100, LLY +0.0050, META +0.0050 | 0.1300 |
| RECOVERY | `20260930T231749Z-portfolio_optimizer-cad140` | NVDA -0.0250, NBIS -0.0200, LLY -0.0100, META +0.0500, ASTS +0.0050 | 0.1100 |

### TAIWAN_QUARANTINE
| phase | optimum | actions | gross turnover |
|---|---|---|---:|
| RESTRICTIONS | `20260930T232346Z-portfolio_optimizer-9ef262` | NBIS -0.0250, LLY -0.0050, NVDA -0.0050, META +0.0300, ASTS +0.0050 | 0.0700 |
| QUARANTINE | `20260930T233041Z-portfolio_optimizer-49f452` | NBIS -0.0250, LLY -0.0050, META +0.0250, ASTS +0.0050 | 0.0600 |
| NORMALIZATION_OR_FROZEN | `20260930T233619Z-portfolio_optimizer-f449b4` | RKLB -0.0250, PLTR -0.0200, NBIS -0.0150, SPCX -0.0100, CASH +0.0200, META +0.0250, ASTS +0.0200, LLY +0.0050 | 0.1400 |

Все planned gross turnover <= 0.15 NAV.

## Risk budget
`before` = фактические current weights 18.09 на phase-specific paths; `after` = conditional optimum. Это отдельная risk before/after пара и не база action deltas.

## GLD
GLD остаётся fixed 2.2% NAV. В стратегиях нет GLD action и нет заявления о численном hedge benefit без принятой Hedge_Instrument_Model.
