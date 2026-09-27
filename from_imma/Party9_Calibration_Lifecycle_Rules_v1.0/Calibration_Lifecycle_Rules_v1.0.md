# Calibration Lifecycle Rules v1.0

**Статус:** proposed normative  
**Дата:** 2026-09-27  
**Партия:** 9  
**Область:** lifecycle RV/MC-калибровок компаний  
**Принцип:** Trigger ≠ Decision. Lifecycle определяет, когда калибровка должна быть проверена, изменена или переиздана; он не принимает портфельных решений.

## 1. Назначение и границы

`Calibration_Lifecycle_Rules v1.0` — единый нормативный дом **оснований пересмотра калибровок** и маршрутизации:

`основание -> затронутый артефакт -> отклик -> срочность -> обязательная приёмка`.

Этот норматив **не дублирует**:
- правила подтверждения фактов Dozor;
- trigger/state-transition thresholds из company artifacts;
- математические критерии Reverse Valuation;
- hard caps и алгоритм MC-G5-013;
- правила robustness/Stability;
- архетипные определения A/B/C;
- правило обмена «полный текст + дельта» для переиздания.

Он только ссылается на их действующие версии.

Терминология русскоязычных текстов: **«происхождение»**. Имя YAML-поля `provenance` не меняется.

## 2. Состояния lifecycle

Для каждой принятой RV/MC-калибровки интегратор может вести одно из состояний:

- `current` — оснований для изменения/обязательной ревалидации нет;
- `review_required` — основание обнаружено, но тип отклика ещё не классифицирован;
- `revalidation_required` — файл не меняется, но нормативные проверки должны быть повторены до следующего нормативного прогона;
- `recalibration_required` — требуется patch/reissue/archetype_change;
- `superseded` — существует принятая более новая версия.

`review_required` и `revalidation_required` не означают автоматически, что параметры должны измениться.

## 3. Что НЕ является основанием для перекалибровки

Следующие изменения сами по себе **не являются CLR-основанием** и требуют только соответствующего перепрогона:

1. **Цена, капитализация, `equity_value_0`.** Рыночная цена/капитализация — run input. Изменение цены не меняет intrinsic calibration nodes и не является основанием подгонять параметры к рынку.
2. **Вероятности сценариев, портфельные лимиты и режимы.** Это `owner_judgment` / portfolio-layer inputs. Они меняют смесь/оптимизацию, но не company calibration.
3. **Результаты Stability/robustness diagnostics или оптимизатора сами по себе.** Нежелательный результат не является основанием менять калибровку. Если отдельным независимым анализом обнаружен дефект параметра/логики, основание классифицируется как CLR-6.
4. **Диагностики valuation basis (`bridge_dependent`, `positive_fcf_bridge_share`, parity margin, W-band).** Это diagnostics/model-risk inputs. Они не являются calibration targets и не запускают изменение параметров без отдельного CLR-основания.
5. **Изменение owner conviction / target weight / cash target.** Это слой решения/портфеля.

Запрещено создавать CLR-основание постфактум только потому, что новая калибровка должна дать «более желаемый» CAGR, ES5, W, P(2x) или оптимальный вес.

## 4. Типы отклика

### 4.1 `rerun_only`

Калибровочный файл не меняется. Повторяется только соответствующий RV/MC/scenario/portfolio run с новыми run inputs.

### 4.2 `revalidate_no_change`

Калибровочный файл не меняется, но повторяется нормативная проверка под изменившимся внешним контрактом/Joint Layer.

Изменение root mapping/correlation Joint Layer требует повторного MC-G5-013 для **всех** company MC calibrations, потому что измеренная sigma зависит от совместной динамики корней. Конкретный алгоритм и hard caps остаются в `Joint_Simulation_Layer_Rules` / `Company Conditional MC`.

Если ревалидация проходит — версия файла не меняется. Если нет — дальнейший отклик становится patch/reissue по CLR-4 или CLR-6.

### 4.3 `patch`

Локальная корректировка при неизменных:
- archetype;
- наборе сегментов/service segments/milestones;
- distribution family каждого существующего узла;
- margin-model method;
- valuation-basis family;
- active-driver set и topology mapping paths;
- currency/perimeter semantics;
- schema/engine valuation semantics.

Допустимы изменения существующих leaf values, их `provenance`/rationale и локальные effect sizes.

Типовые примеры: deterministic resize существующих mapping effects после MC-G5-013; исправление локального verified fact или формулы, не меняющее структуру модели.

### 4.4 `reissue`

Полное переиздание внутри того же archetype, если меняется хотя бы один структурный/семантический элемент:
- calibration/schema semantics;
- engine valuation semantics;
- segment/perimeter composition;
- distribution family;
- margin-model method;
- valuation-basis interpretation;
- active-driver set или mapping path topology;
- currency basis;
- material corporate transaction, затрагивающая несколько блоков;
- несколько связанных top-level calibration blocks вследствие одного основания.

