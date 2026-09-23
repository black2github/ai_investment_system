# Онбординг «Инвестиции в ИИ-инфраструктуру»: таблица покрытия финального блока

Источник финального блока: https://chatgpt.com/share/6aabd184-f904-83ed-bc0e-2ebd7172c89b (17.09.2026).
Дата онбординга: 17.09.2026. Реестры: `portfolio/{etn,su,net,6506,6324,crwd}/triggers.yaml`,
лист идей `portfolio/_ideas.yaml`, сценарий `portfolio/_scenarios/taiwan.yaml`.

## A. Решение → реестры (meta)
| Компания | Статус | Вес | Куда |
|---|---|---|---|
| Eaton | покупать | 30% | etn/ (meta.status_in_basket, target_weight) |
| Schneider | покупать | 20% | su/ |
| Cloudflare | наблюдать до цены | 25% | net/ |
| Yaskawa | наблюдать до триггера | 20% | 6506/ |
| Harmonic Drive | наблюдать до триггера | 5% | 6324/ |
| Datadog, Okta, THK, Nabtesco, ABB | наблюдать | 0 | _ideas.yaml → watch (цены на 17.09) |
| Vertiv | отклонено по оценке | 0 | _ideas.yaml → ideas (условие возврата: valuation) |
| CrowdStrike | наблюдать | 0 | crwd/ (есть свои триггеры) |
| Hammond, Hitachi Energy India, GEV, Siemens Energy, Quanta | лист ожидания | 0 | _ideas.yaml → ideas с условиями возврата |
| Tempus, Recursion, Schrödinger | отклонено | | _ideas.yaml → rejected |

## B. Тезисы и «что ломает» → thesis.md + триггеры -X-
| Компания | Ломающие условия | id |
|---|---|---|
| Eaton | orders <10% 2Q; backlog <15% 2Q; guidance <7% | ETN-X-01..03 |
| Schneider | group <8% 2Q; Energy Mgmt <8% 2Q; Data Center не драйвер | SU-X-01..03 |
| Cloudflare | revenue <25% 2Q; large customers <20% 2Q; NRR <110% 2Q | NET-X-01..03 |
| Yaskawa | Robotics revenue <0% 2Q; Robotics orders <0% 2Q; orders <5% 2Q | 6506-X-01..03 |
| Harmonic | orders <10% 2Q; book-to-bill <1.0 2Q; robotics orders <0% 2Q | 6324-X-01..03 |

## C. Триггеры финального блока → id реестра
| Из блока | id реестра | Автоматизация | Примечание |
|---|---|---|---|
| NET-P-01..03 ($275/250/225) | NET-P-01..03 | aiinfra-price-watch | активны |
| NET-E-01 (revenue ≥35% 2Q) | NET-E-01 | report-check 30.10 | Q2 = первый квартал |
| NET-E-02 (large customers ≥25% 2Q) | NET-E-02 | report-check 30.10 | |
| NET-E-03 (≥3 AI-платформы на Workers) | NET-E-03 | aiinfra-news-watch | + условие >7.5 млн разработчиков и revenue ≥35% |
| NET-E-04 (NRR ≥115% 2Q) | NET-E-04 | report-check | |
| (AI-доля выручки: неизвестно) | NET-E-05 | report-check | без порога, сообщить факт раскрытия |
| ETN-P-01..03 ($400/375/350) | ETN-P-01..03 | aiinfra-price-watch | P-01 уже выполнен на старте |
| ETN-E-01..03 | ETN-E-01..03 | report-check | дата отчёта — dates-verify |
| SU-P-01..03 (€280/260/240) | SU-P-01..03 | aiinfra-price-watch | |
| SU-E-01..02, SU-E-03 (дата 29.10) | SU-E-01..03, SU-C-01 | report-check 30.10 | |
| 6506-E-01..03 | 6506-E-01..03 | report-check 10.10 | покупка только после E-01/E-02 |
| 6506-C-01 (09.10.2026) | 6506-C-01 | report-check 10.10 | |
| (гуманоиды, Китай — блок 2) | 6506-E-04, E-05 | news-watch / report-check | |
| 6324-E-01..03 | 6324-E-01..03 | report-check (дата — dates-verify) | |
| 6324-E-04 (Tesla ≥100k Optimus/год) | 6324-E-04 | aiinfra-news-watch | приоритет очень высокий |
| 6324-E-05 (≥10k роботов/год у производителя) | 6324-E-05 | aiinfra-news-watch | |
| 6324-C-01 (FY до 31.03.2027) | 6324-C-02 | planned | |
| CRWD-E-01..04 | CRWD-E-01..04 | report-check / news-watch | уровень входа не задан — вопрос владельцу |

