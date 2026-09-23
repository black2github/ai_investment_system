# Reissue v1.1.2 / v1.0.2 — calibration notes

## Resizing по измеренным host σ

- `SPCX.Space.initial_growth`: factor = `0.571429`.
- `SPCX.margin.Y3`: factor = `0.625000`.
- `SPCX.valuation.Y5`: factor = `0.560748`.
- `NBIS.margin.ocf.Y3`: factor = `0.597015`.
- `NBIS.margin.capex.Y1`: factor = `0.487805`.
- `NBIS.margin.capex.Y2`: factor = `0.571429`.
- `NBIS.valuation.Y5`: factor = `0.560748`.
- `NVDA.margin.Y5`: factor = `0.645161`.
- `NVDA.valuation.Y5`: factor = `0.631579`.

Growth mappings, которые уже проходили MC-G5-013, не менялись.

## SPCX intrinsic widening

Центральные modes/anchors сохранены. Расширены только tails собственных growth/margin/valuation distributions.
Цель — устранить предупреждение `intrinsic W < 0.40` без передачи company-specific uncertainty в Joint Layer.

## Local robustness parameters
- SPCX: growth σref=0.2462, delta=0.0616; margin σref=0.0977, delta=0.0244; log-multiple σref=0.2904, move=[-0.0700,0.0753].
- NBIS: growth σref=0.3898, delta=0.0974; margin σref=0.1356, delta=0.0339; log-multiple σref=0.1682, move=[-0.0412,0.0429].
- NVDA: growth σref=0.1481, delta=0.0370; margin σref=0.0434, delta=0.0109; log-multiple σref=0.1576, move=[-0.0386,0.0402].

Эти perturbations materialized в существующих полях `robustness_tests`; `company_mc 2.3.0` менять не требуется.

## Host acceptance

Нужно повторить: schema/G5, MC-G5-013, intrinsic/full W, local robustness hard pass, absolute stress sensitivity diagnostic, full 500k deterministic run.
До host-run новые калибровки остаются candidate.
