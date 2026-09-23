# STATUS.md — точка возврата инвестиционного дозора

Обновлено: 2026-09-20 (сессия Claude Code «Агенты отслеживания инвестиционных событий», ветка-форк
от 17.09; замороженная ветка «портфель» УСТАРЕЛА — всё её содержимое здесь и в to_imma/).
Это статус-файл трека, аналог CRITICMARKUP_STATUS.md в рабочем проекте. Обновляется на вехах.

## ТОЧКА ВОЗВРАТА 2026-09-20: перед разбором переписки об уровне портфеля

Состояние на момент точки:
- работает дозор по 7 компаниям (spacex, etn, su, net, 6506, 6324, crwd): ценовые сторожа,
  новостной дозор 09:00/09:05, проверки по отчётам (one-shot 10.10 и 30.10), сводка 20:00,
  карточка по тикеру; вариант C (типы сообщений + маршруты) внедрён; ответы владельца
  «<ID>: сделано/отложено/отклонено» записываются в state.json (проверено на SPCX-C-01);
- открыто у владельца: ETN-P-01 (транш 1 Eaton) и SPCX-C-02 (транш DCA) — сделаны ли; брокер/TSE/лоты;
  доля валютного риска; уровень входа CRWD; капитализация (число акций из 10-Q) — не заведена;
- уровень портфеля: НЕ начат. Разбор WAR-ECONOMY — `notes/war-economy-2026-01-05.coverage.md`
  (5 расширений модели: portfolio.yaml, триггеры scope=portfolio, сценарий как пакет действий,
  статус idea + ретро-дозор, история версий; 5 вопросов владельцу).

Следующий шаг (договорённость 20.09): владелец даёт ссылку на длинную переписку с LLM о подходе к
поддержке портфеля (финальный вид в конце переписки). Я: (1) делаю суммарную вырезку финального
подхода в `notes/portfolio-approach.summary.md`; (2) разбор «ложится / требует расширения /
противоречит принятому»; (3) список доработок OpenClaw и агента для объединения уровней компаний и
портфеля; (4) блок идей для передачи другой LLM (готовый к вставке, как вопросник дозакрытия).
Решения по портфелю принимаются с опорой на эту точку + вырезку, не на полный текст переписки.

Выполнено 20.09: переписка прочитана выборочно (Constitution v1.0, сценарная сессия SPCX, интеграция с
OpenClaw, заголовки артефактов и таблиц). Артефакты в `to_imma/`: `portfolio-approach.summary.md`
(вырезка финального подхода), `portfolio-approach.assessment.md` (ложится / расширить / противоречит;
план из 8 доработок; 4 вопроса владельцу), `portfolio-approach.ideas-for-llm.md` (блок для вставки в
ChatGPT-проект). Главные развилки: какой список бумаг — портфель учёта (Core-10 vs корзина ИИ-инфра);
один дом методологии (git в workspace); расчётный движок на хосте (в контейнере нет numpy/pip).

Решения владельца 20.09 по развилкам: (1) состав портфеля НЕ решён — Core-10 это «кандидаты в поле
зрения», сначала методология, потом прогон всех кандидатов по ней (сомнения: CDNS и SNPS одновременно;
SNPS под давлением интеграции Ansys); (2) нормативный дом методологии — workspace агента под git,
ChatGPT-проект — площадка обсуждения; (3) расчётный движок — рекомендация Claude: код на хосте в
`engine/` (git), запуск в отдельном образе-сайдкаре в том же compose (см. ниже), т.к. планируется
перенос docker на другой хост; (4) SPCX — единственный объект внедрения вектора состояний.
Блок идей передан другой LLM 20.09; ждём её артефакты (states.yaml, kpis.yaml, Decision Request,
схема портфеля, контракт движка, согласование вселенной, пометки legacy).