Переиздание следует действующему правилу обмена: **полный текст предшественника + дельта**, `supersedes` обязателен. Lifecycle не переопределяет формат этого правила.

### 4.5 `archetype_change`

Смена A/B/C или иная замена структуры узлов, требующая построить новую calibration topology.

Старая версия не редактируется «на месте»: она остаётся записью воспроизводимости и `superseded`-предшественником.

## 5. CLR-1 — новые verified facts и свежесть базового периода

**Detector:** Dozor; при корпоративном событии также triggers/IMMA.  
**Артефакт:** RV, MC или оба.  
**Базовая срочность:** до следующего нормативного company run после материального факта.

### 5.1 Обязательная сверка

После каждого нового периодического первичного отчёта, содержащего данные базового периода, Dozor выполняет сверку принятых calibration anchors: revenue/TTM и сегменты; margins/OCF/FCF/capex; cash/debt; shares outstanding/dilution; backlog/RPO/contracted-demand anchors; другие числа, на которые прямо ссылается calibration rationale/base period.

Dozor определяет факт и статус проверки по своему протоколу. Он **не выбирает** новые calibration parameters.

### 5.2 Срок годности base period

`base_period_max_age_quarters = 2`.

Смысл:
- каждый новый квартал проверяется;
- calibration может оставаться без изменения после одного нового квартала, если все расхождения ниже lifecycle materiality и не возникло структурного события;
- перед нормативным прогоном после публикации **второго более нового полного квартала** базовый период должен быть roll-forward/reviewed;
- если фактический anchor всё ещё старше двух завершённых fiscal quarters, calibration получает `recalibration_required` до следующего нормативного company run.

Для эмитента без квартальной отчётности используется эквивалент календарной длительности: 6 месяцев = 2 квартала.

### 5.3 Lifecycle materiality

Материальность сравнивается **с текущим calibration anchor**, а не с предыдущим кварталом; поэтому накопленный дрейф не теряется.

Порог, ниже которого **калибровочный patch не обязателен**:

| Тип факта | Порог |
|---|---:|
| revenue / TTM revenue / segment revenue / cash / debt / capex и иная положительная денежная величина | `>= 5%` relative |
| backlog / RPO / contracted amount | `>= 10%` relative |
| margin / growth rate / yield / rate / segment mix | `>= 2.0 pp` absolute |
| shares outstanding / diluted share base | `>= 1%` relative |
| смена accounting definition / currency / primary listing / material perimeter | automatic material |
| новый convertible debt / material issuance / M&A / spin / disposal, влияющий на equity bridge или модельный perimeter | automatic material |

Если старый denominator равен/близок к нулю, relative test не применяется: используется соответствующий pp-test либо automatic-material review.

Расхождение ниже порога:
- исправляется/сохраняется в canonical evidence/company artifact по правилам Dozor/Artifact Schema;
- не требует изменения calibration file;
- не даёт права объявлять известный факт «совпавшим» — это именно допустимая lifecycle tolerance;
- может потребовать `rerun_only`, если значение является внешним run input.

### 5.4 Тип отклика CLR-1

- локальный anchor/fact, topology неизменна -> `patch`;
- смена currency/perimeter/capital structure или изменение нескольких model blocks -> `reissue`;
- факт делает текущий archetype невалидным -> CLR-3 / `archetype_change`;
- факт ниже materiality -> no calibration change.

## 6. CLR-2 — state transition и recalibration trigger

**Detector:** triggers + Dozor/state-history evaluator.  
**Артефакт:** RV, MC или оба.

Lifecycle **не повторяет** условия переходов осей из `triggers.yaml` и не повторяет внутриосевые recalibration thresholds из Reverse Valuation Rules. Их выполнение определяется их собственным нормативным домом.

### 6.1 Переход состояния

Подтверждённый state transition создаёт `review_required`, если изменившаяся ось используется как calibration state vector, rationale/model anchor, при выборе segment/margin/valuation/milestone assumptions или при driver materiality/mapping.

Далее:
- структура та же, меняются локальные centers/tails/effects -> `patch`;
- меняется segment/mapping/method/valuation topology или несколько top-level blocks -> `reissue`;
- переход пересекает границу archetype -> CLR-3.

Если ось не влияет на calibration semantics/parameters, переход состояния фиксируется без изменения calibration file.

### 6.2 Recalibration trigger внутри оси без смены state

Любой accepted recalibration-trigger внутри текущего state — **частный случай CLR-2**, даже если state label не меняется.

Отклик определяется структурным воздействием: локальная величина -> patch; structural semantics -> reissue; archetype boundary -> CLR-3.

