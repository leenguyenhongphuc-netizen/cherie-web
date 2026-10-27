(function(){
"use strict";
const CD=window.CherieData;
const db=CD.init({onChange:()=>{try{renderFilters();renderHero();renderInfo();renderReviews();renderTeaser();if(curView==="blog")renderBlog();if(curView==="post")openPost(curArg)}catch(e){}renderGrid();refreshOpen()},onStatus:()=>{}});
const TODAY=CD.today();
const COLOR={"Đỏ rượu":"#6E1630","Champagne":"#D9C3A0","Đen":"#1E1A1C","Hồng pastel":"#EBC3CF","Bạc":"#B9BCC2","Trắng":"#F4F1EC","Xanh navy":"#1F2E4F","Đỏ":"#B3202A","Xanh ngọc":"#2F7E73","Xanh lục":"#1F5A43","Ngà":"#EDE3CF","Xanh biển":"#3E7CA6","Tím nhạt":"#B9A3CF"};
const LOAI=["Tất cả","Đầm dài","Đầm midi","Đầm ngắn","Đầm xoè"];
const SIZES=["Mọi size","S","M","L"],FITCHIP="Vừa với mình";
const BAG_MAX=6;
function fee(){return CD.phiVung(draft.vung||"V1")}
function luotOf(n,t){return Math.max(1,Math.round((new Date(t)-new Date(n))/864e5))}
function traOf(){const [n,t]=dates();return CD.hanTra(n+"T"+(draft.bG||"15:00"),luotOf(n,t))}
let fLoai="Tất cả",fSize="Mọi size",bag=[];
try{bag=JSON.parse(localStorage.getItem("cherie-web-picks")||"[]");if(!Array.isArray(bag))bag=[]}catch(e){bag=[]}
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=n=>Math.round(n||0).toLocaleString("vi-VN")+"đ";
const k=n=>{n=+n||0;const a=Math.abs(n);return a<1e6&&a%1000===0?(n<0?"−":"")+a/1000+"k":(n<0?"−":"")+a.toLocaleString("vi-VN").replace(/,/g,".")+"đ"};
const dn=s=>Math.round(new Date(s.slice(0,10)+"T00:00")/864e5);
const addD=(s,n)=>{const d=new Date(s+"T00:00");d.setDate(d.getDate()+n);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const dm=s=>+s.slice(8,10)+"/"+(+s.slice(5,7));
const WD=["CN","T2","T3","T4","T5","T6","T7"];
const wd=s=>WD[new Date(s.slice(0,10)+"T00:00").getDay()];
const ICON={
  plus:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>',
  check:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3L13 4.5"/></svg>',
  x:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>',
  bag:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 8.5h13l-1 11a1.5 1.5 0 0 1-1.5 1.4H8a1.5 1.5 0 0 1-1.5-1.4z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/></svg>',
  bagAdd:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 8.5h13l-1 11a1.5 1.5 0 0 1-1.5 1.4H8a1.5 1.5 0 0 1-1.5-1.4z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/><path d="M12 12v5M9.5 14.5h5"/></svg>',
  bagOn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 8.5h13l-1 11a1.5 1.5 0 0 1-1.5 1.4H8a1.5 1.5 0 0 1-1.5-1.4z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/><path d="M9.3 14.4l1.9 1.9 3.6-3.8"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>'
};
function saveBag(){try{localStorage.setItem("cherie-web-picks",JSON.stringify(bag))}catch(e){}}
const inBag=id=>bag.includes(id);
const bagItems=()=>bag.map(id=>db.sp.find(s=>s.id===id)).filter(Boolean);
let toastT=null;
function toast(m,act){document.querySelectorAll(".toast").forEach(t=>t.remove());clearTimeout(toastT);
  const t=document.createElement("div");t.className="toast";t.setAttribute("role","status");
  t.innerHTML=`<span>${esc(m)}</span>${act?`<button type="button">${esc(act.label)}</button>`:""}`;
  if(act)t.querySelector("button").onclick=()=>{t.remove();act.fn()};
  document.body.appendChild(t);requestAnimationFrame(()=>t.classList.add("on"));
  toastT=setTimeout(()=>{t.classList.remove("on");setTimeout(()=>t.remove(),300)},3200)}

/* ----- minh hoạ đầm: vẽ theo dáng và chất liệu của từng mẫu ----- */
function dress(s,id){const ph=CD.anhCua(s.id,true)[0];if(ph)return `<img class="ph" src="${ph.th||ph.src}" alt="${esc(s.ten)}" loading="lazy">`;
  return dressSvg(s,id)}
function dressSvg(s,id){
  const c=COLOR[s.mau]||"#888",mo=(s.mo||"").toLowerCase(),L=s.loai||"";
  const dark=["Đen","Xanh navy","Đỏ rượu","Xanh lục"].includes(s.mau);
  const fold=dark?"rgba(255,255,255,.16)":"rgba(20,20,20,.16)";
  let skirt,top="M84 70 L116 70 L120 112 L80 112 Z";
  if(/đuôi cá/.test(mo))skirt="M80 112 L120 112 L114 200 L146 262 L54 262 L86 200 Z";
  else if(L==="Đầm xoè")skirt="M80 112 L120 112 Q176 186 164 226 L36 226 Q24 186 80 112 Z";
  else if(L==="Đầm ngắn")skirt="M80 112 L120 112 L142 196 L58 196 Z";
  else if(L==="Đầm midi")skirt="M80 112 L120 112 L146 230 Q100 240 54 230 Z";
  else skirt="M80 112 L120 112 L152 262 L48 262 Z";
  let extra="";
  if(/cổ yếm/.test(mo))extra+=`<path d="M86 70 L100 44 L114 70" fill="none" stroke="${c}" stroke-width="5"/>`;
  else if(/vai trễ/.test(mo))extra+=`<path d="M70 72 Q100 64 130 72 L128 80 Q100 72 72 80 Z" fill="${c}"/>`;
  else if(/tay phồng/.test(mo))extra+=`<ellipse cx="74" cy="78" rx="12" ry="10" fill="${c}"/><ellipse cx="126" cy="78" rx="12" ry="10" fill="${c}"/>`;
  else extra+=`<path d="M88 70 L88 52 M112 70 L112 52" stroke="${c}" stroke-width="2.2"/>`;
  let tex="";
  if(/sequin/.test(mo)){let q=7;const r=()=>(q=(q*16807)%2147483647)/2147483647;for(let i=0;i<70;i++){const x=56+r()*92,y=116+r()*146;tex+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.8+r()*1.2).toFixed(1)}" fill="rgba(255,255,255,${(0.45+r()*0.45).toFixed(2)})"/>`}}
  if(/tua rua/.test(mo)){for(let x=62;x<=138;x+=5)tex+=`<path d="M${x} 150 L${x+1} 200" stroke="${fold}" stroke-width="1.2"/>`}
  if(/corset/.test(mo)){for(let y=78;y<=106;y+=7)tex+=`<path d="M94 ${y} L106 ${y+4} M106 ${y} L94 ${y+4}" stroke="${fold}" stroke-width="1"/>`}
  if(/ren/.test(mo)){for(let x=56;x<=144;x+=8)tex+=`<path d="M${x} 252 q4 6 8 0" fill="none" stroke="${fold}" stroke-width="1.2"/>`}
  if(/xẻ tà/.test(mo))tex+=`<path d="M112 170 L124 ${/chụp/.test(L)?230:262}" stroke="${fold}" stroke-width="2"/>`;
  const folds=`<path d="M92 118 L84 240 M100 118 L100 248 M108 118 L116 240" stroke="${fold}" stroke-width="1.1" fill="none"/>`;
  const cp="cp"+id;
  return `<svg viewBox="0 0 200 270" role="img" aria-label="Minh hoạ ${esc(s.ten)}"><defs><clipPath id="${cp}"><path d="${skirt}"/></clipPath></defs>
   <path d="M100 20 q0-9 7-9 q7 0 7 7" fill="none" stroke="var(--hair)" stroke-width="1.6"/><path d="M68 46 L100 30 L132 46" fill="none" stroke="var(--hair)" stroke-width="1.6"/>
   ${extra}<path d="${top}" fill="${c}" stroke="var(--hair)" stroke-width=".8"/><path d="${skirt}" fill="${c}" stroke="var(--hair)" stroke-width=".8"/>
   <g clip-path="url(#${cp})">${folds}${tex}</g><path d="M80 112 L120 112" stroke="${fold}" stroke-width="1.2"/></svg>`;
}


/* ----- lịch trống: giống luật trong app quầy (tính cả ngày giặt) ----- */
function busyReason(s,nhan,tra){
  if(s.tt==="Sửa"||s.tt==="Ngưng"||s.tt==="Mất")return "Đang chỉnh sửa";
  const a=dn(nhan),b=dn(tra);
  for(const c of db.ct){if(c.sp!==s.id)continue;const d=db.don.find(x=>x.id===c.don);if(!d||d.tt==="Hủy"||d.tt==="Đã trả")continue;
    if(dn(d.nhan)<=b+s.giat&&dn(d.tra)+s.giat>=a)return "Kín lịch";}
  return "";
}
function dayBusy(s,day){return !!busyReason(s,day,day)}

function chipRow(el,arr,cur,set){el.innerHTML=arr.map(x=>`<button class="chip" type="button" aria-pressed="${x===cur}" data-v="${esc(x)}">${esc(x)}</button>`).join("");
  el.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{set(b.dataset.v);renderFilters();renderGrid()})}
function renderFilters(){
  const have=new Set(db.sp.map(s=>s.loai));const cnt=f=>db.sp.filter(s=>s.tt!=="Ngưng"&&s.tt!=="Mất"&&f(s)).length;
  /* chỉ ẩn kiểu chưa có hàng khi kho đã tải xong; kiểu lạ do nhập tay vẫn hiện để lọc được */
  const extra=[...have].filter(l=>l&&!LOAI.includes(l)).sort();
  const L=db.sp.length?LOAI.filter(l=>l==="Tất cả"||have.has(l)).concat(extra):LOAI;
  const ORD=["XS","S","M","L","XL","XXL","Freesize"],hs=[...new Set(db.sp.filter(x=>x.tt!=="Ngưng"&&x.tt!=="Mất").map(x=>x.size).filter(Boolean))].sort((a,b)=>(ORD.indexOf(a)+99)%99-(ORD.indexOf(b)+99)%99||String(a).localeCompare(b));
  const SZ=["Mọi size"].concat(hs.length?hs:SIZES.slice(1)),Z=myFit()?[FITCHIP,...SZ]:SZ;
  const ls=$("#fLoaiS"),zs=$("#fSizeS");
  ls.innerHTML=L.map(l=>`<option value="${esc(l)}" ${l===fLoai?"selected":""}>${esc(l==="Tất cả"?"Mọi kiểu":l)}</option>`).join("");
  zs.innerHTML=Z.map(z=>`<option value="${esc(z)}" ${z===fSize?"selected":""}>${esc(z==="Mọi size"?"Mọi size":z===FITCHIP?z:"Size "+z)}</option>`).join("");
  ls.parentNode.classList.toggle("on",fLoai!=="Tất cả");zs.parentNode.classList.toggle("on",fSize!=="Mọi size");
  ls.onchange=()=>{fLoai=ls.value;renderFilters();renderGrid()};zs.onchange=()=>{fSize=zs.value;renderFilters();renderGrid()};
  const [n,t]=dates();$("#fDateT").textContent=khoang(n,t);
}
function khoang(n,t){return n.slice(0,7)===t.slice(0,7)?`${+n.slice(8)}–${+t.slice(8)}/${+n.slice(5,7)}`:`${dm(n)}–${dm(t)}`}
function openDates(){const [n,t]=dates();
  sheet("Ngày nhận và trả đồ",`<div style="display:flex;flex-direction:column;gap:14px;padding-bottom:10px"><p class="note">Một lượt thuê là 24 giờ kể từ lúc nhận. Tụi mình chỉ hiện những chiếc còn rảnh trong khoảng ngày này.</p>
    <div class="dates"><label>Ngày nhận<input type="date" id="sdN" value="${n}" min="${TODAY}"></label><label>Ngày trả<input type="date" id="sdT" value="${t}" min="${n}"></label></div>
    <button class="btn solid" type="button" id="sdOk" style="width:100%;justify-content:center">Xem đầm còn trống</button></div>`,el=>{
    const N=el.querySelector("#sdN"),T=el.querySelector("#sdT");N.onchange=()=>{T.min=N.value;if(T.value<=N.value)T.value=addD(N.value,1)};
    el.querySelector("#sdOk").onclick=()=>{setDates(N.value,T.value);renderFilters();close();toSec("bst")}})}
/* một bộ ngày duy nhất cho cả trang: bộ lọc, túi và đặt lịch dùng chung */
function dates(){let n=$("#dNhan").value||addD(TODAY,1),t=$("#dTra").value||addD(n,1);if(n<TODAY)n=TODAY;if(t<n)t=n;return[n,t]}
function setDates(n,t){if(n){$("#dNhan").value=n}if(t){$("#dTra").value=t}if($("#dTra").value<$("#dNhan").value)$("#dTra").value=addD($("#dNhan").value,1);const [a,b]=dates();$("#fDateT").textContent=khoang(a,b);renderGrid()}
const PAGE=8;let shown=PAGE,gridKey="";
/* ảnh trong thẻ: vuốt ngang xem tối đa 5 ảnh, chạm để mở chi tiết */
function tileHtml(s,i,why){const g=CD.anhCua(s.id,true).slice(0,5);
  const sl=g.length?g.map((a,j)=>`<img src="${esc(a.th||a.src)}" alt="${esc(s.ten)}${g.length>1?`, ảnh ${j+1}/${g.length}`:""}" loading="lazy" decoding="async">`).join(""):`<span class="svg">${dressSvg(s,"g"+i)}</span>`;
  return `<div class="tile" data-sp="${s.id}" role="link" tabindex="0" aria-label="Xem ${esc(s.ten)}"><div class="sw">${sl}</div><span class="tag ${why?"no":""}">${why?esc(why):"Còn trống"}</span>${g.length>1?`<span class="pd" aria-hidden="true">${g.map((_,j)=>`<i class="${j?"":"on"}"></i>`).join("")}</span>`:""}</div>`}
function bindTiles(root){root.querySelectorAll(".tile").forEach(t=>{const sw=t.querySelector(".sw"),dots=t.querySelectorAll(".pd i");
  if(dots.length)sw.addEventListener("scroll",()=>{const k=Math.round(sw.scrollLeft/Math.max(1,sw.clientWidth));dots.forEach((d,j)=>d.classList.toggle("on",j===k))},{passive:true});
  const open=()=>{stack=[];go(()=>openSP(t.dataset.sp),true)};t.onclick=open;t.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}}})}
