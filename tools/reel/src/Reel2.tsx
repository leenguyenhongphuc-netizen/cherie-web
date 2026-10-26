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
    document.fonts.load('400 40px "Playfair Display"', "Chiếc đầm"),
    document.fonts.load('500 40px "Playfair Display"', "CHÉRIE"),
    document.fonts.load('italic 400 40px "Playfair Display"', "Nàng mặc"),
    document.fonts.load('400 40px "Be Vietnam Pro"', "Thuê lượt"),
    document.fonts.load('500 40px "Be Vietnam Pro"', "Khai trương"),
    document.fonts.load('600 40px "Be Vietnam Pro"', "Theo dõi"),
  ]).then(() => continueRender(h), () => continueRender(h));
}

const SERIF = '"Playfair Display", Georgia, serif';
const SANS = '"Be Vietnam Pro", system-ui, sans-serif';
const IVORY = "#F6F1EA";
const NOIR = "#141414";
const CHAMP = "#C8A97E";
const NUDE = "#E8C7C3";

export type Shot = { src: string; pos?: string; scale?: number };
export type Dress2 = { ten: string; loai?: string; size?: string; gia: string; giaTri?: string; cau?: string; shots: Shot[] }; // cau: 1 câu cảm giác ngắn, đập vào giữa dải cắt
export type Reel2Props = {
  format: "lat-gia" | "chon-1" | "can-canh";
  dresses: Dress2[];
  hookTop: string; // dòng nhỏ khung đầu, ví dụ "Chiếc đầm này"
  hookBig: string; // chữ lớn khung đầu, ví dụ "10 triệu"
  hookSub?: string; // dòng sau cú lật, ví dụ "Nàng mặc 24 giờ"
  chuHook?: "tren" | "duoi"; // đặt chữ hook ở nền phía trên (vai, phông) hay phía dưới; chọn chỗ không đè mặt và chi tiết đầm
  doan?: string[]; // can-canh: 2–3 đáp án để nàng đoán, ví dụ ["500k?", "950k?", "3 triệu?"]
  dichVu?: [string, string, string]; // 3 nhịp chữ dịch vụ, bỏ trống thì không có cảnh này
  cta: string;
  ctaSub?: string;
  nguon?: string;
};

/* ---------- nhịp ---------- */
const B = 15; // 1 phách
const CUT = 8; // cắt nhanh

/* ---------- mảnh ghép ---------- */
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const Photo: React.FC<{ s: Shot; dur: number; mode?: "push" | "drift" | "macro" | "pull"; dir?: 1 | -1 }> = ({ s, dur, mode = "push", dir = 1 }) => {
  const f = useCurrentFrame();
  const base = s.scale ?? 1;
  let sc = base, tx = 0;
  if (mode === "push") sc = base * interpolate(f, [0, 7, dur], [1.16, 1.03, 1.0], { extrapolateRight: "clamp", easing: ease });
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
  const o = interpolate(f, [at, at + len], [0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return o > 0 ? <AbsoluteFill style={{ backgroundColor: color, opacity: o }} /> : null;
};

/* lớp tối dưới chân hoặc trên đầu để chữ đọc được — đen sâu, không xám */
const Shade: React.FC<{ side?: "top" | "bottom"; h?: number; o?: number }> = ({ side = "bottom", h = 60, o = 0.72 }) => (
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

const Wordmark: React.FC<{ color?: string; size?: number }> = ({ color = IVORY, size = 30 }) => (
  <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: size, letterSpacing: "0.42em", paddingLeft: "0.42em", color }}>CHÉRIE</div>
);

/* thẻ tên + giá: viên thuốc Ivory, chữ Noir, viền champagne mảnh */
const Tag: React.FC<{ d: Dress2; at?: number; dark?: boolean }> = ({ d, at = 0, dark = false }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const t = f - at;
  const x = interpolate(t, [0, 6], [-60, 0], { extrapolateRight: "clamp", easing: ease });
  const o = interpolate(t, [0, 3], [0, 1], { extrapolateRight: "clamp" });
  const fg = dark ? NOIR : IVORY;
  return (
    <div style={{ transform: `translateX(${x}px)`, opacity: o, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
      {d.loai ? <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: "0.14em", textTransform: "uppercase", color: CHAMP }}>{d.loai}{d.size ? ` · Size ${d.size}` : ""}</div> : null}
      <div style={{ fontFamily: SERIF, fontSize: 92, lineHeight: 1, color: fg, textShadow: dark ? "none" : "0 2px 24px rgba(0,0,0,0.35)" }}>{d.ten}</div>
      <Slam at={4} from={1.25}>
        <div style={{ display: "inline-flex", alignItems: "baseline", gap: 14, background: IVORY, color: NOIR, borderRadius: 999, padding: "14px 34px", border: `1.5px solid ${CHAMP}` }}>
          <span style={{ fontFamily: SERIF, fontSize: 64, lineHeight: 1 }}>{d.gia}</span>
          <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28 }}>/ lượt 24 giờ</span>
        </div>
      </Slam>
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
    {nguon ? <div style={{ fontFamily: SANS, fontSize: 22, color: IVORY, opacity: 0.8 }}>{nguon}</div> : null}
  </div>
);

