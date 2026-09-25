# Сценарные прогоны 25.09.2026 — PRE-NORMATIVE DIAGNOSTICS (до Joint schema v1.1 и переизданий)

Статус: **не норматив**. Прогоны сделаны на движке joint_layer 1.2.1 с предварительной интерпретацией persistence_override
(prewhitening), которую IMMA заменила нормативной (innovation-level, реализована в 1.3.0 после этих прогонов); mapping компаний
без ACCELERATOR_PRICE_COMPETITION и с ошибочными знаками TAIWAN_SUPPLY у MSFT/META (каналы исключены только в отчёте coverage,
не в расчёте); INDUSTRIAL_RESHORING и ACCELERATOR_PRICE_COMPETITION — без корней (идиосинкратические). Повтор — после Joint
schema v1.1, Taxonomy v1.2.1 и пяти переизданий (заказ to_imma/scenario-engine-reissues.request.md). Вероятности сценариев
pending → смесь и ScenarioConcentration не считались; ниже — по-сценарные метрики и дельты к BASE.
Прогоны: `portfolio/_runs/20260925T1*-company_mc-*` (scenario в meta), портфельные 20260925T112016Z-portfolio_paths-7e689a (текущие веса) и
20260925T112022Z-portfolio_paths-fab7b9 (оптимум захода 4). 500k путей, общий seed 20260920, chunk 50000 (общие пути с BASE).

## Компании: медиана CAGR 5Y / P(loss>30 %) (в скобках — Δ медианы к BASE, п.п.)
| Компания | BASE | TAIWAN_SEIZURE | CHIP_COLD_WAR | неохваченные драйверы cold war |
|---|---|---|---|---|
| SPCX | -13.4 % / 68 % | -19.1 % / 81 % (-5.7) | -13.4 % / 68 % (+0.0) | ACCELERATOR_PRICE_COMPETITION, CHINA_REVENUE, INDUSTRIAL_RESHORING, SEMICONDUCTOR_WFE |
| NBIS | +20.7 % / 10 % | +7.1 % / 27 % (-13.5) | +21.0 % / 10 % (+0.3) | ACCELERATOR_PRICE_COMPETITION, CHINA_REVENUE, GOVERNMENT_DEFENSE, INDUSTRIAL_RESHORING, SEMICONDUCTOR_WFE |
| NVDA | +22.0 % / 1 % | -1.1 % / 38 % (-23.2) | +24.8 % / 1 % (+2.7) | ACCELERATOR_PRICE_COMPETITION, AI_CLOUD_PRICING, INDUSTRIAL_RESHORING |
| HOOD | -8.4 % / 58 % | -11.9 % / 72 % (-3.5) | -8.4 % / 57 % (+0.1) | ACCELERATOR_PRICE_COMPETITION, AI_CLOUD_PRICING, CHINA_REVENUE, DATA_CENTER_POWER, GOVERNMENT_DEFENSE, HYPERSCALER_CAPEX, INDUSTRIAL_RESHORING, SEMICONDUCTOR_WFE, TAIWAN_SUPPLY |
| RKLB | +3.9 % / 16 % | +5.4 % / 15 % (+1.4) | +5.6 % / 14 % (+1.7) | ACCELERATOR_PRICE_COMPETITION, AI_CLOUD_PRICING, CHINA_REVENUE, DATA_CENTER_POWER, HYPERSCALER_CAPEX, SEMICONDUCTOR_WFE, TAIWAN_SUPPLY |
| LLY | +8.1 % / 4 % | +6.7 % / 6 % (-1.4) | +7.7 % / 4 % (-0.4) | ACCELERATOR_PRICE_COMPETITION, AI_CLOUD_PRICING, DATA_CENTER_POWER, GOVERNMENT_DEFENSE, HYPERSCALER_CAPEX, INDUSTRIAL_RESHORING, SEMICONDUCTOR_WFE, TAIWAN_SUPPLY |
| META | +12.0 % / 3 % | +12.1 % / 3 % (+0.0) | +12.0 % / 3 % (-0.1) | ACCELERATOR_PRICE_COMPETITION, AI_CLOUD_PRICING, CHINA_REVENUE, GOVERNMENT_DEFENSE, INDUSTRIAL_RESHORING, SEMICONDUCTOR_WFE |
| ASML | -4.3 % / 39 % | -13.6 % / 72 % (-9.3) | -1.0 % / 28 % (+3.3) | ACCELERATOR_PRICE_COMPETITION, AI_CLOUD_PRICING, GOVERNMENT_DEFENSE |
| MSFT | +6.8 % / 7 % | +10.0 % / 4 % (+3.3) | +4.5 % / 11 % (-2.3) | ACCELERATOR_PRICE_COMPETITION, CHINA_REVENUE, GOVERNMENT_DEFENSE, INDUSTRIAL_RESHORING, INTEREST_RATES, SEMICONDUCTOR_WFE |
| PLTR | -1.6 % / 28 % | -0.3 % / 25 % (+1.3) | +0.4 % / 22 % (+2.0) | ACCELERATOR_PRICE_COMPETITION, AI_CLOUD_PRICING, CHINA_REVENUE, DATA_CENTER_POWER, HYPERSCALER_CAPEX, INDUSTRIAL_RESHORING, INTEREST_RATES, SEMICONDUCTOR_WFE, TAIWAN_SUPPLY |
| NET | -16.4 % / 84 % | -19.6 % / 89 % (-3.2) | -16.6 % / 84 % (-0.2) | ACCELERATOR_PRICE_COMPETITION, CHINA_REVENUE, DATA_CENTER_POWER, GOVERNMENT_DEFENSE, HYPERSCALER_CAPEX, INDUSTRIAL_RESHORING, INTEREST_RATES, SEMICONDUCTOR_WFE, TAIWAN_SUPPLY |
| ETN | +2.5 % / 17 % | +1.7 % / 20 % (-0.8) | +7.0 % / 10 % (+4.5) | ACCELERATOR_PRICE_COMPETITION, AI_CLOUD_PRICING, CHINA_REVENUE, GOVERNMENT_DEFENSE, INTEREST_RATES, SEMICONDUCTOR_WFE, TAIWAN_SUPPLY |
| ASTS | +0.9 % / 36 % | +2.1 % / 34 % (+1.3) | +1.8 % / 34 % (+0.9) | ACCELERATOR_PRICE_COMPETITION, AI_CLOUD_PRICING, CHINA_REVENUE, DATA_CENTER_POWER, HYPERSCALER_CAPEX, INDUSTRIAL_RESHORING, SEMICONDUCTOR_WFE, TAIWAN_SUPPLY |

