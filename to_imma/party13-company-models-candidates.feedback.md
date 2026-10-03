# Для передачи IMMA: приёмка партии 13 — модели компаний CRWD / HPS.A / S ПРИНЯТЫ и встроены; одно замечание (CAND-REF-014); заказ партии 14 — RV + MC-калибровки

Подготовлено 03.10.2026 (не отправлено). Одно сообщение от «=== НАЧАЛО ===» до «=== КОНЕЦ ===», без вложений.
Очередь после него: партия 14 (калибровки трёх кандидатов) → пути на общих path_id → заход отбора на 18 бумагах (режим universe) по одобрению
владельца; параллельно — переиздание theme_exposure SPCX (exception) / META (dependency) и замена заглушек NBIS / CRWV (ваш follow-up).

=== НАЧАЛО ===

## 1. Партия 13 принята (IMMA_Party13_CRWD_HPSA_S_Company_Models_v1.0; zip sha256 b6a75441…, 31 файл по манифесту — сошлись; термины pass)
- Валидатор G5 хоста: режим workspace по папкам crwd / hps_a / s — PASS, 0 ошибок схемы и целостности (run 20261003T180625Z-artifact_validator-5be361);
  режим theme с Theme Taxonomy v1.0.1 — по трём новым theme_exposure замечаний нет (run …-3edee0); THM-007 для CLOUD_SOFTWARE_DEMAND = +2 у
  CRWD / S закрыт долей CYBERSECURITY 100 % (non-fallback, сегментная отчётность — один сегмент).
- Theme Taxonomy v1.0.1 принята: отдельная первичная тема CYBERSECURITY вне AI_TOTAL, связь с CLOUD_SOFTWARE_DEMAND (strong_share_check);
  установлена в methodology, валидатор берёт последнюю версию таксономии. Для портфельной политики доля AI_TOTAL у CRWD / S / HPS.A = 0.
- KPI сверены хостом по первоисточникам: 30 из 30 значений совпали с досье хоста (8-K Exhibit 99.1 CRWD и S, 10-Q, релиз и Q2 Report HPS;
  презентация S Q2 FY2027 с EDGAR: net new ARR $56 млн, +4 % г/г; non-endpoint > 50 % ARR). Производные формулы (non-GAAP opMargin CRWD
  0.2526, FCF margin 0.2566, рост гудвилла 0.6515, adj. EBITDA margin HPS.A 0.1639, FCF margin S −0.0452) воспроизведены. Пара CRWD / S
  (оси ARR_Momentum / Net_New_ARR / Platform_Adoption / Profitability_Cash / Retention_Quality + особые M&A_Integration / Enterprise_Scale)
  принята: сопоставимость по смыслу, расхождения — отдельными осями, как заказано. Retention S = R1 visibility_limited и HPSA-KPI-10 (AEG,
  pending_verification) — принято как состояние раскрытия, без оценок.
- Дозор-прогон агента по трём папкам (immutable verification_run_id) ещё не выполнен — остаётся PENDING_HOST_RUN; к калибровкам не блокирует
  (факты проверены хостом), run_id впишем при первом report-check.

## 2. Встроено на хосте
- `portfolio/hps_a` и `portfolio/s` — новые папки (states / kpis / triggers / mpc_inputs / state.json / theme_exposure + кандидат и досье).
- `portfolio/crwd` — слияние с реестром корзины ИИ-инфраструктуры 17.09 (ваш Registry merge note выполнен): meta владельца (target_weight,
  strategy_source / date, price_at_strategy 241.36, status_in_basket), automations корзины и степпер route сохранены; legacy-триггеры
  CRWD-E-01..04 и C-01 остались под своими id (их покрывают автоматизации report-check / news-watch); триггеры модели получили id
  **CRWD-E-05..E-14** (ваши CRWD-E-01..10 — исходный id в note каждого). state.json: legacy pending_verification / notes / route + вектор
  состояний и kpi_observations модели. Просим в калибровке и будущих переизданиях CRWD ссылаться на новые id E-05..E-14.
- `portfolio/_candidates.yaml`: CRWD / HPS.A / S → stage company_model (03.10.2026). Вселенная оптимизатора расширится до 18 бумаг после
  калибровок и путей.

## 3. Замечание (не блокирует)
3.1 CAND-REF-014 в режиме candidate у всех трёх: в `mpc_inputs.driver_exposure_vector` кандидата нет ACCELERATOR_PRICE_COMPETITION
    (Candidate Schema v1.0.1 — 32 драйвера v1.1, таксономия 1.2.1 — 33). Ваша пометка taxonomy_gap принята; канонические mpc_inputs полны —
    приёмка по ним. Просим в удобной партии Candidate Schema **v1.0.2** с полным вектором таксономии 1.2.1 (и правилом: вектор кандидата ==
    driver_ids объявленной таксономии), чтобы режим candidate снова давал 0 ошибок.

## 4. Заказ партии 14: RV + MC-калибровки CRWD / HPS.A / S (Company MC Calibration Schema v1.0.2, Rules v1.1 архетипов, Joint Layer хоста)
По формату партий 4–5 (`<TK>_calibration_v1.0.yaml` для reverse_valuation и `<TK>_mc_calibration_v1.0.yaml` для company_mc), сверка хостом:
RV-прогон → валидатор режим calibration (MC-G5-001..013, сухой прогон движка, дисперсия) → нормативные 500k путей на общих path_id.
- **CRWD** — архетип A (mature recurring software / positive FCF), как в вашем handoff; FCF-нормализация с явным учётом SBC и M&A-нагрузки
  (рост гудвилла) — отдельные failure modes / события, не подгонка оценки. Рыночные входы: цена и число акций — из 10-Q (shares outstanding
  на дату обложки), источник цены Yahoo CRWD.
- **HPS.A** — mature_positive_margin с M&A-переходом: AEG входит в калибровку только с первого фактически консолидированного периода (Q3 2026,
  отчёт в ноябре) — до него базовый период Q2 без pro-forma; валюта CAD (укажите fx_to_base и его источник), число акций классов A и B —
  из MD&A / SEDAR+; источник цены Yahoo HPS-A.TO. Долг по сделке AEG — в balance_sheet с датой и источником.
- **S** — решение A vs переход на гейте калибровки: просим дать обоснованный выбор метода нормализации FCF (Q2 FCF отрицательный, YTD
  положительный, GAAP opMargin −31 %) с явной пометкой происхождения model_assumption; рыночные входы — 10-Q.
- Общее: единицы и даты как в Schema v1.0.2 (примеры в methodology); каждое число — с source_url и формулой; пороги — model_assumption;
  сценарные состояния — по текущему state.json набора (BASE / normal). Критерии приёмки: RV воспроизводится сайдкаром (implied CAGR, TV share),
  валидатор calibration — 0 ошибок, MC-G5-013 (σ сдвига) в допуске, дисперсия в ориентирах Rules v1.1.

## 5. Для сведения
Порог материальности THM-007 0.20 подтверждён владельцем 03.10.2026 (owner_judgment) — исключения SPCX / dependency META ждём в вашем
follow-up. Целевые веса портфеля v1.0 утверждены владельцем (DR-2026-10-03-01, V1: шесть бумаг) — пересмотр после калибровок кандидатов.

=== КОНЕЦ ===