/* ---------- cảnh ---------- */
type Seg = { dur: number; el: React.ReactNode };

const shot = (d: Dress2, i: number) => d.shots[i % d.shots.length];

/* dải cắt nhanh của một chiếc: n cú cắt, thẻ tên đập vào ở cú thứ nhất, giữ thẻ thêm hold frame */
const montage = (d: Dress2, startShot: number, cuts: number, hold: number, nguon?: string): Seg => {
  const dur = cuts * CUT + hold;
  return {
    dur,
    el: (
      <AbsoluteFill>
        {Array.from({ length: cuts }).map((_, k) => (
          <Sequence key={k} from={k * CUT} durationInFrames={k === cuts - 1 ? CUT + hold : CUT}>
            <Photo s={shot(d, startShot + k)} dur={k === cuts - 1 ? CUT + hold : CUT} mode={k % 2 ? "drift" : "push"} dir={k % 2 ? 1 : -1} />
          </Sequence>
        ))}
        <Shade />
        <Flash len={3} />
        <Corner nguon={nguon} />
        <Safe><Tag d={d} at={2} /></Safe>
        {d.cau ? (
          <Safe place="top" style={{ top: 360 }}>
            <Slam at={Math.min(dur - 12, CUT + 2)} from={1.2}><div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 58, lineHeight: 1.15, color: IVORY, textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}>{d.cau}</div></Slam>
          </Safe>
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
        <AbsoluteFill style={{ backgroundColor: "rgba(20,20,20,0.62)" }} />
        <Safe place="center" style={{ right: 80 }}>
          {p.dichVu.map((line, k) => (
            <Slam key={k} at={k * 10} from={1.2} style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: k === 0 ? SERIF : SANS, fontStyle: k === 0 ? "italic" : "normal", fontWeight: k === 0 ? 400 : k === 2 ? 600 : 500, fontSize: k === 0 ? 92 : 60, lineHeight: 1.12, color: IVORY, ...(k === 2 ? { display: "inline-block", border: `1.5px solid ${CHAMP}`, borderRadius: 999, padding: "12px 30px", marginTop: 8 } : {}) }}>{line}</div>
            </Slam>
          ))}
        </Safe>
      </AbsoluteFill>
    ),
  };
};

const EndCard: React.FC<{ p: Reel2Props; dur: number }> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.min(p.dresses.length, 3);
  return (
    <AbsoluteFill style={{ backgroundColor: IVORY }}>
      <div style={{ position: "absolute", top: 260, left: 70, right: 70, display: "flex", gap: 20, justifyContent: "center" }}>
        {p.dresses.slice(0, n).map((d, k) => {
          const sp = spring({ frame: f + 12 - k * 2, fps, config: { damping: 15, stiffness: 180 } });
          return (
            <div key={k} style={{ width: n === 3 ? 300 : 440, height: 700, borderRadius: 40, overflow: "hidden", transform: `translateY(${(1 - sp) * 220}px)`, opacity: sp, position: "relative" }}>
              <Img src={staticFile(shot(d, 0).src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: shot(d, 0).pos ?? "50% 30%" }} />
              <div style={{ position: "absolute", left: 14, bottom: 14, background: IVORY, color: NOIR, borderRadius: 999, padding: "10px 22px", fontFamily: SERIF, fontSize: 44 }}>{p.format === "chon-1" ? `${k + 1} · ${d.gia}` : d.gia}</div>
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
        {p.nguon ? <div style={{ fontFamily: SANS, fontSize: 22, color: NOIR, opacity: 0.6 }}>{p.nguon}</div> : null}
      </div>
      {/* dấu sắc champagne rơi vào chữ É: chữ ký kết video */}
      <AcuteRain f={f} />
      {f > dur - 4 ? <AbsoluteFill style={{ backgroundColor: NOIR, opacity: interpolate(f, [dur - 4, dur], [0, 1]) }} /> : null}
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
          <Words at={0} gap={1} text={p.hookTop} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 72, color: IVORY, marginBottom: 6 }} />
          <div style={{ position: "relative", display: "inline-block" }}>
            <Slam at={0}><div style={{ fontFamily: SERIF, fontSize: 210, lineHeight: 1, color: IVORY }}>{p.hookBig}</div></Slam>
            <Strike at={2 * B - 4} />
          </div>
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
          <Words at={1} gap={2} text={p.hookSub ?? "Nàng mặc 24 giờ"} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 72, color: IVORY, marginBottom: 6 }} />
          <Slam at={7}><div style={{ fontFamily: SERIF, fontSize: 230, lineHeight: 1, color: CHAMP }}>{d0.gia}</div></Slam>
        </Safe>
      </AbsoluteFill>
    ),
  });
  segs.push(montage(d0, 2, Math.max(2, Math.min(4, d0.shots.length - 1)), 12, p.nguon));
  p.dresses.slice(1, 3).forEach((d) => segs.push(montage(d, 0, Math.min(3, d.shots.length), 14, p.nguon)));
  return segs;
};