## Портфель (5 лет)
- Текущие веса (95.5 % NAV перенормированы): BASE: +15.8 % / P(l30) 0.3 % / ES5 -10.2 % | TAIWAN_SEIZURE: +4.6 % / P(l30) 13.1 % / ES5 -51.1 % | CHIP_COLD_WAR: +17.0 % / P(l30) 0.3 % / ES5 -10.0 %
- Оптимум захода 4: BASE: +12.4 % / P(l30) 0.0 % / ES5 +10.2 % | TAIWAN_SEIZURE: +6.7 % / P(l30) 0.1 % / ES5 -14.6 % | CHIP_COLD_WAR: +13.5 % / P(l30) 0.0 % / ES5 +11.2 %

## Что видно уже сейчас (с оговоркой pre-normative)
- Силовой Тайвань бьёт по портфелю сильно, но заметно мягче разведочного постоянного сдвига: фазы с восстановлением дают
  медиану +4.6 % вместо +4.9 % в разведке при ES5 -51 %.
- Холодная война для текущего портфеля выглядит лучше базы — артефакт покрытия (у NVDA/NBIS/MSFT/META не охвачен канал ценовой
  конкуренции в ускорителях, у MSFT/META знаки TAIWAN_SUPPLY ошибочны) — до переизданий выводов не делать.
- Оптимум захода 4 устойчивее текущего портфеля к силовому сценарию (медиана +6.7 %, ES5 -15 %).