Каркас расчётного движка поднят 20.09: сервис `calc` (контейнер `openclaw-calc`, образ
`openclaw-lab/invest-calc:0.1.0`, python 3.12 + numpy/pandas/scipy/fastapi) в `C:\openclaw-lab\calc\`
(Dockerfile, app.py, engine/{registry,selftest}.py, tests/, README.md), в compose: тот же named volume
в `/data`, код `./calc/engine` bind-mount read-only, uid 1000, сеть app_net 192.168.100.30 (имя `calc`),
порт хоста 127.0.0.1:18791. Проверено: /health с хоста и из контейнера OpenClaw; /run selftest seed=42
дважды даёт одинаковый результат; записи в `portfolio/_runs/` принадлежат node. Тесты движка на хосте
2/2. AGENTS.md: раздел «Расчётный движок». Изменения в C:\openclaw-lab НЕ закоммичены (коммит по запросу).
Следующее для движка: контракт и формулы от другой LLM → модели reverse valuation / условный MC / портфель.

Вектор состояний SPCX внедрён 20.09 (пилот): `portfolio/spacex/{states.yaml, kpis.yaml}` (из
`from_imma/SPCX_*_v1.0.yaml`), в triggers.yaml переходы E-10..E-33 (axis / transition / level /
period; негативные переходы и C1→C2 переведены E1→E2 — вопрос автору), у legacy E-триггеров поле axis,
шаг маршрута `vector`; state.json: scenario_state A2/B2/C1/D3/V4, state_transitions [], kpi_observations
(10 KPI Q2 2026), pending: число акций и TTM revenue. AGENTS.md: раздел «Вектор состояний компании и
переходы» (правила оценки, Decision Request, строка «Вектор» в карточке). invest-calc: модель
`valuation_multiple` (KPI-10; тест 5/5; SPCX ≈ 89.8x → red). Интеграционный тест: one-shot
`spacex-flight14-check` 23.09.2026 09:00 МСК (E-21 C1→C2 по первоисточникам → Decision Request);
spacex-news-watch дополнен переходами Starship. Для другой LLM: `to_imma/spcx-artifacts.feedback.md` +
исправленные states.yaml, kpis.yaml, `to_imma/spcx-triggers-E10-E33.yaml`. SpaceX report-check (Q3, дата
неизвестна) — ещё не заведён.

Ответ другой LLM на замечания (20.09, share 6aaff5e9…, реплика 177) ПРИНЯТ: E1 у негативных переходов —
ошибка, общее правило «любой подтверждённый переход — минимум E2» (внесено в AGENTS.md); поле `kpis` у
переходов — их следующий артефакт; число акций 13 181 779 945 (10-Q, 28.07.2026) и TTM revenue $23.044 млрд
(FY2025 + H1 2026 − H1 2025) подтверждены → kpis.yaml v1.2, KPI-10 = 87.35x (run
20260920T150722Z-valuation_multiple-b55b3b), pending_verification закрыты; спецификация reverse valuation
(шаги 1–5, V1..V5 как worst-case ≥2 из 3 — предварительно) → реализована в invest-calc как модель
`reverse_valuation` v0.1 (бисекция по g; тесты 4). Не заведено: `kpis`/`supporting_metrics` в triggers.yaml
(ждём артефакт), запуск reverse valuation по SPCX нормативно (нужны согласованные допущения: net debt,
discount rate, current FCF margin, terminal margin/multiple по состоянию вектора).

20.09 (вечер): патч `SPCX_triggers_kpis_patch_v1.1` применён — у E-10..E-33 поля `kpis`,
`calculated_metrics`, `notes_kpi`; разрывы E-10 (контракты), E-25 (выручка г/г), E-26 (capex/revenue) закрыты
`supporting_metrics` SPCX-METRIC-01..03 (kpis.yaml v1.3, значения Q2 по SEC). Спецификация
`Investment_System_Reverse_Valuation_Specification_v1.0.md` — в `methodology/` (первый файл нормативного дома
методологии). Движок `reverse_valuation` переписан под неё (v1.0.0; §6 без двойного учёта FCF_5, §7 equity без
вычета долга, §14 bracketed search + no_solution_within_bounds, §10 sensitivity, §12.1 без классификатора —
только проверка E-31/32/33 из текущего V). Тесты 11/11. Иллюстративный прогон SPCX с плейсхолдерами
(net debt 0, r 10%, текущая маржа −50%, terminal 15–25% / 25–35x): требуемый CAGR ≈ 80–95% — НЕ нормативно.
Ждём калибровку (§17): net debt из 10-Q, ставка, текущая FCF-маржа, диапазоны для A2+B2+C1+D3 — от
владельца/другой LLM. Изменения calc/ не закоммичены (reverse_valuation v1.0, тесты).

spacex-balance-verify (Sonnet, 20.09 18:27 UTC, доставлено): по 10-Q Q2 2026 — cash $93.522 млрд, marketable
securities $6.487 млрд, total debt $38.433 млрд (без finance leases $1.079 млрд) → чистый КЭШ $55.089 млрд;
H1 2026: OCF $3.466 млрд, capex $28.476 млрд, FCF −$25.010 млрд, FCF-маржа −200% (квартальных потоков в 10-Q
нет). Записано в state.json → calc_inputs.reverse_valuation (verified). Вывод для калибровки: текущая маржа −200%
делает линейную конвергенцию (§5) непригодной — нужна явная margin_transition_model от другой LLM. Коммит
calc/: 102ffe6. Ждём calibration_v1.0 (запрос владельцу выдан).

calibration_v1.0 (другая LLM, 20.09, принята владельцем): r 11% (стресс 9–14%), терминальная FCF-маржа
20/27/34%, мультипликатор 25/32/40x, траектория маржи two_phase_capex_normalization (Y1 −75%, Y2 −15%,
Y3 +10%, Y4 = 0.7×terminal, Y5 = terminal; Y0 факт — только наблюдение) — файл `portfolio/spacex/calibration_v1.0.yaml`,
исходник `from_imma/SPCX_calibration_v1.0.md`. Движок `reverse_valuation` 1.1.0: явная траектория margin_path
(тесты 13/13; НЕ закоммичено). ПЕРВЫЙ НОРМАТИВНЫЙ ПРОГОН SPCX (run 20260920T183913Z-reverse_valuation-ab1fb7,
цена $152.71, equity $2.013 трлн): implied 5Y revenue CAGR 76.3% (сетка 61–97%, по ставке 73–81%), 2031 revenue
$392 млрд, терминальный FCF $106 млрд, доля терминальной стоимости 99.96%; переходов оси Valuation нет — V4
сохраняется. Записано в state.json (calc_runs, evidence Valuation, info_log E1 → вечерняя сводка).
Открыто: связать узлы Y1–Y3 с наблюдаемыми KPI (capex, compute, revenue) — фальсификация допущения D3;
переходы оцениваются по базовому случаю (при крайних допущениях E-33 выполнялся бы) — правило подтвердить с LLM.

Ответ LLM на результат прогона (share 6ab02a9d…) ПРИНЯТ 20.09: (1) `terminal_value_share_of_pv` — диагностика
устойчивости (stable <0.80 / terminal_dependent / model_fragile ≥0.95), переходы не блокирует, при model_fragile
Decision Request обязан нести флаг риска модели и сетку; (2) переходы E-31..E-33 — только по базовому случаю
калибровки, ячейки сетки переходов не вызывают; (3) фальсификация D3 — recalibration-триггеры без смены
состояния: E-34/E-35 (контрольная точка Y1 30.06.2027), E-36/E-37 (Y2 30.06.2028), E-38 (факт FCF>0 два
квартала, Y3) — заведены в triggers.yaml (planned), пороги модельные; долг: зоны warning/fail для E-35/E-37.
Файл `methodology/Reverse_Valuation_Rules_v1.1.md`. Движок 1.2.0: model_stability + evaluation_case
(тесты 14/14; НЕ закоммичено). Прогон …-ab1fb7 в state.json помечен model_fragile.

Артефакты A и B от другой LLM (share 6ab02e97…, 20.09) ПРИНЯТЫ и развёрнуты: `portfolio/_portfolio.yaml` (схема v1.0,
позиции null — состав портфеля не утверждён; benchmarks: SOX для полупроводников, SOFTWARE/SPACE/AI_INFRA —
pending_owner_selection), `methodology/Portfolio_Drawdown_and_Regime_Rules_v1.0.md`, `portfolio/spacex/
mc_calibration_v1.0.yaml`, `methodology/SPCX_Conditional_Monte_Carlo_Specification_v1.0.md`. Движок: модели
`portfolio_regime` 1.0.0 (NAV, просадки 12M/NAV/сектор, coverage, режим Normal/Stress/Shock, лимиты) и
`conditional_mc` 1.0.0 (сегментный рост с mean reversion, узлы маржи с неопределённостью, копула ранговых
корреляций, антитетические пути, оценка Y3 по revenue-bridge / Y5, Y8 по FCF, OU-путь цены для max drawdown,
convergence 100k/250k/500k, robustness 8 возмущений); тесты 24/24; НЕ закоммичено (portfolio_regime,
conditional_mc, тесты, registry). ПЕРВЫЙ НОРМАТИВНЫЙ MC SPCX (run 20260920T191346Z-conditional_mc-861006,
500k, seed 20260920, 12.7 с): медианный CAGR 3/5/8Y = −22.7 / −14.9 / −3.8%; P(2x)=0; P(loss>30%) 97%;
ES5 −73%; медианная стоимость 2031 $0.9 трлн против $2.0 трлн; сходимость стабильна; robustness pass (все знаки
отрицательные). Интерпретации движка I1–I4 (общий ранг g_init/g_long, общий ранг мультипликаторов, margin_improvement
как общий ранг узлов, OU-путь цены) — на подтверждение автору. Расхождение RV (76% требуемого роста) и MC —
ключевой сигнал системы, не торговый. Открыто у владельца: состав портфеля и позиции, выбор секторных индексов.

Коммит lab 6686dd1 (portfolio_regime 1.0.0 + conditional_mc 1.0.0, тесты). Обратная связь по MC передана
(`to_imma/spcx-mc-run1.feedback.md`, с разделом согласования о составе портфеля). ВЛАДЕЛЕЦ 20.09: прежний Core-10 —
гипотеза, а не вход; даже согласованный состав проверяется системой (пример SNPS: интеграция Ansys, долг).
ОТВЕТ LLM (share 6ab03704…, реплика 201) ПРИНЯТ и развёрнут: `portfolio/_portfolio.yaml` → v1.1 (блок
`initial_portfolio_hypothesis`: AVGO 15 / NVDA 15 / KLAC 14 / ASML 11 / SPCX 10 / SNPS 8 / RKLB 8 / CDNS 7 /
MSFT 7 / NBIS 5 %, use_as_optimizer_input=false, анти-якорное правило, ex-post сравнение; `owner_confirmation:
pending` — список воспроизведён LLM по прежней переписке, владелец подтверждает), `methodology/
Marginal_Portfolio_Contribution_{Specification,Schema}_v1.0` (конвейер Candidate → Company Model → Valuation →
Conditional MC → MPC → Optimizer → Stability Test → Core/Challenger → target weights; MPC — вектор, не score;
таксономия 16 драйверов; парный эксперимент +SNPS / +CDNS / +оба → `redundant_exposure`). Решения LLM по MC:
(1) RV↔MC gap — два диагностических показателя, без авто-перехода V: RV_Growth_Gap = implied CAGR RV −
медианный CAGR выручки MC 5Y; Price_Expectation_Gap = текущая стоимость / дисконтированная медианная стоимость
MC 5Y; (2) I1–I5 НЕ подтверждены молча — формализовать в MC v1.1 после Flight 14 (I1 и I2 встраивают
persistent growth и устойчивый valuation regime); (3) 3Y помечать `bridge_dependent: true` — СДЕЛАНО в движке
(conditional_mc 1.0.1, поле return.CAGR_3Y_bridge_dependent; не закоммичено). Очередь методологии после
23.09: MC v1.1 (I1–I5 + gap + robustness + bridge) → SNPS state/KPI layer → обобщение движка MC (сегменты из
калибровки) → парный эксперимент SNPS/CDNS. Открыто у владельца: подтвердить prior-список и веса; выбор
секторных индексов; фактические позиции (отдельно от prior).

ВЛАДЕЛЕЦ 20.09 (поздно): prior-список и веса ПОДТВЕРЖДЕНЫ (`owner_confirmation: confirmed`); коммиты lab 6686dd1,
250fb0d (MC 1.0.1). SPCX частично докуплен по рекомендации дозора (SPCX-C-02) — дата/количество ещё не получены.
ПУТЬ (решение владельца): (1) фактический портфель «как есть» — анализ по тем же правилам (portfolio_regime +
конвейер по компаниям); (2) пул кандидатов = prior Core-10 + корзина ИИ-инфраструктуры 17.09 (ETN, SU, NET, 6506,
6324, CRWD) + ideas/watch из `_ideas.yaml`; число бумаг ограничено (лимит — владелец), остальное интересное — постоянный
мониторинг. Сделано: `portfolio/_candidates.yaml` v1.0 (пул 16 + ссылка на _ideas, стадии конвейера, sector_id
provisional), `notes/positions-input.template.yaml` (шаблон ввода фактических позиций/кэша/решений по триггерам —
отправлен владельцу). Ждём: заполненный шаблон → positions/cash в `_portfolio.yaml`, owner_decision SPCX-C-02
в state.json, первый прогон portfolio_regime (SOX покрывает только SEMICONDUCTORS, остальные — coverage flag).
Для компаний пула кроме SPCX нет states/kpis/калибровок — заказывать у LLM после MC v1.1, партиями (сначала
фактические позиции, затем пары SNPS/CDNS).

ВЛАДЕЛЕЦ 20.09 (ночь): сделки SPCX 17.09.2026 — 4 × $155.05 и 4 × $155.02 (8 акций) → `_portfolio.yaml` positions
(лоты), `state.json` SPCX-C-02 owner_decision «сделано частично», decided_at 20.09; у C-01 пометка «уточнить, закрывает
ли покупка 17.09 первый транш». Лимит числа бумаг — решение отложено; ограничения записаны в `_portfolio.yaml` →
constraints.owner_constraints (ментальная нагрузка частного инвестора; капитал не позволяет хеджировать опционами —
лот пута 100 акций). Секторные индексы: проверена доступность в Yahoo chart — ^SOX, IGV, UFO, ARKX, GRID, BOTZ,
ROBO, XLK; предложение владельцу: SOFTWARE→IGV, SPACE→UFO, AI_INFRASTRUCTURE разбить (электрификация GRID,
робототехника ROBO) — ждём решения, схему не менять до него. Владелец подтвердил: свой самостоятельно собранный
портфель прогоняется через тот же анализ, модели компаний заказываются у LLM по каждой бумаге. ЖДЁМ полный
список фактических позиций и кэша (шаблон notes/positions-input.template.yaml) — пока известна только SPCX.

## ТОЧКА ВОЗВРАТА 2026-09-21 (ночь): фактический портфель владельца загружен, первый прогон режима
Владелец передал портфель: два счёта (P1, P2 — разные брокеры/страны), 16 бумаг + SPCX (8 акций, счёт не указан),
кэш P1 $897.91, кэш P2 неизвестен; дробные количества — вероятно реинвестирование дивидендов. Записано в
`portfolio/_portfolio.yaml` (accounts, positions с market price 18.09 + 12M max из Yahoo chart, cash). Benchmark'и
приняты владельцем 21.09: SOFTWARE→IGV, SPACE→UFO, ELECTRIFICATION→GRID, ROBOTICS→ROBO (AI_INFRASTRUCTURE разбит);
новые сектора из портфеля — AI_COMPUTE (NBIS, CRWV), INTERNET_PLATFORMS (META, предложен XLC), HEALTHCARE (LLY, XLV),
FINTECH (HOOD, ARKF) — pending_owner_selection; GOLD (GLD) вне секторного слоя. Правило: сектор = с чем движется цена,
тема (ИИ-инфра) = driver_exposure_vector в MPC — ответ на вопрос владельца про CRWD/NET/PLTR.
ПЕРВЫЙ ПРОГОН portfolio_regime (run 20260920T210151Z-portfolio_regime-b472bc, цены 18.09): NAV $180 718 (без кэша P2);
режим STRESS (широта 31% бумаг ≥25% просадки; взвешенная секторная −19.3% при покрытии 35%); Shock нет (19% ≥40%:
RKLB −57%, ASTS −56%, CRWV −43%). Концентрация: NBIS 33.4%, NVDA 21.5%, HOOD 14.4% = 69% NAV. Результат —
`_portfolio.yaml` → machine_outputs, nav_history (первый снимок; просадка портфеля 0 по построению).
SPCX-C-01 закрыт («сделано», покупка 17.09; triggers.yaml status done), C-02 «сделано частично»; route остаётся opening.
`portfolio/_candidates.yaml` v1.0: пул 25 записей (prior Core-10 + корзина ИИ-инфры + 8 фактических позиций вне них,
held/weight_nav; ссылка на _ideas). Заказ моделей компаний для LLM — `to_imma/company-models-batch1.request.md`
(13 компаний по весу: NBIS, NVDA, HOOD, LLY, META, ASML, RKLB, MSFT, NET, PLTR, ETN, ASTS, CRWV; states/kpis/E-триггеры/
failure modes + driver_exposure_vector; калибровки RV/MC — после MC v1.1). Отправлен владельцу для передачи.
Открыто у владельца: кэш P2; счёт SPCX; benchmark'и для AI_COMPUTE/INTERNET/HEALTHCARE/FINTECH; лимит числа бумаг.
Очередь дозора: еженедельный снимок portfolio_regime (автоматизация не заведена — цены + benchmark'и через Yahoo chart,
POST /run, запись nav_history); карточка портфеля в Telegram; 23.09 Flight 14 → E-21.

ВЛАДЕЛЕЦ 21.09 (ответы): кэш P2 = 0; SPCX в P1; XLC/XLV/ARKF приняты → `_portfolio.yaml` обновлён, пересчёт снимка 18.09
(run 20260920T212852Z-portfolio_regime-fe89a2): NAV $180 718, режим STRESS (широта 31%), взвешенная секторная −17.0%,
покрытие benchmark 63.7% (без покрытия: NBIS/CRWV — AI_COMPUTE, решение LLM «внешнего benchmark нет» принято; GLD).
ПАРТИЯ 1 МОДЕЛЕЙ КОМПАНИЙ (другая LLM, share 6ab04f22…, файлы в from_imma/*_company_state_v1.0.yaml) ПРИНЯТА
и разнесена по папкам portfolio/nbis, nvda, hood: states.yaml (5 осей каждая), kpis.yaml (10 KPI, verified: false),
triggers.yaml в формате реестра (step vector, status planned — дозор событий не заведён), mpc_inputs.yaml (вектор
экспозиций + failure modes), thesis.md (позиция унаследована, тезис владельца не записан), state.json (scenario_state
verified: false). Векторы: NBIS N3+E3+C3+K3+F2; NVDA D4+M3+B4+S2+X2; HOOD S3+R3+P3+C1+G2. Оговорки LLM: K3 у NBIS —
prepayment coverage 50–60% только для когорты сделок Q2; NVDA supply commitments/annualized revenue 0.725x — модельная
метрика. Вечерняя сводка (0e661c05) обходит и новые папки. Заведено one-shot задание batch01-facts-verify (Sonnet,
fallback Opus, старт через 2 мин): сверка каждого KPI по source_url → kpi_observations, scenario_state.verified.
LLM: следующие партии по 3 — LLY+META+ASML, RKLB+MSFT+NET, PLTR+ETN+ASTS, CRWV отдельно (с правилом AI_COMPUTE).
Очередь: результат сверки → при расхождениях вернуть LLM; заказ партии 2 (LLY, META, ASML); дозор событий по
триггерам новых папок (news-watch — после подтверждения владельцем стоимости); еженедельный снимок режима.

СВЕРКА ПАРТИИ 1 (задание batch01-facts-verify, Sonnet, ~1 мин + досверка с хоста): NVDA 10/10 (6 KPI досверены с хоста:
web_fetch отдал 10-Q обрезанным, sec.gov без User-Agent → 403; правило добавлено в AGENTS.md «Проверка по отчёту»);
NBIS 9/10 — KPI-08 расхождение (5 GW цель YE2026, не >5; C3 на границе) → вопрос LLM; HOOD 9/10 — KPI-03 (LTM Net
Deposit growth 24%) не найден в тексте IR-релиза → вопрос LLM. Оси verified в state.json выставлены. Заказ партии 2
(LLY, META, ASML) с результатом сверки — `to_imma/company-models-batch2.request.md`, отдан владельцу.

ПАРТИЯ 2 (другая LLM, share 6ab0c77f…, 21.09 утро) ПРИНЯТА: папки portfolio/lly, meta, asml (5 осей, 10 KPI, 10–11
триггеров, mpc_inputs). Векторы: LLY D4+P3+M2+R3+F3; META A3+U2+P2+C3+R3 (HYPERSCALER_CAPEX = −2, AI_COMPUTE_DEMAND = +2 —
двусторонность через два драйвера); ASML D3+E3+M3+X1+I3 (первичный стандарт — US GAAP, KPI 05–09 из Statutory Interim
Report IAS 34, у KPI поля source_channel/sec_mirror/ir_document; TAIWAN_SUPPLY +2 в смысле demand/customer-geography;
bookings Q2 не выдуманы — D3→D4 ждёт наблюдения). LLY: taxonomy_gap — 16 драйверов MPC не покрывают healthcare
(нули ≠ отсутствие риска). Формат LLM сместился (states.axes / kpis.items / triggers.items; в LLY синтаксическая
ошибка note внутри списка taxonomy_gap — исправлена при приёме) → конвертер обобщён: scratchpad/_apply_batch.py.
ПОПРАВКИ ПАРТИИ 1 (batch_01_source_corrections_v1.0.yaml) ПРИМЕНЕНЫ: NBIS KPI-08 → «Year-end contracted power target»
5.0 GW guidance (verified как guidance), добавлен KPI-11 (факт, pending), ось Capacity_Secured → pending_verification
(prior C3), триггеры оси — по KPI-11; HOOD KPI-03 24% подтверждён по месту в августовском релизе → Customer_Asset_Scale
verified. Вечерняя сводка обходит 13 папок. Заведено batch02-facts-verify (0ae2e17f…, curl -A по правилу AGENTS.md).
СВЕРКА ПАРТИИ 2 (batch02-facts-verify, Sonnet, curl -A по правилу): LLY 10/10, META 10/10, ASML 10/10, все 15 осей
verified; выборочная проверка с хоста (Mounjaro $9,943M в релизе) сходится. Заказ партии 3 (RKLB, MSFT, NET) с
результатом сверки — `to_imma/company-models-batch3.request.md`, отдан владельцу. Очередь: приём партии 3 (конвертер
_apply_batch.py + AXIS_RU для новых осей; NET — привязать существующие NET-E-* к осям, не заменять) → сверка → партия 4
(PLTR, ETN, ASTS) → CRWV с правилом AI_COMPUTE; параллельно — MC v1.1 после Flight 14 (23.09).

ПАРТИЯ 3 (share 6ab0ce43…, 21.09) ПРИНЯТА: portfolio/rklb (E2+N1+S3+B3+C2: Electron / Neutron / Space Systems /
backlog / капитал-интеграция; failure modes с общими причинами SPACE — LAUNCH_VEHICLE_DEVELOPMENT_FAILURE и др.),
portfolio/msft (A4+S1+C3+M3+R3; HYPERSCALER_CAPEX −2 при AI_COMPUTE_DEMAND +2 и CLOUD_SOFTWARE_DEMAND +2), NET —
ВСТРОЕНО в реестр владельца 17.09 (scratchpad/_apply_net.py): states/kpis/mpc_inputs новые; в triggers.yaml добавлен
шаг маршрута vector, legacy NET-E-01..05 / X-01..03 привязаны к осям (axis, kpis по binding_guidance LLM), переходы
NET-E-06..E-11 (ID присвоил дозор — LLM дала без ID); state.json дополнен scenario_state (G3+N3+R3+P1+A1);
NET-KPI-08/09 (Workers AI) — null/not_separately_disclosed, verified: null. Вечерняя сводка обходит 15 папок.
Заведено batch03-facts-verify. Черновик заказа партии 4 (PLTR, ETN, ASTS) — to_imma/company-models-batch4.request.md.
Позиции без модели после партии 4: CRWV (отдельно, с правилом AI_COMPUTE), GLD/UFO (не компании), SPCX (есть).

СВЕРКА ПАРТИИ 3: задание batch03-facts-verify УПАЛО — OpenRouter 402 (кредиты: $16 всего, ~$14.9 использовано, ~$1.1
осталось; fallback Opus не спас — тот же ключ). Сверено С ХОСТА (curl -A, документы целиком): RKLB 10/10, MSFT 10/10,
NET 7/7 (+3 не раскрываются), все 15 осей verified; записано в state.json с verified_by host-check. Замечание LLM: RKLB-KPI-08
«>90» строкой → число + lower_bound. AGENTS.md: у exec параметр timeoutSeconds (агент слал timeout). Заказ партии 4
(PLTR, ETN, ASTS) с результатом сверки — `to_imma/company-models-batch4.request.md`, отдан владельцу. БЛОКЕР: пополнить
OpenRouter — иначе все агентские задания (news-watch 09:00/09:05, сводка 20:00, Flight 14 23.09 09:00) падают по 402.

OpenRouter ПОПОЛНЕН владельцем 21.09 (утро). ПАРТИЯ 4 (share 6ab0d288…, 21.09) ПРИНЯТА: portfolio/pltr (C3+G3+I1+P3+R3;
AIP revenue не раскрывается — ось US_Commercial_AIP_Monetization на proxy U.S. commercial revenue/TCV/RDV; GOVERNMENT_DEFENSE +2),
portfolio/asts (D2+C3+M1+R2+F2; pre-service-revenue, не pre-revenue: $31.5M Q2 — gateway/госконтракты, SpaceMobile
Service revenue = 0; failure modes общие со SPACE-кластером RKLB/SPCX, cross_portfolio_common_causes), ETN — ВСТРОЕНО в
реестр владельца 17.09 (_apply_merge.py, обобщение _apply_net.py): legacy ETN-E-01..03 / X-01..03 привязаны к осям
(orders/backlog → Electrical_Americas_Demand, guidance → Organic_Growth), добавлены ETN-E-04..E-10; вектор A3+G3+O3+M3+I2;
taxonomy_gap ETN (ELECTRIFICATION_GRID, UTILITY_CAPEX, INDUSTRIAL_RESHORING, AEROSPACE_CYCLE) — второй сигнал (после LLY),
что 16-драйверная таксономия MPC узка. RKLB-KPI-08 → 90 + lower_bound (kpis v1.1). Сводка обходит 17 папок. Заведено
batch04-facts-verify. Черновик заказа партии 5 (CRWV + правило AI_COMPUTE + расширение таксономии) — to_imma/company-models-batch5.request.md.
После партии 5 модели есть у ВСЕХ компаний портфеля (16 бумаг: 14 компаний + GLD, UFO).
СВЕРКА ПАРТИИ 4 (batch04-facts-verify, Sonnet, после пополнения OpenRouter): PLTR 10/10, ETN 10/10, ASTS 10/10; 14 из 15 осей
verified — ASTS Regulatory_Spectrum без KPI (только качественные свидетельства) → вопрос LLM; ASTS-KPI-02 период 90 vs 50 дней.
Заказ партии 5 (CRWV + правило AI_COMPUTE §6 + driver_taxonomy v1.1) с результатом — `to_imma/company-models-batch5.request.md`,
отдан владельцу.

## ТОЧКА ВОЗВРАТА 2026-09-21 (день): партия 5 принята — модели есть у всех 14 компаний портфеля
ПАРТИЯ 5 (share 6ab134dd…, 21.09) ПРИНЯТА: portfolio/crwv (D3+E3+C2+K2+F2, оси сопоставимы с NBIS; Q2 revenue $2.575B +112%,
adj. EBITDA margin 59% при adj. operating margin 5% и GAAP −2%, backlog ≈ $104.2B, active power 1.5 GW, contracted ≈ 4.2 GW на
11.08, total debt $35.6B, liquidity $15.55B из них $10.0B кредитные линии; концентрация 3 клиента = 72% выручки — KPI-03 +
failure mode). МЕТОДОЛОГИЯ: (1) AI_COMPUTE_BASKET_V1 — внутренняя равновзвешенная корзина NBIS 50 / CRWV 50, квартальная
ребалансировка, chain-link, adjusted close Yahoo; benchmark_coverage true, quality provisional_low_breadth (≥4 компонентов
для полного); concentration override — floor Stress при весе ≥20% и dd ≤−25%, Shock при ≥25% и ≤−40% (model_assumption,
без двойного счёта); SOX/IGV-прокси отвергнут (methodology/AI_COMPUTE_*). (2) MPC_Driver_Taxonomy v1.1 — 16 старых + 16
новых драйверов, правило driver (знак −2..+2 при усилении фактора) vs common_cause_id (механизм, без знака), promotion rule;
патч v1.1 применён к 14 mpc_inputs.yaml (все новые поля явно, нули записаны); у SPCX mpc_inputs.yaml НОВЫЙ и НЕПОЛНЫЙ —
только 16 новых драйверов, v1.0-вектора и failure modes у SPCX никогда не было → заказать. Схема MPC v1.0 не переписана,
заголовочная пометка о замене таксономии. (3) ASTS patch v1.1: Regulatory_Spectrum evidence_type qualitative_primary_source,
KPI-02 «within disclosed 50-day window», KPI-11 бинарный статус FCC (E-08 по нему). ДВИЖОК (НЕ закоммичено): synthetic_basket
1.0.0 (chain-link корзина, carry-forward ≤1 день иначе degraded; 4 теста) и portfolio_regime 1.1.0 (sector_overrides → floor,
regime_base/regime_floors_applied/benchmark_quality; тест); всего 29/29. ПРОГОН 3 (run 20260921T135230Z-portfolio_regime-28b2b3,
корзина …-95de5e: индекс 1222.7, max 12M 1641.4, просадка −25.5%): покрытие benchmark 97.8% (без покрытия только GLD),
взвешенная секторная −19.9%, база Stress (широта 31%), floor Stress по AI_COMPUTE (вес 33.9%, dd −25.5%) → STRESS.
Сводка обходит 18 папок. Заведено batch05-facts-verify (CRWV + ASTS-KPI-11). Конвертеры: _apply_batch.py (новые папки),
_apply_merge.py (реестры владельца NET/ETN), _apply_batch05.py (патчи). Очередь: результат сверки → заказ SPCX MPC-inputs
v1.0 + план следующего этапа (MC v1.1 после Flight 14 23.09 → калибровки RV/MC партиями по 3 по весу → MPC-прогоны →
оптимизатор); дозор событий по vector-триггерам 14 компаний (news-watch — стоимость, решение владельца); еженедельный
снимок режима (автоматизация с корзиной).
СВЕРКА ПАРТИИ 5: CRWV 10/10, ASTS-KPI-11 ✓ (Regulatory_Spectrum verified). Итого 14 компаний / 141 KPI подтверждены.
Следующий запрос LLM (SPCX mpc_inputs v1.0 + план этапа калибровок/MPC) — `to_imma/next-stage.request.md`, отдан владельцу.
Коммит lab 785b973 (synthetic_basket 1.0.0 + portfolio_regime 1.1.0 + тесты). ВЛАДЕЛЕЦ 21.09: дозор новостей — только NBIS,
NVDA, HOOD → задание models-news-watch (ежедневно 09:10 МСК, Sonnet, fallback DeepSeek; событийные переходы по новостям,
Decision Request по AGENTS.md); в triggers.yaml трёх папок: automations models-news-watch (событийные: NBIS-E-06, NVDA-E-11,
HOOD-E-09/E-11 — status active) и models-report-check (квартальные — planned, задание не заведено). Тестовый прогон 21.09 17:00 МСК:
ok, 33 с, ответ NO_REPLY (состояний не меняющих новостей нет), доставка подавлена как silent — штатно. Первый плановый прогон 22.09 09:10.

ОТВЕТ LLM НА ПЛАН (share 6ab13b5b…, 21.09 вечер) ПРИНЯТ: (1) SPCX_mpc_inputs_v1.0 — полный вектор 32 драйверов
(AI_COMPUTE_DEMAND/DATA_CENTER_POWER/TAIWAN_SUPPLY/LAUNCH_ECONOMICS/SATELLITE_CONNECTIVITY/GOVERNMENT_DEFENSE +2,
SPACE_REGULATION −2, HYPERSCALER_CAPEX +1 — двусторонний), 12 failure modes, cross_portfolio_common_causes с RKLB/ASTS/NBIS/CRWV
→ portfolio/spacex/mpc_inputs.yaml (status complete; значения 16 новых драйверов совпали с патчем v1.1). (2) ПОРЯДОК
ЭТАПА (поправка LLM): Optimizer v1.0 + Stability Test v1.0 — ПАРАЛЛЕЛЬНО с MC v1.1, до первого MPC-прогона (MPC v1.0
берёт tested_weights из optimizer_allowed_range); калибровки RV/MC — ПО 2 КОМПАНИИ: NBIS+NVDA → HOOD+LLY → META+ASML →
RKLB+MSFT → NET+PLTR → ETN+ASTS → CRWV; перед ними — ТРИ АРХЕТИПА MC-калибровки: mature_positive_margin (NVDA, LLY, META,
MSFT, PLTR, ETN, HOOD; NET/ASML — модифицированный), capital_intensive_transition (NBIS, CRWV, SPCX),
pre_service_or_milestone_driven (ASTS, RKLB/Neutron); I1–I5 → общий латентный фактор + неполно коррелированные шоки по
горизонтам/узлам (не один ранг); MPC-пилот на портфеле — как только готовы NBIS+NVDA+HOOD, не дожидаясь 13.
Последовательность: 23.09 Flight 14 → MC v1.1 ‖ Optimizer+Stability → калибровки по 2 → MPC по мере готовности → полный
Optimizer → кандидаты вне портфеля и пара SNPS/CDNS. Ответ владельцу/LLM — to_imma/plan-accept.request.md (архетипы и
Optimizer можно заказывать до 23.09).

## ТОЧКА ВОЗВРАТА 2026-09-21 (вечер): методология этапа MPC/Optimizer получена
ПАКЕТ (share 6ab13dcb…) ПРИНЯТ и развёрнут в methodology/ (16 файлов): (1) MC_Calibration_Archetypes v1.0 — три
архетипа (A mature_positive_margin: маржа m_t = m_term + (m_0 − m_term)·2^(−t/hl) + шок, Y0 — anchor; B
capital_intensive_transition: direct_fcf_nodes | ocf_capex_decomposition, Y0 не anchor, Y3 revenue_bridge + fallback при
отрицательном FCF Y5; C pre_service_or_milestone_driven: слой вех с условными вероятностями, piecewise valuation с
valuation_basis per path), запрет общего ранга → латентный фактор + идиосинкратический шок (loading), anti-circularity §10,
карта 14 компаний (SPCX/NBIS/CRWV — B; NVDA/HOOD/LLY/META/ASML/MSFT/NET/PLTR/ETN — A с модификаторами; RKLB/ASTS — C).
(2) Portfolio_Optimizer v1.0 — лексикографическая цель (max median CAGR 5Y → ES5 → Scenario Concentration → turnover,
tolerance 0.5 п.п.), рекомендуемые лимиты pending_owner_approval (single 20%, sector 30%, top-3 50%, common-cause 35%,
Challenger 8/25%, dry powder 5–10% Normal / до 20% Stress / до 30% Shock, illiquid 10/5%, P(loss>30%) ≤20%, P(loss>50%)
≤10%, ES5 ≥ −55%, ScenarioConcentration ≤60%), infeasible без авто-ослабления, MPC-диапазон 0–20% шаг 1 п.п. (+0.5 локально)
без prior-якоря, совместные MC-пути (не сумма медиан), двухстадийное исполнение (continuous → execution allocator по
2 счетам с лотами; hedgeable_shares = floor(n/100)·100, без округления позиции до 100). (3) Portfolio_Stability_Test v1.0
— возмущения (return ±3/±5 п.п., корреляции ±0.10/±0.15, вероятности сценариев ×0.75/1.25 + adverse +10 п.п., терминальные
±20% / ±5 п.п. / вехи ±10 п.п., driver knockout при weighted |exposure| ≥0.30, leave-one-out ≥5%), OFAT + LHS 500,
inclusion stable ≥80% / conditional 50–80% / unstable <50%, weight spread ≤ max(4 п.п., 50% веса), портфель: feasibility
≥95%, turnover медиана ≤25% / P90 ≤50%; MPC robustness ∈ {improves, neutral, worsens, unstable}.
В _portfolio.yaml: constraints.proposed_limits_v1_0 (pending_owner_approval) + constraint_gap_vs_current: NBIS 33.4% и NVDA
21.5% > 20%; top-3 69.3% > 50%; AI_COMPUTE 33.9% > 30%; кэш 0.5% < 5%. В _candidates.yaml: mc_archetype у 14 компаний.
ДВИЖОК: реализация optimizer/stability невозможна до совместных MC-путей (общий сценарный/латентный слой между
компаниями — в спецификациях пока нет определения cross-company latent factors и driver→parameter mapping для knockout) →
вопросы LLM в to_imma/methodology-review.request.md. Порядок: 23.09 Flight 14 → MC v1.1 (+ обобщение движка под архетипы)
→ калибровки по 2 → MPC-пилот. ЖДЁМ ВЛАДЕЛЬЦА: утверждение лимитов (в т.ч. sector 30% при AI_COMPUTE 34%).

JOINT SIMULATION LAYER v1.0 (share 6ab141b7…, 21.09 вечер) ПРИНЯТ — оба пробела закрыты: (1) это НЕ Scenario Engine
(тот задаёт состояния мира, вероятности и factor overrides; до него — BASE, probability 1.0); архитектура Scenario → Root
Factors (11: GLOBAL_GROWTH, AI_CAPEX_CYCLE, SEMI_SUPPLY_HEALTH, POWER_BUILDOUT, FINANCIAL_CONDITIONS, SPACE_GOVERNMENT_DEMAND,
SPACE_REGULATORY_ACCESS, HEALTHCARE_DEMAND_ACCESS, CONSUMER_RISK_APPETITE, DIGITAL_PLATFORM_DEMAND, CHINA_MARKET_ACCESS;
квартальный AR(1) N(0,1) с phi, корреляционная матрица — PSD проверена мной: min eig > 0) → Economic Drivers (25 из 32
драйверов v1.1 с root-загрузками + idio, остальные 7 — idiosyncratic; стандартизация к unit variance) → Company Parameters
(theta = base + Σ effect(DriverShock) + idio) → Company MC → совместный путь с общим path_id. (2) Архетипы патч v1.1:
обязательные секции калибровки `joint_simulation` (active_drivers, company_idiosyncratic_factors, use_global_path_id) и
`driver_parameter_mapping` (stochastic_targets: path/transform/effect_per_plus_1sigma/lag/decay; structural_support:
contribution; stability: knockout remove_structural_support | not_applicable + adverse_driver_stress driver_sigma);
transforms: additive_pp, multiplicative_pct, log_multiplier, probability_logit_shift, timing_quarters_shift,
categorical_transition_probability_shift; правило: 1σ-чувствительность ≠ knockout; material driver — |exposure|=2, или ≥10%
terminal value, или 1σ → ≥1 п.п. CAGR 5Y, или critical/high failure mode. Примеры mappings NVDA/NBIS/ASTS —
illustrative_only_not_calibration. Anti-double-counting (§13). Файлы в methodology/ (21). Технический блокер снят:
обобщённый MC проектировать сразу с global_path_id / joint_simulation / driver_parameter_mapping; калибровка NBIS/NVDA
после 23.09 — уже в этом формате. ПЛАН ДВИЖКА (после Flight 14): company_mc v2 (архетипы A/B/C, сегменты и форма маржи из
калибровки, piecewise valuation с basis per path, латентный фактор + idio вместо ранга, gap-метрики, bridge_dependent) +
joint_simulation (root AR(1) + драйверы + mapping → параметры) → затем optimizer/stability. Открыто у владельца: лимиты.

ОБСУЖДЕНИЕ ЛИМИТОВ (владелец, 21.09 вечер; решение НЕ принято): возражения — единый потолок доли обрезает кратный рост
(AMZN, NVDA, NBIS от $45 вопреки консенсусу); качественное доверие к основателю/команде (NBIS: основатель Яндекса) не
оцифровано, по таким бумагам владелец готов на больший риск и временное превышение доли; сам ставит вопрос о ловушке
выжившего. Мой ответ: оба эффекта реальны (скошенность доходности Бессембиндера vs Барбер/Одеан); не запрещать, а
бюджетировать и измерять проспективно. Владельцу понравились: два лимита (вложенный капитал vs рыночная стоимость),
потолок из бюджета потери (cap = L_max / просадка хвоста), пакет «слой убеждения» ВМЕСТЕ с проспективной проверкой через
год. Заказ to_imma/conviction-layer.request.md ОТПРАВЛЕН владельцем LLM 21.09 вечер без правок; ждём спецификацию Conviction Overlay v1.0. Поправки владельца:
NBIS просадка от максимума ~17% (моя 22% — по закрытию 18.09); CRWV −43% от его цены покупки (cost basis, не 12M max).

CONVICTION OVERLAY v1.0 (share 6ab18923…, 21.09 поздний вечер) ПОЛУЧЕН и развёрнут (methodology/, 26 файлов): Conviction_Overlay
Spec+Schema, Conviction_Journal_Schema, Team_Execution_Axis Spec+Schema. Суть: (1) invested-capital limit (lot-level cost basis
по двум счетам, legacy_at_system_start, DRIP = новый lot) отделён от market-value; (2) per-asset caps: hard_cap = clamp(L_max /
plausible_dd, floor, ceiling), target_cap = 0.75·hard; plausible_dd = max(|ES5|, |Q25 maxDD|), fallback до MC по архетипам
55/75/85%; между target и hard — soft gap (блок покупок, без продажи), выше hard — MANDATORY_RISK_REDUCTION_REVIEW (Decision
Request, не сделка); (3) conviction tag ≤3: ослабляет только single-name loss budget (L_max 8% → 15% NAV), не return и не
секторные лимиты; авто-suspend при подтверждённом переходе вниз E2/E3, двух периодах ухудшения Critical KPI, hard breach,
>2 пропущенных дозоров; revoke при X-триггере; возврат — только новой записью; (4) ось Team_Execution T0–T4 с 8 KPI
(guidance hit rate, milestones on-time, retention, insider ownership, dilution, capital-allocation adverse events; биография
основателя — факт, не порог), guidance-gaming guard; в MC — только множитель идиосинкратической дисперсии исполнения
T0 1.10 … T4 0.90 × owner_judgment 0.9–1.1, clamp 0.8–1.2; (5) журнал с замороженным counterfactual, обзор через 12 мес.,
лестница навык/удача: <8 эпизодов insufficient, ≥8 provisional, ≥15/3 компании/36 мес./>60% побед/бутстрап 90% CI>0 —
supported; параметры меняются только на annual review (±1 п.п. L_max, ±1 тег). В _portfolio.yaml — блок
conviction_overlay_v1_0 (pending_owner_approval) + ПРЕВЬЮ на фактическом портфеле (fallback-просадки): NBIS 33.4% —
hard_breach и при standard (hard 10.7%), и при conviction (hard 20%); NVDA 21.5% — hard_breach standard (14.5%), soft_gap
conviction (target 20.4 / hard 27.3%); HOOD 14.4% — soft_gap standard, ok conviction; остальные ok. ВЛАДЕЛЬЦУ: параметры
на утверждение (L_max 8/15, buffer 0.75, invested 12/20/30, sector market 35/45, теги ≤3, судейский множитель 0.9–1.1)
и главное следствие — NBIS при предложенных числах требует Decision Request на снижение риска даже как conviction;
альтернатива — иной L_max_conviction (при 25% NAV hard cap NBIS = 33%). Cost basis (кроме SPCX) не передан — для
invested-capital лимита нужны лоты или согласие на legacy-снимок без истории.

ДОКУМЕНТ ВЛАДЕЛЬЦА «Инвестиционная политика» (черновик 21.09.2026, Claude Docs, artifact 392ded89-3b18-4e8a-8798-fe514ff7ffe2,
https://claude.ai/artifact/84XPNzw3pnKdM5LTM79wKP; владелец: «на подумать, не останавливает планы»; сам документ называет себя
ТЗ для системы). Ключевое: цель ~$940 тыс. к 2038–2040 (75 млн ₽), взносы ~$2 000/мес +5–7%/год; капитал ≈ 2/3 недвижимость +
1/3 финпортфель (2 счёта: США 60% / Казахстан 40%, цель 50/50 ±10 п.п.; на счёте Казахстана доступны только бумаги США и не все);
допустимая просадка финпортфеля 40%; целевая структура: ядро акций 50% (широкий фонд), защита 15% (короткие UST), активная
часть 35% (6–8 позиций, вход 3–10%, ВЫШЕ 15% — ПОДРЕЗАТЬ ДО 10%, тема ≤ половины активной части ≈ 17% портфеля); плечо/шорты/
ОПЦИОНЫ не используются; просадка −20% ничего, −30% ребалансировка из защиты; реструктуризация ОТЛОЖЕНА до готовности
системы, крайний срок 30.10.2026; с 21.09 действуют: новые взносы только в ядро, позиции в теме AI НЕ наращиваются;
котировки не чаще раза в неделю; система = отслеживание лимитов/тем/соотношения счетов/событий/календаря взносов.
КОНФЛИКТЫ с текущей методологией (владельцу): (1) «выше 15% подрезать до 10%» ↔ Conviction Overlay «победителя не обрезать»
и SPCX-стратегия; (2) опционы запрещены ↔ SPCX opening-фаза (путы) и E-04 «колл-опционы»; (3) «AI не наращивать» ↔ активные
SPCX-C-02 DCA (докупка 17.09), ETN/NET/… входы по цене; (4) тема ≤17% ↔ сектор 30/35/45 (тема ≠ сектор; AI-тема сейчас ~70%);
(5) ядро+защита 65% — в системе нет слоя фондов/UST, весь портфель «активный»; dry powder 5–10% ≠ защита 15%; (6) паритет
счетов 50/50 ±10 и eligibility бумаг на счёте KZ — в Optimizer предусмотрено account_eligibility, но нет ограничения
на баланс счетов; (7) стресс «оба счёта заморожены 3 года» — вне regime engine. ЛОТЫ NBIS P2 ПОЛУЧЕНЫ 21.09 (18 лотов, 190 акций, basis $15 091.51, средняя $79.43, +181% при $223.54; последние 31 акция куплены по ~$235 — выше текущей цены; даты не переданы) → _portfolio.yaml acquisition_lots + cost_basis. Нет: лоты остальных позиций P2 (RKLB 24, UFO, ASTS, GLD 6, CRWV, PLTR, HOOD 112).
22.09: СРЕДНИЕ ЦЕНЫ P1 (счёт США) ПОЛУЧЕНЫ по 13 позициям → cost_basis (legacy_at_system_start, средняя брокера с комиссиями;
SPCX 155.41 vs лоты 155.035). НОВАЯ ПОЗИЦИЯ SPOT (4 акции, средняя 261.97) — не было в составе 21.09; добавлена в _portfolio.yaml
(P1, INTERNET_PLATFORMS/XLC) и _candidates.yaml (модели нет — заказать); прогон 4 portfolio_regime с SPOT (см. machine_outputs).
22.09: SPOT подтверждён владельцем. СРЕДНИЕ ЦЕНЫ P2 ПОЛУЧЕНЫ (RKLB, UFO, ASTS, GLD, CRWV, PLTR, HOOD) → cost_basis есть по ВСЕМ
позициям обоих счетов (legacy_at_system_start); в _portfolio.yaml → conviction_overlay_v1_0: risk_capital_basis_usd и
invested_capital_preview_2026_09_22 (доля вложенного капитала по бумагам vs предложенные 12/20%, сектора vs 30%). Прогон 4
portfolio_regime (…-42defe): NAV $182 756 с SPOT, Stress, покрытие 97.8%.
РЕШЕНИЯ ВЛАДЕЛЬЦА ПО ПОЛИТИКЕ (22.09): (1) принцип «победителя не обрезать» ПОДТВЕРЖДЁН — правило политики «выше 15%
подрезать до 10%» не действует; (2) стратегия SPCX с путами/коллами сохраняется, но СТОИМОСТЬ хеджирования учитывать в
рекомендациях; (3) «AI не наращивать с 21.09» — вопрос открыт: владелец считает, что противоречия нет; дозор: конфликт
касается будущих сигналов докупки (SPCX-C-02 DCA, входы по цене корзины), нужна пометка темы и правило в уведомлениях;
(4) весь портфель считается активным, часть — резерв для докупок на просадках (dry powder, параметр); слоя фондов/UST нет.

## ТОЧКА ВОЗВРАТА 2026-09-22: параметры Conviction Overlay УТВЕРЖДЕНЫ, тема AI помечена
ВЛАДЕЛЕЦ 22.09 утвердил пп. 1–10: L_max 10% (обычная) / 25% («доверяю»), буфер 0.75, резервные просадки 55/75/85% по
архетипам («начнём с этого»), границы потолков 5–30 / 5–45%, вложенный капитал 12/20/30%, сектор по рынку 35/45%, ≤3 пометки,
судейский множитель 0.9–1.1, обзор 12 мес. Резерв = финансовый портфель (два счёта), не всё имущество. Список темы AI
подтверждён (NBIS, CRWV, NVDA, ASML, SPCX, MSFT, META, PLTR, NET, CRWD, ETN, 6506, 6324) → theme: AI в _candidates.yaml,
правило в AGENTS.md (строка «Политика: тема ИИ не наращивается с 21.09.2026 — сигнал справочный, решение за владельцем»
в уведомлениях с покупкой), та же строка в промптах spacex-dca-reminder, spacex-price-watch, aiinfra-price-watch (cron edit).
ДВИЖОК: conviction_overlay 1.0.0 (invest-calc; per-asset caps, invested-capital лимит, секторные пороги; 5 тестов; всего
34/34) — НЕ закоммичено (+ registry, тест). ПРОГОН 1 по утверждённым параметрам без пометок (run 20260921T220020Z-
conviction_overlay-ad4f40, цены 18.09): NBIS 33.0% > hard 13.3% и NVDA 21.3% > hard 18.2% — hard_loss_budget_breach
(MANDATORY_RISK_REDUCTION_REVIEW — Decision Request, не сделка); HOOD 14.2% > target 13.6% — soft; по вложенному капиталу
докупки заблокированы у NBIS (22.4%), NVDA (16.6%), HOOD (12.2%); сектора — все под порогами. СЦЕНАРИЙ с пометками NBIS+NVDA
(run сохранён, не активен): NBIS hard 33.3% → soft gap (33.0%), NVDA hard 45% → none; докупки NBIS всё равно заблокированы
(22.4% > 20%). Пометки «доверяю» владелец НЕ назначал (active_conviction_tags: []); условие для NBIS — ось Capacity_Secured
pending_verification (факт мощности не раскрыт) → по спецификации тег недопустим до подтверждения; вопрос владельцу/LLM.
Очередь: решение по пометкам; Decision Request по NBIS/NVDA — заводить ли как пункт «ждёт владельца» (сейчас только в
machine_outputs); Flight 14 23.09 09:00; MC v1.1.

22.09 (день): коммит lab 9c2862d (conviction_overlay 1.0.0). ВЛАДЕЛЕЦ: пометка «доверяю» NBIS — с исключением по оси
Capacity_Secured (нераскрытие факта KPI-11, не ухудшение) → portfolio/_conviction_journal.yaml (CONV-2026-09-22-NBIS-01:
снимок рынка/basis/модели, фальсифицируемые утверждения, «что изменит мнение», исключение с условием снятия при раскрытии
KPI-11, контрфакт = прогон без пометки …-ad4f40; обзор 2027-09-22), active_conviction_tags [NBIS], nbis/state.json →
conviction; прогон overlay с пометкой (см. machine_outputs.conviction_overlay): NBIS soft gap (33.0% vs hard 33.3%),
NVDA hard breach (21.3% > 18.2%, без пометки), HOOD soft; докупки заблокированы NBIS/NVDA/HOOD.
ВОПРОС ВЛАДЕЛЬЦА О СТАТУСЕ: «что мы считаем; нужна ли оптимизация до оценки портфеля по методологии?» — ответ дозора:
оценка портфеля по методологии = standalone MC по каждой компании (распределения доходности, P(loss), ES, RV↔MC gap) →
MPC; сделано только для SPCX; блокеры: MC v1.1 (после Flight 14), обобщённый движок MC под архетипы + joint layer (моя
работа, можно начинать сейчас), калибровки 14 компаний (LLM, по 2). Оптимизатор — после; слой убеждения — ограничения на
новые покупки, не оценка. Порядок: оценить портфель → потом решать докупки.

Как продолжить в свежей сессии: «продолжаем инвестиционный дозор, уровень портфеля, точка возврата
STATUS.md 20.09» → прочитать этот файл, `to_imma/*.coverage.md`, `notes/portfolio-approach.summary.md`
(если уже есть), затем `openclaw cron list` для проверки живости.

## Готово и работает

- Агент `invest` в OpenClaw (workspace `/home/node/.openclaw/workspace-invest`, на хосте
  `C:\openclaw-lab\data\workspace-invest`), Telegram DM владельца привязан к нему.
- Компания SpaceX (SPCX): `portfolio/spacex/{thesis.md, triggers.yaml, state.json, watch-price.js}`.
- Автоматизации (`docker exec openclaw-builder openclaw cron list`):
  `spacex-price-watch` (30 мин, скрипт), `spacex-dca-reminder` (21 день), `spacex-news-watch`
  (09:00 МСК, Sonnet 5), `spacex-evening-digest` (20:00 МСК, Sonnet 5).
- Модель информирования: 09:00 дозор / немедленно только цена / 20:00 сводка «ждёт решения»;
  закрытие пунктов ответом в Telegram «<ID>: сделано / отложено до <дата> / отклонено».
- Реестр SpaceX на 17.09: E-01 done (10-Q подтверждён), E-02 dropped, E-04 done, C-01 due
  (напоминание 17.09 18:00), остальные active/planned.

## Прервано здесь: уровень портфеля (пример WAR-ECONOMY)

Разобрана вторая переписка «WAR-ECONOMY (05.01.26. Тайвань 2027 + Венесуэла)» (Evernote):
черновик покрытия — `notes/war-economy-2026-01-05.coverage.md` (25 триггеров-кандидатов,
14 идей, 5 расширений модели, 5 вопросов владельцу). Онбординг НЕ выполнен, автоматизации
не заведены. Решение владельца: отложить, вернуться позже.

Что не хватает модели (из разбора, зафиксировано как «достаточно для понимания картины»):
1. сущность «портфель» (`portfolio.yaml`: позиции, капитал, целевые веса, базовый уровень просадки);
2. триггеры `scope: portfolio` (просадка от пика, VIX, отклонение весов) — обобщить watch-price.js
   на список тикеров и агрегат;
3. сценарий как пакет действий (одно событие → действия по многим тикерам);
4. статус `idea` + ретро-дозор идей (цена с даты идеи);
5. история версий решения (superseded), реестр по финальной версии.

Открытые вопросы владельцу (продублированы в coverage.md, раздел 6):
1. актуальный состав портфеля — что продано/куплено с января 2026;
2. от чего считать просадку «рынок –35%» (портфель от пика / индекс / уровень 05.01.2026);
3. финальная версия — «гибридный портфель» + PDF v2 с количествами?
4. какие из 14 идей ставить на ретро-дозор;
5. пересмотр тезиса «Тайвань 2027» — по кварталу или по событию.

## Трек «третья переписка → дозакрытие» (17.09, ветка-форк сессии)

Третья переписка — «Инвестиции в ИИ-инфраструктуру» (ChatGPT share
https://chatgpt.com/share/6aabc9a0-43ac-83eb-8e3c-75599a68e5d4; полный текст берётся из
`/backend-api/share/<id>` → `linear_conversation`, DOM показывает только хвост).
Компании: Cloudflare, Yaskawa, Harmonic Drive, Eaton, Schneider (+ THK, Datadog, Vertiv, CRWD…).
Решение о покупке в переписке НЕ принято, триггеры без чисел, два несогласованных рейтинга.

Сделано 17.09:
- `notes/ai-infra-chatgpt.coverage.md` — разбор: что извлекается (11 событийных триггеров без
  порогов, правила-эвристики, сценарные оценки), 9 пробелов;
- `to_imma/ai-infra-chatgpt.questions.md` — вопросник из 18 вопросов + шаблон финального блока,
  готов к вставке в тот же чат ChatGPT одним сообщением;
- `templates/final-block-template.md` — ОБЩИЙ шаблон финального блока «для дозора» (v1) с
  соответствием разделов A–J файлам реестра.

Дозакрытие получено 17.09 (share 6aabd184…, финальный блок A–J), ОНБОРДИНГ ВЫПОЛНЕН 17.09:
- папки `portfolio/{etn,su,net,6506,6324,crwd}/` (thesis, triggers, state с pending_verification);
  `portfolio/_ideas.yaml` (watch/idea/rejected с ценами Yahoo 17.09); `portfolio/_scenarios/taiwan.yaml`
  (TAIWAN-S1..S3); `portfolio/_watch/watch-prices.js` (многотикерный сторож, тест 7/7);
- таблица покрытия: `notes/ai-infra-chatgpt.onboarding.md` (что перенесено / не перенесено и почему);
- автоматизации: `aiinfra-price-watch` 3afb8580… (30 мин, ETN/SU/NET уровни входа; ETN-P-01 уже
  выполнен на старте — первое срабатывание ожидаемо), `aiinfra-news-watch` 48f257f2… (09:05 МСК, Sonnet:
  NET-E-03, 6506-E-04, 6324-E-04/05, CRWD-E-04, стадии TAIWAN), one-shot `aiinfra-report-check-6506-2026q2`
  c81e08a1… (10.10 09:00), `aiinfra-report-check-su-net-2026q3` b28de8b4… (30.10 09:00), разовые
  `aiinfra-dates-verify` 7d954762… и `aiinfra-facts-verify` c055d31a…; вечерняя сводка обходит все папки.
- AGENTS.md: структура многокомпанийного портфеля, подтипы id (-P/-F/-E/-X/-C), раздел «Проверка по отчёту».

Не перенесено / planned: фиксация по капитализации (-F-, нужен источник market cap), условные уровни
входа Yaskawa/Harmonic (после E-триггеров), правило Cloudflare-2021 (нужна цена покупки), веса как
ребалансировка (уровень портфеля). Вопросы владельцу: доступ брокера к TSE/Euronext и лоты 100 акций,
допустимая доля валютного риска JPY/EUR, уровень входа CRWD.

Проверки 17.09 выполнены: dates-verify (Yaskawa 09.10 подтверждена; ETN консенсус 03.11, не объявлена;
HDS/CRWD/THK не объявлены) — внесено в реестры; facts-verify по компаниям на Sonnet (после пополнения
OpenRouter; первый прогон на DeepSeek-фолбэке выдал мусор с выдуманными названиями компаний — фолбэк
DeepSeek для проверочных заданий убран, резерв Opus): ETN 4/4, SU 4/4, NET 4/4, Yaskawa 4/5 совпали;
Harmonic Drive — РАСХОЖДЕНИЕ: рост orders Q1 FY2027 +37%, а не +55.7% из обсуждения (сумма ¥24.1 млрд
верна); условие 6324-E-01 (≥30%) всё равно выполнено за первый квартал. Реестры и thesis исправлены.
Урок для шаблона: в блоке G LLM даёт цифры уверенно, но ошибается — проверка по первоисточнику обязательна.

Очередь: one-shot report-check для ETN (04.11 после подтверждения даты), HDS и CRWD (после объявления дат); ретро-дозор идей (еженедельно по _ideas.yaml) — не заведён;
скилл онбординга — писать после этого примера (три примера есть).

## Как продолжить с прерванного места

1. Новая сессия Claude Code в этом же проекте: сказать «продолжаем инвестиционный дозор,
   точка возврата STATUS.md в workspace-invest». Память подскажет раскладку OpenClaw и трек.
2. Прочитать этот файл и `notes/war-economy-2026-01-05.coverage.md`.
3. Проверить живость: `docker exec openclaw-builder openclaw cron list` и
   `openclaw cron runs <id>` для четырёх заданий; state.json на предмет пунктов без owner_decision.
4. Для уровня портфеля: получить ответы на 5 вопросов, затем расширять модель в порядке 1→2→3→4→5.

## Замечания владельца 17.09 (вечер) — что сделано
1. Иероглифы/термины: правило «Язык и термины» + глоссарий в AGENTS.md; ЯЗЫК-блок в сообщениях заданий;
   в реестрах японские названия документов заменены, lump-sum/DCA пояснены.
2. Сообщения без контекста («возврат выше $400»): скрипты сторожей помечают строки [ДЕЙСТВИЕ]/[СПРАВОЧНО];
   справочные пишутся в state.json → info_log и уходят только в вечернюю сводку («Справочно за день»);
   текст справки объясняет, что ожидаемое действие больше не показано.
3. Два вида первой строки: `ID: <триггер>` и `ЗАДАЧА: <имя>` (для разовых заданий и сводки).
4–5. Шумные сообщения heartbeat и пересказ JSON котировок: причина `tools.exec.notifyOnExit` (фоновый
   curl из trigger-script будил агента) → выключен; heartbeat: every 0m, target none, directPolicy block.
   `agents.defaults.heartbeat.agentId: main` — это «какой агент выполняет системный heartbeat», корректно.
6. FACTS-VERIFY-6324 — идентификатор разового задания, не триггера; теперь такие идут как ЗАДАЧА.
Важно: trigger-script хранится в задании копией — после правки файла нужен `cron edit --trigger-script`.

## Вариант C «контекст по типу сообщения» — принят и внедрён 17.09 (вечер)
- Типы сообщений: сигнал к действию / проверка тезиса / напоминание / справка / сводка / служебное /
  вопрос владельцу / карта портфеля (последняя — после ветки портфеля). Шаблоны — AGENTS.md
  «Шаблоны сообщений по типам», порядок строк фиксирован, строка «Где мы» обязательна.
- Маршруты: `route.steps` в каждом triggers.yaml (kind: stage | scenario), `step` у каждого триггера,
  `route.current` в state.json (spacex=opening, etn/su=entry, net/6506/6324/crwd=watch). Переход шага —
  агент по «сделано» последнего триггера шага (предлагает в сводке) или владелец: «<тикер>: шаг <id>».
- Карточка по запросу: тикер или «карточка <тикер>» в Telegram → карточка из thesis/triggers/state
  + текущая цена; модель чата invest переведена на Sonnet 5.
- Ценовые задания пересозданы без light-context (AGENTS.md нужен для шаблонов): aiinfra-price-watch
  80fc0357…, spacex-price-watch 2cbb48c5… (trigger.state обнулён — первая оценка сообщит уже
  выполненные уровни, если есть).
- Капитализация: не метрика отчёта; Yahoo-эндпоинты с marketCap требуют авторизации → план: число акций
  из 10-Q/tanshin в meta реестра, сторож считает cap = цена × акции (даёт основу для -F- триггеров). Не сделано.

## Правила работы (кратко)

- Файлы правятся в scratchpad → `docker cp` → `chown node:node`; в Git Bash `MSYS_NO_PATHCONV=1`.
- Реестр правится раньше автоматизаций; один дом у факта.
- Telegram: без таблиц, блоки по три строки, первая строка `AG: invest, ID: <id>`.
- Агент только уведомляет; сделок не совершает.

## ТОЧКА ВОЗВРАТА 2026-09-22 (вечер): обобщённый движок MC — срезы 1–2 готовы
ВЛАДЕЛЕЦ 22.09: «начинай обобщённый движок MC; файл заказа — после Flight 14». company_mc (lab, коммит 7561c50): запись
решения calc/docs/company_mc_v2_design.md (сценарии Д-26, инварианты, схема калибровки v2, нарезка 4 среза, журнал).
Срез 1 (2.0.0): распределения triangular/pert/truncnorm/lognormal/deterministic, сегменты из калибровки, архетипы A
(mean_reverting_positive_margin) и B (direct_fcf_nodes | ocf_capex_decomposition), латентные факторы growth/margin/valuation
с загрузками вместо общего ранга, кусочная оценка FCF_multiple / revenue_bridge / EBITDA_multiple + negative_fcf_fallback с
valuation_basis per path и bridge_dependent, gap-метрики RV_Growth_Gap / Price_Expectation_Gap, robustness v1.1, адаптер
SPCX v1.0 — ПАРИТЕТ с conditional_mc 1.0.1: CAGR5 −14.92 vs −14.86%, P(loss>30) 0.964/0.966, ES5 −0.737/−0.731; gap SPCX:
+49.2 п.п., 3.78×. Срез 2 (2.1.0 + joint_layer 1.0.0): root AR(1) + корреляции + драйверы (unit variance), общий путь через
SeedSequence([global_seed, chunk]), сценарии driver_overrides, driver_parameter_mapping (рост/узлы/мультипликаторы,
transforms), knockout (structural_support) / adverse_driver_stress, mapping_warnings для неизвестных целей. Тесты 45/45,
сайдкар видит company_mc 2.1.0. Очередь движка: срез 3 (архетип C вехи), срез 4 (пути для MPC/Optimizer). Легаси
conditional_mc не тронут; перевод SPCX на v2 — отдельное решение. Завтра 09:00 Flight 14 → файл заказа LLM (MC v1.1 +
калибровки NBIS+NVDA в формате v2 с joint_simulation/driver_parameter_mapping).
Коммит lab 7561c50 (срезы 1–2). СРЕЗ 3 ГОТОВ (22.09 вечер, НЕ закоммичено): company_mc 2.2.0 + milestone_mc — архетип C:
дерево вех (requires, Bernoulli через латентный фактор, сроки, ветви terminal_failure / delay_retry), existing + service
сегменты от запуска, сжигание кэша и размытие (raised × (1+penalty)), кусочная оценка failure_residual /
milestone_conditioned_EV / revenue_bridge / FCF_multiple с valuation_basis на путь, доп. выходы milestone_state_share и
service_onset; mapping вех (probability_logit_shift, timing_quarters_shift) и сервисного роста. Тесты 49/49; сайдкар
company_mc 2.2.0. Схема калибровки C — docstring milestone_mc.py (для заказа калибровок ASTS/RKLB). Очередь: срез 4.
Коммит lab c8f260c (срез 3). СРЕЗ 4 ГОТОВ (22.09 поздно, НЕ закоммичено): company_mc 2.3.0 — store_paths → файл путей
<run_id>-paths.npz в portfolio/_runs (r3/r5/r8/maxdd5, basis, path_id, meta с global_seed/chunk/joint); app.py подставляет
_run_id/_runs_dir (сайдкар ПЕРЕСОБРАН, image 0.1.0, up -d); portfolio_paths 1.0.0 — PortfolioValue_h = Σ w·r + dry powder
по совпадающим path_id, проверка выравнивания, вклад в медиану, корреляции log-стоимостей; сходимость + P(loss>30%).
Тесты 52/52. СРАВНИТЕЛЬНЫЙ ПРОГОН SPCX на v2 через сайдкар (run 20260922T062152Z-company_mc-e169f2, 500k, 8.9 с, файл путей
7.7 МБ): CAGR 3/5/8Y −22.7 / −14.9 / −3.9%; P(loss>30/50%) 0.963 / 0.670; ES5 −0.736; медиана Y5 $897.2 млрд; сходимость
стабильна; robustness v1.1 pass (знак 100%, допуск 75%); gap: RV_Growth_Gap +49.3 п.п., Price_Expectation_Gap 3.78×. Записан
в spacex/state.json → calc_runs как сравнительный (норматив …-861006 сохранён); portfolio_paths по файлу SPCX через сайдкар
воспроизводит медиану. Перевод SPCX на v2 — решение владельца. Срез 4 — коммит 5d84c59. ДВИЖОК v2 ЗАВЕРШЁН (4 среза, 52/52).

## IMA Foundation v1.0 (пакет другой LLM, 2026-09-22): разбор, НЕ принят
Share 6ab22e7c; пакет в Downloads/Investment_Modeling_Agent_v1.0_foundation (24 файла: манифест роли, реестр скиллов
IMA-01..08, state machine, промежуточные артефакты, provenance, capability/adapter contracts, гейты G0–G8,
conformance suite, golden cases v0.1). Разбор — to_imma/ima-foundation.review.md. Вывод: направление верное, пакет
описывает только сторону LLM; отсутствуют Company Artifact Schema, Source Policy, протокол дозора (G8), авторитет
присвоения ID (интегратор!), машиночитаемые golden cases; предпосылка conformance — git в workspace (нет);
исполнитель conformance — ДРУГАЯ модель (ChatGPT-проект загрязнён принятыми ответами). Порядок: git → схема артефактов
→ G5-валидатор в invest-calc → conformance NBIS. Вопрос LLM переформулирован в три заказа (§4 разбора). Решение
владельца: отправлять ли в таком виде.

Заказ по IMA (три заказа: схема артефактов + source policy + протокол дозора; Roles and Seams + golden cases v0.2 + исполнитель conformance; контракты IMA-09/10/11 по схеме company_mc 2.3.0) — to_imma/ima-foundation.request.md, вложения Downloads/ima-foundation-to-llm. НЕ отправлен.

IMA, ответ LLM на разбор (share 6ab2c2b4): принят почти целиком; интегратор оставлен как минимальная детерминированная роль (ID + слияние), Candidate Schema отделена от Artifact Schema, порядок §11 LLM принят, conformance — чужие модели (Sonnet 5 + DeepSeek). Партия 1 заказа — Candidate Schema + Company Artifact Schema с критериями приёмки по файлам NBIS: to_imma/ima-acceptance-gap.request.md. НЕ отправлен. Очередь на нашей стороне: git в workspace-invest (решение владельца), затем artifact_validator G5 в invest-calc после партии 1.

GIT В WORKSPACE-INVEST ЗАВЕДЁН 22.09: .git существовал с 20.09 без коммитов; добавлен .gitignore (*.npz, *.lnk, *.zip), идентичность black, первый коммит df6029d (снимок S0, 238 файлов) — точка отсчёта для conformance/golden cases. Правило: коммиты в workspace — по запросу владельца; git запускать в контейнере от node (docker exec -u node). Файлы data.lnk и portfolio/nbis.zip — вне репозитория (игнор).

IMA партия 1 (share 6ab2ca2c): Candidate Schema v1.0 + Company Artifact Schema v1.0 получены (from_imma), проверены независимо (jsonschema): NBIS — ошибки ровно по §7, после миграции 0; по остальным 12 моделям — пробелы схемы (sources как объект, ASTS evidence_type/observation_window_days = golden cases GC-005/006, legacy-реестры NET/ETN, semantics.*). ПРИНЯТО УСЛОВНО; заказ патча v1.0.1 — to_imma/ima-party1.feedback.md (10 пунктов), отчёт — to_imma/ima-party1.validation-report.md. НЕ отправлен. Далее на нашей стороне: миграция + artifact_validator (G5) в invest-calc после v1.0.1; SPCX — отдельное решение.

IMA патч v1.0.1 (share 6ab2ce78): ПРИНЯТ. Сухой прогон миграции MIG-101..111 (scratchpad _migrate_v101_dryrun.py) + Draft 2020-12: 13 моделей — 0 ошибок; остаток 5 ошибок только в 4 реестрах без модели (meta.target_weight/lot, triggers[].priority) → заказ v1.0.2 в to_imma/ima-party1-v101.feedback.md (НЕ отправлен; можно совместить с партией 2). Пакет v1.0.1 — from_imma. GIT: origin = https://github.com/black2github/ai_investment_system.git (push — по запросу владельца, с хоста из C:\openclaw-lab\data\workspace-invest; core.fileMode=false, чтобы хост и контейнер сходились). Очередь: боевая миграция S0→S1 + artifact_validator (G5) в invest-calc — план ниже, ждёт подтверждения.

## МИГРАЦИЯ S0 → S1 ВЫПОЛНЕНА (22.09 вечер) + валидатор G5
Схемы v1.0.1 — нормативный дом methodology/Company_{Candidate,Artifact}_Schema_v1.0.1.yaml. Утилита lab calc/tools/migrate_artifacts_v1_0_1.py (построчный патч по номерам строк ruamel; инварианты: результат патча == эталонной миграции в памяти, ID/состояния/условия неизменны, CRLF/комментарии сохранены, идемпотентность; сухой прогон по умолчанию, --apply — запись). Применена к 17 папкам portfolio (13 моделей full_model + 4 реестра registry_only; spacex НЕ мигрирован — старый формат, отдельное решение): 74 файла, +1189/−210 строк. Валидатор — модель artifact_validator 1.0.0 в invest-calc (jsonschema добавлен в requirements, образ пересобран): JSON Schema Draft 2020-12 + правила ART-REF-*/CAND-REF-* кодом; режим candidate для пакетов LLM. Прогон через сайдкар run 20260922T192306Z-artifact_validator-da61bb: 11 pass / 6 fail — все 6 только по полям, ожидающим v1.0.2 (meta.target_weight/lot, triggers[].priority; заказ уже у LLM). 34 предупреждения ART-REF-015: действия legacy-реестров 6324/6506/SU/NET/ETN вида «Купить 2% портфеля» (реестры 17.09, до методологии) — решение владельца: переформулировать или принять как owner_judgment. AGENTS.md дозора дополнен форматом наблюдений (число|null + observation_qualifier, value_type, provenance). Тесты lab: 84/84 (32 новых: test_migrate_artifacts, test_artifact_validator). НЕ закоммичено: lab (validator, tool, tests, registry, requirements) и workspace (S1: 74 файла + AGENTS.md + inbox + methodology + STATUS).

