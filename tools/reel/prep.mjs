// Tải ảnh URL trong props về public/dl/, thu nhỏ còn rộng 1500px, rồi ghi props mới trỏ tới file cục bộ.
// Hỗ trợ khuôn cũ (dresses[].a/b, hookImg, serviceImg) và khuôn v2 (dresses[].shots[].src).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const [, , inp, outp] = process.argv;
const p = JSON.parse(readFileSync(inp, "utf8"));
mkdirSync("public/dl", { recursive: true });

const local = (u) => {
  if (!u || !/^https?:\/\//.test(u)) return u;
  const id = createHash("md5").update(u).digest("hex").slice(0, 12);
  const raw = `public/dl/${id}.raw`, jpg = `public/dl/${id}.jpg`;
  if (!existsSync(jpg)) {
    execFileSync("curl", ["-sSL", "-m", "60", "--retry", "2", "-o", raw, u]);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-vf", "scale='min(1500,iw)':-2", "-q:v", "3", jpg]);
  }
  return `dl/${id}.jpg`;
};

if (p.hookImg) p.hookImg = local(p.hookImg);
if (p.serviceImg) p.serviceImg = local(p.serviceImg);
p.dresses = (p.dresses || []).map((d) =>
  d.shots ? { ...d, shots: d.shots.map((s) => ({ ...s, src: local(s.src) })) } : d.img ? { ...d, img: local(d.img) } : { ...d, a: local(d.a), b: local(d.b) }
);
p.nhac = false;
writeFileSync(outp, JSON.stringify(p));
console.log("props ok:", p.tenY ? "key visual" : p.format || "khuôn cũ", p.dresses.length, "mẫu");
