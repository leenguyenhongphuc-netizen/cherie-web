/*
 * Khuôn video Chérie v2 (27/10/2026) — thay khuôn "Hé lộ 3 chiếc".
 * Nguyên tắc: khung đầu tiên đã có hình chuyển động và chữ; cắt theo phách 120 BPM
 * (15 frame một phách, cắt nhanh 7–8 frame); mỗi cú cắt có lực (đẩy vào, chớp flash, trượt);
 * chữ nhảy theo phách, không hiện mờ dần; không khung xám mờ.
 * Ba định dạng: "lat-gia" (lật giá trị → giá thuê), "chon-1" (chọn 1 trong 2–3 chiếc), "can-canh" (cận chất liệu rồi lộ dáng).
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { FONT_CSS } from "./fontcss";

if (typeof document !== "undefined" && !document.getElementById("cherie-fonts")) {
  const h = delayRender("Tải phông Chérie");
  const st = document.createElement("style");
  st.id = "cherie-fonts";
  st.textContent = FONT_CSS.split("FONTDIR").join(staticFile("fonts"));
  document.head.appendChild(st);
  Promise.all([
    document.fonts.load('400 40px "Bodoni Moda"', "Chiếc đầm"),
    document.fonts.load('600 40px "Bodoni Moda"', "CHÉRIE"),
    document.fonts.load('italic 400 40px "Bodoni Moda"', "Nàng mặc"),
    document.fonts.load('400 40px "Be Vietnam Pro"', "Thuê lượt"),
    document.fonts.load('500 40px "Be Vietnam Pro"', "Khai trương"),
    document.fonts.load('600 40px "Be Vietnam Pro"', "Theo dõi"),
  ]).then(() => continueRender(h), () => continueRender(h));
}

const SERIF = '"Bodoni Moda", Didot, Georgia, serif';
const SANS = '"Be Vietnam Pro", system-ui, sans-serif';
const IVORY = "#F5F3F2"; /* nền bg bộ nhận diện 30/10/2026 */
const NOIR = "#1B1618"; /* mực ink */
const CHAMP = "#D2B27F"; /* vàng đồng trên nền tối, ảnh (gold-on-wine) */
const GOLD = "#8C6B3A"; /* vàng đồng gốc: chỉ nét mảnh trên nền sáng */
const GOLD_ON_DARK = "#D2B27F";
const NUDE = "#F4E6EB"; /* vang nhạt wine-soft */
const RUBY = "#7A1F3D"; /* vang wine, màu Thuê đầm */

export type Shot = { src: string; pos?: string; scale?: number };
export type Dress2 = { ten: string; loai?: string; size?: string; gia: string; giaTri?: string; cau?: string; shots: Shot[]; soCat?: number; cauViTri?: "tren" | "duoi"; theViTri?: "tren" | "duoi"; nhip?: number[] }; // soCat: số cú cắt của mẫu (2–5) để kéo dài video mà không cần cảnh dịch vụ; cauViTri: đặt câu cảm giác trên hay dưới // cau: 1 câu cảm giác ngắn, đập vào giữa dải cắt // theViTri: thẻ tên và giá của mẫu này ở trên hay dưới (đè chung theViTri) // nhip: số frame của từng cú cắt (ví dụ [6,10,5,14]), thay công thức cố định soCat x 8 frame rồi giữ
export type Reel2Props = {
  format: "lat-gia" | "chon-1" | "can-canh";
  dresses: Dress2[];
  hookTop: string; // dòng nhỏ khung đầu, ví dụ "Chiếc đầm này"
  hookBig: string; // chữ lớn khung đầu, ví dụ "10.000.000đ"
  hookSub?: string; // dòng sau cú lật, ví dụ "Nàng mặc 24 giờ"
  chuHook?: "tren" | "duoi"; // đặt chữ hook ở nền phía trên (vai, phông) hay phía dưới; chọn chỗ không đè mặt và chi tiết đầm
  doan?: string[]; // can-canh: 2–3 đáp án để nàng đoán, ví dụ ["500k?", "950k?", "1.500.000đ?"]
  dichVu?: [string, string, string]; // 3 nhịp chữ dịch vụ, bỏ trống thì không có cảnh này
  cta: string;
  ctaSub?: string;
  nguon?: string;
  flash?: boolean; // false = bỏ chớp trắng giữa các cảnh (cắt thẳng có lực đẩy), để bài không giống bài trước
  ket?: "ba" | "mot" | "chu"; // khung kết: 3 ảnh, 1 ảnh lớn, hay chỉ chữ trên nền Noir
  dichVuKieu?: "chu" | "the"; // cảnh dịch vụ: chữ đè ảnh tối, hay thẻ Ivory bo 40px trên ảnh sáng
  nhan?: string; // nhãn riêng của bài, ví dụ "LẦN ĐẦU HÉ TỦ", hiện dưới logo suốt video
  /* tuỳ chọn thêm 30/10/2026 (Agent Kiểm lỗi, KHUON-ND001, KHUON-ND003); bỏ trống thì giữ cách cũ */
  mau?: "toi" | "kv"; // "kv": bảng màu key visual tháng — khối chữ trên thẻ Ivory bo 40px, chữ Noir, giá Ruby, không lớp tối
  theViTri?: "tren" | "duoi"; // chỗ thẻ tên và giá trong dải cắt và cảnh lộ dáng (mặc định dưới)
  theKieu?: "day" | "gon"; // "gon": thẻ gọn 2 dòng (dáng · size, rồi tên và viên giá một hàng), thấp hơn, ít đè thân váy
  theVao?: "truot" | "dap"; // "dap": thẻ có ngay ở khung đầu của dải, đập vào theo phách, không hiện mờ dần
  hookLon?: "big" | "top"; // can-canh: "top" cho dòng hookTop thành chữ lớn nhất (ví dụ con số giá trị), hookBig thành dòng nghiêng nhỏ
  gach?: boolean; // lat-gia: false = không gạch con số giá trị (tránh hiểu là giảm giá)
  chonNen?: number; // chon-1: chiều cao (px) mảng nền trơn phía trên ba dải ảnh để đặt chữ hook, ví dụ 640; 0 = ảnh tràn từ trên xuống như cũ
  soNgay?: boolean; // chon-1: số 1-2-3 có ngay ở khung 0,0s
};
/* props của video đang dựng: các mảnh nhỏ đọc tuỳ chọn chung (flash, nhãn) */
let CUR: Partial<Reel2Props> = {};
const KV = () => CUR.mau === "kv";
const FG = () => (KV() ? NOIR : IVORY);
const GIA = () => (KV() ? RUBY : CHAMP);
/* cỡ chữ vừa bề ngang 820px (1080 trừ lề trái 80, phải 180) cho chuỗi không ngắt dòng như "9.000.000đ" */
const fit = (text: string, max: number, k = 0.58) => (/\s/.test(text.trim()) ? max : Math.min(max, Math.floor((KV() ? 750 : 820) / (Math.max(1, text.length) * k))));
/* khối chữ: chế độ kv đặt trên thẻ Ivory bo 40px; chế độ tối giữ nguyên */
const Khoi: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) =>
  KV() ? <div style={{ display: "inline-block", background: IVORY, borderRadius: 40, padding: "26px 34px", ...style }}>{children}</div> : <>{children}</>;