ПАУЗА ПОКУПОК ПО LEGACY-РЕЕСТРАМ (решение владельца 22.09): 22 триггера с действием «купить» (NET/ETN/SU P-01..03, 6324 P-01..03 + E-01..05, 6506 P-01..03 + E-01/E-03) → status: paused, прежний статус и причина в note (обратимо). Наблюдение цены/событий/отчётов продолжается; уведомление о покупке не отправляется (правило в AGENTS.md). Валидатор: ART-REF-015 не предупреждает по paused/dropped/done. Статус paused в enum схемы пока нет → дополнение к заказу v1.0.2: to_imma/ima-v102-addendum.request.md (НЕ отправлен); до патча 5 реестров дают ошибки схемы «paused не в enum» — ожидаемо. Остаток предупреждений: 12 у F-триггеров (фиксация прибыли, «продать») 6324/6506/ETN — решение владельца не принято. SPCX: решение владельца — оставить как есть; путь принят: после Flight 14 файлы SPCX → LLM на расширение схемы (v1.0.3), затем миграция той же утилитой + ручная правка E-34..36 (transition null). Теги git workspace: S0=df6029d, S1=0823caf (локальные; push по запросу). Тесты lab читают исходники из тега S0 (git show), не из текущего workspace.

ПАРТИЯ 2 + v1.0.2 ПОЛУЧЕНЫ (share 6ab2da66, from_imma): v1.0.2 (3 поля реестров) — проверен по 17 папкам: чисто, кроме 22 «paused не в enum» (наше изменение после заказа → v1.0.3); Source Policy v1.0 — соответствует заказу, классификация миграции совпадает, 30 KPI без source_url (IR) корректны; расхождение: UA дозора research@example.com = «fake contact» → нужен реальный контакт (решение владельца). Dozor Protocol v1.0 — принят для KPI; к v1.1: область сверки (состояния осей, события), место хранения отчётов и связь с state.json (предложено portfolio/<tk>/_verify/<run_id>.json + kpi_observations.verification_run_id + state.json.verification). Ответ + заказ v1.0.3 (paused) — to_imma/ima-party2.feedback.md (НЕ отправлен; addendum переименован под v1.0.3). Очередь после v1.0.3: миграция S2 (bump 1.0.3 + paused), Source Policy/Dozor → methodology, AGENTS.md сверка по протоколу, режим валидатора для отчётов дозора, живой прогон NBIS. Открыто у владельца: контакт для SEC UA; пауза 12 F-триггеров («продать»); Flight 14 23.09 09:00 → заказ калибровок.

