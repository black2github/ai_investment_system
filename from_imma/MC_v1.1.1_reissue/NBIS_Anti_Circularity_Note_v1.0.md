# NBIS — Anti-Circularity Note for Initial AI Cloud Growth

Дата: 2026-09-23  
Связано с: `NBIS_mc_calibration_v1.0.1.yaml`  
Проверка: MC-G5-009 semantic review

## Проблема

Authoritative RV run:

`20260923T133421Z-reverse_valuation-ba01b6`

даёт implied revenue CAGR 5Y ≈ 64.3%.

Предыдущий MC run дал median revenue CAGR ≈ 63.6%, то есть RV_Growth_Gap ≈ +0.7 п.п.

Такое совпадение требует доказать, что MC growth не был выведен из рыночной цены.

## Независимые раскрытые факты

Q2 2026 shareholder letter / earnings materials:

1. Nebius AI cloud revenue Q2 = **$574.9M**, рост **514% YoY**.
2. ARR на конец июня = **$3.0B**, рост **56% QoQ** с $1.9B.
3. Компания сообщает **более $40B customer commitments**.
4. Четыре крупные AI-cloud сделки Q2 имели средний TCV >$1B; Q2 TCV почти в 4 раза выше QoQ.
5. Около **70%** Q2 deals включали customer prepayments, покрывавшие **50–60% associated capex**.
6. Большинство этих сделок связано с capacity, приходящей в late-2026, и должно в основном влиять на **2027 revenue**.
7. Company guidance: **5 GW contracted power by YE2026**; planned deployment >1 GW/year starting 2027.
8. Actual contracted-power KPI на дату Q2 отдельно не раскрыт и остаётся `pending_verification`; guidance не заменяет actual.

## Как из этого получается distribution

Нет формулы вида:

`120% = f(5 GW, $40B, prepayments)`.

Это было бы ложной точностью.

`initial_growth` — model_assumption, но operating-evidence-bounded и независимо от цены.

Центр **120%** означает:
- сильное снижение относительно текущего 514% YoY;
- всё ещё более чем удвоение AI-cloud revenue в первый модельный год;
- такое удвоение не требует конвертировать весь $40B commitments в один год;
- оно совместимо с ARR $3B, late-2026 capacity ramp, >1GW/year deployment guidance и крупными prepay-backed contracts.

v1.0.1 оставляет mode **1.20** неизменным, но расширяет tails:

```yaml
initial_growth:
  min: 0.40
  mode: 1.20
  max: 2.20
```

Интерпретация:
- 40%: сильная задержка capacity conversion / pricing / utilization относительно текущего run-rate;
- 120%: центральный переход от экстремального 514% YoY к всё ещё гиперросту;
- 220%: успешная конверсия late-2026/2027 capacity и commitments, но всё равно заметно ниже текущего 514% YoY.

Ни одна из трёх точек не использует NBIS share price, market cap, RV implied CAGR или Price_Expectation_Gap.

## Вывод

Близость 63.6% MC 5Y median revenue CAGR к 64.3% RV implied CAGR является **output coincidence**, а не входом
калибровки. После v1.0.1 это должно быть проверено повторным host run: центр growth не изменён, но intrinsic tails
шире, а Joint stochastic effects существенно уменьшены.
