# Dozor Verification Protocol v1.0

Дата: 2026-09-22  
Статус: proposed normative  
Gate: `G8_SOURCE_VERIFICATION`

## 1. Роль

Дозор не является вторым Investment Modeling Agent.

Его задача — независимо воспроизвести evidence для KPI и сказать, совпадает ли canonical/candidate value с разрешённым источником.

EvidencePack LLM используется как указатель, но не как доказательство сам по себе.

## 2. Статусы на KPI

- `verified_match`
- `verified_match_with_normalization`
- `mismatch_value`
- `mismatch_period`
- `mismatch_semantics`
- `formula_mismatch`
- `source_not_allowed`
- `source_unavailable_technical`
- `source_conflict`
- `not_disclosed`
- `not_found`

Ключевые различия:

`not_found != not_disclosed != source_unavailable_technical`.

## 3. Сверка числа

До сравнения разрешены только детерминированные преобразования:

- `% ↔ fraction`;
- thousand/million/billion/trillion;
- bps ↔ percentage points;
- заявленные единицы.

Опубликованное число считается совпавшим, если после unit normalization кандидат попадает в интервал округления исходного числа (± половина единицы последнего опубликованного десятичного знака).

Для `derived_fact` формула пересчитывается из независимо подтверждённых слагаемых. Default relative tolerance — 0.1%, если точность опубликованных исходных данных не задаёт более широкий half-ULP interval.

## 4. Период — часть факта

Совпавшее число с неправильным периодом получает `mismatch_period`.

Например:

`within 50 days` нельзя подтвердить как `trailing 90 days`.

## 5. Guidance

Если источник говорит target/guidance, а KPI записан как `actual`, статус:

`mismatch_semantics`.

Число при этом может быть идентично.

## 6. Нераскрытое

`not_disclosed` допустим только при установленной границе disclosure.

Правильный artifact:

```yaml
last_value: null
observation_qualifier: not_separately_disclosed
```

Если источник просто не найден — `not_found`, а не `not_disclosed`.

## 7. Техническая недоступность

SEC 403, усечённый fetch, network/auth/tool failure не являются доказательством отсутствия факта.

После предусмотренных повторов:

`source_unavailable_technical`.

Такой результат не должен автоматически исправлять KPI.

## 8. Gate result

`PASS`:
все KPI подтверждены либо корректно подтверждено `not_disclosed`.

`PASS_WITH_DECLARED_PENDING`:
единственные unresolved KPI уже были честно записаны как `last_value:null + pending_verification`.

`PATCH_REQUIRED`:
value/period/semantics/formula/source-policy mismatch, либо numeric KPI не найден там, где кандидат утверждает значение.

`BLOCKED_TECHNICAL`:
не удалось выполнить проверку по технической причине.

`BLOCKED_SOURCE_CONFLICT`:
разрешённые авторитетные источники конфликтуют; запрещено молча выбрать удобный.

## 9. Runtime mutation

Дозор может обновить принадлежащие ему runtime verification records.

Он не переписывает молча:

- canonical KPI;
- state criteria;
- trigger condition;
- canonical ID.

Расхождение формирует patch-required workflow.

`Trigger != Decision` сохраняется.