22.09 поздно: контакт SEC User-Agent = azbuka09@yahoo.com (владелец; AGENTS.md); 12 F-триггеров «продать» (6324/6506/ETN/NET/SU) → paused по подтверждению владельца (итого 34 paused); валидатор: предупреждений 0, ошибки только «paused не в enum» до v1.0.3. Заказ v1.0.3 отправлен владельцем (в тексте 22 триггера — enum тот же). Ждём ответ LLM.

## v1.0.3 ПРИНЯТ, СНИМОК S2 ПОДГОТОВЛЕН (22.09 ночь)
Патч v1.0.3 (share 6ab2de18): status paused в enum, ART-REF-015 только для active/planned/due, state.json.verification + kpi_observations[].verification_run_id (dozor_runtime, без backfill — MIG-116), as_of документа (date) ≠ as_of прогона (date-time); раскладка отчётов дозора portfolio/<tk>/_verify/<run_id>.json подтверждена; Dozor v1.1 = axis_items[]/event_items[] в ТОМ ЖЕ отчёте после живого прогона NBIS. Проверено: 0 ошибок по 17 папкам. Сделано: methodology/ ← Company_Artifact_Schema_v1.0.3 (v1.0.1 убран из methodology в from_imma), Source_Policy_v1.0, Dozor_Verification_Protocol_v1.0; миграция MIG-114 (bump 1.0.3 той же утилитой, 74 файла, идемпотентно); artifact_validator 1.1.0 (схема 1.0.3, кандидат 1.0.1, режим dozor_report по output_report_schema + DZR-001..005); прогон сайдкара 20260922T200623Z-artifact_validator-5d5fbc: 17/17 pass, 0 предупреждений; AGENTS.md — раздел «Сверка по первоисточникам» по протоколу (роль, статусы, допуски, технический отказ, отчёт в _verify/, что пишется в state.json, итоги, область v1.0 = KPI). Тесты lab 85/85. Очередь: первый живой прогон дозора по протоколу (NBIS) → вход для Dozor v1.1; партия 3 (Roles & Seams, Integration Protocol, Golden Cases v0.2, Acceptance Record); Flight 14 23.09 09:00 → заказ калибровок NBIS/NVDA.

