const fs=require('fs'),vm=require('vm');
const raw=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).values;
const T={};raw.forEach(r=>{if(!r[5])return;try{const o=JSON.parse(r[5]);(T[r[0]]=T[r[0]]||[]).push(o)}catch(e){}});
const ctx={window:{},console,localStorage:{getItem:()=>null,setItem(){}},document:{addEventListener(){},querySelector:()=>null,createElement:()=>({style:{}}),head:{appendChild(){}}},navigator:{},location:{href:''},setTimeout,clearTimeout,setInterval};ctx.window=ctx;ctx.self=ctx;ctx.addEventListener=()=>{};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(process.argv[3]||require('path').join(__dirname,'..','shared.js'),'utf8'),ctx);const C=ctx.CherieData;
const sp=id=>(T.sp||[]).find(s=>s.id===id),dons=(T.don||[]).filter(d=>!d.demo),cts=T.ct||[];const out=[];
const L=(m)=>out.push(m);
console.log('tables',Object.keys(T).map(k=>k+':'+T[k].length).join(' '));
dons.forEach(d=>{const ls=cts.filter(c=>c.don===d.id);
  if(!ls.length)L(`${d.id}: đơn không có món`);
  ls.forEach(c=>{const s=sp(c.sp);if(!s)return L(`${d.id}/${c.id}: món ${c.sp} không có trong kho`);
    if(c.hu){const lv=C.mucMon?C.mucMon(c):c.muc;const dung=lv&&/^L[2-4]$/.test(lv)?C.phiHu(lv,s,!!d.yenTam):null;if(dung!=null&&dung!==(+c.phiHu||0))L(`${d.id}/${c.sp}: phí hư ${c.phiHu} khác quy tắc ${dung} (mức ${lv}, ${d.yenTam?'có':'không'} gói)`)}
    if(c.mat&&s.tt!=="Mất"&&c.kiemLuc)L(`${d.id}/${c.sp}: đã kiểm là mất nhưng kho ghi "${s.tt}"`);
    if(d.tt==="Đang thuê"&&s.tt!=="Đang thuê")L(`${d.id}/${c.sp}: đơn đang thuê nhưng kho ghi "${s.tt}"`);
    if(d.tt==="Đã đặt"&&s.tt==="Đang thuê"&&!cts.some(x=>x.sp===c.sp&&x.don!==d.id&&(dons.find(o=>o.id===x.don)||{}).tt==="Đang thuê"))L(`${d.id}/${c.sp}: đơn mới đặt nhưng kho ghi đang thuê`);
  });
  if(d.yenTam){const ok=C.phiYenTamDs(ls.map(c=>sp(c.sp)).filter(Boolean));if(d.phiYenTam==null)L(`${d.id}: có gói nhưng không lưu phí gói (đơn cũ, tính 20k/món = ${C.ytCuaDon(d,ls)})`);else if(+d.phiYenTam!==ok)L(`${d.id}: phí gói lưu ${d.phiYenTam}, quy tắc 1% ra ${ok}`)}
  if((d.tt==="Đang thuê"||d.tt==="Đã trả")&&(+d.coc||0)>0&&/Chờ chuyển khoản|Chưa cọc/.test(d.ttCoc||""))L(`${d.id}: đã giao đồ nhưng cọc "${d.ttCoc}"`);
  if(d.tt==="Đã trả"&&d.ttCoc==="Chờ hoàn"){const q=C.quyetToan(d,ls);L(`${d.id}: chờ quầy kiểm và hoàn cọc · hoàn ${q.hoan}${q.conNo?' · KHÁCH CÒN NỢ '+q.conNo:''}${ls.every(c=>c.kiemLuc)?'':' · còn món chưa kiểm'}`)}
  if(!d.luot)L(`${d.id}: chưa lưu số lượt (tự tính từ ngày: ${C.luotDon(d)} lượt)`);
});
(T.trips||[]).forEach(t=>{if(t.don&&!dons.find(d=>d.id===t.don)&&!(T.don||[]).find(d=>d.id===t.don))L(`${t.id}: chuyến trỏ tới đơn ${t.don} không tồn tại`)});
console.log(out.join('\n')||'Không thấy lệch');
