# v1.2.1 Consolidation Validation Report

## Contract equality
- v1.2 output_report_schema SHA-256: `72700cce0678ab550e11a1d757de49beb2bc395bf1ed51f3932cb834d55452b9`
- v1.2.1 output_report_schema SHA-256: `72700cce0678ab550e11a1d757de49beb2bc395bf1ed51f3932cb834d55452b9`
- equality: **PASS**

Company Artifact v1.0.5: все пять embedded file schemas object-identical принятому v1.0.5.

`known_migrations_v1_0_3_to_v1_0_4`: object-identical принятому v1.0.4.

## Regression
- historical v1.0 NBIS: PASS
- live v1.1 NBIS: PASS
- live v1.1 ASTS: PASS
- full v1.2 ASTS example: PASS

## Registry
- KPI: 11
- axis: 5
- event: 6
- transition_result: 3
- все 25 имеют label_ru/runtime_verified/gate_effect/default_patch_required/semantics;
- enum схемы == registry codes.

## Draft 2020-12
- output_report_schema: PASS
- 5 embedded Company Artifact schemas: PASS