ПЕРВЫЙ ЖИВОЙ ПРОГОН ДОЗОРА ПО ПРОТОКОЛУ v1.0 (NBIS, 22.09 23:14–23:17 МСК, Sonnet 5, одноразовая задача): run_id verify-NBIS-20260922T201443Z, отчёт portfolio/nbis/_verify/, итог PASS_WITH_DECLARED_PENDING — 10/11 KPI подтверждены (5 match, 5 с нормализацией), KPI-11 not_found (кандидат pending_verification), PATCH_REQUIRED пуст; отчёт прошёл валидатор (mode dozor_report, run …-62bb0f) с первого раза, папка после записи state.json — pass (…-f971f5); 3 curl без 403 (UA с контактом владельца работает), ~12–15 мин. state.json: 11 наблюдений с verification_run_id, поле verification, info_log; канонические файлы не тронуты. Обратная связь агента — to_imma/dozor-run1.feedback.md: (1) граница not_found/not_disclosed для «guidance есть, факта нет» — нужен явный пример; (2) approximate в источнике vs exact в кандидате при совпавшем числе — критерий не прописан (KPI-05); (3) as_of у sources = дата фиксации ссылки, а не подачи документа → предложение поля filing_date; (4) verified у осей (4 из 5 true) без run_id — v1.1 должна решить судьбу старого механизма; (5) «2 квартала подряд» — где считать; (6) диапазон из одной фразы — одной цитаты достаточно. Вход для заказа Dozor v1.1. НЕ закоммичено (state.json, _verify/, 2 прогона, feedback).
as_of у источников sec.gov в states.yaml 13 моделей заменён на фактическую дату подачи по SEC index.json (было 2026-09-21 = дата фиксации ссылки; например NBIS 2026-08-12, ASML 2026-07-15, NVDA 2026-08-26); 13 источников не на sec.gov и 2 с недоступным индексом оставлены (см. STATUS). Валидатор после прогона дозора и правки дат: 17/17 pass (…-186ef4).

