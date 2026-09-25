# Для передачи IMMA: ответ по 2.1–2.4 принят; persistence реализован по вашему определению; заказ Joint schema v1.1, Taxonomy v1.2.1 и пяти переизданий

Черновик 25.09.2026, НЕ отправлен. Одно сообщение от «=== НАЧАЛО ===» до «=== КОНЕЦ ===», без вложений.
Порядок: после приёмки CRWV v1.0.1 (`mc-crwv-v101.feedback.md`); заказ SPOT — после получения этого пакета.

=== НАЧАЛО ===

## 1. Сделано по вашему ответу
- **persistence_override — по вашей нормативной семантике** (innovation-level): η_{d,t} = standardize(Σ_r λ_{d,r}·u_{r,t} + w_d·ε_{d,t}),
  u — инновации корней текущего квартала после фазовой матрицы корреляций (u_0 = F_0, u_t = (F_t − φ·F_{t−1})/sqrt(1−φ²)), ε — та же
  идиосинкратическая инновация, что в BASE; стандартизация по дисперсии инновации в текущем состоянии корреляций
  (λᵀR_state λ + w²); y_t = ρ_t·y_{t−1} + sqrt(1−ρ_t²)·η_t; null — bypass; при старте override y_{t−1} = последний выпущенный
  стандартизированный шок; numeric→numeric — линейно по фазовому весу; phi корней и decay mapping не трогаем. Предварительная
  prewhitening-интерпретация удалена.
- **Валидатор: проверка SCN-011**, как вы предложили: на плато с постоянным ρ после прогрева 4 кв. — Var(y) и лаг-1 корреляция.
  На ваших калибровках (замер 6000 путей, прогон валидатора …-f9405d): TAIWAN_SEIZURE — 24 проверки, вне допуска 0 (например
  CONFLICT/ADVANCED_PACKAGING ρ 0.9: Var 1.000, lag-1 0.902; RECOVERY ρ 0.75: 1.017 / 0.752); CHIP_COLD_WAR — 19 проверок, 0 вне
  допуска (TWO_SYSTEMS/AI_CLOUD_PRICING ρ 0.8: 0.991 / 0.803). Короткие фазы (BLOCKADE ~2 кв., PARITY_BOUNDARY 4 кв.) для замера
  недостаточны — помечаются insufficient_paths, не ошибкой.
- Прогоны 13 × 2 × 500k, сделанные до замены семантики, помечены **pre-normative diagnostics** (см. notes) и будут повторены
  после Joint schema v1.1 и переизданий.

## 2. Заказ (один пакет, полный текст + дельта, манифест sha256)
2.1 **Joint_Simulation_Layer_Schema v1.1** — полное переиздание с root-mapping для INDUSTRIAL_RESHORING (AI_CAPEX_CYCLE 0.30 /
    POWER_BUILDOUT 0.35 / GLOBAL_GROWTH 0.20, idio 0.60) и ACCELERATOR_PRICE_COMPETITION. **Расхождение, которое надо снять:** в
    пакете Scenario Engine файл Joint_Simulation_Layer_Driver_Patch_v1.0.yaml задаёт ACCELERATOR_PRICE_COMPETITION как
    {AI_CAPEX_CYCLE 0.20, SEMI_SUPPLY_HEALTH 0.25, CHINA_MARKET_ACCESS 0.35, idio 0.70}, а ваш ответ по 2.2 — {AI_CAPEX_CYCLE 0.35,
    SEMI_SUPPLY_HEALTH 0.30, idio 0.65}. Просим одно нормативное значение в v1.1 с обоснованием (patch notes: что заменяет что).
    Остальные драйверы без mapping (ACQUISITION_INTEGRATION, FINTECH_REGULATION, фарм-драйверы) — по вашему решению остаются
    идиосинкратическими; просим зафиксировать это правило в тексте v1.1 явно.
2.2 **MPC_Driver_Taxonomy v1.2.1** — структурная нормализация: added_v1_2 → drivers.added_v1_2 с patch notes «intentional relocation,
    values preserved verbatim» (проверим check_supersedes с явным разрешением пропажи старого пути).
2.3 **Пять переизданий калибровок** на схеме 1.0.2 с новым mapping (и исправлением знаков TAIWAN_SUPPLY у MSFT/META):
    NBIS mc v1.0.3 и NVDA mc v1.0.3 (миграция с 1.0.1: parity-gated смесь; центры и хвосты не менять — migration delta ожидаема),
    MSFT mc v1.0.1, META mc v1.0.2, ASML mc v1.0.2. Приёмка каждой — полная нормативная (валидатор 1.7.0, MC-G5-013 по измеренной σ,
    500k BASE на 2.3.2 с basis shares и bridge_dependent, устойчивость v1.1.2, затем сценарные прогоны); старые прогоны 1.0.1 сохраняем.
    Просим выпускать после 2.1, чтобы mapping опирался на окончательную Joint-семантику.
2.4 CRWV v1.0.1 — принят (см. приёмку); в этот пакет не входит.

## 3. Что дальше на хосте
После 2.1–2.3: нормативные сценарные прогоны 13 компаний (BASE + 2 сценария × 500k) на общих путях, coverage-отчёт, Stability по
сценариям (§3.3 — после вероятностей владельца), затем Decision Request владельцу по вероятностям сценариев с фактическими
картинами портфеля под каждым.

=== КОНЕЦ ===
