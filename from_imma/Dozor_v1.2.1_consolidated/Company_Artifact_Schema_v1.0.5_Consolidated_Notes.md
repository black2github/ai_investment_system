# Company Artifact Schema v1.0.5 — Consolidated Republication

Версия runtime/file schema остаётся **1.0.5**.

Я не создавал v1.0.6: восстановление потерянного блока migration-history не меняет ни одну из пяти JSON Schema,
не меняет field_catalog/integrity semantics и не должно запускать бессмысленную повторную миграцию 17 папок.

Возвращён без изменения блок принятого v1.0.4:

`known_migrations_v1_0_3_to_v1_0_4`

с MIG-117…120:
- MIG-117 schema version 1.0.3 → 1.0.4;
- MIG-118 source recorded_at без fabricated backfill;
- MIG-119 legacy axis verification linkage;
- MIG-120 event verification linkage без fabricated historical run IDs.

MIG-121/122 и весь принятый v1.0.5 contract не изменены.

Подробная нормативная интерпретация MIG-122(a)–(c) находится в едином доме:
`Dozor_Verification_Protocol_v1.2.1.runtime_history`.