22.09 поздно: замечание владельца по Telegram — статусы по-русски (оригинал в скобках) → словарь label_ru в AGENTS.md (п. 8 раздела сверки); заказ Dozor v1.1 подготовлен — to_imma/dozor-v11.request.md (axis_items/event_items в том же отчёте, правила not_found/not_disclosed и квалификаторов, recorded_at, счётчик «N кварталов» вне G8, label_ru, патч Artifact Schema v1.0.4), вложения Downloads/dozor-v11-to-llm (отчёт, feedback, state.json, раздел AGENTS.md). НЕ отправлен. НЕ закоммичено: AGENTS.md, to_imma/dozor-v11.request.md, STATUS.

## DOZOR v1.1 + ARTIFACT SCHEMA v1.0.4 ПРИНЯТЫ (22.09 ночь), снимок S3 подготовлен
Share 6ab2e866, пакет Downloads/Dozor_Verification_Protocol_v1.1_and_Artifact_v1.0.4 (from_imma). Проверено: схема отчёта v1.1 корректна; живой отчёт v1.0 валиден по v1.1 (обратная совместимость); пример v1.1 (11 KPI + 5 осей + 1 событие) валиден и проходит валидатор сайдкара (…-64a1bc, DZR-001..010); v1.0.4 — 0 ошибок по 17 папкам. Внедрено: methodology ← Dozor_Verification_Protocol_v1.1 (.yaml/.md), Company_Artifact_Schema_v1.0.4 (v1.0.3 и протокол v1.0 → from_imma); миграция MIG-117 (bump 1.0.4, 73 файла, идемпотентно); artifact_validator 1.2.0 (схема 1.0.4, протокол 1.1: runtime_verified/patch_required по status_registry, оси DZR-006/007, события DZR-008/009, итог DZR-010); прогон сайдкара …-849e9c: 17/17 pass; AGENTS.md — раздел сверки переписан под v1.1 (оси, события, квалификатор, «N кварталов» вне G8, legacy_unlinked, старшинство итогов, label_ru из status_registry). Тесты lab 86/86. Очередь: второй живой прогон по v1.1 — NBIS (оси + события) и ASTS (качественная ось, бинарный KPI, окно 50 дней); затем прогоны по остальным 11 моделям; партия 3 (Roles & Seams, Integration Protocol, Golden Cases v0.2, Acceptance Record). Flight 14 23.09 09:00 → заказ калибровок NBIS/NVDA.

