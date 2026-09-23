# Для передачи IMMA: заказ калибровок LLY, META и ASML (третья партия: +16.5 % NAV → покрытие 88 %)

Черновик 24.09.2026, НЕ отправлен. Одно сообщение от «=== НАЧАЛО ===» до «=== КОНЕЦ ===» с вложениями из папки
Downloads/mc-lly-meta-asml-to-llm (список в конце).

=== НАЧАЛО ===

## Контекст
Нормативы для партии: Company_MC_Calibration_Schema v1.0.2 (привязка к company_mc 2.3.1), Conditional MC v1.1.3
(parity-gated blend, robustness v1.1.2), Joint_Simulation_Layer_Rules v1.1.2 (измеренная σ; caps growth 0.15 /
margin 0.05 / log-multiple 0.15), Reverse_Valuation_Rules v1.1. Конвейер приёмки тот же, что для HOOD/RKLB v1.0.1:
валидатор 1.6.0 (схема → MC-G5-001…013 → сухой прогон → дисперсия intrinsic/full с equity_value_0) → локальная
устойчивость → стресс-диагностика → нормативный 500k на 2.3.1. Образцы принятых калибровок во вложениях: HOOD v1.0.1
(архетип A, схема v1.0.2) и NBIS v1.0.2 (архетип B, ocf_capex_decomposition; схема v1.0.1 — форма та же).
Веса: LLY 8.2 % NAV, META 5.5 %, ASML 2.8 %. Модели компаний — принятые пакеты партий (вложения lly/, meta/, asml/),
KPI из документов Q2 2026 с host-check; сверка дозором по v1.2.1 идёт параллельно, расхождение → патч калибровки.
Котировки 18.09: LLY 1152.93, META 665.75, ASML 1679.92 (Nasdaq, USD) — можно взять свежее с датой.
Урок HOOD/RKLB, который просим учесть сразу: собственные распределения (growth / margin / multiple) должны давать
intrinsic W не ниже ориентира архетипа (A: 0.25–0.50) без подгонки центров — сразу закладывайте хвосты, как в
HOOD v1.0.1, а не как в v1.0.

## A. LLY — mature_positive_margin с концентрацией
A.1 **Reverse Valuation calibration** (`LLY_calibration_v1.0.yaml`, формат HOOD_calibration_v1.0.yaml): вектор
    D4 / P3 / M2 / R3 / F3 (Incretin_Demand / Pricing_Access / Manufacturing_Expansion / Pipeline_Diversification /
    Cash_Economics); base_period из KPI (выручка +48 % YoY, тирзепатид 14.87 млрд/кв = 65 % выручки, +73 % YoY;
    реализованная цена −13 %, объём +60 %; gross margin 85.8 %; simple FCF margin 25.2 % при capex 12.3 % выручки —
    оба semiannual); discount base + stress; terminal FCF margin и multiple с обоснованием для фармы с одним
    доминирующим франчайзом и датами экслюзивности; margin_transition — mature, но с учётом капитальной стройки
    (capex 12 % выручки — не «зрелые» 3–4 %).
A.2 **MC calibration v2** (`LLY_mc_calibration_v1.0.yaml`, схема v1.0.2): сегменты — Tirzepatide (Mounjaro +
    Zepbound) и Rest of portfolio (при наличии раскрытия — отдельный сегмент новых инкретинов/orforglipron после
    одобрения как model_assumption с rationale, не как веха: архетип A); initial_growth тирзепатида — с явным
    mean reversion и учётом давления цены (KPI-05 −13 % — verified_fact в rationale); margin_model
    mean_reverting_positive_margin от FCF-маржи 25 % (не от gross margin) с terminal Y5/Y8 и обоснованием
    (нормализация capex); FCF_multiple на всех горизонтах с negative_fcf_fallback; latent_factors + загрузки;
    market_path_model; reverse_valuation_ref из A.1; robustness_tests v1.1.2 (материализованные 0.25σ);
    joint_simulation + driver_parameter_mapping для ±2: HEALTHCARE_DEMAND, DRUG_PIPELINE, REIMBURSEMENT_PRICING,
    BIOPHARMA_MANUFACTURING_CAPACITY, PHARMA_REGULATION, PATENT_EXCLUSIVITY; ±1 (INTEREST_RATES, CHINA_REVENUE,
    ACQUISITION_INTEGRATION) — по правилу материальности; failure modes LLY-FM-01..07 через common_cause_id;
    PATENT_EXCLUSIVITY и REIMBURSEMENT_PRICING логичнее вести на маржу/мультипликатор и рост тирзепатида, чем на
    общий рост — сайзить по измеренной σ.

## B. META — capital_intensive_transition (по факту, не по возрасту компании)
B.1 **Reverse Valuation calibration** (`META_calibration_v1.0.yaml`): вектор A3 / U2 / P2 / C3 / R3
    (Ad_Monetization / User_Engagement / FoA_Profitability / AI_Capital_Intensity / Reality_Labs_Drag); base_period:
    выручка +28 % YoY (реклама +27 %: показы +14 %, цена +12 %), FoA operating margin 38.75 %, **capex/выручка 51.1 %,
    FCF-маржа 1.3 %**, обязательства 1.44× годовой выручки, убыток Reality Labs 4.6 млрд/кв; margin_transition —
    two_phase_capex_normalization (по аналогии с NBIS/SPCX: стройка ИИ-мощностей → нормализация), terminal FCF margin
    и multiple с обоснованием; класс устойчивости отметить как есть.
