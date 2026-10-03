# Для передачи IMMA: приёмка партии 12 — Theme Look-through v1.0, Capital Allocation Risk v1.0, Portfolio Optimizer v1.1 ПРИНЯТЫ и внедрены; база AI_TOTAL материализована; три замечания THM-007

Отправлен IMMA 03.10.2026 (владелец). Одно сообщение от «=== НАЧАЛО ===» до «=== КОНЕЦ ===», без вложений.
Очередь после него: итоги захода 9 (варианты CARDINALITY_6 / CARDINALITY_8 / NO_CARDINALITY_LIMIT) → DR владельцу по составу; затем кандидаты.

=== НАЧАЛО ===

## 1. Партия 12 принята (IMMA_Party12_Theme_Lookthrough_Capital_Allocation_Optimizer_v1.1; zip sha256 08638698…, 24 файла по манифесту — сошлись; термины pass)
- Theme Look-through v1.0 (спецификация, схема ThemeExposure, таксономия, правила THM-001…012, политика AI_THEME_NOT_INCREASE_V1) —
  принят: отдельный артефакт `portfolio/<ticker>/theme_exposure_v1.0.yaml`, аддитивные первичные темы, binding basis = revenue, capex и
  operating income — диагностика, драйвер ±2/±1 остаётся чувствительностью. Пять файлов (SPCX, NVDA, MSFT, META, ETN) — по схеме 0 ошибок.
- Capital Allocation Risk v1.0 (правила, схемы, оценка SPCX, глоссарий) — принят: двусторонний подход без автоматического штрафа за
  многопрофильность, CAR-X1…X5 с порогами model_assumption / pending_owner_judgment, cross-subsidy только по allocation evidence, SOTP —
  диагностика. SPCX: CAR-X1 (AI) и CAR-X3 (Space, AI) — candidate_if_threshold_approved, CAR-X2 not_evaluable, SOTP не считался —
  принято как есть; арифметика долей и отношений за Q1/Q2 2026 воспроизведена валидатором хоста (допуск 1e-6).
- Portfolio Optimizer v1.1 — полный текст из канонического v1.0 + §§14–19: check_supersedes машинной схемы 1.0 → 1.1 — пропало 0,
  изменено 4; принят как нормативный дом оптимизатора (сценарные гейты, концентрация warning 60 / hard 70, cardinality, тема, порядок
  допустимости §17, выход §19).

## 2. Внедрено на хосте
- Нормативы (15 файлов) — в methodology; ThemeExposure IMMA — в папки пяти компаний; оценка CAR SPCX — `portfolio/spacex/capital_allocation_risk_v1.0.yaml`.
- **Заглушки хоста** по §6 для остальных десяти счётных бумаг (NBIS, CRWV → AI_CLOUD_COMPUTE; ASML → SEMICONDUCTOR_EQUIPMENT; LLY → HEALTHCARE;
  HOOD → FINTECH; PLTR → ENTERPRISE_SOFTWARE; NET → EDGE_COMPUTE; ASTS → CONNECTIVITY; RKLB → SPACE; SPOT → CONSUMER_DIGITAL): все три базы —
  одна строка 100 % первичной темы, model_assumption, причина явная; первичные темы назначены интегратором (model_assumption), файлы по
  схеме 0 ошибок. Просим в следующей партии заменить заглушки разложениями по сегментной отчётности хотя бы для NBIS и CRWV (они определяют
  базу AI_TOTAL) и подтвердить/поправить назначенные первичные темы.
- **База AI_TOTAL материализована** (THM-011, Theme_Portfolio_Policy baseline → MATERIALIZED): по весам снимка 21.09.2026 (цены 18.09) и
  долям выручки — **T_AI_TOTAL(21.09) = 0.5428** (NBIS 33.0 % × 1.0 + NVDA 21.3 % × 0.925 + MSFT 1.9 % × 0.437 + SPCX 0.7 % × 0.328 + CRWV 0.5 %
  × 1.0). Для оптимума отбора S8 — T = 0.4000: политика выполняется с запасом; покупка CRWV +10 п.п. внутри темы допустима.
- Движок: portfolio_optimizer 1.3.0 — тематическое ограничение §16 как owner structural constraint (жёсткое при MATERIALIZED, отчётное при
  PENDING), cardinality §15 (1.2.0: positions_min/max, min_position_weight, ходы «закрыть/открыть позицию» через запретную зону), выход по
  §19 (contract_version 1.1, positions_count, cardinality_variant, theme_lookthrough, scenario_conditional_gates,
  scenario_concentration_warning / hard_status); artifact_validator 1.10.0 — режимы theme (THM-001…011) и car (CAR-001…006 машинно).
- Заход 9 (идёт): варианты §15.1 CARDINALITY_6 / CARDINALITY_8 / NO_CARDINALITY_LIMIT с мин. весом 3 % + контроль без лимитов, цена
  ограничения против NO_CARDINALITY_LIMIT — итоги в следующем сообщении вместе с DR владельцу.

## 3. Замечания (THM-007, ваш пункт «intentionally pending: full canonical-driver consistency run on host mpc_inputs»)
Прогон THM-007 на канонических mpc_inputs хоста (порог 0.20 — model_assumption) даёт три ошибки у файлов IMMA:
3.1 SPCX: драйверы LAUNCH_ECONOMICS (+2) и GOVERNMENT_DEFENSE (+2) связаны с темой SPACE, доля Space по выручке 12.3 % и по капзатратам
    6.4 % < 0.20. Нужно либо явное исключение в `driver_consistency.exceptions` с обоснованием (пуски и оборонные контракты — драйверы
    Space-сегмента и опциональности Starship, доля сегмента мала при материальности для тезиса), либо снижение драйверов до ±1.
3.2 META: AI_COMPUTE_DEMAND (+2) при нулевой non-fallback доле тем AI_COMPUTE / AI_CLOUD_COMPUTE / EDGE_COMPUTE (выручка META — реклама
    99.3 %). Экономически META — потребитель ИИ-вычислений (capex), не продавец: предлагаем либо исключение «dependency, not share», либо
    перевод связи AI_COMPUTE_DEMAND для META в режим dependency_not_share_binding на уровне компании.
3.3 Для десяти заглушек хоста THM-007 даёт предупреждения (fallback не засчитывается) — ожидаемо до выпуска разложений.
Решение по порогу 0.20 — за владельцем (pending_owner_judgment), передадим вместе с DR.

## 4. Далее
После захода 9 — DR владельцу по составу (6 / 8 / без лимита) и, при его решении, заход с кандидатами (онбординг через кандидатскую схему).
Терминология прежняя; партии — сквозная нумерация (следующая — 13).

=== КОНЕЦ ===
