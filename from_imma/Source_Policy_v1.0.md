# Source Policy v1.0

Дата: 2026-09-22  
Статус: proposed normative

## 1. Назначение

Это единый норматив для IMA, Company Candidate/Artifact schemas и Dozor G8.

Он заменяет распределённые по company YAML/agent instructions правила источников, но не меняет уже принятые экономические модели.

Главные инварианты:

- `guidance ≠ actual`;
- `fact ≠ news`;
- нераскрытое значение не оценивается;
- техническая недоступность источника не превращается в `not_found`;
- период источника сохраняется дословно;
- тип документа определяется содержанием, а не только доменом.

## 2. Классы

### regulatory_filing

Форма/тело обязательной регуляторной отчётности: 10-Q, 10-K, 20-F, 6-K и т.п.

### issuer_ir_release

Официальный issuer earnings/news release, включая Exhibit 99 release, размещённый на SEC.

### issuer_investor_presentation

Официальные earnings/investor slides/presentation.

### issuer_transcript

Официальный transcript/webcast transcript. Это primary verbal evidence, но при наличии письменного filing/release точные бухгалтерские цифры берутся из письменного документа.

### other_primary

Регулятор, государственный орган, биржа, официальный operational update эмитента, официальный контрагент.

### first_tier_media

Вторичный источник. Для событий без доступного первичного источника требуется два независимых first-tier media. Не заменяет первичный источник при сверке финансового KPI.

### market_data_provider

Только цена и FX. В v1 Yahoo не используется как фундаментальный источник.

## 3. Важное правило классификации

Домен не является достаточным классификатором.

Например:

- SEC 10-Q → `regulatory_filing`;
- earnings release как SEC Exhibit 99 → `issuer_ir_release`;
- investor presentation как SEC exhibit → `issuer_investor_presentation`.

## 4. Guidance / actual / estimate

`value_type`:

- `actual`
- `company_guidance`
- `analyst_estimate`

Квалификатор наблюдения хранится отдельно:

- `exact`
- `approximate`
- `lower_bound`
- `upper_bound`
- `range`
- `not_separately_disclosed`
- `pending_verification`

Например «raising year-end contracted power target to 5 GW»:

```yaml
last_value: 5.0
value_type: company_guidance
observation_qualifier: exact
```

Это не `actual`.

## 5. Период

Нельзя менять семантику периода ради удобства модели.

`within 50 days` остаётся `within 50 days`.

Если нужен `trailing 90 days`, он вычисляется отдельно из дат событий как `derived_fact`.

## 6. Нераскрытые значения

Если issuer не раскрывает отдельный показатель:

```yaml
last_value: null
observation_qualifier: not_separately_disclosed
```

Запрещено подставлять оценку LLM.

`not_found` и `not_separately_disclosed` — разные состояния.

## 7. SEC / технический доступ

Для SEC обязателен настроенный User-Agent с идентификацией приложения и контактом.

HTTP 403 без корректного UA сначала считается технической проблемой. После повторов/официального alternate URL результат может быть `source_unavailable_technical`, но не `not_found`.

Аналогично усечённый web fetch не доказывает отсутствие факта в документе.

## 8. Market cap

Базовое правило v1:

`market_cap = verified shares_outstanding × verified market price`

с provenance `derived_fact`.

Yahoo/market-data provider не становится фундаментальным source класса компании.
