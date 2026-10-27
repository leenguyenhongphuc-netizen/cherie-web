/* Kiểm website và các app của Chérie bằng trình duyệt thật (Playwright có sẵn trên máy agent).
   Dùng: node tools/kiem-web.js [gốc, mặc định https://cherie.io.vn]
   In ra JSON: mỗi trang có tải được không, lỗi trình duyệt, file hỏng; trang chủ thêm số đầm và ảnh hỏng.
   Không đăng nhập, không bấm gì làm đổi dữ liệu. */
const base = (process.argv[2] || 'https://cherie.io.vn').replace(/\/$/, '');
const PAGES = [['web', '/'], ['quay', '/quay/'], ['stylist', '/stylist/'], ['marketing', '/marketing/'], ['admin', '/admin/']];
(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.log(JSON.stringify({ ok: false, loi: 'Máy không có Playwright, dùng curl thay thế' })); process.exit(2); }
  const b = await chromium.launch();
  const out = { goc: base, luc: new Date().toISOString(), trang: [] };
  for (const [ten, p] of PAGES) {
    const ctx = await b.newContext({ viewport: { width: 400, height: 860 } });
    const w = await ctx.newPage();
    const r = { trang: ten, url: base + p, tai: false, loiJS: [], fileHong: [] };
    w.on('pageerror', e => r.loiJS.push(String(e.message || e).slice(0, 200)));
    w.on('console', m => { if (m.type() === 'error') r.loiJS.push(('console: ' + m.text()).slice(0, 200)); });
    w.on('response', x => { if (x.status() >= 400 && x.url().startsWith(base)) r.fileHong.push(x.status() + ' ' + x.url().replace(base, '')); });
    try {
      const res = await w.goto(base + p + '?v=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
      r.http = res ? res.status() : 0;
      await w.waitForTimeout(ten === 'web' ? 9000 : 5000);
      r.tai = r.http < 400;
      r.tieuDe = await w.title();
      r.chu = (await w.evaluate(() => document.body.innerText.length)) || 0;
      if (ten === 'web') {
        r.soDam = await w.locator('.open[data-sp]').count();
        r.anhHong = await w.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.src).map(i => i.src.slice(0, 120)).slice(0, 10));
        r.ok = r.tai && /CHÉRIE/i.test(r.tieuDe) && r.soDam > 0 && !r.loiJS.length;
      } else r.ok = r.tai && r.chu > 20 && !r.loiJS.length;
    } catch (e) { r.loi = String(e.message || e).slice(0, 200); r.ok = false; }
    out.trang.push(r); await ctx.close();
  }
  await b.close();
  out.ok = out.trang.every(x => x.ok);
  console.log(JSON.stringify(out, null, 1));
})().catch(e => { console.log(JSON.stringify({ ok: false, loi: String(e.message || e) })); process.exit(1); });
