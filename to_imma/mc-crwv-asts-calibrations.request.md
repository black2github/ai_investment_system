# Для передачи IMMA: заказ калибровок CRWV (архетип B) и ASTS (архетип C) + модель компании SPOT (партия 5 калибровок / партия 6 моделей)

Черновик 25.09.2026, НЕ отправлен. Одно сообщение от «=== НАЧАЛО ===» до «=== КОНЕЦ ===» с вложениями из папки
Downloads/mc-crwv-asts-to-llm (список в конце). Отправлять после заказа сценарного слоя (IMMA обработает
последовательно; работы независимы).

=== НАЧАЛО ===

## Контекст
Нормативы те же, что у партии 4: Company_MC_Calibration_Schema v1.0.2 (`calculation_engine_version: company_mc 2.3.1`
по const схемы; хост считает на 2.3.2, отличие только в сидировании), Conditional MC v1.1.3, Joint_Simulation_Layer_Rules
v1.1.2, Reverse_Valuation_Rules v1.1. Конвейер приёмки прежний: RV → валидатор 1.6.0 → устойчивость v1.1.2 → стресс →
нормативный 500k, seed 20260920. После этой партии без калибровок останутся только ETF (GLD, UFO) и SPOT (модель
заказывается здесь же, калибровка — следующей партией): покрытие 12 → 14 компаний, 94.5 → ≈96 % NAV.
Веса: CRWV 0.5 % NAV, ASTS 1.0 %, SPOT 1.1 %. Котировки 18.09 (USD): CRWV 81.36 (NASDAQ), ASTS 58.52 (NASDAQ). Дозор:
ASTS сверен полностью (verify-ASTS-20260923T060714Z, PASS_WITH_DECLARED_PENDING), CRWV — host-check фактов 21.09,
дозор v1.2.1 ещё не проходил; расхождения при сверке → патч калибровки.
Уроки прошлых партий, учесть сразу: хвосты не ниже ориентира архетипа без подгонки центров (B intrinsic W 0.40–0.85,
C 0.60–1.30); `negative_fcf_fallback` при схеме ≥1.0.2 — референсный bridge-мультипликатор смеси, основной параметр
с обоснованием; MC-G5-013 по измеренной σ (у ETN шесть коррелированных драйверов на один сегмент дали 0.189 при
Σ|effect| 0.112 — не наваливать много коррелированных драйверов на одну цель).

## A. CRWV — capital_intensive_transition (архетип B), парный к NBIS
A.1 **Reverse Valuation calibration** (`CRWV_calibration_v1.0.yaml`, формат NBIS/META): вектор D3 / E3 / C2 / K2 / F2
    (Demand_Contracting / Unit_Economics / Capacity_Secured / Capital_Intensity / Funding_Liquidity); base_period Q2
    2026: выручка 2.575 млрд (+112.5 % YoY), backlog 104.2 млрд (10.1× годовой выручки; +>25 млрд новых обязательств
    в начале Q3 — как company_guidance/событие, не в backlog), adjusted EBITDA 59 %, adjusted operating income 5 %,
    **GAAP операционная маржа −2 %**, capex 9.4 млрд = 3.65× квартальной выручки, активная мощность 1.5 ГВт,
    законтрактованная 4.2 ГВт, долг 35.6 млрд (0.34× backlog), ликвидность 15.55 млрд (1.65× квартального capex),
    топ-3 клиента 72 % выручки; discount base + stress с обоснованием для заёмной модели; margin_transition —
    two_phase_capex_normalization (стройка → нормализация), терминальные маржа и мультипликатор с обоснованием;
    класс устойчивости отметить как есть (ожидаем model_fragile или terminal_dependent — не подгонять).