function renderGrid(){
  const [n,t]=dates();
  const g=myFit();const list=db.sp.filter(s=>s.tt!=="Ngưng"&&s.tt!=="Mất"&&(fLoai==="Tất cả"||s.loai===fLoai)&&(fSize==="Mọi size"||(fSize===FITCHIP?(g&&CD.doVua(s,g).muc!=="khong"):s.size===fSize)));
  const rk=s=>{const v=g&&CD.doVua(s,g);return !v?0:v.muc==="vua"?0:v.muc==="co-the"?1:2};const rows=list.map(s=>({s,why:busyReason(s,n,t)})).sort((a,b)=>(!!a.why-!!b.why)||rk(a.s)-rk(b.s)||a.s.gia-b.s.gia);
  const key=[n,t,fLoai,fSize].join("|");if(key!==gridKey){gridKey=key;shown=PAGE}
  const free=rows.filter(r=>!r.why).length;
  $("#count").textContent=`${free} chiếc còn rảnh cho ${dm(n)}–${dm(t)}${rows.length-free?` · ${rows.length-free} chiếc đã có hẹn`:""}`;
  const sc=$("#grid").querySelectorAll(".sw"),keep={};sc.forEach(x=>{const id=x.parentNode.dataset.sp;if(x.scrollLeft)keep[id]=x.scrollLeft});
  $("#grid").innerHTML=rows.slice(0,shown).map(({s,why},i)=>{const on=inBag(s.id);return `<article class="card ${why?"off":""}">
    ${tileHtml(s,i,why)}
    <button class="open" type="button" data-sp="${s.id}"><span class="r1"><span class="br">${esc(s.brand||"Chérie")}</span><span class="sz">Size ${esc(s.size)}</span></span><span class="nm">${esc(s.ten)}</span><span class="mo">${esc(s.mo)}</span><span class="pr">${money(s.gia)} <span>/ lượt</span></span>${CD.giaTri(s)?`<span class="gt">Giá trị ${k(CD.giaTri(s))}</span>`:""}${fitTag(s)}</button>
    <button class="add" type="button" data-add="${s.id}" aria-pressed="${on}" aria-label="${on?"Bỏ "+esc(s.ten)+" khỏi túi":"Thêm "+esc(s.ten)+" vào túi"}">${on?ICON.bagOn:ICON.bagAdd}</button></article>`}).join("")||(fSize===FITCHIP?'<div class="empty">Chưa có chiếc nào vừa số đo của nàng trong nhóm này. Bỏ lọc hoặc nhờ stylist chọn giùm, tụi mình có thể chỉnh dây, ghim dáng tại chỗ.</div>':'<div class="empty">Ngày này chưa có chiếc nào vừa ý. Nàng thử đổi ngày hoặc bỏ lọc size nhé.</div>');
  $("#grid").querySelectorAll(".sw").forEach(x=>{const v=keep[x.parentNode.dataset.sp];if(v)x.scrollLeft=v});
  const left=rows.length-shown;$("#more").innerHTML=left>0?`<button class="btn" type="button" id="moreBtn">Xem thêm ${Math.min(PAGE,left)} chiếc · còn ${left}</button>`:"";
  if(left>0)$("#moreBtn").onclick=()=>{shown+=PAGE;renderGrid()};
  $("#grid").querySelectorAll(".open[data-sp]").forEach(b=>b.onclick=()=>{stack=[];go(()=>openSP(b.dataset.sp),true)});
  bindTiles($("#grid"));
  $("#grid").querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>toggleBag(b.dataset.add));
  renderBag();renderSizeFind();renderReviews();
}
function thumbs(ps,max){return `<span class="thumbs">${ps.slice(0,max||3).map((s,i)=>`<i>${dress(s,"t"+i+Math.random().toString(36).slice(2,6))}</i>`).join("")}</span>`}
let lastN=-1;
function renderBag(){
  const ps=bagItems(),n=ps.length,b=$("#bagN");
  b.textContent=n;b.hidden=!n;$("#bagBtn").setAttribute("aria-label",n?`Túi của nàng, ${n} chiếc`:"Túi của nàng, đang trống");
  if(lastN>=0&&n>lastN){b.classList.remove("bump");void b.offsetWidth;b.classList.add("bump")}lastN=n;
  const [d1,d2]=dates();const L=luotOf(d1,d2);const thue=ps.reduce((a,s)=>a+s.gia,0)*L;
  $("#barInfo").innerHTML=n?`${thumbs(ps)}<span class="tx"><b>${n} chiếc trong túi</b><span>${dm(d1)}–${dm(d2)}${L>1?` · ${L} lượt`:""} · thuê cả ${n} là ${k(thue)}</span></span>`
    :`<span class="tx"><b>Stylist đến tận nơi</b><span>Khách sạn hay nhà riêng đều tới</span></span>`;
  $("#barInfo").setAttribute("aria-label",n?`Mở túi, ${n} chiếc`:"Xem cách thử tận nơi");
  $("#barBook").innerHTML=n?`Xem túi <span class="n">${n}</span>`:"Đặt lịch thử";
}
function toggleBag(id,opts){
  if(layer.classList.contains("on"))opts=Object.assign({},opts,{quiet:true});
  const s=db.sp.find(x=>x.id===id);if(!s)return;
  if(inBag(id)){bag=bag.filter(x=>x!==id);saveBag();renderGrid();if(!(opts&&opts.quiet))toast(`Đã lấy ${s.ten} ra khỏi túi`);return}
  if(bag.length>=BAG_MAX){toast(`Túi đã đủ ${BAG_MAX} chiếc, nàng bỏ bớt rồi thêm nhé`,{label:"Xem túi",fn:openBagFresh});return}
  bag=[...bag,id];saveBag();renderGrid();
  if(!(opts&&opts.quiet))toast(`Đã bỏ vào túi · ${bag.length} chiếc`,{label:"Xem túi",fn:openBagFresh});
  afterPick();
}
/* ----- gợi ý size từ số đo (chỉ lưu trên máy khách) ----- */
function myFit(){return me.do?CD.goiYSize(me.do):null}
function fitTag(s){const g=myFit();if(!g)return"";const v=CD.doVua(s,g);return `<span class="fit ${v.muc}">${v.muc==="vua"?"Vừa với nàng":v.muc==="co-the"?"Có thể vừa":"Lệch size"}</span>`}
function renderSizeFind(){const g=myFit();const el=$("#sizeFind");
  if(!g){el.innerHTML=`<p>Chưa chắc size? Nhập số đo, tụi mình đánh dấu chiếc vừa với nàng.</p><button class="btn" type="button" id="sfGo">Tìm size của mình</button>`}
  else{const vua=db.sp.filter(s=>s.tt!=="Ngưng"&&s.tt!=="Mất"&&CD.doVua(s,g).muc==="vua").length,cothe=db.sp.filter(s=>s.tt!=="Ngưng"&&s.tt!=="Mất"&&CD.doVua(s,g).muc==="co-the").length;
    el.innerHTML=`<p><b class="sz">${g.size}</b>size gợi ý theo ${g.tu} · ${vua} chiếc vừa, ${cothe} chiếc có thể vừa</p><span style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" type="button" id="sfShow">${fSize===FITCHIP?"Xem tất cả":"Chỉ xem chiếc vừa"}</button><button class="btn" type="button" id="sfGo">Sửa số đo</button></span>`;
    el.querySelector("#sfShow").onclick=()=>{fSize=fSize===FITCHIP?"Mọi size":FITCHIP;renderFilters();renderGrid();toSec("bst")}}
  el.querySelector("#sfGo").onclick=()=>{stack=[];go(openSize)}}
