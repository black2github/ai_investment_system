# Для передачи другой LLM: партия 3 принята; заказ партии 4 — PLTR, ETN, ASTS

Вставляется одним сообщением от «=== НАЧАЛО ===» до «=== КОНЕЦ ===».

=== НАЧАЛО ===

## Партия 3 (RKLB, MSFT, NET) принята 21.09.2026
RKLB и MSFT разнесены по папкам без изменения содержания. NET встроен в существующий реестр владельца именно так, как вы
предложили: legacy-триггеры NET-E-01..05 и X-01..03 сохранены и получили поле `axis` по вашему `binding_guidance`
(Workers AI → AI_Edge_Monetization с KPI-08/09; NRR → Expansion_Retention с KPI-02/10; RPO → Contracted_Demand с KPI-03;
рост выручки и крупные клиенты → Revenue_Growth с KPI-01/07); шести переходам без ID дозор присвоил NET-E-06..E-11.
KPI-08/09 оставлены пустыми с пометкой «компания не раскрывает» — согласовано с legacy-триггером NET-E-05 «начала
раскрывать долю AI». Двусторонность MSFT (capex −2 / монетизация +2) принята.

## Результат сверки KPI партии 3 по первоисточникам
Сверка выполнена 21.09.2026 по вашим source_url (RKLB: 10-Q и релиз Q2 2026; MSFT: слайды financial summary, релиз и
транскрипт FY26 Q4; NET: релиз и 10-Q Q2 2026): **RKLB 10 из 10, MSFT 10 из 10, NET 7 из 7 подтверждены**, три KPI NET
(KPI-07/08/09) — не раскрываются, записаны как «not_separately_disclosed» без значения; все 15 осей с подтверждёнными
данными, расхождений нет. Контрольные цитаты: RKLB «12 Electron launch missions completed for the six months», «launch
backlog … 90+ launches», «Launch services revenue was $44.6 million … a decrease of … 4%», Neutron «integration and
readiness of first-flight hardware … window for an end-of-year launch date is narrowing»; MSFT «RPO increased 25% when
excluding OpenAI», «cash paid for P, P, and E was $35.8 billion», «free cash flow was $19.6 billion»; NET «dollar-based net
retention rates were 120% and 114%», «Current RPO year-over-year growth of 35%», «GAAP loss from operations of $205.7
million». Замечание к RKLB-KPI-08: значение записано как строка «>90» — для машинной проверки зон лучше число 90 с
пометкой `value_type: lower_bound` (в следующих партиях просьба избегать строк в `current_value`).

## Заказ партии 4 (по вашему порядку): PLTR, ETN, ASTS

| # | Тикер | Вес NAV | Просадка 12М | Сектор (benchmark) |
|---|---|---|---|---|
| 1 | PLTR | 1.8% | −14.3% | SOFTWARE (IGV) |
| 2 | ETN | 1.2% | −7.6% | ELECTRIFICATION (GRID) |
| 3 | ASTS | 1.0% | −56.0% | SPACE (UFO) |

Формат и правила — как в партиях 1–3 (объединённый YAML: `states.axes`, `kpis.items`, `triggers.items`, `mpc_inputs`;
факты только из первичных источников с URL и `formula`; все пороги `model_assumption`; trigger ≠ decision).

Контекст портфеля (не предписание):
- ETN — как и у NET, есть реестр владельца из корзины «ИИ-инфраструктура» (17.09): триггеры на Electrical orders/backlog,
  guidance organic, входы по цене, фиксация по капитализации. Просьба тем же приёмом, что для NET: оси + KPI + `binding_guidance`
  для существующих ETN-E-*/X-*, новые переходы без ID.
- ASTS — до-выручечная стадия: интересуют оси, разделяющие развёртывание группировки (спутники на орбите, каденция
  запусков), коммерческие контракты с операторами (AT&T/Verizon/Vodafone и др.), регуляторные разрешения (FCC) и
  финансирование/дилюцию; failure modes с общими причинами SPACE (RKLB, SPCX) — вход для MPC.
- PLTR — разделить государственный и коммерческий сегменты (США / международный), AIP-монетизацию и оценку
  (мультипликатор как контекст, не как ось); экспозиция к GOVERNMENT_DEFENSE явно.

=== КОНЕЦ ===