ВТОРОЙ ЖИВОЙ ПРОГОН ДОЗОРА — ПРИЁМКА v1.1 (NBIS, 23.09 00:01–00:05 МСК): run verify-NBIS-20260922T210122Z, protocol 1.1.0, итог PASS_WITH_DECLARED_PENDING: 11 KPI (4 match, 6 с нормализацией, KPI-11 not_found), 5 осей (4 state_supported с criterion_checks по KPI отчёта, Capacity_Secured pending), 2 события (E-01 факт раскрытия подтверждён первоисточником, fired не создан; E-06 event_unconfirmed — условие не выполнено, guidance повышен 4→5 GW). Валидатор: первый заход отчёта отклонён (DZR-004: event_contradicted без patch_required) — агент исправил статус, второй pass; папка pass. state.json: scenario_state всех 5 осей с verification_run_id (legacy_unlinked снят), events_reported 1 запись с run_id, наблюдения перепривязаны к run2 (ссылка на run1 потеряна — по моему указанию; для v1.2 лучше список verification_run_ids или отдельные наблюдения). Интегратор: kpis.yaml NBIS-KPI-05 observation_qualifier → approximate (по qualifier_patch_suggested). Обратная связь агента to_imma/dozor-run2.feedback.md — вход для v1.2: (1) статус condition_not_met для активных триггеров-наблюдателей без заявленного события (event_contradicted требует патч, а патчить нечего); (2) claim_type: kpi_threshold_check | discrete_event, чтобы не смешивать регулярные проверки условий и разовые события; (3) criteria: null + pending_reason для осей с каноническим pending_verification; (4) вторичные новости (Palantir-партнёрство, повышение цен) без первичного документа в event_items не внесены — правило двух СМИ не выполнено. НЕ закоммичено: state.json, kpis.yaml, _verify/, feedback, 4 прогона, STATUS. Далее: ASTS после проверки Flight 14 (09:00); заказ Dozor v1.2 — после ASTS (накопить два прогона).

## 23.09 УТРО: Flight 14, переключения, ASTS, заказ калибровок
Flight 14 (задача spacex-flight14-check, 09:00 МСК, 66 с, ~$0.34 по usage из cron runs): полёт перенесён SpaceX на 28.09.2026 (space.com; spacex.com технически не открылся) — запись E1 в info_log SPCX, переход C1→C2 не оценивался, вектор A2/B2/C1/D3 без изменений; доставлено в Telegram. Повторная проверка — по факту полёта 28.09 (задача не пересоздана — решение владельца).
Затраты (решения владельца 23.09): вечерняя сводка 0e661c05 → Haiku 4.5 (fallback Sonnet 5); три дозора новостей ОТКЛЮЧЕНЫ (spacex/aiinfra/models-news-watch, не удалены — откат возможен), вместо них один portfolio-news-watch 88c05803 (09:00 МСК, Haiku 4.5, три группы в одном запуске, все правила/шаблоны сохранены, правило paused и политика ИИ добавлены). Ценовые дозоры РАБОТАЮТ как задумано (trigger script: 263 оценки за неделю, модель вызывается только при смене зоны; SPCX $154.72 зона 0; ETN/SU/NET выше уровней) — в оба задания добавлено ПРАВИЛО ПАУЗЫ (paused-триггер: уровень → info_log, без fired и уведомления). Факт: cron runs хранит usage по прогонам → можно считать стоимость точно.
ASTS: прогон сверки по v1.1 запущен (dozor-verify-asts-run1 fc826f2d) — качественная ось, бинарный KPI-11, окно 50 дней, derived KPI-09.
Заказ калибровок подготовлен: to_imma/mc-v11-calibrations.request.md (A: спецификация Conditional MC v1.1 под движок + JSON Schema калибровки; B: SPCX v1.1 в формате v2 с учётом переноса Flight 14; C: RV + MC калибровки NBIS и NVDA), вложения Downloads/mc-v11-to-llm. НЕ отправлен. Очередь: результат ASTS → заказ Dozor v1.2 → отправка обоих заказов (порядок за владельцем).

ASTS ПРОГОН v1.1 ЗАВЕРШЁН (run verify-ASTS-20260923T060714Z, 7 мин, 3.17M токенов, 95% кэш, ~$1.33): 11/11 KPI подтверждены (KPI-04 qualifier approximate → гармонизирован интегратором в kpis.yaml; KPI-09 derived пересчитан, 0%), 5/5 осей state_supported (качественная Regulatory_Spectrum по цитате 10-Q + KPI-11; Commercial_Contracting со списком MNO как source_evidence), 10 переходов event_unconfirmed (условия не выполнены — из-за этого итог PASS_WITH_DECLARED_PENDING вместо PASS), events_reported 0, fired 0. Валидатор: отчёт pass, папки asts+nbis pass (…-d7dd70). Feedback — to_imma/dozor-run3-asts.feedback.md. ЗАКАЗ Dozor v1.2 + Artifact Schema v1.0.5 подготовлен: to_imma/dozor-v12.request.md (condition_not_met; transition_checks vs discrete events; criteria null для pending-осей; entailment окон; база found у derived; qualifier_patch_suggested только в отчёте; verification_run_ids список), вложения Downloads/dozor-v12-to-llm. НЕ отправлен. Стоимость сверки по протоколу: ~$1.3 за компанию (Sonnet 5). НЕ закоммичено: spacex/state.json (E1 Flight 14), asts (_verify, state.json, kpis.yaml), nbis (—), inbox (2 заказа, feedback), прогоны валидатора, STATUS.

MC v1.1 ЧАСТЬ A ПОЛУЧЕНА (share 6ab3ca76): Company_Conditional_Monte_Carlo_Specification_v1.1 + Company_MC_Calibration_Schema_v1.0 + fixtures A/B/C (from_imma/MC_v1.1_partA). Проверено на живом движке: схема валидна, fixtures проходят схему и исполняются (mapping_warnings пусты, детерминизм, *_meta игнорируются загрузчиком); методологический Joint_Simulation_Layer_Schema принимается как joint_layer_spec. Расхождения: truncated_normal — движок sd, схема sigma; pert lambda не в схеме; fixtures A/B не проходят robustness (допуск 25%). Правило robustness движка = спецификации (75%/75%). Решения (мои, для подтверждения владельцем): state_transition_effects в v2 не вводить (калибровка = текущий вектор, после перехода — новая версия), not_mapped не вводить (отказ G5), C1 принят. Приёмка + заказ схемы v1.0.1 и частей B/C — to_imma/mc-v11-partA.feedback.md (НЕ отправлен). Очередь у нас: режим calibration в artifact_validator (схема + MC-G5-001..012 + сухой прогон движка).

ПЕРЕИМЕНОВАНИЕ КАТАЛОГОВ ПЕРЕПИСКИ (решение владельца 23.09): inbox/received → from_imma (всё полученное от IMMA), inbox/<наши тексты> → to_imma (заказы, приёмки, обратная связь дозора, разборы-вложения), внутренние документы → notes; IMMA = Investment Modeling & Methodology Agent — роль внешней LLM (в пакете Foundation роль названа IMA; просьба привести имя к IMMA — в следующий заказ). Перенос через git mv (132 переименования), ссылки в 63 файлах (source_artifact в канонических файлах, STATUS, README, AGENTS, to_imma) переписаны байтово без переформатирования; исторические упоминания «inbox» в старых записях STATUS и в уже отправленных заказах оставлены как есть. Валидатор 17/17 pass (…-6edcb7), тесты lab 86/86 (пути в тестах обновлены). НЕ закоммичено (workspace + lab tests).

