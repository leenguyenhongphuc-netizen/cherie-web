/*
 * Key visual demo cho kế hoạch tháng (27/10/2026).
 * Ba ảnh tĩnh để chủ tiệm nhìn thấy hướng hình của tháng: post 4:5, story 9:16, bìa video 9:16.
 * Props do Agent Lập kế hoạch ghi trong dinhHuong.keyVisual.demo (xem README).
 */
import React from "react";
import { AbsoluteFill, Img, staticFile, continueRender, delayRender } from "remotion";
import { FONT_CSS } from "./fontcss";

if (typeof document !== "undefined" && !document.getElementById("cherie-fonts")) {
  const h = delayRender("Tải phông Chérie");
  const st = document.createElement("style");
  st.id = "cherie-fonts";
  st.textContent = FONT_CSS.split("FONTDIR").join(staticFile("fonts"));
  document.head.appendChild(st);
  Promise.all([
    document.fonts.load('400 40px "Playfair Display"', "Mở tủ"),
    document.fonts.load('500 40px "Playfair Display"', "CHÉRIE"),
    document.fonts.load('italic 400 40px "Playfair Display"', "Nàng"),
    document.fonts.load('500 40px "Be Vietnam Pro"', "Còn"),
    document.fonts.load('600 40px "Be Vietnam Pro"', "CÒN"),
  ]).then(() => continueRender(h), () => continueRender(h));
}

const SERIF = '"Playfair Display", Georgia, serif';
const SANS = '"Be Vietnam Pro", system-ui, sans-serif';
const IVORY = "#F6F1EA";
const NOIR = "#141414";
const CHAMP = "#C8A97E";
const CHAMP_D = "#7A5F3A";
const NUDE = "#E8C7C3";
const RUBY = "#8E1B2E";

export type KvDress = { ten: string; gia: string; giaTri?: string; img: string; pos?: string };
export type KvProps = {
  tenY: string; // tên ý tưởng key visual, ví dụ "Cánh tủ hé"
  tieuDe: string; // câu lớn, ví dụ "Mở tủ cho nàng xem trước."
  phu?: string; // câu nhỏ dưới tiêu đề
  hook?: string; // chữ lớn trên bìa video, ví dụ "Đoán giá thuê?"
  cta?: string; // nút lời mời, ví dụ "Để lại tên, 12.12 tụi mình nhắn nàng"
  nhan?: string; // nhãn đếm ngược hoặc nhãn tuần, ví dụ "CÒN 26 NGÀY"
  he?: number; // độ hé của biểu tượng cánh tủ 0–1 (bỏ trống thì không vẽ)
  dresses: KvDress[]; // 1–3 mẫu, ảnh thật
  nguon?: string;
};

export const kvDefaults: KvProps = {
  tenY: "Cánh tủ hé",
  tieuDe: "Mở tủ cho nàng xem trước.",
  phu: "Mỗi tuần vài chiếc mới. Nàng đoán giá, nàng chọn.",
  hook: "Đoán giá thuê?",
  cta: "Để lại tên, 12.12 tụi mình nhắn nàng",
  nhan: "CÒN 26 NGÀY",
  he: 0.3,
  dresses: [],
  nguon: "Ảnh lookbook: SIXDO",
};

const Wordmark: React.FC<{ color?: string; size?: number }> = ({ color = NOIR, size = 34 }) => (
  <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: size, letterSpacing: "0.42em", paddingLeft: "0.42em", color }}>CHÉRIE</div>
);

/* biểu tượng cánh tủ: hai nét champagne, khe giữa là độ hé */
const Tu: React.FC<{ he: number; h?: number; color?: string }> = ({ he, h = 120, color = CHAMP }) => (
  <div style={{ position: "relative", width: 20 + 70 * he + 20, height: h }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 2, height: h, background: color, borderRadius: 2 }} />
    <div style={{ position: "absolute", right: 0, top: 0, width: 2, height: h, background: color, borderRadius: 2 }} />
  </div>
);

const Nhan: React.FC<{ p: KvProps; dark?: boolean; h?: number }> = ({ p, dark, h = 110 }) =>
  p.he != null || p.nhan ? (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
      {p.he != null ? <Tu he={p.he} h={h} color={dark ? CHAMP : CHAMP_D} /> : null}
      {p.nhan ? <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: h < 100 ? 30 : 38, letterSpacing: "0.08em", color: dark ? IVORY : NOIR }}>{p.nhan}</div> : null}
    </div>
  ) : null;

const Photo: React.FC<{ d?: KvDress; style?: React.CSSProperties }> = ({ d, style }) =>
  d ? <Img src={staticFile(d.img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: d.pos ?? "50% 25%", ...style }} /> : <div style={{ width: "100%", height: "100%", background: NUDE }} />;