const Panels: React.FC<{ p: Reel2Props; showPrice?: boolean }> = ({ p, showPrice }) => {
  const f = useCurrentFrame();
  const n = Math.min(3, p.dresses.length);
  return (
    <AbsoluteFill style={{ backgroundColor: NOIR, flexDirection: "row", gap: 6 }}>
      {p.dresses.slice(0, n).map((d, k) => {
        const y = interpolate(f - k * 2, [0, 7], [k === 0 ? 0 : 160, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
        return (
          <div key={k} style={{ flex: 1, position: "relative", overflow: "hidden", transform: `translateY(${y}px)` }}>
            <Img src={staticFile(shot(d, 0).src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: shot(d, 0).pos ?? "50% 30%", transform: `scale(${(shot(d, 0).scale ?? 1) * interpolate(f, [0, 40], [1.0, 1.08], { extrapolateRight: "clamp" })})` }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "45%", background: "linear-gradient(to top, rgba(20,20,20,0.85), rgba(20,20,20,0))" }} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 60, right: 180, bottom: 420, display: "flex" }}>
        {p.dresses.slice(0, n).map((d, k) => (
          <div key={k} style={{ flex: 1, textAlign: "center" }}>
            <Slam at={4 + k * 3} from={1.5} style={{ transformOrigin: "center" }}><div style={{ fontFamily: SERIF, fontSize: 140, lineHeight: 1, color: IVORY }}>{k + 1}</div></Slam>
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
        <Shade side="top" h={40} o={0.85} />
        <Safe place="top" style={{ top: 260 }}>
          <Slam at={0}><div style={{ fontFamily: SERIF, fontSize: 100, lineHeight: 1.02, whiteSpace: "nowrap", color: IVORY }}>{p.hookBig}</div></Slam>
          <Words at={0} text={p.hookTop} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 48, color: IVORY, marginTop: 16 }} />
        </Safe>
      </AbsoluteFill>
    ),
  });
  p.dresses.slice(0, 3).forEach((d, k) => {
    const m = montage(d, 0, Math.min(3, d.shots.length), 16, p.nguon);
    segs.push({
      dur: m.dur,
      el: (
        <AbsoluteFill>
          {m.el}
          <div style={{ position: "absolute", top: 150, right: 190, width: 120, height: 120, borderRadius: 999, background: IVORY, color: NOIR, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 72 }}>{k + 1}</div>
        </AbsoluteFill>
      ),
    });
  });
  segs.push({
    dur: 2 * B,
    el: (
      <AbsoluteFill>
        <Panels p={p} showPrice />
        <Shade side="top" h={38} o={0.85} />
        <Safe place="top" style={{ top: 260 }}>
          <Slam at={2}><div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 96, lineHeight: 1.05, color: IVORY }}>{p.hookSub ?? "Nàng chọn số mấy?"}</div></Slam>
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
          <Words at={0} gap={1} text={p.hookTop} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 72, color: IVORY, marginBottom: 6 }} />
          <Slam at={0}><div style={{ fontFamily: SERIF, fontSize: 150, lineHeight: 1.02, color: IVORY }}>{p.hookBig}</div></Slam>
          {(p.doan || []).length ? (
            <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
              {(p.doan || []).map((x, k) => (
                <Slam key={k} at={12 + k * 5} from={1.3}><div style={{ background: IVORY, color: NOIR, borderRadius: 999, padding: "10px 26px", fontFamily: SERIF, fontSize: 54 }}>{x}</div></Slam>
              ))}
            </div>
          ) : null}
        </Safe>
      </AbsoluteFill>
    ),
  });
  segs.push({
    dur: 3 * B + 6,
    el: (
      <AbsoluteFill>
        <Photo s={shot(d0, 0)} dur={3 * B + 6} mode="push" />
        <Shade />
        <Flash len={5} />
        <Corner nguon={p.nguon} />
        <Safe>
          <Tag d={d0} at={3} />
          {d0.giaTri ? <Words at={14} text={`Giá trị chiếc đầm ${d0.giaTri}.`} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 34, color: IVORY, marginTop: 22 }} /> : null}
        </Safe>
      </AbsoluteFill>
    ),
  });
  p.dresses.slice(1, 3).forEach((d) => segs.push(montage(d, 0, Math.min(3, d.shots.length), 14, p.nguon)));
  return segs;
};

const END = 2 * B + 15;

export const buildSegs = (p: Reel2Props): Seg[] => {
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
  hookBig: "10 triệu",
  hookSub: "Nàng mặc 24 giờ",
  cta: "Theo dõi để xem chiếc tiếp theo",
  ctaSub: "Mở cửa 12.12 tại Đà Nẵng.",
  nguon: "Ảnh lookbook: SIXDO",
};
