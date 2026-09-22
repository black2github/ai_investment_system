# Portfolio Stability Test — Specification v1.0

Дата: 2026-09-21  
Статус: proposed normative

## 1. Назначение

Central optimizer run не считается достаточным.

Stability Test отвечает:

> Сохраняется ли включение бумаги и разумный диапазон её веса при небольших, экономически правдоподобных изменениях предпосылок?

Он не выбирает компанию вместо Optimizer и не создаёт торговый сигнал.

## 2. Базовая единица

`central_run` = один полностью воспроизводимый optimizer run:
- зафиксированный universe;
- версии Company MC;
- scenario probabilities;
- correlation matrix;
- constraints;
- portfolio state.

Каждый perturbation run меняет только заранее указанный слой.

## 3. Набор возмущений v1.0

Все величины ниже — `model_assumption`.

### 3.1 Expected-return / operating outcome

Для каждого актива:
- shift median CAGR distribution: ±3 п.п.;
- severe shift: ±5 п.п.;
- не просто сдвиг median: соответствующий path-level scaling применяется к terminal relative value.

### 3.2 Correlations

- pairwise/rank correlation: ±0.10 base;
- ±0.15 stress;
- matrix после perturbation проектируется в ближайшую PSD только если исходное изменение сделало её невалидной;
- факт PSD repair записывается.

### 3.3 Scenario probabilities

Для каждого сценария:
- relative probability ×0.75 / ×1.25;
- затем renormalize;
- дополнительно `one-scenario-up` stress: крупнейший adverse scenario получает +10 п.п., пропорционально забирая вероятность у остальных.

### 3.4 Terminal assumptions

Для каждой компании:
- terminal multiple ±20%;
- terminal margin ±5 п.п.;
- для milestone model: probability major milestone ±10 п.п. absolute, ограничено [0,1].

### 3.5 Driver knockout

Для каждого material driver:
- удалить положительный вклад драйвера из conditional assumptions;
- компании с отрицательной exposure не получают искусственного бонуса;
- если Company MC не имеет driver→parameter mapping, тест возвращает `not_testable`, а не придумывает изменение.

Material driver:
`portfolio_weighted_absolute_exposure >= 0.30` — model assumption.

### 3.6 Leave-one-company-out

Каждая позиция с central target weight ≥5% исключается по одной и Optimizer запускается заново.

Цель — понять, является ли портфель структурно зависимым от одного имени.

## 4. Число прогонов

Минимальный normative set:
- central;
- return shifts;
- correlation shifts;
- scenario-probability shifts;
- terminal shifts;
- material-driver knockouts;
- leave-one-major-position-out.

Если комбинационный full factorial слишком велик, применяется deterministic one-factor-at-a-time + утверждённый Latin Hypercube combined set.

Для combined set v1.0:
`N = 500 perturbation configurations` — model assumption.

## 5. Inclusion Stability

Для бумаги:

`inclusion_frequency = runs(weight >= 1%) / valid_runs`

Классы:
- stable: ≥80%;
- conditional: 50–<80%;
- unstable: <50%.

Порог 1% отделяет реальное включение от numerical dust.

## 6. Weight Stability

Для бумаги с central weight ≥1%:

`weight_spread = P90(weight) - P10(weight)`

Stable weight, если одновременно:
- `weight_spread <= max(4 percentage points, 50% of central_weight)`;
- `|median_weight - central_weight| <= max(2 pp, 25% of central_weight)`.

Conditional:
- inclusion stable, но один из weight criteria не выполнен.

Unstable:
- inclusion_frequency <50%, либо central weight регулярно схлопывается в 0 при малых perturbations.

## 7. Portfolio-level stability

Portfolio считается structurally stable, если:
- hard-constraint feasibility ≥95% perturbation runs;
- median turnover from central target ≤25% NAV;
- P90 turnover ≤50% NAV;
- ни один single material driver knockout не делает портфель infeasible без замены;
- median 5Y CAGR sign не меняется более чем в 20% valid perturbation runs.

Последний критерий является диагностикой, а не оценкой качества доходности.

## 8. MPC robustness output

Для кандидата сравниваются Stability Test портфеля без и с кандидатом.

`robustness`:
- `improves` — feasibility/inclusion/turnover/scenario sensitivity улучшаются без material deterioration другого hard-risk metric;
- `neutral` — изменения внутри tolerance;
- `worsens` — портфель становится заметно чувствительнее, но кандидат сам остаётся stable/conditional;
- `unstable` — inclusion_frequency <50% либо weight stability = unstable.

MPC не сворачивает это в общий score.

## 9. Stability ≠ attractiveness

Стабильно плохой портфель возможен.

Высокая stability означает лишь, что решение не зависит критически от малых ошибок параметров.

Поэтому Stability Test всегда читается вместе с return/downside и никогда не повышает слабую standalone thesis автоматически.

## 10. Output

Сохраняются:
- central weights;
- inclusion frequency;
- P10/P50/P90 weight;
- weight spread;
- driver sensitivity;
- scenario sensitivity;
- terminal sensitivity;
- feasibility rate;
- turnover distribution;
- binding-constraint frequency;
- company classifications;
- portfolio classification;
- MPC robustness mapping;
- assumptions hash;
- perturbation seed/config.

`decision: none`.
