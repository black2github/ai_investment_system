# Portfolio Optimizer v1.1 — Scenario-Conditional Addendum

Дата: 2026-09-30. Партия 10, часть A.

Это нормативная дельта к принятому Portfolio Optimizer v1.0. BASE objective и существующие owner constraints не переписываются.

## 1. Hard scenario gates

Для `S_cond = {s != BASE | p_s >= 0.10, probability_status=owner_judgment, B_s > 0}`:

- `ES5_5Y(w | s) >= -0.40`;
- `P(loss>30%)_5Y(w | s) <= 0.25`.

`B_s` берётся из Scenario Engine v1.1 §7: `p_s * max(0, ES5_BASE - ES5_s)`.

Scenario-specific metrics считаются на common path_id и условном scenario run `probability=1`.

## 2. ScenarioConcentration

Hard `<=0.60` только при >=2 positive burdens. В burden входят все non-BASE scenarios с известными owner probabilities, включая `p_s < 0.10`.

После ES5 ScenarioConcentration остаётся tie-break среди otherwise-equivalent feasible portfolios.

## 3. Feasibility placement

Structural owner constraints -> BASE risk constraints -> scenario-conditional gates -> concentration hard gate -> existing lexicographic objective/tie-break chain.

Никакого silent relaxation. Empty feasible set -> `INFEASIBLE`.

## 4. Probability changes

Каждое owner probability change запускает новый optimizer run. Crossing 0.10 меняет состав hard scenario gates. Calibrations не меняются. Strategies/conditional optima получают staleness flag, но не переписываются автоматически.

Machine-readable policy: `Portfolio_Optimizer_Scenario_Conditional_Policy_v1.0.yaml`.

По Calibration Lifecycle SemVer это semantic reissue Optimizer v1.0 -> v1.1.

## 5. Форма выпуска

Полный принятый текст Portfolio Optimizer v1.0 отсутствовал в доступном для партии 10 наборе Project-файлов. Поэтому пакет **не реконструирует его по памяти** и не объявляет такой текст полным переизданием. Этот addendum и machine-readable policy являются нормативной дельтой; интегратор накладывает её на канонический v1.0 хоста и выпускает полный v1.1 по действующему правилу «полный текст + дельта».