/* ---------- nhịp ---------- */
const B = 15; // 1 phách
const CUT = 8; // cắt nhanh

/* ---------- mảnh ghép ---------- */
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const Photo: React.FC<{ s: Shot; dur: number; mode?: "push" | "drift" | "macro" | "pull" | "reveal"; dir?: 1 | -1 }> = ({ s, dur, mode = "push", dir = 1 }) => {
  const f = useCurrentFrame();
  const base = s.scale ?? 1;
  let sc = base, tx = 0;
  if (mode === "push") sc = base * interpolate(f, [0, 7, Math.max(8, dur)], [1.16, 1.06, 1.0], { extrapolateRight: "clamp", easing: ease });
  if (mode === "reveal") { sc = base * interpolate(f, [0, 6, dur], [1.2, 1.1, 1.0], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }); tx = interpolate(f, [0, dur], [-18 * dir, 18 * dir], { extrapolateRight: "clamp" }); }
  if (mode === "pull") sc = base * interpolate(f, [0, dur], [1.0, 1.1], { extrapolateRight: "clamp" });
  if (mode === "drift") { sc = base * 1.08; tx = interpolate(f, [0, dur], [-30 * dir, 30 * dir], { extrapolateRight: "clamp" }); }
  if (mode === "macro") { sc = base * interpolate(f, [0, dur], [1.0, 1.12], { extrapolateRight: "clamp" }); tx = interpolate(f, [0, dur], [40 * dir, -40 * dir], { extrapolateRight: "clamp" }); }
  return (
    <AbsoluteFill style={{ backgroundColor: NOIR, overflow: "hidden" }}>
      <Img src={staticFile(s.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos ?? "50% 30%", transform: `translateX(${tx}px) scale(${sc})` }} />
    </AbsoluteFill>
  );
};

