#!/bin/bash
# Dựng video Chérie từ một file props JSON.
# Dùng: bash render.sh <props.json> <tên-đầu-ra>
# - Ảnh trong props (a, b, hookImg, serviceImg) có thể là URL https: script tự tải về public/dl/ và thu nhỏ.
# - Kết quả: out/<tên>-khong-nhac.mp4, out/<tên>-co-nhac.mp4 (nhạc tự soạn, -14 LUFS), out/<tên>-khung.jpg (tấm ghép khung mỗi 0,5s để kiểm duyệt).
set -euo pipefail
cd "$(dirname "$0")"
PROPS="$1"; NAME="$2"
# npm và trình tải phải đi qua proxy của phiên (registry.npmjs.org không phân giải DNS trực tiếp)
export npm_config_noproxy=localhost,127.0.0.1 NO_PROXY=localhost,127.0.0.1 no_proxy=localhost,127.0.0.1
[ -d node_modules/remotion ] || npm ci --no-audit --no-fund >/dev/null 2>&1 || npm i --no-audit --no-fund >/dev/null 2>&1
CH="${CHROME:-$(cd /tmp && node -e "try{console.log(require('playwright').chromium.executablePath())}catch(e){console.log('')}")}"
mkdir -p public/dl out
node prep.mjs "$PROPS" out/props.json
ARGS=(--props=out/props.json --codec=h264 --crf=22 --concurrency="$(nproc)")
[ -n "$CH" ] && ARGS+=(--browser-executable="$CH")
npx remotion render src/index.ts CherieReel out/tmp.mp4 "${ARGS[@]}" >out/render.log 2>&1 || { tail -30 out/render.log; exit 1; }
ffmpeg -v error -y -i out/tmp.mp4 -an -c copy "out/$NAME-khong-nhac.mp4"
ffmpeg -v error -y -i out/tmp.mp4 -i public/nhac.wav -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=7,afade=t=out:st=$(ffprobe -v error -show_entries format=duration -of csv=p=0 out/tmp.mp4 | awk '{print $1-0.9}'):d=0.9" -shortest -c:a aac -b:a 192k "out/$NAME-co-nhac.mp4"
ffmpeg -v error -y -i "out/$NAME-khong-nhac.mp4" -vf "fps=2,scale=270:-1,tile=6x6" -frames:v 1 "out/$NAME-khung.jpg"
ls -la "out/$NAME"-*
