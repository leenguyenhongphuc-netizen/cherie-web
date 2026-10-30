/*
 * Khuôn "clip" (27/10/2026): dựng video theo ĐÚNG kịch bản từ clip team quay bằng điện thoại (và ảnh nếu kịch bản cần).
 * Mỗi cảnh trong kịch bản là một cảnh ở đây: đúng thời lượng, đúng chữ trên màn hình (chỉ câu chữ, không bao giờ in chỉ dẫn),
 * giữ âm thanh gốc khi kịch bản cần (tiếng giấy xé, tiếng móc chạm thanh tủ).
 * Clip đã được prep.mjs cắt đúng đoạn, xoay dọc 1080x1920, 30fps, nên ở đây chỉ việc phát từ đầu.
 */
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing, spring, useVideoConfig } from "remotion";

const SERIF = '"Bodoni Moda", Didot, Georgia, serif';
const SANS = '"Be Vietnam Pro", system-ui, sans-serif';
const IVORY = "#F5F3F2"; /* nền bg bộ nhận diện 30/10/2026 */
const NOIR = "#1B1618"; /* mực ink */
const CHAMP = "#D2B27F"; /* vàng đồng trên nền tối, ảnh (gold-on-wine) */
const GOLD = "#8C6B3A"; /* vàng đồng gốc: chỉ nét mảnh trên nền sáng */
const GOLD_ON_DARK = "#D2B27F";
const RUBY = "#7A1F3D"; /* vang wine, màu Thuê đầm */
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const FPS = 30;

export type ClipScene = {
  src?: string; // file cục bộ sau prep (dl/...mp4 hoặc dl/...jpg); trống = nền màu
  kind?: "video" | "image" | "nen";
  dur: number; // giây
  chu?: string; // ĐÚNG câu chữ hiện trên màn hình, trống = không chữ
  phu?: string; // dòng nhỏ dưới chữ chính (tuỳ chọn)
  viTri?: "tren" | "giua" | "duoi"; // chỗ đặt chữ, chọn chỗ không đè mặt và chi tiết đầm
  co?: "lon" | "vua" | "nho";
  kieu?: "serif" | "nghieng" | "sans";
  nen?: "ivory" | "noir" | "toi" | "khong"; // khối nền sau chữ: ivory/noir = viên bo 40px, toi = dải tối mờ, khong = chỉ bóng chữ
  mauChu?: "noir" | "ivory" | "champagne" | "ruby";
  tag?: { ten: string; size?: string; gia: string; donVi?: string }; // thẻ giá bo 40px nền Ivory viền Champagne
  zoom?: "vao" | "ra" | "khong"; // ảnh tĩnh: đẩy vào hoặc kéo ra; clip: đẩy nhẹ
  pos?: string; // object-position
  speed?: number; // tốc độ phát clip (đã xử lý trong prep, ở đây chỉ để ghi)
  amThanh?: boolean; // giữ âm thanh gốc của clip
  flash?: boolean; // chớp flash ở đầu cảnh
  chuLuc?: number; // giây chữ bắt đầu hiện trong cảnh (mặc định 0 = có ngay)
};
export type ClipProps = {
  format: "clip";
  scenes: ClipScene[];
  cta?: string;
  ctaSub?: string;
  nguon?: string;
  ketThuc?: boolean; // khung kết CHÉRIE 1,5s (mặc định có)
  logo?: boolean; // chữ CHÉRIE nhỏ góc trên (mặc định có)
};

const END = 45;
export const durationClip = (p: ClipProps) => Math.max(1, Math.round((p.scenes || []).reduce((a, s) => a + (+s.dur || 0), 0) * FPS)) + (p.ketThuc === false ? 0 : END);

