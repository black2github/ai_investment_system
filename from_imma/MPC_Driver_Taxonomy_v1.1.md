# MPC Driver Taxonomy v1.1

Дата: 2026-09-21

## 1. Изменение

К исходным 16 драйверам добавлены 16 новых. Цель — убрать систематические `taxonomy_gap` у healthcare, electrification, fintech/consumer и space-regulation, не превращая каждый failure mode в factor.

## 2. Driver и common_cause_id

**Driver** — направленный фактор: «если фактор усиливается, компании лучше или хуже?» Поэтому ему можно присвоить −2…+2.

**common_cause_id** — механизм отказа: «могут ли две компании пострадать от одного механизма?» Ему не нужен знак.

Пример: `FINTECH_REGULATION` — driver; `PREDICTION_MARKETS_REGULATION` — конкретный common cause HOOD.

## 3. Новые драйверы

`AI_CLOUD_PRICING`, `HEALTHCARE_DEMAND`, `DRUG_PIPELINE`, `REIMBURSEMENT_PRICING`, `BIOPHARMA_MANUFACTURING_CAPACITY`, `PHARMA_REGULATION`, `PATENT_EXCLUSIVITY`, `ELECTRIFICATION_GRID`, `UTILITY_CAPEX`, `INDUSTRIAL_RESHORING`, `AEROSPACE_CYCLE`, `CONSUMER_CREDIT`, `CRYPTO_CYCLE`, `FINTECH_REGULATION`, `DIGITAL_AD_DEMAND`, `SPACE_REGULATION`.

## 4. Правило знака

Знак — эффект **роста самого фактора**.

- `INTEREST_RATES=-2`: рост ставок сильно отрицателен;
- `PHARMA_REGULATION=-2`: ужесточение отрицательно;
- `PATENT_EXCLUSIVITY=+2`: усиление эксклюзивности положительно;
- `FINTECH_REGULATION=-2`: ужесточение fintech regulation отрицательно.

## 5. Promotion rule

common cause становится driver только если есть понятное направление воздействия и фактор применим минимум к двум компаниям/будущим кандидатам либо нужен Scenario Engine.

Поэтому `PREDICTION_MARKETS_REGULATION`, `PHARMA_LITIGATION`, `CONTRACT_CONVERSION_FAILURE` остаются failure mechanisms.

## 6. Обратная совместимость

Все 16 drivers v1.0 сохраняют ID и семантику. v1.1 — additive extension.

Patch содержит явные значения всех 16 новых drivers для 14 текущих моделей. После v1.1 отсутствие поля больше не трактуется как ноль: ноль должен быть записан явно.
