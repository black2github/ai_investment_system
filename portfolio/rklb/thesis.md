# Rocket Lab Corporation (RKLB, NASDAQ): фактическая позиция

Бумага в портфеле владельца (см. `portfolio/_portfolio.yaml`, счёт и количество там). Тезис владельца в системе не
записан: позиция унаследована из портфеля, собранного до системы. Модель компании (оси состояния, KPI, триггеры
переходов, входы MPC) получена от другой LLM 2026-09-21 и лежит в `states.yaml`, `kpis.yaml`, `triggers.yaml`,
`mpc_inputs.yaml`. Значения KPI — до сверки с первоисточниками (`verified: false`).

**Текущий вектор состояний (снимок LLM на 2026-09-21):** Electron_Cadence=E2 + Neutron_Development=N1 + Space_Systems_Scale=S3 + Backlog_Visibility=B3 + Capital_and_Integration=C2.

**Что дальше по конвейеру:** проверка фактов → калибровка reverse valuation и условного MC (после MC v1.1) → MPC →
оптимизатор. Решение Core/Challenger/Watch — только после этого; сейчас `role.current: null`.