Lifecycle не копирует конкретные trigger thresholds.

## 7. CLR-3 — смена archetype

**Detector:** Dozor + triggers + IMMA review.  
**Артефакт:** обычно оба; обязательна новая MC topology.  
**Отклик:** `archetype_change`.  
**Срочность:** до следующего нормативного company run после подтверждения boundary.

Определения archetype остаются в `MC_Calibration_Archetypes_*` / `Company Conditional MC`. Lifecycle определяет только момент обязательного review.

### 7.1 C -> B/A: pre-service/milestone -> operating model

Обязательный archetype review, когда одновременно:
1. commercial/service onset подтверждён первоисточником; и
2. actual service/commercial revenue раскрыт **два последовательных reporting quarters**.

Выбор:
- если устойчивого положительного company FCF anchor ещё нет -> B;
- если TTM FCF положителен и два последовательных квартала company FCF положительны, без доказанного one-off working-capital эффекта как единственной причины -> A.

Milestone history, realized launch/service dates, verified pre-service facts и старые run records сохраняются как historical evidence; topology строится заново.

### 7.2 B -> A

Обязательный review, если:
- TTM `OCF - capex > 0`; и
- два последовательных reporting quarters имеют положительный company FCF; и
- используемое определение FCF согласовано с accepted accounting semantics компании.

Это создаёт основание для A, но не заставляет выбирать A, если положительный FCF признан неэкономичным/неустойчивым по отдельным verified facts.

### 7.3 A -> B

Симметричный review, если:
- TTM company FCF <= 0; и
- два последовательных reporting quarters имеют отрицательный company FCF;
- причина не является только явно временным settlement/working-capital timing, уже нормализованным в принятой модели.

### 7.4 Что не является признаком смены archetype

`bridge_dependent`, `positive_fcf_bridge_share`, parity margin, W-band и Monte Carlo outcome statistics — diagnostics only. Они могут быть приложены к review, но **не являются самостоятельным archetype trigger**.

## 8. CLR-4 — изменение нормативов, taxonomy, Joint Layer или engine

**Detector:** validator / IMMA / integrator.  
**Артефакт:** зависит от change scope.  
**Пакетирование:** один package на одно нормативное изменение.

### 8.1 Calibration schema / semantic contract

- semantic migration, меняющая интерпретацию calibration fields -> `reissue` всех затронутых calibrations;
- backward-compatible metadata-only schema change без изменения calibration semantics -> revalidation; file change только если новая schema делает поле обязательным.

Migration delta ожидаема и **не компенсируется** подбором centers/tails ради старого результата.

### 8.2 Taxonomy

Новый/переопределённый driver:
- компании с material exposure или новым mapping -> `reissue`;
- компании без material exposure -> mapping/completeness revalidation, без изменения файла;
- нельзя добавлять mapping только ради увеличения scenario sensitivity.

### 8.3 Joint Simulation Layer

Любое изменение root mapping, root correlation, persistence semantics или joint-driver construction требует:

> **ревалидации всех company MC calibrations по действующему MC-G5-013 до следующего нормативного раунда**.

Причина lifecycle-правила: measured aggregate target sigma зависит от совместной структуры корней даже при неизменном calibration YAML.

Если calibration проходит -> `revalidate_no_change`. Если перестаёт проходить -> минимальный patch/reissue по действующим Joint/MC правилам.

Конкретный алгоритм MC-G5-013 и caps здесь не дублируются.

### 8.4 Rules thresholds / engine

- изменение hard rule threshold -> revalidate все затронутые calibrations;
- изменение engine computation, RNG/seeding без изменения calibration semantics -> rerun/reproducibility update; calibration file не меняется;
- изменение valuation/transition semantics engine -> reissue затронутых calibrations;
- изменение schema `calculation_engine_version` metadata само по себе не является экономическим основанием, но может требовать технического reissue для schema conformity.

## 9. CLR-5 — реализованный failure mode / common cause

**Detector:** Dozor/triggers.  
**Срочность:** immediate.

Подтверждение того, что failure mode/common cause фактически реализовался, не означает автоматического «knockout calibration» постфактум.

Маршрутизация:
- если событие меняет state/axis but topology сохраняется -> CLR-2;
- если событие делает текущий operating archetype невалидным -> CLR-3;
- если это также новый verified corporate/financial fact -> параллельно CLR-1;
- если событие относится к scenario state, scenario engine обрабатывает recognition отдельно; company recalibration требуется только при CLR-1/2/3 основании.

Это предотвращает двойной учёт одного realized shock одновременно как «произошедшего факта» и как будущей stochastic tail.

## 10. CLR-6 — обнаруженный дефект калибровки

