/* Chérie · cầu nối dữ liệu giữa giao diện và Google Apps Script.
   Giả lập đúng giao diện kho dữ liệu cũ (collection().doc().set/delete, onSnapshot) nên các app chạy gần như nguyên bản.
   Trang nhân sự: bắt đăng nhập bằng tên + mã PIN, chỉ mở được trang đúng vai trò. Website: chỉ đọc dữ liệu công khai, chỉ gửi yêu cầu, cảm nhận, lead. */
(function(){
"use strict";
var C=window.CHERIE||{page:"web",pub:true,url:""};
var KEY="cherie-gas-token",ME="cherie-gas-me";
var token="",me=null;try{token=localStorage.getItem(KEY)||"";me=JSON.parse(localStorage.getItem(ME)||"null")}catch(e){}
/* báo lỗi ngay trên màn hình để dễ xử lý */
window.addEventListener("error",function(ev){try{var d=document.createElement("div");d.style.cssText="position:fixed;left:8px;right:8px;top:8px;z-index:100000;background:#7A1F3D;color:#fff;padding:10px 12px;border-radius:12px;font:13px/1.4 system-ui";d.textContent="Lỗi: "+(ev.message||"")+" "+(ev.lineno?"(dòng "+ev.lineno+")":"");document.body.appendChild(d)}catch(e){}});
function call(fn,args){return new Promise(function(ok,no){var done=false,tm=setTimeout(function(){if(done)return;done=true;var x=new Error("Máy chủ Google phản hồi quá 40 giây. Bấm Thử lại.");x.code="unavailable";no(x)},40000);
  if((!window.google||!google.script||!google.script.run)&&C.api&&C.pub){
    /* website ở tên miền riêng: gọi cổng JSON công khai của Apps Script */
    var u=C.api+"?api="+encodeURIComponent(fn)+"&q="+encodeURIComponent(JSON.stringify(args||{}));
    var fin=function(r){if(done)return;done=true;clearTimeout(tm);if(r&&r.err){var e=new Error(r.err);e.code=r.code||"error";no(e)}else ok(r)};
    /* gọi kiểu JSONP (thẻ script) để không vướng chặn tên miền chéo; lỗi thì thử fetch */
    var jsonp=function(){var cb="__cherie"+Date.now().toString(36)+Math.floor(Math.random()*1e6),s=document.createElement("script");
      window[cb]=function(r){try{delete window[cb]}catch(x){window[cb]=void 0}s.remove();fin(r)};
      s.onerror=function(){s.remove();fetch(u,{redirect:"follow"}).then(function(r){return r.json()}).then(fin,function(){if(done)return;done=true;clearTimeout(tm);var x=new Error("Mạng chậm, nàng thử lại nhé.");x.code="unavailable";no(x)})};
      s.src=u+"&cb="+cb;document.head.appendChild(s)};
    jsonp();return}
  if((!window.google||!google.script||!google.script.run)&&C.api){
    /* app nội bộ ở tên miền riêng: gửi POST thân JSON (text/plain để không cần hỏi trước), nhận JSON */
    /* mạng điện thoại hay rớt một nhịp (nhất là khi bấm quay lại trang trước): tự thử lại 4 lần trước khi báo lỗi */
    var body=JSON.stringify(Object.assign({fn:fn,token:token,page:C.page},args||{})),lan=0,cho=[600,1500,3000,5000];
    var thu=function(){fetch(C.api,{method:"POST",redirect:"follow",body:body}).then(function(r){return r.json()}).then(function(r){
      if(done)return;done=true;clearTimeout(tm);if(r&&r.err){var e=new Error(r.err);e.code=r.code||"error";if(e.code==="revoked")onRevoked();no(e)}else ok(r)},
      function(){if(done)return;if(lan<cho.length){setTimeout(thu,cho[lan++]);return}done=true;clearTimeout(tm);var x=new Error("Không kết nối được máy chủ Google. Kiểm tra mạng rồi thử lại.");x.code="unavailable";no(x)})};
    thu();return}
  if(!window.google||!google.script||!google.script.run){var x=new Error("offline");x.code="unavailable";return no(x)}
  google.script.run.withSuccessHandler(function(r){if(done)return;done=true;clearTimeout(tm);if(r&&r.err){var e=new Error(r.err);e.code=r.code||"error";if(e.code==="revoked")onRevoked();no(e)}else ok(r)})
    .withFailureHandler(function(e){if(done)return;done=true;clearTimeout(tm);var x=new Error(String(e&&e.message||e));x.code="unavailable";no(x)})
    .api(Object.assign({fn:fn,token:token,page:C.page},args||{}))})}
/* ---------- tự báo lỗi về máy chủ để agent kiểm tra định kỳ và báo chủ tiệm ---------- */
var daBao={},soBao=0;
function baoLoi(loai,ct,url){try{ct=String(ct||"").replace(/data:[^ )"']{40,}/g,"data:…").slice(0,300);var k=loai+"|"+ct;if(daBao[k]||soBao>=15||!C.api)return;daBao[k]=1;soBao++;
  var o={trang:C.page||"",loai:loai,ct:ct,url:String(url||"").slice(0,300)};
  /* mất mạng thì giữ lỗi lại trên máy, có mạng gửi bù để agent kiểm lỗi vẫn thấy */
  call("baoLoi",o).catch(function(){try{var q=JSON.parse(localStorage.getItem("cherie-loi-cho")||"[]");if(q.length<20){q.push(o);localStorage.setItem("cherie-loi-cho",JSON.stringify(q))}}catch(e){}})}catch(e){}}
function guiLoiCho(){try{var q=JSON.parse(localStorage.getItem("cherie-loi-cho")||"[]");if(!q.length)return;localStorage.removeItem("cherie-loi-cho");q.forEach(function(o){call("baoLoi",o).catch(function(){})})}catch(e){}}
window.addEventListener("error",function(ev){var t=ev.target;
  if(t&&t.tagName==="IMG"){var src=t.currentSrc||t.src||"";if(!src||/^data:/.test(src))return;
    /* ảnh hỏng: thử ảnh dự phòng, hết thì ẩn để hiện nền màu thay vì dấu ? */
    var fb=(t.getAttribute("data-fb")||"").split("|").filter(Boolean);if(fb.length){t.setAttribute("data-fb",fb.slice(1).join("|"));t.src=fb[0];baoLoi("Ảnh hỏng, đã dùng ảnh dự phòng",(t.alt||"")+" "+src,src);return}
    if(!C.pub)t.style.visibility="hidden";baoLoi("Ảnh hỏng",(t.alt||"")+" "+src,src);return}
  if(ev.message)baoLoi("Lỗi JS",ev.message+" @ "+String(ev.filename||"").replace(/\?.*$/,"").split("/").pop()+":"+(ev.lineno||""))},true);
window.addEventListener("unhandledrejection",function(ev){var r=ev.reason;var m=r&&(r.message||String(r));if(!m||/quá 40 giây|Mạng chậm|Không kết nối được|hết hạn/.test(m))return;baoLoi("Lỗi JS (promise)",m)});
function saveAuth(t,m){token=t||"";me=m||null;try{if(token){localStorage.setItem(KEY,token);localStorage.setItem(ME,JSON.stringify(me))}else{localStorage.removeItem(KEY);localStorage.removeItem(ME)}}catch(e){}
  if(me&&me.ten){try{if(me.vaiTro==="Stylist"||!localStorage.getItem("cherie-stylist-ten"))localStorage.setItem("cherie-stylist-ten",me.ten)}catch(e){}}}
function logout(){saveAuth("",null);try{localStorage.removeItem("cherie-home")}catch(e){}location.reload()}
var revoked=false;function onRevoked(){if(revoked||C.pub)return;revoked=true;saveAuth("",null);gate().then(function(){location.reload()})}

/* ---------- màn đăng nhập ---------- */
var CSS="#gasGate{position:fixed;inset:0;z-index:99999;background:#F5F3F2;color:#1B1618;display:flex;align-items:center;justify-content:center;padding:24px max(16px,env(safe-area-inset-left,0px));font:15px/1.5 'Be Vietnam Pro',system-ui,sans-serif}"+
"#gasGate .bx{width:100%;max-width:380px;display:flex;flex-direction:column;gap:14px}#gasGate .mk{font-family:'Bodoni Moda',Didot,Georgia,serif;font-size:26px;letter-spacing:.32em}"+
"#gasGate h1{font-family:'Bodoni Moda',Didot,Georgia,serif;font-weight:500;font-size:26px;margin:0}#gasGate p{margin:0;color:#6C6266;font-size:14px}"+
"#gasGate label{display:flex;flex-direction:column;gap:6px;font-size:13px;color:#6C6266}#gasGate input,#gasGate select{font:inherit;font-size:17px;padding:12px 14px;border:1px solid #E4DDDA;border-radius:14px;background:#FFFFFF;color:#1B1618}"+
"#gasGate button{font:inherit;font-weight:600;padding:14px;border:0;border-radius:999px;background:#7A1F3D;color:#F5F3F2;cursor:pointer}#gasGate button[disabled]{opacity:.6}#gasGate .er{color:#7A1F3D;font-size:14px;min-height:1em}#gasGate a{color:#8C6B3A}";
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function box(html){var g=document.getElementById("gasGate");if(!g){var st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);g=document.createElement("div");g.id="gasGate";document.body.appendChild(g)}g.innerHTML='<div class="bx"><div class="mk">CH&Eacute;RIE</div>'+html+'</div>';return g}
function closeGate(){var g=document.getElementById("gasGate");if(g)g.remove()}
function gate(){return new Promise(function(done){
  box('<p>Đang tải…</p>');
  call("staffList").then(function(r){
    if(r.setup){
      var g=box('<h1>Tạo tài khoản chủ tiệm</h1><p>Lần đầu dùng hệ thống. Tài khoản này có toàn quyền, tạo PIN cho nhân sự trong mục Nhân sự.</p><label>Tên của bạn<input id="gT" autocomplete="name"></label><label>Mã PIN (4–8 số)<input id="gP" type="password" inputmode="numeric" autocomplete="new-password"></label><label>Nhập lại mã PIN<input id="gP2" type="password" inputmode="numeric"></label><div class="er" id="gE"></div><button id="gB">Tạo và vào hệ thống</button>');
      g.querySelector("#gB").onclick=function(){var t=g.querySelector("#gT").value.trim(),p=g.querySelector("#gP").value,e=g.querySelector("#gE");
        if(!t)return e.textContent="Nhập tên.";if(!/^\d{4,8}$/.test(p))return e.textContent="PIN gồm 4–8 số.";if(p!==g.querySelector("#gP2").value)return e.textContent="Hai lần nhập PIN chưa khớp.";
        this.disabled=true;call("setup",{ten:t,pin:p}).then(function(x){saveAuth(x.token,x.me);closeGate();done(x.me)},function(x){e.textContent=x.message;g.querySelector("#gB").disabled=false})};
      return}
    var opts=r.staff.map(function(s){return '<option value="'+esc(s.id)+'">'+esc(s.ten)+' · '+esc(s.vaiTro)+'</option>'}).join("");
    var g=box('<h1>Đăng nhập</h1><p>Chọn tên của bạn và nhập mã PIN. Chưa có PIN thì nhờ chủ tiệm tạo trong mục Nhân sự.</p><label>Nhân sự<select id="gN">'+opts+'</select></label><label>Mã PIN<input id="gP" type="password" inputmode="numeric" autocomplete="current-password"></label><div class="er" id="gE"></div><button id="gB">Vào</button>'+(C.url?'<p><a href="'+esc(C.url)+'" target="_top">Về website Chérie</a></p>':''));
    var go=function(){var e=g.querySelector("#gE"),b=g.querySelector("#gB");b.disabled=true;e.textContent="";
      call("login",{nv:g.querySelector("#gN").value,pin:g.querySelector("#gP").value}).then(function(x){saveAuth(x.token,x.me);closeGate();done(x.me)},function(x){e.textContent=x.message;b.disabled=false})};
    g.querySelector("#gB").onclick=go;g.querySelector("#gP").onkeydown=function(ev){if(ev.key==="Enter")go()};
  },function(e){if(e&&e.code==="unavailable"&&!gate.lan){gate.lan=1;box('<p>Mạng chập chờn, đang kết nối lại…</p>');setTimeout(function(){gate().then(done)},2500);return}
    box('<h1>Chưa kết nối được</h1><p>'+esc(e.message)+'</p><button onclick="location.reload()">Thử lại</button>')})})}
/* quay lại trang trước (trình duyệt lấy trang từ bộ nhớ đệm): nếu đang kẹt màn lỗi thì tự tải lại */
window.addEventListener("pageshow",function(ev){if(ev.persisted){var g=document.getElementById("gasGate");if(g&&/Chưa kết nối được|Đang tải/.test(g.textContent))location.reload()}});
function denied(msg){box('<h1>Không mở được trang này</h1><p>'+esc(msg)+'</p><p><a href="'+esc(C.paths?C.paths.home:C.url+'?p=home')+'" target="_top">Về trang nhân sự</a></p><button id="gO">Đăng xuất</button>').querySelector("#gO").onclick=logout}

/* ---------- kho dữ liệu giả lập ---------- */
var store={},subs={},lastT=0,loaded=false,queue=[],flushT=0;
function snap(t){var m=store[t]||{};var docs=Object.keys(m).sort().map(function(id){return{id:id,exists:true,data:function(){return JSON.parse(JSON.stringify(m[id]))},metadata:{fromCache:false,hasPendingWrites:false}}});
  return{docs:docs,size:docs.length,empty:!docs.length,metadata:{fromCache:false,hasPendingWrites:false},docChanges:function(){return[]}}}
function emit(t){(subs[t]||[]).forEach(function(s){try{s.next(snap(t))}catch(e){}})}
function applyRows(rows){var ch={};(rows||[]).forEach(function(r){store[r.c]=store[r.c]||{};if(r.d==null)delete store[r.c][r.id];else store[r.c][r.id]=r.d;ch[r.c]=1;if(r.t>lastT)lastT=r.t});return Object.keys(ch)}
function flush(){flushT=0;var q=queue;queue=[];if(!q.length)return;
  var ops=q.map(function(x){return{c:x.c,id:x.id,d:x.d}});
  var fn=C.pub?"pubPut":"put";
  call(fn,{ops:ops}).then(function(r){var rows=(r&&r.rows)||[];rows.forEach(function(x){store[x.c]=store[x.c]||{};if(x.d==null)delete store[x.c][x.id];else store[x.c][x.id]=x.d});
      q.forEach(function(x){x.ok()});setTimeout(function(){var ts={};rows.forEach(function(x){ts[x.c]=1});Object.keys(ts).forEach(emit)},60)},
    function(e){if(!(e&&(e.code==="not_granted"||e.code==="revoked")))baoLoi("Lưu không được",(e&&e.message||"")+" · bảng "+ops.map(function(o){return o.c}).filter(function(v,i,a){return a.indexOf(v)===i}).join(","));q.forEach(function(x){x.no(e)})})}
var chiXem=false,baoT=0;
function baoChiXem(){if(baoT)return;var n=document.createElement("div");n.setAttribute("role","alert");n.textContent="Bạn chỉ có quyền xem trang này. Thay đổi không được lưu, trang sẽ tải lại.";
  n.style.cssText="position:fixed;left:16px;right:16px;bottom:calc(90px + env(safe-area-inset-bottom,0px));z-index:10000;background:#7A1E3A;color:#fff;padding:12px 14px;border-radius:10px;font:600 14px/1.4 system-ui";document.body.appendChild(n);baoT=setTimeout(function(){location.reload()},1800)}
function cheDo(){var q=me&&me.q;if(!q||["quay","stylist","marketing","admin"].indexOf(C.page)<0||q[C.page]!=="xem")return;chiXem=true;
  var st=document.createElement("style");st.textContent=".chi-xem .btn.primary,.chi-xem nav.tabs .add{display:none!important}.chixem-bar{position:sticky;top:0;z-index:30;background:#F3E3C3;color:#6B4A00;font:600 13px/1.4 system-ui;padding:8px 16px;text-align:center}";document.head.appendChild(st);
  document.documentElement.classList.add("chi-xem");var b=document.createElement("div");b.className="chixem-bar";b.textContent="Chế độ chỉ xem. Muốn chỉnh, nhờ chủ tiệm cấp quyền Sửa trong Admin.";document.body.insertBefore(b,document.body.firstChild)}
function enqueue(c,id,d){return new Promise(function(ok,no){
  if(C.pub&&["yc","review","lead"].indexOf(c)<0)return ok();
  if(chiXem){ok();baoChiXem();return}
  queue=queue.filter(function(x){if(x.c===c&&x.id===id){x.ok();return false}return true});
  queue.push({c:c,id:id,d:d,ok:ok,no:no});if(!flushT)flushT=setTimeout(flush,80)})}
var remote={collection:function(t){return{
  doc:function(id){return{set:function(d){return enqueue(t,id,d)},delete:function(){return enqueue(t,id,null)}}},
  onSnapshot:function(next,error){(subs[t]=subs[t]||[]).push({next:next,error:error});if(loaded)setTimeout(function(){emit(t)},0);return function(){}}}}};
function poll(){if(C.pub||!loaded||document.hidden)return;call("since",{t:lastT}).then(function(r){applyRows(r.rows).forEach(emit);if(r.t>lastT)lastT=r.t},function(){})}
var ready=null;
function start(){
  if(ready)return ready;
  var t0=Date.now(),cham=setTimeout(function(){baoLoi("Tải dữ liệu chậm","Quá 25 giây chưa tải xong dữ liệu trang "+C.page)},25000);
  ready=(C.pub?call("pubLoad"):(token?call("me"):Promise.reject({code:"revoked"})).catch(function(e){if(e&&e.code==="unavailable"&&token)return{me:me};return gate().then(function(m){return{me:m}})}).then(function(x){
      if(x&&x.me)me=x.me;return call("load",{page:C.page})}))
    .then(function(r){clearTimeout(cham);if(Date.now()-t0>12000)baoLoi("Tải dữ liệu chậm","Mất "+Math.round((Date.now()-t0)/1000)+" giây để tải trang "+C.page);if(r&&r.me)me=r.me;cheDo();applyRows(r.rows);lastT=r.t||0;loaded=true;Object.keys(subs).forEach(emit);
      guiLoiCho();if(!C.pub){setInterval(poll,15000);document.addEventListener("visibilitychange",function(){if(!document.hidden)poll()})}
      return remote},
    function(e){clearTimeout(cham);if(e&&e.code==="not_granted")denied(e.message);else if(!(e&&e.code==="revoked")){baoLoi("Không tải được dữ liệu",(e&&e.message)||String(e));if(e&&e.code==="unavailable"){box('<h1>Chưa kết nối được</h1><p>Mạng đang chập chờn. Tụi mình sẽ tự thử lại khi có mạng.</p><button onclick="location.reload()">Thử lại</button>');window.addEventListener("online",function(){location.reload()});setTimeout(function(){if(!document.hidden)location.reload()},15000)}}return remote});
  return ready}
window.claude={use:function(n){return n==="db"?start():Promise.resolve(null)}};
/* trang nhân sự: chỉ cần biết mình là ai và được mở app nào, không tải cả kho dữ liệu */
function who(){var moi=false;return (token?call("me"):Promise.reject({code:"revoked"})).catch(function(e){if(e&&e.code==="unavailable"&&token)throw e;moi=true;return gate().then(function(){return call("me")})}).then(function(r){r.moi=moi;return r})}
window.GASDB={call:call,who:who,baoLoi:baoLoi,me:function(){return me},logout:logout,start:start,
  afterShared:function(){var CD=window.CherieData;if(!CD)return;
    /* website: giá trị đã tính sẵn ở máy chủ, không gửi giá nhập ra ngoài */
    if(C.pub){var g=CD.giaTri;CD.giaTri=function(s){return s&&s.giaTri!=null?+s.giaTri:g(s)}}
    /* ảnh tự chụp: tải lên Drive qua máy chủ, nén nhẹ hơn để gửi nhanh */
    if(!C.pub){var n=CD.nenAnh;CD.nenAnh=function(f,max,q){return n(f,max||1400,q||0.82)}}}};
/* nút nhỏ góc dưới: tài khoản và đăng xuất, chỉ ở trang nhân sự */
if(!C.pub&&C.page!=="home")document.addEventListener("DOMContentLoaded",function(){var a=document.createElement("a");a.href=C.paths?C.paths.home:C.url+"?p=home";a.target="_top";a.textContent="☰";a.title="Trang nhân sự";var slot=document.getElementById("homeSlot");if(slot){slot.href=a.href;slot.target="_top";return}
  a.style.cssText="position:fixed;left:max(10px,env(safe-area-inset-left,0px));bottom:calc(78px + env(safe-area-inset-bottom,0px));z-index:9999;width:38px;height:38px;border-radius:50%;background:#1B1618;color:#F5F3F2;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:16px;opacity:.75";document.body.appendChild(a)});
})();
