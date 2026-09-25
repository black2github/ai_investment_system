# Для передачи IMMA: заказ калибровки SPOT (архетип A, mature_positive_margin) — партия 6 калибровок

Отправлен IMMA 25.09.2026 (владелец); ответ — партия 6 (SPOT RV+MC v1.0, ETN mc v1.0.2), принята. Одно сообщение от «=== НАЧАЛО ===» до «=== КОНЕЦ ===» с вложениями из папки
Downloads/mc-spot-to-llm (список в конце). Пакет Joint v1.1 / Taxonomy v1.2.1 / переизданий получен 25.09 — можно
отправлять сразу; приёмка того пакета уйдёт отдельным сообщением позже (там заказа нет). В раздел E добавлен малый заказ
ETN v1.0.2 (одним пакетом с SPOT, чтобы не тратить отдельный цикл IMMA).

=== НАЧАЛО ===

## Контекст
Нормативы те же, что у партий 4–5: Company_MC_Calibration_Schema v1.0.2 (`calculation_engine_version: company_mc 2.3.1`
по const схемы; хост считает на 2.3.2; `joint_simulation.layer_version: '1.0'` по const), Conditional MC v1.1.3,
**Joint_Simulation_Layer_Schema v1.1** (ваш пакет 25.09, принят к нормативу на хосте: check_supersedes 0 пропаж,
root-mapping INDUSTRIAL_RESHORING / ACCELERATOR_PRICE_COMPETITION) + Rules v1.1.2, MPC_Driver_Taxonomy v1.2.1,
Reverse_Valuation_Rules v1.1. Конвейер приёмки прежний: RV → валидатор 1.7.0 (MC-G5-013 по измеренной σ под Joint v1.1)
→ устойчивость v1.1.2 → нормативный 500k, seed 20260920 → сценарные прогоны.
После этой партии без калибровок останутся только ETF (GLD, UFO): покрытие 14 → 15 компаний, 96.0 → ≈97 % NAV.
Позиция: SPOT 1.1 % NAV, NYSE, USD; снимок котировок 20.09: 509.45 USD (максимум 12 мес. 738.53). Модель компании
принята 25.09 (партия 6 моделей, валидатор папки …-d4735b, 0 ошибок); дозор по фактам 6-K/IAS 34 ещё не проходил —
расхождения при сверке → патч калибровки.

## A. Развилка, которую надо решить явно: валюта
Отчётность в EUR (6-K/IAS 34, 20-F), листинг только NYSE в USD (EUR-листинга нет — в отличие от ASML, где калибровка
целиком в EUR по Euronext). Наша рекомендация: **калибровка целиком в EUR** (выручка, маржи, баланс — как в
отчётности), а `market.equity_value` = цена USD × акции → EUR по курсу ЕЦБ на дату цены (verified_fact с URL и датой,
формула в derived_fact); валютную премию в ставку не вводить (как у ASML). Альтернатива — перевод отчётности в USD —
хуже: пересчёт всех узлов по одному курсу создаёт ложную точность. Решение и его обоснование — в Markdown ответа.

## B. Reverse Valuation calibration (`SPOT_calibration_v1.0.yaml`, формат MSFT/ASML)
Вектор A3 / P3 / D1 / M3 / C3 (Audience_Scale / Premium_Monetization / Ad_Monetization / Unit_Economics /
Profitability_Cash — по states.yaml модели); base_period Q2 2026 TTM: выручка +13.9 % YoY (Q2 4.777 млрд EUR),
MAU 777 млн (+12 %), Premium 300 млн подписчиков (+9 %), ARPU 4.89 EUR (+7 %), Premium-выручка +15 %, Ad-Supported
+1 % при Ad-MAU 494 млн (+14 %), валовая маржа 33.4 % (Premium 34.9 %, Ad 19.1 %), операционная маржа 13.7 %
(655 млн на 4.777 млрд), FCF-маржа H1 17.4 % — все с source_url из state.json модели (SPOT-KPI-01…10). Баланс:
денежные средства и краткосрочные вложения, долг (конвертируемые ноты) — из 6-K с датой; net_debt | net_cash — имена
полей как у RKLB/HOOD/MSFT (`cash`, `net_debt`), не `net_debt_approx`. discount base + stress; margin_transition для
зрелой платформы (ожидаем linear или mean_reverting к терминальной FCF-марже с обоснованием: разрыв между валовой
33 % и FCF 17 % — рычаг операционных расходов и оборотного капитала, не подгонка); терминальные маржа и
мультипликатор с обоснованием; класс устойчивости отметить как есть.

## C. MC calibration (`SPOT_mc_calibration_v1.0.yaml`, схема v1.0.2, архетип A, структура MSFT v1.0)
- revenue_model: **два сегмента** — Premium (подписчики × ARPU: рост базы и ценообразование как отдельные узлы
  происхождения) и Ad-Supported (монетизация аудитории; текущий разрыв +1 % выручки при +14 % аудитории — свойство
  состояния D1, не шум); третий сегмент не вводить.
- margin_model: `mean_reverting_positive_margin` (как MSFT) с FCF-маржей от H1 17.4 % (derived_fact с формулой) и
  узлами Y1…Y5/Y8; валовая маржа как промежуточный якорь не обязательна — если используете, то с происхождением (provenance) по
  Premium/Ad раздельно. Контентная экономика (роялти) — через хвосты маржи и failure mode CONTENT_COST_INFLATION.
