# Для передачи IMMA: заказ калибровок MSFT, PLTR, NET и ETN (четвёртая партия: +6.6 % NAV → покрытие ≈94.5 %)

Черновик 24.09.2026, НЕ отправлен. Одно сообщение от «=== НАЧАЛО ===» до «=== КОНЕЦ ===» с вложениями из папки
Downloads/mc-msft-pltr-net-etn-to-llm (список в конце).

=== НАЧАЛО ===

## Контекст
Нормативы партии те же, что у LLY/META/ASML: Company_MC_Calibration_Schema v1.0.2, Conditional MC v1.1.3
(parity-gated blend, robustness v1.1.2), Joint_Simulation_Layer_Rules v1.1.2 (измеренная σ; caps growth 0.15 /
margin 0.05 / log-multiple 0.15), Reverse_Valuation_Rules v1.1. Конвейер приёмки: валидатор 1.6.0 (схема →
MC-G5-001…013 → сухой прогон → дисперсия intrinsic/full W с equity_value_0) → локальная устойчивость v1.1.2 →
стресс-диагностика → нормативный 500k.
Движок на хосте — company_mc **2.3.2**: отличие от 2.3.1 только в сидировании собственных розыгрышей компании
(SeedSequence(seed, crc32(ticker)) — раньше при общем seed розыгрыши разных компаний совпадали путь-в-путь);
семантика оценки не менялась. Схема v1.0.2 по-прежнему требует `calculation_engine_version: company_mc 2.3.1` —
**пишите 2.3.1, как в схеме**; в следующем переиздании схемы просим поменять const на 2.3.2 (или снять const, оставив
префикс `company_mc`).
Все четыре — **архетип A (mature_positive_margin)**, положительный FCF как якорь; веса: MSFT 1.9 % NAV, NET 1.8 %,
PLTR 1.8 %, ETN 1.2 %. Модели компаний — принятые пакеты (вложения msft/, pltr/, net/, etn/), KPI по документам
Q2 2026 (MSFT — FY2026 Q4, квартал по 30.06.2026: финансовый год Microsoft заканчивается в июне); дозор по v1.2.1
ещё не проходил ни по одной из четырёх — расхождение фактов при сверке → патч калибровки.
Котировки (Nasdaq/NYSE, USD): MSFT 493.78 (18.09), PLTR 177.64 (18.09), NET 324.65 (16.09), ETN 413.29 (17.09) —
можно взять свежее с датой.
Два урока предыдущих партий, которые просим учесть сразу:
1. Хвосты: собственные распределения (growth / margin / multiple) должны давать intrinsic W не ниже ориентира A
   (0.25–0.50) без подгонки центров — закладывайте хвосты как в HOOD v1.0.1 / ASML v1.0.1, а не как в первых версиях.
2. `negative_fcf_fallback` при схеме ≥1.0.2 — де-факто референсный bridge-мультипликатор смеси (у META 67 % путей
   Y5 оценивались по нему при паритете 0.249 ≈ FCF-маржа Y5). Поэтому его multiple — **основной параметр** с
   собственным rationale: согласовать с FCF_multiple × терминальная маржа (паритет), а не ставить «на всякий случай».

## A. MSFT — mature_positive_margin с высокой капиталоёмкостью ИИ
A.1 **Reverse Valuation calibration** (`MSFT_calibration_v1.0.yaml`, формат HOOD_calibration_v1.0.yaml): вектор
    A4 / S1 / C3 / M3 / R3 (Cloud_AI_Demand / Software_Monetization / AI_Capital_Intensity / Cloud_Margin /
    Contracted_Demand); base_period FY2026 Q4: выручка 90.0 млрд/кв, Azure +43 % YoY, Microsoft Cloud 59.3 млрд
    (+27 %), gross margin облака 65 %, M365 Commercial cloud +14 %, Commercial RPO 678 млрд (+84 %; ex-OpenAI +25 %),
    **cash capex 35.8 млрд = 39.8 % выручки, FCF 19.6 млрд = 21.8 %**, операционная маржа 45.1 %; discount base +
    stress; terminal FCF margin и multiple с обоснованием; margin_transition — нормализация capex с 40 % выручки к
    устойчивому уровню (company_guidance по capex — только как guidance).