function openSize(){const d=me.do||{};
  sheet("Tìm size của mình",`<p class="note">Nhập phần nàng biết. Có số đo ba vòng thì gợi ý chuẩn hơn; chỉ có chiều cao, cân nặng cũng được. Số đo chỉ lưu trên máy của nàng, chỉ gửi cho Chérie khi nàng đồng ý lúc đặt lịch.</p>
   <form id="sz" class="form" novalidate>
    <div class="two"><label class="f">Chiều cao (cm)<input type="number" id="zCao" inputmode="numeric" min="130" max="200" value="${d.cao||""}"></label><label class="f">Cân nặng (kg)<input type="number" id="zNang" inputmode="numeric" min="30" max="120" value="${d.nang||""}"></label></div>
    <div class="two"><label class="f">Vòng ngực (cm)<input type="number" id="zNguc" inputmode="numeric" min="60" max="130" value="${d.nguc||""}"></label><label class="f">Vòng eo (cm)<input type="number" id="zEo" inputmode="numeric" min="45" max="120" value="${d.eo||""}"></label></div>
    <label class="f">Vòng mông (cm)<input type="number" id="zMong" inputmode="numeric" min="60" max="140" value="${d.mong||""}"></label>
    <div id="zOut"></div><p class="err" id="bErr" role="alert" hidden></p>
    <button class="btn solid block" type="submit">Gợi ý size</button>
    ${me.do?'<button class="link" type="button" id="zDel" style="align-self:center">Xoá số đo đã lưu</button>':""}
   </form>`,r=>{
    const read=()=>({cao:+r.querySelector("#zCao").value||"",nang:+r.querySelector("#zNang").value||"",nguc:+r.querySelector("#zNguc").value||"",eo:+r.querySelector("#zEo").value||"",mong:+r.querySelector("#zMong").value||""});
    const show=()=>{const g=CD.goiYSize(read());if(!g){r.querySelector("#zOut").innerHTML="";return}
      const vua=db.sp.filter(s=>s.tt!=="Ngưng"&&s.tt!=="Mất"&&CD.doVua(s,g).muc==="vua"),cothe=db.sp.filter(s=>s.tt!=="Ngưng"&&s.tt!=="Mất"&&CD.doVua(s,g).muc==="co-the");
      r.querySelector("#zOut").innerHTML=`<div class="ytbox"><p class="eyebrow">Size gợi ý</p><p style="font-family:var(--serif);font-size:34px;line-height:1">${g.size}</p><p class="note">Theo ${g.tu}. ${vua.length} chiếc vừa đúng size, ${cothe.length} chiếc có thể vừa nhờ dây chỉnh, vải co giãn hoặc dáng suông.${g.ghiChu?" "+g.ghiChu:""}</p></div>`};
    r.querySelectorAll("input").forEach(i=>i.oninput=show);show();
    const del=r.querySelector("#zDel");if(del)del.onclick=()=>{delete me.do;saveMe();if(fSize===FITCHIP)fSize="Mọi size";renderFilters();renderGrid();close();toast("Đã xoá số đo trên máy này")};
    r.querySelector("#sz").onsubmit=e=>{e.preventDefault();const d=read();const g=CD.goiYSize(d);
      if(!g)return showErr(r,"Nàng nhập ít nhất cân nặng, hoặc một trong ba vòng nhé.","zNang");
      me.do=d;saveMe();fSize=FITCHIP;renderFilters();renderGrid();close();toSec("bst");toast(`Size ${g.size} · đã đánh dấu những chiếc vừa với nàng`)}});
}

/* ----- đánh giá thật của khách: chỉ hiện khi Chérie đã duyệt ----- */
function renderReviews(){const rs=(db.review||[]).filter(r=>r.tt==="Đã duyệt").sort((a,b)=>a.tg<b.tg?1:-1);
  $("#danhgia").hidden=!rs.length;$("#navRv").hidden=!rs.length;if(!rs.length)return;
  const avg=rs.reduce((a,r)=>a+r.sao,0)/rs.length;
  $("#rvSum").innerHTML=`<b>${avg.toFixed(1).replace(".",",")}</b><span class="note">trên 5 · ${rs.length} đánh giá từ khách đã thuê</span>`;
  $("#rvList").innerHTML=rs.slice(0,12).map(r=>`<article><span class="st" aria-label="${r.sao} trên 5 sao">${"★".repeat(r.sao)}${"☆".repeat(5-r.sao)}</span><p>${esc(r.noiDung)}</p><small>${esc(r.ten)}${(r.sp||[]).length?" · mặc "+r.sp.map(id=>{const s=db.sp.find(x=>x.id===id);return s?esc(s.ten):""}).filter(Boolean).join(", "):""}</small></article>`).join("")}
function openReview(){let sao=5;
  sheet("Viết cảm nhận",`<p class="note">Cảm ơn nàng đã mặc Chérie. Tụi mình đăng cảm nhận sau khi đối chiếu với lượt thuê, không sửa lời của nàng.</p>
   <form id="rf" class="form" novalidate>
    <div><p class="f" style="margin-bottom:8px">Nàng chấm mấy sao?</p><div class="stars" id="rStars">${[1,2,3,4,5].map(i=>`<button type="button" data-s="${i}" aria-pressed="${i<=sao}" aria-label="${i} sao">★</button>`).join("")}</div></div>
    <label class="f">Mã lịch hẹn hoặc số Zalo đã đặt<input type="text" id="rMa" placeholder="Ví dụ: YCMVLZ8H61WFN hoặc 0901 234 567"></label>
    <label class="f">Tên hiển thị<input type="text" id="rTen" value="${esc(me.ten?given(me.ten):"")}" placeholder="Ví dụ: Linh"></label>
    <label class="f">Cảm nhận của nàng<textarea id="rNd" rows="4" placeholder="Chiếc đầm, stylist, lúc nhận và trả đồ…"></textarea></label>
    <p class="err" id="bErr" role="alert" hidden></p>
    <button class="btn solid block" type="submit">Gửi cảm nhận</button></form>`,r=>{
    const paint=()=>r.querySelectorAll("[data-s]").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.s<=sao));
    r.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>{sao=+b.dataset.s;paint()});
    r.querySelector("#rf").onsubmit=e=>{e.preventDefault();const v=i=>r.querySelector("#"+i).value.trim();
      const ma=v("rMa"),ph=normPhone(ma);if(!ma)return showErr(r,"Cho tụi mình mã lịch hẹn hoặc số Zalo để đối chiếu nhé.","rMa");
      if(!v("rTen"))return showErr(r,"Nàng muốn hiện tên gì?","rTen");if(v("rNd").length<10)return showErr(r,"Nàng viết thêm vài chữ nữa nhé.","rNd");
      const y=(db.yc||[]).find(x=>x.id.toUpperCase()===ma.toUpperCase()||(ph&&normPhone(x.sdt)===ph));
      db.review.push({id:CD.newId("DG"),tg:nowIso(),ma:y?y.id:ma.replace(/\d(?=\d{4})/g,"•"),ten:v("rTen"),sao,noiDung:v("rNd"),sp:y?y.sp||[]:[],xacThuc:!!y,nguon:"Website",tt:"Chờ duyệt"});CD.save();
      sheet("Đã nhận",`<div class="done"><span class="ok">${ICON.check}</span><h3>Cảm ơn nàng</h3><p>Cảm nhận sẽ hiện trên trang sau khi tụi mình đối chiếu với lượt thuê, thường trong một ngày.</p></div><button class="btn block" type="button" id="dMore">Đóng</button>`,x=>x.querySelector("#dMore").onclick=close)}});
}

/* ----- thông tin thuê: gói gọn trong một danh sách mở ra khi cần ----- */
function renderInfo(){const Y=CD.YEN_TAM,g=db.sp.map(s=>s.gia).filter(Boolean);const lo=g.length?k(Math.min(...g)):"",hi=g.length?k(Math.max(...g)):"";
  const lv=CD.MUC_HU.slice(1).map(([c,t,p])=>`<tr><td>${t}</td><td>${p==null?"Đền theo giá trị chiếc đầm":p?money(p):"Miễn phí"}</td><td>${p==null?"Giảm còn 50%":p?"Miễn phí":"Miễn phí"}</td></tr>`).join("");
  const Q=[["Giá thuê và tiền cọc",`<p>Giá tính theo lượt, từ ${lo} đến ${hi}, in trên từng chiếc. Một lượt là 24 giờ kể từ lúc nàng nhận đồ. Nếu giờ trả rơi vào buổi tối sau 21:00, nàng trả trước 10:00 sáng hôm sau là được, không tính thêm. Cọc là khoản giữ đồ, chuyển khoản lúc nhận và hoàn ngay khi nàng trả đồ: kiểm đồ xong là tụi mình chuyển liền vào tài khoản nàng để lại lúc ký hợp đồng, kèm ảnh chụp giao dịch (hoặc trả tiền mặt nếu nàng muốn). Tổng cọc hiện ở bước đặt lịch. Căn cước hay hộ chiếu, nàng cứ giữ trong ví.</p>`],
   [`${Y.ten}: 1% giá trị chiếc đầm, từ ${money(Y.toiThieu)}`,`<p>Một khoản tự chọn khi đặt lịch, bằng 1% giá trị chiếc đầm (tối thiểu ${money(Y.toiThieu)} mỗi chiếc, làm tròn lên 10.000đ). Ví dụ chiếc giá trị 3.300.000đ: gói 40.000đ; chiếc 10.000.000đ: gói 100.000đ. Gói giúp mấy sự cố nhỏ trong lúc mặc không thành nỗi lo. Đây là cam kết của chính Chérie, không phải hợp đồng của công ty bảo hiểm.</p><p><b>Tụi mình lo trọn, nàng không trả thêm:</b></p><ul class="cov">${Y.gom.map(x=>`<li>${x}</li>`).join("")}</ul><p><b>Không nằm trong gói:</b></p><ul class="cov">${Y.khong.map(x=>`<li>${x}</li>`).join("")}</ul>`],
   ["Nếu làm bẩn, hư hoặc mất đồ",`<table class="lv"><tbody><tr><td><b>Tình trạng</b></td><td><b>Không có gói</b></td><td><b>Có Gói Yên tâm</b></td></tr>${lv}</tbody></table><p>Giá trị từng chiếc in trên trang chi tiết của chiếc đó. Stylist chụp ảnh và cùng nàng ký biên bản lúc giao và lúc nhận lại.</p>`],
   ["Đến tận nơi ở đâu",`<p>Khách sạn, homestay, căn hộ hay nhà riêng. Phí tính trọn một đơn, gồm chuyến mang đồ tới và chuyến nhận lại.</p><table class="lv"><tbody>${CD.VUNG.map(v=>`<tr><td><b>${v.ten}</b><br>${v.mo}</td><td>${money(v.phi)}</td></tr>`).join("")}</tbody></table><p>${CD.NGOAI_VUNG} Stylist gọi nàng 15 phút trước khi tới, mang thêm một size dự phòng nếu kho còn. Ghé tiệm thì thử miễn phí.</p>`],
   ["Vệ sinh sau mỗi lượt",`<p>Kiểm tra từng đường may, giặt riêng từng chiếc, hấp phẳng, khử khuẩn trong lẫn ngoài, rồi niêm phong túi kín có tem ngày giặt. Nàng là người xé tem đầu tiên.</p>`],
   ["Không đúng size thì sao",`<p>Dùng nút Tìm size để biết chiếc nào vừa trước khi chọn. Đi thử tận nơi, stylist chỉnh dây, ghim dáng tại chỗ; không vừa thì đổi chiếc khác, không tính thêm.</p>`],
   ["Trả trễ",`<p>Trễ dưới 1 giờ thì thôi, tụi mình không tính. Từ giờ thứ hai, 20.000đ mỗi giờ, tối đa 24 giờ. Báo trước cho tụi mình là được dời miễn phí nếu chiếc đó chưa có người hẹn.</p>`],
   ["Đi nhóm",`<p>Đi từ 3 người, nàng nhắn stylist khi đặt. Ưu đãi nhóm theo chương trình đang chạy, stylist báo rõ số tiền trước khi chốt.</p>`]];
  $("#info").innerHTML=Q.map(([q,a])=>`<details><summary>${q}</summary><div style="padding:0 0 16px;color:var(--muted);display:flex;flex-direction:column;gap:10px;max-width:46em">${a}</div></details>`).join("")}
