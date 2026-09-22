# AST SpaceMobile, Inc. (ASTS, NASDAQ): фактическая позиция

Бумага в портфеле владельца (см. `portfolio/_portfolio.yaml`, счёт и количество там). Тезис владельца в системе не
записан: позиция унаследована из портфеля, собранного до системы. Модель компании (оси состояния, KPI, триггеры
переходов, входы MPC) получена от другой LLM 2026-09-21 и лежит в `states.yaml`, `kpis.yaml`, `triggers.yaml`,
`mpc_inputs.yaml`. Значения KPI — до сверки с первоисточниками (`verified: false`).

**Текущий вектор состояний (снимок LLM на 2026-09-21):** Constellation_Deployment=D2 + Commercial_Contracting=C3 + Service_Monetization=M1 + Regulatory_Spectrum=R2 + Funding_Dilution=F2.

**Что дальше по конвейеру:** проверка фактов → калибровка reverse valuation и условного MC (после MC v1.1) → MPC →
оптимизатор. Решение Core/Challenger/Watch — только после этого; сейчас `role.current: null`.