A.2 **MC calibration v2** (`MSFT_mc_calibration_v1.0.yaml`, схема v1.0.2): развилка архетипа — FCF-маржа 21.8 %
    содержательна (якорь есть → A, margin_model mean_reverting_positive_margin от FCF-маржи с явным путём
    нормализации capex в rationale), но capex 40 % выручки роднит с B (ocf_capex_decomposition, как META). Наша
    рекомендация — **A**; если выберете B — обосновать по spec §2 (критерий якоря), схема допускает оба. Сегменты —
    по отчётным (Intelligent Cloud / Productivity & Business Processes / More Personal Computing) или Microsoft Cloud +
    Rest — по вашему выбору с rationale, не более трёх; initial_growth Azure с mean reversion; RPO ex-OpenAI +25 % как
    verified_fact для законтрактованного спроса, концентрация OpenAI — в rationale и в FM-05; FCF_multiple на всех
    горизонтах + fallback по уроку 2; latent_factors + загрузки; market_path_model; reverse_valuation_ref из A.1;
    robustness_tests v1.1.2; joint_simulation + driver_parameter_mapping для ±2: AI_COMPUTE_DEMAND, HYPERSCALER_CAPEX
    (на маржу/capex, не только на рост), CLOUD_SOFTWARE_DEMAND, DATA_CENTER_POWER, AI_CLOUD_PRICING; ±1 (девять:
    ADVANCED_PACKAGING, HBM_MEMORY, GOVERNMENT_DEFENSE, INTEREST_RATES, TAIWAN_SUPPLY, ACQUISITION_INTEGRATION,
    ELECTRIFICATION_GRID, UTILITY_CAPEX, DIGITAL_AD_DEMAND) — по правилу материальности, по каждому явное решение;
    failure modes MSFT-FM-01..07 через common_cause_id (три из них — AI_OVERBUILD, TAIWAN_SUPPLY_DISRUPTION,
    AI_CLOUD_CUSTOMER_FINANCING_STRESS — уже связывающие/нарушенные общие причины портфеля; сайзить строго по σ).

## B. PLTR — mature_positive_margin с гиперростом и SBC
B.1 **Reverse Valuation calibration** (`PLTR_calibration_v1.0.yaml`): вектор C3 / G3 / I1 / P3 / R3
    (US_Commercial_AIP_Monetization / US_Government_Demand / Geographic_Concentration / Profitability_Cash /
    Contracted_Demand); base_period Q2 2026: выручка +93 % YoY, U.S. commercial 764 млн (+149 %), U.S. government
    809 млн (+90 %), U.S. commercial RDV 6.238 млрд (+124 %), TCV 3.373 млрд, GAAP операционная маржа 47 %,
    **adjusted FCF 1.220 млрд = 63 %**, SBC 13.7 % выручки, США 80 % выручки H1, кэш и казначейские 9.2 млрд;
    discount base + stress; terminal FCF margin — от FCF по GAAP-определению (OCF − capex, derived_fact с формулой),
    не от adjusted; multiple с обоснованием для ПО с ростом >50 %; margin_transition — mature.
B.2 **MC calibration v2** (`PLTR_mc_calibration_v1.0.yaml`, схема v1.0.2, архетип A): сегменты — U.S. commercial,
    U.S. government, International (рост ниже; концентрация 80 % США — I1 и FM-06); initial_growth 90–150 % —
    **обязательный сильный mean reversion** к long_run_growth_y8 с rationale (закон больших чисел, RDV/TCV
    включают опционы и расторгаемые контракты — FM-04 CONTRACT_CONVERSION_FAILURE); margin_model
    mean_reverting_positive_margin от GAAP-FCF-маржи; **SBC/размытие** — как учитываете (через маржу, через
    equity_value или как model_assumption в rationale) — явно, чтобы не потерять 13.7 % выручки; FCF_multiple +
    fallback по уроку 2 (мультипликатор к выручке у PLTR — главный источник неопределённости, хвосты широкие);
    latent_factors + загрузки; robustness v1.1.2; mapping для ±2: CLOUD_SOFTWARE_DEMAND, GOVERNMENT_DEFENSE; ±1
    (AI_COMPUTE_DEMAND, INTEREST_RATES, CAPITAL_MARKETS, INDUSTRIAL_RESHORING) — по материальности; failure modes
    PLTR-FM-01..07 (FM-05 GOVERNMENT_CONTRACT_COMPLIANCE — critical: рассмотреть knockout_shift).

