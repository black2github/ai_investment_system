# Investment System — Спецификация обратной оценки v1.0

Версия: 1.0  
Дата: 2026-09-20  
Статус: нормативная спецификация расчёта; числовая калибровка SPCX частично ожидается  
Горизонт: 5 лет  
Принцип: LLM формирует и объясняет допущения; все числовые расчёты выполняет детерминированный расчётный модуль.

## 1. Назначение

Обратная оценка отвечает не на вопрос «сколько должна стоить компания», а на вопрос:

> Какие операционные результаты компания должна показать за 5 лет, чтобы текущая рыночная стоимость была оправдана при заданных ставке дисконтирования, терминальной FCF-марже и терминальном мультипликаторе?

Главный выход — требуемый CAGR выручки за 5 лет (implied revenue CAGR). Дополнительно система показывает чувствительность результата к терминальной FCF-марже, терминальному мультипликатору и ставке дисконтирования.

Обратная оценка не является торговым сигналом. Она изменяет ось Valuation только через нормативные переходы triggers.yaml. Переход состояния не является инвестиционным решением.

## 2. Разделение ответственности

LLM:
- извлекает факты и ссылки;
- определяет применимое состояние State Vector;
- формирует причинное объяснение state-dependent assumptions;
- отмечает неподтверждённые входы;
- интерпретирует результат.

Детерминированный расчётный модуль:
- рассчитывает equity value и enterprise value;
- строит прогноз выручки и FCF;
- дисконтирует денежные потоки;
- решает обратную задачу по CAGR;
- строит sensitivity grid;
- классифицирует вычисленные параметры по утверждённым правилам V1…V5;
- сохраняет входы, версии и результат.

LLM не имеет права подменять числовой результат расчётного модуля.

## 3. Нормативные входы

```yaml
reverse_valuation_input:
  ticker:
  valuation_date:

  market:
    price:
    shares_outstanding:
    shares_source:
    equity_value: calculated

  balance_sheet:
    cash_and_equivalents:
    debt:
    net_debt:
    source:

  base_period:
    revenue_ttm:
    revenue_source:
    current_fcf:
    current_fcf_margin:
    source:

  discounting:
    discount_rate:
    source_or_rationale:

  terminal:
    fcf_margin_range:
      min:
      base:
      max:
    multiple_range:
      min:
      base:
      max:

  scenario_state:
    AI:
    Starlink:
    Starship:
    Capital_Intensity:

  calculation:
    forecast_years: 5
    revenue_growth_shape: constant_cagr
    terminal_method: equity_fcf_multiple
```

Обязательные входы для первого расчёта: цена, число акций, чистый долг/чистый кэш, TTM-выручка, ставка дисконтирования, текущая FCF-маржа, диапазон терминальной FCF-маржи и диапазон терминального мультипликатора.

Неподтверждённый числовой вход получает `status: pending_verification` и не может использоваться для нормативного перехода Valuation.

## 4. Базовые определения

Equity Value:

`EquityValue_0 = Price_0 × SharesOutstanding`

При положительном net debt:

`EnterpriseValue_0 = EquityValue_0 + NetDebt`

При net cash значение NetDebt отрицательно и уменьшает Enterprise Value.

Базовая выручка:

`Revenue_0 = Revenue_TTM`

При постоянном CAGR:

`Revenue_t = Revenue_0 × (1 + g)^t`

Следовательно:

`Revenue_5 = Revenue_0 × (1 + g)^5`

Терминальный FCF:

`FCF_5 = Revenue_5 × TerminalFCFMargin`

Терминальная стоимость собственного капитала при equity-FCF multiple:

`TerminalEquityValue_5 = FCF_5 × TerminalMultiple`

## 5. Переход текущей маржи к терминальной

Текущая FCF-маржа является начальной точкой траектории, а не терминальным допущением.

По умолчанию v1.0 использует линейную конвергенцию:

`FCFMargin_t = CurrentFCFMargin + (TerminalFCFMargin - CurrentFCFMargin) × t / 5`

`FCF_t = Revenue_t × FCFMargin_t`

