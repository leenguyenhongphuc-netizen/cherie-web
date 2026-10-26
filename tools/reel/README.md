# Khuôn video Chérie (Remotion)

## Khuôn v2 (dùng từ 27/10/2026)

Composition `CherieReel2`, file `src/Reel2.tsx`. Video dọc 1080x1920, 30fps, 8–15 giây, cắt theo phách 120 BPM.
Khung đầu tiên đã có hình chuyển động và chữ; cứ 0,3–1,2 giây có một thay đổi (cắt, đẩy vào, chớp flash, chữ đập vào).

Ba định dạng (trường `format`):
- `lat-gia`: "Chiếc đầm này / 9 triệu" → gạch → "Nàng mặc 24 giờ / 870k", rồi cắt nhanh chi tiết từng mẫu. Xem `vi-du-lat-gia.json`.
- `chon-1`: 2–3 chiếc cạnh nhau đánh số, từng chiếc cắt nhanh, kết bằng "Nàng chọn số mấy?". Xem `vi-du-chon-1.json`.
- `can-canh`: cận chi tiết tăng tốc, chớp flash lộ dáng, tên và giá. Xem `vi-du-can-canh.json`.

Trường chung: `hookTop`, `hookBig`, `hookSub`, `chuHook` ("tren" hoặc "duoi"), `doan` (đáp án đoán giá, chỉ can-canh), `dresses[] {ten, loai, size, gia, giaTri, shots[] {src, pos, scale}}`, `dichVu` (3 nhịp chữ, tuỳ chọn), `cta`, `ctaSub`, `nguon`.
Luật nội dung (số tiền chính xác, cọc, Gói Yên tâm, giọng văn, cổng chấm) nằm trong skill `cherie-content-pipeline`.

## Khuôn cũ (đã bỏ)

`CherieReel` (`src/Reel.tsx`, bản "Hé lộ 3 chiếc") bị chủ tiệm chê nhịp chậm, không hook, giống slideshow (26/10/2026). Giữ lại để video cũ dựng lại được, không dùng cho bài mới.

## Dựng

    bash render.sh props.json ten-dau-ra

Props có trường `format` thì dùng khuôn v2. Ảnh có thể là URL https (script tự tải về). Đầu ra trong `out/`: bản không nhạc, bản có nhạc tự soạn (`nhac2.wav`, -14 LUFS), tấm ghép 4 khung mỗi giây để kiểm duyệt.
Agent theo lịch không chạy script này: chỉ đẩy `jobs/<id>.json`, GitHub Actions (workflow "Dựng video") dựng và lưu vào `media/reel/`.