/* chớp flash trắng ở đầu cảnh: chữ ký "flash trực diện" của Chérie */
const Flash: React.FC<{ at?: number; len?: number; color?: string }> = ({ at = 0, len = 4, color = "#FFFFFF" }) => {
  const f = useCurrentFrame();
  if (CUR.flash === false) return null;
  if (f < at) return null; // chớp đặt giữa cảnh: trước thời điểm chớp không được phủ trắng
  const o = interpolate(f, [at, at + len], [0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return o > 0 ? <AbsoluteFill style={{ backgroundColor: color, opacity: o }} /> : null;
};

/* lớp tối dưới chân hoặc trên đầu để chữ đọc được — đen sâu, không xám */
const Shade: React.FC<{ side?: "top" | "bottom"; h?: number; o?: number }> = ({ side = "bottom", h = 60, o = 0.72 }) => KV() ? null : (
  <AbsoluteFill style={{ background: `linear-gradient(${side === "bottom" ? "to top" : "to bottom"}, rgba(20,20,20,${o}) 0%, rgba(20,20,20,${o * 0.5}) ${h * 0.55}%, rgba(20,20,20,0) ${h}%)` }} />
);

/* chữ đập vào theo phách */
const Slam: React.FC<{ at?: number; children: React.ReactNode; style?: React.CSSProperties; from?: number }> = ({ at = 0, children, style, from = 1.35 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const t = f - at;
  const sc = at === 0 ? interpolate(t, [0, 6], [1.06, 1], { extrapolateRight: "clamp", easing: ease }) : interpolate(t, [0, 5], [from, 1], { extrapolateRight: "clamp", easing: ease });
  const o = at === 0 ? 1 : interpolate(t, [0, 2], [0.55, 1], { extrapolateRight: "clamp" });
  return <div style={{ transform: `scale(${sc})`, transformOrigin: "left bottom", opacity: o, ...style }}>{children}</div>;
};

/* chữ trượt lên từng chữ, mỗi chữ cách nhau 2 frame */
const Words: React.FC<{ at?: number; text: string; style?: React.CSSProperties; gap?: number }> = ({ at = 0, text, style, gap = 2 }) => {
  const f = useCurrentFrame();
  const ws = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.28em", ...style }}>
      {ws.map((w, i) => {
        const t = at === 0 ? 99 : f - at - i * gap;
        const y = interpolate(t, [0, 5], [36, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
        const o = interpolate(t, [0, 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <span key={i} style={{ display: "inline-block", transform: `translateY(${y}px)`, opacity: o }}>{w}</span>;
      })}
    </div>
  );
};

/* gạch ngang tự vẽ (lật giá trị → giá thuê) */
const Strike: React.FC<{ at: number; color?: string }> = ({ at, color = CHAMP }) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [at, at + 6], [0, 104], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  return <div style={{ position: "absolute", left: "-2%", top: "54%", height: 10, width: `${w}%`, background: color, borderRadius: 999, transform: "rotate(-4deg)" }} />;
};

const Wordmark: React.FC<{ color?: string; size?: number; seg?: boolean }> = ({ color = IVORY, size = 30, seg = true }) => {
  /* logo ghép tên theo bộ nhận diện 30/10/2026: CHÉRIE (Bodoni Moda 600, giãn 0.32em) · gạch vàng đồng · THUÊ ĐẦM (Be Vietnam Pro 600, giãn 0.18em).
     Nền sáng: CHÉRIE màu mực, tên mảng màu vang, gạch #8C6B3A. Nền tối hoặc ảnh: bản 1 màu, gạch #D2B27F. Cỡ từ 48 dùng bản dọc (khung kết). */
  const sang = color === NOIR;
  const doc = size >= 48;
  const segEl = <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: Math.max(14, Math.round(size * (doc ? 0.4 : 0.48))), letterSpacing: "0.18em", paddingLeft: "0.18em", color: sang ? RUBY : color }}>THUÊ ĐẦM</div>;
  const gach = <div style={doc ? { width: size * 1.6, height: 2, background: sang ? GOLD : GOLD_ON_DARK } : { width: 2, height: size * 0.72, background: sang ? GOLD : GOLD_ON_DARK }} />;
  return <div style={{ display: "flex", flexDirection: doc ? "column" : "row", alignItems: "center", gap: doc ? size * 0.24 : size * 0.45 }}>
    <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1, letterSpacing: "0.32em", paddingLeft: doc ? "0.32em" : 0, color }}>CHÉRIE</div>
    {seg ? gach : null}{seg ? segEl : null}
  </div>;
};

/* thẻ tên + giá: viên thuốc Ivory, chữ Noir, viền champagne mảnh */
const Tag: React.FC<{ d: Dress2; at?: number; dark?: boolean; big?: boolean }> = ({ d, at = 0, dark = false, big = false }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const t = f - at;
  const dap = CUR.theVao === "dap";
  const x = dap ? 0 : interpolate(t, [0, 6], [-60, 0], { extrapolateRight: "clamp", easing: ease });
  const o = dap ? 1 : interpolate(t, [0, 3], [0, 1], { extrapolateRight: "clamp" });
  const sc = dap ? interpolate(t, [0, 5], [1.12, 1], { extrapolateRight: "clamp", easing: ease }) : 1;
  const kv = KV();
  const fg = dark || kv ? NOIR : IVORY;
  const bong = dark || kv ? "none" : "0 2px 24px rgba(0,0,0,0.35)";
  const gon = CUR.theKieu === "gon" && !big;
  const dong = d.loai ? <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: "0.12em", textTransform: "uppercase", color: kv ? NOIR : CHAMP, textShadow: kv ? "none" : "0 1px 10px rgba(0,0,0,0.75)" }}>{d.loai}{d.size ? ` · Size ${d.size}` : ""}</div> : null;
  const vien = (
    <div style={{ display: "inline-flex", alignItems: "baseline", gap: 14, background: IVORY, color: kv ? RUBY : NOIR, borderRadius: 999, padding: gon ? "10px 28px" : "14px 34px", border: `1.5px solid ${CHAMP}` }}>
      <span style={{ fontFamily: SERIF, fontSize: gon ? 54 : 64, lineHeight: 1 }}>{d.gia}</span>
      <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, color: NOIR }}>/ lượt 24 giờ</span>
    </div>
  );
  return (
    <div style={{ transform: `translateX(${x}px) scale(${sc})`, transformOrigin: "left bottom", opacity: o }}>
      <Khoi>
        {gon ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
            {dong}
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ fontFamily: SERIF, fontSize: 64, lineHeight: 1, color: fg, textShadow: bong }}>{d.ten}</div>
              {dap ? vien : <Slam at={4} from={1.25}>{vien}</Slam>}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
            {dong}
            <div style={{ fontFamily: SERIF, fontSize: 92, lineHeight: 1, color: fg, textShadow: bong }}>{d.ten}</div>
            {big ? (
              <Slam at={dap ? 0 : 5} from={1.5}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                  <span style={{ fontFamily: SERIF, fontSize: 190, lineHeight: 0.95, color: GIA(), textShadow: kv ? "none" : "0 2px 24px rgba(0,0,0,0.45)" }}>{d.gia}</span>
                  <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 32, color: fg }}>/ lượt 24 giờ</span>
                </div>
              </Slam>
            ) : dap ? vien : <Slam at={4} from={1.25}>{vien}</Slam>}
          </div>
        )}
      </Khoi>
    </div>
  );
};