Если состояние бизнеса требует иной формы перехода, она должна быть явно задана отдельным параметром `margin_transition_model`; молчаливое изменение формы запрещено.

## 6. Дисконтированная стоимость

Для годов 1–4:

`PV_FCF = Σ[FCF_t / (1+r)^t]`

Терминальный FCF пятого года включается в терминальную стоимость. Чтобы не считать его дважды:

`PV_Equity(g,m,M,r) = Σ(t=1..4)[FCF_t/(1+r)^t] + TerminalEquityValue_5/(1+r)^5`

Если выбран другой терминальный метод, он должен иметь отдельную версию модели.

Целевая обратная задача:

`PV_Equity(g,m,M,r) = EquityValue_0`

Расчётный модуль численно решает это уравнение относительно `g`.

Выход:

`ImpliedRevenueCAGR_5Y = g*`

Контрольная формула после найденного Revenue_5:

`g* = (Revenue_5 / Revenue_0)^(1/5) - 1`

## 7. Чистый долг и чистый кэш

Для основной модели v1.0 используется equity-FCF multiple. Поэтому терминальная стоимость рассчитывается непосредственно для собственного капитала, а net debt не вычитается второй раз.

Однако net debt сохраняется обязательным входом:
- для контроля баланса;
- для альтернативного EV/FCF метода;
- для будущей сопоставимости компаний.

Если применяется `terminal_method: enterprise_fcf_multiple`, формула меняется на:

`TerminalEV_5 = FCF_5 × TerminalMultiple`

`TerminalEquityValue_5 = TerminalEV_5 - NetDebt_5`

В таком случае требуется отдельное допущение `net_debt_5`. Смешивать equity multiple и EV multiple в одном расчёте запрещено.

## 8. State-dependent assumptions

State Vector не присваивает акции доходность напрямую. Он ограничивает допустимые операционные допущения.

### 8.1 AI — A0…A4

A0 — AI optionality  
AI не должен быть основанием для повышенной терминальной маржи или структурной премии. Диапазоны: `pending_calibration`.

A1 — AI demand validation  
Разрешается учитывать подтверждённый спрос, но не доказанную масштабную экономику. Диапазоны: `pending_calibration`.

A2 — AI monetization  
Разрешается учитывать существенную AI-выручку и подтверждённую положительную скорректированную EBITDA. Числовые диапазоны терминальной маржи/мультипликатора для SPCX ожидаются от владельца.

A3 — AI scale acceleration  
Относительно A2 допускается более сильная долгосрочная экономика только при подтверждённом одновременном росте масштаба, выручки и экономики. Числовая трансформация: `pending_calibration`.

A4 — AI overbuild / deterioration  
Допущения должны отражать ухудшение роста и/или экономики при высокой капиталоёмкости. Нельзя автоматически наследовать премию A2/A3. Числовая трансформация: `pending_calibration`.

### 8.2 Starlink — B0…B4

B0 — Early growth  
Экономика масштаба не считается доказанной. `pending_calibration`.

B1 — Subscriber acceleration  
Ускорение абонентской базы может поддерживать рост, но не само по себе терминальную маржу. `pending_calibration`.

B2 — Scale economics  
Разрешается учитывать доказанную экономику масштаба Connectivity. Числовые диапазоны для SPCX ожидаются от владельца.

B3 — Mature growth  
Рост сохраняется, но предпосылки долгосрочного CAGR должны снижаться относительно B2, если замедление подтверждено. `pending_calibration`.

B4 — Saturation / ARPU pressure  
Допущения должны отражать давление насыщения/ARPU и/или маржи. `pending_calibration`.

### 8.3 Starship — C0…C5

C0 — Development  
Неподтверждённая будущая экономика Starship не капитализируется как доказанный операционный результат. `pending_calibration`.

C1 — Successful suborbital validation  
Технологическая опциональность признана, но орбитальная эксплуатация, повторное использование и cost-to-orbit disruption ещё не считаются доказанными. Числовые диапазоны SPCX ожидаются от владельца.