## C. NET — mature_positive_margin с тонкой FCF-маржой
C.1 **Reverse Valuation calibration** (`NET_calibration_v1.0.yaml`): вектор G3 / N3 / R3 / P1 / A1
    (Revenue_Growth / Expansion_Retention / Contracted_Demand / Profitability_Cash / AI_Edge_Monetization);
    base_period Q2 2026: выручка 696.1 млн (+36 % YoY), DBNRR 120 % (+6 п.п. YoY), cRPO +35 %, GAAP gross margin
    71.8 %, non-GAAP операционная маржа 13.8 %, **GAAP операционная маржа −29.6 %** — разрыв GAAP/non-GAAP
    объяснить по 10-Q (SBC и разовые статьи — verified_fact с URL); **FCF-маржа — derived_fact из 10-Q (OCF − capex)**,
    в нашем реестре её нет, ось P1 определена именно по FCF (0–10 %); discount base + stress; terminal FCF margin
    и multiple с обоснованием; margin_transition — ранняя фаза положительной маржи (P1), не зрелая.
C.2 **MC calibration v2** (`NET_mc_calibration_v1.0.yaml`, схема v1.0.2, архетип A — если FCF-маржа по 10-Q
    окажется ≤0, сообщите: тогда C.2 переезжает в архетип B по spec §2, не подгоняйте): сегменты — не более двух
    (например, Enterprise/large customers и Pay-as-you-go) или один; **ИИ/Workers не выделять сегментом**: компания
    не раскрывает выручку/ARR Workers AI (NET-KPI-07..09 = not_separately_disclosed, ось A1) — только
    model_assumption в rationale роста; margin_model mean_reverting_positive_margin от тонкой FCF-маржи с
    траекторией к terminal (обосновать операционным рычагом, не желаемым); FCF_multiple + fallback по уроку 2
    (при тонкой марже паритет достигается легко — bridge-мультипликатор будет работать на большой доле путей,
    сайзить осознанно); latent_factors + загрузки; robustness v1.1.2; mapping для ±2: AI_COMPUTE_DEMAND,
    CLOUD_SOFTWARE_DEMAND; ±1 (HYPERSCALER_CAPEX, DATA_CENTER_POWER, INTEREST_RATES, CAPITAL_MARKETS,
    AI_CLOUD_PRICING) — по материальности; failure modes NET-FM-01..07 (FM-04 INTERNET_INFRASTRUCTURE_OUTAGE —
    critical: knockout_shift или обоснованный отказ от него).

## D. ETN — mature_positive_margin, промышленный цикл и смена периметра
D.1 **Reverse Valuation calibration** (`ETN_calibration_v1.0.yaml`): вектор A3 / G3 / O3 / M3 / I2
    (Electrical_Americas_Demand / Electrical_Global_Demand / Organic_Growth / Margin_Execution /
    Portfolio_Integration); base_period Q2 2026: органический рост 14 % (guidance FY2026 11–13 %, midpoint 12 % —
    company_guidance), Electrical Americas +18 % органически, TTM заказы +41 %, backlog 15.175 млрд (+33 %),
    book-to-bill 1.3, операционная маржа Electrical Americas 27.5 %, сегментная маржа 23.1 %, Electrical Global
    TTM заказы +33 %, общий backlog Electrical 18.777 млрд, долг 20.611 млрд; FCF-маржа и выручка — derived_fact
    из 10-Q; discount base + stress; **периметр**: Boyd Thermal (9.55 млрд) и Ultra PCS куплены, Mobility выделяется
    через Reverse Morris Trust (цель Q1 2027) — базовую выручку и маржу зафиксировать pro-forma с явным решением
    (что внутри периметра, что нет) как model_assumption с rationale; terminal FCF margin и multiple с обоснованием
    для промышленного лидера в цикле электрификации; margin_transition — mature.
