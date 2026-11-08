/* ============================================================
   NỘI DUNG WEBSITE — sửa thông tin ở file này là đủ.
   Giá, dự án, câu hỏi thường gặp… đều được trang đọc từ đây.
   ============================================================ */
window.SITE = {
  brand: 'Ntahien Tech',
  owner: 'Nguyễn Thế An',
  phone: '0982269974',
  phoneDisplay: '0982 269 974',
  zalo: 'https://zalo.me/0982269974',
  email: 'ann079771@gmail.com',
  github: 'https://github.com/nguyenthean38',
  location: 'TP. Hồ Chí Minh · nhận dự án toàn quốc',

  /* ---------- DỰ ÁN ---------- */
  // cat: web | shop | app | mobile | ai
  projects: [
    {
      id: 'luna',
      title: 'LUNA Nail & Beauty',
      kind: 'Website doanh nghiệp dịch vụ',
      cat: ['web'],
      year: '2026',
      cover: 'assets/img/projects/luna.webp',
      shots: ['assets/img/projects/luna.webp'],
      accent: '#c0707f',
      summary: 'Website tiệm nail hoàn chỉnh: giới thiệu, bảng giá, bộ sưu tập mẫu, đặt lịch online và trang quản trị để chủ tiệm tự cập nhật.',
      features: [
        'Khách đặt lịch online theo dịch vụ, thợ và khung giờ còn trống',
        'Trang quản trị tiếng Việt: lịch hẹn, bảng giá, mẫu nail, ưu đãi, đánh giá',
        'Tài khoản lễ tân và chủ tiệm phân quyền riêng',
        'Chuẩn SEO, nút Zalo / Messenger / gọi nhanh, tải nhanh trên điện thoại',
        '109 bài kiểm thử tự động, cơ sở dữ liệu SQLite có sao lưu'
      ],
      tech: ['Node.js', 'Express', 'EJS', 'SQLite'],
      links: []
    },
    {
      id: 'khoai',
      title: 'Shop Cây Chuối',
      kind: 'Website bán hàng tự động',
      cat: ['shop', 'ai'],
      year: '2026',
      cover: 'assets/img/projects/khoai.webp',
      shots: ['assets/img/projects/khoai.webp', 'assets/img/projects/khoai-2.webp'],
      accent: '#16a34a',
      summary: 'Cửa hàng tài khoản số (ChatGPT, Claude, Canva…) thay cho bot Telegram cũ: khách quét VietQR là nhận hàng tự động trong vài giây.',
      features: [
        'Thanh toán VietQR, tự xác nhận qua webhook ngân hàng (SePay / PayOS)',
        'Giao hàng tự động từ kho, bảo hành và đổi trả ngay trên web',
        'Trang quản trị: kho hàng, đơn hàng, khách hàng, mã giảm giá',
        '27 kịch bản kiểm thử end-to-end trên máy tính và điện thoại'
      ],
      tech: ['Next.js 15', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'Framer Motion'],
      links: []
    },
    {
      id: 'thean-store',
      title: 'Thean Store',
      kind: 'Thương mại điện tử thời trang',
      cat: ['shop', 'web'],
      year: '2026',
      cover: 'assets/img/projects/thean-store.webp',
      shots: ['assets/img/projects/thean-store.webp', 'assets/img/projects/thean-store-2.webp'],
      accent: '#111827',
      summary: 'Website bán đồ thể thao phong cách thương hiệu lớn: danh mục, chi tiết sản phẩm, giỏ hàng, thanh toán và chương trình thành viên.',
      features: [
        'Danh mục có bộ lọc, chọn size / màu, gợi ý sản phẩm',
        'Giỏ hàng, thanh toán nhiều bước, lịch sử đơn hàng',
        'Chương trình khách hàng thân thiết “Thean Club”',
        'Giao diện tiếng Việt, tối ưu cho điện thoại'
      ],
      tech: ['React 19', 'Tailwind CSS v4', 'Vite'],
      links: [
        { label: 'Xem trực tiếp', url: 'https://thean-store.vercel.app' },
        { label: 'Mã nguồn', url: 'https://github.com/nguyenthean38/TheAn-Store' }
      ]
    },
    {
      id: 'mach',
      title: 'Mạch — Tài chính doanh nghiệp',
      kind: 'Web app quản lý tài chính doanh nghiệp',
      cat: ['app', 'ai'],
      year: '2026',
      cover: 'assets/img/projects/mach.webp',
      shots: ['assets/img/projects/mach.webp', 'assets/img/projects/mach-2.webp', 'assets/img/projects/mach-3.webp'],
      accent: '#138f66',
      summary: 'Phần mềm quản lý tài chính cho doanh nghiệp vừa và nhỏ: kết nối tài khoản ngân hàng công ty, duyệt chi, quản lý thẻ, xuất hoá đơn GTGT và sổ sách kế toán trong một nơi.',
      features: [
        'Tổng quan dòng tiền, bảng giao dịch có bộ lọc, phân loại hàng loạt, xuất CSV',
        'Lệnh chi duyệt nhiều cấp có OTP, uỷ nhiệm chi và VietQR',
        'Quản lý thẻ doanh nghiệp, ngân sách nhóm, hoàn ứng',
        'Hoá đơn bán ra xem trước trực tiếp, kế toán theo Thông tư 200',
        'Trợ lý AI trả lời về dòng tiền, bảng lệnh Ctrl K, giao diện sáng/tối'
      ],
      tech: ['React 19', 'Tailwind CSS v4', 'Vite', 'Zustand', 'SVG Charts'],
      links: [
        { label: 'Mã nguồn', url: 'https://github.com/nguyenthean38/Mecury' }
      ]
    },
    {
      id: 'nhip',
      title: 'Nhịp — Đầu tư',
      kind: 'Web app nghiên cứu cổ phiếu',
      cat: ['app'],
      year: '2026',
      cover: 'assets/img/projects/nhip.webp',
      shots: ['assets/img/projects/nhip.webp', 'assets/img/projects/nhip-2.webp'],
      accent: '#f97316',
      summary: 'Ứng dụng web cho nhà đầu tư Việt Nam: bản tin thị trường, phân tích doanh nghiệp, lịch cổ tức, danh mục và bộ lọc cổ phiếu.',
      features: [
        'Bảng điều khiển VN-Index, màu trần / sàn / tham chiếu theo chuẩn Việt Nam',
        'Trang cổ phiếu: biểu đồ, báo cáo tài chính, khuyến nghị',
        'Danh mục đầu tư, bộ lọc, so sánh mã, lịch sự kiện',
        'Tìm kiếm nhanh bằng bàn phím (command palette)'
      ],
      tech: ['React 19', 'Tailwind CSS v4', 'Vite', 'SVG Charts'],
      links: [
        { label: 'Xem trực tiếp', url: 'https://thean-investment.vercel.app' },
        { label: 'Mã nguồn', url: 'https://github.com/nguyenthean38/TheAn-Investment' }
      ]
    },
    {
      id: 'lumi',
      title: 'Lumi Store',
      kind: 'Web bán hàng + quản trị',
      cat: ['shop'],
      year: '2026',
      cover: 'assets/img/projects/lumi.webp',
      shots: ['assets/img/projects/lumi.webp', 'assets/img/projects/lumi-2.webp'],
      accent: '#8b5cf6',
      summary: 'Cửa hàng online đầy đủ frontend và backend: khách mua hàng, chủ shop quản lý sản phẩm, đơn hàng và doanh thu trên một trang quản trị.',
      features: [
        'Trang sản phẩm, tìm kiếm, giỏ hàng, đặt hàng',
        'Dashboard doanh thu, quản lý đơn hàng và sản phẩm',
        'Đăng nhập bảo mật bằng JWT',
        'Backend Express + SQLite, dễ triển khai lên VPS'
      ],
      tech: ['React', 'Vite', 'Express', 'SQLite', 'JWT'],
      links: [
        { label: 'Mã nguồn', url: 'https://github.com/nguyenthean38/lumi-store' }
      ]
    },
    {
      id: 'bepxanh',
      title: 'Bếp Xanh',
      kind: 'App đi chợ có trợ lý AI',
      cat: ['mobile', 'ai'],
      year: '2026',
      mobile: true,
      cover: 'assets/img/projects/bepxanh-1.webp',
      shots: ['assets/img/projects/bepxanh-1.webp', 'assets/img/projects/bepxanh-2.webp', 'assets/img/projects/bepxanh-3.webp'],
      accent: '#15803d',
      summary: 'Ứng dụng đặt đồ chợ giao trong ngày. Trợ lý AI biến “canh chua cá cho 4 người” thành công thức và giỏ hàng đầy đủ.',
      features: [
        'Duyệt cửa hàng, giỏ hàng, chọn giờ giao, theo dõi đơn theo thời gian thực',
        'AI Gemini: món ăn → giỏ hàng, đọc ảnh danh sách đi chợ, chỉ chọn hàng có thật',
        'Quy trình n8n: mô phỏng người đi chợ, gợi ý khuyến mãi, nhập hàng từ Google Sheets',
        '122 bài kiểm thử tự động (giao diện, SQL, AI, n8n) chạy CI'
      ],
      tech: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Gemini', 'n8n'],
      links: [
        { label: 'Mã nguồn', url: 'https://github.com/nguyenthean38/bep-xanh' }
      ]
    },
    {
      id: 'vietgig',
      title: 'VietGig',
      kind: 'App sàn dịch vụ freelance',
      cat: ['mobile'],
      year: '2026',
      mobile: true,
      cover: 'assets/img/projects/vietgig-1.webp',
      shots: ['assets/img/projects/vietgig-1.webp', 'assets/img/projects/vietgig-2.webp', 'assets/img/projects/vietgig-3.webp'],
      accent: '#1dbf73',
      summary: 'Sàn kết nối người thuê với freelancer kiểu Fiverr, 57 màn hình tiếng Việt và tiếng Anh, giao diện sáng / tối.',
      features: [
        'Tìm dịch vụ có bộ lọc, so sánh 3 gói, đặt hàng kèm tuỳ chọn',
        'Theo dõi đơn, nhắn tin, gửi đề xuất riêng, đánh giá và tip',
        'Bảng điều khiển người bán với biểu đồ thu nhập',
        '125 bài kiểm thử tự động + CI GitHub Actions'
      ],
      tech: ['Flutter', 'Dart', 'Provider', 'GoRouter', 'Firebase-ready'],
      links: [
        { label: 'Mã nguồn', url: 'https://github.com/nguyenthean38/VietGig' }
      ]
    },
    {
      id: 'telegram-bot',
      title: 'Bot giao việc Telegram',
      kind: 'Tự động hoá cho doanh nghiệp nhỏ',
      cat: ['ai'],
      year: '2025',
      mock: 'chat',
      accent: '#229ed9',
      summary: 'Dự án freelance thực tế: quản lý giao việc qua chat, nhân viên cập nhật bằng nút bấm, hệ thống tự nhắc hạn và gửi báo cáo mỗi ngày.',
      features: [
        'Quản lý giao việc ngay trong nhóm Telegram',
        'Nhân viên cập nhật trạng thái bằng nút bấm, không cần cài app',
        'Tự động nhắc hạn, cảnh báo trễ hạn, báo cáo tiến độ hằng ngày',
        'Dữ liệu lưu trên Google Sheets, chủ doanh nghiệp xem được ngay'
      ],
      tech: ['n8n', 'Telegram Bot API', 'Google Sheets', 'Webhook'],
      links: []
    }
  ],

  /* ---------- BẢNG GIÁ ---------- */
  pricing: {
    build: [
      {
        name: 'Landing Page',
        tag: 'Chạy quảng cáo',
        price: '2.900.000',
        unit: 'đ / trọn gói',
        time: '5 – 7 ngày',
        desc: 'Một trang bán hàng thuyết phục cho chiến dịch, sản phẩm mới, sự kiện.',
        items: ['Thiết kế riêng theo thương hiệu', 'Form đăng ký, nút Zalo / gọi điện', 'Gắn Facebook Pixel, Google Analytics', 'Tối ưu tốc độ và hiển thị điện thoại', 'Tặng 3 tháng chăm sóc']
      },
      {
        name: 'Website doanh nghiệp',
        tag: 'Phổ biến nhất',
        hot: true,
        price: '5.900.000',
        unit: 'đ / trọn gói',
        time: '10 – 14 ngày',
        desc: 'Bộ mặt chính thức trên Google cho công ty, cửa hàng, tiệm dịch vụ.',
        items: ['5 – 8 trang: giới thiệu, dịch vụ, dự án, tin tức, liên hệ', 'Trang quản trị tiếng Việt, tự đăng bài', 'SEO cơ bản, sitemap, Google Maps', 'Đặt lịch / nhận yêu cầu báo giá online', 'Tặng 6 tháng chăm sóc']
      },
      {
        name: 'Website bán hàng',
        tag: 'Kênh bán riêng',
        price: '9.900.000',
        unit: 'đ / trọn gói',
        time: '3 – 4 tuần',
        desc: 'Kênh bán đứng tên anh chị, không phụ thuộc sàn, không mất phí hoa hồng.',
        items: ['Danh mục, giỏ hàng, mã giảm giá', 'Thanh toán VietQR tự xác nhận', 'Quản lý đơn, kho, khách hàng', 'Báo đơn mới qua Zalo / Telegram', 'Tặng 6 tháng chăm sóc']
      },
      {
        name: 'Web App · App · AI',
        tag: 'Theo yêu cầu',
        price: '15.000.000',
        prefix: 'từ',
        unit: 'đ / dự án',
        time: 'Theo phạm vi',
        desc: 'Phần mềm quản lý, ứng dụng di động, chatbot và quy trình tự động hoá.',
        items: ['Phân tích nghiệp vụ, thiết kế cơ sở dữ liệu', 'App iOS / Android (Flutter, React Native)', 'Tích hợp AI: ChatGPT, Claude, Gemini', 'Tự động hoá n8n, Google Sheets, Telegram', 'Kiểm thử tự động trước khi bàn giao']
      }
    ],
    care: [
      {
        name: 'Cơ bản',
        tag: 'Giữ web luôn chạy',
        price: '390.000',
        unit: 'đ / tháng',
        time: 'Phản hồi trong 24h',
        desc: 'Cho website giới thiệu ít thay đổi.',
        items: ['Theo dõi website hoạt động 24/7', 'Sao lưu mỗi tuần', 'Sửa lỗi kỹ thuật miễn phí', '2 lần cập nhật nội dung / tháng']
      },
      {
        name: 'Tăng trưởng',
        tag: 'Phổ biến nhất',
        hot: true,
        price: '890.000',
        unit: 'đ / tháng',
        time: 'Phản hồi trong 8h',
        desc: 'Cho website cần lên Google và có khách đều.',
        items: ['Mọi quyền lợi gói Cơ bản', 'Sao lưu mỗi đêm', '4 bài viết chuẩn SEO / tháng', 'Báo cáo lượt truy cập, khách liên hệ', 'Chỉnh sửa nhỏ không giới hạn']
      },
      {
        name: 'Toàn diện',
        tag: 'Cho cửa hàng online',
        price: '1.590.000',
        unit: 'đ / tháng',
        time: 'Ưu tiên trong 4h',
        desc: 'Cho web bán hàng, web app có nhiều đơn và dữ liệu.',
        items: ['Mọi quyền lợi gói Tăng trưởng', 'Giám sát bảo mật, chặn truy cập lạ', 'Thêm tính năng nhỏ mỗi tháng', 'Duy trì quy trình tự động hoá', 'Họp tổng kết hằng tháng']
      }
    ]
  },

  /* ---------- ƯỚC TÍNH CHI PHÍ ---------- */
  estimator: {
    types: [
      { id: 'landing', label: 'Landing page', base: 2900000, pages: 1, days: [5, 7] },
      { id: 'company', label: 'Website doanh nghiệp', base: 5900000, pages: 6, days: [10, 14] },
      { id: 'shop', label: 'Website bán hàng', base: 9900000, pages: 10, days: [21, 28] },
      { id: 'webapp', label: 'Web app / phần mềm', base: 15000000, pages: 12, days: [30, 45] },
      { id: 'mobile', label: 'App di động', base: 20000000, pages: 15, days: [35, 60] }
    ],
    perPage: 350000,
    addons: [
      { id: 'admin', label: 'Trang quản trị tự đăng bài / sản phẩm', price: 1500000 },
      { id: 'vietqr', label: 'Thanh toán VietQR tự xác nhận', price: 2000000 },
      { id: 'booking', label: 'Đặt lịch / đặt bàn online', price: 1500000 },
      { id: 'lang', label: 'Song ngữ Việt – Anh', price: 1500000 },
      { id: 'chatbot', label: 'Chatbot AI trả lời khách', price: 3000000 },
      { id: 'notify', label: 'Báo đơn qua Zalo / Telegram', price: 1000000 },
      { id: 'seo', label: 'Viết nội dung chuẩn SEO', price: 1200000 }
    ]
  },

  /* ---------- CÂU HỎI THƯỜNG GẶP ---------- */
  faq: [
    {
      q: 'Làm một website mất bao lâu?',
      a: 'Landing page khoảng 5 – 7 ngày, website doanh nghiệp 10 – 14 ngày, website bán hàng 3 – 4 tuần. Mỗi tuần anh chị đều nhận được link demo để xem tiến độ thật, không phải chờ đến cuối.'
    },
    {
      q: 'Tôi có sở hữu website và mã nguồn không?',
      a: 'Có, 100%. Tên miền, hosting, tài khoản quản trị và toàn bộ mã nguồn đều đứng tên anh chị. Sau này anh chị muốn tự quản lý hay đổi người làm cũng không bị “giữ” lại.'
    },
    {
      q: 'Ngoài tiền làm web, mỗi năm tốn thêm gì?',
      a: 'Thường chỉ có tên miền (khoảng 300.000 – 500.000đ/năm với .com hoặc .vn) và hosting (từ 0đ với web tĩnh, khoảng 1 – 3 triệu/năm với web có quản trị). Tôi sẽ tư vấn phương án rẻ nhất phù hợp với nhu cầu, không bán kèm thứ không cần.'
    },
    {
      q: 'Thanh toán như thế nào?',
      a: 'Chia 3 đợt: 30% khi bắt đầu, 40% khi duyệt giao diện và demo chạy được, 30% còn lại khi bàn giao. Anh chị chỉ trả tiếp khi đã thấy sản phẩm thật.'
    },
    {
      q: 'Sau khi bàn giao, website bị lỗi thì sao?',
      a: 'Lỗi kỹ thuật do tôi gây ra được sửa miễn phí trong 12 tháng. Ngoài ra anh chị có thể chọn gói chăm sóc hằng tháng để được sao lưu, cập nhật nội dung và hỗ trợ ưu tiên.'
    },
    {
      q: 'Tôi không rành công nghệ, có tự sửa nội dung được không?',
      a: 'Được. Trang quản trị viết bằng tiếng Việt, đổi giá, đăng bài, thêm sản phẩm chỉ như soạn tin nhắn. Kèm theo là video hướng dẫn quay riêng cho website của anh chị.'
    },
    {
      q: 'Website có lên Google không?',
      a: 'Mọi website đều được làm chuẩn SEO kỹ thuật: tốc độ tải nhanh, cấu trúc tiêu đề, sitemap, dữ liệu có cấu trúc, đăng ký Google Search Console và Google Maps. Muốn lên top từ khoá cạnh tranh thì cần thêm nội dung đều đặn — gói Tăng trưởng hỗ trợ việc này.'
    },
    {
      q: 'Tôi ở tỉnh khác, làm việc online được không?',
      a: 'Được. Toàn bộ quá trình trao đổi qua Zalo, Google Meet và link demo. Tôi đang ở TP. Hồ Chí Minh, có thể gặp trực tiếp nếu anh chị ở gần.'
    }
  ]
};