MC v1.1 ЧАСТИ B/C ПОЛУЧЕНЫ (share 6ab3d4a5, from_imma/MC_v1.1_partBC): схема v1.0.1 (sd, lambda, fixtures shape_only) ПРИНЯТА → methodology (+ спецификация v1.1). Хост-проверки: все три MC-калибровки — схема pass, mapping полный (17/13/13), mapping_warnings [], детерминизм, robustness pass, сходимость; нормативные прогоны 500k: SPCX v1.1 …-571c5f, NBIS …-309315, NVDA …-5f30d9; RV на сайдкаре: NBIS …-ba01b6 (CAGR 0.64303 = preflight LLM, TV share 1.004 model_fragile), NVDA …-012879 (0.2371, 0.889 terminal_dependent). ДЕФЕКТ (блокирует норматив B/C): 10–11 коррелированных драйверов на один initial_growth с additive_pp 0.06–0.15/σ → σ суммарного сдвига 0.8–1.06 в единицах годового роста (1% путей −190…−250 п.п.) → ES5 −0.96 (NVDA) / −0.996 (NBIS), P(loss>30%) 0.30; без mapping хвосты слишком тонкие (NVDA q5–q95 CAGR 13–33%, P(2x) 0.91). SPCX: без mapping паритет с v1.0 (−15.1 vs −14.9%, P(loss>30) 0.969 vs 0.963). Приёмка + заказ правила суммарной силы (MC-G5-013) и переиздания калибровок — to_imma/mc-v11-partBC.feedback.md (НЕ отправлен). Калибровки B/C в portfolio/ не переносятся до переиздания. Очередь у нас: режим calibration в валидаторе (схема + MC-G5-001..013 + сухой прогон).

ВАЛИДАТОР 1.3.0 — режим calibration (23.09): JSON Schema v1.0.1 + MC-G5-001 (material-драйверы из mpc_inputs: |2| без mapping — error, прочие — warning), 002 (mapping ↔ active_drivers), 003 (через mapping_warnings движка), 005 (вехи: уникальность, предпосылки, ацикличность, onset), 006 (Σ uplift ≤ 1), 007 (порядок параметров распределений), 008 (границы маржи, PSD корреляций факторов), 013 (σ суммарного сдвига цели на путях Joint Layer, пороги growth 0.15 / margin 0.05 / multiple 0.15 — до принятия IMMA warning, strict_aggregate → error) + сухой прогон company_mc (mapping_warnings, детерминизм). Прогон через сайдкар по NVDA (…-d00d4a) и SPCX v1.1 (…-503bca): pass с предупреждениями MC-G5-013 (growth σ 0.81 / 0.89). Тесты lab: новый test_calibration_validator.py.

MC v1.1.1 ПЕРЕИЗДАНИЕ ПОЛУЧЕНО (share 6ab3dc47, from_imma/MC_v1.1.1_reissue): Joint_Simulation_Layer_Rules_v1.1 (MC-G5-013 hard gate: caps growth 0.15 / margin 0.05 / log-multiple 0.15, design headroom, intrinsic/full W bands) + спецификация v1.1.1 + anti-circularity note NBIS + naming patch IMMA — ПРИНЯТЫ → methodology. Валидатор 1.3.1: MC-G5-013 hard gate по умолчанию, нативный квартал узлов. Переизданные калибровки: рост в норме (σ 0.12/0.12/0.10), но маржа (0.06–0.08 > 0.05) и Y5.multiple (0.19–0.21 > 0.15) выше caps — LLM сайзила по Σ|effect|, а σ_eff одиночного драйвера на путях ≈ 1.6–2.0 (EMA по персистентному AR(1)); SPCX intrinsic W 0.24 < band 0.40; robustness v1.1 на 100k: SPCX 0.50 и NVDA 0.625 fail (возмущения ±10pp роста / ±20% мультипликаторов при широких хвостах дают ΔP > 0.10), NBIS 0.75 на границе. Полные прогоны: SPCX …-9cde9f, NBIS …-2343ac, NVDA …-840b31 (справочные). Приёмка + заказ v1.1.2/v1.0.2 и решения по robustness — to_imma/mc-v111-reissue.feedback.md (НЕ отправлен). Очередь у нас: диагностика intrinsic/full W и отчёт σ по целям в выводе валидатора.

ВАЛИДАТОР 1.4.0 (23.09): в режиме calibration — структурный отчёт aggregate_shift (σ, cap, kind, квартал, драйверов, ok по каждой цели) и диагностика дисперсии intrinsic/full (W = q95−q5 CAGR 5Y, ориентиры из Joint_Simulation_Layer_Rules_v1.1 → dispersion_plausibility; MC-DISP-001..003 warning; требует equity_value_0, иначе MC-DISP-000). Сайдкар воспроизводит ручные числа: NVDA intrinsic 0.326 / full 0.470 (в bands), SPCX 0.240 / 0.291 (ниже bands). Тесты lab 91/91. Следующие калибровки (v1.1.2 / v1.0.2) принимаются одним вызовом валидатора с equity_value_0.

MC v1.1.2 / Rules v1.1.1 ПРИНЯТЫ И ИНТЕГРИРОВАНЫ (23.09, share 6ab3e367, from_imma/MC_v1.1.2_reissue): спецификация v1.1.2 (локальная устойчивость 0.25σ с потолками; старая сетка — диагностика) и Joint_Simulation_Layer_Rules_v1.1.1 (критерий размерности — только измеренная σ) → methodology (v1.1.1 спецификации удалена). Калибровки SPCX v1.1.2, NBIS v1.0.2, NVDA v1.0.2 — валидатор 1.4.0 pass (MC-G5-013: σ growth 0.122/0.122/0.100, margin ≤0.046, multiple ≤0.146; дисперсия intrinsic/full: SPCX 0.425/0.444 (full на 0.006 ниже ориентира — warning), NBIS 0.697/0.727, NVDA 0.326/0.424). Нормативные прогоны company_mc 2.3.0 (500k, seed 20260920): SPCX …-0484ce (CAGR5 −13.4 %, P(loss>30) 0.68, ES5 −0.91, gap RV +45.9 п.п., price 3.46, robustness pass 1.0/0.875), NBIS …-28c1e0 (+20.7 %, 0.105, P(2x) 0.60, gap −6.0 п.п., price 0.69, pass 1.0/0.875), NVDA …-4a7d0d (+22.0 %, 0.010, P(2x) 0.71, gap −10.6 п.п., price 0.60, pass 1.0/1.0). Интеграция (скрипт, идемпотентен, CRLF сохранён): portfolio/spacex/mc_calibration_v1.1.2.yaml, portfolio/{nbis,nvda}/{calibration_v1.0.yaml, mc_calibration_v1.0.2.yaml}; state.json → calc_runs (RV-прогоны NBIS …-ba01b6 model_fragile / NVDA …-012879 terminal_dependent + три нормативных MC) и info_log; _candidates.yaml: NBIS/NVDA stage → conditional_mc. Валидатор workspace по nbis/nvda — pass (…-ae618c; spacex — старый формат, схемой не проверяется). Приёмка — to_imma/mc-v112.feedback.md (НЕ отправлен). Очередь: заказ Dozor v1.2 (to_imma/dozor-v12.request.md, не отправлен) → следующая пара калибровок HOOD + RKLB; открытые решения владельца — Decision Request SPCX с флагом риска модели (gap 3.46, P(loss>30) 0.68), NVDA, лимиты оптимизатора; Flight 14 перенесён на 28.09 (задание проверки не заведено).

DOZOR v1.2 + ARTIFACT SCHEMA v1.0.5 ПРИНЯТЫ И ИНТЕГРИРОВАНЫ (23.09, share 6ab3eca3, from_imma/Dozor_v1.2_and_Artifact_v1.0.5): независимая проверка — обе схемы валидны, реестр статусов полон (11/5/6/3/5), отчёты v1.0 (NBIS run1, настоящий), v1.1 (NBIS run2, ASTS) и пример ASTS v1.2 проходят; пример семантически согласован (DZR-012..016, counts, итог PASS по старшинству); v1.0.5 по 13 моделям — 0 ошибок. Интеграция: methodology (протокол v1.2 yaml+md, схема v1.0.5; v1.0.4 снята; v1.1 протокола ОСТАВЛЕНА — см. дефект), миграция 17 папок к v1.0.5 (MIG-121/122: история прогонов; на NBIS схлопнуты 10 legacy-дубликатов, run1 восстановлен из иммутабельного отчёта по candidate.last_value → KPI-01..10 [run1, run2]; правила (а)-(в) — в приёмке), валидатор 1.5.0 (ART-REF-030/031; протокол v1.2: реестр transition_result, DZR-011/012/014/015, DZR-010 по старшинству; 17/17 pass, run …-e84a7b; сайдкар перезапущен), AGENTS.md — раздел сверки на v1.2 (четыре секции, transition_checks, condition_not_met, criteria:null, вложение окон, база derived_fact, неповторение наблюдений). Тесты lab 44/44 (+5). ДЕФЕКТ ПАКЕТА: v1.2.yaml — только дельта, из v1.1 выпали principles/kpi_rules/runtime_write_rules/independence_rule/gate_aggregation.rules/semantics статусов; v1.0.5 — выпал known_migrations_v1_0_3_to_v1_0_4 → заказ сводной v1.2.1 в to_imma/dozor-v12.feedback.md (НЕ отправлен); до неё правила KPI v1.1 — по Dozor_Verification_Protocol_v1.1.yaml (два дома, временно). Очередь: отправка приёмки; первый живой прогон по v1.2 (NVDA/HOOD — решение владельца); заказ калибровок HOOD + RKLB; Decision Request SPCX; Flight 14 28.09.

23.09 ВЕЧЕР — ПРИЁМКА НОРМАТИВОВ: ПРАВИЛА + ИНСТРУМЕНТ; ПЕРВЫЙ ПРОГОН ДОЗОРА ПО v1.2 (NVDA). (1) README.md: раздел «Приёмка нормативов от IMMA» (переиздание = полный текст + дельта; полнота замены проверяется механически; гейт «один дом»; порядок приёмки) и правило именования тегов по содержанию (snapshot-artifact-v1.0.5; S0…S3 не переименовываем). (2) lab: calc/tools/check_supersedes.py — сравнение деревьев YAML/JSON старой и новой версии с раскрытием $ref (вынос в $defs — не пропажа), отказ при пропаже без --allow; тесты test_check_supersedes.py 4/4; живой прогон: v1.1→v1.2 протокола — 33 пропажи (principles, kpi_rules, runtime_write_rules, semantics 20 статусов…), v1.0.4→v1.0.5 схемы — 1 (known_migrations_v1_0_3_to_v1_0_4); регресс: v1.0.1→v1.0.2→v1.0.3 — полные, v1.0→v1.1 протокола — тоже дельта (inputs, normalization, technical_access, non_disclosure_rule перестроены/выпали) → в заказ v1.2.1 добавить восстановление и v1.0-содержимого. (3) NVDA run1 по v1.2 (задание dozor-verify-nvda-run1, Sonnet 5): отчёт verify-NVDA-20260923T190405Z записан и проходит валидатор 1.5.0 с первого раза (10 KPI подтверждены, 6 derived_fact в базе кандидата; 5 осей state_supported; E-01..E-10 not_met; E-11 pending_history + событие event_unconfirmed; итог PASS_WITH_DECLARED_PENDING), но исполнитель ПРЕРВАН ошибкой биллинга OpenRouter (402: баланс ниже max_tokens 128k) до state.json/feedback/уведомления; runtime дописан интегратором по отчёту (скрипт: обновление 10 наблюдений по candidate.last_value + verification_run_ids, оси verified+run_id, verification, info_log), валидатор папки pass; обратная связь для v1.2.1 — to_imma/dozor-run4-nvda.feedback.md (pending_event для событийных переходов, граница condition_not_met, форма found.period, порядок шагов исполнителя). БАЛАНС OPENROUTER НАДО ПОПОЛНИТЬ (владелец): до пополнения задания на Sonnet 5 с большим max_tokens будут падать. Очередь: коммит; ответ IMMA по v1.2.1 (принять через check_supersedes + диффы); заказ HOOD + RKLB; Decision Request SPCX; Flight 14 28.09.

DOZOR v1.2.1 (СВОДНАЯ) + ПЕРЕИЗДАННАЯ ARTIFACT v1.0.5 ПРИНЯТЫ (23.09 поздно, share 6ab4235f, from_imma/Dozor_v1.2.1_consolidated): check_supersedes — v1.1→v1.2.1 0 пропаж, v1.2→v1.2.1 0 (три переименования storage.* разрешены), v1.0.4→v1.0.5 0; output_report_schema идентична v1.2, файловые схемы/field_catalog/integrity_rules идентичны принятой v1.0.5, блок MIG-117..120 возвращён; реестр 25 статусов с semantics; отчёты v1.0/v1.1/v1.2 (вкл. живой NVDA) проходят. Интеграция: methodology — v1.2.1 (yaml+md) ЕДИНСТВЕННЫЙ дом протокола (v1.1 и v1.2 убраны), переизданная схема v1.0.5 (версия не поднята — повторная миграция не нужна); валидатор 1.5.0 → DOZOR_PROTOCOL_VERSION 1.2.1 (сайдкар перезапущен: NVDA pass …-4a92c4, 17/17 …-3d7d1c); AGENTS.md — раздел сверки на v1.2.1; тесты lab 48/48. Приёмка + вход для следующей редакции (pending_event, граница condition_not_met, форма found.period, возврат содержимого v1.0: допуски/технический доступ/output_mutation_rules) — to_imma/dozor-v121.feedback.md (НЕ отправлен). OpenRouter пополнен владельцем. Очередь: коммит; отправка приёмки; следующие прогоны дозора HOOD/ASML/META/CRWV по v1.2.1; заказ калибровок HOOD + RKLB; Decision Request SPCX; Flight 14 28.09.