C2 — Orbital validation  
Можно изменить операционные допущения только в части, причинно связанной с подтверждённой орбитальной работоспособностью. `pending_calibration`.

C3 — Reusability validation  
Разрешается учитывать доказанный эффект повторного использования. `pending_calibration`.

C4 — High-frequency operations  
Разрешается учитывать подтверждённый эффект высокой частоты эксплуатации. `pending_calibration`.

C5 — Cost-to-orbit disruption  
Разрешается учитывать экономический эффект только после измеренного подтверждения стоимости вывода по нормативному переходу. `pending_calibration`.

### 8.4 Capital Intensity — D0…D4

D0 — Capital discipline  
Минимальное структурное давление capex на FCF-конверсию. `pending_calibration`.

D1 — Investment expansion  
Рост инвестиций учитывается вместе с подтверждённым ростом бизнеса. `pending_calibration`.

D2 — Aggressive expansion  
Траектория FCF должна учитывать высокий capex. `pending_calibration`.

D3 — Extreme expansion  
Текущая FCF-маржа и путь к терминальной марже должны явно отражать экстремальную капиталоёмкость. Нельзя считать терминальную маржу достижимой мгновенно. Числовые диапазоны SPCX ожидаются от владельца.

D4 — Overinvestment risk  
Терминальные допущения должны ухудшаться относительно D3, если высокая капиталоёмкость сопровождается ухудшением роста/экономики. `pending_calibration`.

## 9. Комбинация состояний

Состояния A/B/C/D не складываются как баллы.

Для текущего вектора `A2 + B2 + C1 + D3` итоговый допустимый диапазон определяется пересечением ограничений осей:

`AllowedParameterSpace = Constraints(A2) ∩ Constraints(B2) ∩ Constraints(C1) ∩ Constraints(D3)`

Если пересечение пусто, модель не усредняет несовместимые допущения. Результат:

`status: assumption_conflict`

и требуется пересмотр калибровки владельцем.

До утверждения числовой калибровки состояние оси может изменять только те параметры, для которых зафиксирована причинная связь. Запрещено автоматически повышать terminal multiple из-за позитивного технологического состояния.

## 10. Sensitivity grid

Минимальная сетка рассчитывается по:

- terminal FCF margin: min / base / max;
- terminal multiple: min / base / max;
- discount rate: base, а в stress run — согласованный диапазон вокруг base.

Для каждой ячейки решается implied 5Y revenue CAGR.

Основная таблица 3×3:

`rows = terminal FCF margin {min, base, max}`  
`columns = terminal multiple {min, base, max}`  
`cell = implied revenue CAGR`

Отдельно сохраняется sensitivity к ставке дисконтирования.

## 11. Вычисляемые показатели

```yaml
reverse_valuation_output:
  model_version:
  run_id:
  valuation_date:
  scenario_state:
  inputs_hash:

  calculated:
    equity_value:
    enterprise_value:
    implied_revenue_cagr_5y:
    terminal_revenue:
    terminal_fcf_margin:
    terminal_fcf:
    terminal_multiple:
    pv_interim_fcf:
    pv_terminal_value:
    terminal_value_share_of_pv:

  sensitivity:
    margin_multiple_grid:
    discount_rate_grid:

  validation:
    converged:
    residual:
    input_verification:
    assumption_conflict:

  valuation_state:
    previous:
    candidate:
    transition_trigger:
    transition_allowed:
```

`terminal_value_share_of_pv` является диагностикой: высокая доля означает повышенную зависимость результата от дальних допущений, но сама по себе не меняет состояние Valuation без отдельного нормативного правила.

## 12. V1…V5

V0 — Not assessed  
Обратная оценка не рассчитана или обязательные входы не подтверждены.

V1 — Low implied expectations  
Числовые границы: `pending_calibration`.

V2 — Reasonable implied expectations  
Действующий переход V3→V2: implied 5Y revenue CAGR ≤20%, terminal FCF margin ≥20%, terminal multiple ≤30x FCF.

