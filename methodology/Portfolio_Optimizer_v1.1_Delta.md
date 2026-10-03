# Portfolio Optimizer v1.0 → v1.1 — Delta

Партия 12. Full reissue по Calibration Lifecycle SemVer.

## Изменённые существующие строки
- title v1.0 → v1.1;
- date 2026-09-21 → 2026-10-03;
- §4 ScenarioConcentration: old warning >50 / hard 60 → warning >=60 / hard 70 по DR-2026-10-02-01/В2.

Все остальные непустые строки v1.0 сохранены дословно и в исходном порядке; новые §§14–19 добавлены после полного body.
- local text missing predecessor lines: **0**.

## Добавлено
- S_cond with p>=0.10 and B_s(w)>0 + conservative fallback without BASE paths;
- conditional ES5>=-40%, P30<=25%;
- cardinality 6..8 and min nonzero equity weight 3%;
- variants 6 / 8 / no-cardinality-limit;
- Theme Look-through owner constraint interface;
- feasibility order and output fields.

## Machine-readable schema
- removed predecessor leaf paths: **0**
- added leaf paths: **75**
- changed common scalar leaves: **4**
