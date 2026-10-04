# Portfolio Optimizer v1.1 §2 — proposed ES5 materiality hurdle inside median tolerance

Status: **pending owner judgment; not normative.**

Current issue: global search can prefer a point whose median is within the allowed 0.5 percentage-point tolerance of the best median based on very small second-decimal ES5 differences.

Proposed rule: within the 0.5pp median-tolerance set, a portfolio may give up median return relative to the best-median feasible point only if its ES5 improves by at least **0.02 absolute 5Y return units**. If the ES5 improvement is `< 0.02`, select the higher-median point (subject to all structural constraints and deterministic tie-breaks).

Provenance of `0.02`: `model_assumption`, status `pending_owner_judgment`. It must not be enforced until an owner decision promotes it to `owner_judgment`.
