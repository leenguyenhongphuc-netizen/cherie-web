#!/bin/bash
# Dựng video Chérie từ một file props JSON.
# Dùng: bash render.sh <props.json> <tên-đầu-ra>
# - props có trường "format" (lat-gia, chon-1, can-canh) → khuôn v2 (CherieReel2); không có → khuôn cũ.
# - Ảnh trong props có thể là URL https: script tự tải về public/dl/ và thu nhỏ.
# - Kết quả: out/<tên>-khong-nhac.mp4, out/<tên>-co-nhac.mp4 (-14 LUFS), out/<tên>-khung.jpg (tấm ghép 4 khung/giây để kiểm duyệt).
set -euo pipefail
cd "$(dirname "$0")"
PROPS="$1"; NAME="$2"
export npm_config_noproxy=localhost,127.0.0.1 NO_PROXY=localhost,127.0.0.1 no_proxy=localhost,127.0.0.1
[ -d node_modules/remotion ] || npm ci --no-audit --no-fund >/dev/null 2>&1 || npm i --no-audit --no-fund >/dev/null 2>&1
CH="${CHROME:-$(cd /tmp && node -e "try{console.log(require('playwright').chromium.executablePath())}catch(e){console.log('')}")}"
mkdir -p public/dl out
node prep.mjs "$PROPS" out/props.json
COMP=CherieReel; NHAC=public/nhac.wav
if grep -q '"format"' out/props.json; then COMP=CherieReel2; NHAC=public/nhac2.wav; fi
ARGS=(--props=out/props.json --codec=h264 --crf=20 --concurrency="$(nproc)")
[ -n "$CH" ] && ARGS+=(--browser-executable="$CH")
npx remotion render src/index.ts "$COMP" out/tmp.mp4 "${ARGS[@]}" >out/render.log 2>&1 || { tail -30 out/render.log; exit 1; }
ffmpeg -v error -y -i out/tmp.mp4 -an -c copy "out/$NAME-khong-nhac.mp4"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 out/tmp.mp4)
ffmpeg -v error -y -i out/tmp.mp4 -stream_loop -1 -i "$NHAC" -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=7,afade=t=out:st=$(awk "BEGIN{print $DUR-0.6}"):d=0.6" -t "$DUR" -c:a aac -b:a 192k "out/$NAME-co-nhac.mp4"
ffmpeg -v error -y -i "out/$NAME-khong-nhac.mp4" -vf "fps=4,scale=216:-1,tile=10x6" -frames:v 1 "out/$NAME-khung.jpg"
ls -la "out/$NAME"-*