function openInfo(i){stack=[];go(()=>sheet("Gói Yên tâm",`<div style="display:flex;flex-direction:column;gap:10px">${$("#info").children[i].querySelector("div").innerHTML}</div>`))}

/* ----- sheet có điều hướng: mỗi màn là một hàm, nút quay lại về màn trước ----- */
const layer=$("#layer"),body=$("#sheetBody");let stack=[],lastFocus=null,lastView=null;
function go(fn,live){fn.live=!!live;stack.push(fn);fn()}
function back(){keepAll();stack.pop();const f=stack[stack.length-1];if(f)f();else close()}
function sheet(title,html,mount){
  const top=stack[stack.length-1]||null;const fresh=top!==lastView||!layer.classList.contains("on");lastView=top;
  $("#sheetTitle").textContent=title;body.innerHTML=html;
  $("#back").hidden=stack.length<2;
  if(!layer.classList.contains("on")){lastFocus=document.activeElement;layer.classList.add("on");document.body.style.overflow="hidden";hideHello();document.querySelectorAll(".toast").forEach(t=>t.remove())}
  if(fresh){body.classList.remove("fade");void body.offsetWidth;body.classList.add("fade");layer.querySelector(".sheet").scrollTop=0}
  if(mount)mount(body);
  if(fresh)setTimeout(()=>{(stack.length>1?$("#back"):layer.querySelector(".x")).focus({preventScroll:true})},30);
}
function close(){keepAll();layer.classList.remove("on");document.body.style.overflow="";stack=[];lastView=null;if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true})}
layer.addEventListener("click",e=>{if(e.target.closest("[data-close]"))close()});
$("#back").onclick=back;
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&layer.classList.contains("on"))close()});
function refreshOpen(){const f=stack[stack.length-1];if(f&&f.live&&!(document.activeElement&&/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName)))f()}
function openBagFresh(){if(!layer.classList.contains("on"))stack=[];go(openBag,true)}

/* ----- chi tiết một chiếc đầm ----- */
function openSP(id){
  const s=db.sp.find(x=>x.id===id);if(!s)return close();noteSeen(id);const [n,t]=dates();const why=busyReason(s,n,t);
  const start=addD(TODAY,1);const days=[...Array(14)].map((_,i)=>addD(start,i));
  const on=inBag(id);
  const gal=CD.anhCua(s.id,true);
  sheet(s.ten,`${gal.length?`<div class="gal" aria-label="Ảnh thật tại Chérie">${gal.map((a,i)=>`<img src="${a.src}" alt="${esc(s.ten)}, ${a.loai==="Ảnh AI"?"ảnh dựng bằng AI":"ảnh "+(i+1)}" loading="lazy">`).join("")}</div><p class="note" style="margin-top:-6px">${gal.some(a=>a.loai!=="Ảnh AI"&&a.loai!=="Ảnh hãng")?"Ảnh tụi mình tự chụp":gal.some(a=>a.loai==="Ảnh hãng")?`Ảnh mẫu của ${esc(s.brand||"thương hiệu")}`:"Ảnh minh hoạ"}${gal.some(a=>a.loai==="Lookbook khách")?", có ảnh khách thật đã đồng ý chia sẻ":""}${gal.some(a=>a.loai==="Ảnh AI")?`. ${gal.filter(a=>a.loai==="Ảnh AI").length} ảnh dựng bằng AI để nàng hình dung dáng, ảnh thật đang được cập nhật`:""}. ${gal.length>1?"Vuốt để xem thêm.":""}</p>`:`<div class="big">${dressSvg(s,"big")}</div>`}${!gal.length&&(s.anhBrand||[]).length?`<div><p class="eyebrow">Ảnh mẫu thật · ${s.anhBrand.length} ảnh</p><div class="imgl">${s.anhBrand.slice(0,8).map((u,i)=>`<a href="${esc(u)}" target="_blank" rel="noopener">Ảnh ${i+1}</a>`).join("")}</div><p class="note" style="margin-top:6px">Ảnh mẫu từ ${esc(s.brand||"thương hiệu")}, chạm để mở. Ảnh tụi mình tự chụp đang được cập nhật.</p></div>`:""}
   <div><p class="eyebrow">${esc(s.loai)} · ${esc(s.pc)}</p><h2 style="font-size:28px;margin-top:6px">${esc(s.ten)}</h2><p class="note" style="margin-top:4px">${esc(s.mo)} · màu ${esc((s.mau||"").toLowerCase())}${s.brand?` · thiết kế của ${esc(s.brand)}`:""}</p>${s.moTa?`<p style="margin-top:8px">${esc(s.moTa)}</p>`:""}</div>
   <dl class="kv"><dt>Giá thuê</dt><dd>${money(s.gia)} / lượt</dd>${CD.giaTri(s)?`<dt>Giá trị chiếc đầm</dt><dd>${money(CD.giaTri(s))}</dd>`:""}<dt>Size</dt><dd>${s.size} · ${esc((s.co||"").toLowerCase())}</dd>${s.chatLieu?`<dt>Chất liệu</dt><dd>${esc(s.chatLieu)}</dd>`:""}<dt>${CD.YEN_TAM.ten}</dt><dd>+${money(CD.phiYenTam(s))}, tự chọn <button class="link" type="button" id="ytInfo">gồm gì</button></dd></dl>
   ${(()=>{const g=myFit();if(!g)return `<button class="link" type="button" id="spSize" style="align-self:flex-start">Không chắc size? Nhập số đo để biết chiếc này có vừa không</button>`;const v=CD.doVua(s,g);return `<div class="hint">${ICON.info}<span><b>${esc(v.txt)}.</b> Size gợi ý của nàng là ${g.size}.</span></div>`})()}
   <div><p class="f" style="margin-bottom:8px">Lịch 14 ngày tới</p><div class="days">${days.map(d=>{const b=dayBusy(s,d);return `<div class="${b?"busy":""} ${d>=n&&d<=t?"sel":""}" title="${b?"Kín lịch":"Còn trống"}">${wd(d)}<b>${+d.slice(8,10)}</b></div>`}).join("")}</div>
   <p class="note" style="margin-top:8px">${why?`Ngày ${dm(n)}–${dm(t)} chiếc này ${why==="Kín lịch"?"đã có hẹn":why.toLowerCase()}. Nàng vẫn bỏ vào túi được, stylist sẽ gợi ý ngày khác hoặc một chiếc cùng tinh thần.`:`Chiếc này rảnh từ ${dm(n)} đến ${dm(t)}. Ô gạch ngang là ngày đã có người hẹn hoặc đang giặt hấp.`}</p></div>
   <div class="acts">
     ${on?`<button class="btn solid block" type="button" id="toBag">Đã trong túi · Xem túi <span class="n">${bag.length}</span></button><button class="link" type="button" id="tog" style="align-self:center">Lấy ra khỏi túi</button>`
        :`<button class="btn solid block" type="button" id="tog">Bỏ vào túi</button><button class="btn block" type="button" id="hold" ${why?"disabled":""}>Giữ luôn chiếc này ${dm(n)}–${dm(t)}</button>`}
   </div>`,root=>{
    root.querySelector("#tog").onclick=()=>{toggleBag(id);openSP(id)};
    root.querySelector("#ytInfo").onclick=()=>go(ytSheet);const ss=root.querySelector("#spSize");if(ss)ss.onclick=()=>go(openSize);
    const tb=root.querySelector("#toBag");if(tb)tb.onclick=()=>go(openBag,true);
    const h=root.querySelector("#hold");if(h)h.onclick=()=>{if(!inBag(id))toggleBag(id,{quiet:true});draft.mode="giu";go(checkout1)};
  });
}

/* ----- túi của nàng ----- */
function openBag(){
  const ps=bagItems();const [n,t]=dates();
  if(!ps.length){sheet("Túi của nàng",`<div class="emptybag"><i>${ICON.bag}</i><h3 style="font-size:22px">Túi còn trống trơn</h3><p>Thấy chiếc nào thương thì chạm dấu cộng. Còn nếu chưa biết bắt đầu từ đâu, cứ để stylist chọn giùm vài chiếc hợp dáng, hợp dịp.</p></div>
     <div class="acts"><button class="btn solid block" type="button" id="eSee">Xem bộ sưu tập</button><button class="btn block" type="button" id="eHelp">Nhờ stylist chọn giùm</button></div>`,r=>{
      r.querySelector("#eSee").onclick=()=>{close();toSec("bst")};
      r.querySelector("#eHelp").onclick=()=>{draft.mode="thu";go(checkout1)}});return}
  const rows=ps.map(s=>({s,why:busyReason(s,n,t)}));const busy=rows.filter(r=>r.why).length;
  const L=luotOf(n,t),thue=ps.reduce((a,s)=>a+s.gia,0)*L,coc=ps.reduce((a,s)=>a+s.coc,0);
  sheet("Túi của nàng",`
   <div class="dates"><label>Ngày nhận<input type="date" id="gN" value="${n}" min="${TODAY}"></label><label>Ngày trả<input type="date" id="gT" value="${t}" min="${TODAY}"></label></div>
   <div class="rows">${rows.map(({s,why},i)=>`<div class="rowi"><span class="th">${dress(s,"b"+i)}</span><span class="tx"><b>${esc(s.ten)}</b><small>Size ${s.size} · ${money(s.gia)}</small>${fitTag(s)}<span class="pill ${why?"no":""}">${why?(why==="Kín lịch"?"Đã có hẹn ngày này":esc(why)):"Còn rảnh"}</span></span><button class="rm" type="button" data-rm="${s.id}" aria-label="Bỏ ${esc(s.ten)}">${ICON.x}</button></div>`).join("")}</div>
   <div class="hint">${ICON.info}<span>${ps.length<3?`Thử tận nơi thì 3 đến 5 chiếc là vừa để so dáng. Nàng thêm ${3-ps.length} chiếc nữa, hoặc để stylist mang theo vài mẫu hợp.`:busy?`${busy} chiếc đã có hẹn ngày ${dm(n)}–${dm(t)}. Nàng đổi ngày ở trên, hoặc cứ gửi để stylist gợi ý chiếc cùng tinh thần.`:`Vậy là đủ để thử thoải mái. Ưng chiếc nào thuê chiếc đó, không ưng tụi mình mang về.`}</span></div>
   <div class="meter" aria-hidden="true">${[1,2,3,4,5].map(i=>`<span class="${i<=ps.length?"on":""}"></span>`).join("")}</div>
   <dl class="kv"><dt>Thuê cả ${ps.length} chiếc${L>1?` · ${L} lượt`:""}</dt><dd>${money(thue)}</dd></dl>
   ${ytToggle(ps)}
   <p class="note">Cọc giữ đồ sẽ hiện ở bước đặt lịch và hoàn ngay khi nàng trả đồ. Thử trước thì nàng chỉ trả tiền chiếc mình chọn. Lúc đặt lịch chưa cần chuyển khoản.</p>
   <div class="acts"><button class="btn solid block" type="button" id="gGo">Đặt lịch với ${ps.length} chiếc này</button><button class="btn block" type="button" id="gMore">Chọn thêm</button></div>`,r=>{
    r.querySelector("#gN").onchange=e=>{setDates(e.target.value,null);openBag()};
    r.querySelector("#gT").onchange=e=>{setDates(null,e.target.value);openBag()};
    r.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{toggleBag(b.dataset.rm,{quiet:true});openBag()});
    bindYt(r,openBag);
    r.querySelector("#gGo").onclick=()=>go(checkout1);
    r.querySelector("#gMore").onclick=()=>{close();toSec("bst")};
  });
}

