# Для передачи другой LLM: Conditional MC v1.1 (спецификация под движок company_mc 2.3.0) + калибровки SPCX v1.1, NBIS, NVDA

Черновик 23.09.2026, НЕ отправлен. Одно сообщение от «=== НАЧАЛО ===» до «=== КОНЕЦ ===» с вложениями из папки
Downloads/mc-v11-to-llm (список в конце). Раздел B (SPCX) учитывает результат проверки Flight 14 от 23.09 (перенос на 28.09, вектор без изменений).

=== НАЧАЛО ===

## Контекст: движок уже обобщён, спецификация отстаёт
После Flight 14 (см. §B) выполняем план 20.09: MC v1.1 → калибровки по 2 компании. Но с 20.09 движок ушёл вперёд:
в сайдкаре работает `company_mc 2.3.0` (вложения `engine/company_mc_v2_design.md` §4 и
`engine/engine_calibration_schema_docstrings.md`) — обобщённый условный Монте-Карло для трёх архетипов
(mature_positive_margin / capital_intensive_transition / pre_service_or_milestone_driven), сегменты и форма маржи из
калибровочного YAML, кусочная оценка с `valuation_basis` на путь и `bridge_dependent`, gap-метрики RV↔MC,
robustness v1.1, Joint Simulation Layer через `driver_parameter_mapping`, knockout / adverse_driver_stress, слой вех
для архетипа C. Паритет с SPCX v1.0: CAGR 5Y −14.92% против −14.86% (conditional_mc 1.0.1), P(loss>30%) 0.964/0.966.
Интерпретации I1–I5, которые вы просили формализовать в MC v1.1, в движке v2 разрешены так:
- I1–I3 (один ранг для «старт → долгосрочный рост», для мультипликаторов Y3/Y5/Y8, для узлов маржи) — ЗАМЕНЕНЫ
  структурой «латентный фактор + идиосинкратический шок» с загрузками (Archetypes §2.1): факторы growth / margin /
  valuation, корреляции между ними и `default_loading` (доля дисперсии параметра от фактора = loading²);
  общий ранг «вечного победителя» больше не используется;
- I4 (путь цены для max drawdown: лог-линейная интерполяция якорей 0/Y3/Y5/Y8 + OU-шум, окно 5Y) — сохранена;
- I5 (годовая выручка = сумма кварталов; g(t) = g_long + (g_init − g_long)·2^(−t/half-life); квартальный множитель
  (1+g)^(1/4)) — сохранена;
- RV_Growth_Gap и Price_Expectation_Gap — диагностика без авто-перехода оси Valuation (ваше решение 21.09);
- 3Y помечается `bridge_dependent`; robustness v1.1 — знак медианного CAGR 5Y + допуски на P(2x) и P(loss>30%).
Просьба: спецификация должна описывать то, что движок реально считает, а не наоборот; там, где вы считаете
решение движка неверным, — указать явно, и мы поменяем движок (с новой версией), а не документ.

## A. Заказ: спецификация Conditional MC v1.1 + JSON Schema калибровки
A.1 **Company_Conditional_Monte_Carlo_Specification_v1.1** (обобщение SPCX-спецификации v1.0 на три архетипа):
    интерпретации I1–I5 в редакции выше как нормативные правила; латентные факторы и загрузки; кусочная оценка по
    горизонтам (FCF_multiple / revenue_bridge / EBITDA_multiple / negative_fcf_fallback, коды basis и
    `bridge_dependent`); gap-метрики; robustness v1.1; интерфейс Joint Simulation Layer (сглаженный шок lag +
    half-life в сигмах; для роста — по кварталам, для узлов маржи и мультипликаторов — значение в квартале
    горизонта Y3→q12, Y5→q20, Y8→q32); knockout (снятие structural_support) и adverse_driver_stress (константный шок
    driver_sigma); архетип C: дерево вех (Bernoulli через латентный фактор, сроки, terminal_failure / delay_retry),
    существующие и сервисные сегменты, сжигание кэша и размытие raised×(1+dilution_penalty), кусочная оценка
    failure_residual / milestone_conditioned_EV. Всё, что в движке помечено «интерпретация движка» (C1 и др.), —
    либо утвердить, либо заменить с обоснованием.
