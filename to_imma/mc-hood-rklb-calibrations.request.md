# Для передачи IMMA: заказ калибровок HOOD и RKLB (вторая пара: зрелый архетип A и первый живой архетип C)

Черновик 23.09.2026, НЕ отправлен. Одно сообщение от «=== НАЧАЛО ===» до «=== КОНЕЦ ===» с вложениями из папки
Downloads/mc-hood-rklb-to-llm (список в конце).

=== НАЧАЛО ===

## Контекст
Нормативы для этой пары зафиксированы и не меняются: Company_MC_Calibration_Schema v1.0.1,
Company_Conditional_Monte_Carlo_Specification v1.1 + v1.1.2 (локальная устойчивость 0.25σ), Joint_Simulation_Layer_Rules
v1.1 + v1.1.1 (MC-G5-013 — только измеренная σ), Reverse_Valuation_Rules v1.1. Принимаем тем же конвейером, что
NBIS/NVDA: валидатор (схема → MC-G5-001…013 hard gate → сухой прогон → диагностика дисперсии intrinsic/full с
equity_value_0) → локальная устойчивость v1.1.2 → стресс-чувствительность как диагностика → нормативный прогон 500k
детерминированно по seed. Образец принятой пары — вложения NBIS (calibration_v1.0 + mc_calibration_v1.0.2) и NVDA
(mc_calibration_v1.0.2, зрелый архетип).
Вес в портфеле: HOOD — 14.2 % NAV по рынку (выше целевых 12 %), RKLB — 2.3 % NAV (вложено 6.25 %, −29 %; в
приоре Core-10 — кандидат с весом 8 %). Модели компаний — принятые пакеты партий (вложения hood/, rklb/): KPI из
10-Q/релизов Q2 2026 с host-check, но ещё НЕ прошли сверку дозором (прогоны по протоколу v1.2.1 идут параллельно;
если дозор найдёт расхождение в KPI, который вы использовали, — патч калибровки, не новая версия). Котировки 18.09:
HOOD 119.82, RKLB 64.57 — можно взять свежее с датой (Source Policy §8: акции — из 10-Q с URL и датой, цена —
Yahoo chart на дату калибровки).

## A. HOOD — mature_positive_margin
A.1 **Reverse Valuation calibration** (`HOOD_calibration_v1.0.yaml`, формат вложения NBIS_calibration_v1.0.yaml):
    scenario_state = текущий вектор S3 / R3 / P3 / C1 / G2 (Customer_Asset_Scale / Revenue_Diversification /
    Profitability / Credit_Risk / Regulatory_Product); discount_rate base + stress с обоснованием для финтеха с
    кредитным и крипто-риском; base_period из подтверждённых KPI (выручка LTM/квартал, adj. EBITDA margin 56.65 % →
    FCF margin через SBC, capex и изменения оборотного капитала из 10-Q — derived_fact с формулой); terminal FCF margin
    и multiple с обоснованием (зрелый брокер/финтех, не «вечный победитель»); margin_transition — короткий путь от
    текущей маржи (mature). Наш `reverse_valuation 1.2.0` вернёт implied_revenue_cagr_5y и
    terminal_value_share_of_pv; класс устойчивости — по Rules v1.1 §1.
A.2 **MC calibration v2** (`HOOD_mc_calibration_v1.0.yaml` по схеме v1.0.1): сегменты по фактическому раскрытию —
    transaction-based (59 % выручки; внутри — опционы/крипто/акции, если раскрыто), net interest, subscription/other
    (Gold 4.84 млн); initial_growth по сегментам с provenance (выручка +32 % YoY — verified_fact; долгосрочный рост —
    model_assumption с rationale); margin_model mean_reverting_positive_margin (current_margin из KPI-07 с переводом
    в FCF, terminal Y5/Y8 с обоснованием); оценка FCF_multiple на всех горизонтах; latent_factors {growth, margin,
    valuation} с корреляциями и загрузками; market_path_model; reverse_valuation_ref из A.1;
    robustness_tests v1.1.2 (локальные возмущения 0.25σ_eq, посчитанные и материализованные в YAML, как в v1.0.2);
    `joint_simulation` + `driver_parameter_mapping` для material-драйверов из mpc_inputs: ±2 — CAPITAL_MARKETS,
    CONSUMER_CREDIT, CRYPTO_CYCLE, FINTECH_REGULATION; ±1 (CLOUD_SOFTWARE_DEMAND, INTEREST_RATES,
    ACQUISITION_INTEGRATION) — по правилу материальности (mapping или not_mapped с причиной); размерность —
    по измеренной σ (caps growth 0.15 / margin 0.05 / log-multiple 0.15), с учётом σ_eff одиночного драйвера на
    путях ≈ 1.6–2.0; stability.knockout для structural_support и adverse_driver_stress; связь с HOOD-FM-01..07 —
    через common_cause_id в комментарии к mapping. Особое внимание: крипто-цикл и event-contracts (KPI-09, 12 %
    выручки) — это не постоянный рост, а циклический сегмент: либо отдельный сегмент с mean-reverting ростом, либо
    явная оговорка, почему включён в transaction-based.