A.2 **MC calibration v2** (`CRWV_mc_calibration_v1.0.yaml`, схема v1.0.2, архетип B): текущий FCF отрицательный
    (capex ≫ OCF) → margin_model **ocf_capex_decomposition** как у NBIS/META: ocf_margin_nodes от adjusted EBITDA
    59 % с поправкой на проценты по долгу 35.6 млрд (derived_fact с формулой), capex_revenue_nodes от 3.65× к
    нормализованному уровню Y1…Y5/Y8 с provenance (законтрактованная мощность 4.2 ГВт и backlog — verified_fact для
    траектории выручки, не гарантия); сегменты — не более двух (законтрактованные мощности / новые); **долг и
    финансирование**: как учитываете переход enterprise → equity, стоимость долга и риск рефинансирования
    (CAPITAL_MARKETS_TIGHTENING и LEVERAGE_DEBT_SERVICE — оба high/critical в отказах) — явно; **концентрация
    клиентов 72 %** (FM-02 critical) — knockout_shift или обоснованный отказ; кусочная оценка: revenue_bridge /
    FCF_multiple с fallback по правилу выше; latent_factors + загрузки; robustness v1.1.2; mapping для ±2 (восемь:
    AI_COMPUTE_DEMAND, HYPERSCALER_CAPEX, CLOUD_SOFTWARE_DEMAND, DATA_CENTER_POWER, INTEREST_RATES, CAPITAL_MARKETS,
    TAIWAN_SUPPLY, AI_CLOUD_PRICING) — сайзить по измеренной σ, не более 3–4 драйверов на одну цель; ±1
    (ADVANCED_PACKAGING, HBM_MEMORY, ACQUISITION_INTEGRATION, ELECTRIFICATION_GRID, UTILITY_CAPEX) — по материальности;
    failure modes CRWV-FM-01..08 через common_cause_id. Сопоставимость с NBIS v1.0.2 — та же структура узлов, чтобы
    парное сравнение и правило сектора AI_COMPUTE работали.

## B. ASTS — pre_service_or_milestone_driven (архетип C), парный к RKLB
B.1 **Reverse Valuation calibration** (`ASTS_calibration_v1.0.yaml`, формат RKLB): вектор D2 / C3 / M1 / R2 / F2
    (Constellation_Deployment / Commercial_Contracting / Service_Monetization / Regulatory_Spectrum /
    Funding_Dilution); base_period: выручка Q2 31.5 млн (шлюзы и госвехи; **выручки от SpaceMobile Service нет** —
    10-Q), backlog 1.30 млрд, 13 спутников на орбите, 30 в производстве, 60+ операторов, ликвидность pro forma
    >3.7 млрд, годовое сжигание (OCF + capex) ≈2.0 млрд, конвертируемый заём 1.15 млрд с размытием <2 %, FCC-разрешение
    на 248 спутников; RV для C — по правилам v1.1 (pre-service: оценка через сервисную выручку после запуска, класс
    устойчивости, флаг риска модели ожидаемо).
B.2 **MC calibration v2** (`ASTS_mc_calibration_v1.0.yaml`, схема v1.0.2, архетип C, структура RKLB v1.0.1):
    **milestone_model** — вехи с вероятностью и сроками (распределения по кварталам, не точки): коммерческий запуск
    SpaceMobile Service (веха-онсет сервисной выручки), достижение непрерывного покрытия (число спутников на орбите,
    план 45–60 для непрерывности по США — из первоисточников, не из памяти), каденция запусков (6 за 50 дней —
    verified_fact), регуляторные разрешения по юрисдикциям; σ вех в пределах порогов Rules v1.1.2 (0.35 логит /
    1.0 кв.); **cash_model**: net_cash_0 из pro forma ликвидности, pre_service_burn_quarterly ≈ 0.5 млрд/кв
    (derived_fact из H1), dilution_penalty с обоснованием (июльское размытие <2 % — факт, дальнейшее — допущение),
    core_margin для шлюзов/госконтрактов, service_margin после онсета (terminal_margin_Y5 с обоснованием для
    оператор-партнёрской модели разделения выручки); service_segments (выручка сервиса через MNO-партнёров;
    backlog 1.3 млрд как verified_fact для стартового уровня); fcf_maturity_margin для parity-gated смены базы;
    valuation: revenue_bridge до зрелости и FCF_multiple после, fallback по правилу выше; latent_factors; robustness
    v1.1.2; mapping для ±2 (LAUNCH_ECONOMICS, SATELLITE_CONNECTIVITY, CAPITAL_MARKETS, SPACE_REGULATION — на
    вероятность/сроки вех и рост сервиса, как у RKLB), ±1 (GOVERNMENT_DEFENSE, INTEREST_RATES, AEROSPACE_CYCLE) — по
    материальности; failure modes ASTS-FM-01..08 (три critical: LAUNCH_OPERATIONS_FAILURE, SPACE_SYSTEMS_EXECUTION,
    SPACE_REGULATORY_SPECTRUM_DELAY — knockout_shift по вехам или обоснованный отказ). Замечание дозора 21.09 к оси
    Regulatory_Spectrum (только качественные свидетельства) — учесть: в калибровке веха «разрешения» опирается на
    KPI-11 (binary) и даты.

