# Hedge Instrument Model — Specification v1.0

Дата: 2026-09-30. Партия 10, часть A.

## Цель

Отдельный минимальный market-risk model для разрешённых owner hedge instruments, которые не являются компаниями и не должны искусственно проходить Company MC Calibration.

## V1 GLD decision

GLD требует model до включения в conditional optimizer как hedge asset. Плоская 0% доходность разрешена только как legacy diagnostic placeholder и не может служить числовым основанием действия `hedge`.

Минимальный accepted GLD model обязан иметь:
1. quarterly return dynamics: empirical bootstrap или log-return family;
2. drift и volatility с происхождением и market-data window;
3. common path_id linkage;
4. root/factor covariance, если статистически/экономически обоснована;
5. explicit idiosyncratic residual;
6. scenario-specific overrides для TAIWAN_SEIZURE / TAIWAN_QUARANTINE, если они используются для hedge claim;
7. stress backtest и validation report.

Не вводить фиктивную company exposure к `AI_COMPUTE_DEMAND`, `TAIWAN_SUPPLY` и т.п. Для GLD экономически первичны market/real-yield/USD/safe-haven факторы; если Joint v1.1 их не содержит, Hedge Model может иметь собственный factor block и явную cross-correlation с подходящими Joint roots. Это не расширяет Company MPC taxonomy.

Owner limit GLD <=10% NAV живёт в owner hedge constraints, не в calibration.