D.2 **MC calibration v2** (`ETN_mc_calibration_v1.0.yaml`, схема v1.0.2, архетип A): сегменты — Electrical
    Americas, Electrical Global, Rest (Aerospace + прочее; Mobility — по решению о периметре из D.1); циклический
    рост с mean reversion (backlog и TTM-заказы как verified_fact для initial_growth, не как гарантия); margin_model
    mean_reverting_positive_margin от FCF-маржи; **долг после поглощений** (20.6 млрд) — как учитываете переход от
    enterprise к equity в equity_value_0 и в rationale terminal multiple — явно; FCF_multiple + fallback по уроку 2;
    latent_factors + загрузки; robustness v1.1.2; mapping для ±2: HYPERSCALER_CAPEX, DATA_CENTER_POWER,
    ACQUISITION_INTEGRATION, ELECTRIFICATION_GRID, UTILITY_CAPEX, INDUSTRIAL_RESHORING (все шесть есть в
    таксономии v1.1 — пометка taxonomy_gap в mpc_inputs устарела, дозор снимет); ±1 (AI_COMPUTE_DEMAND,
    SEMICONDUCTOR_WFE, GOVERNMENT_DEFENSE, INTEREST_RATES, AEROSPACE_CYCLE) — по материальности; failure modes
    ETN-FM-01..07.

## E. Провенанс и запреты (как прежде)
Каждое число — verified_fact (URL + дата) | derived_fact (формула) | model_assumption (rationale) | owner_judgment;
подгонка к цене запрещена; прогнозы компаний — company_guidance; simulation: paths 500000, seed 20260920,
antithetic; calculation_engine_version — `company_mc 2.3.1` (по схеме, см. «Контекст»); reverse_valuation_ref.run_ref
— PENDING_HOST_RUN до наших прогонов. Данные, которых нет в реестрах (FCF NET/ETN, SBC-политика, периметр ETN),
берите из 10-Q/10-K по URL из states.yaml → sources; не выдумывать нераскрытое.

## Критерии приёмки
Схема v1.0.2 без ошибок; MC-G5-013 pass по измеренной σ; сухой прогон без mapping_warnings, детерминизм; intrinsic W
в ориентире A 0.25–0.50 — warning не блокирует, но объясняется; локальная устойчивость v1.1.2 pass; RV без ошибок
валидации, класс устойчивости отмечен. Ответ: по два YAML на компанию + один Markdown с обоснованиями (в нём —
явные решения по развилкам: архетип MSFT, SBC у PLTR, FCF-маржа NET, периметр ETN); переиздание — полный текст +
дельта (проверяем механически).

=== КОНЕЦ ===

## Вложения (Downloads/mc-msft-pltr-net-etn-to-llm)
- `msft/`, `pltr/`, `net/`, `etn/` — states.yaml, kpis.yaml, mpc_inputs.yaml, triggers.yaml, state.json (схема v1.0.5).
- `reference/HOOD_calibration_v1.0.yaml`, `reference/HOOD_mc_calibration_v1.0.1.yaml` — принятая пара архетипа A
  (схема v1.0.2, хвосты по ориентиру).
- `reference/LLY_mc_calibration_v1.0.yaml` — принятый A со зрелой маржой и концентрацией (образец для MSFT/ETN).
- `reference/ASML_mc_calibration_v1.0.1.yaml` — принятый циклический A с тремя сегментами (образец для ETN).
- `reference/20260924T074150Z-company_mc-038894.json` — нормативный прогон HOOD на 2.3.2 (что возвращает движок:
  базы оценки, паритетная маржа, robustness v1.1.2).