**Detector:** validator / IMMA / Dozor / owner issue report.  
**Артефакт:** RV, MC или оба.

К CLR-6 относятся: schema/mapping/reference defect; accepted calibration перестала проходить действующий hard validator **без** изменения upstream normative contract; ошибка формулы/единицы/знака/валюты; неверная связь RV ↔ MC; доказанная semantic inconsistency; экспертное замечание, после проверки превращённое в конкретный дефект.

Не относятся: «результат слишком оптимистичен/пессимистичен»; W/ES/CAGR не нравятся; оптимизатор даёт нежелательный вес.

Отклик: локальный defect -> patch; structural defect -> reissue; неверный archetype -> CLR-3.

Исправление должно иметь независимое обоснование и не подгоняться к market price или desired portfolio output.

## 11. Срочность

### Immediate / before next normative company run

- CLR-1 material verified fact;
- CLR-2 confirmed state transition/recalibration trigger, влияющий на calibration;
- CLR-3 archetype boundary;
- CLR-5 realized critical/high failure mode, влияющий на calibration state;
- CLR-6 hard defect, меняющий численный результат или нарушающий accepted schema/hard gate.

Такая calibration не используется для нового normative portfolio round как `current`, пока lifecycle response не закрыт.

### Revalidate before next round

- CLR-4 Joint/taxonomy/rules change, которое требует массовой ревалидации.

### Next party

- совместимые schema/metadata migrations;
- taxonomy changes для набора затронутых компаний;
- non-critical structural cleanup, если текущий файл остаётся валидным и экономически корректным.

## 12. Пакетирование

1. **Один пакет на одно normative change.** Например Joint vNext -> одна партия revalidation/reissues, вызванных именно этим Joint change.
2. Несвязанный quarterly CLR-1 patch не смешивается с CLR-4 migration только ради удобства, кроме явного заказа владельца.
3. Один company event может создать несколько CLR refs, но итоговый response должен иметь один `primary_basis_id` и связанные secondary refs, чтобы одна причина не исправлялась несколько раз.
4. Перед выпуском фиксируется `affected_set`: какие calibrations должны быть revalidated/reissued и почему.

## 13. Версионирование calibration files

Правило применяется **перспективно**; уже принятые версии сохраняют исторические номера.

SemVer для calibration artifact:
- `patch` -> `PATCH + 1` (`1.2.3 -> 1.2.4`);
- `reissue` в том же archetype -> `MINOR + 1`, `PATCH = 0` (`1.2.3 -> 1.3.0`);
- `archetype_change` / несовместимая новая topology -> `MAJOR + 1`, `MINOR=PATCH=0` (`1.2.3 -> 2.0.0`);
- `revalidate_no_change` / `rerun_only` -> версия calibration file не меняется.

`supersedes` обязателен для любого изменённого calibration artifact.

Старые calibration files и calc runs не удаляются: они остаются immutable reproducibility records.

Любой изменённый calibration artifact передаётся в полном виде; дельта/patch notes передаются отдельно по действующему exchange/reissue rule.

## 14. Acceptance after lifecycle response

Lifecycle не меняет действующие acceptance gates.

После:
- RV patch/reissue -> действующая RV validation/run chain;
- MC patch/reissue/archetype change -> действующая schema + validator + MC-G5-013 + robustness + normative-run chain;
- CLR-4 revalidation -> только требуемые upstream-нормативом проверки; если файл не менялся, новый calibration version не создаётся.

Новая версия становится `current` только после host acceptance.

## 15. Machine-readable registry

Нормативный реестр оснований:
- `Calibration_Lifecycle_Registry_v1.0.yaml`
- schema: `Calibration_Lifecycle_Registry_Schema_v1.0.yaml`

У каждого CLR-N обязательны `detector`, `artifact`, `response`, `urgency`.

Validator проверяет полноту и допустимые enum; конкретные чужие критерии по ссылкам не дублируются.

## 16. Перекрёстные ссылки для следующих редакций смежных нормативов

Точные строки вынесены в `Calibration_Lifecycle_Cross_References_v1.0.md`.

Принцип:
- смежный норматив сообщает **факт/transition/fail**;
- Lifecycle определяет **нужно ли и как менять calibration**;
- exchange/reissue rule определяет **как доставить полный artifact + delta**.

## 17. Нормативные ссылки

- `Dozor_Verification_Protocol_v1.2.1`
- `Company_Artifact_Schema_v1.0.5`
- `Reverse_Valuation_Rules_v1.1`
- `Company_Conditional_Monte_Carlo_Specification_v1.1.3`
- `Joint_Simulation_Layer_Rules_v1.1.2`
- `MC_Calibration_Archetypes_Specification_v1.0`
- действующий IMMA exchange/reissue protocol: full previous text + delta
