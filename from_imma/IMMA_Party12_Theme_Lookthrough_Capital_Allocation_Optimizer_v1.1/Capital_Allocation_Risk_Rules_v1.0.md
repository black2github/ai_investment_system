# Capital Allocation Risk Rules v1.0

Дата: 2026-10-03  
Партия: 12  
Статус: proposed normative

## 1. Подход
Многопрофильность не объявляется заранее плюсом или минусом. Внутренний рынок капитала может сглаживать циклы и финансировать опциональность, но также создаёт риск неэффективного перераспределения. Поэтому blanket conglomerate penalty запрещён.

## 2. KPI
Отслеживаются segment revenue share, capex share, operating margin, capex/revenue, capex-share minus revenue-share, consecutive negative EBITDA (если раскрывается), число reportable segments и resegmentation/recast.

## 3. CAR-X triggers
CAR-X1…X5 хранятся machine-readable. Все численные пороги v1.0 имеют `provenance=model_assumption` и `threshold_status=pending_owner_judgment`. До решения владельца допустим `candidate_if_threshold_approved`, но не fired. Trigger ≠ Decision.

## 4. Cross-subsidization
Нельзя утверждать cross-subsidization лишь из coexistence прибыльного и убыточного сегментов. Требуется allocation evidence: capex, disclosed funding/commitment или иной прямой факт.

## 5. SOTP
`SOTP_equity = Σ independently_valued_segments - net_debt - corporate_adjustments`.
`ConglomerateDiscount = 1 - MarketEquity/SOTP_equity`.
Positive = discount, negative = premium. Warning threshold 20% пока model_assumption/pending owner. SOTP diagnostic only; market cap не calibration target.

## 6. Lifecycle
Segment fact может создать CLR-1/2/3 basis; сам CAR warning не является автоматическим основанием перекалибровки.

## 7. SPCX first application
Q2 reported; Q1 = exact H1-Q2 derivation from same 10-Q. CAR-X1 (AI) and CAR-X3 (Space, AI) are only candidates under proposed thresholds; CAR-X2 is not evaluated without consistent segment EBITDA; SOTP is not computed.