/* ----- đặt lịch hai bước, giữ nháp khi quay lại ----- */
const DRAFT_KEY="cherie-web-draft";
let draft={};try{draft=JSON.parse(localStorage.getItem(DRAFT_KEY)||"{}")||{}}catch(e){draft={}}
function saveDraft(){try{localStorage.setItem(DRAFT_KEY,JSON.stringify(draft))}catch(e){}}
const FIELDS=["bG","bNoi","bTen","bSdt","bNote"];
function keepAll(){FIELDS.forEach(i=>{const el=body.querySelector("#"+i);if(el)draft[i]=el.value});const ok=body.querySelector("#bOk");if(ok)draft.ok=ok.checked;saveDraft()}
function restore(r){const pre={bTen:me.ten||"",bSdt:me.sdt||"",bG:"15:00"};FIELDS.forEach(i=>{const el=r.querySelector("#"+i);const v=draft[i]!=null&&draft[i]!==""?draft[i]:pre[i];if(el&&v)el.value=v});const ok=r.querySelector("#bOk");if(ok&&draft.ok)ok.checked=true}
function prog(i){return `<div class="prog" aria-label="Bước ${i} trên 2"><div class="bars"><span class="on"></span><span class="${i>1?"on":""}"></span></div><p><b>Bước ${i}/2</b> · ${i===1?"Lịch hẹn và nơi gặp":"Thông tin liên hệ"}</p></div>`}
const mode=()=>draft.mode==="giu"?"giu":"thu",cach=()=>draft.cach==="tiem"?"tiem":"tan";
function placeLabel(){return cach()==="tan"?(mode()==="thu"?"Thử tận nơi":"Giao tận nơi"):(mode()==="thu"?"Thử tại tiệm":"Nhận tại tiệm")}
function showErr(r,msg,field){const e=r.querySelector("#bErr");e.textContent=msg;e.hidden=false;r.querySelectorAll(".f.bad").forEach(x=>x.classList.remove("bad"));if(field){const el=r.querySelector("#"+field);if(el){el.closest(".f").classList.add("bad");el.focus()}}e.scrollIntoView({block:"nearest"})}
function checkout1(){
  const ps=bagItems();const [n,t]=dates();const m=mode(),c=cach();
  const busy=ps.filter(s=>busyReason(s,n,t));
  sheet("Đặt lịch",`${prog(1)}
   <form id="s1" class="form" novalidate>
    <fieldset class="q"><legend>Nàng muốn</legend><div class="opts">
      <button class="opt" type="button" data-m="thu" aria-pressed="${m==="thu"}"><b>Thử trước</b><small>Ưng chiếc nào mới thuê chiếc đó</small></button>
      <button class="opt" type="button" data-m="giu" aria-pressed="${m==="giu"}"><b>Giữ luôn</b><small>Đã chọn xong, nhận là mặc</small></button></div></fieldset>
    <fieldset class="q"><legend>${m==="thu"?"Thử ở đâu":"Nhận đồ ở đâu"}</legend><div class="opts">
      <button class="opt" type="button" data-c="tan" aria-pressed="${c==="tan"}"><b>Tận nơi</b><small>Khách sạn hoặc nhà riêng · từ 120.000đ</small></button>
      <button class="opt" type="button" data-c="tiem" aria-pressed="${c==="tiem"}"><b>Ghé tiệm</b><small>Miễn phí, đầm treo sẵn chờ nàng</small></button></div></fieldset>
    <div class="two"><label class="f">${m==="thu"?"Ngày hẹn":"Ngày nhận"}<input type="date" id="bN" value="${n}" min="${TODAY}"></label><label class="f">Giờ${c==="tan"?" stylist đến":" ghé tiệm"}<input type="time" id="bG"></label></div>
    <label class="f">Thời gian thuê<select id="bL">${[1,2,3].map(L=>`<option value="${L}" ${luotOf(n,t)===L?"selected":""}>${L} lượt · ${24*L} giờ</option>`).join("")}</select></label>
    <p class="note" style="margin-top:-8px">Tính từ giờ nhận. Trả trước ${(()=>{const x=traOf();return x?`${wd(x.slice(0,10))} ${dm(x.slice(0,10))} lúc ${x.slice(11)}`:""})()}.</p>
    ${c==="tan"?`<fieldset class="q"><legend>Khu vực</legend><div class="opts">${CD.VUNG.map(v=>`<button class="opt" type="button" data-v="${v.id}" aria-pressed="${(draft.vung||"V1")===v.id}"><b>${v.ten} · ${k(v.phi)}</b><small>${v.mo}</small></button>`).join("")}</div><p class="note">${CD.NGOAI_VUNG}</p></fieldset>
    <label class="f">Khách sạn, số phòng hoặc địa chỉ nhà<input type="text" id="bNoi" autocomplete="street-address" placeholder="Ví dụ: Novotel phòng 2104, hoặc 25 Bạch Đằng"></label>
      <p class="note" style="margin-top:-8px">Stylist sẽ gọi nàng 15 phút trước khi tới. Nàng chỉ cần chừa một góc có gương.</p>`:`<p class="note">Tụi mình gửi địa chỉ tiệm và chỗ để xe qua Zalo khi xác nhận lịch.</p>`}
    <div class="sum" style="background:var(--raised);color:var(--ink);border:1px solid var(--line)"><div class="head">${ps.length?thumbs(ps,4):`<span class="thumbs"><i style="align-items:center">${ICON.bag.replace('<svg','<svg style="width:55%;stroke:var(--accent)"')}</i></span>`}<span class="tx"><b>${ps.length?`${ps.length} chiếc trong túi`:"Chưa chọn đầm"}</b>${ps.length?(busy.length?`${busy.length} chiếc đã có hẹn ngày này`:`Đều còn rảnh ${dm(n)}–${dm(t)}`):"Stylist sẽ chọn sẵn 3 đến 5 chiếc hợp dáng, nàng ghi số đo ở bước sau"}</span></div>
      ${ps.length?`<button class="link" type="button" id="eBag" style="align-self:flex-start">Sửa túi</button>`:""}</div>
    <p class="err" id="bErr" role="alert" hidden></p>
    <button class="btn solid block" type="submit">Tiếp tục</button>
   </form>`,r=>{
    restore(r);
    r.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{keepAll();draft.mode=b.dataset.m;saveDraft();checkout1()});
    r.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{keepAll();draft.cach=b.dataset.c;saveDraft();checkout1()});
    r.querySelector("#bN").onchange=e=>{keepAll();setDates(e.target.value,null);checkout1()};
    r.querySelector("#bL").onchange=e=>{keepAll();setDates(null,addD(dates()[0],+e.target.value));checkout1()};
    r.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{keepAll();draft.vung=b.dataset.v;saveDraft();checkout1()});
    const bg=r.querySelector("#bG");if(bg)bg.onchange=()=>{keepAll();checkout1()};
    const eb=r.querySelector("#eBag");if(eb)eb.onclick=()=>{keepAll();go(openBag,true)};
    r.querySelector("#s1").onsubmit=e=>{e.preventDefault();keepAll();
      const N=r.querySelector("#bN").value;
      if(!N)return showErr(r,"Nàng chọn giúp tụi mình một ngày nhé.","bN");
      if(c==="tan"&&!(draft.bNoi||"").trim())return showErr(r,"Cho tụi mình xin tên khách sạn và số phòng, hoặc địa chỉ nhà, để stylist tới đúng chỗ.","bNoi");
      if(m==="giu"&&!ps.length)return showErr(r,"Muốn giữ luôn thì túi cần có ít nhất một chiếc. Nếu nàng muốn stylist gợi ý, chọn Thử trước nhé.");
      if(m==="giu"&&busy.length)return showErr(r,`${busy.map(s=>s.ten).join(", ")} đã có hẹn ngày này. Nàng đổi ngày, bỏ bớt trong túi, hoặc chọn Thử trước để stylist gợi ý chiếc khác.`);
      go(checkout2)};
  });
}
function ytSheet(){const i=1;sheet(CD.YEN_TAM.ten,`<div style="display:flex;flex-direction:column;gap:10px;color:var(--muted)">${$("#info").children[i].querySelector("div").innerHTML}${$("#info").children[2].querySelector("div").innerHTML}</div>`)}
function ytToggle(L){const n=(L||[]).length,tong=CD.phiYenTamDs(L||[]);return `<div class="ytbox"><label class="consent" style="color:var(--ink)"><input type="checkbox" id="yt" ${draft.yt?"checked":""}> <span><b>Thêm ${CD.YEN_TAM.ten}</b> · 1% giá trị mỗi chiếc, từ ${money(CD.YEN_TAM.toiThieu)}${n?` (đơn này ${money(tong)})`:""}. Bẩn khó giặt, sút chỉ, rách cần thợ sửa: tụi mình lo trọn.</span></label><button class="link" type="button" id="ytMore" style="align-self:flex-start">Xem gói gồm gì</button></div>`}
function bindYt(r,re){const c=r.querySelector("#yt");if(c)c.onchange=()=>{keepAll();draft.yt=c.checked;saveDraft();re()};const m=r.querySelector("#ytMore");if(m)m.onclick=()=>{keepAll();go(ytSheet)}}
function bookSummary(){
  const ps=bagItems();const [n,t]=dates();const m=mode(),c=cach();
  const L=luotOf(n,t),tr=traOf(),F=fee();const thue=ps.reduce((a,s)=>a+s.gia,0)*L,coc=ps.reduce((a,s)=>a+s.coc,0),yt=draft.yt?CD.phiYenTamDs(ps):0;
  return `<div class="sum"><div class="head">${ps.length?thumbs(ps,4):""}<span class="tx"><b>${placeLabel()}</b>${wd(n)} ${dm(n)} lúc ${esc(draft.bG||"15:00")}${c==="tan"&&draft.bNoi?` · ${esc(draft.bNoi)}`:""}</span></div>
    <dl class="kv"><dt>Đầm</dt><dd>${ps.length?ps.map(s=>esc(s.ten)).join(", "):"Stylist chọn giùm"}</dd><dt>Trả đồ</dt><dd>${wd(tr.slice(0,10))} ${dm(tr.slice(0,10))} lúc ${tr.slice(11)} · ${L} lượt (${24*L} giờ)</dd>
    ${m==="giu"?`<dt>Tiền thuê</dt><dd>${money(thue)}</dd>${yt?`<dt>${CD.YEN_TAM.ten}</dt><dd>${money(yt)}</dd>`:""}<dt>Cọc giữ đồ, hoàn ngay khi trả</dt><dd>${money(coc)}</dd>`:`<dt>Thuê và cọc</dt><dd>Theo chiếc nàng chọn khi thử</dd>${draft.yt?`<dt>${CD.YEN_TAM.ten}</dt><dd>1% giá trị mỗi chiếc nàng thuê, từ ${money(CD.YEN_TAM.toiThieu)}</dd>`:""}`}
    <dt>Phí đến tận nơi</dt><dd>${c==="tan"?`${money(F)} · ${esc((CD.VUNG.find(v=>v.id===(draft.vung||"V1"))||{}).ten||"")}`:"Miễn phí"}</dd>
    ${m==="giu"?`<dt class="tot">Cần chuyển khi nhận</dt><dd class="tot">${money(thue+yt+coc+(c==="tan"?F:0))}</dd>`:""}</dl>${m==="giu"?`<p class="note" style="margin-top:6px">Chưa gồm ưu đãi. Nếu đơn hợp chương trình đang chạy, stylist trừ khi xác nhận.</p>`:""}</div>`;
}
function checkout2(){
  const m=mode();
  sheet("Đặt lịch",`${prog(2)}${bookSummary()}
   <form id="s2" class="form" novalidate>
    <label class="f">Tên của nàng<input type="text" id="bTen" autocomplete="name" placeholder="Tụi mình nên gọi nàng là gì"></label>
    <label class="f">Số Zalo<input type="tel" id="bSdt" inputmode="tel" autocomplete="tel" placeholder="0901 234 567"></label>
    <label class="f">Gu, số đo hoặc điều nàng muốn dặn<textarea id="bNote" rows="2" placeholder="Cao 1m60, mê màu champagne, thích dáng ôm…"></textarea></label>
    ${ytToggle(bagItems())}
    ${me.do?`<label class="consent"><input type="checkbox" id="bDo" ${draft.doOk?"checked":""}> Gửi kèm số đo (size gợi ý ${CD.goiYSize(me.do).size}) để stylist mang đúng size. Tụi mình chỉ dùng số đo để chọn đồ cho nàng.</label>`:`<button class="link" type="button" id="bSize" style="align-self:flex-start">Chưa chắc size? Nhập số đo</button>`}
    ${me.consent?"":`<label class="consent"><input type="checkbox" id="bOk"> Cho phép Chérie nhắn tin chăm sóc và ưu đãi qua Zalo. Không tick, nàng vẫn đặt lịch bình thường.</label>`}
    <p class="err" id="bErr" role="alert" hidden></p>
    <button class="btn solid block" type="submit">${m==="thu"?"Gửi lịch hẹn":"Giữ đầm ngay"}</button>
    <p class="note" style="text-align:center">Chưa cần chuyển khoản. Trong 30 phút tụi mình gọi Zalo để xác nhận (9:00–21:00).</p>
   </form>`,r=>{restore(r);bindYt(r,checkout2);const bd=r.querySelector("#bDo");if(bd)bd.onchange=()=>{draft.doOk=bd.checked;saveDraft()};const bs=r.querySelector("#bSize");if(bs)bs.onclick=()=>{keepAll();go(openSize)};r.querySelector("#s2").onsubmit=e=>{e.preventDefault();keepAll();submit(r)}});
}
function submit(r){
  const g=i=>(draft[i]||"").trim();const ps=bagItems();const [n,t]=dates();const m=mode(),c=cach();
  if(!g("bTen"))return showErr(r,"Cho tụi mình xin tên nàng nhé.","bTen");
  if(!normPhone(g("bSdt")))return showErr(r,"Số Zalo gồm 10 số, ví dụ 0901 234 567.","bSdt");
  if(m==="giu"){const b=ps.filter(s=>busyReason(s,n,t));if(b.length)return showErr(r,`Tiếc quá, vừa có người hẹn ${b.map(s=>s.ten).join(", ")} ngày này. Nàng quay lại bước 1 để đổi ngày nhé.`)}
  const now=new Date();const p=x=>String(x).padStart(2,"0");
  const yc={id:CD.newId("YC"),tg:`${now.getFullYear()}-${p(now.getMonth()+1)}-${p(now.getDate())}T${p(now.getHours())}:${p(now.getMinutes())}`,
    loai:m==="thu"?(c==="tan"?"Thử tận nơi":"Thử tại tiệm"):"Giữ đồ",cach:c==="tan"?"Stylist đến tận nơi":"Tại tiệm",
    ten:g("bTen"),sdt:g("bSdt"),nhan:n+"T"+(g("bG")||"15:00"),tra:traOf(),luot:luotOf(n,t),vung:c==="tan"?(draft.vung||"V1"):"",phiGiao:c==="tan"?fee():0,noi:c==="tan"?g("bNoi"):"",note:g("bNote"),sp:ps.map(s=>s.id),tt:"Mới",yenTam:!!draft.yt};
  if(me.do&&draft.doOk){yc.do=me.do;yc.sizeGoiY=CD.goiYSize(me.do).size}
  const ph=normPhone(yc.sdt);me.ten=yc.ten;me.sdt=ph;if(draft.ok)me.consent=true;saveMe();yc.lead=upsertLead("Đã gửi yêu cầu",true);personalize();
  db.yc.push(yc);CD.save();
  const st=CD.status();
  if(st==="readonly"||st==="full"){db.yc.splice(db.yc.indexOf(yc),1);return showErr(r,"Bản xem thử này chưa nhận được yêu cầu. Nàng nhắn Zalo Chérie giúp tụi mình nhé.")}
  const sent=bookSummary();
  bag=[];saveBag();draft={mode:draft.mode,cach:draft.cach,bNoi:draft.bNoi,yt:draft.yt,doOk:draft.doOk};saveDraft();renderGrid();
  stack=[];go(()=>done(yc,sent));
}
function done(yc,sent){
  const n=given(yc.ten)||"nàng";const tan=yc.cach.startsWith("Stylist");
  sheet("Đã gửi",`<div class="done"><span class="ok">${ICON.check}</span><p class="eyebrow">Chérie đã nhận</p><h3>Cảm ơn ${esc(n)}</h3><p>Tụi mình đã giữ lịch cho ${esc(n)} vào ${wd(yc.nhan)} ${dm(yc.nhan)}, lúc ${yc.nhan.slice(11)}. Mã của nàng là ${esc(yc.id)}.</p></div>
   ${sent}
   <div><p class="eyebrow" style="margin-bottom:12px">Tiếp theo</p><ol class="next">
     <li data-n="1"><span><b>Trong 30 phút</b><span>Stylist gọi Zalo số ${esc(yc.sdt)} để xác nhận và hỏi thêm về dáng, về dịp.</span></span></li>
     <li data-n="2"><span><b>Trước ngày hẹn</b><span>${yc.loai==="Giữ đồ"?"Tụi mình gửi tổng tiền và số tài khoản nhận cọc qua Zalo chính thức của Chérie.":"Tụi mình gửi ảnh thật những chiếc sẽ mang theo, nàng muốn đổi cứ nói."}</span></span></li>
     <li data-n="3"><span><b>${wd(yc.nhan)} ${dm(yc.nhan)}</b><span>${tan?`Stylist tới ${esc(yc.noi)}, gọi nàng trước 15 phút.`:"Nàng ghé tiệm, đầm đã treo sẵn chờ nàng."}</span></span></li></ol></div>
   <div class="hint">${ICON.info}<span>Nàng lưu số Zalo của Chérie nha, để tin nhắn không bị lọt vào mục người lạ.</span></div>
   <button class="btn block" type="button" id="dMore">Xem tiếp bộ sưu tập</button>`,r=>r.querySelector("#dMore").onclick=close);
}

