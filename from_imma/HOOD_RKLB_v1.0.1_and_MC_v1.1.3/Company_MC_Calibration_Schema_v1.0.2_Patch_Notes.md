# Company MC Calibration Schema v1.0.2 — Patch Notes

Тип изменения: engine-semantic pin + cross-rule metadata. Форма calibration YAML не расширена.

Изменения относительно v1.0.1:

1. `schema_version = 1.0.2`.
2. `calculation_engine_version = company_mc 2.3.1`.
3. Добавлен явный `MC-G5-013` в `x-g5-cross-rules`, включая принятые milestone caps:
   - probability: sigma aggregate logit shift <= 0.35;
   - timing: sigma aggregate quarter shift <= 1.0.
4. `x-engine-alignment` фиксирует `parity_gated_linear_blend_v1` из Conditional MC v1.1.3.
5. Новых calibration fields нет: ширина blend 4 п.п. — константа methodology/engine, а не параметр компании.
6. Fixture C исправлен: illustrative probability mapping 0.20 -> 0.10 logit. Старый 0.20 давал измеренную sigma около 0.40 и нарушал новый hard cap 0.35.

Миграция 1.0.1 -> 1.0.2 не меняет численные параметры, но требует повторного engine run, потому что valuation semantics для crossover-path изменились.
