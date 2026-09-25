# Scenario Engine v1.0 — calibration rationale and patch notes

Дата: 2026-09-25

## 1. Owner thesis preserved verbatim

> «Виден и второй, не менее вероятный сценарий — это просто технологическая гонка Китая и США. Китай сокращает разрыв
> в производстве микросхем. Отставание всего 3–5 лет. А затем заваливание Китаем рынка дешёвыми чипами (а он хорошо
> умеет это делать) делает сценарий силового захвата Тайваня ненужным. Тайвань (TSMC) начинает просто отставать. А его
> чипы нужны всем для использования LLM для военных нужд. И возникает вопрос о фактически двух параллельных
> производственных системах чипов — Запада и Китая. […] Здесь интересней посмотреть на последствия технологического
> превосходства Китая, когда США начинают усиленно вливать средства (в том числе и государственные), стараясь не
> отстать от Китая. Аналоги „холодной войны“, только в производстве чипов. Раз мы смотрим на горизонт до 8 лет, то это
> вполне рабочий сценарий. И то, что будет происходить на условной границе достижения паритета — весьма интересно
> оценить.»

## 2. Central design decisions

1. `AI_CLOUD_PRICING` is not redefined. It remains downstream AI-cloud price/economics. A new canonical driver `ACCELERATOR_PRICE_COMPETITION` covers accelerator ASP/price-performance competition.
2. `TAIWAN_SUPPLY` retains one meaning: health/availability of Taiwan-linked semiconductor supply. In CHIP_COLD_WAR its negative shift at/after parity represents access friction and duplicated supply chains, not a claim that Taiwan becoming less strategically valuable is itself a supply shock. The accepted MSFT/META negative signs are therefore a semantic mismatch: the patch proposes flipping them through full company reissues; normative scenario runs may not silently use the old signs.
3. Phase overrides are absolute states relative to BASE. Missing driver = BASE. This prevents accidental inheritance.
4. CHIP_COLD_WAR parity timing uses triangular q12/q16/q20 solely because the owner thesis says 3–5 years; probability remains pending_owner_judgment.
5. TAIWAN_SEIZURE is conditional on an escalation path. Phase timing ranges are model assumptions, not unconditional geopolitical forecasts. The legacy `portfolio/_scenarios/taiwan.yaml` remains an action/notification plan and is not valuation input.
6. ScenarioConcentration is based on probability-weighted adverse ES5 burden. Median/ES diagnostics are reported but are not asserted to add exactly.
7. The new mapping patch is **not auto-integrated**. Each affected company must be fully reissued and pass measured MC-G5-013 before the new driver becomes normative for that company.

## 3. Calibration scale

The exploratory host run is used only as a scale sanity check. No phase magnitude was fitted to reproduce its company or portfolio deltas. The largest Taiwan shifts are intentionally in the same order as the exploratory -2σ supply/China shocks, while conflict adds a more severe but time-limited phase. Cold-war steady-state magnitudes remain mostly 0.75–1.5σ, with extra volatility at the parity boundary.

## 4. PSD

Every phase-specific root correlation target was checked against the Joint v1.0 base matrix. Automatic PSD repair is forbidden for normative scenario calibration.

## 5. Probabilities

Both scenario files retain `probability: null` / `pending_owner_judgment`. Therefore scenario-specific host runs are testable immediately; mixture metrics, ScenarioConcentration and probability Stability are blocked until the owner supplies probabilities. BASE is the residual.

## 6. Compatibility

company_mc 2.3.2 can run constant scenario overrides but not phases. Until phase orchestration exists, any run that freezes one phase across the whole horizon must be marked non-normative compatibility/exploratory. Company calibrations remain unchanged except future accepted mapping reissues for the new driver.