/* ----- lời chào, cá nhân hoá và thu lead -----
   Không chặn màn hình: thẻ nhỏ trượt lên sau khi khách đã xem một lúc, hỏi tên trước,
   số Zalo sau và chỉ khi có lợi ích rõ ràng. Bỏ qua thì không hỏi lại trong 3 ngày.
   Số điện thoại chuẩn hoá (84xxxxxxxxx) là khoá định danh khách trong CRM. */
const ME_KEY="cherie-web-me";
let me={};try{me=JSON.parse(localStorage.getItem(ME_KEY)||"{}")||{}}catch(e){me={}}
function saveMe(){try{localStorage.setItem(ME_KEY,JSON.stringify(me))}catch(e){}}
function nowIso(){const d=new Date(),p=n=>String(n).padStart(2,"0");return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`}
if(!me.vid){me.vid=CD.newId("V");me.first=nowIso()}
me.seen=Array.isArray(me.seen)?me.seen:[];
let newSession=true;try{newSession=!sessionStorage.getItem("cherie-sess");sessionStorage.setItem("cherie-sess","1")}catch(e){}
if(newSession)me.visits=(me.visits||0)+1;
saveMe();
function normPhone(v){let d=String(v||"").replace(/\D/g,"");if(d.startsWith("84")&&d.length===11)d="0"+d.slice(2);return /^0[35789]\d{8}$/.test(d)?d:""}
function given(n){const w=String(n||"").trim().split(/\s+/).filter(Boolean);return w.length?w[w.length-1]:""}
function callName(){return given(me.ten)||"nàng"}
function cap(x){return x.charAt(0).toUpperCase()+x.slice(1)}
function heroTitle(){const n=callName();return n!=="nàng"?`${esc(cap(n))} ơi, mỗi lần <em>một chiếc mới.</em>`:`Mỗi lần, <em>một chiếc mới.</em>`}
function personalize(){const n=callName(),named=n!=="nàng";
  const h=$("#heroH");if(h)h.innerHTML=heroTitle();
  $("#thuH").textContent=`Ba bước, ${n} không cần ra khỏi nhà.`;
  $("#hi").textContent=named?`Chào ${n}`:"";}
const STAGES=["Mới","Đã liên hệ","Đã gửi yêu cầu","Đã thuê"];
function upsertLead(stage,quiet){
  if(!me.sdt)return"";const key="84"+me.sdt.slice(1);const t=nowIso();
  let L=db.lead.find(x=>x.id===key);
  if(!L){L={id:key,sdt:me.sdt,ten:"",nguon:"Website",lanDau:t,giaiDoan:"Mới",dongYZalo:false,vids:[]};db.lead.push(L)}
  if(me.ten)L.ten=me.ten;L.lanCuoi=t;L.soLanTruyCap=me.visits||1;L.mauDaXem=me.seen.slice(-10);L.danhSachThu=bag.slice();
  if(me.consent&&!L.dongYZalo){L.dongYZalo=true;L.dongYLuc=t}
  if(!(L.vids||[]).includes(me.vid))L.vids=[...(L.vids||[]),me.vid].slice(-5);
  if(stage&&STAGES.indexOf(stage)>STAGES.indexOf(L.giaiDoan))L.giaiDoan=stage;
  const kh=db.kh.find(x=>normPhone(x.sdt)===me.sdt);if(kh)L.kh=kh.id;
  if(!quiet)CD.save();return key}
let seenDirty=false;
function noteSeen(id){me.seen=[...me.seen.filter(x=>x!==id),id].slice(-12);saveMe();seenDirty=true}
/* khách đã để lại số: cập nhật lần ghé một lần mỗi phiên, và mẫu đã xem khi rời trang */
function touch(){if(me.sdt&&db.lead){upsertLead();seenDirty=false}}
if(newSession)setTimeout(touch,4000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&seenDirty)touch()});

const hello=$("#hello"),hb=$("#helloBody");let helloShown=false,askedPhoneThisVisit=false;
function showHello(){if(layer.classList.contains("on")){setTimeout(showHello,4000);return}hello.classList.add("on");hello.setAttribute("aria-hidden","false");helloShown=true}
function hideHello(){hello.classList.remove("on");hello.setAttribute("aria-hidden","true")}
function later(key,days){me[key]=Date.now()+days*864e5;saveMe()}
function stepName(){
  hb.innerHTML=`<p class="eyebrow">Chérie ơi</p><h3>Tụi mình nên gọi nàng là gì?</h3><p>Để tụi mình gọi đúng tên nàng. Không cần tạo tài khoản gì cả.</p>
   <form class="row2" id="hName" novalidate><input id="hTen" type="text" autocomplete="given-name" placeholder="Tên của nàng" aria-label="Tên của nàng" maxlength="40"><button class="btn solid" type="submit">Xong</button></form>
`;
  $("#hName").onsubmit=e=>{e.preventDefault();const v=$("#hTen").value.trim();if(!v){$("#hTen").focus();return}me.ten=v;saveMe();personalize();if(me.sdt)return thanks();stepPhone("ten")};
}
function stepPhone(why){
  const n=callName();askedPhoneThisVisit=true;
  hb.innerHTML=`<p class="eyebrow">${why==="pick"?"Lưu túi của "+esc(n):"Chào "+esc(n)}</p><h3>${why==="pick"?`Gửi lại túi đồ cho ${esc(n)} qua Zalo nhé?`:`Để tụi mình nhắn ${esc(n)} qua Zalo nhé?`}</h3>
   <p>${why==="pick"?`Tụi mình gửi lại những chiếc trong túi, và báo liền nếu có ai hẹn trước ngày ${esc(n)} cần.`:`Chiếc ${esc(n)} thích rảnh đúng ngày là tụi mình báo liền. Mở cửa 12/12 còn có voucher 100.000đ dành riêng cho nàng.`}</p>
   <form id="hPhone" novalidate style="display:flex;flex-direction:column;gap:10px">
    <div class="row2"><input id="hSdt" type="tel" inputmode="tel" autocomplete="tel" placeholder="Số Zalo" aria-label="Số điện thoại Zalo"><button class="btn solid" type="submit">Nhận qua Zalo</button></div>
    <label class="consent"><input type="checkbox" id="hOk"> Đồng ý để Chérie lưu tên, số Zalo và nhắn tin chăm sóc. Muốn ngừng, nàng chỉ cần nhắn "Huỷ".</label>
    <p class="err" id="hErr" role="alert" hidden></p></form>
   <div class="ft"><button class="skip" type="button" id="hNo">Không, cảm ơn</button><span class="perk">Tối đa 2 tin mỗi tuần, không làm phiền</span></div>`;
  $("#hPhone").onsubmit=e=>{e.preventDefault();const p=normPhone($("#hSdt").value),err=$("#hErr");
    if(!p){err.textContent="Số Zalo gồm 10 số, ví dụ 0901 234 567.";err.hidden=false;return}
    if(!$("#hOk").checked){err.textContent="Nàng tick đồng ý giúp, để tụi mình được phép nhắn tin.";err.hidden=false;return}
    me.sdt=p;me.consent=true;saveMe();upsertLead();thanks()};
  $("#hNo").onclick=()=>{later("phoneSkipUntil",7);hideHello()};
}
function thanks(){const n=callName();const back=(db.yc||[]).some(x=>normPhone(x.sdt)===me.sdt);
  hb.innerHTML=`<p class="eyebrow">${back?"Mừng nàng quay lại":"Xong rồi"}</p><h3>Cảm ơn ${esc(n)}</h3><p>Tụi mình sẽ nhắn từ Zalo chính thức của Chérie. Nàng lưu số tiệm lại để tin không bị lọt vào mục người lạ nha.</p>`;
  setTimeout(hideHello,5000)}
function afterPick(){if(me.sdt){upsertLead();return}if(askedPhoneThisVisit||(me.phoneSkipUntil||0)>Date.now())return;setTimeout(()=>{if(!layer.classList.contains("on")){stepPhone("pick");showHello()}},400)}
$("#helloX").onclick=()=>{if(!me.ten)later("skipUntil",3);else if(!me.sdt)later("phoneSkipUntil",7);hideHello()};
hello.addEventListener("keydown",e=>{if(e.key==="Escape")$("#helloX").click()});
/* chỉ chào khi khách đã xem một lúc: cuộn tới bộ sưu tập hoặc sau 15 giây */
(function(){const due=!me.ten?(me.skipUntil||0)<Date.now():(!me.sdt&&(me.phoneSkipUntil||0)<Date.now());if(!due)return;
  let fired=false;const go=()=>{if(fired||helloShown||curView!=="home")return;fired=true;window.removeEventListener("scroll",onS);if(me.ten)stepPhone("ten");else stepName();showHello()};
  const onS=()=>{const r=$("#bst").getBoundingClientRect();if(r.top<window.innerHeight*0.5)go()};
  window.addEventListener("scroll",onS,{passive:true});setTimeout(go,15000)})();
personalize();


/* ----- các trang: trang chủ, thông tin thuê, blog, một bài viết ----- */
const VIEWS={home:"vHome",info:"vInfo",blog:"vBlog",post:"vPost"};let curView="home",curArg="";
function view(v,arg,opt){opt=opt||{};if(!VIEWS[v])v="home";
  Object.entries(VIEWS).forEach(([k,id])=>{$("#"+id).hidden=k!==v});curView=v;curArg=arg||"";
  if(v==="blog")renderBlog();if(v==="post")openPost(arg);if(v==="info")renderInfo();
  if(!opt.keepScroll)window.scrollTo(0,0);
  if(v==="post"){const b=(db.blog||[]).find(x=>x.id===arg);document.title=b?b.tieuDe+" · Chérie":"Blog · Chérie"}else document.title=v==="blog"?"Blog · Chérie":v==="info"?"Thông tin thuê · Chérie":"CHÉRIE · Cho thuê đầm";
  if(!opt.noPush){const p=v==="home"?{}:v==="post"?{bai:arg}:{v};
    if(window.google&&google.script&&google.script.history)try{google.script.history.push({v,a:arg||""},p)}catch(e){}
    else try{const qs=new URLSearchParams(p).toString();history.pushState({v,a:arg||""},"",location.pathname+(qs?"?"+qs:""))}catch(e){}}}
function toSec(id){if(curView!=="home")view("home",null,{keepScroll:true});const el=document.getElementById(id);if(el)setTimeout(()=>el.scrollIntoView(),curView==="home"?0:30)}
document.addEventListener("click",e=>{const a=e.target.closest("[data-go]");if(!a)return;e.preventDefault();const v=a.dataset.go,h=(a.getAttribute("href")||"").replace(/^#/,"");
  if(v==="home"&&h&&h!=="top"){toSec(h);return}if(v==="home"&&curView==="home"){window.scrollTo({top:0,behavior:"smooth"});return}view(v)});
window.addEventListener("popstate",e=>{const st=e.state||{},u=new URLSearchParams(location.search);const v=st.v||(u.get("bai")?"post":u.get("v"))||"home";view(v,st.a||u.get("bai"),{noPush:true})});
try{google.script.history.setChangeHandler(e=>{const st=e.state||{};const v=st.v||(e.location&&e.location.parameter&&(e.location.parameter.bai?"post":e.location.parameter.v))||"home";view(v,st.a||(e.location&&e.location.parameter&&e.location.parameter.bai),{noPush:true})})}catch(e){}

const CAT=["Tất cả","Check-in","Xu hướng","Tóc","Makeup"];let bCat="Tất cả",bShown=10;const bodies={};
const posts=()=>(db.blog||[]).filter(b=>b.tt==="Đã đăng"&&b.tieuDe).sort((a,b)=>a.tg<b.tg?1:-1);
const ngayVN=s=>s?`${+s.slice(8,10)}/${+s.slice(5,7)}/${s.slice(0,4)}`:"";
function postImg(b,full){if(b.anh)return b.anh;for(const id of (b.spLienQuan||[])){const a=CD.anhCua(id,true)[0];if(a)return full?a.src:(a.th||a.src)}return ""}
function postCard(b){const u=postImg(b),im=u?`<img src="${esc(u)}" alt="" loading="lazy">`:esc((b.chuDe||"C").slice(0,1));
  return `<button class="post" type="button" data-bai="${esc(b.id)}"><span class="im">${im}</span><span><span class="k">${esc(b.chuDe||"Blog")} · ${ngayVN(b.tg)}</span><b>${esc(b.tieuDe)}</b><p>${esc(b.tomTat||"")}</p></span></button>`}
function featCard(b){const u=postImg(b,true);return `<button class="feat" type="button" data-bai="${esc(b.id)}">${u?`<img src="${esc(u)}" alt="">`:""}<span class="tx"><span class="k">${esc(b.chuDe||"Blog")} · ${ngayVN(b.tg)}</span><b>${esc(b.tieuDe)}</b><p>${esc(b.tomTat||"")}</p></span></button>`}
function bindPosts(root){root.querySelectorAll("[data-bai]").forEach(x=>x.onclick=()=>view("post",x.dataset.bai))}
function renderTeaser(){const ps=posts().slice(0,4);$("#blogTeaser").hidden=!ps.length;$("#blogRow").innerHTML=ps.map(postCard).join("");bindPosts($("#blogRow"))}
function renderBlog(){const all=posts(),have=new Set(all.map(b=>b.chuDe));
  $("#blogCat").innerHTML=CAT.filter(c=>c==="Tất cả"||have.has(c)).map(c=>`<button class="chip" type="button" aria-pressed="${c===bCat}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
  $("#blogCat").querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{bCat=b.dataset.c;bShown=10;renderBlog()});
  const list=all.filter(b=>bCat==="Tất cả"||b.chuDe===bCat);
  $("#blogList").innerHTML=list.length?featCard(list[0])+list.slice(1,bShown).map(postCard).join(""):'<div class="empty">Bài viết đầu tiên sẽ lên sớm. Nàng ghé lại sau nhé.</div>';
  bindPosts($("#blogList"));const left=list.length-bShown;
  $("#blogMore").innerHTML=left>0?`<button class="btn" type="button" id="bMore">Xem thêm bài</button>`:"";if(left>0)$("#bMore").onclick=()=>{bShown+=10;renderBlog()}}