/* lề an toàn TikTok/Reels: trên 220, dưới 400, phải 180 */
const Safe: React.FC<{ children: React.ReactNode; place?: "top" | "bottom" | "center"; style?: React.CSSProperties }> = ({ children, place = "bottom", style }) => (
  <div style={{ position: "absolute", left: 80, right: 180, ...(place === "top" ? { top: 340 } : place === "bottom" ? { bottom: 420 } : { top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }), ...style }}>{children}</div>
);

const Corner: React.FC<{ nguon?: string }> = ({ nguon }) => (
  <div style={{ position: "absolute", top: 250, left: 80, display: "flex", flexDirection: "column", gap: 8 }}>
    <Wordmark size={26} />
    {CUR.nhan ? <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: "0.14em", color: KV() ? NOIR : CHAMP, ...(KV() ? { background: NUDE, borderRadius: 999, padding: "6px 18px", alignSelf: "flex-start" } : { textShadow: "0 1px 10px rgba(0,0,0,0.75)" }) }}>{CUR.nhan}</div> : null}
    {nguon ? <div style={{ fontFamily: SANS, fontSize: 22, color: IVORY, opacity: 0.8 }}>{nguon}</div> : null}
  </div>
);

/* ---------- cảnh ---------- */
type Seg = { dur: number; el: React.ReactNode };

const shot = (d: Dress2, i: number) => d.shots[i % d.shots.length];

/* dải cắt nhanh của một chiếc: n cú cắt, thẻ tên đập vào ở cú thứ nhất, giữ thẻ thêm hold frame */
const montage = (d: Dress2, startShot: number, cuts: number, hold: number, nguon?: string): Seg => {
  /* nhip: độ dài riêng từng cú cắt; không có thì công thức cũ (cắt 8 frame, cú cuối giữ thêm hold) */
  const lens = d.nhip && d.nhip.length >= 2 ? d.nhip.map((x) => Math.max(4, Math.round(x))) : Array.from({ length: cuts }, (_, k) => (k === cuts - 1 ? CUT + hold : CUT));
  const starts = lens.map((_, k) => lens.slice(0, k).reduce((a, b) => a + b, 0));
  const dur = lens.reduce((a, b) => a + b, 0);
  const tren = (d.theViTri ?? CUR.theViTri) === "tren";
  const topY = CUR.nhan ? 420 : 370;
  const cauAt = Math.min(dur - 12, (starts[1] ?? CUT) + 2);
  return {
    dur,
    el: (
      <AbsoluteFill>
        {lens.map((len, k) => (
          <Sequence key={k} from={starts[k]} durationInFrames={len}>
            <Photo s={shot(d, startShot + k)} dur={len} mode={k === lens.length - 1 && len > 16 ? "reveal" : k % 2 ? "drift" : "push"} dir={k % 2 ? 1 : -1} />
          </Sequence>
        ))}
        <Shade side={tren ? "top" : "bottom"} />
        <Flash len={3} />
        <Corner nguon={nguon} />
        <Safe place={tren ? "top" : "bottom"} style={tren ? { top: topY } : undefined}><Tag d={d} at={CUR.theVao === "dap" ? 0 : 2} /></Safe>
        {d.cau ? (
          tren ? (
            <Safe place="bottom"><Slam at={cauAt} from={1.2}><Khoi><div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 58, lineHeight: 1.15, color: FG(), textShadow: KV() ? "none" : "0 2px 18px rgba(0,0,0,0.55)" }}>{d.cau}</div></Khoi></Slam></Safe>
          ) : (
            <Safe place={d.cauViTri === "duoi" ? "bottom" : "top"} style={d.cauViTri === "duoi" ? { bottom: (CUR.theKieu === "gon" ? 620 : 700) + (KV() ? 70 : 0) } : { top: CUR.nhan ? 420 : 360 }}>
              <Slam at={cauAt} from={1.2}><Khoi><div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 58, lineHeight: 1.15, color: FG(), textShadow: KV() ? "none" : "0 2px 18px rgba(0,0,0,0.55)" }}>{d.cau}</div></Khoi></Slam>
            </Safe>
          )
        ) : null}
      </AbsoluteFill>
    ),
  };
};

