# Khuôn video Chérie (Remotion)

Khuôn video dọc 1080x1920 đã được chủ tiệm duyệt ngày 26/10/2026 (bản "Hé lộ 3 chiếc đầu tiên", kiểm duyệt 9,1/10).

Cấu trúc: câu móc 2s, mỗi mẫu 3s (ảnh toàn thân rồi cận chi tiết, cắt theo nhịp 120 BPM), cảnh dịch vụ 3s, cảnh kết 2s.

Dùng:

    bash render.sh props.json ten-dau-ra

Xem `vi-du-props.json`. Ảnh có thể là URL https (script tự tải về). Đầu ra trong `out/`: bản không nhạc, bản có nhạc tự soạn (-14 LUFS), tấm ghép khung để kiểm duyệt.