function blk(x,first){const t=esc(x.x||"");
  if(x.t==="h")return `<h2>${t}</h2>`;if(x.t==="tip")return `<p class="tip"><b>Mẹo nhỏ</b>${t}</p>`;if(x.t==="q")return `<blockquote class="pull">${t}</blockquote>`;
  if(x.t==="ul"||x.t==="ol"){const it=(Array.isArray(x.x)?x.x:[]).map(i=>`<li>${esc(i)}</li>`).join("");return x.t==="ul"?`<ul>${it}</ul>`:`<ol>${it}</ol>`}
  return `<p${first?' class="lede"':""}>${t}</p>`}
/* một bài viết dạng e-magazine: ảnh bìa tràn màn hình, chữ cột hẹp, ảnh đầm xen giữa các phần, khối gợi ý đầm */
function openPost(id){const b=(db.blog||[]).find(x=>x.id===id);const el=$("#postBody");
  const back=`<button class="crumb" type="button" data-go="blog"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3L5 8l5 5"/></svg>Blog</button>`;
  if(b&&curView==="post")document.title=b.tieuDe+" · Chérie";
  if(!b){el.innerHTML=`<header class="mag-hero noimg"><div class="in gut">${back}<h1>Không tìm thấy bài</h1><p class="deck">Bài này có thể đã được gỡ.</p></div></header>`;return}
  const body=bodies[id]||(b.noiDung?b:null);
  const sp=(((body&&body.spLienQuan)||b.spLienQuan)||[]).map(i=>db.sp.find(s=>s.id===i)).filter(s=>s&&s.tt!=="Ngưng"&&s.tt!=="Mất").slice(0,4);
  const pics=sp.map(s=>({s,a:CD.anhCua(s.id,true)})).filter(x=>x.a.length);
  const cover=b.anh||(pics[0]&&pics[0].a[0].src)||"";
  /* ảnh xen giữa bài: lấy ảnh khác ảnh bìa của các mẫu được gợi ý */
  const inl=[];pics.forEach((x,i)=>{const a=x.a[i===0?1:0]||(i===0?null:x.a[0]);if(a&&a.src!==cover)inl.push({s:x.s,a})});
  let html="",sec=0,firstP=true,used=0;
  if(body)(body.noiDung||[]).forEach(x=>{if(x.t==="h"){sec++;if(sec>=2&&sec%2===0&&used<inl.length){const f=inl[used++];html+=`<figure class="mag-fig wide"><button class="im" type="button" data-psp="${f.s.id}"><img src="${esc(f.a.src)}" alt="${esc(f.s.ten)}" loading="lazy"></button><figcaption><span><b>${esc(f.s.ten)}</b> · ${esc(f.s.mo)}</span><span>${f.a.loai==="Ảnh hãng"?"Ảnh: "+esc(f.s.brand||"thương hiệu"):"Ảnh: Chérie"}</span></figcaption></figure>`}}
    html+=blk(x,x.t==="p"&&firstP);if(x.t==="p")firstP=false});
  else html=`<div class="skel" style="width:90%"></div><div class="skel"></div><div class="skel" style="width:70%"></div>`;
  const look=sp.length?`<section class="look wide"><header><p class="eyebrow">Mặc gì cho bài này</p><h3>Những chiếc tụi mình chọn</h3><p class="note">Chạm vào đầm để xem lịch trống và giữ chiếc nàng thích.</p></header><div class="row">${sp.map(s=>{const a=CD.anhCua(s.id,true)[0];return `<button class="lk" type="button" data-psp="${s.id}"><span class="im">${a?`<img src="${esc(a.th||a.src)}" alt="${esc(s.ten)}" loading="lazy">`:dressSvg(s,"lk"+s.id)}</span><span class="br">${esc(s.brand||"Chérie")} · Size ${esc(s.size)}</span><b>${esc(s.ten)}</b><span class="mo">${esc(s.mo)}</span><span class="pr">${money(s.gia)} <span>/ lượt</span></span></button>`}).join("")}</div></section>`:"";
  const rel=posts().filter(x=>x.id!==id).sort((a,c)=>(c.chuDe===b.chuDe)-(a.chuDe===b.chuDe)).slice(0,3);
  el.innerHTML=`<header class="mag-hero${cover?"":" noimg"}">${cover?`<img src="${esc(cover)}" alt="" fetchpriority="high">`:""}${back}<div class="in gut"><p class="k">${esc(b.chuDe||"Blog")} · Chérie Journal</p><h1>${esc(b.tieuDe)}</h1>${b.tomTat?`<p class="deck">${esc(b.tomTat)}</p>`:""}<p class="meta"><span>${ngayVN(b.tg)}</span>${b.phut?`<span>${b.phut} phút đọc</span>`:""}</p></div></header>
   <div class="mag-body">${html}${look}
    <div class="mag-end"><a class="btn solid" href="#bst" data-go="home" style="align-self:flex-start">Xem đầm còn trống</a>
     ${body&&(body.nguon||[]).length?`<p class="src"><span>Nguồn:</span> ${[...new Set(body.nguon.map(n=>String(n.ten||"").split(/[:|–—]/)[0].trim()).filter(Boolean))].map(esc).join(" · ")}</p>`:""}
</div>
    ${rel.length?`<div class="more-read"><h3>Đọc tiếp</h3><div class="posts">${rel.map(postCard).join("")}</div></div>`:""}
   </div>`;
  el.querySelectorAll("[data-psp]").forEach(x=>x.onclick=()=>{stack=[];go(()=>openSP(x.dataset.psp),true)});bindPosts(el);
  if(!body&&window.GASDB)GASDB.call("baiViet",{id}).then(r=>{if(r&&r.bai){bodies[id]=r.bai;if(curView==="post"&&curArg===id)openPost(id)}},()=>{if(curView==="post"&&curArg===id)el.querySelectorAll(".skel").forEach(x=>x.outerHTML='<p class="note">Chưa tải được bài, nàng kéo xuống để thử lại.</p>')})}