const Media: React.FC<{ s: ClipScene; frames: number }> = ({ s, frames }) => {
  const f = useCurrentFrame();
  if (!s.src || s.kind === "nen") return <AbsoluteFill style={{ backgroundColor: s.nen === "ivory" ? IVORY : NOIR }} />;
  const z = s.zoom ?? (s.kind === "image" ? "vao" : "khong");
  const sc = z === "vao" ? interpolate(f, [0, frames], [1.12, 1.0], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }) : z === "ra" ? interpolate(f, [0, frames], [1.0, 1.1], { extrapolateRight: "clamp" }) : 1;
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos ?? "50% 50%", transform: `scale(${sc})` };
  return (
    <AbsoluteFill style={{ backgroundColor: NOIR, overflow: "hidden" }}>
      {s.kind === "image" ? <Img src={staticFile(s.src)} style={st} /> : <OffthreadVideo src={staticFile(s.src)} muted={!s.amThanh} style={st} />}
    </AbsoluteFill>
  );
};

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 4], [0.9, 0], { extrapolateRight: "clamp" });
  return o > 0 ? <AbsoluteFill style={{ backgroundColor: "#fff", opacity: o }} /> : null;
};

const Words: React.FC<{ text: string; at: number; style: React.CSSProperties }> = ({ text, at, style }) => {
  const f = useCurrentFrame();
  const ws = text.split(/\s+/).filter(Boolean);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.26em", ...style }}>
      {ws.map((w, i) => {
        const t = at === 0 && i < 6 ? 99 : f - at - i * 2; // khung đầu: chữ có ngay
        const y = interpolate(t, [0, 5], [34, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
        const o = interpolate(t, [0, 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <span key={i} style={{ display: "inline-block", transform: `translateY(${y}px)`, opacity: o }}>{w}</span>;
      })}
    </div>
  );
};

const colorOf = (s: ClipScene) => {
  const m = s.mauChu ?? (s.nen === "ivory" ? "noir" : "ivory");
  return m === "noir" ? NOIR : m === "champagne" ? CHAMP : m === "ruby" ? RUBY : IVORY;
};

/* chữ trên màn hình: chỉ câu chữ của kịch bản, đặt trong vùng an toàn TikTok/Reels (trên 220, dưới 400, phải 180) */
const Caption: React.FC<{ s: ClipScene; first: boolean }> = ({ s, first }) => {
  if (!s.chu && !s.phu) return null;
  const at = Math.round((s.chuLuc ?? 0) * FPS);
  const size = s.co === "lon" ? 120 : s.co === "nho" ? 48 : 72;
  const fam = s.kieu === "sans" ? SANS : SERIF;
  const pos = s.viTri ?? "duoi";
  const box: React.CSSProperties = s.nen === "ivory" || s.nen === "noir" ? { background: s.nen === "ivory" ? IVORY : NOIR, borderRadius: 40, padding: "34px 40px", alignSelf: "flex-start", maxWidth: "100%" } : {};
  const shadow = s.nen === "ivory" || s.nen === "noir" ? "none" : "0 2px 22px rgba(0,0,0,0.55)";
  return (
    <>
      {s.nen === "toi" ? <AbsoluteFill style={{ background: `linear-gradient(${pos === "tren" ? "to bottom" : "to top"}, rgba(20,20,20,0.78), rgba(20,20,20,0) 55%)` }} /> : null}
      <div style={{ position: "absolute", left: 72, right: 180, ...(pos === "tren" ? { top: 340 } : pos === "duoi" ? { bottom: 420 } : { top: 0, bottom: 0, justifyContent: "center" }), display: "flex", flexDirection: "column" }}>
        <div style={box}>
          {s.chu ? <Words text={s.chu} at={first ? 0 : at} style={{ fontFamily: fam, fontStyle: s.kieu === "nghieng" ? "italic" : "normal", fontWeight: s.kieu === "sans" ? 600 : 500, fontSize: size, lineHeight: 1.17, color: colorOf(s), textShadow: shadow }} /> : null}
          {s.phu ? <Words text={s.phu} at={(first ? 0 : at) + 6} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 38, lineHeight: 1.4, marginTop: 14, color: colorOf(s), textShadow: shadow }} /> : null}
        </div>
      </div>
    </>
  );
};

const PriceTag: React.FC<{ t: NonNullable<ClipScene["tag"]> }> = ({ t }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [2, 9], [-70, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const o = interpolate(f, [2, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 72, bottom: 440, transform: `translateX(${x}px)`, opacity: o, background: IVORY, border: `1.5px solid ${CHAMP}`, borderRadius: 40, padding: "28px 36px", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontFamily: SERIF, fontSize: 44, color: NOIR }}>{t.ten}{t.size ? ` · ${t.size}` : ""}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 64, color: RUBY }}>{t.gia}</span>
        <span style={{ fontFamily: SANS, fontSize: 28, color: NOIR }}>{t.donVi ?? "/ 24 giờ"}</span>
      </div>
    </div>
  );
};