const serviceSeg = (p: Reel2Props): Seg | null => {
  if (!p.dichVu) return null;
  const bg = shot(p.dresses[p.dresses.length - 1], 0);
  const dur = 3 * 10 + 8;
  return {
    dur,
    el: (
      <AbsoluteFill>
        <Photo s={bg} dur={dur} mode="pull" />
        {p.dichVuKieu === "the" ? null : <AbsoluteFill style={{ backgroundColor: "rgba(20,20,20,0.5)" }} />}
        {p.dichVuKieu === "the" ? (
          <div style={{ position: "absolute", left: 72, right: 180, bottom: 440, background: IVORY, borderRadius: 40, padding: "36px 40px", display: "flex", flexDirection: "column", gap: 14 }}>
            {p.dichVu.map((line, k) => (
              <Slam key={k} at={k * 10} from={1.15}>
                <div style={{ fontFamily: k === 0 ? SERIF : SANS, fontStyle: k === 0 ? "italic" : "normal", fontWeight: k === 2 ? 600 : 500, fontSize: k === 0 ? 64 : 42, lineHeight: 1.15, color: NOIR, ...(k === 2 ? { display: "inline-block", background: NUDE, borderRadius: 999, padding: "10px 26px" } : {}) }}>{line}</div>
              </Slam>
            ))}
          </div>
        ) : <Safe place="center" style={{ right: 80 }}>
          {p.dichVu.map((line, k) => (
            <Slam key={k} at={k * 10} from={1.2} style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: k === 0 ? SERIF : SANS, fontStyle: k === 0 ? "italic" : "normal", fontWeight: k === 0 ? 400 : k === 2 ? 600 : 500, fontSize: k === 0 ? 92 : 60, lineHeight: 1.12, color: IVORY, ...(k === 2 ? { display: "inline-block", background: NUDE, color: NOIR, borderRadius: 999, padding: "14px 34px", marginTop: 8 } : {}) }}>{line}</div>
            </Slam>
          ))}
        </Safe>}
      </AbsoluteFill>
    ),
  };
};

const EndCard: React.FC<{ p: Reel2Props; dur: number }> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (p.ket === "chu") {
    const kv = p.mau === "kv";
    const fg = kv ? NOIR : IVORY;
    return (
    <AbsoluteFill style={{ backgroundColor: kv ? IVORY : NOIR, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30, padding: "0 90px" }}>
      {kv ? <div style={{ position: "absolute", left: 70, right: 70, top: 560, bottom: 560, borderRadius: 40, background: NUDE, transform: `scale(${interpolate(f, [0, 8], [1.06, 1], { extrapolateRight: "clamp", easing: ease })})` }} /> : null}
      {p.nguon ? <div style={{ position: "absolute", top: 226, left: 80, fontFamily: SANS, fontSize: 22, color: fg, opacity: 0.6 }}>{p.nguon}</div> : null}
      <Slam at={0}><Wordmark color={fg} size={56} /></Slam>
      <Slam at={0}><div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 70, color: fg, textAlign: "center" }}>Mỗi lần, một chiếc mới.</div></Slam>
      <Slam at={3} from={1.2}><div style={{ background: kv ? RUBY : IVORY, color: kv ? "#FFFFFF" : NOIR, borderRadius: 999, padding: "26px 52px", fontFamily: SANS, fontWeight: 600, fontSize: 44 }}>{p.cta}</div></Slam>
      {p.ctaSub ? <Words at={6} text={p.ctaSub} style={{ fontFamily: SANS, fontSize: 36, color: fg, justifyContent: "center" }} /> : null}
      <AcuteRain f={f} />
    </AbsoluteFill>
    );
  }
  const mot = p.ket ? p.ket === "mot" : p.format === "can-canh";
  const n = mot ? 1 : Math.min(p.dresses.length, 3);
  return (
    <AbsoluteFill style={{ backgroundColor: IVORY }}>
      {p.nguon ? <div style={{ position: "absolute", top: 226, left: 80, fontFamily: SANS, fontSize: 22, color: NOIR, opacity: 0.6 }}>{p.nguon}</div> : null}
      <div style={{ position: "absolute", top: 260, left: 70, right: 70, display: "flex", gap: 20, justifyContent: "center" }}>
        {p.dresses.slice(0, n).map((d, k) => {
          const sp = spring({ frame: f + 12 - k * 2, fps, config: { damping: 15, stiffness: 180 } });
          return (
            <div key={k} style={{ width: mot ? 760 : n === 3 ? 300 : 440, height: 700, borderRadius: 40, overflow: "hidden", transform: `translateY(${(1 - sp) * 220}px)`, opacity: sp, position: "relative" }}>
              <Img src={staticFile(shot(d, 0).src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: shot(d, 0).pos ?? "50% 30%" }} />
              <div style={{ position: "absolute", left: 14, bottom: 14, background: IVORY, color: NOIR, borderRadius: 999, padding: "10px 22px", fontFamily: SERIF, fontSize: mot ? 64 : 44 }}>{p.format === "chon-1" ? `${k + 1} · ${d.gia}` : d.gia}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1030, left: 80, right: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <Slam at={0}><Wordmark color={NOIR} size={52} /></Slam>
        <Slam at={0}><div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 72, color: NOIR }}>Mỗi lần, một chiếc mới.</div></Slam>
        <Slam at={3} from={1.2}>
          <div style={{ background: NOIR, color: IVORY, borderRadius: 999, padding: "28px 56px", fontFamily: SANS, fontWeight: 600, fontSize: 46 }}>{p.cta}</div>
        </Slam>
        {p.ctaSub ? <Words at={6} text={p.ctaSub} style={{ fontFamily: SANS, fontSize: 36, color: NOIR, justifyContent: "center" }} /> : null}
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: "#7A5F3A", marginTop: 6 }}>cherie.io.vn</div>
      </div>
      {/* dấu sắc champagne rơi vào chữ É: chữ ký kết video */}
      <AcuteRain f={f} />
    </AbsoluteFill>
  );
};