/* ----- khởi động ----- */
$("#dNhan").value=addD(TODAY,1);$("#dTra").value=addD(TODAY,2);$("#dNhan").min=TODAY;$("#dTra").min=TODAY;
$("#dNhan").onchange=()=>setDates();
$("#fDate").onclick=()=>{stack=[];go(openDates,true)};
$("#dTra").onchange=()=>setDates();
const startBook=()=>{stack=[];go(bag.length?openBag:checkout1,true)};
["#topBook","#heroBook"].forEach(s=>$(s).onclick=()=>{stack=[];draft.mode="thu";draft.cach="tan";saveDraft();go(bag.length?openBag:checkout1,bag.length>0)});
$("#barBook").onclick=startBook;
$("#barInfo").onclick=()=>{if(bag.length)startBook();else toSec("cach")};
["#rvWrite","#footRv"].forEach(x=>$(x).onclick=()=>{stack=[];go(openReview)});
renderInfo();
$("#bagBtn").onclick=openBagFresh;
/* ----- băng trượt đầu trang: lời giới thiệu, các mẫu có ảnh đẹp, banner khuyến mãi (bảng banner) ----- */
let heroT=null,heroIdle=0,heroSig="";
function renderHero(){const ok=s=>s.tt!=="Ngưng"&&s.tt!=="Mất"&&s.tt!=="Sửa",ph=s=>CD.anhCua(s.id,true)[0];
  const picks=db.sp.filter(s=>ok(s)&&ph(s)).sort((a,b)=>(b.gia||0)-(a.gia||0)).slice(0,6);
  const today=TODAY,bn=(db.banner||[]).filter(b=>b.tt==="Hiện"&&b.anh&&(!b.tu||b.tu<=today)&&(!b.den||b.den>=today)).sort((a,b)=>(a.thuTu||0)-(b.thuTu||0));
  const sig=JSON.stringify([picks.map(s=>s.id+(ph(s)||{}).src),bn.map(b=>b.id+b.anh)]);if(sig===heroSig)return;heroSig=sig;
  const fb=picks.length||bn.length?[]:db.sp.filter(ok).slice(0,1);
  const slides=bn.map(b=>`<button type="button" data-bl="${esc(b.link||"")}" aria-label="${esc(b.tieuDe||"Ưu đãi")}"><img src="${esc(b.anh)}" alt="${esc(b.tieuDe||"")}" loading="lazy"></button>`)
   .concat(picks.map((s,i)=>`<button type="button" data-hsp="${s.id}" aria-label="Xem ${esc(s.ten)}"><img src="${esc(ph(s).src)}" alt="${esc(s.ten)}" ${i===0&&!bn.length?'fetchpriority="high"':'loading="lazy"'}></button>`))
   .concat(fb.map(s=>`<button type="button" data-hsp="${s.id}" aria-label="Xem ${esc(s.ten)}">${dressSvg(s,"h0")}</button>`));
  const hs=$("#hs");hs.innerHTML=slides.join("");hs.scrollLeft=0;
  $("#hsDots").innerHTML=slides.length>1?slides.map((_,i)=>`<button type="button" aria-label="Ảnh ${i+1}/${slides.length}" aria-current="${i===0}"></button>`).join(""):"";
  $("#hsDots").querySelectorAll("button").forEach((d,i)=>d.onclick=()=>{heroIdle=Date.now()+12000;heroGo(i)});
  hs.querySelectorAll("[data-hsp]").forEach(b=>b.onclick=()=>{stack=[];go(()=>openSP(b.dataset.hsp),true)});
  hs.querySelectorAll("[data-bl]").forEach(b=>b.onclick=()=>{const l=b.dataset.bl;if(!l)return;if(/^#?bst$/.test(l))toSec("bst");else if(/^(info|blog)$/.test(l))view(l);else if(/^bai:/.test(l))view("post",l.slice(4));else if(/^https:\/\//.test(l))window.open(l,"_blank","noopener")});
  startHero()}
function heroIdx(){const hs=$("#hs");return Math.round(hs.scrollLeft/Math.max(1,hs.clientWidth))}
function heroGo(i){const hs=$("#hs");const n=hs.children.length;if(!n)return;i=(i+n)%n;hs.scrollTo({left:i*hs.clientWidth,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}
function startHero(){const hs=$("#hs");
  if(!hs.dataset.b){hs.dataset.b=1;
    hs.addEventListener("scroll",()=>{const i=heroIdx();$("#hsDots").querySelectorAll("button").forEach((d,j)=>d.setAttribute("aria-current",j===i))},{passive:true});
    ["pointerdown","touchstart","wheel"].forEach(ev=>hs.addEventListener(ev,()=>{heroIdle=Date.now()+12000},{passive:true}))}
  clearInterval(heroT);if(hs.children.length<2||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  heroT=setInterval(()=>{if(document.hidden||Date.now()<heroIdle||layer.classList.contains("on")||$("#vHome").hidden)return;const r=hs.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;heroGo(heroIdx()+1)},5000)}

renderHero();
renderFilters();renderGrid();renderTeaser();
(function(){const q=Object.assign({},Object.fromEntries(new URLSearchParams(location.search)),(window.CHERIE&&window.CHERIE.q)||{});if(q.bai)view("post",q.bai,{noPush:true});else if(q.v&&VIEWS[q.v])view(q.v,null,{noPush:true})})();
})();

/* ô ngày, giờ đẹp và gọn trên iPhone: bọc mọi input date/time, hiện "T4, 28/10/2026" hoặc "15:00" */
(function(){const TH=["CN","T2","T3","T4","T5","T6","T7"];
  const IC={date:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',time:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>'};
  const txt=i=>{const v=i.value;if(!v)return i.type==="time"?"Chọn giờ":"Chọn ngày";if(i.type==="time")return v.slice(0,5);const d=new Date(v+"T00:00:00");return isNaN(d)?v:`${TH[d.getDay()]}, ${v.slice(8,10)}/${v.slice(5,7)}/${v.slice(0,4)}`};
  const sync=i=>{const pv=i.parentNode&&i.parentNode.querySelector(".pv");if(!pv)return;const t=txt(i);if(pv.textContent!==t)pv.textContent=t;pv.classList.toggle("ph",!i.value)};
  const wrap=i=>{if(i.dataset.pk||i.closest("[hidden]"))return;i.dataset.pk=1;const w=document.createElement("span");w.className="pick";w.innerHTML=`<span class="pv"></span>${IC[i.type]||""}`;i.parentNode.insertBefore(w,i);w.appendChild(i);["input","change","blur"].forEach(e=>i.addEventListener(e,()=>sync(i)));sync(i)};
  const all=()=>document.querySelectorAll('input[type=date],input[type=time]').forEach(i=>{if(!i.dataset.pk)wrap(i);else sync(i)});
  try{new MutationObserver(all).observe(document.body,{childList:true,subtree:true})}catch(e){}
  setInterval(()=>document.querySelectorAll('input[data-pk]').forEach(sync),600);all()})();