## C. SPOT (Spotify) — модель компании (партия 6 моделей, формат партий 1–5)
Позиция 1.1 % NAV (NYSE, USD), обнаружена 22.09 по списку средних цен; модели нет. Просим стандартный комплект
Company_Artifact_Schema v1.0.5: states.yaml (5 осей с критериями и текущим вектором по Q2 2026), kpis.yaml (≤10
критических KPI с порогами и source_url), triggers.yaml (переходы с ID), mpc_inputs.yaml (экспозиции по таксономии
v1.1; сектор INTERNET_PLATFORMS provisional — подтвердить или предложить), thesis — краткий. Источники: 10-Q/20-F и
релиз Q2 2026 по SEC, IR Spotify. Калибровку (архетип A ожидаемо) закажем следующей партией после приёмки модели.

## D. Провенанс и запреты (как прежде)
Каждое число — verified_fact (URL + дата) | derived_fact (формула) | model_assumption (rationale) | owner_judgment;
подгонка к цене запрещена; прогнозы компаний — company_guidance; simulation: paths 500000, seed 20260920, antithetic;
reverse_valuation_ref.run_ref — PENDING_HOST_RUN. Нераскрытое не оценивать (например, план числа спутников для
непрерывного покрытия — только из первоисточников с датой).

## Критерии приёмки
Схема v1.0.2 без ошибок; MC-G5-013 pass по измеренной σ (включая цели вех у ASTS); сухой прогон без mapping_warnings,
детерминизм; intrinsic W в ориентире архетипа (B 0.40–0.85; C 0.60–1.30) — warning не блокирует, но объясняется;
устойчивость v1.1.2 pass; RV без ошибок валидации, класс устойчивости отмечен. Ответ: по два YAML на компанию + один
Markdown с обоснованиями и явными решениями по развилкам (долг/рефинансирование и концентрация клиентов у CRWV;
вехи, размытие и модель разделения выручки у ASTS) + комплект модели SPOT; переиздание — полный текст + дельта.

=== КОНЕЦ ===

## Вложения (Downloads/mc-crwv-asts-to-llm)
- `crwv/`, `asts/` — states.yaml, kpis.yaml, mpc_inputs.yaml, triggers.yaml, state.json (схема v1.0.5).
- `reference/NBIS_mc_calibration_v1.0.2.yaml` — принятый архетип B (ocf_capex_decomposition; схема v1.0.1, форма та же).
- `reference/META_calibration_v1.0.yaml`, `reference/META_mc_calibration_v1.0.1.yaml` — принятая пара архетипа B на схеме
  v1.0.2 (хвосты по ориентиру).
- `reference/RKLB_calibration_v1.0.yaml`, `reference/RKLB_mc_calibration_v1.0.1.yaml` — принятая пара архетипа C
  (вехи, cash_model, service_segments, fcf_maturity_margin).
- `reference/20260924T074358Z-company_mc-224958.json` — нормативный прогон RKLB на 2.3.2 (что возвращает движок для C:
  вехи, онсет, базы оценки, паритет, robustness v1.1.2).
