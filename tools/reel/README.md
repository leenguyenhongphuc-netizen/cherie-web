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

## Biến thể thêm 30/10/2026 (Agent Kiểm lỗi, theo KHUON-ND001 và KHUON-ND003)

Trường mới trong props v2, đều tuỳ chọn; bỏ trống thì video dựng như cũ:
- `mau`: "kv" dùng bảng màu key visual tháng: khối chữ hook, thẻ tên, câu cảm giác nằm trên thẻ Ivory bo 40px, chữ Noir, giá Ruby, bỏ lớp tối; nhãn bài thành viên Rosé Nude; khung kết `ket: "chu"` thành nền Ivory với mảng Rosé Nude bo 40px. Dùng khi kế hoạch tháng đòi key visual sáng.
- `theViTri`: "tren" hoặc "duoi" (mặc định) cho thẻ tên và giá ở dải cắt và cảnh lộ dáng của can-canh; mỗi mẫu có thể đè riêng bằng `theViTri` của mẫu. Thẻ ở trên thì câu cảm giác tự xuống dưới. Dùng khi ảnh có phông trống phía trên hoặc thân váy là chi tiết cần thấy.
- `theKieu`: "gon" cho thẻ 2 dòng thấp (dáng · size, rồi tên và viên giá một hàng), ít đè thân váy hơn thẻ 3 dòng.
- `theVao`: "dap" cho thẻ có ngay ở khung đầu của mỗi dải và đập vào theo phách, không trượt mờ dần.
- `hookLon`: "top" (chỉ can-canh) cho dòng hookTop làm chữ lớn nhất, ví dụ hookTop "9.000.000đ", hookBig "Đoán giá thuê?" thành dòng nghiêng nhỏ.
- `gach`: false (lat-gia) bỏ vạch gạch con số giá trị, để không bị hiểu là giảm giá. Con số giá trị giờ tự thu cỡ cho vừa bề ngang, không tràn mép phải nữa.
- `chonNen`: số px (chon-1), ví dụ 640: mảng nền trơn phía trên ba dải ảnh (Noir, hoặc Ivory khi `mau: "kv"`), chữ hook và "Nàng chọn số mấy?" nằm trên mảng này, không đè đầu người mẫu; ba dải bo 40px.
- `soNgay`: true (chon-1) cho số 1-2-3 có ngay ở khung 0,0s.
- Mỗi mẫu: `nhip` là mảng số frame của từng cú cắt (ví dụ [6,10,5,16]; 30 frame = 1 giây), thay công thức cố định "soCat ảnh 8 frame rồi giữ", để mỗi mẫu một nhịp. Cú cuối dài hơn 16 frame thì có trượt lộ dáng.

Sửa thẳng (mọi video): viên số 1/2/3 của chon-1 hạ xuống y 240 (trước 150, lấn vùng 220px trên); nhãn bài 30px (trước 22px); dòng dáng · size 30px có bóng chữ để đọc được trên đầm sáng.
Ví dụ: `vi-du-kv-lat-gia.json` (lat-gia, kv, gach false, theKieu gon, theVao dap, nhip) và `vi-du-kv-chon-1.json` (chon-1, kv, chonNen 640, soNgay).
