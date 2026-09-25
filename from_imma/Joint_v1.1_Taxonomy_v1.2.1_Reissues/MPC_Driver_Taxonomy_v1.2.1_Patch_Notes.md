# MPC Driver Taxonomy v1.2.1 — Patch Notes

Structural normalization only. Driver semantics are unchanged.

Intentional relocation:

`added_v1_2` → `drivers.added_v1_2`

The value is preserved verbatim, including `id`, `meaning`, and `promotion_reason` for `ACCELERATOR_PRICE_COMPETITION`.

For mechanical `check_supersedes`, the five old top-level paths under `added_v1_2` are the only intentional removals and must be explicitly allowed. They are replaced one-for-one under `drivers.added_v1_2`. No driver is deleted or renamed.
