// Условный наблюдатель spacex-price-watch (OpenClaw trigger script).
// Покрывает SPCX-P-01 (<$100) и SPCX-P-02 (<$80) из portfolio/spacex/triggers.yaml.
// Срабатывает ТОЛЬКО при смене зоны (пересечение порога вверх или вниз), состояние в trigger.state.
// Модель до срабатывания не вызывается. Пороги отсортированы по убыванию.
const THRESHOLDS = [
  { id: 'SPCX-P-01', level: 100, action: 'Удвоить транш' },
  { id: 'SPCX-P-02', level: 80,  action: 'Утроить транш. Пут-опционы (страйк $90–100, экспирация январь 2027) защищают от каскада <$80' },
];
const URL = 'https://query1.finance.yahoo.com/v8/finance/chart/SPCX?range=1d&interval=1d';
const prev = trigger.state || {};
const res = await exec({ command: `curl -s -m 20 -A "Mozilla/5.0" "${URL}"` });
const raw = String(res?.aggregated ?? '').trim();
let price = null;
try {
  const j = JSON.parse(raw);
  const p = j?.chart?.result?.[0]?.meta?.regularMarketPrice;
  if (typeof p === 'number' && p > 0) price = p;
} catch (e) {}

if (price === null) {
  const fails = (prev.fails || 0) + 1;
  // эскалация: на 2-м подряд сбое, затем каждые 12 проверок (раз в ~6 часов при шаге 30 мин)
  const fire = fails === 2 || (fails > 2 && fails % 12 === 0);
  json({
    fire,
    message: fire ? `SPCX-WATCH: источник котировок недоступен ${fails} проверок подряд (yahoo chart). Триггеры SPCX-P-01/02 сейчас НЕ отслеживаются.` : undefined,
    state: { ...prev, fails },
  });
} else {
  const zone = THRESHOLDS.filter(t => price < t.level).length; // 0: >=100, 1: <100, 2: <80
  const prevZone = prev.zone;
  const changed = typeof prevZone === 'number' && zone !== prevZone;
  let message;
  if (changed && zone > prevZone) {
    const crossed = THRESHOLDS.slice(prevZone, zone);
    message = `[ДЕЙСТВИЕ] SpaceX (SPCX) $${price}: пробит(ы) вниз порог(и) ${crossed.map(t => '$' + t.level).join(', ')}. ` +
      crossed.map(t => `Триггер ${t.id}: ${t.action}`).join(' | ');
  } else if (changed) {
    const crossed = THRESHOLDS.slice(zone, prevZone);
    message = `[СПРАВОЧНО] SpaceX (SPCX) $${price}: цена вернулась выше ${crossed.map(t => '$' + t.level).join(', ')} — ${crossed.map(t => `${t.id} («${t.action}») больше не показан`).join('; ')}; действий не требуется.`;
  }
  json({
    fire: changed,
    message,
    state: { zone, price, at: new Date().toISOString(), fails: 0 },
  });
}