V3 — Demanding  
Действующий переход V4→V3: implied 5Y revenue CAGR ≤25%, terminal FCF margin ≥20%, terminal multiple ≤35x FCF.

V4 — Very demanding  
Текущее предварительное состояние SPCX. Переход V0→V4 в triggers.yaml использует market cap / TTM revenue ≥60x, но до утверждения reverse valuation model переход не должен вычисляться как окончательная reverse-valuation классификация.

V5 — Speculative / thesis-dependent  
Действующий переход V4→V5: reverse valuation требует revenue CAGR >35% AND terminal FCF margin >30% AND terminal multiple >35x FCF.

### 12.1 Важное ограничение v1.0

Спецификация не придумывает отсутствующие границы V1 и полный классификатор V1…V5. E-31/E-32/E-33 сохраняются без изменения.

До отдельного утверждения полного mapping:
- расчётный модуль вычисляет параметры;
- triggers.yaml проверяет существующие условия переходов;
- отсутствие сработавшего перехода означает сохранение текущего состояния, а не автоматическое присвоение соседней категории.

Таким образом, v1.0 не вводит скрытый single score и не заменяет нормативные переходы эвристикой «2 из 3».

## 13. Алгоритм расчёта

1. Проверить обязательные входы и первичные источники.
2. Зафиксировать State Vector на valuation_date.
3. Получить разрешённые диапазоны assumptions для текущей комбинации состояний.
4. Рассчитать EquityValue_0.
5. Для каждой комбинации terminal margin × terminal multiple × discount rate решить уравнение относительно CAGR.
6. Проверить сходимость и остаточную ошибку.
7. Сохранить sensitivity grid.
8. Передать вычисленные метрики движку переходов.
9. Оценивать только переходы, у которых `from` совпадает с текущим Valuation state.
10. При выполнении condition записать подтверждённый transition в state.json.
11. Создать Decision Request.
12. Не выполнять торговое действие автоматически.

## 14. Численная реализация

Рекомендуемый метод решения — bracketed root finding (например, Brent), а не LLM и не ручная итерация.

Начальный поисковый диапазон CAGR должен быть конфигурируемым. Если корень отсутствует внутри диапазона:
- расширить диапазон до системного hard limit;
- если корня всё равно нет, вернуть `no_solution_within_bounds`;
- не подставлять ближайшее значение как найденный CAGR.

Минимальные проверки:
- повторный расчёт PV на найденном CAGR;
- абсолютная/относительная residual tolerance;
- отсутствие NaN/inf;
- проверка единиц измерения;
- одинаковая валюта всех входов;
- отсутствие двойного учёта FCF_5;
- отсутствие смешения equity/enterprise multiples.

## 15. Источники и воспроизводимость

Каждый числовой вход хранит:
- value;
- unit;
- as_of;
- source;
- verification_status.

Первичные финансовые данные: SEC / Investor Relations. Рыночная цена может поступать из разрешённого ценового источника системы.

Каждый run хранит:
- версию спецификации;
- версию расчётного кода;
- полный набор входов;
- State Vector;
- assumptions;
- hash входов;
- timestamp;
- результат и validation status.

Одинаковые входы + одинаковая версия расчётного кода обязаны давать одинаковый результат.

## 16. Интеграция

`states.yaml` — определяет смысл состояний.  
`kpis.yaml` — определяет измеряемые KPI.  
`triggers.yaml` — определяет условия переходов.  
`state.json` — хранит фактические наблюдения и переходы.  
Расчётный модуль — вычисляет reverse valuation.  
Decision Request — передаёт решение владельцу.

Reverse valuation не переносит условия переходов обратно в states.yaml.

## 17. Ожидаемая калибровка SPCX

Для первого нормативного запуска SPCX ожидаются:
- чистый долг/чистый кэш из 10-Q;
- ставка дисконтирования;
- текущая FCF-маржа;
- диапазон terminal FCF margin для текущего `A2+B2+C1+D3`;
- диапазон terminal multiple для текущего `A2+B2+C1+D3`.

После получения этих значений они должны быть добавлены как версия калибровки, не меняя формулы v1.0.
