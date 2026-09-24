# Feedback: целевое дозакрытие прогона HOOD (verify-HOOD-20260924T070242Z)

## Дозакрываемый прогон
verify-HOOD-20260923T194500Z (итог BLOCKED_TECHNICAL: HOOD-KPI-01/02/03 недоступны технически, ось
Regulatory_Product — PATCH_REQUIRED). Этот прогон закрывает оба разрыва.

## Поведение IR-сайта для агента (повторная проверка 24.09)
- `investors.robinhood.com`: TLS handshake проходит (валидный Let's Encrypt сертификат, action цепочка
  корректна), но HTTP/2 запрос завершается `stream 1 was not closed cleanly: INTERNAL_ERROR (err 2)` —
  сервер не возвращает ни заголовков, ни тела. HTTP код 000 (curl не получил ответ). Совпадает с
  прошлым прогоном 23.09 (connection resets / timeouts) — поведение стабильно повторяется, не разовый сбой.
  Похоже на антибот-защиту (проверка браузера/JS), которая молча закрывает поток для non-browser TLS/HTTP2
  клиентов, а не отдаёт 403/капчу с телом.
- `newsroom.aboutrobinhood.com`: доступен (HTTP 301→302→ конечная страница robinhood.com/us/en/newsroom/...
  вернула 404 для released релиза августовских данных — по-видимому, зеркало не публикует операционные
  monthly-релизы, только корпоративные новости). Поиск по домену (`?s=...`) отработал (HTTP 200), но
  результатов по конкретному релизу не нашёл за разумное время без углублённого парсинга поисковой выдачи.
- Итог: как и в прошлом прогоне, для monthly operating data релизов у investors.robinhood.com нет рабочего
  альтернативного официального канала (ни 8-K, ни newsroom-зеркала). Единственный практический путь при
  технической недоступности IR-сайта — ручное получение файла владельцем через браузер.

## Что нашлось по оси Regulatory_Product (G2) — целевой поиск в 10-Q Q2 2026
Прошлый прогон (23.09) искал в общих разделах 10-Q (Item 1A Risk Factors, событие contracts general
discussion) и не нашёл ни подтверждения, ни опровержения. Целевой повторный поиск (по ключевым словам
`cease`, `suspend`, конкретные штаты) нашёл в **Note 15 Commitments & Contingencies, подраздел «Event
Contracts Litigation»** прямую цитату:

> «In Nevada, the court denied RHD's motion for a preliminary injunction. Robinhood has agreed to cease
> offering new sports-related event contracts in Nevada as of December 1, 2025, and to take action to
> explore unwinding longer-duration open sports-related event contracts in Nevada, in exchange for the
> State's agreement to refrain from enforcing its state gaming laws during the pendency of RHD's appeal.
> RHD appealed the decision to the U.S. Court of Appeals for the Ninth Circuit... both of which remain
> pending.»

Это конкретный продукт (новые спортивные event contracts) прекращён в конкретной юрисдикции (Невада) —
буквально соответствует критерию G2. Разница с прошлым поиском: раздел риск-факторов (Item 1A) описывает
общие потенциальные будущие сценарии; фактическое соглашение о цессии находится в примечании к финансовой
отчётности (Note 15), в подразделе судебных разбирательств по конкретным штатам — нужно было искать там,
а не в общих риск-факторах о регулировании event contracts.

Важное уточнение для будущих прогонов HOOD: ограничение в Неваде — результат добровольного соглашения
Robinhood со штатом (в обмен на приостановку правоприменения на время апелляции), не прямого регуляторного
предписания/судебного запрета. Формально это всё ещё «required to cease» в широком смысле (согласие было
условием избежать принудительного правоприменения), но это не тождественно принудительному судебному
запрету. Если протокол в будущем потребует различать «voluntary cessation under litigation settlement» vs
«court-ordered/regulator-ordered cessation» — это отдельная развилка для критерия G2, сейчас не различается.

## Обращения к источникам и время
- `investors.robinhood.com` (news-release): 1 попытка curl (HTTP/2, 25s timeout) — HTTP 000, stream error.
  ~2 секунды.
