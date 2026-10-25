import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";
import { FONT_CSS } from "./fontcss";

/* ---------- phông chữ tải sẵn trên máy ---------- */
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

const CREAM = "#F6F1EA";
const INK = "#141414";
const PANEL = "rgba(14,11,9,0.58)";

/* Nhịp 120 BPM: 1 phách = 15 frame. Mọi điểm cắt rơi vào bội số 15. */
export const HOOK = 60;
export const SHOT_A = 45;
export const SHOT_B = 45;
export const DRESS = SHOT_A + SHOT_B;
export const SERVICE = 90;
export const END = 60;

export type Dress = {
  a: string; b: string; bPos: string; bScale: number; side?: "left" | "right"; labelBottom?: number;
  ten: string; dong: string; phu: string; gia: string; giaTri: string;
};

export type ReelProps = {
  dresses: Dress[];
  nhac?: boolean;
  hookImg: string; hookPos?: string;
  hook1: string; hook2: string; hookBig: string;
  serviceImg: string; serviceTitle: string; service: [string, string][];
  cta: string; ctaSub: string;
  nguon?: string;
};

export const reelDefaults: ReelProps = {
  dresses: [
    { a: "nuitA.jpg", b: "nuitB.jpg", bPos: "50% 8%", bScale: 1.18, ten: "Nuit Brocart", dong: "Đầm xoè · Gấm đen · Size M", phu: "Xoè vừa đủ cho một vòng xoay.", gia: "950k", giaTri: "10 triệu" },
    { side: "right", a: "rougeA.jpg", b: "rougeB.jpg", bPos: "50% 35%", bScale: 1.15, ten: "Rouge Fleur", dong: "Đầm midi · Taffeta đỏ · Size S", phu: "Hoa nổi 3D. Một chút đỏ là đủ.", gia: "690k", giaTri: "7 triệu" },
    { side: "right", labelBottom: 340, a: "noirA.jpg", b: "noirB.jpg", bPos: "50% 30%", bScale: 1.1, ten: "Noir Fleuri", dong: "Đầm midi · Taffeta đen · Size S", phu: "Đen sâu, hoa nổi. Không cần thêm gì.", gia: "870k", giaTri: "9 triệu" },
  ],
  hookImg: "nuitC.jpg", hookPos: "50% 30%",
  hook1: "Chiếc đầm\n10 triệu.", hook2: "Nàng mặc 24 giờ:", hookBig: "950k.",
  serviceImg: "rougeA.jpg", serviceTitle: "Tụi mình lo phần còn lại.",
  service: [["Thuê theo lượt ", "24 giờ."], ["Cọc chuyển khoản, về lại trong 24 giờ. ", "Không giữ căn cước."], ["Stylist mang đầm đến khách sạn hoặc nhà riêng, ", "từ 120k."]],
  cta: "Chiếc thứ 4 lên trong tuần này", ctaSub: "Theo dõi để không lỡ.",
  nguon: "Ảnh lookbook: SIXDO",
};

export const durationOf = (p: ReelProps) => HOOK + DRESS * p.dresses.length + SERVICE + END;
export const reelDuration = durationOf(reelDefaults);

let NGUON = "Ảnh lookbook: SIXDO";