A.2 **Company_MC_Calibration_Schema_v1.0.yaml** — JSON Schema (Draft 2020-12) калибровочного файла v2 по §4 design
    doc и докстрингам: обязательные/необязательные поля по архетипу, `<dist>` (triangular | pert | truncated_normal |
    lognormal | deterministic с параметрами), provenance у каждого числового параметра (model_assumption |
    verified_fact | derived_fact | owner_judgment) и rationale у model_assumption, `reverse_valuation_ref`,
    `joint_simulation` + `driver_parameter_mapping` (stochastic_targets с transform/effect_per_plus_1sigma/lag/decay,
    structural_support, stability.knockout / adverse_driver_stress), `robustness_tests`, `milestone_model` для C.
    Назначение — валидатор G5 для калибровок (модель artifact_validator, режим calibration): без схемы мы не можем
    механически принимать калибровки. Правило: схема описывает ровно то, что читает движок; поля, которых движок не
    знает, в схему не включать (движок кладёт неизвестные цели mapping в mapping_warnings и не применяет).

## B. Заказ: калибровка SPCX v1.1 в формате v2
Flight 14 (проверка 23.09 09:00 МСК, run задачи spacex-flight14-check): полёт в окно 22–23.09 не состоялся, SpaceX перенесла
старт на 28.09.2026 (подтверждено space.com; первоисточник spacex.com технически не открылся) — запись E1 в info_log,
переход C1→C2 не оценивался, вектор состояний прежний: AI A2 / Starlink B2 / Starship C1 / Capital_Intensity D3.
Калибровка v1.1 делается для этого вектора; эффект C1→C2 остаётся условным (state_transition_effects), повторная
проверка — по факту полёта 28.09.
Перевести `portfolio/spacex/mc_calibration_v1.0.yaml` (A2+B2+C1+D3; сегменты AI / Connectivity / Space; узлы маржи
D3; мультипликаторы Y5 25/32/40 из RV-калибровки, Y8 20/27/35, Y3 revenue bridge 8/14/22) в формат v2 с учётом
результата Flight 14: (1) архетип capital_intensive_transition, margin_model.method = direct_fcf_nodes (или
ocf_capex_decomposition, если данных Q2 достаточно — предпочтительно); (2) вместо rank_correlations —
latent_factors {growth, margin, valuation}, factor_correlations и загрузки по сегментам (latent_loading);
(3) `state_transition_effects` v1.0 (C1→C2, C2→C3, D3→D4) — как условные сдвиги, применяемые ТОЛЬКО при
подтверждённом переходе; если Flight 14 дал C1→C2 — сдвиги C1_to_C2 входят в базовую калибровку v1.1, иначе остаются
условными; (4) `reverse_valuation_ref` из нормативного RV-прогона …-ab1fb7: discount_rate 0.11,
implied_revenue_cagr_5y 0.763 (terminal_value_share_of_pv 0.9996 — модель на грани устойчивости по вашим же
Reverse_Valuation_Rules v1.1 §1, отметить); (5) `joint_simulation` + `driver_parameter_mapping` по
Joint_Simulation_Layer v1.0 для всех material-драйверов из `portfolio/spacex/mpc_inputs.yaml` (по правилу
material_driver_rule: каждый material driver либо имеет mapping, либо явно помечен `not_mapped` с причиной);
(6) `robustness_tests` v1.1; (7) simulation: paths 500000, seed 20260920, antithetic. Числа v1.0 не менять без
причины: это перевод формы + учёт Flight 14, а не новая оценка.

## C. Заказ: калибровки NBIS и NVDA (первая пара по весу в портфеле: 33.4% и 21.5% NAV)
Для каждой компании — два артефакта:
C.1 **Reverse Valuation calibration** (`<TK>_calibration_v1.0.yaml` в формате `portfolio/spacex/calibration_v1.0.yaml`,
    вложение): scenario_state = текущий вектор (NBIS: N3 / E3 / Capacity_Secured=pending_verification / K3 / F2;
    NVDA: D4 / M3 / B4 / S2 / X2), discount_rate base + stress, terminal FCF margin и multiple с обоснованием,
    margin_transition (для NBIS — two_phase_capex_normalization по аналогии с SPCX D3; для NVDA — mature: короткий
    путь от текущей маржи), balance_sheet и base_period из подтверждённых KPI (kpis.yaml, наблюдения дозора run
    verify-NBIS-20260922T210122Z), рыночная капитализация = verified shares_outstanding × цена (Source Policy §8:
    число акций — из 10-Q/6-K с URL и датой, цена — Yahoo chart на дату калибровки; наши котировки 18.09: NBIS
    223.54, NVDA 222.27 — можно взять свежее с указанием даты). Наш движок `reverse_valuation 1.2.0` вернёт
    implied_revenue_cagr_5y и terminal_value_share_of_pv; порог устойчивости — по Rules v1.1 §1.
