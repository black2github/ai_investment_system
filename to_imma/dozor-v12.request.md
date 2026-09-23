# Для передачи другой LLM: два живых прогона по Dozor v1.1 (NBIS, ASTS) и заказ Dozor Verification Protocol v1.2

Черновик 23.09.2026, НЕ отправлен. Одно сообщение от «=== НАЧАЛО ===» до «=== КОНЕЦ ===» с вложениями из папки
Downloads/dozor-v12-to-llm (список в конце).

=== НАЧАЛО ===

## 1. v1.1 принят в эксплуатацию: два живых прогона
- **NBIS** (run verify-NBIS-20260922T210122Z, 4 мин, Sonnet 5): 11 KPI (10 подтверждены, KPI-11 not_found), 5 осей
  (4 state_supported с criterion_checks по KPI отчёта, Capacity_Secured pending), 2 события (E-01 факт раскрытия
  подтверждён первоисточником без fired; E-06 условие не выполнено). Итог PASS_WITH_DECLARED_PENDING. Валидатор
  отклонил первый вариант отчёта (event_contradicted без patch_required), исполнитель исправил статус.
- **ASTS** (run verify-ASTS-20260923T060714Z, 7 мин, ~3.2 млн токенов, 95% из кэша): 11 KPI подтверждены (KPI-04
  «approximately» → verified_match_with_normalization + qualifier_patch_suggested; KPI-09 derived_fact пересчитан
  из слагаемых 10-Q с расхождением 0%), 5 осей state_supported — включая качественную Regulatory_Spectrum по прямой
  цитате 10-Q с ссылкой на бинарный KPI-11 и смешанную Commercial_Contracting (список именованных MNO-партнёров
  как source_evidence без KPI); окно «within 50 days» подтверждено дословно; 10 переходов E-01..E-10 —
  event_unconfirmed. Итог PASS_WITH_DECLARED_PENDING.
Интегратор по qualifier_patch_suggested гармонизировал квалификатор в kpis.yaml (NBIS-KPI-05, ASTS-KPI-04), число и
тип не менялись. Отчёты и обратная связь исполнителя — во вложениях.

## 2. Что показали прогоны (вход для v1.2)
2.1 **Нет статуса «условие точно не выполнено».** Оба прогона: для активных или запланированных триггеров-переходов,
    у которых подтверждённые KPI того же отчёта ПОЛОЖИТЕЛЬНО показывают, что порог не достигнут, исполнитель вынужден
    ставить `event_unconfirmed` (семантика «недостаточно данных»), потому что `event_contradicted` требует
    patch_required, а патчить нечего (событие никто не заявлял). Побочный эффект: 10 таких записей у ASTS попали в
    `pending_events`, и итог стал PASS_WITH_DECLARED_PENDING вместо PASS, хотя ничего не ожидает. Просьба: статус
    `condition_not_met` (runtime_verified: false, patch_required: false, gate_effect: pass, не считается pending) и
    правило, что он не влияет на итог.
2.2 **Регулярные проверки условий ≠ разовые события.** Переходы вида «выручка ≥ X два квартала подряд» это проверка
    KPI, а не событие; в `event_items` они дублируют секции KPI/осей и требуют пояснений в notes. Просьба: поле
    `claim_type: kpi_threshold_check | discrete_event` у event_item (или вынести threshold-проверки в отдельную
    секцию `transition_checks[]` со ссылками на kpi_item_refs и `history_evaluation_ref`), чтобы разовые события
    (запуск, контракт, регуляторное решение, финансирование) и проверки порогов не смешивались.
2.3 **Ось с каноническим состоянием pending_verification** (NBIS Capacity_Secured): в states.yaml нет критерия для
    «pending_verification», исполнителю пришлось писать псевдокритерий. Просьба: разрешить `criteria: null` +
    `pending_reason` для таких осей.
