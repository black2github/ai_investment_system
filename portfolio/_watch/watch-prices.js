// Условный наблюдатель aiinfra-price-watch (OpenClaw trigger script), несколько тикеров.
// Уровни ВХОДА («купить при цене ≤ X»): срабатывает при входе в новую, более низкую зону.
// Возврат выше уровня — тоже сообщение (информационное). Первая оценка: если уровень УЖЕ выполнен —
// сообщить (иначе владелец никогда не узнает о выполненном условии). Состояние — trigger.state.zones[symbol].
// Модель до срабатывания не вызывается. Пороги отсортированы по убыванию.
const WATCH = [
  { symbol: 'ETN',   label: 'Eaton (ETN)',       cur: '$', levels: [
    { id: 'ETN-P-01', level: 400, action: 'Купить 10% портфеля (транш 1 из 3)' },
    { id: 'ETN-P-02', level: 375, action: 'Купить 10% портфеля (транш 2 из 3)' },
    { id: 'ETN-P-03', level: 350, action: 'Купить 10% портфеля (транш 3 из 3)' } ] },
  { symbol: 'SU.PA', label: 'Schneider (SU)',    cur: '€', levels: [
    { id: 'SU-P-01',  level: 280, action: 'Купить 5% портфеля (транш 1 из 3)' },
    { id: 'SU-P-02',  level: 260, action: 'Купить 7.5% портфеля (транш 2 из 3)' },
    { id: 'SU-P-03',  level: 240, action: 'Купить 7.5% портфеля (транш 3 из 3)' } ] },
  { symbol: 'NET',   label: 'Cloudflare (NET)',  cur: '$', levels: [
    { id: 'NET-P-01', level: 275, action: 'Купить 5% портфеля (транш 1 из 3)' },
    { id: 'NET-P-02', level: 250, action: 'Купить 5% портфеля (транш 2 из 3)' },
    { id: 'NET-P-03', level: 225, action: 'Купить 5% портфеля (транш 3 из 3)' } ] },
];
const prev = trigger.state || {};
const zones = { ...(prev.zones || {}) };
const fails = { ...(prev.fails || {}) };
const msgs = [];
let fire = false;

for (const w of WATCH) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(w.symbol)}?range=1d&interval=1d`;
  const res = await exec({ command: `curl -s -m 20 -A "Mozilla/5.0" "${url}"` });
  let price = null;
  try {
    const j = JSON.parse(String(res?.aggregated ?? '').trim());
    const p = j?.chart?.result?.[0]?.meta?.regularMarketPrice;
    if (typeof p === 'number' && p > 0) price = p;
  } catch (e) {}

  if (price === null) {
    fails[w.symbol] = (fails[w.symbol] || 0) + 1;
    const n = fails[w.symbol];
    if (n === 2 || (n > 2 && n % 12 === 0)) {
      fire = true;
      msgs.push(`${w.label}: источник котировок недоступен ${n} проверок подряд — уровни ${w.levels.map(l => l.id).join(', ')} не отслеживаются.`);
    }
    continue;
  }
  fails[w.symbol] = 0;
  const zone = w.levels.filter(l => price <= l.level).length;
  const prevZone = zones[w.symbol];
  const fmt = `${w.cur}${price}`;
  // [ДЕЙСТВИЕ] — требует решения владельца (уровень входа достигнут); [СПРАВОЧНО] — цена ушла выше уровня,
  // ожидаемое действие больше не показано; агент пишет такое в info_log и не тревожит владельца сразу.
  if (typeof prevZone !== 'number') {
    if (zone > 0) {
      fire = true;
      const done = w.levels.slice(0, zone);
      msgs.push(`[ДЕЙСТВИЕ] ${w.label} ${fmt}: на момент запуска дозора уже выполнено: ${done.map(l => `${l.id} (цена ≤${w.cur}${l.level}) → ${l.action}`).join('; ')}.`);
    }
  } else if (zone > prevZone) {
    fire = true;
    const crossed = w.levels.slice(prevZone, zone);
    msgs.push(`[ДЕЙСТВИЕ] ${w.label} ${fmt}: достигнут(ы) уровень(и) входа ${crossed.map(l => `${l.id} (цена ≤${w.cur}${l.level}) → ${l.action}`).join('; ')}.`);
  } else if (zone < prevZone) {
    fire = true;
    const crossed = w.levels.slice(zone, prevZone);
    msgs.push(`[СПРАВОЧНО] ${w.label} ${fmt}: цена поднялась выше ${crossed.map(l => w.cur + l.level).join(', ')} — ${crossed.map(l => `${l.id} («${l.action}») больше не показан`).join('; ')}; действий не требуется, ждём возврата цены ниже уровня.`);
  }
  zones[w.symbol] = zone;
}

json({
  fire,
  message: fire ? msgs.join('\n') : undefined,
  state: { zones, fails, at: new Date().toISOString() },
});
