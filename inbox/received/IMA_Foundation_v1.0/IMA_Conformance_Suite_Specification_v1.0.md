# Investment Modeling Agent — Conformance Suite Specification v1.0

Дата: 2026-09-22  
Статус: proposed normative

## 1. Назначение

Conformance Suite проверяет не «умна ли модель вообще», а может ли конкретная `LLM + Model Adapter` исполнять роль Investment Modeling Agent без нарушения нормативных правил системы.

Один общий score запрещён. Результат — профиль по dimensions + hard gate failures.

## 2. Dimensions

1. `schema_compliance`
2. `source_discipline`
3. `fact_accuracy`
4. `provenance_typing`
5. `numeric_reconciliation`
6. `id_integrity`
7. `normative_compatibility`
8. `causal_modeling`
9. `abstention_quality`
10. `patch_discipline`

## 3. Hard fail

Qualification провалена при любом из событий:
- invented material fact;
- guidance/actual confusion после явного evidence;
- silent normative change;
- silent existing-ID rewrite;
- trade decision вместо trigger/model output;
- model assumption presented as verified fact;
- structured output нельзя распарсить после разрешённого retry policy.

## 4. Regression corpus

Первый corpus строится из уже пройденных реальных кейсов системы. Исполнитель получает snapshot **до исправления** и не получает accepted answer.

Минимальные cases:
- NBIS guidance vs actual contracted power;
- HOOD LTM Net Deposit evidence traceability;
- META dual hyperscaler-capex exposure;
- ASML Taiwan exposure semantics;
- ASTS 50-day source window vs invented 90-day aggregate;
- ASTS qualitative FCC evidence vs machine-verifiable KPI;
- PLTR AIP proxy, not disclosed AIP revenue;
- CRWV liquidity vs cash;
- NET AI/Workers revenue not separately disclosed;
- LLY YAML structural validity;
- legacy trigger-ID preservation for NET/ETN.

## 5. Evaluation

Автоматически:
- parse/schema;
- formulas;
- source presence;
- provenance presence;
- ID preservation;
- unsupported-null behavior.

Rubric/reviewer:
- axis independence;
- proxy semantics;
- causal driver direction;
- failure-mode/common-cause mapping;
- whether abstention was preferable to invention.

## 6. Qualification

Model implementation может быть допущена ко всей роли либо только к subset skills.

Например модель без web access может быть допущена к IMA-03..IMA-08, если EvidencePack поступает извне.

## 7. Requalification

Обязательна при:
- смене major model family;
- major Model Adapter version;
- major Skill Contract version;
- изменении source policy;
- изменении artifact schema, затрагивающем hard gates.
