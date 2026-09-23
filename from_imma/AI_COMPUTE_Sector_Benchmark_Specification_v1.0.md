# AI_COMPUTE Sector Benchmark — спецификация v1.0

Дата: 2026-09-21  
Идентификатор: `AI_COMPUTE_BASKET_V1`

## 1. Назначение

Benchmark используется только для измерения **секторной просадки** в `portfolio_regime`. Он не является valuation benchmark и не используется для alpha.

## 2. Почему не SOX/IGV

Смесь SOX/IGV отвергнута в v1. SOX описывает economics поставщиков полупроводников, IGV — software. Для GPU-cloud ключевые риски — power delivery, capex, leverage, customer concentration, contract conversion и GPU availability. Эти риски смесь SOX/IGV теряет.

## 3. Состав v1

Стартовый состав:

- `NBIS` — 50%;
- `CRWV` — 50%.

Вес равный. Yahoo используется только для цены, а не для market cap.

Это **внутренний synthetic basket**, поэтому `benchmark_quality=provisional_low_breadth`.

## 4. Критерии включения

Компания должна непосредственно продавать AI/HPC compute cloud capacity; этот бизнес должен быть основным или давать >50% квартальной выручки; должны существовать публичная квартальная отчётность и ежедневная цена.

Pure hosting/colocation, GPU suppliers и общие hyperscalers не включаются автоматически.

Новый тикер после initial constituents должен пройти критерии два квартала подряд.

## 5. Формула

В дату ребалансировки:

`w_i = 1 / N`

Между ребалансировками:

`Index_t = Index_r × Σ[w_i,r × P_i,t / P_i,r]`

где `P` — split-adjusted close Yahoo chart.

Ребалансировка — первый торговый день после конца календарного квартала. При смене состава индекс chain-link'ится, история не переписывается.

## 6. Просадка

`DD_AI_COMPUTE(t) = Index_t / max(Index over previous 365 calendar days) - 1`

## 7. Качество

Carry-forward цены допустим максимум на один торговый день. Более длинный пропуск переводит benchmark в `degraded`, и сектор временно исключается из aggregation.

`benchmark_coverage=true`, но `benchmark_quality=provisional_low_breadth`. Полное качество требует минимум четырёх eligible constituents.

## 8. Regime engine

AI_COMPUTE входит в обычный `weighted_sector_drawdown` с текущим весом сектора в NAV.

Дополнительно вводится concentration override — **модельное допущение**:

- AI_COMPUTE ≥20% NAV и DD ≤−25% → общий режим не мягче `Stress`;
- AI_COMPUTE ≥25% NAV и DD ≤−40% → общий режим не мягче `Shock`.

Override задаёт только floor и не удваивает секторную просадку.

## 9. Пересмотр

При появлении новых чистых публичных GPU-cloud operators они проходят eligibility. При четырёх и более компонентах quality может быть повышено отдельной версией методологии.
