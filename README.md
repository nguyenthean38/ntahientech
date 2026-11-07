# Ntahien Tech — website giới thiệu dịch vụ

Website một trang giới thiệu dịch vụ làm **website, app di động và tự động hoá AI** của Nguyễn Thế An.
Viết bằng HTML, CSS, JavaScript thuần: không cần cài đặt, không cần build, mở là chạy.

## Có gì trong trang

| Phần | Nội dung |
|---|---|
| Hero | Tiêu đề lớn, số liệu nổi bật, dải ảnh giao diện các dự án chạy ngang |
| Vì sao chọn | So sánh "làm vội" và "làm đúng", 4 thẻ xếp chồng khi cuộn |
| Dịch vụ | 6 dịch vụ, mỗi thẻ có giao diện mô phỏng tự chạy (giỏ hàng, đếm ngược, chatbot…) |
| Dự án | 8 dự án thật, có bộ lọc, bấm vào xem ảnh, tính năng, công nghệ, link |
| Quy trình | 6 bước, bảng theo dõi tiến độ đổi theo bước khi cuộn |
| Bảng giá | Gói làm mới và gói chăm sóc hằng tháng |
| Ước tính chi phí | Khách tự chọn loại web, số trang, tính năng → ra khoảng giá, gửi thẳng vào form |
| Về tôi, cam kết, hỏi đáp | Ảnh, giới thiệu, 6 cam kết, 8 câu hỏi thường gặp |
| Liên hệ | Form soạn sẵn tin nhắn → gửi qua Zalo hoặc email |

Hiệu ứng: dải sóng bám theo chuột, vòng tròn con trỏ, nút hút nam châm, thẻ nghiêng 3D có đèn rọi, chữ hiện từng từ, bông sáng rơi, màn hình tải, giao diện sáng/tối.
Trên điện thoại và với người bật "giảm chuyển động", các hiệu ứng nặng tự tắt.

## Sửa nội dung

Hầu hết nội dung nằm trong **`assets/js/data.js`**:

- `phone`, `zalo`, `email`, `github` — thông tin liên hệ
- `projects` — danh sách dự án (thêm ảnh vào `assets/img/projects/` rồi khai báo ở đây)
- `pricing.build` / `pricing.care` — bảng giá làm mới và gói chăm sóc
- `estimator` — giá gốc và giá từng tính năng của công cụ ước tính
- `faq` — câu hỏi thường gặp

Tiêu đề, đoạn giới thiệu, số điện thoại ở nút và chân trang nằm trong `index.html` (tìm `0982269974` để đổi số).
Sau khi sửa CSS/JS, tăng số `?v=1` trong `index.html` để trình duyệt của khách tải bản mới.

## Xem trên máy

Mở `index.html` bằng trình duyệt, hoặc chạy một máy chủ tĩnh:

```bash
python -m http.server 5500
# mở http://localhost:5500
```

## Đưa lên mạng (miễn phí)

**Vercel** (khuyên dùng): vào vercel.com → Add New → Project → kéo thả cả thư mục này (hoặc đẩy lên GitHub rồi Import). Không cần cấu hình gì.

**GitHub Pages**: đẩy thư mục lên một repo → Settings → Pages → chọn nhánh `main`, thư mục `/ (root)`.

Tên miền chính: **https://ntahientech.com** (mua tại TenTen, trỏ về Vercel). Ảnh xem trước, sitemap và đường dẫn chuẩn đã gắn sẵn tên miền này; `www.ntahientech.com` tự chuyển về bản không có www.

## Cấu trúc

```
index.html            trang chính
404.html              trang báo lỗi
favicon.svg           biểu tượng tab
assets/css/style.css  giao diện
assets/js/data.js     nội dung (sửa ở đây)
assets/js/cursor.js   hiệu ứng con trỏ
assets/js/main.js     tương tác trang
assets/img/           ảnh đại diện, ảnh dự án, ảnh chia sẻ
```