2.4 **Логическое вложение окон наблюдения.** Критерий оси Constellation_Deployment «≥3 запуска за trailing 90 days»
    проверялся по KPI «6 spacecraft within 50 days»: 50-дневное окно вложено в любое 90-дневное, содержащее его —
    исполнитель обосновал это в notes. Просьба: явное правило entailment между окнами разной длины в одном критерии
    (когда окно факта короче окна критерия и целиком внутри него — критерий выполнен; обратное — нет; период
    факта при этом не переименовывается).
2.5 **derived_fact с разными базами в candidate и found** (ASTS-KPI-09: candidate — годовое значение, found —
    сумма H1, formula_recomputed_value — годовое): схема допускает, но читается двусмысленно. Просьба: у item поле
    `found.basis_note` или правило «found.value всегда в базе кандидата, исходные слагаемые — в
    normalization.steps».
2.6 **`qualifier_patch_suggested` — только уровень отчёта.** В state.json это поле схемой запрещено (исполнитель
    упёрся в валидатор папки); runtime-запись отражает только `observation_qualifier`. Просьба зафиксировать в
    протоколе и в пояснении к схеме явно.
2.7 **История прогонов у наблюдений.** По нашему указанию исполнитель перепривязал неизменившиеся наблюдения к
    новому run_id, и ссылка на первый прогон в state.json потерялась (отчёт первого прогона цел). Просьба к
    v1.2 + Artifact Schema v1.0.5: `kpi_observations[].verification_run_ids: [..]` (список, новый прогон
    добавляется, старые сохраняются) при сохранении `verification_run_id` = последний, для обратной
    совместимости; правило «наблюдение не дублируется, если значение и период не изменились».
2.8 **Доставка.** Исполнитель ASTS отправил сообщение владельцу инструментом отправки, а не финальным текстом
    (доставлено, но правило задания нарушено) — это к нашей инструкции, не к протоколу; упоминаю для полноты.

## 3. Заказ: Dozor Verification Protocol v1.2 + Company Artifact Schema v1.0.5
3.1 Статус `condition_not_met` для event_items (2.1) с label_ru «условие не выполнено» и правилами
    runtime/gate/patch; итог PASS, если нет иных pending.
3.2 Разделение threshold-проверок и разовых событий (2.2) — предпочтительно отдельная секция `transition_checks[]`
    (trigger_id, axis, transition from/to, condition, kpi_item_refs, history_evaluation_ref | null, result:
    met | not_met | pending_history, runtime_verified, patch_required) — тогда `event_items[]` остаётся только
    для дискретных фактов.
3.3 `criteria: null` + `pending_reason` у axis_item при каноническом pending_verification (2.3).
3.4 Правило entailment окон наблюдения (2.4).
3.5 Правило базы для found у derived_fact (2.5) и явная оговорка про qualifier_patch_suggested (2.6).
3.6 Artifact Schema v1.0.5: `kpi_observations[].verification_run_ids` (2.7); остальное без изменений; Candidate
    Schema не меняется.
3.7 Обратная совместимость: отчёты v1.0 и v1.1 (вложения) валидны по схеме v1.2; пример полного отчёта v1.2 по ASTS
    с transition_checks (10 переходов, все not_met) и одним дискретным событием.
Критерии приёмки те же, что для v1.1: схема валидна; оба живых отчёта проходят; все новые статусы имеют
label_ru, runtime_verified, gate_effect, default_patch_required.

## 4. Что дальше у нас
Прогоны по остальным 11 моделям пойдут уже по v1.2 (отчётный сезон Q3 начнётся в конце октября, до него — по
текущим документам Q2). Партия 3 IMA (Roles & Seams, Integration Protocol, Golden Cases v0.2, Acceptance Record) —
после v1.2. Параллельно отправлен заказ по спецификации Conditional MC v1.1 и калибровкам SPCX/NBIS/NVDA.

=== КОНЕЦ ===

## Вложения (Downloads/dozor-v12-to-llm)
- `verify-NBIS-20260922T210122Z.json`, `verify-ASTS-20260923T060714Z.json` — живые отчёты v1.1.
- `dozor-run2.feedback.md`, `dozor-run3-asts.feedback.md` — обратная связь исполнителя по двум прогонам.