const AcuteRain: React.FC<{ f: number }> = ({ f }) => (
  <>
    {[[120, 140], [960, 260], [200, 1600], [900, 1500], [560, 1700]].map(([x, y], k) => {
      const o = interpolate(f, [4 + k * 2, 10 + k * 2], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return <div key={k} style={{ position: "absolute", left: x, top: y, width: 8, height: 40, background: CHAMP, borderRadius: 999, transform: "rotate(30deg)", opacity: o }} />;
    })}
  </>
);

/* ---------- ba định dạng ---------- */
const latGia = (p: Reel2Props): Seg[] => {
  const d0 = p.dresses[0];
  const segs: Seg[] = [];
  // 0–1,5s: khung đầu đã có hình đẩy vào + chữ. Phách 2 gạch giá trị, chớp flash.
  segs.push({
    dur: 2 * B + 6,
    el: (
      <AbsoluteFill>
        <Photo s={shot(d0, 0)} dur={2 * B + 6} mode="push" />
        <Shade side={p.chuHook === "tren" ? "top" : "bottom"} h={70} o={0.8} />
        <Corner nguon={p.nguon} />
        <Safe place={p.chuHook === "tren" ? "top" : "bottom"}>
          <Khoi>
            <Words at={0} gap={1} text={p.hookTop} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 72, color: FG(), marginBottom: 6 }} />
            <div style={{ position: "relative", display: "inline-block" }}>
              <Slam at={0}><div style={{ fontFamily: SERIF, fontSize: fit(p.hookBig, 210), lineHeight: 1, whiteSpace: "nowrap", color: KV() ? RUBY : IVORY }}>{p.hookBig}</div></Slam>
              {p.gach === false ? null : <Strike at={2 * B - 4} />}
            </div>
          </Khoi>
        </Safe>
      </AbsoluteFill>
    ),
  });
  // 1,2–2,7s: cắt sang cận, giá thuê đập vào
  segs.push({
    dur: 3 * B,
    el: (
      <AbsoluteFill>
        <Photo s={shot(d0, 1)} dur={3 * B} mode="push" />
        <Shade side={p.chuHook === "tren" ? "top" : "bottom"} h={70} o={0.8} />
        <Flash len={4} />
        <Corner nguon={p.nguon} />
        <Safe place={p.chuHook === "tren" ? "top" : "bottom"}>
          <Khoi>
            <Words at={1} gap={2} text={p.hookSub ?? "Nàng mặc 24 giờ"} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 72, color: FG(), marginBottom: 6 }} />
            <Slam at={7}><div style={{ fontFamily: SERIF, fontSize: fit(d0.gia, 230), lineHeight: 1, whiteSpace: "nowrap", color: GIA() }}>{d0.gia}</div></Slam>
          </Khoi>
        </Safe>
      </AbsoluteFill>
    ),
  });
  segs.push(montage(d0, 2, d0.soCat ?? Math.max(2, Math.min(4, d0.shots.length - 1)), 12, p.nguon));
  p.dresses.slice(1, 3).forEach((d) => segs.push(montage(d, 0, d.soCat ?? Math.min(3, d.shots.length), 14, p.nguon)));
  return segs;
};

