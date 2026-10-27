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

/* Khuôn "clip": cảnh là clip team quay (gửi lên Drive thành nhiều mảnh, "drive:ID1,ID2") hoặc URL video, ảnh.
   Tải về, ghép mảnh, cắt đúng đoạn (tu, dur, speed), xoay dọc 1080x1920 30fps, giữ âm thanh gốc. */
const driveUrl = (id) => `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
const clipLocal = (s, k) => {
  const src = String(s.src || "");
  if (!src) return { ...s, kind: "nen" };
  const key = createHash("md5").update(JSON.stringify([src, s.tu || 0, s.dur, s.speed || 1])).digest("hex").slice(0, 12);
  const isDrive = /^drive:/.test(src);
  const kind = s.kind || (isDrive ? "video" : /\.(jpe?g|png|webp)(\?|$)/i.test(src) ? "image" : "video");
  if (kind === "image") return { ...s, kind, src: isDrive ? (() => { const raw = `public/dl/${key}.raw`, jpg = `public/dl/${key}.jpg`; if (!existsSync(jpg)) { execFileSync("curl", ["-sSL", "-m", "120", "--retry", "3", "-o", raw, driveUrl(src.slice(6).split(",")[0])]); execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-vf", "scale='min(1500,iw)':-2", "-q:v", "3", jpg]); } return `dl/${key}.jpg`; })() : local(src) };
  const raw = `public/dl/${key}.src`, out = `public/dl/${key}.mp4`;
  if (!existsSync(out)) {
    if (isDrive) {
      const ids = src.slice(6).split(",").map((x) => x.trim()).filter(Boolean);
      const parts = ids.map((id, i) => { const f = `public/dl/${key}.p${i}`; execFileSync("curl", ["-sSL", "-m", "300", "--retry", "3", "-o", f, driveUrl(id)]); return f; });
      execFileSync("bash", ["-c", `cat ${parts.join(" ")} > ${raw}`]);
    } else execFileSync("curl", ["-sSL", "-m", "300", "--retry", "3", "-o", raw, src]);
    const sp = Math.min(2, Math.max(0.5, +s.speed || 1));
    const len = (+s.dur || 1) * sp + 0.2;
    const hasA = execFileSync("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", raw]).toString().trim() !== "";
    const args = ["-v", "error", "-y", "-ss", String(+s.tu || 0), "-i", raw, "-t", String(len),
      "-vf", `setpts=PTS/${sp},scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p`,
      "-c:v", "libx264", "-crf", "18", "-preset", "veryfast"];
    if (hasA) args.push("-af", `atempo=${sp}`, "-c:a", "aac", "-b:a", "160k"); else args.push("-an");
    args.push(out);
    execFileSync("ffmpeg", args);
    console.log("clip", k + 1, "ok", out);
  }
  return { ...s, kind, src: `dl/${key}.mp4` };
};
if (p.format === "clip") {
  p.scenes = (p.scenes || []).map(clipLocal);
  writeFileSync(outp, JSON.stringify(p));
  console.log("props ok: clip", p.scenes.length, "cảnh");
  process.exit(0);
}

if (p.hookImg) p.hookImg = local(p.hookImg);
if (p.serviceImg) p.serviceImg = local(p.serviceImg);
p.dresses = (p.dresses || []).map((d) =>
  d.shots ? { ...d, shots: d.shots.map((s) => ({ ...s, src: local(s.src) })) } : d.img ? { ...d, img: local(d.img) } : { ...d, a: local(d.a), b: local(d.b) }
);
p.nhac = false;
writeFileSync(outp, JSON.stringify(p));
console.log("props ok:", p.tenY ? "key visual" : p.format || "khuôn cũ", p.dresses.length, "mẫu");
