# Học Tiếng Trung — Mã nguồn web tự đăng hosting

Web tĩnh, không cần máy chủ, không cần cơ sở dữ liệu.
Tiến độ học (từ đã thuộc, lịch sử quiz) lưu trong trình duyệt của người dùng bằng localStorage.

## Các file

- `index.html` — giao diện và các tab học
- `style.css` — giao diện giấy dó, mực tàu, dấu đỏ
- `app.js` — từ điển, flashcard, luyện viết, luyện pinyin, quiz
- `data.js` — danh sách từ vựng, thêm từ mới bằng cách copy một dòng và sửa lại

## Cách đăng lên hosting

### Cách nhanh nhất: Netlify Drop
1. Nén thư mục này thành file zip.
2. Vào https://app.netlify.com/drop
3. Kéo file zip vào đó, chờ vài giây là có link web.

### Vercel
1. Đẩy thư mục này lên GitHub.
2. Vào https://vercel.com/new, chọn repo vừa đẩy.
3. Framework chọn Other, bấm Deploy.

### GitHub Pages
1. Đẩy thư mục này lên repo GitHub.
2. Vào Settings → Pages → Deploy from a branch → chọn branch main, thư mục root.
3. Lưu lại và mở link GitHub Pages được cấp.

### Hosting thường (cPanel, Hostinger…)
1. Nén thư mục này thành file zip.
2. Vào File Manager của hosting, tải zip lên thư mục `public_html`.
3. Giải nén, mở tên miền là web chạy ngay.

## Gắn AI thật — tùy chọn, không cần key Muse cũng được

Trợ lý trong web mặc định chạy nội bộ, không cần key.
Hàm `netlify/functions/muse-chat.js` sẽ ưu tiên dùng `MODEL_API_KEY` (Muse Spark) nếu có, nếu không sẽ dùng `GEMINI_API_KEY` (Google AI Studio, gói miễn phí) nếu có. Chỉ cần đặt một trong hai biến vào Netlify là đủ.

### Cách lấy key miễn phí của Google AI Studio
1. Mở https://aistudio.google.com/ , đăng nhập tài khoản Google của bạn.
2. Bấm **Get API key** (hoặc **Create API key**).
3. Nếu nó hỏi chọn project thì chọn tạo project mới, hoặc chọn project có sẵn của bạn.
4. Bấm **Create API key**, copy key ngay lúc đó. Key này cũng chỉ nên dán vào biến môi trường của Netlify, không dán vào code, không gửi qua chat.
5. Trên Netlify, vào Site configuration → Environment variables, thêm biến `GEMINI_API_KEY` với giá trị là key vừa tạo, rồi đăng lại web một lần.
6. Gói miễn phí của Google AI Studio có giới hạn số câu hỏi mỗi ngày / mỗi phút, dùng nhiều quá có thể bị giới hạn tạm thời. Bạn kiểm tra giới hạn trong trang AI Studio / Google Cloud của bạn.

## Gắn Muse Spark (Meta Model API) — tùy chọn

Trợ lý trong web mặc định chạy nội bộ, không cần key.
Muốn dùng Muse Spark thật thì làm thêm 3 bước, và KHÔNG dán key vào code hay gửi key qua chat:

1. Tạo key tại trang quản lý Meta Model API (dev.meta.ai, mục API keys), đặt tên key, copy ngay vì key chỉ hiện một lần. Key có dạng `LLM|...|...`.
2. Trên Netlify, vào Site configuration → Environment variables, thêm biến `MODEL_API_KEY` với giá trị là key vừa tạo.
3. Đăng lại bản web này lên Netlify. Function `netlify/functions/muse-chat.js` sẽ gọi `https://api.meta.ai/v1/chat/completions` với model `muse-spark-1.3`, key chỉ nằm ở phía server, không lộ ra trình duyệt.

Giá tham khảo theo tài liệu Meta: khoảng 1,25 USD / 1 triệu token đầu vào và 4,25 USD / 1 triệu token đầu ra cho bản Standard, tính theo lượng dùng thực tế. Bạn kiểm tra lại giá và billing trong dashboard của Meta trước khi dùng nhiều.

## Chạy thử trên máy của bạn trước khi đăng
Mở file `index.html` bằng trình duyệt là dùng được ngay.
Nếu trình duyệt chặn phát âm, hãy chạy qua một máy chủ tĩnh đơn giản, ví dụ mở thư mục này trong VS Code rồi dùng Live Server.

## Cách 1+2+4: AI thật, tiến độ theo Gmail, và tên miền riêng

### 1. AI thật — vì sao kéo thả file chưa chạy, và cách sửa
Đăng bằng cách kéo thả file lên Netlify chỉ đăng phần web tĩnh, không kèm hàm server
`netlify/functions/muse-chat.js`, nên AI thật qua hàm server sẽ không chạy dù đã thêm key.
Bản mới này có thêm đường dự phòng: web thử hàm server trước, nếu không được sẽ gọi
thẳng Gemini bằng key bạn lưu riêng trong trình duyệt (tab Trợ lý AI → Cài đặt AI thật).
Key này chỉ lưu trên trình duyệt của bạn, không đưa vào mã nguồn.
Cách sửa triệt để cho mọi người dùng: đưa mã nguồn lên GitHub rồi kết nối GitHub với
Netlify (Add new site → Import an existing project), Publish directory để trống hoặc `.`,
Functions directory là `netlify/functions`, không cần build command, rồi thêm biến
`GEMINI_API_KEY` vào Environment variables và đăng lại. Khi đó hàm server sẽ chạy cho mọi người.

### 2. Tiến độ theo Gmail
Từ bản này, mỗi Gmail đăng nhập trên cùng một máy sẽ có tiến độ riêng: từ đã thuộc,
lịch sử quiz được lưu theo khóa riêng cho Gmail đó. Lần đầu đăng nhập Gmail mới, web
chuyển tiến độ chung cũ sang cho Gmail đó một lần. Tiến độ vẫn chưa đồng bộ sang máy
khác, vì chưa có máy chủ tài khoản thật. Muốn đồng bộ thật cần thêm Supabase hoặc
Firebase Auth (đăng nhập bằng link gửi vào Gmail, không mật khẩu) kèm cơ sở dữ liệu,
đó là bước tiếp theo, cần bạn tạo project Supabase/Firebase và cung cấp URL + key ẩn danh.

### 4. Tên miền riêng (bỏ đuôi .netlify.app)
Web không cần sửa code gì thêm để dùng tên miền riêng. Bạn cần:
1. Chọn và mua một tên miền, ví dụ hoctiengtrung.com, yangdoo.com, hoctiengtrung.online.
   Giá tham khảo: .com khoảng 250.000–350.000đ/năm, .online/.xyz rẻ hơn năm đầu, .vn đắt hơn.
   Mua ở Namecheap, GoDaddy, Pavietnam, Matbao, hoặc bất kỳ nhà đăng ký nào bạn quen.
2. Vào Netlify → site yangdoo → Domain management → Add a domain, nhập tên miền vừa mua.
3. Làm theo hướng dẫn Netlify hiện ra: hoặc đổi nameserver của tên miền sang nameserver
   của Netlify, hoặc thêm bản ghi DNS: bản ghi A cho tên miền gốc trỏ tới IP Netlify hiện,
   và bản ghi CNAME cho www trỏ tới yangdoo.netlify.app.
4. Đợi Netlify cấp chứng chỉ HTTPS miễn phí, thường vài phút tới 24 giờ để DNS lan truyền.
   Trong lúc đó link yangdoo.netlify.app vẫn chạy song song, không bị mất.