## D. Вход и выход → триггеры -P- / -F- / -X-
| Компания | Вход | Фиксация | Выход | Дедлайн |
|---|---|---|---|---|
| Eaton | ETN-P-01..03 (+P-04 по P/E ≤30x, planned) | ETN-F-01..02 (planned: нужна капитализация) | ETN-X-01+02 | 2030 |
| Schneider | SU-P-01..03 | SU-F-01..02 (planned) | SU-X-01+02 | 2030 |
| Cloudflare | NET-P-01..03; правило Cloudflare-2021 → NET-P-04 (planned: нужна цена последней покупки) | NET-F-01..03 (planned) | NET-X-01..03 | 2030 |
| Yaskawa | 6506-P-01..03 (planned, после E-триггера) | 6506-F-01..02 (planned) | 6506-X-01+02 | 2030 |
| Harmonic | 6324-P-01..03 (planned, после E-триггера) | 6324-F-01..03 (planned) | 6324-X-01+02 | 6324-C-03: конец 2028 |

## E. Сценарии → `_scenarios/taiwan.yaml` (TAIWAN-S1/S2/S3), дозор — aiinfra-news-watch

## F. Календарь → -C- и one-shot задания
| Дата | Компания | Реестр | Задание |
|---|---|---|---|
| 09.10.2026 | Yaskawa Q2 FY2027 | 6506-C-01 | aiinfra-report-check-6506-2026q2 (10.10 09:00 МСК) |
| 29.10.2026 | Schneider Q3, Cloudflare Q3 | SU-C-01, NET-C-01 | aiinfra-report-check-su-net-2026q3 (30.10 09:00 МСК) |
| неизвестно | Eaton Q3, Harmonic Q2, CRWD, THK | ETN-C-01, 6324-C-01, CRWD-C-01 | aiinfra-dates-verify → затем one-shot |
| Q4 2026 | IFR World Robotics | — | не заведено (информационное) |

## G. Предпосылки → state.json.pending_verification (39 записей по 6 папкам) → aiinfra-facts-verify

## H. Лист идей → `_ideas.yaml` (5 идей с условиями возврата, цены Yahoo на 17.09.2026)
Расхождения цен «обсуждение vs Yahoo 17.09»: Siemens Energy €137.12 vs €141.30, Yaskawa ¥4 378 vs ¥4 299,
Harmonic ¥6 030 vs ¥5 970, Schneider €279.40 vs €284.40 — в реестрах оставлены цены обсуждения, в _ideas — Yahoo.

## I. Отклонено → `_ideas.yaml` rejected (Tempus, Recursion, Schrödinger; Vertiv — в ideas с условием)

## J. Открытые вопросы → кому
| Вопрос из блока | Кто закрывает |
|---|---|
| AI-доля Cloudflare | NET-E-05 при отчётах |
| Даты отчётов HDS, Eaton, THK, CRWD | aiinfra-dates-verify (задание) |
| Insider voting ETN/SU/6506/THK/Nabtesco | не заведено; при необходимости разовое задание |
| Доли рынка редукторов | не заведено (информационное) |
| Tesla Optimus / Figure / Agility / Unitree — только официальные раскрытия | зашито в 6324-E-04/05 и news-watch |
| Ограничения брокера по TSE / Euronext; допустимая доля валютного риска JPY/EUR | ВЛАДЕЛЕЦ |
| Уровень входа CRWD (в блоке не задан) | ВЛАДЕЛЕЦ / дозакрытие |

## Не перенесено (и почему)
- «Целевые веса» как правило ребалансировки — нет сущности портфеля (уровень портфеля отложен).
- Фиксация по капитализации (-F-) — planned: нужен источник капитализации (цена × акции в обращении); заводить после первой покупки.
- Условные уровни входа Yaskawa/Harmonic — planned до срабатывания E-триггеров, чтобы сторож не сработал сразу.
- Правило Cloudflare-2021 — planned: нужна цена последней покупки от владельца.
