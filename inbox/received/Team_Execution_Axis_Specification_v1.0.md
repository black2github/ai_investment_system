# Team & Execution Axis — Specification v1.0

Дата: 2026-09-21  
Статус: proposed normative additive company-model axis  
Axis ID: `Team_Execution`

## 1. Цель

Разделить проверяемую историю исполнения команды и непроверяемый остаток доверия владельца. История основателя является фактом, но не должна автоматически создавать высокий state: это защита от survivorship bias.

## 2. KPI

`TEAM-KPI-01 Guidance hit rate` = hit_or_beat / valid guidance observations. Наблюдение valid только если guidance опубликована до периода и actual сопоставим по определению. Если management не даёт guidance → `not_applicable`, а не 0.

`TEAM-KPI-02 Consecutive guidance misses` — число подряд периодов, где actual ниже нижней границы собственной guidance.

`TEAM-KPI-03 Major milestone on-time hit rate` = on-time / completed due milestones. Считаются только milestones с заранее опубликованным сроком и проверяемым completion criterion.

`TEAM-KPI-04 Key team retention 24m` = retained key people / key people at window start. Key team определяется ex ante: founder/CEO, CFO, CTO/Chief Product/Engineering, COO либо другой material operating leader. Источники: 8-K, proxy/20-F, IR.

`TEAM-KPI-05 Insider beneficial ownership` — факт из proxy/20-F/beneficial ownership filings; не является монотонным «чем больше, тем лучше» KPI.

`TEAM-KPI-06 Share dilution CAGR` = `(diluted_shares_end/diluted_shares_start)^(1/years)-1`; отдельно хранится причина: SBC/acquisition/capital raise.

`TEAM-KPI-07 Capital allocation adverse events 36m`: material acquisition impairment; formally abandoned major project after material spend; emergency financing из-за liquidity shortfall; buyback, за которым вскоре последовал dilutive issuance по причине нехватки ликвидности. Только первичные источники.

`TEAM-KPI-08 Founder prior operating outcome`: previous company, role, tenure, measurable outcome, source. Не участвует напрямую в T-state threshold.

## 3. T0–T4

Все пороги — `model_assumption`.

**T0 insufficient_or_unproven**: <4 valid guidance observations и <2 due milestone observations, либо существенно новая команда <12 месяцев. Это недостаточность выборки, не негативная оценка.

**T1 mixed_execution**: при достаточной выборке guidance hit <60%, либо milestone on-time <50%, либо ≥2 consecutive guidance misses, либо key-team retention <60%.

**T2 reliable**: ≥6 combined valid observations; guidance hit ≥70% либо N/A; milestone hit ≥60% либо N/A; <2 consecutive misses; retention ≥70%; ≤1 material capital-allocation adverse event за 36m.

**T3 strong_execution**: ≥8 observations; guidance hit ≥80% либо N/A; milestone hit ≥75% либо N/A; retention ≥80%; 0 capital-allocation adverse events за 24m; нет material reporting/control failure.

**T4 repeated_exceptional_execution**: ≥12 observations; ≥24m coverage; guidance hit ≥85% либо N/A; milestone hit ≥85% либо N/A; retention ≥80%; 0 capital-allocation adverse events за 36m; ≥2 major milestones delivered on/before published schedule; T3+ сохранялся ≥4 reporting periods. T4 нельзя присвоить только из-за биографии основателя.

## 4. Guidance gaming guard

Хранятся `initial_guidance`, `latest_guidance`, `actual`, `guidance_revision_direction`.

T3/T4 блокируются, если midpoint guidance снижался ≥10% дважды в последних 8 observations, а затем формально «beat» сниженный диапазон. Порог — `model_assumption`.

## 5. MC integration

Team axis не меняет median growth или terminal multiple. Он меняет только `company_idiosyncratic_execution_sigma`.

Verified multipliers: T0 1.10; T1 1.05; T2 1.00; T3 0.95; T4 0.90.

Owner residual: `owner_judgment_multiplier ∈ [0.90,1.10]`, provenance=`owner_judgment`, validity ≤12 months.

`combined = clamp(T_multiplier × owner_multiplier, 0.80, 1.20)`.

## 6. Review events

Автоматический review Team state вызывают: CEO/CFO/CTO departure; material restatement; guidance withdrawal; ≥2 consecutive guidance misses; material impairment; major milestone delay beyond published window.

Изменение Team state само по себе не является trade decision.