- Кусочная оценка: FCF_multiple как основной (FCF положительный), revenue_bridge — референсный; `negative_fcf_fallback`
  по правилу схемы ≥1.0.2 с обоснованием (ожидаемо не задействован).
- latent_factors + загрузки; robustness v1.1.2; **mapping**: ±2 — DIGITAL_AD_DEMAND (на рост Ad-Supported); ±1 —
  AI_COMPUTE_DEMAND, CLOUD_SOFTWARE_DEMAND, CAPITAL_MARKETS, ACQUISITION_INTEGRATION, INTEREST_RATES (−1),
  AI_CLOUD_PRICING (−1, только стоимость — не драйвер выручки, как в mpc_inputs) — по материальности, сайзить по
  измеренной σ, не более 3–4 драйверов на одну цель (урок ETN/CRWV); failure modes SPOT-FM-01…06 через
  common_cause_id (SUBSCRIPTION_PRICING_ELASTICITY и CONSUMER_ENGAGEMENT_SLOWDOWN — high; knockout_shift или
  обоснованный отказ). Сектор INTERNET_PLATFORMS остаётся provisional — если для правила сектора нужен парный тикер,
  скажите; мы его не навязываем.
- Хвосты по ориентиру архетипа A (intrinsic W как у MSFT/PLTR/NET — ориентир в Rules) без подгонки центров.

## D. Происхождение чисел и запреты (как прежде)
Каждое число — verified_fact (URL + дата) | derived_fact (формула) | model_assumption (rationale) | owner_judgment;
подгонка к цене запрещена; прогнозы компании — company_guidance; simulation: paths 500000, seed 20260920, antithetic;
reverse_valuation_ref.run_ref — PENDING_HOST_RUN. Нераскрытое не оценивать.

## E. Малый заказ в том же пакете: ETN mc v1.0.2 (MC-G5-013 под Joint v1.1)
Ревалидация всех 14 калибровок под Joint v1.1 (валидатор 1.7.0): 13 pass, **ETN v1.0.1 — fail**:
`revenue_model.segments.ElectricalAmericas.initial_growth` σ **0.160 > cap 0.15** (под Joint v1.0 было 0.141, Σ|effect|
0.084 без изменений). Причина — INDUSTRIAL_RESHORING (вклад 0.01125, lag 2, decay 10) получил корни AI_CAPEX_CYCLE /
POWER_BUILDOUT / GLOBAL_GROWTH и стал коррелировать с HYPERSCALER_CAPEX, DATA_CENTER_POWER, ELECTRIFICATION_GRID,
UTILITY_CAPEX, AI_COMPUTE_DEMAND на той же цели. Диагностика хоста на копиях (канон не трогали): равномерный масштаб
шести вкладов на ElectricalAmericas ×0.90 → σ 0.143 (pass), ×0.85 → 0.136; intrinsic W 0.280 не меняется, full W
0.325 → 0.331 / 0.327. Просим **ETN mc v1.0.2**: полный текст + дельта, только эти вклады (×0.90 или перераспределение
части INDUSTRIAL_RESHORING на менее коррелированную цель — по вашему усмотрению), центры и прочие цели не трогать.
RKLB и ASML тоже несут INDUSTRIAL_RESHORING — под v1.1 проходят (RKLB post_service_growth 0.113/0.15; ASML v1.0.2 EUV
0.104/0.15); RKLB BASE перепрогнан под v1.1 (пути изменились, калибровка нет). Остальные семь без новых корней —
побитно те же пути (проверено на HOOD), их BASE-прогоны в силе.

## Критерии приёмки
Схема v1.0.2 без ошибок; MC-G5-013 pass по измеренной σ под Joint v1.1; сухой прогон без mapping_warnings, детерминизм;
intrinsic W в ориентире A; устойчивость v1.1.2 pass; RV без ошибок валидации, класс устойчивости отмечен; валютное
решение задокументировано. Ответ: два YAML SPOT + ETN_mc_calibration_v1.0.2.yaml с patch notes + Markdown с
обоснованиями и решениями по развилкам (валюта; сегментация Premium/Ad; контентная экономика) + манифест sha256.

=== КОНЕЦ ===

## Вложения (Downloads/mc-spot-to-llm)
- `spot/` — states.yaml, kpis.yaml, mpc_inputs.yaml, triggers.yaml, state.json (модель партии 6, схема v1.0.5).
- `reference/MSFT_calibration_v1.0.yaml`, `reference/MSFT_mc_calibration_v1.0.1.yaml` — принятая пара архетипа A на схеме
  v1.0.2 (mean_reverting_positive_margin, два сегмента; v1.0.1 — ваше переиздание 25.09 под Joint v1.1).
- `reference/ETN_mc_calibration_v1.0.1.yaml` — исходный текст для переиздания ETN v1.0.2 (раздел E).
- `reference/ASML_calibration_v1.0.yaml` — принятая RV-калибровка целиком в EUR (образец валютной дисциплины).
- `reference/20260924T175814Z-company_mc-a26670.json` — нормативный прогон MSFT на 2.3.2.
