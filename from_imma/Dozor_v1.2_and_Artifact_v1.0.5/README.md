# Dozor Verification Protocol v1.2 + Artifact Schema v1.0.5

Files:
- `Dozor_Verification_Protocol_v1.2.yaml`
- `Dozor_Verification_Protocol_v1.2.md`
- `Company_Artifact_Schema_v1.0.5.yaml`
- `Company_Artifact_Schema_v1.0.5_Patch_Notes.md`
- `verify-ASTS-v1.2-example.json`
- `verify-ASTS-v1.2-example.md`

Validation:
- NBIS live v1.1: PASS
- ASTS live v1.1: PASS
- v1.0 compatibility fixture: PASS
- ASTS full v1.2 example: PASS
- Artifact v1.0.5 verification history fixture: PASS
- new status/result metadata completeness: PASS
- Artifact field_catalog rows: 251

Note on v1.0 compatibility:
the current attachment contains the two live v1.1 reports. The exact historical v1.0 JSON was not present in this ZIP,
so backward compatibility with v1.0 was checked against a reconstructed v1.0-shape fixture derived from the accepted
v1.0 contract (KPI items + base summary, no axis/event/transition sections). The report schema accepts protocol_version
1.0.0/1.1.0/1.2.0.