## B. RKLB — pre_service_or_milestone_driven (первая живая калибровка архетипа C)
B.1 **Reverse Valuation calibration** (`RKLB_calibration_v1.0.yaml`): scenario_state = E2 / N1 / S3 / B3 / C2
    (Electron_Cadence / Neutron_Development / Space_Systems_Scale / Backlog_Visibility / Capital_and_Integration);
    base_period из подтверждённых KPI (выручка +62 % YoY, Space Systems 81 % выручки и +94 % YoY, backlog 2.36 млрд
    +137 % YoY, launch backlog ≥90); margin_transition — two_phase (стройка Neutron → нормализация) по аналогии с
    SPCX/NBIS; terminal multiple с обоснованием для аэрокосмического интегратора; ожидаем класс model_fragile или
    terminal_dependent — не подгонять, а отметить.
B.2 **MC calibration v2** (`RKLB_mc_calibration_v1.0.yaml`, архетип C): существующие сегменты — Launch (Electron/HASTE,
    каденс 12 запусков за 6 мес., выручка −4 % YoY) и Space Systems (компоненты, спутники, интеграция приобретений)
    с initial_growth/long-run и provenance; **milestone_model**: service_onset_milestone = первый полёт Neutron
    (KPI-09 milestone state = 1, ось Neutron_Development N1; переходы RKLB-E-04 N1→N2, E-05 N2→N3), далее
    повторный полёт / регулярный каденс Neutron и, если считаете материальным, собственная спутниковая
    группировка — каждая веха с probability, timing (распределение с provenance: даты компании — company_guidance,
    не actual), value_uplift, requires, terminal_failure / delay_retry по спецификации; **cash_model** (сжигание
    кэша на стройке Neutron, наличность и привлечения с dilution_penalty — из 10-Q, verified_fact/derived_fact);
    service_segments для Neutron после onset; кусочная оценка failure_residual / milestone_conditioned_EV;
    latent_factors и загрузки; market_path_model; robustness_tests v1.1.2; joint_simulation + mapping для ±2:
    LAUNCH_ECONOMICS, SATELLITE_CONNECTIVITY, GOVERNMENT_DEFENSE, ACQUISITION_INTEGRATION, AEROSPACE_CYCLE; ±1
    (INTEREST_RATES, CAPITAL_MARKETS, INDUSTRIAL_RESHORING, SPACE_REGULATION) — по правилу материальности;
    failure modes RKLB-FM-01..07 — через common_cause_id.
B.3 **Размерность mapping на цели вех** (probability / timing): в Rules v1.1.1 пороги MC-G5-013 заданы только для
    growth / margin / multiple; для milestone-целей валидатор сейчас держит временный cap 0.75 σ (в единицах
    цели). Просьба: предложить в ответе нормативные пороги для probability (в п.п. или логит) и timing (в кварталах)
    с обоснованием — мы зафиксируем их эмпирически по итогам этой калибровки (измеренная σ на путях) и внесём в
    Rules v1.1.2 отдельным патчем. До этого mapping на вехи сайзить консервативно и описать Σ|effect| справочно.

## C. Провенанс и запреты (как для NBIS/NVDA)
Каждое число — verified_fact (URL + дата документа) | derived_fact (формула) | model_assumption (rationale) |
owner_judgment (только при решении владельца); подгонка к текущей цене запрещена (Price_Expectation_Gap — выход
диагностики); прогнозы компании — company_guidance; simulation: paths 500000, seed 20260920, antithetic;
calculation_engine_version company_mc 2.3.0.

## Критерии приёмки
- Схема v1.0.1 без ошибок; MC-G5-013 pass по измеренной σ (growth ≤0.15, margin ≤0.05, log-multiple ≤0.15; вехи —
  временный cap до вашего предложения по B.3); intrinsic/full W в ориентирах Rules v1.1 для своего архетипа
  (warning — не блокирует, но объясняется); сухой прогон без mapping_warnings, детерминизм; локальная устойчивость
  v1.1.2 pass (≥75 % / ≥75 %); RV-прогон без ошибок, класс устойчивости отмечен.
- Формат ответа: по два YAML на компанию + один Markdown с обоснованиями по осям, сегментам, вехам и параметрам;
  переиздание (если понадобится) — полный текст + дельта.

=== КОНЕЦ ===

## Вложения (Downloads/mc-hood-rklb-to-llm)
- `hood/`, `rklb/` — states.yaml, kpis.yaml, mpc_inputs.yaml, triggers.yaml, state.json (принятые модели, схема v1.0.5).
- `reference/NBIS_calibration_v1.0.yaml`, `reference/NBIS_mc_calibration_v1.0.2.yaml`,
  `reference/NVDA_mc_calibration_v1.0.2.yaml` — принятые калибровки (формат-образцы архетипов B и A).
- `reference/20260923T144500Z-company_mc-4a7d0d.json` — нормативный прогон NVDA (что возвращает движок: gap-метрики,
  robustness v1.1.2, стресс-диагностика).
- `reference/SPCX_mc_calibration_v1.1.2.yaml` — принятая калибровка архетипа B с state_transition_effects (для
  условных сдвигов по вехам RKLB по аналогии).
