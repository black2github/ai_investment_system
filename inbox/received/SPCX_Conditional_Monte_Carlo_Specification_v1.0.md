# Спецификация условного Монте-Карло SPCX v1.0

Дата: 2026-09-20  
Текущий вектор: A2 + B2 + C1 + D3

## 1. Принцип

Модель не выбирает случайный «сценарий SpaceX» одним броском. Сначала фиксируется состояние осей, затем внутри этого состояния моделируется неопределённость операционных параметров:

`State Vector → Conditional Parameter Distributions → Monte Carlo → Valuation → Return Distribution`

Текущий нормативный запуск условен на A2+B2+C1+D3. Переход C1→C2 после подтверждённого события создаёт новую версию conditional run, а не задним числом меняет старый.

## 2. Исходные факты

Q2 2026: Space revenue $0.962B, Connectivity $4.291B, AI $2.561B; AI adjusted EBITDA $1.146B; total capex $18.369B, AI capex $15.828B; compute 1.4 GW; Starlink subscribers 12.0M; Connectivity operating income $1.656B. Это первичные факты SEC. citeturn0search0

Все диапазоны роста, корреляции, volatility, узлы неопределённости и robustness thresholds в calibration YAML, если прямо не указан источник, являются **модельными допущениями**.

## 3. Выручка

Выручка моделируется отдельно по AI, Connectivity и Space. Для каждого сегмента случайно выбирается начальный annual growth и долгосрочный growth к Y8; между ними рост экспоненциально возвращается к долгосрочному уровню с заданным half-life (периодом, за который отклонение сокращается вдвое).

Это не экстраполирует Q2 YoY: например, AI +247% и Connectivity +66% являются наблюдениями, но не параметрами восьмилетнего CAGR. citeturn0search0turn0search2

`Revenue_total,t = Revenue_AI,t + Revenue_Connectivity,t + Revenue_Space,t`

## 4. FCF-маржа

Нормативная двухфазная форма D3 сохраняется. В MC сами узлы случайны вокруг calibration_v1.0:

- Y1 вокруг −75%;
- Y2 вокруг −15%;
- Y3 вокруг +10%;
- Y4 как случайная доля Y5;
- Y5 terminal margin 20–34%.

Ограничения монотонности не позволяют случайному шуму создать экономически бессмысленный путь, например Y2 хуже Y1 при базовом D3-normalization run. Если срабатывает D3→D4, используется отдельная conditional calibration, где это ограничение может быть пересмотрено.

## 5. Оценка на горизонтах

На Y5 применяется FCF multiple из принятой reverse-valuation calibration: 25x / 32x / 40x как triangular distribution.

На Y3 FCF находится около точки перелома, поэтому FCF multiple математически нестабилен. v1.0 использует отдельный revenue-multiple bridge 8x / 14x / 22x — **модельное допущение**, которое обязательно проходит sensitivity test.

На Y8 multiple сжимается до 20x / 27x / 35x FCF — **модельное допущение созревания**.

`EquityValue_h = FCF_h × FCFMultiple_h` для Y5/Y8.

Для Y3:

`EquityValue_3 = Revenue_3 × RevenueMultiple_3`

Будущие net cash/debt не моделируются в v1.0 как независимый источник стоимости. Если баланс становится материальным относительно equity value, это основание для версии 1.1.

## 6. Зависимости

Независимое случайное моделирование всех параметров запрещено. Используется copula/rank-correlation слой. Основная причинная связь: сильный AI demand повышает AI growth; execution и capital efficiency одновременно влияют на рост и FCF-normalization.

Переход C1→C2 в v1.0 в первую очередь сдвигает Space growth distribution. Он не даёт автоматической премии terminal margin/multiple: орбитальная валидация ещё не равна доказанной экономике повторного использования.

## 7. Число прогонов и seed

Норматив: 500 000 путей, seed 20260920, quarterly timestep. Это **модельное допущение**. Движок должен дополнительно выполнить convergence check на 100k / 250k / 500k: median CAGR 5Y и ES5% должны стабилизироваться в пределах заранее заданной численной tolerance движка.

## 8. Доходность

Для каждого горизонта:

`CAGR_h = (EquityValue_h / EquityValue_0)^(1/h) - 1`

P(2x) и P(5x) — доля путей, где terminal equity value не меньше 2× или 5× текущей equity value.

## 9. Downside

Обязательные выходы:
- P(loss >30%);
- P(loss >50%);
- Expected Shortfall 5% — средний итоговый return худших 5% путей;
- max drawdown distribution.

Max drawdown требует промежуточного market-price path, поэтому он сильнее зависит от модели, чем terminal CAGR. Он должен маркироваться `model_dependent: true`.

## 10. Scenario Robustness

Повторяются MC runs при систематическом сдвиге:
- growth modes ±10 п.п.;
- margin nodes ±5 п.п.;
- terminal multiple ±20%;
- correlations ±0.15.

Порог pass в v1.0 — знак median 5Y CAGR сохраняется минимум в 75% perturbation runs. Это **модельное допущение**, не статистически установленный закон.

## 11. Scenario Concentration

После появления нескольких допустимых State Vector scenarios рассчитывается:

`ScenarioConcentration = Max(ExpectedTerminalValue_s × Probability_s) / Σ(ExpectedTerminalValue_s × Probability_s)`

Warning ≥60%, fail ≥80% — **модельные допущения v1.0**.

Для единственного текущего conditional state показатель не интерпретируется: технически он был бы 100%, но это не означает реальную концентрацию сценариев, пока scenario probability layer не построен.

## 12. Persistence Ratio

`PersistenceRatio = median_CAGR_8Y / median_CAGR_5Y`

v1.0:
- ≥0.75 — strong;
- 0.50–0.75 — moderate;
- <0.50 — weak.

Пороги — **модельные допущения**. Если 5Y CAGR ≤0, ratio не классифицируется, поскольку отношение теряет экономический смысл.

## 13. Численная целостность

Один seed + одна версия calibration + одна версия кода должны давать один результат. Сохраняются hash входов, seed, число путей, версии distributions и correlation matrix.

Движок обязан проверять positive-semidefinite correlation matrix, отсутствие NaN/inf, соблюдение constraints, стабильность квантилей и отсутствие look-ahead между state transition и датой расчёта.

## 14. Связь с reverse valuation

Reverse valuation отвечает: «что должна показать компания, чтобы оправдать сегодняшнюю цену?»

Conditional Monte Carlo отвечает: «каково распределение результатов, если операционные параметры действительно распределены так, как допускает текущее состояние?»

Поэтому implied CAGR 76.3% из reverse valuation не используется как центр MC growth distribution. Иначе модель была бы циклической и автоматически подгоняла бы фундаментальный прогноз к текущей цене.

## 15. Trigger ≠ Decision

MC run может изменить оценку риска, устойчивости и привлекательности Challenger/Core, но сам не совершает сделку. Числовой результат передаётся Portfolio Optimizer и владельцу.