C.2 **MC calibration v2** (`<TK>_mc_calibration_v1.0.yaml` по схеме A.2): NBIS — capital_intensive_transition,
    сегменты по фактическому раскрытию (AI cloud + прочее), margin_model ocf_capex_decomposition (у NBIS есть capex
    и OCF-данные) либо direct_fcf_nodes с обоснованием, кусочная оценка: Y3 revenue_bridge, Y5/Y8 FCF_multiple с
    negative_fcf_fallback; NVDA — mature_positive_margin, сегменты Data Center / прочее, margin_model
    mean_reverting_positive_margin (current_margin из подтверждённых KPI, terminal Y5/Y8 с обоснованием), оценка
    FCF_multiple на всех горизонтах. Для обеих: latent_factors и загрузки, market_path_model, reverse_valuation_ref
    из C.1, robustness_tests v1.1, `joint_simulation` + `driver_parameter_mapping` для material-драйверов из
    mpc_inputs (NBIS: AI_COMPUTE_DEMAND, CLOUD_SOFTWARE_DEMAND, DATA_CENTER_POWER, CAPITAL_MARKETS, TAIWAN_SUPPLY,
    AI_CLOUD_PRICING как ±2; остальные ±1 — по правилу материальности; NVDA: AI_COMPUTE_DEMAND, HYPERSCALER_CAPEX,
    ADVANCED_PACKAGING, HBM_MEMORY, DATA_CENTER_POWER, TAIWAN_SUPPLY как ±2), stability.knockout для structural_support
    и adverse_driver_stress; связь с failure modes (NBIS-FM-01..06, NVDA-FM-01..08) — через common_cause_id в
    комментарии к mapping, не через новые поля.
C.3 Провенанс и запреты: каждое число — verified_fact (с URL и датой) | derived_fact (с формулой) | model_assumption
    (с rationale) | owner_judgment (только если есть решение владельца); запрещено подгонять параметры под текущую
    цену (Price_Expectation_Gap — выход диагностики, не цель); прогнозы компании — company_guidance, не actual.

## Критерии приёмки
- A.2: схема валидна (Draft 2020-12); калибровка SPCX v1.1 и обе новые проходят её; калибровка SPCX v1.0 через
  адаптер движка — тоже (обратная совместимость).
- B и C.2: прогон `company_mc 2.3.0` на сайдкаре без mapping_warnings, детерминирован по seed, robustness pass;
  для SPCX v1.1 — сравнение с v1.0 (…-e169f2) с объяснением расхождений только переводом формы / Flight 14.
- C.1: прогон `reverse_valuation` без ошибок валидации; terminal_value_share_of_pv в пределах Rules v1.1 §1.
- Формат ответа: YAML-файлы + один Markdown с обоснованиями по осям и параметрам (как SPCX_calibration_v1.0.md).
Порядок: если объём велик — сначала A (спецификация + схема), затем B и C одним ответом; калибровки без схемы A.2
принимать не будем.

=== КОНЕЦ ===

## Вложения (Downloads/mc-v11-to-llm)
- `engine/company_mc_v2_design.md`, `engine/engine_calibration_schema_docstrings.md` — схема калибровки, которую читает
  движок (company_mc 2.3.0, milestone_mc, joint_layer).
- `spacex/mc_calibration_v1.0.yaml`, `spacex/calibration_v1.0.yaml` — действующие калибровки SPCX (формат-образец).
- `spacex/20260922T062152Z-company_mc-e169f2.json` — сравнительный прогон SPCX на v2 (паритет, gap, robustness).
- `spacex/20260920T183913Z-reverse_valuation-ab1fb7.json` — нормативный RV-прогон SPCX.
- `nbis/`, `nvda/` — states.yaml, kpis.yaml, mpc_inputs.yaml, state.json (текущие модели после сверок).
- `methodology/Joint_Simulation_Layer_Schema_v1.0.yaml`, `Joint_Simulation_Mapping_Examples_v1.0.yaml`,
  `MC_Calibration_Archetypes_Schema_patch_v1.1.yaml`, `Reverse_Valuation_Rules_v1.1.md` — ваши же документы, для
  сверки терминов.
- `spacex/state.json` после проверки Flight 14 23.09 (запись E1 о переносе).
