# Khuôn video Chérie (Remotion)

## Khuôn v2 (dùng từ 27/10/2026)

Composition `CherieReel2`, file `src/Reel2.tsx`. Video dọc 1080x1920, 30fps, 8–15 giây, cắt theo phách 120 BPM.
Khung đầu tiên đã có hình chuyển động và chữ; cứ 0,3–1,2 giây có một thay đổi (cắt, đẩy vào, chớp flash, chữ đập vào).

Ba định dạng (trường `format`):
- `lat-gia`: "Giá trị chiếc đầm này / 9.000.000đ" → gạch → "Nàng mặc 24 giờ / 870k", rồi cắt nhanh chi tiết từng mẫu. Xem `vi-du-lat-gia.json`.
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

## Key visual tháng (từ 27/10/2026)

Ba ảnh tĩnh `KvPost` (4:5), `KvStory` (9:16), `KvCover` (bìa video 9:16), file `src/KeyVisual.tsx`.
Props có trường `tenY` thì `render.sh` dựng 3 ảnh thay cho video. Xem `vi-du-key-visual.json`.
Agent Lập kế hoạch đẩy `jobs/<id kế hoạch viết thường>.json` (ví dụ `kh-m122026.json`); GitHub Actions lưu `media/kv/<id>-post.jpg`, `-story.jpg`, `-cover.jpg`. App Marketing tự hiện 3 ảnh này trong trang proposal của kế hoạch tháng.

## Thay đổi 27/10/2026 (theo nhận xét của Agent Kiểm duyệt ở ND001)

- Cảnh lộ dáng của `can-canh`: ảnh đẩy vào đều tới hết cảnh, có cú cắt thứ hai giữa cảnh (dùng ảnh cuối của mẫu đầu, mẫu cần từ 3 ảnh), giá thuê chữ lớn màu champagne, hiện câu `cau` của mẫu đầu.
- Ảnh giữ lâu ở cuối mỗi dải cắt không còn đứng yên (đẩy chậm đều).
- Sticker phí dịch vụ là viên đặc nền Rosé Nude, chữ Noir.
- Khung kết: bỏ tối dần ở 4 frame cuối, dòng nguồn ảnh lên trên cùng (ngoài vùng giao diện app), `can-canh` dùng 1 ảnh lớn thay cho 3 ảnh để khác các bài khác.
- Mọi ví dụ ghi giá trị chiếc đầm đủ số (9.000.000đ), theo sổ tay ST025.

## Biến thể khuôn v2 (27/10/2026, để mỗi bài một vẻ, xem sổ tay ST028)

Trường thêm trong props v2 (đều tuỳ chọn):
- `flash`: false để bỏ chớp trắng giữa các cảnh (cắt thẳng, ảnh vẫn đẩy vào).
- `ket`: "ba" (3 ảnh), "mot" (1 ảnh lớn), "chu" (chỉ chữ trên nền Noir). Mặc định can-canh "mot", còn lại "ba".
- `dichVuKieu`: "chu" (chữ đè ảnh tối, mặc định) hoặc "the" (thẻ Ivory bo 40px trên ảnh sáng, không đè thân váy).
- `nhan`: nhãn riêng của bài viết hoa, ví dụ "LẦN ĐẦU HÉ TỦ", hiện dưới logo suốt video.
- Mỗi mẫu: `soCat` (2–5 cú cắt, dùng để đủ độ dài mà không cần cảnh dịch vụ), `cauViTri` "tren" hoặc "duoi" (chỗ câu cảm giác).
Hai bài cùng kênh trong 7 ngày không dùng cùng bộ (format, flash, ket, dichVuKieu).