- `newsroom.aboutrobinhood.com`: 1 попытка на прямой URL релиза (301→302→404), 1 попытка на поиск (200,
  без явного результата за отведённое время). ~3 секунды суммарно.
- `www.sec.gov` 10-Q (hood-20260630.htm): 1 запрос curl -A, HTTP 200, 2.97 МБ, ~4 секунды. Разбор — grep по
  ключевым словам + точечный python-срез контекста, без повторных полных перечитываний (в пределах лимита
  «не более 2 обращений к документу»).
- Локальный PDF (`_sources/HOOD_AUG_OPS_2026-09-10.pdf`, 318 773 байта, sha256
  `f83fcec3828fdc48071b946205374a067f1e70be55882eb0fd54d69575c25394`): извлечён через npm-пакет
  `pdf-parse` (класс `PDFParse`, метод `getText()`) — в контейнере не было `pdftotext`/`pypdf`/`pip`
  (нет sudo для apt-get install), пришлось искать рабочий путь через Node.js (уже установлен). Извлечение
  дало чистый текст без искажений — таблица месячных метрик распозналась корректно.

## Предложение к протоколу: как оформлять источник, полученный владельцем вручную
Формат из задания сработал без проблем: `evidence_locator` со строкой вида «local copy <путь>
(obtained by owner via browser <дата>; site returns no response to non-browser clients)» + `source_check.
technical_status: accessible` (не `unavailable_technical`, так как агент реально прочитал документ) +
`source_check.url` = оригинальный URL релиза (не путь к локальному файлу). Предлагаю закрепить это как
нормативный паттерн `evidence_locator` протокола для класса «источник получен человеком вручную, агент не
имел прямого сетевого доступа» — с обязательными элементами: (1) относительный путь к файлу в workspace,
(2) кто и как получил («obtained by owner via browser»), (3) дата получения, (4) причина, почему агент не
мог получить сам («site returns no response to non-browser clients» / другая формулировка технического
отказа). Также стоит явно указать в протоколе, что `technical_status` в этом случае — `accessible` (текст
факта был реально прочитан и процитирован), а не `unavailable_technical` (это поле относится к попытке
агента получить источник напрямую по сети, а не к возможности прочитать текст вообще).

Отдельно: инструменты извлечения текста из PDF в контейнере отсутствуют (`pdftotext`, `pypdf`, `pip` —
все недоступны, нет sudo для `apt-get install`). Сработавший путь — `npm install pdf-parse` (доступен
Node.js без sudo) и класс `PDFParse.getText()`. Стоит зафиксировать в AGENTS.md/протоколе как известный
рабочий способ для будущих прогонов с PDF-источниками, чтобы не терять время на перебор `pypdf`/`pip`/
`apt-get`.

## Итог валидатора
Первая версия отчёта была отклонена (`pass: false`) по трём причинам:
1. **DZR-003** (transition_checks.runtime_verified) — при `result: not_met` runtime_verified должен быть
   `false`, а не `true` (аналогично прошлому паттерну DZR-003 в других прогонах — стоит запомнить как
   стандартное правило: not_met => runtime_verified: false).
2. **DZR-011** (kpi_item_refs) — у HOOD-E-09 (transition_checks) был указан `kpi_item_refs: ["HOOD-KPI-09"]`,
   но HOOD-KPI-09 не входит в `items` этого прогона (items этого прогона — только KPI-01/02/03); исправлено
   на пустой список, KPI-09 остался только в event_item context прошлого прогона.
3. **DZR-010** (gate_aggregation) — summary.overall_status был `PASS`, но при наличии `pending_history` у
   HOOD-E-09/E-11 старшинство требует `PASS_WITH_DECLARED_PENDING` (десять положительно проверенных
   «условие не выполнено» дают PASS, но pending-переходы — не то же самое; это правило уже было в задании
   §10, но легко упустить при первой сборке отчёта — стоит явно проверять итоговый summary против списка
   pending_transition_checks перед записью).
После правок повторный прогон вернул `pass: true`, `integrity: []`.