const Panels: React.FC<{ p: Reel2Props; showPrice?: boolean }> = ({ p, showPrice }) => {
  const f = useCurrentFrame();
  const n = Math.min(3, p.dresses.length);
  return (
    <AbsoluteFill style={{ backgroundColor: KV() ? IVORY : NOIR }}>
     <div style={{ position: "absolute", left: 0, right: 0, top: p.chonNen ?? 0, bottom: 0, display: "flex", flexDirection: "row", gap: 6 }}>
      {p.dresses.slice(0, n).map((d, k) => {
        const y = interpolate(f - k * 2, [0, 7], [k === 0 ? 0 : 160, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
        return (
          <div key={k} style={{ flex: 1, position: "relative", overflow: "hidden", borderRadius: (p.chonNen ?? 0) > 0 ? 40 : 0, transform: `translateY(${y}px)` }}>
            <Img src={staticFile(shot(d, 0).src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: shot(d, 0).pos ?? "50% 30%", transform: `scale(${(shot(d, 0).scale ?? 1) * interpolate(f, [0, 40], [1.0, 1.08], { extrapolateRight: "clamp" })})` }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "45%", background: "linear-gradient(to top, rgba(20,20,20,0.85), rgba(20,20,20,0))" }} />
          </div>
        );
      })}
     </div>
      <div style={{ position: "absolute", left: 60, right: 180, bottom: 420, display: "flex" }}>
        {p.dresses.slice(0, n).map((d, k) => (
          <div key={k} style={{ flex: 1, textAlign: "center" }}>
            <Slam at={p.soNgay ? 0 : 4 + k * 3} from={1.5} style={{ transformOrigin: "center" }}><div style={{ fontFamily: SERIF, fontSize: 140, lineHeight: 1, color: IVORY }}>{k + 1}</div></Slam>
            {showPrice ? <Slam at={8 + k * 4} style={{ transformOrigin: "center" }}><div style={{ display: "inline-block", background: IVORY, color: NOIR, borderRadius: 999, padding: "6px 18px", fontFamily: SERIF, fontSize: 40, marginTop: 8 }}>{d.gia}</div></Slam> : null}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const chon1 = (p: Reel2Props): Seg[] => {
  const segs: Seg[] = [];
  segs.push({
    dur: 2 * B + 8,
    el: (
      <AbsoluteFill>
        <Panels p={p} />
        {(p.chonNen ?? 0) > 0 ? null : <Shade side="top" h={40} o={0.85} />}
        <Safe place="top" style={{ top: (p.chonNen ?? 0) > 0 ? 300 : 260 }}>
          <Slam at={0}><div style={{ fontFamily: SERIF, fontSize: 100, lineHeight: 1.02, whiteSpace: "nowrap", color: FG() }}>{p.hookBig}</div></Slam>
          <Words at={0} text={p.hookTop} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 48, color: FG(), marginTop: 16 }} />
        </Safe>
      </AbsoluteFill>
    ),
  });
  p.dresses.slice(0, 3).forEach((d, k) => {
    const m = montage(d, 0, d.soCat ?? Math.min(3, d.shots.length), 16, p.nguon);
    segs.push({
      dur: m.dur,
      el: (
        <AbsoluteFill>
          {m.el}
          <div style={{ position: "absolute", top: 240, right: 190, width: 120, height: 120, borderRadius: 999, background: IVORY, color: NOIR, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 72 }}>{k + 1}</div>
        </AbsoluteFill>
      ),
    });
  });
  segs.push({
    dur: 2 * B,
    el: (
      <AbsoluteFill>
        <Panels p={p} showPrice />
        {(p.chonNen ?? 0) > 0 ? null : <Shade side="top" h={38} o={0.85} />}
        <Safe place="top" style={{ top: (p.chonNen ?? 0) > 0 ? 300 : 260 }}>
          <Slam at={2}><div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 96, lineHeight: 1.05, color: FG() }}>{p.hookSub ?? "Nàng chọn số mấy?"}</div></Slam>
        </Safe>
      </AbsoluteFill>
    ),
  });
  return segs;
};

const canCanh = (p: Reel2Props): Seg[] => {
  const d0 = p.dresses[0];
  const segs: Seg[] = [];
  const macroDur = (p.doan || []).length ? [18, 14, 10, 8, 7, 6] : [12, 9, 7, 6];
  const total = macroDur.reduce((a, b) => a + b, 0);
  segs.push({
    dur: total,
    el: (
      <AbsoluteFill>
        {macroDur.map((dd, k) => {
          const from = macroDur.slice(0, k).reduce((a, b) => a + b, 0);
          const s = shot(d0, 1 + (k % Math.max(1, d0.shots.length - 1)));
          return (
            <Sequence key={k} from={from} durationInFrames={dd}>
              <Photo s={{ ...s, scale: (s.scale ?? 1) * (2.1 - k * 0.2) }} dur={dd} mode="macro" dir={k % 2 ? 1 : -1} />
            </Sequence>
          );
        })}
        <Shade side={p.chuHook === "tren" ? "top" : "bottom"} h={65} o={0.78} />
        <Corner nguon={p.nguon} />
        <Safe place={p.chuHook === "tren" ? "top" : "bottom"}>
         <Khoi>
          {p.hookLon === "top" ? (
            <>
              <Slam at={0}><div style={{ fontFamily: SERIF, fontSize: fit(p.hookTop, 150), lineHeight: 1.02, color: KV() ? RUBY : IVORY }}>{p.hookTop}</div></Slam>
              <Words at={0} gap={1} text={p.hookBig} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 72, color: FG(), marginTop: 10 }} />
            </>
          ) : (
            <>
              <Words at={0} gap={1} text={p.hookTop} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 72, color: FG(), marginBottom: 6 }} />
              <Slam at={0}><div style={{ fontFamily: SERIF, fontSize: 150, lineHeight: 1.02, color: FG() }}>{p.hookBig}</div></Slam>
            </>
          )}
          {(p.doan || []).length ? (
            <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
              {(p.doan || []).map((x, k) => (
                <Slam key={k} at={12 + k * 5} from={1.3}><div style={{ background: IVORY, color: NOIR, borderRadius: 999, padding: "10px 26px", fontFamily: SERIF, fontSize: 54 }}>{x}</div></Slam>
              ))}
            </div>
          ) : null}
         </Khoi>
        </Safe>
      </AbsoluteFill>
    ),
  });
  /* cảnh lộ: ảnh toàn thân đẩy vào đều tới hết cảnh, cắt sang ảnh thứ hai ở giữa cảnh để không đứng yên, giá thuê chữ lớn, câu cảm giác của mẫu đầu */
  const rv = 3 * B + 6, cut2 = d0.shots.length > 2 ? 26 : rv;
  const rvTren = (d0.theViTri ?? p.theViTri) === "tren";
  segs.push({
    dur: rv,
    el: (
      <AbsoluteFill>
        <Sequence from={0} durationInFrames={cut2}><Photo s={shot(d0, 0)} dur={cut2} mode="reveal" /></Sequence>
        {cut2 < rv ? <Sequence from={cut2} durationInFrames={rv - cut2}><Photo s={shot(d0, d0.shots.length - 1)} dur={rv - cut2} mode="reveal" dir={-1} /></Sequence> : null}
        <Shade side={rvTren ? "top" : "bottom"} h={70} o={0.82} />
        <Flash len={5} />
        {cut2 < rv ? <Flash at={cut2} len={3} /> : null}
        <Corner nguon={p.nguon} />
        {d0.cau ? (
          <Safe place={rvTren ? "bottom" : "top"} style={rvTren ? undefined : { top: CUR.nhan ? 420 : 360 }}>
            <Slam at={cut2 < rv ? cut2 + 1 : 22} from={1.2}><Khoi><div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 58, lineHeight: 1.15, color: FG(), textShadow: KV() ? "none" : "0 2px 18px rgba(0,0,0,0.55)" }}>{d0.cau}</div></Khoi></Slam>
          </Safe>
        ) : null}
        <Safe place={rvTren ? "top" : "bottom"} style={rvTren ? { top: CUR.nhan ? 420 : 370 } : undefined}>
          <Tag d={d0} at={CUR.theVao === "dap" ? 0 : 2} big />
          {d0.giaTri ? <Words at={12} text={`Giá trị chiếc đầm ${d0.giaTri}.`} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 38, color: IVORY, marginTop: 18, textShadow: "0 1px 10px rgba(0,0,0,0.75)" }} /> : null}
        </Safe>
      </AbsoluteFill>
    ),
  });
  p.dresses.slice(1, 3).forEach((d) => segs.push(montage(d, 0, d.soCat ?? Math.min(3, d.shots.length), 14, p.nguon)));
  return segs;
};