/* ảnh trôi rất nhẹ */
const Photo: React.FC<{ src: string; dur: number; pos?: string; s0?: number; s1?: number; reveal?: boolean }> = ({
  src, dur, pos = "50% 35%", s0 = 1.0, s1 = 1.05, reveal = false,
}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [s0, s1], { extrapolateRight: "clamp" });
  const clip = reveal
    ? interpolate(f, [0, 10], [100, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
    : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%", height: "100%", objectFit: "cover", objectPosition: pos,
          transform: `scale(${s})`, clipPath: `inset(${clip}% 0 0 0)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Wordmark: React.FC<{ size?: number; color?: string }> = ({ size = 30, color = CREAM }) => (
  <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: size, letterSpacing: "0.42em", paddingLeft: "0.42em", color }}>CHÉRIE</div>
);

/* đầu khung: logo + nguồn ảnh, nằm dưới vùng 150px trên cùng */
const TopBar: React.FC<{ counter?: string; noSrc?: boolean }> = ({ counter, noSrc }) => (
  <div style={{ position: "absolute", top: 180, left: 80, right: 180, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Wordmark />
      {noSrc ? null : <div style={{ fontFamily: SANS, fontSize: 26, color: CREAM, opacity: 0.85 }}>{NGUON}</div>}
    </div>
    {counter ? <div style={{ fontFamily: SANS, fontSize: 32, color: CREAM, opacity: 0.9, letterSpacing: "0.1em" }}>{counter}</div> : null}
  </div>
);

/* cảnh 1: câu móc, chữ có ngay khung đầu */
const Hook: React.FC<{ p: ReelProps }> = ({ p }) => {
  const f = useCurrentFrame();
  const sc = interpolate(f, [0, 15], [1.14, 1.0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: INK }}>
        <Img src={staticFile(p.hookImg)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.hookPos || "50% 30%", transform: `scale(${sc})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "rgba(10,8,6,0.40)" }} />
      <TopBar />
      <div style={{ position: "absolute", top: 600, left: 80, right: 180 }}>
        <div style={{ fontFamily: SERIF, fontSize: 104, lineHeight: 1.08, color: CREAM }}>{p.hook1.split("\n").map((l, k) => <div key={k}>{l}</div>)}</div>
        {f >= 15 ? <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 84, lineHeight: 1.1, color: CREAM, marginTop: 34 }}>{p.hook2}</div> : null}
        {f >= 30 ? <div style={{ fontFamily: SERIF, fontSize: 168, lineHeight: 1.0, color: CREAM, marginTop: 6 }}>{p.hookBig}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

/* cảnh đầm: ảnh toàn thân mở từ dưới lên, rồi cắt cứng vào cận chi tiết */
const DressScene: React.FC<{ d: Dress; i: number; n: number }> = ({ d, i, n }) => {
  const f = useCurrentFrame();
  const second = f >= SHOT_A;
  const punch = second
    ? interpolate(f - SHOT_A, [0, 8], [1.0, d.bScale], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) +
      interpolate(f - SHOT_A, [8, SHOT_B], [0, 0.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  return (
    <AbsoluteFill>
      {second ? (
        <AbsoluteFill style={{ overflow: "hidden", backgroundColor: INK }}>
          <Img src={staticFile(d.b)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: d.bPos, transform: `scale(${punch})`, transformOrigin: "50% 0%" }} />
        </AbsoluteFill>
      ) : (
        <Photo src={d.a} dur={SHOT_A} reveal s0={1.0} s1={1.04} />
      )}
      <TopBar counter={`0${i + 1} / 0${n}`} noSrc={second} />
      {second ? (
        <div style={{ position: "absolute", left: 60, bottom: 300, maxWidth: 840, background: PANEL, borderRadius: 40, padding: "28px 36px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontFamily: SANS, fontSize: 32, letterSpacing: "0.14em", textTransform: "uppercase", color: CREAM, opacity: 0.9 }}>{d.dong}</div>
          <div style={{ fontFamily: SERIF, fontSize: 100, lineHeight: 1.02, color: CREAM }}>{d.ten}</div>
          <div style={{ fontFamily: SANS, fontSize: 38, color: CREAM, opacity: 0.92, textWrap: "balance" } as React.CSSProperties}>{d.phu}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 10, alignItems: "center" }}>
            <div style={{ background: CREAM, color: INK, borderRadius: 999, padding: "16px 34px", fontFamily: SANS, fontWeight: 600, fontSize: 44 }}>{d.gia} / lượt 24 giờ</div>
            <div style={{ border: `2px solid ${CREAM}`, color: CREAM, borderRadius: 999, padding: "12px 28px", fontFamily: SANS, fontSize: 34 }}>Giá trị {d.giaTri}</div>
          </div>
          <div style={{ fontFamily: SANS, fontSize: 26, color: CREAM, opacity: 0.8, marginTop: 6 }}>{NGUON}</div>
        </div>
      ) : (
        <div style={{ position: "absolute", ...(d.side === "right" ? { right: 180 } : { left: 60 }), bottom: d.labelBottom ?? 300, background: PANEL, borderRadius: 40, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start", whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: SERIF, fontSize: 62, lineHeight: 1.0, color: CREAM }}>{d.ten}</div>
          <div style={{ background: CREAM, color: INK, borderRadius: 999, padding: "12px 28px", fontFamily: SANS, fontWeight: 600, fontSize: 46 }}>{d.gia} / lượt</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* cảnh dịch vụ: nền ảnh, 3 dòng cắt theo phách */
const Service: React.FC<{ p: ReelProps }> = ({ p }) => {
  const f = useCurrentFrame();
  const lines: React.ReactNode[] = p.service.map(([a, b]) => <>{a}<b style={{ fontWeight: 600 }}>{b}</b></>);
  return (
    <AbsoluteFill>
      <Photo src={p.serviceImg} dur={SERVICE} pos="50% 30%" s0={1.06} s1={1.0} />
      <AbsoluteFill style={{ backgroundColor: "rgba(10,8,6,0.62)" }} />
      <TopBar />
      <div style={{ position: "absolute", top: 520, left: 80, right: 180, display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 68, color: CREAM, marginBottom: 16, textWrap: "balance" } as React.CSSProperties}>{p.serviceTitle}</div>
        {lines.map((t, k) =>
          f >= k * 15 ? (
            <div key={k} style={{ background: "rgba(246,241,234,0.12)", border: "1px solid rgba(246,241,234,0.25)", borderRadius: 40, padding: "28px 38px", fontFamily: SANS, fontSize: 46, lineHeight: 1.3, color: CREAM }}>{t}</div>
          ) : null,
        )}
      </div>
    </AbsoluteFill>
  );
};

/* cảnh kết: dải 3 ảnh, một lời kêu gọi */
const EndCard: React.FC<{ p: ReelProps }> = ({ p }) => {
  const thumbs = p.dresses.slice(0, 3).map((d) => d.a);
  return (
    <AbsoluteFill style={{ backgroundColor: CREAM }}>
      <div style={{ position: "absolute", top: 230, bottom: 300, left: 60, right: 60, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ display: "flex", gap: 20 }}>
          {thumbs.map((t) => (
            <Img key={t} src={staticFile(t)} style={{ width: 240, height: 360, objectFit: "cover", objectPosition: "50% 25%", borderRadius: 40 }} />
          ))}
        </div>
        <div style={{ marginTop: 56 }}><Wordmark size={56} color={INK} /></div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 76, lineHeight: 1.12, color: INK, marginTop: 30 }}>Mỗi lần, một chiếc mới.</div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 40, color: INK, marginTop: 26 }}>Mở cửa 12.12 · Đà Nẵng</div>
        <div style={{ marginTop: 44, background: INK, color: CREAM, borderRadius: 999, padding: "26px 52px", fontFamily: SANS, fontWeight: 600, fontSize: 44 }}>{p.cta}</div>
        <div style={{ fontFamily: SANS, fontSize: 36, color: "#4A443E", marginTop: 18 }}>{p.ctaSub}</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, color: INK, marginTop: 30, letterSpacing: "0.03em" }}>cherie.io.vn</div>
        <div style={{ fontFamily: SANS, fontSize: 28, color: "#6B635A", marginTop: 26 }}>{NGUON}</div>
      </div>
    </AbsoluteFill>
  );
};

export const Reel: React.FC<ReelProps> = (p) => {
  NGUON = p.nguon || "";
  let t = 0;
  const at = (n: number) => { const s0 = t; t += n; return s0; };
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      {p.nhac ? <Audio src={staticFile("nhac.wav")} volume={0.9} /> : null}
      <Sequence from={at(HOOK)} durationInFrames={HOOK}><Hook p={p} /></Sequence>
      {p.dresses.map((d, i) => (
        <Sequence key={i} from={at(DRESS)} durationInFrames={DRESS}><DressScene d={d} i={i} n={p.dresses.length} /></Sequence>
      ))}
      <Sequence from={at(SERVICE)} durationInFrames={SERVICE}><Service p={p} /></Sequence>
      <Sequence from={at(END)} durationInFrames={END}><EndCard p={p} /></Sequence>
    </AbsoluteFill>
  );
};
