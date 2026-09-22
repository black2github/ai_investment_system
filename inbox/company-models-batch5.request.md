# Для передачи другой LLM: партия 4 принята; заказ партии 5 — CRWV, правило AI_COMPUTE, расширение таксономии драйверов

Вставляется одним сообщением от «=== НАЧАЛО ===» до «=== КОНЕЦ ===».

=== НАЧАЛО ===

## Партия 4 (PLTR, ETN, ASTS) принята 21.09.2026
PLTR и ASTS разнесены по папкам без изменения содержания; ETN встроен в реестр владельца тем же приёмом, что NET:
legacy ETN-E-01..03 и X-01..03 сохранены с полем `axis` по вашему `binding_guidance`, семи переходам без ID присвоены
ETN-E-04..E-10. Приняты: ось AIP у PLTR как proxy (U.S. commercial revenue / TCV / RDV) с явной пометкой; ASTS как
pre-service-revenue; общие failure modes SPACE-кластера (RKLB / SPCX / ASTS) и `cross_portfolio_common_causes`;
поправка RKLB-KPI-08 → `90` + `lower_bound` применена.

## Результат сверки KPI партии 4 по первоисточникам
Сверка выполнена 21.09.2026 дозором по вашим source_url (релизы Q2 2026 exhibit 99.1 и 10-Q): **PLTR 10 из 10, ETN 10 из 10,
ASTS 10 из 10 — расхождений нет**. Контрольные цитаты: PLTR «U.S. commercial revenue grew 149% … to $764 million», RDV
$6.238B (+124%), TCV $3.373B, GAAP operating margin 47%, adjusted FCF margin 63%; ETN organic 14%, EA orders +41%, EA backlog
$15,175M (+33%), EG orders +33%, total debt $20,611M по вашей формуле; ASTS 13 аппаратов на орбите, backlog ≈ $1.30B, 60+ MNO,
Q2 revenue $31.5M, «has not recognized any revenues from the SpaceMobile Service», pro forma cash > $3.7B. Два замечания:
1. ASTS ось `Regulatory_Spectrum` (R2) опирается только на качественные свидетельства (FCC-авторизация 248 спутников, апрельские
   разрешения) без KPI — дозор не может отметить её подтверждённой. Просьба добавить KPI (например, число/доля авторизованных
   спутников или статус разрешений по юрисдикциям с источником) либо явно пометить ось `evidence_type: qualitative`.
2. ASTS-KPI-02 «6 запусков»: в реестре период «trailing 90 days», в источнике — «within 50 days»; число совпадает, период стоит
   привести к формулировке источника.

## Заказ партии 5 — последняя компания портфеля и два методологических пункта

### 5.1 CRWV (CoreWeave) — модель компании
| Тикер | Вес NAV | Просадка 12М | Сектор |
|---|---|---|---|
| CRWV | 0.5% | −43.1% | AI_COMPUTE (внешнего benchmark нет, решение v1) |

Формат — как в партиях 1–4. Контекст: CRWV — вторая позиция в секторе AI_COMPUTE после NBIS (33% NAV). Просьба строить
оси так, чтобы они были сопоставимы с NBIS (спрос/законтрактованность, юнит-экономика, мощность, капиталоёмкость,
финансирование/ликвидность) — это нужно для парного сравнения failure modes и для правила сектора ниже; расхождения
в структуре (например, концентрация клиентов у CRWV) — отдельной осью или KPI, не подгонкой под NBIS.

### 5.2 Правило сектора AI_COMPUTE (методология)
Вы предложили держать `benchmark_coverage=false` до методологии `AI_COMPUTE_BASKET`. NBIS + CRWV = 34% NAV без секторного
ориентира — это самая большая дыра в покрытии просадок портфеля. Просьба дать спецификацию v1.0: как измерять секторную
просадку для AI_COMPUTE без внешнего индекса (варианты: равновзвешенная корзина публичных GPU-облаков с составом и
правилами ребалансировки; либо прокси через смесь SOX/IGV с весами; либо признать сектор непокрываемым и учитывать это
в режимах Normal/Stress/Shock отдельным правилом). Нужны формула, состав, источник цен (Yahoo chart доступен),
и как это входит в `regime_engine` (Portfolio_Drawdown_and_Regime_Rules v1.0 §6).

### 5.3 Расширение таксономии драйверов MPC v1.1
`taxonomy_gap` возник дважды: LLY (HEALTHCARE_DEMAND, DRUG_PIPELINE, REIMBURSEMENT_PRICING, MANUFACTURING_CAPACITY,
PHARMA_REGULATION, PATENT_EXCLUSIVITY) и ETN (ELECTRIFICATION_GRID, UTILITY_CAPEX, INDUSTRIAL_RESHORING, AEROSPACE_CYCLE).
У HOOD и PLTR драйверы CAPITAL_MARKETS / GOVERNMENT_DEFENSE покрыли часть, но CONSUMER_CREDIT, PREDICTION_MARKETS_REGULATION,
CRYPTO_CYCLE остались только в `common_cause_id` failure modes. Просьба выпустить `driver_taxonomy` v1.1 для
Marginal_Portfolio_Contribution_Schema: список драйверов, правило «драйвер vs common_cause_id» (что куда), и патч
`driver_exposure_vector` для уже принятых 14 компаний (нули по новым драйверам допустимы, но должны быть явными).

=== КОНЕЦ ===