const END = 2 * B + 15;

export const buildSegs = (p: Reel2Props): Seg[] => {
  CUR = p;
  const body = p.format === "chon-1" ? chon1(p) : p.format === "can-canh" ? canCanh(p) : latGia(p);
  const sv = serviceSeg(p);
  return [...body, ...(sv ? [sv] : [])];
};
export const duration2 = (p: Reel2Props) => buildSegs(p).reduce((a, s) => a + s.dur, 0) + END;

export const Reel2: React.FC<Reel2Props> = (p) => {
  const segs = buildSegs(p);
  let t = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: NOIR }}>
      {segs.map((s, k) => {
        const from = t;
        t += s.dur;
        return <Sequence key={k} from={from} durationInFrames={s.dur}>{s.el}</Sequence>;
      })}
      <Sequence from={t} durationInFrames={END}><EndCard p={p} dur={END} /></Sequence>
    </AbsoluteFill>
  );
};

export const reel2Defaults: Reel2Props = {
  format: "lat-gia",
  dresses: [],
  hookTop: "Chiếc đầm này",
  hookBig: "10.000.000đ",
  hookSub: "Nàng mặc 24 giờ",
  cta: "Theo dõi để xem chiếc tiếp theo",
  ctaSub: "Mở cửa 12.12 tại Đà Nẵng.",
  nguon: "Ảnh lookbook: SIXDO",
};
