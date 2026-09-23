# Investment Modeling Agent v1.0 — Foundation Package

Первая нормативная заготовка слоя **«как производятся артефакты»**.

## Состав

Роль и версия:
- `Investment_Modeling_Agent_Manifest_v1.0.md/.yaml`
- `Skill_Registry_v1.0.yaml`

Production contracts:
- `Workflow_State_Machine_v1.0.yaml`
- `Intermediate_Artifacts_Schema_v1.0.yaml`
- `Provenance_Schema_v1.0.yaml`
- `Skill_Runtime_Envelope_Schema_v1.0.yaml`
- `Artifact_Production_Manifest_Schema_v1.0.yaml`
- `Error_Taxonomy_v1.0.yaml`
- `Runtime_Quality_Gates_v1.0.yaml`

Model portability:
- `LLM_Capability_Contract_v1.0.yaml`
- `Model_Adapter_Contract_v1.0.yaml`

Conformance:
- `IMA_Conformance_Suite_Specification_v1.0.md`
- `Golden_Case_Catalog_v0.1.yaml`

Skills v1.0:
- IMA-01..IMA-08 в каталоге `skills/`.

Пока намеренно не входят IMA-09..13: RV/MC calibration, Joint Driver Mapping, Methodology Design, Artifact Migration.

Рекомендуемый первый conformance run: воспроизвести NBIS из snapshot до принятого исправления, не показывая исполнителю accepted result; затем ASML, ASTS, META, CRWV.