B.2 **MC calibration v2** (`META_mc_calibration_v1.0.yaml`, схема v1.0.2, архетип B): текущий FCF не якорь (spec §2
    B), поэтому margin_model **ocf_capex_decomposition**: ocf_margin_nodes от FoA-маржи и RL-убытка, capex_revenue_nodes
    от 51 % к нормализованному уровню (Y1..Y5/Y8 с provenance; прогнозы capex компании — company_guidance); сегменты —
    Advertising (показы × цена как rationale, не два сегмента) и Other/RL (убыточный, с собственным путём); кусочная
    оценка: Y3 revenue_bridge или FCF_multiple с negative_fcf_fallback — по вашему выбору с обоснованием (в 2.3.1
    переход непрерывный); latent_factors + загрузки; robustness v1.1.2; mapping для ±2: AI_COMPUTE_DEMAND,
    HYPERSCALER_CAPEX (на capex-узлы, не на рост), DATA_CENTER_POWER, DIGITAL_AD_DEMAND; ±1 — по материальности
    (у META семь драйверов ±1: ADVANCED_PACKAGING, HBM_MEMORY, CLOUD_SOFTWARE_DEMAND, INTEREST_RATES, TAIWAN_SUPPLY,
    ELECTRIFICATION_GRID, UTILITY_CAPEX — по каждому явное решение); failure modes META-FM-01..07.

## C. ASML — mature_positive_margin, отчётность в EUR
C.1 **Reverse Valuation calibration** (`ASML_calibration_v1.0.yaml`): вектор D3 / E3 / M3 / X1 / I3
    (Demand_Visibility / EUV_Adoption / Margin_Execution / China_Export_Exposure / Installed_Base_Resilience);
    **все величины в EUR**: выручка 9.33 млрд/кв, gross margin 54 %, operating margin 37.1 %, EUV 61.5 % системных
    продаж H1, Installed Base 29 % продаж (+28 %), Китай 15.9 %, память 49.8 % системных продаж, кэш 7.58 млрд;
    рыночная капитализация — по Euronext Amsterdam (EUR) и числу акций из 6-K/отчёта с URL и датой, НЕ по Nasdaq в
    долларах; equity_value в EUR; FX-риск для портфеля (USD) — отдельный слой, в калибровку не вносить.
    Внимание: KPI ASML-KPI-02 (ориентир FY2026 44 млрд) в нашем реестре записан как actual — это company_guidance;
    использовать только как guidance, в rationale, не как факт; расхождение в реестре поправит дозор.
C.2 **MC calibration v2** (`ASML_mc_calibration_v1.0.yaml`, схема v1.0.2, архетип A): сегменты — EUV systems, DUV
    systems (в т.ч. китайская экспозиция как сегмент или как явная оговорка в mapping CHINA_REVENUE), Installed Base
    Management (сервис/апгрейды, более устойчивый); циклический рост систем с mean reversion; margin_model
    mean_reverting_positive_margin от FCF-маржи (перевод из operating margin 37 % через capex/оборотный капитал по
    отчётности — derived_fact с формулой); FCF_multiple на всех горизонтах + fallback; latent_factors + загрузки;
    robustness v1.1.2; mapping для ±2: AI_COMPUTE_DEMAND, HYPERSCALER_CAPEX, SEMICONDUCTOR_WFE, HBM_MEMORY,
    TAIWAN_SUPPLY; ±1 (ADVANCED_PACKAGING, EDA_DESIGN_COMPLEXITY, DATA_CENTER_POWER, INTEREST_RATES, CHINA_REVENUE,
    INDUSTRIAL_RESHORING) — по материальности; failure modes ASML-FM-01..08.

## D. Провенанс и запреты (как прежде)
Каждое число — verified_fact (URL + дата) | derived_fact (формула) | model_assumption (rationale) | owner_judgment;
подгонка к цене запрещена; прогнозы компаний — company_guidance; simulation: paths 500000, seed 20260920,
antithetic; calculation_engine_version company_mc 2.3.1; reverse_valuation_ref.run_ref — PENDING_HOST_RUN до наших
прогонов (как в HOOD/RKLB).

## Критерии приёмки
Схема v1.0.2 без ошибок; MC-G5-013 pass по измеренной σ; сухой прогон без mapping_warnings, детерминизм; intrinsic W
в ориентире архетипа (A 0.25–0.50; B 0.40–0.85) — warning не блокирует, но объясняется; локальная устойчивость v1.1.2
pass; RV без ошибок валидации, класс устойчивости отмечен. Ответ: по два YAML на компанию + один Markdown с
обоснованиями; переиздание — полный текст + дельта.

=== КОНЕЦ ===

## Вложения (Downloads/mc-lly-meta-asml-to-llm)
- `lly/`, `meta/`, `asml/` — states.yaml, kpis.yaml, mpc_inputs.yaml, triggers.yaml, state.json (схема v1.0.5).
- `reference/HOOD_calibration_v1.0.yaml`, `reference/HOOD_mc_calibration_v1.0.1.yaml` — принятая пара архетипа A
  (схема v1.0.2, хвосты по ориентиру).
- `reference/NBIS_mc_calibration_v1.0.2.yaml` — принятый архетип B с ocf_capex_decomposition (для META).
- `reference/20260923T211400Z-company_mc-6fb7ec.json` — нормативный прогон HOOD на 2.3.1 (что возвращает движок:
  базы оценки, паритетная маржа, robustness v1.1.2).
