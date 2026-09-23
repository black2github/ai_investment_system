# Joint Simulation Layer Rules v1.1.2 — Patch Notes

Delta от v1.1.1:

- milestone probability становится полноценной MC-G5-013 dimension:
  `sigma[aggregate logit shift] <= 0.35`, design headroom 0.25;
- milestone timing:
  `sigma[aggregate quarter shift] <= 1.0`, design headroom 0.75;
- milestone measurement выполняется в нативный момент применения engine, не на q20;
- первый live archetype-C reference RKLB (0.118/0.069 logit; 0.365/0.147 quarter) зафиксирован как conformance evidence;
- остальные growth/margin/multiple caps, measured-sigma rule, deterministic resize и dispersion bands не изменены.