const Corner: React.FC = () => (
  <div style={{ position: "absolute", top: 250, left: 72, fontFamily: SERIF, fontWeight: 600, fontSize: 26, letterSpacing: "0.32em", color: IVORY, textShadow: "0 1px 10px rgba(0,0,0,0.5)" }}>CHÉRIE</div>
);

const End: React.FC<{ p: ClipProps }> = ({ p }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: f, fps, config: { damping: 16, stiffness: 190 } });
  return (
    <AbsoluteFill style={{ backgroundColor: IVORY, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26, padding: "0 90px" }}>
      {p.nguon ? <div style={{ position: "absolute", top: 230, left: 72, fontFamily: SANS, fontSize: 22, color: NOIR, opacity: 0.6 }}>{p.nguon}</div> : null}
      <div style={{ transform: `scale(${0.92 + 0.08 * sp})`, fontFamily: SERIF, fontWeight: 600, fontSize: 64, letterSpacing: "0.32em", paddingLeft: "0.32em", color: NOIR }}>CHÉRIE</div>
      <div style={{ width: 100, height: 2, background: GOLD, margin: "0 auto" }} />
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: "0.18em", paddingLeft: "0.18em", color: RUBY, textAlign: "center" }}>THUÊ ĐẦM</div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: NOIR, textAlign: "center" }}>Mỗi lần, một chiếc mới.</div>
      {p.cta ? <div style={{ background: RUBY, color: "#FFFFFF", borderRadius: 999, padding: "26px 52px", fontFamily: SANS, fontWeight: 600, fontSize: 42, opacity: interpolate(f, [3, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{p.cta}</div> : null}
      {p.ctaSub ? <div style={{ fontFamily: SANS, fontSize: 34, color: NOIR, textAlign: "center", opacity: interpolate(f, [6, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{p.ctaSub}</div> : null}
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: "#7A5F3A" }}>cherie.io.vn</div>
    </AbsoluteFill>
  );
};

export const Clip: React.FC<ClipProps> = (p) => {
  let t = 0;
  const scenes = p.scenes || [];
  return (
    <AbsoluteFill style={{ backgroundColor: NOIR }}>
      {scenes.map((s, k) => {
        const n = Math.max(1, Math.round((+s.dur || 0) * FPS));
        const from = t;
        t += n;
        return (
          <Sequence key={k} from={from} durationInFrames={n}>
            <Media s={s} frames={n} />
            {s.flash ? <Flash /> : null}
            {p.logo === false ? null : <Corner />}
            {s.tag ? <PriceTag t={s.tag} /> : null}
            <Caption s={s} first={k === 0} />
          </Sequence>
        );
      })}
      {p.ketThuc === false ? null : <Sequence from={t} durationInFrames={END}><End p={p} /></Sequence>}
    </AbsoluteFill>
  );
};

export const clipDefaults: ClipProps = { format: "clip", scenes: [{ kind: "nen", dur: 2, chu: "Khuôn clip Chérie", viTri: "giua", co: "lon" }], cta: "Theo dõi Chérie" };
