/* Chérie: dữ liệu dùng chung cho app Quầy và app Stylist */
(function(){
"use strict";
const TABLES=["kh","sp","nhom","don","ct","thu","dy","trips","log","chiphi","yc","lead","kehoach","noidung","review","nhap","anh","nv","hd","cccd","blog","banner","bb"];
const STORE=(window.CHERIE&&window.CHERIE.pub)?"cherie-pub-v1":"cherie-prod-v1";/* website công khai dùng bộ nhớ riêng, không lẫn với app nhân sự *//* bản chính thức: không dùng chung bộ nhớ với bản demo */
function seed(){return gen(base())}
function base(){return {
 kh:[
  {id:"KH001",ten:"Nguyễn Thảo Linh",sdt:"0900000001",zalo:true,ig:"@thaolinh.dn",email:"linh@example.com",sinh:"1998-03-14",tp:"Đà Nẵng",nguon:"Instagram",gt:"",ma:"CHERIE-LINH",size:"M",do:{nguc:86,eo:66,mong:92,cao:162},dang:"Đồng hồ cát",mau:"Đỏ rượu, đen",pc:"Quyến rũ",goi:"2026-11-30",diemCong:30,ruiRo:false,note:"Hay đặt cho cả nhóm bạn đi cưới"},
  {id:"KH002",ten:"Trần Minh Anh",sdt:"0900000002",zalo:true,ig:"@minhanh",email:"",sinh:"2000-11-02",tp:"Đà Nẵng",nguon:"Giới thiệu",gt:"KH001",ma:"CHERIE-MINHANH",size:"S",do:{nguc:80,eo:60,mong:86,cao:158},dang:"Chữ nhật",mau:"Pastel, trắng",pc:"Thanh lịch",goi:"",diemCong:0,ruiRo:false,note:""},
  {id:"KH003",ten:"Lê Hoàng Vy",sdt:"0900000003",zalo:true,ig:"@vyvy.travel",email:"vy@example.com",sinh:"1996-07-21",tp:"Hà Nội",nguon:"TikTok",gt:"",ma:"CHERIE-VY",size:"M",do:{nguc:88,eo:68,mong:94,cao:165},dang:"Quả lê",mau:"Champagne, xanh navy",pc:"Sang trọng",goi:"",diemCong:30,ruiRo:false,note:"Quay lại Đà Nẵng tháng 11"},
  {id:"KH004",ten:"Phạm Ngọc Hân",sdt:"0900000004",zalo:true,ig:"",email:"",sinh:"2001-10-29",tp:"TP. Hồ Chí Minh",nguon:"Khách sạn đối tác",gt:"",ma:"CHERIE-HAN",size:"S",do:{nguc:82,eo:62,mong:88,cao:160},dang:"Chữ nhật",mau:"Hồng, đỏ",pc:"Cá tính",goi:"",diemCong:0,ruiRo:false,note:""},
  {id:"KH005",ten:"Emma Laurent",sdt:"",zalo:false,ig:"@emma.l",email:"emma@example.com",sinh:"1995-05-09",tp:"Paris",nguon:"Instagram",gt:"",ma:"CHERIE-EMMA",size:"M",do:{nguc:87,eo:67,mong:93,cao:170},dang:"Đồng hồ cát",mau:"Champagne, bạc",pc:"Sang trọng",goi:"",diemCong:0,ruiRo:false,note:"Khách quốc tế, liên hệ qua email"},
  {id:"KH006",ten:"Võ Thu Trang",sdt:"0900000006",zalo:true,ig:"@trangvo",email:"",sinh:"1997-12-03",tp:"Đà Nẵng",nguon:"Giới thiệu",gt:"KH001",ma:"CHERIE-TRANG",size:"L",do:{nguc:92,eo:72,mong:98,cao:166},dang:"Quả lê",mau:"Xanh ngọc, navy",pc:"Thanh lịch",goi:"",diemCong:0,ruiRo:false,note:""},
  {id:"KH007",ten:"Đỗ Khánh Ly",sdt:"0900000007",zalo:false,ig:"",email:"",sinh:"",tp:"Đà Nẵng",nguon:"Giới thiệu",gt:"KH001",ma:"CHERIE-LY",size:"S",do:null,dang:"",mau:"",pc:"",goi:"",diemCong:0,ruiRo:false,note:"Người mặc trong nhóm, chờ khách tự xác nhận đồng ý"},
  {id:"KH008",ten:"Bùi Khánh Nhi",sdt:"0900000008",zalo:true,ig:"@khanhnhi",email:"nhi@example.com",sinh:"1993-02-18",tp:"Đà Nẵng",nguon:"Instagram",gt:"",ma:"CHERIE-NHI",size:"M",do:{nguc:85,eo:64,mong:90,cao:163},dang:"Đồng hồ cát",mau:"Bạc, đỏ rượu, đen",pc:"Sang trọng",goi:"",diemCong:60,ruiRo:false,note:"Hay thuê dạ tiệc công ty"}
 ],
 sp:[
  {id:"CH-DT-001-M",ten:"Bordeaux Bustier",mo:"lụa cúp ngực",loai:"Đầm dài",size:"M",mau:"Đỏ rượu",pc:"Quyến rũ",gia:250000,coc:500000,tt:"Sẵn sàng",giat:1,von:700000,markup:0.8,co:"Ôm sát"},
  {id:"CH-LX-001-M",ten:"Champagne Fendue",mo:"satin xẻ tà",loai:"Đầm dài",size:"M",mau:"Champagne",pc:"Sang trọng",gia:600000,coc:1000000,tt:"Đang thuê",giat:1,von:4000000,markup:0.6,co:"Co giãn nhẹ"},
  {id:"CH-TK-001-S",ten:"Noir Halter",mo:"nhung cổ yếm",loai:"Đầm ngắn",size:"S",mau:"Đen",pc:"Quyến rũ",gia:190000,coc:400000,tt:"Sẵn sàng",giat:1,von:500000,markup:0.8,co:"Co giãn nhẹ"},
  {id:"CH-TK-002-S",ten:"Rosé Voile",mo:"voan pastel",loai:"Đầm ngắn",size:"S",mau:"Hồng pastel",pc:"Thanh lịch",gia:150000,coc:300000,tt:"Đang thuê",giat:1,von:350000,markup:0.8,co:"Dây chỉnh / suông"},
  {id:"CH-LX-002-M",ten:"Argent Étoile",mo:"sequin bạc",loai:"Đầm dài",size:"M",mau:"Bạc",pc:"Cá tính",gia:900000,coc:1500000,tt:"Sẵn sàng",giat:2,von:6000000,markup:0.6,co:"Ôm sát"},
  {id:"CH-BC-001-S",ten:"Blanc Bouffant",mo:"tơ tay phồng",loai:"Đầm midi",size:"S",mau:"Trắng",pc:"Thanh lịch",gia:130000,coc:300000,tt:"Đang thuê",giat:1,von:350000,markup:0.8,co:"Dây chỉnh / suông"},
  {id:"CH-DT-002-L",ten:"Marine Sirène",mo:"đuôi cá navy",loai:"Đầm dài",size:"L",mau:"Xanh navy",pc:"Sang trọng",gia:260000,coc:500000,tt:"Đang giặt",giat:1,von:750000,markup:0.8,co:"Ôm sát"},
  {id:"CH-TK-003-S",ten:"Rouge Frange",mo:"tua rua đỏ",loai:"Đầm ngắn",size:"S",mau:"Đỏ",pc:"Cá tính",gia:220000,coc:400000,tt:"Sẵn sàng",giat:1,von:600000,markup:0.8,co:"Co giãn nhẹ"},
  {id:"CH-TK-004-L",ten:"Jade Soie",mo:"lụa xanh ngọc",loai:"Đầm ngắn",size:"L",mau:"Xanh ngọc",pc:"Thanh lịch",gia:180000,coc:400000,tt:"Sẵn sàng",giat:1,von:450000,markup:0.8,co:"Dây chỉnh / suông"},
  {id:"CH-TK-005-M",ten:"Noir Corset",mo:"corset đen",loai:"Đầm ngắn",size:"M",mau:"Đen",pc:"Quyến rũ",gia:230000,coc:500000,tt:"Sửa",giat:1,von:650000,markup:0.8,co:"Ôm sát"},
  {id:"CH-DT-003-M",ten:"Émeraude Satin",mo:"satin xanh lục, vai trễ",loai:"Đầm dài",size:"M",mau:"Xanh lục",pc:"Sang trọng",gia:240000,coc:500000,tt:"Sẵn sàng",giat:1,von:700000,markup:0.8,co:"Co giãn nhẹ"},
  {id:"CH-CW-001-M",ten:"Ivoire Dentelle",mo:"ren ngà dáng suông",loai:"Đầm midi",size:"M",mau:"Ngà",pc:"Thanh lịch",gia:200000,coc:400000,tt:"Sẵn sàng",giat:1,von:500000,markup:0.8,co:"Dây chỉnh / suông"},
  {id:"CH-BC-002-M",ten:"Azur Lin",mo:"linen xanh biển, xẻ tà",loai:"Đầm midi",size:"M",mau:"Xanh biển",pc:"Thanh lịch",gia:140000,coc:300000,tt:"Sẵn sàng",giat:1,von:350000,markup:0.8,co:"Dây chỉnh / suông"},
  {id:"CH-PR-001-S",ten:"Lilas Tulle",mo:"tulle tím nhạt",loai:"Đầm xoè",size:"S",mau:"Tím nhạt",pc:"Cá tính",gia:160000,coc:300000,tt:"Sẵn sàng",giat:1,von:400000,markup:0.8,co:"Co giãn nhẹ"}
 ],
 nhom:[{id:"N001",ten:"Hội bạn cưới Linh",truong:"KH001"}],
 don:[
  {id:"D001",dat:"KH003",nhom:"",dip:"Chụp ảnh du lịch",nhan:"2026-04-20T08:00",tra:"2026-04-20T20:00",traTT:"2026-04-20T19:30",tt:"Đã trả",coc:1000000,hinhThuc:"Chuyển khoản",ttCoc:"Đã hoàn",phi:0,note:""},
  {id:"D002",dat:"KH001",nhom:"N001",dip:"Cưới",nhan:"2026-09-13T15:00",tra:"2026-09-15T12:00",traTT:"2026-09-15T11:00",tt:"Đã trả",coc:1200000,hinhThuc:"Chuyển khoản",ttCoc:"Đã hoàn",phi:0,note:""},
  {id:"D003",dat:"KH006",nhom:"",dip:"Sự kiện",nhan:"2026-07-04T15:00",tra:"2026-07-06T12:00",traTT:"2026-07-06T20:00",tt:"Đã trả",coc:500000,hinhThuc:"Tiền mặt",ttCoc:"Đã hoàn",phi:100000,note:"Trả trễ 8 giờ"},
  {id:"D004",dat:"KH006",nhom:"",dip:"Tiệc",nhan:"2026-09-26T15:00",tra:"2026-09-28T12:00",traTT:"2026-09-29T10:00",tt:"Đã trả",coc:400000,hinhThuc:"Chuyển khoản",ttCoc:"Hoàn một phần",phi:100000,note:"Trả trễ 1 ngày, rách đường may"},
  {id:"D005",dat:"KH008",nhom:"",dip:"Cưới",nhan:"2026-06-20T15:00",tra:"2026-06-22T12:00",traTT:"2026-06-22T11:30",tt:"Đã trả",coc:2500000,hinhThuc:"Chuyển khoản",ttCoc:"Đã hoàn",phi:0,note:""},
  {id:"D006",dat:"KH008",nhom:"",dip:"Sự kiện",nhan:"2026-08-08T15:00",tra:"2026-08-10T12:00",traTT:"2026-08-10T12:00",tt:"Đã trả",coc:1000000,hinhThuc:"Chuyển khoản",ttCoc:"Hoàn một phần",phi:0,note:"Gãy gọng corset CH-TK-005-M"},
  {id:"D007",dat:"KH008",nhom:"",dip:"Gala công ty",nhan:"2026-10-03T15:00",tra:"2026-10-05T12:00",traTT:"2026-10-05T10:00",tt:"Đã trả",coc:3000000,hinhThuc:"Chuyển khoản",ttCoc:"Đã hoàn",phi:0,note:""},
  {id:"D008",dat:"KH002",nhom:"",dip:"Tiệc",nhan:"2026-10-22T15:00",tra:"2026-10-24T12:00",traTT:"",tt:"Đang thuê",coc:300000,hinhThuc:"Chuyển khoản",ttCoc:"Đang giữ",phi:0,note:""},
  {id:"D009",dat:"KH005",nhom:"",dip:"Chụp ảnh du lịch",nhan:"2026-10-23T08:00",tra:"2026-10-23T18:00",traTT:"",tt:"Đang thuê",coc:1000000,hinhThuc:"Chuyển khoản",ttCoc:"Đang giữ",phi:0,note:"Khách quốc tế"},
  {id:"D010",dat:"KH004",nhom:"",dip:"Chụp ảnh du lịch",nhan:"2026-10-21T09:00",tra:"2026-10-22T18:00",traTT:"",tt:"Đang thuê",coc:300000,hinhThuc:"Tiền mặt",ttCoc:"Đang giữ",phi:0,note:""},
  {id:"D011",dat:"KH001",nhom:"N001",dip:"Cưới",nhan:"2026-10-24T15:00",tra:"2026-10-26T12:00",traTT:"",tt:"Đã đặt",coc:1300000,hinhThuc:"Chuyển khoản",ttCoc:"Đang giữ",phi:0,note:"3 người mặc"},
  {id:"D012",dat:"KH003",nhom:"",dip:"Chụp ảnh du lịch",nhan:"2026-11-08T08:00",tra:"2026-11-08T20:00",traTT:"",tt:"Đã đặt",coc:0,hinhThuc:"",ttCoc:"Chưa cọc",phi:0,note:"Khách du lịch quay lại"}
 ],
 ct:[
  ["CT001","D001","KH003","CH-LX-001-M",600000,false,"",0],["CT002","D002","KH001","CH-DT-001-M",250000,false,"",0],["CT003","D002","KH002","CH-TK-002-S",150000,false,"",0],["CT004","D002","KH006","CH-TK-004-L",180000,false,"",0],["CT005","D003","KH006","CH-DT-002-L",260000,false,"",0],["CT006","D004","KH006","CH-TK-004-L",180000,true,"Rách nhẹ đường may hông",150000],["CT007","D005","KH008","CH-LX-002-M",900000,false,"",0],["CT008","D005","KH008","CH-LX-001-M",600000,false,"",0],["CT009","D006","KH008","CH-DT-001-M",250000,false,"",0],["CT010","D006","KH008","CH-TK-005-M",230000,true,"Gãy gọng corset",300000],["CT011","D007","KH008","CH-LX-002-M",900000,false,"",0],["CT012","D007","KH008","CH-LX-001-M",600000,false,"",0],["CT013","D007","KH008","CH-DT-001-M",250000,false,"",0],["CT014","D008","KH002","CH-TK-002-S",150000,false,"",0],["CT015","D009","KH005","CH-LX-001-M",600000,false,"",0],["CT016","D010","KH004","CH-BC-001-S",130000,false,"",0],["CT017","D011","KH001","CH-DT-001-M",250000,false,"",0],["CT018","D011","KH002","CH-TK-001-S",190000,false,"",0],["CT019","D011","KH007","CH-TK-003-S",220000,false,"",0],["CT020","D012","KH003","CH-LX-002-M",900000,false,"",0]
 ].map(a=>({id:a[0],don:a[1],mac:a[2],sp:a[3],gia:a[4],hu:a[5],moTa:a[6],phiHu:a[7]})),
 thu:[["T001","2026-10-20","KH004","CH-TK-001-S",false,"Chật"],["T002","2026-10-20","KH004","CH-BC-001-S",true,""],["T003","2026-10-20","KH004","CH-TK-002-S",false,"Màu"],["T004","2026-10-22","KH001","CH-LX-002-M",false,"Giá"],["T005","2026-10-22","KH001","CH-DT-001-M",true,""],["T006","2026-10-22","KH007","CH-TK-001-S",false,"Kiểu"],["T007","2026-10-22","KH007","CH-TK-003-S",true,""],["T008","2026-10-22","KH002","CH-TK-001-S",true,""],["T009","2026-10-22","KH005","CH-LX-002-M",false,"Giá"],["T010","2026-10-22","KH005","CH-LX-001-M",true,""]].map(a=>({id:a[0],ngay:a[1],kh:a[2],sp:a[3],chon:a[4],lyDo:a[5]})),
 dy:[["KH001","Số đo & gu","Đồng ý","2026-05-02T10:15","Form tại quầy"],["KH001","Nhận ưu đãi","Đồng ý","2026-05-02T10:15","Form tại quầy"],["KH001","Ảnh mạng xã hội","Đồng ý","2026-09-16T09:00","Zalo OA"],["KH002","Số đo & gu","Đồng ý","2026-06-10T14:00","Form tại quầy"],["KH002","Nhận ưu đãi","Rút lại","2026-09-20T20:30","Zalo OA"],["KH003","Số đo & gu","Đồng ý","2026-04-18T16:00","Form đặt lịch"],["KH003","Nhận ưu đãi","Đồng ý","2026-04-18T16:00","Form đặt lịch"],["KH003","Ảnh quảng cáo","Đồng ý","2026-04-21T11:00","Zalo OA"],["KH004","Số đo & gu","Đồng ý","2026-10-20T10:00","Form tại quầy"],["KH005","Số đo & gu","Đồng ý","2026-10-22T15:00","Email"],["KH005","Ảnh mạng xã hội","Đồng ý","2026-10-22T15:00","Email"],["KH006","Số đo & gu","Đồng ý","2026-07-01T15:00","Form tại quầy"],["KH008","Số đo & gu","Đồng ý","2026-06-15T11:00","Form tại quầy"],["KH008","Nhận ưu đãi","Đồng ý","2026-06-15T11:00","Form tại quầy"]].map((a,i)=>({id:"DY"+String(i+1).padStart(3,"0"),kh:a[0],loai:a[1],tt:a[2],tg:a[3],kenh:a[4]}))
,
 trips:[
  {id:"C001",loai:"nhan",ngay:"2026-10-24",gio:"10:00",stylist:"Mai",kh:"KH002",don:"D008",noi:"Nhà khách · 45 Hà Bổng, Phước Mỹ",note:"Hạn trả 12:00. Khách hẹn gặp ở sảnh tòa nhà.",tt:"Chưa đi",step:0,d:{}},
  {id:"C002",loai:"thu",ngay:"2026-10-24",gio:"14:00",stylist:"Mai",kh:"KH003",don:"",noi:"InterContinental Sơn Trà · phòng 1806",dip:"Chụp ảnh du lịch",dungNhan:"2026-10-25T08:00",dungTra:"2026-10-25T20:00",nganSach:900000,note:"Thích champagne, xanh navy. Dáng quả lê, size M. Chụp bán đảo Sơn Trà sáng 25/10.",tt:"Chưa đi",step:0,d:{}},
  {id:"C003",loai:"giao",ngay:"2026-10-24",gio:"15:00",stylist:"Mai",kh:"KH001",don:"D011",noi:"Nhà khách · 12 An Thượng 2, Mỹ An",note:"Nhóm 3 người đi cưới 25/10. Ký biên bản với chị Linh (người đặt).",tt:"Chưa đi",step:0,d:{}}
 ],
 log:[],
 kehoach:[
  {id:"KH-T44",loai:"Tuần",ky:"26/10 – 01/11/2026",tu:"2026-10-26",den:"2026-11-01",giaiDoan:"Giai đoạn 1 · Chuẩn bị (24/10–15/11)",tt:"Chờ chủ duyệt",tao:"2026-10-24T07:10",vong:1,phanHoi:"",
   mucTieu:["Tạo đủ 4 kênh cùng tên Chérie trước 31/10","Quay 6 video kho cho đợt đăng từ 16/11","Hẹn gặp 5 khách sạn Võ Nguyên Giáp và 2 studio"],
   items:[
    {id:"I1",ngay:"2026-10-28",kenh:"TikTok/Reels",dinhDang:"Video 30 giây",chuDe:"Hậu trường như mới",angle:"Vệ sinh 5 bước",mau:["CH-DT-001-M"]},
    {id:"I2",ngay:"2026-10-28",kenh:"TikTok/Reels",dinhDang:"Video 28 giây",chuDe:"Một bộ, ba cách mix",angle:"Phối đồ",mau:["CH-TK-001-S","CH-TK-004-L"]},
    {id:"I3",ngay:"2026-10-29",kenh:"TikTok/Reels",dinhDang:"Video 32 giây",chuDe:"Thử đồ theo dáng",angle:"Tư vấn dáng",mau:["CH-TK-001-S","CH-TK-004-L","CH-DT-002-L"]},
    {id:"I4",ngay:"2026-10-30",kenh:"TikTok/Reels",dinhDang:"Video 30 giây",chuDe:"Đoán giá",angle:"Giá công khai",mau:["CH-LX-002-M"]},
    {id:"I5",ngay:"2026-10-31",kenh:"TikTok/Reels",dinhDang:"Video 30 giây",chuDe:"Đi cưới không đụng hàng",angle:"Mùa cưới",mau:["CH-TK-004-L","CH-DT-001-M","CH-TK-003-S","CH-LX-002-M"]},
    {id:"I6",ngay:"2026-11-01",kenh:"Zalo OA",dinhDang:"Tin chào mừng",chuDe:"Chào mừng danh sách chờ",angle:"Voucher khai trương",mau:[]}],
   review:{diem:8.6,ai:"Agent Đánh giá",nhanXet:["Đủ 3 mốc checklist hạn 31/10, lịch quay theo ánh sáng hợp lý.","Video Đoán giá quay ngoài trời chiều tối, tháng 10 Đà Nẵng mưa nhiều: cần phương án trong nhà.","Hai video đầu chưa có người mẫu size L, chưa đủ đa dạng dáng người theo brand guideline."],sua:["Thêm phương án quay trong nhà cho video Đoán giá.","Video Một bộ, ba cách mix thêm Jade Soie size L."]}}
 ],
 noidung:[
  {id:"ND001",kh:"KH-T44",ngay:"2026-10-28",dang:"2026-11-17",kenh:"TikTok/Reels",dinhDang:"Video 30 giây",chuDe:"Hậu trường như mới",angle:"Vệ sinh 5 bước",mau:["CH-DT-001-M"],tt:"Chờ duyệt cuối",vong:1,phanHoi:"",
   ban:{hook:"Cận cảnh hơi nước phun từ máy hấp. Chữ: Đồ thuê có sạch không?",canh:[["0–3s","Hơi nước phun, quay chậm","Đồ thuê có sạch không?"],["3–8s","Tay đeo găng kiểm đường may, lớp lót","1. Kiểm từng đường may"],["8–13s","Đầm vào túi giặt riêng","2. Giặt riêng từng chiếc"],["13–18s","Hấp từ trên xuống, quay chậm tà váy","3. Hấp phẳng"],["18–22s","Xịt khử khuẩn, góc ngang","4. Khử khuẩn"],["22–28s","Gấp vào túi niêm phong, cận tem ngày","5. Niêm phong. Nàng tự tay xé tem."],["28–32s","Treo lên giá, lùi máy","Chérie · Đồ luôn như mới"]],
    caption:"Đồ thuê có sạch không? Câu nàng hỏi nhiều nhất, tụi mình trả lời bằng 5 bước. Mỗi chiếc đầm giặt riêng, hấp, khử khuẩn và niêm phong có tem ngày. Bordeaux Bustier 250k/lượt, cọc 500k, hoàn trong 24h. (khi đăng thêm emoji: lấp lánh, tim trắng)",
    hashtag:["Chérie","CherieGirl","ThueDamNhaTrang"],cta:"Còn thắc mắc gì về vệ sinh, comment để tụi mình trả lời bằng video.",
    quay:"Ánh sáng cửa sổ buổi sáng, nền Ivory, góc ngang ngực; cảnh treo giá dùng đèn vàng ấm.",anh:"Close-up of a wine-red silk bustier gown in a clear sealed garment bag with a cream label showing the cleaning date, warm window light, ivory background, editorial still life, vertical 9:16."},
   qa:{diem:9.3,ai:"Agent Kiểm duyệt",tieuChi:[["Giọng thương hiệu",9,"Xưng tụi mình, gọi nàng"],["Hook 3 giây",9,"Câu hỏi đúng nỗi lo của khách"],["Đúng kế hoạch và giai đoạn",10,"Video kho giai đoạn 1"],["Giá và thông tin rõ",10,"Có giá, cọc, thời gian hoàn"],["Màu và bố cục",9,"Nền Ivory, đầm Ruby là điểm nhấn"],["Ảnh và video",9,"Cận chất liệu, chuyển động chậm"],["Không vi phạm",10,"Không nhạc bản quyền, không từ cấm"],["Lời kêu gọi",9,"Comment để hỏi"],["Mẫu có thật và trống lịch",10,"CH-DT-001-M sẵn sàng"],["Chính tả và độ dài",8,"Caption 52 chữ, hợp TikTok"]],canSua:[]},
   lichSu:[["2026-10-24T07:40","Agent Sản xuất","Tạo bản 1"],["2026-10-24T07:42","Agent Kiểm duyệt","9,3/10 · đạt"]]},
  {id:"ND002",kh:"KH-T44",ngay:"2026-10-31",dang:"2026-11-19",kenh:"TikTok/Reels",dinhDang:"Video 30 giây",chuDe:"Đi cưới không đụng hàng",angle:"Mùa cưới",mau:["CH-TK-004-L","CH-DT-001-M","CH-TK-003-S","CH-LX-002-M"],tt:"Cần sửa (AI)",vong:1,phanHoi:"",
   ban:{hook:"4 tấm thiệp cưới xoè trên bàn. Chữ: Tháng này 4 đám cưới, mình không mặc lại bộ nào",canh:[["0–3s","4 thiệp cưới xoè trên bàn","Tháng này 4 đám cưới"],["3–8s","Xoay người trong Jade Soie","Cưới đồng nghiệp – Jade Soie"],["8–13s","Bordeaux Bustier, bước về phía máy","Cưới bạn thân – Bordeaux Bustier"],["13–18s","Rouge Frange, tua rua chuyển động","Cưới em họ – Rouge Frange"],["18–23s","Argent Étoile, đèn flash","Tiệc tối – Argent Étoile"],["23–30s","Màn hình chia đôi","Thuê 4 bộ: 1.550.000đ / Mua 4 bộ: [điền giá]"]],
    caption:"Mùa cưới Đà Nẵng, mỗi đám một chiếc đầm mới, không ai biết nàng đi thuê. Không đụng hàng, không đụng ví.",hashtag:["Chérie","ThueDamDiCuoi"],cta:"Lưu lại cho mùa cưới.",quay:"Trong nhà, đèn vàng ấm và flash trực diện cho cảnh tiệc tối.",anh:"Four wedding invitation cards fanned on a dark table, warm lamp light, editorial, vertical 9:16."},
   qa:{diem:8.2,ai:"Agent Kiểm duyệt",tieuChi:[["Giọng thương hiệu",8,"Caption chưa xưng tụi mình"],["Hook 3 giây",9,"Tốt"],["Đúng kế hoạch và giai đoạn",9,""],["Giá và thông tin rõ",6,"Còn chỗ trống [điền giá], thiếu cọc"],["Màu và bố cục",9,""],["Ảnh và video",9,"Có chuyển động tua rua"],["Không vi phạm",10,""],["Lời kêu gọi",7,"CTA yếu, chưa dẫn về Zalo"],["Mẫu có thật và trống lịch",8,"Kiểm lịch CH-LX-002-M ngày quay"],["Chính tả và độ dài",7,"Thiếu hashtag CherieGirl"]],canSua:["Thay [điền giá] bằng giá mua tham khảo hoặc bỏ so sánh","Caption xưng tụi mình, thêm giá từng bộ và cọc","CTA: Inbox Zalo để giữ lịch mùa cưới"]},
   lichSu:[["2026-10-24T07:45","Agent Sản xuất","Tạo bản 1"],["2026-10-24T07:47","Agent Kiểm duyệt","8,2/10 · trả về sửa"]]},
  {id:"ND003",kh:"KH-T44",ngay:"2026-10-28",dang:"2026-11-20",kenh:"TikTok/Reels",dinhDang:"Video 28 giây",chuDe:"Một bộ, ba cách mix",angle:"Phối đồ",mau:["CH-TK-001-S","CH-TK-004-L"],tt:"Đã duyệt",vong:1,phanHoi:"",
   ban:{hook:"Đầm đen treo trên móc, đèn rọi. Chữ: Một chiếc đầm đen, ba bữa tiệc",canh:[["0–3s","Đầm đen dưới đèn rọi","Một chiếc đầm đen, ba bữa tiệc"],["3–10s","Khoác blazer, cầm clutch","YEP công ty: thêm blazer"],["10–17s","Khăn choàng lụa, khuyên ngọc trai","Đi cưới: thêm khăn choàng"],["17–24s","Tóc buông, khuyên to","Date night: đổi phụ kiện"],["24–28s","Ba khung ghép","Một lần thuê, ba lần slay"]],
    caption:"Một chiếc Noir Halter, ba bữa tiệc, ba phong cách. Thuê 190k/lượt, cọc 400k. Stylist tụi mình phối sẵn phụ kiện cho nàng. (khi đăng thêm emoji: lấp lánh)",hashtag:["Chérie","CherieGirl","PhoiDo"],cta:"Comment MIX để nhận lookbook phối đồ.",quay:"Trong nhà, flash trực diện, góc thấp ngang hông.",anh:""},
   qa:{diem:9.1,ai:"Agent Kiểm duyệt",tieuChi:[["Giọng thương hiệu",9,""],["Hook 3 giây",9,""],["Đúng kế hoạch và giai đoạn",9,""],["Giá và thông tin rõ",10,""],["Màu và bố cục",9,""],["Ảnh và video",9,""],["Không vi phạm",10,""],["Lời kêu gọi",9,""],["Mẫu có thật và trống lịch",9,""],["Chính tả và độ dài",8,""]],canSua:[]},
   lichSu:[["2026-10-24T07:50","Agent Kiểm duyệt","9,1/10 · đạt"],["2026-10-24T08:05","Chủ tiệm","Duyệt cuối"]]},
  {id:"ND004",kh:"KH-T44",ngay:"2026-10-30",dang:"2026-11-21",kenh:"TikTok/Reels",dinhDang:"Video 30 giây",chuDe:"Đoán giá",angle:"Giá công khai",mau:["CH-LX-002-M"],tt:"Chờ sản xuất",vong:0,phanHoi:"",lichSu:[]},
  {id:"ND005",kh:"KH-T44",ngay:"2026-10-29",dang:"2026-11-22",kenh:"TikTok/Reels",dinhDang:"Video 32 giây",chuDe:"Thử đồ theo dáng",angle:"Tư vấn dáng",mau:["CH-TK-001-S","CH-TK-004-L","CH-DT-002-L"],tt:"Chờ sản xuất",vong:0,phanHoi:"",lichSu:[]}
 ]
};}

/* Dữ liệu mẫu 4 tháng (01/7–17/10/2026) để báo cáo có số liệu. Sinh cố định theo hạt giống, lần nào cũng ra giống nhau. */
function gen(o){
  let a=20261212;const rnd=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  const pick=arr=>arr[Math.floor(rnd()*arr.length)];
  const pad=n=>String(n).padStart(2,"0");
  const ymd=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
  o.sp.forEach(s=>{s.von=s.von||s.gia*3;s.nhap=/-(DT-003|CW-001|BC-002|PR-001)-/.test(s.id)?"2026-09-20":"2026-06-20"});
  const ten=["Hồ Ngọc Diệp","Vũ Bảo Trâm","Đặng Thu Hà","Ngô Minh Châu","Lý Gia Hân","Trịnh Phương Thảo","Mai Anh Thư","Phan Ngọc Mai","Tô Khánh Linh","Lâm Thanh Vân","Đinh Hải Yến","Châu Mỹ Duyên"];
  const tp=["Đà Nẵng","Đà Nẵng","Đà Nẵng","TP. Hồ Chí Minh","Hà Nội","Đà Nẵng","Nha Trang","Đà Nẵng","TP. Hồ Chí Minh","Đà Nẵng","Hà Nội","Đà Nẵng"];
  const ng=["Instagram","TikTok","Giới thiệu","Khách sạn đối tác","TikTok","Đi ngang qua","Instagram","TikTok","Khách sạn đối tác","Giới thiệu","Instagram","TikTok"];
  const sz=["S","M","M","S","L","M","S","M","S","M","L","S"];
  ten.forEach((t,i)=>{const id="KH"+String(9+i).padStart(3,"0");o.kh.push({id,ten:t,sdt:"09000000"+String(9+i).padStart(2,"0"),zalo:i%4!==3,ig:"",email:"",sinh:"",tp:tp[i],nguon:ng[i],gt:ng[i]==="Giới thiệu"?"KH001":"",ma:"CHERIE-"+id,size:sz[i],do:null,dang:"",mau:"",pc:"",goi:"",diemCong:0,ruiRo:false,note:""})});
  const busy={};const dn=s=>Math.round(new Date(s+"T00:00")/864e5);
  const mark=(sp,a1,b1,g)=>{for(let d=a1;d<=b1+g;d++)busy[sp+"|"+d]=1};
  const free=(sp,a1,b1,g)=>{for(let d=a1;d<=b1+g;d++)if(busy[sp+"|"+d])return false;return true};
  o.don.forEach(d=>o.ct.filter(c=>c.don===d.id).forEach(c=>{const s=o.sp.find(x=>x.id===c.sp);mark(c.sp,dn(d.nhan.slice(0,10)),dn(d.tra.slice(0,10)),s.giat)}));
  const custs=o.kh.map(k=>k.id).filter(id=>id!=="KH005"&&id!=="KH007");
  const dips=["Cưới","Cưới","Cưới","Tiệc","Tiệc","Sự kiện","Chụp ảnh du lịch","Chụp ảnh du lịch","Gala công ty","Lễ/Tết"];
  const plan=[[2026,6,26],[2026,7,33],[2026,8,40],[2026,9,24]];
  let dId=13,cId=21;
  plan.forEach(([y,m,n])=>{const last=m===9?17:new Date(y,m+1,0).getDate();
    for(let i=0;i<n;i++){let day,tries=0,items=[];
      while(tries++<40){day=1+Math.floor(rnd()*last);const dt=new Date(y,m,day);if((dt.getDay()===0||dt.getDay()>=5)||rnd()<0.45)break}
      const nhan=new Date(y,m,day);const len=rnd()<0.6?1:2;const tra=new Date(y,m,day+len);
      const a1=dn(ymd(nhan)),b1=dn(ymd(tra));const want=rnd()<0.55?1:rnd()<0.75?2:3;
      const pool=o.sp.filter(s=>s.nhap<=ymd(nhan)&&s.id!=="CH-TK-005-M"||(s.id==="CH-TK-005-M"&&m<8));
      for(let k=0;k<20&&items.length<want;k++){const s=pick(pool);if(items.includes(s)||!free(s.id,a1,b1,s.giat))continue;items.push(s)}
      if(!items.length)continue;items.forEach(s=>mark(s.id,a1,b1,s.giat));
      const kh=pick(custs);const late=rnd()<0.12?2+Math.floor(rnd()*8):0;
      const traTT=new Date(tra);traTT.setHours(12+late-(late?0:Math.floor(rnd()*3)),late?0:30*Math.floor(rnd()*2));
      const id="D"+String(dId++).padStart(3,"0");let hu=0;
      items.forEach(s=>{const h=rnd()<0.07;const ph=h?(rnd()<0.7?100000:300000):0;hu+=ph;o.ct.push({id:"CT"+String(cId++).padStart(3,"0"),don:id,mac:kh,sp:s.id,gia:s.gia,hu:h,moTa:h?(ph===100000?"L2 Vết bẩn khó":"L3 Sút đường may, cần thợ"):"",phiHu:ph})});
      const phi=Math.min(late,24)*20000;const coc=items.reduce((x,s)=>x+s.coc,0);
      o.don.push({id,dat:kh,nhom:"",dip:pick(dips),nhan:ymd(nhan)+"T15:00",tra:ymd(tra)+"T12:00",traTT:ymd(traTT)+"T"+pad(traTT.getHours())+":"+pad(traTT.getMinutes()),tt:"Đã trả",coc,hinhThuc:rnd()<0.8?"Chuyển khoản":"Tiền mặt",ttCoc:phi||hu?"Hoàn một phần":"Đã hoàn",phi,note:late?`Trả trễ ${late} giờ`:""});
    }});
  const nOrders=m=>o.don.filter(d=>d.nhan.slice(5,7)===pad(m+1)).length;
  const cp=[];const add=(d,nhom,tien,note)=>cp.push({id:"CP"+String(cp.length+1).padStart(3,"0"),ngay:d,nhom,tien,note});
  add("2026-06-20","Nhập hàng",37700000,"10 mẫu đầu tiên");add("2026-09-20","Nhập hàng",11500000,"4 mẫu mới: Émeraude, Ivoire, Azur, Lilas");
  [[6,"07"],[7,"08"],[8,"09"],[9,"10"]].forEach(([m,mm])=>{const y="2026-"+mm+"-";
    add(y+"01","Mặt bằng",6500000,"Tiền thuê tháng "+(+mm));
    add(y+"05","Lương",mm==="10"?12000000:11000000,"Lương 2 nhân viên + phụ cấp stylist");
    add(y+"08","Marketing",[2500000,3500000,4000000,4500000][m-6],"Quảng cáo TikTok, Meta, KOC");
    add(y+"10","Điện nước, internet",1300000+Math.round(rnd()*4)*100000,"");
    add(y+"15","Vận chuyển",600000+nOrders(m)*35000,"Grab cho stylist giao, nhận đồ");
    add(y+(mm==="10"?"17":"28"),"Giặt hấp",nOrders(m)*75000,"Giặt hấp, khử khuẩn, túi niêm phong");
    add(y+"12","Bao bì, phụ kiện",500000+Math.round(rnd()*5)*100000,"Túi, tem niêm phong, móc treo")});
  o.chiphi=cp;o.yc=[];return o}

const db={};
function setTables(src){TABLES.forEach(t=>{db[t]=Array.isArray(src[t])?src[t]:[]})}
function loadLocal(){try{const s=localStorage.getItem(STORE);if(s){const o=JSON.parse(s);if(o&&o.v===1){setTables(o);return true}}}catch(e){}return false}
function saveLocal(){try{const o={v:1};TABLES.forEach(t=>o[t]=(t==="anh"||t==="hd"||t==="cccd"||t==="bb")?[]:db[t]);/* ảnh và CCCD không lưu trên máy *//* ảnh nặng, chỉ lưu trên máy chủ */localStorage.setItem(STORE,JSON.stringify(o))}catch(e){}}
if(!loadLocal())setTables({});/* bản chính thức: bắt đầu trống, không sinh dữ liệu mẫu */

function canon(v){if(Array.isArray(v))return"["+v.map(canon).join(",")+"]";if(v&&typeof v==="object")return"{"+Object.keys(v).filter(k=>v[k]!==undefined).sort().map(k=>JSON.stringify(k)+":"+canon(v[k])).join(",")+"}";return JSON.stringify(v===undefined?null:v)}
const clone=o=>JSON.parse(JSON.stringify(o));
const isObj=v=>v&&typeof v==="object"&&!Array.isArray(v);
/* cập nhật tại chỗ, giữ nguyên object lồng nhau để màn hình đang mở không bị mất tham chiếu */
function merge(t,src){Object.keys(t).forEach(k=>{if(!(k in src))delete t[k]});Object.keys(src).forEach(k=>{if(isObj(t[k])&&isObj(src[k]))merge(t[k],src[k]);else t[k]=src[k]})}
const SORT={log:(a,b)=>a.t<b.t?1:a.t>b.t?-1:(a.id<b.id?1:-1)};
const byIdAsc=(a,b)=>a.id<b.id?-1:a.id>b.id?1:0;

let remote=null,ready=false,empty=false,readOnly=false,state="local";
const last={},pend={},chains={},firstSeen={};
TABLES.forEach(t=>{last[t]={};pend[t]={}});
let changeCb=()=>{},statusCb=()=>{},timer=0;
function changed(){clearTimeout(timer);timer=setTimeout(()=>{saveLocal();try{changeCb()}catch(e){setTimeout(()=>{try{changeCb()}catch(_){}},400)}},60)}
function setState(s){state=s;try{statusCb(s)}catch(e){}}

function write(t,id,data){
  const key=t+"/"+id;pend[t][id]=(pend[t][id]||0)+1;
  const ref=remote.collection(t).doc(id);
  const run=()=>data?ref.set(data):ref.delete();
  const p=(chains[key]||Promise.resolve()).then(run)
    .catch(e=>{if(e&&e.code==="unavailable")return new Promise(r=>setTimeout(r,400+Math.random()*800)).then(run);throw e})
    .catch(fail)
    .finally(()=>{pend[t][id]--;if(pend[t][id]<=0)delete pend[t][id];if(chains[key]===p)delete chains[key]});
  chains[key]=p;
}
function fail(e){const c=e&&e.code;if(c==="invalid_argument"||c==="not_granted"||c==="revoked"){readOnly=true;setState("readonly")}else if(c==="quota_exceeded")setState("full");else setState("error")}
function push(){
  if(!remote||!ready||readOnly)return;
  TABLES.forEach(t=>{const seen=new Set();
    db[t].forEach(r=>{if(!r||!r.id)return;const id=String(r.id);seen.add(id);const j=canon(r);if(last[t][id]!==j){last[t][id]=j;write(t,id,clone(r))}});
    Object.keys(last[t]).forEach(id=>{if(!seen.has(id)){delete last[t][id];write(t,id,null)}})});
}
function apply(t,docs){
  const cur=new Map(db[t].map(r=>[String(r.id),r]));const out=[];const seen=new Set();
  docs.forEach(d=>{const x=d.data();if(!x)return;const id=d.id;seen.add(id);
    if(pend[t][id]){const l=cur.get(id);if(l)out.push(l);return}
    const j=canon(x);last[t][id]=j;const l=cur.get(id);
    if(l&&canon(l)===j){out.push(l);return}
    const data=clone(x);if(l){merge(l,data);out.push(l)}else out.push(data)});
  cur.forEach((r,id)=>{if(!seen.has(id)&&pend[t][id])out.push(r)});
  Object.keys(last[t]).forEach(id=>{if(!seen.has(id)&&!pend[t][id])delete last[t][id]});
  out.sort(SORT[t]||byIdAsc);db[t]=out;
}

async function connect(){
  const c=window.claude;if(!c||typeof c.use!=="function")return;
  let r=null;try{r=await c.use("db")}catch(e){r=null}
  if(!r)return;
  remote=r;setState("connecting");
  const firstDocs={};
  TABLES.forEach(t=>{
    r.collection(t).onSnapshot(snap=>{
      if(!ready&&!empty){if(snap.metadata&&snap.metadata.fromCache&&!snap.docs.length&&!firstSeen[t])return;firstDocs[t]=snap.docs;firstSeen[t]=true;
        if(TABLES.every(x=>firstSeen[x])){
          const total=TABLES.reduce((a,x)=>a+firstDocs[x].length,0);
          if(total===0){ready=true;setState(readOnly?"readonly":"live");changed()}
          else{TABLES.forEach(x=>apply(x,firstDocs[x]));ready=true;setState(readOnly?"readonly":"live");changed()}}
        return}
      if(empty&&!ready)return;
      apply(t,snap.docs);changed()},
    e=>{if(e&&e.code==="revoked"){readOnly=true;setState("readonly")}else setState("error")})});
}
window.addEventListener("storage",e=>{if(e.key===STORE&&!ready){if(loadLocal())changed()}});


/* ---------- quy tắc dùng chung cho mọi app ---------- */
/* Kinh tế từng bộ đầm. Benchmark ngành cho thuê đầm: một chiếc dùng được 20–30 lượt (lấy 25) hoặc khoảng 12 tháng trước khi lỗi mốt, cái nào đến trước;
   bán thanh lý thu lại khoảng 10% giá gốc. Chi phí mỗi lượt: giặt hấp 35k, bao bì và tem 5k, sửa nhỏ dự phòng 10k. Thuế 7% doanh thu. */
const KT={vongDoi:25,thangDung:12,thanhLy:0.10,cpLuot:50000,thue:0.07,luotThangGiaDinh:4,markupMin:0.5,markupMax:1,markupMacDinh:0.8};
const round10k=v=>Math.round(v/10000)*10000;
/* Giá trị hiển thị = giá gốc + markup, nhưng không bao giờ cao hơn giá niêm yết công khai của thương hiệu (khách tra được) */
function giaTri(sp){if(!sp||!(+sp.von>0))return 0;const m=Math.min(KT.markupMax,Math.max(KT.markupMin,sp.markup==null?KT.markupMacDinh:+sp.markup));let v=round10k(sp.von*(1+m));if(+sp.giaNiemYet>0)v=Math.min(v,round10k(+sp.giaNiemYet));return v}
function laiGop(gia){return gia-KT.cpLuot-gia*KT.thue}
function khauHaoLuot(sp){return (+sp.von||0)*(1-KT.thanhLy)/KT.vongDoi}
function kinhTe(sp,luotList,today){/* luotList: các dòng ct đã thuê (không tính đơn Hủy) của món này */
  const G=+sp.von||0,lg=laiGop(+sp.gia||0),kh=khauHaoLuot(sp);
  const luot=luotList.length,dong=luotList.reduce((a,c)=>a+laiGop(+c.gia||0)+(c.hu?+c.phiHu||0:0),0);
  const thang=Math.max(1,((today?new Date(today):new Date())-new Date((sp.nhap||"2026-06-01")+"T00:00"))/2629746000);
  const khTg=G*(1-KT.thanhLy)*Math.min(1,thang/KT.thangDung),khLuot=kh*luot,khLuyKe=Math.min(G*(1-KT.thanhLy),Math.max(khTg,khLuot));
  const nhip=luot/thang;const hoaVon=lg>0?Math.ceil(G/lg):Infinity;const conThieu=Math.max(0,hoaVon-luot);
  return {G,lg,kh,loiLuot:lg-kh,luot,dong,khLuyKe,conLai:G-khLuyKe,loiLuyKe:dong-khLuyKe,hoaVon,conThieu,nhip,
    thangConLai:conThieu===0?0:(nhip>0?Math.ceil(conThieu/nhip):Math.ceil(conThieu/KT.luotThangGiaDinh)),daHoaVon:dong>=G&&G>0,tyLeThue:G?(+sp.gia||0)/giaTri(sp):0}}
/* Gói Yên tâm: bảo vệ hư hỏng do chính Chérie bảo đảm (không phải hợp đồng của công ty bảo hiểm). */
const YEN_TAM={phi:20000,ten:"Gói Yên tâm",
  gom:["Vết bẩn khó giặt: rượu vang, son, kem nền, nước sốt","Sút chỉ, bung đường may, tuột khoá, rơi cúc hay hạt đính","Rách nhỏ cần thợ vá (dưới 3 cm), móc sợi"],
  khong:["Mất đồ hoặc hư nặng không sửa được: nàng đền 50% giá trị chiếc đầm thay vì 100%","Tự ý cắt, may sửa, nhuộm đầm","Trả trễ: vẫn tính 20.000đ mỗi giờ"]};
const MUC_HU=[["L0","Như mới",0],["L1","Bẩn nhẹ, giặt thường",0],["L2","Vết bẩn khó hoặc sút chỉ",100000],["L3","Rách, hỏng cần thợ",300000],["L4","Hư nặng hoặc mất",null]];
function phiHu(muc,sp,yenTam){const m=MUC_HU.find(x=>x[0]===muc);if(!m)return 0;if(muc==="L4"){const v=giaTri(sp)||(+sp.coc||0);return yenTam?Math.round(v*0.5):v}return yenTam?0:m[2]}
/* Gợi ý size từ số đo (cm, kg). Bảng size nữ Việt Nam, áp chung cho đầm của Chérie. */
const SIZES=["XS","S","M","L","XL"];
const BANG_SIZE={nguc:[80,84,88,94,100],eo:[62,66,70,76,82],mong:[86,90,94,100,106],nang:[45,50,56,63,70]};
function idxTheo(v,arr){if(!(v>0))return -1;for(let i=0;i<arr.length;i++)if(v<=arr[i])return i;return arr.length-1}
function goiYSize(d){d=d||{};const by={};["nguc","eo","mong"].forEach(k=>{const i=idxTheo(+d[k],BANG_SIZE[k]);if(i>=0)by[k]=i});
  let idx=-1,tu="";const ks=Object.keys(by);
  if(ks.length){idx=Math.max(...ks.map(k=>by[k]));tu="số đo"}
  else if(+d.nang>0){idx=idxTheo(+d.nang,BANG_SIZE.nang);if(+d.cao>=168&&idx<4)idx++;tu="chiều cao, cân nặng"}
  if(idx<0)return null;
  const lech=ks.length>1?Math.max(...ks.map(k=>by[k]))-Math.min(...ks.map(k=>by[k])):0;
  return {size:SIZES[idx],idx,tu,lech,ghiChu:lech>=2?"Số đo ba vòng chênh nhau hai size: nên chọn mẫu dây chỉnh, co giãn hoặc dáng suông.":""}}
function doVua(sp,g){/* "vua" | "co-the" | "khong" | null khi chưa có số đo */
  if(!g||!sp)return null;const d=SIZES.indexOf(sp.size)-g.idx;const co=sp.co||"Co giãn nhẹ";
  if(d===0)return {muc:"vua",txt:"Vừa size của nàng"};
  if(co==="Ôm sát")return {muc:"khong",txt:d>0?"Mẫu ôm sát, size này rộng so với nàng":"Mẫu ôm sát, size này nhỏ so với nàng"};
  if(co==="Dây chỉnh / suông"&&Math.abs(d)===1)return {muc:"co-the",txt:d>0?"Rộng hơn một size, có dây chỉnh nên vẫn vừa":"Nhỏ hơn một size, dáng suông nên vẫn mặc được"};
  if(co==="Co giãn nhẹ"&&Math.abs(d)===1)return {muc:"co-the",txt:d>0?"Rộng hơn một size, stylist ghim chỉnh tại chỗ":"Nhỏ hơn một size, vải co giãn nên vẫn vừa"};
  return {muc:"khong",txt:"Lệch size so với số đo của nàng"}}

/* Một lượt thuê = 24 giờ kể từ lúc nhận. Mốc trả rơi ngoài giờ mở cửa (8:00–21:00) thì dời sang 10:00 sáng kế tiếp, không tính phí.
   Trễ dưới 1 giờ bỏ qua; từ đó 20.000đ mỗi giờ. */
const LUOT={gio:24,mo:8,dong:21,traSom:10,tre:20000,anHan:1};
function _iso(d){const p=x=>String(x).padStart(2,"0");return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`}
function hanTra(nhanIso,soLuot){const d=new Date(nhanIso);if(isNaN(d))return "";d.setHours(d.getHours()+LUOT.gio*Math.max(1,soLuot||1));
  const h=d.getHours()+d.getMinutes()/60;
  if(h>LUOT.dong){d.setDate(d.getDate()+1);d.setHours(LUOT.traSom,0,0,0)}else if(h<LUOT.mo){d.setHours(LUOT.traSom,0,0,0)}
  return _iso(d)}
function phiTre(gio){/* gio = số giờ trễ (số thực). Giờ đầu miễn, từ giờ thứ hai 20.000đ mỗi giờ, tối đa 24 giờ tính phí */
  if(!(gio>LUOT.anHan))return 0;return Math.min(Math.ceil(gio)-LUOT.anHan,24)*LUOT.tre}
function soLuot(nhanIso,traIso){const ms=new Date(traIso)-new Date(nhanIso);if(!(ms>0))return 1;
  /* mốc trả đã được dời sang sáng hôm sau vẫn tính là cùng lượt */
  for(let n=1;n<30;n++){if(new Date(hanTra(nhanIso,n))>=new Date(traIso))return n}return 30}
/* Đến tận nơi: phí trọn gói một đơn, gồm chuyến giao và chuyến nhận lại. Tiệm ở An Thượng – Mỹ An. */
const VUNG=[
  {id:"V1",ten:"Trung tâm Đà Nẵng",mo:"Hải Châu, Thanh Khê, Sơn Trà, Ngũ Hành Sơn (kể cả resort ven biển Võ Nguyên Giáp, Trường Sa)",km:"dưới 10 km",phi:120000},
  {id:"V2",ten:"Đà Nẵng mở rộng",mo:"Cẩm Lệ, Liên Chiểu, Hoà Xuân, Hoà Vang gần, bán đảo Sơn Trà (InterContinental), Điện Ngọc",km:"10–20 km",phi:180000},
  {id:"V3",ten:"Hội An",mo:"Phố cổ, An Bàng, Cửa Đại, Four Seasons Nam Hải",km:"20–35 km",phi:300000}];
const NGOAI_VUNG="Bà Nà, Huế, Tam Kỳ và nơi xa hơn 35 km: tụi mình chưa đến tận nơi, nàng ghé tiệm nhận đồ nhé.";
function phiVung(id){const v=VUNG.find(x=>x.id===id);return v?v.phi:VUNG[0].phi}
/* ---------- nhập hàng từ link thương hiệu ---------- */
const NHOM_LOAI={"Đầm dài":"DT","Đầm midi":"CW","Đầm ngắn":"TK","Đầm xoè":"PR"};
const LX_TU=4000000;/* giá trị từ 4 triệu: nhóm LX */
const round50k=v=>Math.round(v/50000)*50000;
function tyLeThue(gt){return gt<1e6?0.22:gt<3e6?0.12:gt<6e6?0.10:0.08}
/* Giá thuê gợi ý: theo tỷ lệ thị trường trên giá trị chiếc đầm, nhưng đủ để hoà vốn trong tối đa 12 lượt.
   Cọc gợi ý: 30% giá trị, trong khoảng 300k–2tr. */
function goiYGia(o){const sp={von:+o.von||0,markup:o.markup==null?KT.markupMacDinh:+o.markup,giaNiemYet:+o.giaNiemYet||0};const gt=giaTri(sp);if(!gt)return null;
  const theoTyLe=round10k(Math.max(gt*tyLeThue(gt),gt>=6e6?6e5:gt>=3e6?36e4:gt>=1e6?22e4:0));/* không để mẫu giá trị cao hơn có giá thuê thấp hơn ở mép bậc */const san=Math.ceil(((sp.von/12)+KT.cpLuot)/(1-KT.thue)/10000)*10000;
  const gia=Math.max(theoTyLe,san,130000);const coc=Math.min(2000000,Math.max(300000,round50k(gt*0.3)));
  return {giaTri:gt,gia,coc,tyLe:gia/gt,nhom:gt>=LX_TU?"LX":(NHOM_LOAI[o.loai]||"DT"),luotHoaVon:Math.ceil(sp.von/laiGop(gia))}}
function maMoi(nhom,size){let m=0;db.sp.forEach(s=>{const x=String(s.id).split("-");if(x[1]===nhom)m=Math.max(m,+x[2]||0)});return `CH-${nhom}-${String(m+1).padStart(3,"0")}-${size}`}
/* Ảnh tự chụp (shooting, lookbook khách) và ảnh dựng bằng AI. Ảnh khách chỉ hiện khi đã có đồng ý; ảnh AI luôn xếp sau ảnh thật và có nhãn. */
const HANG_ANH=a=>a.loai==="Ảnh AI"?2:a.loai==="Ảnh hãng"?1:0;
function anhCua(spId,congKhai){return (db.anh||[]).filter(a=>a.sp===spId&&!a.an&&(!congKhai||a.loai!=="Lookbook khách"||a.dongY)).sort((a,b)=>(HANG_ANH(a)-HANG_ANH(b))||(a.thuTu||0)-(b.thuTu||0)||(a.tao<b.tao?-1:1))}
/* Nhân sự: admin thêm trong Nhập liệu > Nhân sự. vaiTro: Stylist, Quầy, Marketing */
function nhanSu(vaiTro){return (db.nv||[]).filter(n=>!n.nghi&&(!vaiTro||n.vaiTro===vaiTro)).map(n=>n.ten)}
function anhThat(spId){return anhCua(spId,false).filter(a=>a.loai!=="Ảnh AI"&&a.loai!=="Ảnh hãng")}/* ảnh của hãng không tính là ảnh tự chụp */
function nenAnh(file,max,q){return new Promise((ok,no)=>{const r=new FileReader();r.onerror=()=>no(new Error("Không đọc được ảnh"));r.onload=()=>{const im=new Image();im.onerror=()=>no(new Error("File không phải ảnh"));im.onload=()=>{const k=Math.min(1,(max||1100)/Math.max(im.width,im.height));const c=document.createElement("canvas");c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext("2d").drawImage(im,0,0,c.width,c.height);let d=c.toDataURL("image/jpeg",q||0.72);if(d.length>600000)d=c.toDataURL("image/jpeg",0.55);ok(d)};im.src=r.result};r.readAsDataURL(file)})}
/* Mỗi mẫu cần ít nhất 4 ảnh tự chụp. Brief mặc định khi agent chưa viết brief riêng. */
const ANH_TOI_THIEU=4;
const BRIEF_CHUP=["Toàn thân chính diện trên người mẫu, nền Ivory","Sau lưng toàn thân","Nghiêng 45 độ khi đang bước","Cận chất liệu và chi tiết (cổ, eo, đường may)"];
function canChup(){return db.sp.filter(s=>s.tt!=="Ngưng"&&anhThat(s.id).length<ANH_TOI_THIEU).sort((a,b)=>anhThat(a.id).length-anhThat(b.id).length||((b.nhap||"")<(a.nhap||"")?-1:1))}
/* hợp đồng */
/* ---------- Hợp đồng thuê: chụp CCCD (đọc mã QR tự điền), điều khoản, khách đồng ý và ký trên máy ----------
   Chérie không giữ CCCD bản cứng; chỉ chụp lưu ảnh để lập hợp đồng và xử lý khiếu nại, có sự đồng ý của khách (Nghị định 13/2023). */
const HD_LUU_THANG=24;
const HD_BEN_CHO_THUE={ten:"CHÉRIE · Dịch vụ cho thuê đầm",diaChi:"Đà Nẵng",zalo:"0377 159 189"};
function hdEsc(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function hdMoney(n){return (Math.round(+n||0)).toLocaleString("vi-VN")+"đ"}
function hdWhen(iso){if(!iso)return "";const s=String(iso);return `${s.slice(11,16)} ngày ${s.slice(8,10)}/${s.slice(5,7)}/${s.slice(0,4)}`}
function hdNow(){const d=new Date(),p=x=>String(x).padStart(2,"0");return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`}
/* Mã QR trên CCCD gắn chip: số CCCD|số CMND cũ|họ tên|ngày sinh ddmmyyyy|giới tính|nơi thường trú|ngày cấp ddmmyyyy */
function hdDocQR(text){const p=String(text||"").split("|");if(p.length<6||!/^\d{12}$/.test(p[0]))return null;
  const ngay=s=>/^\d{8}$/.test(s||"")?`${s.slice(0,2)}/${s.slice(2,4)}/${s.slice(4)}`:"";
  return {so:p[0],cmnd:p[1]||"",ten:p[2]||"",ngaySinh:ngay(p[3]),gioiTinh:p[4]||"",diaChi:p[5]||"",ngayCap:ngay(p[6])}}
let jsqrP=null;
function hdJsQR(){if(window.jsQR)return Promise.resolve(window.jsQR);if(jsqrP)return jsqrP;
  jsqrP=new Promise((ok,no)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";s.onload=()=>window.jsQR?ok(window.jsQR):no(new Error("jsQR"));s.onerror=()=>{jsqrP=null;no(new Error("Không tải được bộ đọc mã QR"))};document.head.appendChild(s)});return jsqrP}
/* đọc QR từ ảnh: thử cả ảnh, rồi góc trên bên phải (vị trí QR trên CCCD), phóng to */
function hdQuetAnh(file){return new Promise((ok,no)=>{const r=new FileReader();r.onerror=()=>no(new Error("Không đọc được ảnh"));r.onload=()=>{const im=new Image();im.onerror=()=>no(new Error("File không phải ảnh"));im.onload=()=>{
  hdJsQR().then(Q=>{const tries=[[0,0,1,1,1600],[0.5,0,0.5,0.6,1400],[0.55,0,0.45,0.5,1200],[0,0,1,0.6,1600],[0.6,0,0.4,0.4,1000],[0.4,0,0.6,0.5,1400],[0.45,0.1,0.45,0.45,1200],[0.6,0.1,0.4,0.4,1000],[0.25,0,0.75,0.75,1800]];
    /* ảnh chụp màn hình điện thoại bằng camera: mã QR có thể nằm bất kỳ đâu, quét thêm lưới ô chồng nhau */
    [0.6,0.42].forEach(w=>{const st=w/2;for(let y=0;y+w<=1.001;y+=st)for(let x=0;x+w<=1.001;x+=st)tries.push([x,y,w,w,1200])});
    for(const [x,y,w,h,max] of tries){const sw=im.width*w,sh=im.height*h,k=Math.min(3,max/Math.max(sw,sh));const c=document.createElement("canvas");c.width=Math.round(sw*k);c.height=Math.round(sh*k);
      const g=c.getContext("2d",{willReadFrequently:true});g.drawImage(im,im.width*x,im.height*y,sw,sh,0,0,c.width,c.height);const d=g.getImageData(0,0,c.width,c.height);
      const res=Q(d.data,c.width,c.height,{inversionAttempts:"attemptBoth"});if(res&&res.data){const info=hdDocQR(res.data);if(info)return ok(info)}}
    ok(null)}).catch(()=>ok(null))};im.src=r.result};r.readAsDataURL(file)})}
/* ảnh riêng tư (CCCD, chữ ký): bản Google lưu trên Drive riêng, chỉ nhân sự được phép xem */
function anhRieng(v){if(!v)return Promise.resolve("");if(/^data:/.test(v))return Promise.resolve(v);
  const m=/^drive:(.+)$/.exec(v);if(m&&window.GASDB)return window.GASDB.call("anhRieng",{id:m[1]}).then(r=>r.src||"").catch(()=>"");return Promise.resolve("")}
function hdDieuKhoan(o){/* o: {so, tao, ben, sdt, items:[{id,ten,size,giaTri,gia}], nhan, tra, luot, phiGiao, yenTam, coc, hinhThuc, nv} */
  const tienThue=o.items.reduce((a,x)=>a+(+x.gia||0),0)*(o.luot||1),yt=o.yenTam?YEN_TAM.phi*o.items.length:0;
  const hu=MUC_HU.slice(1).map(([c,t,p])=>`<tr><td>${c}</td><td>${hdEsc(t)}</td><td>${p==null?"Đền 100% giá trị chiếc đầm":p?hdMoney(p):"Miễn phí"}</td><td>${p==null?"Đền 50% giá trị":"Miễn phí"}</td></tr>`).join("");
  return `<div class="hd-doc">
  <p class="hd-c">CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>Độc lập – Tự do – Hạnh phúc</p>
  <h3 class="hd-c">HỢP ĐỒNG THUÊ TRANG PHỤC</h3><p class="hd-c">Số ${hdEsc(o.so)} · lập lúc ${hdWhen(o.tao)}</p>
  <p><b>Bên cho thuê (Bên A):</b> ${hdEsc(HD_BEN_CHO_THUE.ten)}, ${hdEsc(HD_BEN_CHO_THUE.diaChi)}. Zalo ${hdEsc(HD_BEN_CHO_THUE.zalo)}. Nhân sự lập hợp đồng: ${hdEsc(o.nv||"")}.</p>
  <p><b>Bên thuê (Bên B):</b> ${hdEsc(o.ben.ten)} · CCCD số ${hdEsc(o.ben.so)}${o.loai==="VNeID"?" (đối chiếu qua VNeID)":""}${o.ben.ngayCap?` cấp ngày ${hdEsc(o.ben.ngayCap)}`:""} · ngày sinh ${hdEsc(o.ben.ngaySinh)} · ${hdEsc(o.ben.gioiTinh)}<br>Nơi thường trú: ${hdEsc(o.ben.diaChi)} · Điện thoại/Zalo: ${hdEsc(o.sdt)}</p>
  <p><b>Điều 1. Trang phục cho thuê</b></p>
  <table class="hd-t"><tr><th>Mã</th><th>Tên mẫu</th><th>Size</th><th>Giá trị</th><th>Giá thuê/lượt</th></tr>${o.items.map(x=>`<tr><td>${hdEsc(x.id)}</td><td>${hdEsc(x.ten)}</td><td>${hdEsc(x.size)}</td><td>${hdMoney(x.giaTri)}</td><td>${hdMoney(x.gia)}</td></tr>`).join("")}</table>
  <p>Bên B đã kiểm tra trang phục khi nhận: tình trạng như mới (mức L0), có ảnh chụp tình trạng lúc giao do Bên A lưu.</p>
  <p><b>Điều 2. Thời gian thuê</b><br>Nhận lúc ${hdWhen(o.nhan)}, hẹn trả trước ${hdWhen(o.tra)} (${o.luot||1} lượt, mỗi lượt 24 giờ). Trả trễ: miễn 1 giờ đầu, từ giờ thứ hai tính 20.000đ mỗi giờ; trễ quá 24 giờ tính thêm một lượt thuê.</p>
  <p><b>Điều 3. Chi phí và tiền cọc</b><br>Tiền thuê: ${hdMoney(tienThue)}${o.phiGiao?` · Phí đến tận nơi: ${hdMoney(o.phiGiao)}`:""}${yt?` · ${YEN_TAM.ten}: ${hdMoney(yt)}`:""}.<br>Tiền cọc: ${hdMoney(o.coc)}${o.hinhThuc?` (${hdEsc(o.hinhThuc)})`:""}. Bên A hoàn cọc trong 24 giờ sau khi kiểm tra trang phục, trừ các khoản tại Điều 2 và Điều 4 nếu có. Bên A không giữ CCCD bản cứng của Bên B.</p>
  <p><b>Điều 4. Hư hỏng, mất mát</b>${o.yenTam?` · Bên B có ${YEN_TAM.ten}`:""}</p>
  <table class="hd-t"><tr><th>Mức</th><th>Tình trạng khi trả</th><th>Không có ${YEN_TAM.ten}</th><th>Có ${YEN_TAM.ten}</th></tr>${hu}</table>
  <p>Bên B không tự ý cắt, may sửa, nhuộm, tẩy, giặt bằng hoá chất mạnh, không cho người khác thuê lại. Mức hư hỏng do Bên A đánh giá khi nhận lại, đối chiếu ảnh lúc giao; Bên B được xem ảnh và biên bản.</p>
  <p><b>Điều 5. Thông tin cá nhân</b><br>Bên B đồng ý để Bên A chụp và lưu ảnh CCCD (hai mặt thẻ hoặc ảnh màn hình VNeID), thông tin trên CCCD và chữ ký này nhằm mục đích lập, thực hiện hợp đồng và giải quyết khiếu nại, tranh chấp liên quan. Dữ liệu chỉ nhân sự phụ trách của Bên A được xem, không cung cấp cho bên thứ ba trừ khi cơ quan nhà nước có thẩm quyền yêu cầu, được lưu tối đa ${HD_LUU_THANG} tháng kể từ khi kết thúc hợp đồng hoặc đến khi giải quyết xong tranh chấp. Bên B có quyền yêu cầu xem, chỉnh sửa hoặc xoá dữ liệu sau thời hạn trên qua Zalo của Bên A.</p>
  <p><b>Điều 6. Giải quyết tranh chấp</b><br>Hai bên ưu tiên thương lượng. Không thương lượng được thì đưa ra Toà án nhân dân có thẩm quyền tại Đà Nẵng.</p>
  <p>Hợp đồng có hiệu lực từ lúc Bên B ký. Bên B xác nhận đã đọc, hiểu và đồng ý toàn bộ điều khoản.</p></div>`}
const HD_CSS=`.hdx{position:fixed;inset:0;z-index:9000;background:rgba(20,20,20,.45);display:flex;align-items:flex-end;justify-content:center}
.hdx .pn{background:#FBF8F3;color:#141414;width:100%;max-width:720px;max-height:96vh;overflow:auto;border-radius:22px 22px 0 0;padding:18px max(16px,env(safe-area-inset-left,0px)) calc(18px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:14px;font:15px/1.5 "Be Vietnam Pro",system-ui,sans-serif}
.hdx h2{font:500 22px "Playfair Display",Georgia,serif;margin:0}.hdx .hd{display:flex;justify-content:space-between;align-items:center;gap:12px}
.hdx .x{border:0;background:#EFE7DB;border-radius:50%;width:36px;height:36px;font-size:18px;cursor:pointer}
.hdx .st{display:flex;gap:6px;font-size:12px;color:#6B635A}.hdx .st b{color:#8E1B2E}
.hdx label.f{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#6B635A}.hdx input[type=text],.hdx input[type=tel]{font:inherit;font-size:16px;padding:10px 12px;border:1px solid #E2D6C6;border-radius:12px;background:#fff;color:#141414}
.hdx .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:480px){.hdx .two{grid-template-columns:1fr}}
.hdx .shots{display:grid;grid-template-columns:1fr 1fr;gap:10px}.hdx .shot{border:1px dashed #C8A97E;border-radius:14px;aspect-ratio:1.58;display:flex;align-items:center;justify-content:center;text-align:center;font-size:13px;color:#6B635A;overflow:hidden;position:relative;background:#fff;cursor:pointer}
.hdx .shot img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.hdx .shot input{position:absolute;inset:0;opacity:0;cursor:pointer}.hdx .seg2{display:grid;grid-template-columns:1fr 1fr;gap:6px;background:#EFE7DB;padding:4px;border-radius:999px}.hdx .seg2 button{font:inherit;font-size:13px;border:0;border-radius:999px;padding:9px 6px;background:transparent;color:#4A2A33;cursor:pointer}.hdx .seg2 button[aria-pressed="true"]{background:#fff;font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.12)}.hdx .shot .lb{position:absolute;left:0;right:0;bottom:0;background:rgba(20,20,20,.55);color:#fff;font-size:12px;padding:4px}.hdx .thumbs{display:grid;grid-template-columns:1fr 1fr;gap:8px}.hdx .thumbs img{width:100%;border-radius:10px;border:1px solid #E2D6C6;aspect-ratio:1.58;object-fit:cover}.hdx .miss input{border-color:#C0392B!important;background:#FFF6F4!important}.hdx .spin{display:flex;flex-direction:column;align-items:center;gap:12px;padding:40px 0;text-align:center}.hdx .spin i{width:34px;height:34px;border:3px solid #E2D6C6;border-top-color:#8E1B2E;border-radius:50%;animation:hdsp 1s linear infinite}@keyframes hdsp{to{transform:rotate(360deg)}}
.hdx .btn{font:inherit;font-weight:600;padding:13px 16px;border-radius:999px;border:1px solid #141414;background:transparent;color:#141414;cursor:pointer}.hdx .btn.p{background:#8E1B2E;border-color:#8E1B2E;color:#F6F1EA}.hdx .btn[disabled]{opacity:.45}
.hdx .row{display:flex;gap:10px;flex-wrap:wrap}.hdx .row .btn{flex:1}
.hdx .note{font-size:13px;color:#6B635A;margin:0}.hdx .ok{color:#2E6B4B}.hdx .bad{color:#8E1B2E}
.hdx .ck{display:flex;gap:10px;align-items:flex-start;font-size:14px}.hdx .ck input{width:20px;height:20px;margin-top:2px;flex:none}
.hdx canvas{width:100%;height:160px;border:1px dashed #6B635A;border-radius:12px;background:#fff;touch-action:none;display:block}
.hdx .hd-doc{background:#fff;border:1px solid #E2D6C6;border-radius:14px;padding:14px;font-size:13.5px;line-height:1.55;max-height:46vh;overflow:auto}
.hdx .hd-doc p{margin:0 0 8px}.hdx .hd-c{text-align:center}.hdx .hd-doc h3{margin:6px 0 2px;font-size:16px;text-align:center}
.hdx .hd-t{width:100%;border-collapse:collapse;margin:4px 0 8px;font-size:12.5px}.hdx .hd-t td,.hdx .hd-t th{border:1px solid #E2D6C6;padding:4px 6px;text-align:left;vertical-align:top}
.hdx .sigimg{max-width:260px;border:1px solid #E2D6C6;border-radius:10px;background:#fff}.hdx .pics{display:grid;grid-template-columns:1fr 1fr;gap:8px}.hdx .pics img{width:100%;border-radius:10px;border:1px solid #E2D6C6}
.hdx pre{white-space:pre-wrap;background:#F6F1EA;border-radius:12px;padding:10px 12px;font:13px/1.5 system-ui;margin:0;user-select:text;-webkit-user-select:text}`;
function hdLayer(){let st=document.getElementById("hd-css");if(!st){st=document.createElement("style");st.id="hd-css";st.textContent=HD_CSS;document.head.appendChild(st)}
  const el=document.createElement("div");el.className="hdx";el.innerHTML='<div class="pn" role="dialog" aria-modal="true"></div>';document.body.appendChild(el);return el}
/* Lập hợp đồng. opts: {don, kh:{id,ten,sdt}, items:[{id,ten,size,giaTri,gia}], nhan, tra, luot, phiGiao, yenTam, coc, hinhThuc, nv, onDone(hd)} */
function lapHopDong(opts){
  const el=hdLayer(),pn=el.querySelector(".pn");const close=()=>el.remove();
  const luu=(db.cccd||[]).find(c=>c.id===opts.kh.id);
  const st={buoc:1,ben:luu?{so:luu.so,ten:luu.ten,ngaySinh:luu.ngaySinh,gioiTinh:luu.gioiTinh,diaChi:luu.diaChi,ngayCap:luu.ngayCap}:{so:"",ten:opts.kh.ten||"",ngaySinh:"",gioiTinh:"",diaChi:"",ngayCap:""},
    loai:luu&&luu.loai||"CCCD",truoc:luu?luu.truoc:"",sau:luu?luu.sau:"",dungLuu:!!luu,sdt:opts.kh.sdt||"",ky:"",dongY1:false,dongY2:false,msg:""};
  const so="HD"+Date.now().toString(36).toUpperCase();const tao=hdNow();
  function draw(){
    const BUOC=["Ảnh CCCD","Thông tin","Điều khoản","Ký"];const stp=n=>`<div class="st">${BUOC.map((t,i)=>i+1===n?`<b>${i+1}. ${t}</b>`:`<span>${i+1}. ${t}</span>`).join("›")}</div>`;
    if(st.buoc===1){
      pn.innerHTML=`<div class="hd"><h2>Hợp đồng · CCCD</h2><button class="x" type="button" data-x aria-label="Đóng">✕</button></div>
      ${stp(1)}
      ${st.dungLuu?`<p class="note ok">Khách đã có CCCD lưu từ ${hdEsc(luu.cap||"")}. Bấm Tiếp tục nếu vẫn dùng thẻ này, hoặc chạm vào ảnh để thay.</p>`:'<p class="note">Chạm vào từng ô để chụp hoặc chọn ảnh từ album. Chụp thẳng, đủ 4 góc thẻ, không loá. Tiệm chỉ lưu ảnh, không giữ thẻ.</p>'}
      <div class="seg2" role="group" aria-label="Loại giấy tờ">${[["CCCD","Thẻ CCCD · 2 mặt"],["VNeID","VNeID · 1 ảnh màn hình"]].map(([v,t])=>`<button type="button" data-loai="${v}" aria-pressed="${st.loai===v}">${t}</button>`).join("")}</div>
      ${st.loai==="VNeID"?'<p class="note">Nhờ khách mở VNeID → Thẻ CCCD → trang thông tin thẻ (thấy mã QR và ngày cấp), <b>tăng độ sáng màn hình tối đa</b>. Nhân viên chạm ô dưới → Chụp ảnh: giữ máy song song với màn hình, cách khoảng 15–20 cm, chạm vào mã QR để lấy nét, không bật đèn flash, tránh đèn phản chiếu.</p>':""}
      <div class="shots" ${st.loai==="VNeID"?'style="grid-template-columns:1fr"':""}>${(st.loai==="VNeID"?[["truoc","Chụp màn hình VNeID của khách"]]:[["truoc","Mặt trước"],["sau","Mặt sau"]]).map(([k,t])=>`<label class="shot">${st[k]?`<img data-src="${hdEsc(st[k])}" alt="${t} CCCD"><span class="lb">${t} · chạm để đổi</span>`:`${t}<br>chạm để thêm ảnh`}<input type="file" accept="image/*" data-side="${k}"></label>`).join("")}</div>
      <p class="note bad" id="e1">${hdEsc(st.msg)}</p>
      <div class="row"><button class="btn" type="button" data-x>Để sau</button><button class="btn p" type="button" id="n1" ${st.truoc&&(st.sau||st.loai==="VNeID")?"":"disabled"}>Tiếp tục</button></div>`;
      pn.querySelectorAll("img[data-src]").forEach(i=>anhRieng(i.dataset.src).then(s=>{if(s)i.src=s}));
      pn.querySelectorAll("[data-loai]").forEach(b=>b.onclick=()=>{if(st.loai===b.dataset.loai)return;st.loai=b.dataset.loai;st.truoc="";st.sau="";st.ocr_truoc="";st.ocr_sau="";st.qrP=null;st.dungLuu=false;st.msg="";draw()});
      pn.querySelectorAll("input[type=file]").forEach(inp=>inp.onchange=async()=>{const f=inp.files&&inp.files[0];if(!f)return;const side=inp.dataset.side;
        try{st[side]=await nenAnh(f,1400,0.8);st["ocr_"+side]=await nenAnh(f,2200,0.88);st.dungLuu=false;st.msg="";if(side==="truoc")st.qrP=hdQuetAnh(f).catch(()=>null)}
        catch(e){st.msg=e.message||"Không đọc được ảnh"}draw()});
      pn.querySelector("#n1").onclick=async()=>{if(!st.truoc||(!st.sau&&st.loai!=="VNeID"))return;if(st.loai==="VNeID")st.sau="";
        if(st.dungLuu&&st.ben.so){st.buoc=2;draw();return}
        pn.innerHTML=`<div class="hd"><h2>Đang đọc CCCD</h2></div>${stp(1)}<div class="spin"><i></i><p class="note">Đang đọc thông tin trên hai mặt thẻ, thường mất 5–15 giây.</p></div>`;
        const qr=st.qrP?await st.qrP:null;let ocr=null,loi="";
        if(!qr&&window.GASDB){try{const r=await window.GASDB.call("docCCCD",{truoc:st.ocr_truoc,sau:st.loai==="VNeID"?"":st.ocr_sau});ocr=r&&r.ben}catch(e){loi=e.message||""}}
        const ben={so:"",ten:"",ngaySinh:"",gioiTinh:"",diaChi:"",ngayCap:""};
        Object.keys(ben).forEach(k=>{ben[k]=(qr&&qr[k])||(ocr&&ocr[k])||""});
        st.ben=ben;const thieu=Object.keys(ben).filter(k=>!ben[k]).length;
        st.msg2=qr?"Đã đọc mã QR trên thẻ. Đối chiếu lại với ảnh trước khi tiếp tục.":ocr&&thieu<6?(thieu?`Đã đọc được phần lớn thông tin. Ô viền đỏ chưa đọc được, nhập tay theo ảnh.`:"Đã đọc thông tin từ ảnh. Đối chiếu lại với ảnh trước khi tiếp tục."):`Chưa đọc được chữ trên ảnh${loi?` (${loi})`:""}. Nhập tay theo ảnh bên dưới, hoặc quay lại chụp rõ hơn.`;
        st.buoc=2;draw()};
    } else if(st.buoc===2){
      const F=[["ten","Họ và tên","text"],["so","Số CCCD","tel"],["ngaySinh","Ngày sinh","text"],["gioiTinh","Giới tính","text"],["diaChi","Nơi thường trú","text"],["ngayCap","Ngày cấp","text"]];
      pn.innerHTML=`<div class="hd"><h2>Thông tin khách</h2><button class="x" type="button" data-x aria-label="Đóng">✕</button></div>
      ${stp(2)}
      <p class="note ${st.ben.so?"ok":""}">${hdEsc(st.msg2||"Kiểm tra lại thông tin theo ảnh.")}</p>
      <div class="thumbs" ${st.loai==="VNeID"?'style="grid-template-columns:1fr"':""}><img data-src="${hdEsc(st.truoc)}" alt="Ảnh giấy tờ" ${st.loai==="VNeID"?'style="aspect-ratio:auto;max-height:46vh;object-fit:contain;background:#fff"':""}>${st.loai==="VNeID"?"":`<img data-src="${hdEsc(st.sau)}" alt="Mặt sau CCCD">`}</div>
      ${F.map(([k,t,ty])=>`<label class="f ${st.ben[k]?"":"miss"}">${t}<input type="${ty}" ${ty==="tel"?'inputmode="numeric"':""} data-k="${k}" value="${hdEsc(st.ben[k])}" ${/ngay/.test(k)?'placeholder="dd/mm/yyyy"':""}></label>`).join("")}
      <label class="f">Số điện thoại / Zalo<input type="tel" inputmode="tel" data-sdt value="${hdEsc(st.sdt)}"></label>
      <p class="note bad" id="e2"></p>
      <div class="row"><button class="btn" type="button" id="b1">Quay lại</button><button class="btn p" type="button" id="n2b">Tiếp: điều khoản</button></div>`;
      pn.querySelectorAll("img[data-src]").forEach(i=>anhRieng(i.dataset.src).then(s=>{if(s)i.src=s}));
      pn.querySelectorAll("[data-k]").forEach(i=>i.oninput=()=>{st.ben[i.dataset.k]=i.value.trim();i.parentNode.classList.toggle("miss",!i.value.trim())});pn.querySelector("[data-sdt]").oninput=e=>{st.sdt=e.target.value.trim()};
      pn.querySelector("#b1").onclick=()=>{st.buoc=1;draw()};
      pn.querySelector("#n2b").onclick=()=>{const e=pn.querySelector("#e2");const b=st.ben;b.so=String(b.so).replace(/\D/g,"");
        const bad=!b.ten?"Nhập họ tên.":!/^\d{12}$/.test(b.so)?"Số CCCD gồm 12 chữ số.":!b.ngaySinh?"Nhập ngày sinh.":!b.diaChi?"Nhập nơi thường trú.":!/^0\d{9}$/.test(String(st.sdt).replace(/\D/g,""))?"Số điện thoại gồm 10 số.":"";
        if(bad){e.textContent=bad;return}st.buoc=3;draw()};
    } else if(st.buoc===3){
      pn.innerHTML=`<div class="hd"><h2>Điều khoản</h2><button class="x" type="button" data-x aria-label="Đóng">✕</button></div>
      ${stp(3)}
      <p class="note">Đưa máy cho khách đọc. Kéo trong khung để xem hết.</p>
      ${hdDieuKhoan(Object.assign({},opts,{so,tao,ben:st.ben,sdt:st.sdt,loai:st.loai}))}
      <label class="ck"><input type="checkbox" id="c1" ${st.dongY1?"checked":""}> Tôi đã đọc và đồng ý các điều khoản thuê, mức phí hư hỏng và trả trễ.</label>
      <label class="ck"><input type="checkbox" id="c2" ${st.dongY2?"checked":""}> Tôi đồng ý để Chérie chụp, lưu ảnh CCCD và chữ ký theo Điều 5 (lưu tối đa ${HD_LUU_THANG} tháng, không giữ thẻ bản cứng).</label>
      <div class="row"><button class="btn" type="button" id="b2">Quay lại</button><button class="btn p" type="button" id="n2" ${st.dongY1&&st.dongY2?"":"disabled"}>Tiếp: khách ký</button></div>`;
      const upd=()=>{st.dongY1=pn.querySelector("#c1").checked;st.dongY2=pn.querySelector("#c2").checked;pn.querySelector("#n2").disabled=!(st.dongY1&&st.dongY2)};
      pn.querySelector("#c1").onchange=upd;pn.querySelector("#c2").onchange=upd;pn.querySelector("#b2").onclick=()=>{st.buoc=2;draw()};pn.querySelector("#n2").onclick=()=>{st.buoc=4;draw()};
    } else {
      pn.innerHTML=`<div class="hd"><h2>Khách ký</h2><button class="x" type="button" data-x aria-label="Đóng">✕</button></div>
      ${stp(4)}
      <p class="note">${hdEsc(st.ben.ten)} ký vào khung dưới, bằng ngón tay.</p>
      <canvas id="sig"></canvas><div class="row"><button class="btn" type="button" id="clr">Ký lại</button></div>
      <p class="note bad" id="e3"></p>
      <div class="row"><button class="btn" type="button" id="b3">Quay lại</button><button class="btn p" type="button" id="ok3">Hoàn tất hợp đồng</button></div>`;
      const c=pn.querySelector("#sig"),dpr=window.devicePixelRatio||1,w=c.clientWidth;c.width=w*dpr;c.height=160*dpr;const x=c.getContext("2d");x.scale(dpr,dpr);x.lineWidth=2.2;x.lineCap="round";x.strokeStyle="#141414";
      let on=false,moved=0;c.addEventListener("pointerdown",e=>{on=true;c.setPointerCapture(e.pointerId);const r=c.getBoundingClientRect();x.beginPath();x.moveTo(e.clientX-r.left,e.clientY-r.top)});
      c.addEventListener("pointermove",e=>{if(!on)return;const r=c.getBoundingClientRect();x.lineTo(e.clientX-r.left,e.clientY-r.top);x.stroke();moved++});
      c.addEventListener("pointerup",()=>{on=false});pn.querySelector("#clr").onclick=()=>{x.clearRect(0,0,w,160);moved=0};
      pn.querySelector("#b3").onclick=()=>{st.buoc=3;draw()};
      pn.querySelector("#ok3").onclick=()=>{if(moved<8){pn.querySelector("#e3").textContent="Khách chưa ký.";return}
        const ky=c.toDataURL("image/png"),luc=hdNow(),sdt=String(st.sdt).replace(/\D/g,"");
        const hd={id:so,don:opts.don||"",kh:opts.kh.id,tao,kyLuc:luc,nv:opts.nv||"",ben:Object.assign({},st.ben),sdt,items:opts.items,nhan:opts.nhan,tra:opts.tra,luot:opts.luot||1,phiGiao:opts.phiGiao||0,yenTam:!!opts.yenTam,coc:+opts.coc||0,hinhThuc:opts.hinhThuc||"",
          loai:st.loai,truoc:st.truoc,sau:st.sau,chuKy:ky,dongY:{dieuKhoan:true,duLieu:true,luc},luuDen:"",tt:"Đã ký",phienBan:1};
        db.hd=db.hd||[];db.hd.push(hd);
        db.cccd=db.cccd||[];const cur=db.cccd.find(z=>z.id===opts.kh.id);const rec={id:opts.kh.id,so:st.ben.so,ten:st.ben.ten,ngaySinh:st.ben.ngaySinh,gioiTinh:st.ben.gioiTinh,diaChi:st.ben.diaChi,ngayCap:st.ben.ngayCap,loai:st.loai,truoc:st.truoc,sau:st.sau,cap:luc.slice(0,10),hd:so};
        if(cur)Object.assign(cur,rec);else db.cccd.push(rec);
        try{window.CherieData.save()}catch(e){}close();if(opts.onDone)opts.onDone(hd)};
    }
    pn.querySelectorAll("[data-x]").forEach(b=>b.onclick=close);
  }
  draw();
}
function xemHopDong(id){const h=(db.hd||[]).find(x=>x.id===id);if(!h)return;const el=hdLayer(),pn=el.querySelector(".pn");
  const tom=[`Chérie gửi nàng tóm tắt hợp đồng ${h.id}`,`Bên thuê: ${h.ben.ten}`,`Đồ thuê: ${h.items.map(x=>`${x.ten} (${x.id})`).join(", ")}`,`Nhận: ${hdWhen(h.nhan)} · Hẹn trả: ${hdWhen(h.tra)}`,`Cọc: ${hdMoney(h.coc)}${h.yenTam?` · Có ${YEN_TAM.ten}`:""}`,`Trả trễ: miễn 1 giờ đầu, sau đó 20.000đ mỗi giờ.`,`Ký lúc ${hdWhen(h.kyLuc)}.`].join("\n");
  pn.innerHTML=`<div class="hd"><h2>Hợp đồng ${hdEsc(h.id)}</h2><button class="x" type="button" data-x aria-label="Đóng">✕</button></div>
  <p class="note">Ký lúc ${hdWhen(h.kyLuc)}${h.nv?` · nhân sự ${hdEsc(h.nv)}`:""}${h.don?` · đơn ${hdEsc(h.don)}`:""}</p>
  ${hdDieuKhoan(Object.assign({},h,{so:h.id}))}
  <p class="note"><b>Chữ ký bên thuê</b></p><img class="sigimg" id="hSig" alt="Chữ ký của khách">
  <p class="note"><b>${h.loai==="VNeID"?"Ảnh màn hình VNeID":"Ảnh CCCD"}</b> · chỉ dùng khi đối chiếu, không chia sẻ ra ngoài</p><div class="pics" ${h.sau?"":'style="grid-template-columns:1fr"'}><img id="hT" alt="Ảnh giấy tờ">${h.sau?'<img id="hS" alt="Mặt sau CCCD">':""}</div>
  <p class="note"><b>Tóm tắt gửi khách qua Zalo</b></p><pre id="tom">${hdEsc(tom)}</pre>
  <div class="row"><button class="btn" type="button" id="cp">Chép tóm tắt</button><button class="btn p" type="button" data-x>Đóng</button></div>`;
  anhRieng(h.chuKy).then(s=>{if(s)pn.querySelector("#hSig").src=s});anhRieng(h.truoc).then(s=>{if(s)pn.querySelector("#hT").src=s});if(h.sau)anhRieng(h.sau).then(s=>{if(s)pn.querySelector("#hS").src=s});
  pn.querySelector("#cp").onclick=()=>{try{navigator.clipboard.writeText(tom).then(()=>{pn.querySelector("#cp").textContent="Đã chép"})}catch(e){}};
  pn.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>el.remove())}

/* ---------- Ảnh tình trạng đầm lúc giao và lúc nhận lại ----------
   Mỗi món chụp 4 góc. Ảnh gửi thẳng lên Drive riêng tư của tiệm (bảng bb), máy chỉ giữ tạm trong lúc gửi. */
const TT_GOC=["Mặt trước","Mặt sau","Cận chất liệu","Tem mã, nhãn"];
const ttCache={};
function bbId(don,phase){return "BB-"+don+"-"+phase}
function bbOf(don,phase){return (db.bb||[]).find(x=>x.id===bbId(don,phase))}
function ttAnh(don,phase,sp){const b=bbOf(don,phase);return b&&b.mon&&b.mon[sp]?b.mon[sp]:{anh:[],them:[]}}
function ttSo(don,phase,sp){const m=ttAnh(don,phase,sp);return TT_GOC.filter((_,i)=>m.anh&&m.anh[i]).length}
function ttDu(don,phase,sp){return ttSo(don,phase,sp)===TT_GOC.length}
function ttSrc(v){if(!v)return Promise.resolve("");if(/^(data:|https:)/.test(v))return Promise.resolve(v);if(!ttCache[v])ttCache[v]=anhRieng(v).then(x=>{if(!x)delete ttCache[v];return x});return ttCache[v]}
function ttFill(root){root.querySelectorAll("img[data-tt]").forEach(im=>{ttSrc(im.dataset.tt).then(x=>{if(x){im.src=x;im.closest("[data-ttbox]")&&im.closest("[data-ttbox]").classList.add("ok")}})})}
const TT_CSS=`.ttg{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.tts{position:relative;aspect-ratio:3/4;border:1px dashed #C8A97E;border-radius:12px;overflow:hidden;background:#fff;display:flex;align-items:center;justify-content:center;text-align:center;font-size:11px;line-height:1.25;color:#6B635A;padding:4px;cursor:pointer}
.tts img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.tts input{position:absolute;inset:0;opacity:0;cursor:pointer}.tts .lb{position:absolute;left:0;right:0;bottom:0;background:rgba(20,20,20,.55);color:#fff;font-size:10px;padding:3px}.tts.has{border-style:solid;border-color:#2F6B4F}
.ttit{display:flex;flex-direction:column;gap:8px;padding:12px 0;border-bottom:1px solid #EFE7DB}.ttit b{font-size:15px}.ttit .st{font-size:12px;color:#6B635A}.ttcmp{display:grid;grid-template-columns:auto 1fr;gap:6px 10px;align-items:center}.ttcmp>span{font-size:11px;color:#6B635A;writing-mode:horizontal-tb;width:52px}
.ttbig{position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center}.ttbig img{max-width:100%;max-height:100%}`;
function ttCss(){if(!document.getElementById("tt-css")){const st=document.createElement("style");st.id="tt-css";st.textContent=TT_CSS;document.head.appendChild(st)}}
function ttSlot(v,lb,attrs){return `<label class="tts ${v?"has":""}" data-ttbox>${v?`<img alt="${lb}" ${/^data:|^https:/.test(v)?`src="${v}"`:`data-tt="${v}"`}>`:`${lb}<br>+`}<span class="lb">${lb}</span>${attrs?`<input type="file" accept="image/*" capture="environment" ${attrs}>`:""}</label>`}
function ttXem(src){ttCss();const el=document.createElement("div");el.className="ttbig";el.innerHTML=`<img src="${src}" alt="">`;el.onclick=()=>el.remove();document.body.appendChild(el)}
/* Chụp ảnh tình trạng. o: {don, phase:"giao"|"nhan", items:[{id,ten}], tieuDe, nv, onDone} */
function chupTinhTrang(o){ttCss();const el=hdLayer(),pn=el.querySelector(".pn");const close=()=>el.remove();let busy=0,loi="";
  const doc=()=>{let b=bbOf(o.don,o.phase);if(!b){b={id:bbId(o.don,o.phase),don:o.don,phase:o.phase,mon:{},tao:new Date().toISOString().slice(0,16)};db.bb.push(b)}return b};
  const draw=()=>{const du=o.items.every(x=>ttDu(o.don,o.phase,x.id));
    pn.innerHTML=`<div class="hd"><h2>${o.tieuDe||(o.phase==="giao"?"Ảnh tình trạng lúc giao":"Ảnh tình trạng lúc nhận lại")}</h2><button class="x" type="button" data-x aria-label="Đóng">×</button></div>
     <p class="note">Mỗi món chụp đủ 4 góc, đủ sáng, thấy rõ vết nếu có. Ảnh gửi thẳng lên Drive của tiệm, không lưu trong máy.${o.phase==="nhan"?" Món có vết bẩn hoặc hư, chụp thêm cận vết ở ô cuối.":""}</p>
     ${o.items.map(x=>{const m=ttAnh(o.don,o.phase,x.id);return `<div class="ttit"><b>${hdEsc(x.ten)} <span class="st">· ${x.id} · ${ttSo(o.don,o.phase,x.id)}/4</span></b>
       <div class="ttg">${TT_GOC.map((g,i)=>ttSlot((m.anh||[])[i],g,`data-sp="${x.id}" data-i="${i}"`)).join("")}</div>
       ${o.phase==="nhan"?`<div class="ttg">${[0,1,2,3].map(j=>ttSlot((m.them||[])[j],"Cận vết "+(j+1),`data-sp="${x.id}" data-j="${j}"`)).join("")}</div>`:""}</div>`}).join("")}
     <p class="note" role="status">${busy?`Đang gửi ${busy} ảnh lên Drive…`:loi?loi:"Ảnh đã lưu lên Drive."}</p>
     <button class="btn primary" type="button" data-ok ${du?"":"disabled"} style="width:100%">${du?"Xong":"Chụp đủ 4 góc mỗi món"}</button>`;
    ttFill(pn);
    pn.querySelector("[data-x]").onclick=close;
    pn.querySelector("[data-ok]").onclick=()=>{close();o.onDone&&o.onDone()};
    pn.querySelectorAll("input[type=file]").forEach(inp=>inp.onchange=()=>{const f=inp.files&&inp.files[0];if(!f)return;busy++;draw();
      nenAnh(f,1400,0.8).then(d=>{const b=doc(),sp=inp.dataset.sp;const m=b.mon[sp]=b.mon[sp]||{anh:[],them:[]};m.anh=m.anh||[];m.them=m.them||[];
        if(inp.dataset.i!=null)m.anh[+inp.dataset.i]=d;else m.them[+inp.dataset.j]=d;m.luc=new Date().toISOString().slice(0,16);if(o.nv)m.nv=o.nv;
        CherieData.save();return CherieData.flush()}).then(st=>{busy--;loi=st==="error"?"Mạng chập chờn, ảnh sẽ tự gửi lại khi có mạng. Đừng đóng trang.":"";draw()},e=>{busy--;loi="Chưa gửi được ảnh: "+(e&&e.message||e)+". Chụp lại ô đó.";draw()})})};
  draw()}
/* So ảnh lúc giao và lúc nhận lại của từng món. o: {don, items:[{id,ten,ghi}]} */
function soAnhTinhTrang(o){ttCss();const el=hdLayer(),pn=el.querySelector(".pn");
  pn.innerHTML=`<div class="hd"><h2>So ảnh giao · nhận lại</h2><button class="x" type="button" data-x aria-label="Đóng">×</button></div>
   ${o.items.map(x=>{const g=ttAnh(o.don,"giao",x.id),n=ttAnh(o.don,"nhan",x.id);return `<div class="ttit"><b>${hdEsc(x.ten)} <span class="st">· ${x.id}</span></b>${x.ghi?`<span class="st">${hdEsc(x.ghi)}</span>`:""}
     <div class="ttcmp"><span>Lúc giao</span><div class="ttg">${TT_GOC.map((t,i)=>ttSlot((g.anh||[])[i],t)).join("")}</div>
     <span>Lúc nhận</span><div class="ttg">${TT_GOC.map((t,i)=>ttSlot((n.anh||[])[i],t)).join("")}</div>
     ${(n.them||[]).filter(Boolean).length?`<span>Cận vết</span><div class="ttg">${n.them.filter(Boolean).map((v,j)=>ttSlot(v,"Vết "+(j+1))).join("")}</div>`:""}</div></div>`}).join("")}
   <p class="note">Chạm vào ảnh để xem lớn. Ô trống là góc chưa chụp.</p>`;
  ttFill(pn);pn.querySelector("[data-x]").onclick=()=>el.remove();
  pn.querySelectorAll(".tts img").forEach(im=>im.onclick=e=>{e.preventDefault();if(im.src)ttXem(im.src)})}

window.CherieData={
  lapHopDong,xemHopDong,anhRieng,chupTinhTrang,soAnhTinhTrang,ttDu,ttSo,bbOf,TT_GOC,
  db,TABLES,KT,NHOM_LOAI,ANH_TOI_THIEU,BRIEF_CHUP,canChup,anhThat,nhanSu,today:()=>(()=>{const d=new Date(),p=x=>String(x).padStart(2,"0");return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())})(),goiYGia,maMoi,anhCua,nenAnh,tyLeThue,LUOT,hanTra,soLuot,phiTre,VUNG,NGOAI_VUNG,phiVung,giaTri,laiGop,khauHaoLuot,kinhTe,YEN_TAM,MUC_HU,phiHu,SIZES,BANG_SIZE,goiYSize,doVua,
  init(o){changeCb=o.onChange||changeCb;statusCb=o.onStatus||statusCb;statusCb(state);connect();return db},
  save(){saveLocal();push()},
  reset(){/* bản chính thức: tắt nạp lại dữ liệu mẫu để không ghi đè dữ liệu thật */},
  status(){return state},
  /* chờ các lượt ghi đang chạy xong rồi trả về trạng thái (để báo cho người dùng biết đã lưu được hay chưa) */
  async flush(){const ps=Object.values(chains);await Promise.allSettled(ps);return state},
  canSeed(){return false},
  newId(p){return p+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,5).toUpperCase()}
};
})();