const Gia: React.FC<{ d?: KvDress; dark?: boolean }> = ({ d, dark }) =>
  d ? (
    <div style={{ display: "inline-flex", alignItems: "baseline", gap: 14, background: IVORY, color: NOIR, borderRadius: 999, padding: "14px 32px", border: `1.5px solid ${CHAMP}`, boxShadow: dark ? "0 6px 30px rgba(0,0,0,0.3)" : "none" }}>
      <span style={{ fontFamily: SERIF, fontSize: 30 }}>{d.ten}</span>
      <span style={{ fontFamily: SERIF, fontSize: 56, color: RUBY }}>{d.gia}</span>
      <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24 }}>/ lượt 24 giờ</span>
    </div>
  ) : null;

/* Post 4:5 — ảnh trong khung bo 40, khung champagne bo 32, chữ trên nền Ivory */
export const KvPost: React.FC<KvProps> = (p) => {
  const d = p.dresses[0];
  return (
    <AbsoluteFill style={{ background: IVORY }}>
      <div style={{ position: "absolute", left: 64, right: 64, top: 64, height: 770, borderRadius: 40, overflow: "hidden" }}>
        <Photo d={d} />
        <div style={{ position: "absolute", inset: 24, border: `1.5px solid ${IVORY}`, borderRadius: 32 }} />
        <div style={{ position: "absolute", left: 48, bottom: 44 }}><Gia d={d} dark /></div>
      </div>
      <div style={{ position: "absolute", left: 96, right: 96, top: 872, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}><Wordmark size={30} /><Nhan p={p} h={64} /></div>
        <div style={{ fontFamily: SERIF, fontSize: 70, lineHeight: 1.06, color: NOIR }}>{p.tieuDe}</div>
        {p.phu ? <div style={{ fontFamily: SANS, fontSize: 30, lineHeight: 1.4, color: NOIR, opacity: 0.8 }}>{p.phu}</div> : null}
      </div>
      {p.nguon ? <div style={{ position: "absolute", left: 96, bottom: 34, fontFamily: SANS, fontSize: 20, color: NOIR, opacity: 0.55 }}>{p.nguon}</div> : null}
    </AbsoluteFill>
  );
};

/* Story 9:16 — ảnh tràn viền, lớp Noir dưới, lời mời */
export const KvStory: React.FC<KvProps> = (p) => {
  const d = p.dresses[1] || p.dresses[0];
  return (
    <AbsoluteFill style={{ background: NOIR }}>
      <Photo d={d} />
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(20,20,20,0.92) 0%, rgba(20,20,20,0.55) 38%, rgba(20,20,20,0) 62%)" }} />
      <div style={{ position: "absolute", top: 250, left: 80 }}><Wordmark color={IVORY} size={30} /></div>
      <div style={{ position: "absolute", left: 80, right: 180, bottom: 420, display: "flex", flexDirection: "column", gap: 26 }}>
        <Nhan p={p} dark />
        <div style={{ fontFamily: SERIF, fontSize: 96, lineHeight: 1.04, color: IVORY }}>{p.tieuDe}</div>
        {p.cta ? <div style={{ alignSelf: "flex-start", background: IVORY, color: NOIR, borderRadius: 999, padding: "24px 44px", fontFamily: SANS, fontWeight: 600, fontSize: 36 }}>{p.cta}</div> : null}
      </div>
      {p.nguon ? <div style={{ position: "absolute", left: 80, top: 300, fontFamily: SANS, fontSize: 22, color: IVORY, opacity: 0.75 }}>{p.nguon}</div> : null}
    </AbsoluteFill>
  );
};

/* Bìa video 9:16 — hook lớn, giá, ảnh tràn viền; nếu có 2–3 mẫu thì ghép dọc như ô chọn */
export const KvCover: React.FC<KvProps> = (p) => {
  const ds = p.dresses.slice(0, 3);
  return (
    <AbsoluteFill style={{ background: NOIR }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", gap: 6 }}>
        {(ds.length ? ds : [undefined]).map((d, k) => (
          <div key={k} style={{ flex: 1, position: "relative", overflow: "hidden" }}><Photo d={d} /></div>
        ))}
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(20,20,20,0.85) 0%, rgba(20,20,20,0.35) 32%, rgba(20,20,20,0) 50%, rgba(20,20,20,0) 62%, rgba(20,20,20,0.8) 100%)" }} />
      <div style={{ position: "absolute", top: 250, left: 80 }}><Wordmark color={IVORY} size={28} /></div>
      <div style={{ position: "absolute", top: 330, left: 80, right: 180, fontFamily: SERIF, fontSize: 150, lineHeight: 1.0, color: IVORY }}>{p.hook || p.tieuDe}</div>
      <div style={{ position: "absolute", left: 60, right: 180, bottom: 420, display: "flex" }}>
        {ds.map((d, k) => (
          <div key={k} style={{ flex: 1, textAlign: "center" }}>
            {ds.length > 1 ? <div style={{ fontFamily: SERIF, fontSize: 110, lineHeight: 1, color: IVORY }}>{k + 1}</div> : null}
            <div style={{ display: "inline-block", background: IVORY, color: RUBY, borderRadius: 999, padding: "6px 20px", fontFamily: SERIF, fontSize: 40, marginTop: 8 }}>{d.gia}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
