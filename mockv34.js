// Câu thi thử bổ sung cho v34, tự viết, HSK 2-3-4 mỗi cấp 6 câu.
// File này chạy sau mock_exams.js và gộp thêm câu vào MOCK_EXAMS trước khi app.js dùng.
(function(){
  const extra = [
  {
    "level": 2,
    "s": "Nghe",
    "q": "Nghe: chāoshì. Chọn nghĩa đúng.",
    "audio": "超市",
    "a": "Siêu thị",
    "o": [
      "Siêu thị",
      "Chợ",
      "Cửa hàng",
      "Bệnh viện"
    ],
    "options": [
      "Siêu thị",
      "Chợ",
      "Cửa hàng",
      "Bệnh viện"
    ],
    "e": "超市 là siêu thị.",
    "exp": "超市 là siêu thị."
  },
  {
    "level": 2,
    "s": "Nghe",
    "q": "Nghe: gānjìng. Chọn nghĩa đúng.",
    "audio": "干净",
    "a": "Sạch sẽ",
    "o": [
      "Sạch sẽ",
      "Bẩn",
      "Ồn ào",
      "Yên tĩnh"
    ],
    "options": [
      "Sạch sẽ",
      "Bẩn",
      "Ồn ào",
      "Yên tĩnh"
    ],
    "e": "干净 là sạch sẽ.",
    "exp": "干净 là sạch sẽ."
  },
  {
    "level": 2,
    "s": "Đọc",
    "p": "周末，我和妈妈去超市。超市里有很多水果。妈妈买了苹果和香蕉。我很喜欢吃苹果。",
    "passage": "周末，我和妈妈去超市。超市里有很多水果。妈妈买了苹果和香蕉。我很喜欢吃苹果。",
    "q": "Cuối tuần họ đã đi đâu?",
    "a": "Đi siêu thị với mẹ",
    "o": [
      "Đi siêu thị với mẹ",
      "Đi công viên",
      "Đi trường học",
      "Đi bệnh viện"
    ],
    "options": [
      "Đi siêu thị với mẹ",
      "Đi công viên",
      "Đi trường học",
      "Đi bệnh viện"
    ],
    "e": "去超市 cho biết họ đi siêu thị.",
    "exp": "去超市 cho biết họ đi siêu thị."
  },
  {
    "level": 2,
    "s": "Đọc",
    "p": "小明每天早上六点起床。他先刷牙，然后吃早饭。七点去学校。他从不迟到。",
    "passage": "小明每天早上六点起床。他先刷牙，然后吃早饭。七点去学校。他从不迟到。",
    "q": "Tiểu Minh mấy giờ đi học?",
    "a": "7 giờ",
    "o": [
      "6 giờ",
      "7 giờ",
      "8 giờ",
      "5 giờ"
    ],
    "options": [
      "6 giờ",
      "7 giờ",
      "8 giờ",
      "5 giờ"
    ],
    "e": "七点去学校 nghĩa là 7 giờ đi học.",
    "exp": "七点去学校 nghĩa là 7 giờ đi học."
  },
  {
    "level": 2,
    "s": "Viết",
    "q": "Chọn câu đúng với nghĩa 'Tôi muốn mua bộ quần áo rẻ này.'",
    "a": "我想买这件便宜的衣服。",
    "o": [
      "我想买这件便宜的衣服。",
      "我想便宜买这件衣服。",
      "我买想这件便宜的衣服。",
      "我想买衣服这件便宜。"
    ],
    "options": [
      "我想买这件便宜的衣服。",
      "我想便宜买这件衣服。",
      "我买想这件便宜的衣服。",
      "我想买衣服这件便宜。"
    ],
    "e": "Trật tự đúng: chủ ngữ + 想 + 买 + định ngữ + danh từ.",
    "exp": "Trật tự đúng: chủ ngữ + 想 + 买 + định ngữ + danh từ."
  },
  {
    "level": 2,
    "s": "Viết",
    "q": "Điền từ đúng: 他___自行车去上班。",
    "a": "骑",
    "o": [
      "骑",
      "开",
      "坐",
      "走"
    ],
    "options": [
      "骑",
      "开",
      "坐",
      "走"
    ],
    "e": "骑自行车 là đạp xe.",
    "exp": "骑自行车 là đạp xe."
  },
  {
    "level": 3,
    "s": "Nghe",
    "q": "Nghe: jiàgé. Chọn nghĩa đúng.",
    "audio": "价格",
    "a": "Giá cả",
    "o": [
      "Giá cả",
      "Chất lượng",
      "Số lượng",
      "Thời gian"
    ],
    "options": [
      "Giá cả",
      "Chất lượng",
      "Số lượng",
      "Thời gian"
    ],
    "e": "价格 là giá cả.",
    "exp": "价格 là giá cả."
  },
  {
    "level": 3,
    "s": "Nghe",
    "q": "Nghe: tiānqì. Chọn nghĩa đúng.",
    "audio": "天气",
    "a": "Thời tiết",
    "o": [
      "Thời tiết",
      "Mưa",
      "Gió",
      "Nắng"
    ],
    "options": [
      "Thời tiết",
      "Mưa",
      "Gió",
      "Nắng"
    ],
    "e": "天气 là thời tiết.",
    "exp": "天气 là thời tiết."
  },
  {
    "level": 3,
    "s": "Đọc",
    "p": "昨天我去图书馆借书。图书馆里有很多书。我借了一本关于历史的书。回家以后，我认真地读了两个小时。",
    "passage": "昨天我去图书馆借书。图书馆里有很多书。我借了一本关于历史的书。回家以后，我认真地读了两个小时。",
    "q": "Hôm qua tác giả đã làm gì ở thư viện?",
    "a": "Mượn một cuốn sách lịch sử",
    "o": [
      "Mượn một cuốn sách lịch sử",
      "Mua sách",
      "Trả sách",
      "Đọc báo"
    ],
    "options": [
      "Mượn một cuốn sách lịch sử",
      "Mua sách",
      "Trả sách",
      "Đọc báo"
    ],
    "e": "借了一本关于历史的书 cho biết điều này.",
    "exp": "借了一本关于历史的书 cho biết điều này."
  },
  {
    "level": 3,
    "s": "Đọc",
    "p": "我家附近有一家新饭店。饭店的菜很好吃，价格也不贵。周末，很多人去那里吃饭。",
    "passage": "我家附近有一家新饭店。饭店的菜很好吃，价格也不贵。周末，很多人去那里吃饭。",
    "q": "Nhà hàng mới gần nhà tác giả thế nào?",
    "a": "Đồ ăn ngon, giá không đắt",
    "o": [
      "Đồ ăn ngon, giá không đắt",
      "Đồ ăn đắt, không ngon",
      "Rất xa",
      "Rất nhỏ"
    ],
    "options": [
      "Đồ ăn ngon, giá không đắt",
      "Đồ ăn đắt, không ngon",
      "Rất xa",
      "Rất nhỏ"
    ],
    "e": "菜很好吃，价格也不贵 cho biết điều này.",
    "exp": "菜很好吃，价格也不贵 cho biết điều này."
  },
  {
    "level": 3,
    "s": "Viết",
    "q": "Chọn câu đúng với nghĩa 'Ngoài tiếng Trung, anh ấy còn biết tiếng Anh.' (cấu trúc: 除了…，还…)",
    "a": "除了汉语，他还会英语。",
    "o": [
      "除了汉语，他还会英语。",
      "除了汉语，他还英语会。",
      "除了会英语，他汉语还。",
      "除了汉语会，他还英语。"
    ],
    "options": [
      "除了汉语，他还会英语。",
      "除了汉语，他还英语会。",
      "除了会英语，他汉语还。",
      "除了汉语会，他还英语。"
    ],
    "e": "Cấu trúc đúng: 除了…，还…",
    "exp": "Cấu trúc đúng: 除了…，还…"
  },
  {
    "level": 3,
    "s": "Viết",
    "q": "Điền từ đúng: ___天气不好，我们还是去爬山了。",
    "a": "虽然",
    "o": [
      "虽然",
      "因为",
      "如果",
      "但是"
    ],
    "options": [
      "虽然",
      "因为",
      "如果",
      "但是"
    ],
    "e": "虽然…，还是… diễn tả nhượng bộ.",
    "exp": "虽然…，还是… diễn tả nhượng bộ."
  },
  {
    "level": 4,
    "s": "Nghe",
    "q": "Nghe: fāzhǎn. Chọn nghĩa đúng.",
    "audio": "发展",
    "a": "Phát triển",
    "o": [
      "Phát triển",
      "Thay đổi",
      "Giảm",
      "Tăng"
    ],
    "options": [
      "Phát triển",
      "Thay đổi",
      "Giảm",
      "Tăng"
    ],
    "e": "发展 là phát triển.",
    "exp": "发展 là phát triển."
  },
  {
    "level": 4,
    "s": "Nghe",
    "q": "Nghe: yǐngxiǎng. Chọn nghĩa đúng.",
    "audio": "影响",
    "a": "Ảnh hưởng",
    "o": [
      "Ảnh hưởng",
      "Quyết định",
      "Thay đổi",
      "Bảo vệ"
    ],
    "options": [
      "Ảnh hưởng",
      "Quyết định",
      "Thay đổi",
      "Bảo vệ"
    ],
    "e": "影响 là ảnh hưởng.",
    "exp": "影响 là ảnh hưởng."
  },
  {
    "level": 4,
    "s": "Đọc",
    "p": "随着城市的发展，越来越多的人住进了高楼。交通越来越方便，但是空气问题也越来越重要。政府正在想办法，让城市更干净，更适合生活。",
    "passage": "随着城市的发展，越来越多的人住进了高楼。交通越来越方便，但是空气问题也越来越重要。政府正在想办法，让城市更干净，更适合生活。",
    "q": "Vấn đề chính được nhắc đến là gì?",
    "a": "Giao thông tiện lợi nhưng vấn đề không khí ngày càng quan trọng",
    "o": [
      "Giao thông tiện lợi nhưng vấn đề không khí ngày càng quan trọng",
      "Thành phố không có nhà cao tầng",
      "Mọi người không thích sống ở thành phố",
      "Chính phủ không làm gì"
    ],
    "options": [
      "Giao thông tiện lợi nhưng vấn đề không khí ngày càng quan trọng",
      "Thành phố không có nhà cao tầng",
      "Mọi người không thích sống ở thành phố",
      "Chính phủ không làm gì"
    ],
    "e": "空气问题也越来越重要 là ý chính.",
    "exp": "空气问题也越来越重要 là ý chính."
  },
  {
    "level": 4,
    "s": "Đọc",
    "p": "学习一门外语需要时间和耐心。只要每天坚持一点点，慢慢地就会看到进步。不要害怕犯错误，错误也是学习的一部分。",
    "passage": "学习一门外语需要时间和耐心。只要每天坚持一点点，慢慢地就会看到进步。不要害怕犯错误，错误也是学习的一部分。",
    "q": "Theo đoạn văn, học ngoại ngữ cần gì nhất?",
    "a": "Thời gian, kiên nhẫn và kiên trì mỗi ngày",
    "o": [
      "Thời gian, kiên nhẫn và kiên trì mỗi ngày",
      "Chỉ cần sách tốt",
      "Chỉ cần giáo viên giỏi",
      "Học thật nhanh trong một tuần"
    ],
    "options": [
      "Thời gian, kiên nhẫn và kiên trì mỗi ngày",
      "Chỉ cần sách tốt",
      "Chỉ cần giáo viên giỏi",
      "Học thật nhanh trong một tuần"
    ],
    "e": "需要时间和耐心，坚持一点点 là ý chính.",
    "exp": "需要时间和耐心，坚持一点点 là ý chính."
  },
  {
    "level": 4,
    "s": "Viết",
    "q": "Chọn câu đúng với nghĩa 'Chỉ có nỗ lực học tập mới đạt thành tích tốt.' (cấu trúc: 只有…，才…)",
    "a": "只有努力学习，才能取得好成绩。",
    "o": [
      "只有努力学习，才能取得好成绩。",
      "只有努力学习，才取得好成绩吗？",
      "努力学习只有，才能取得好成绩。",
      "只有学习努力，才能好成绩取得。"
    ],
    "options": [
      "只有努力学习，才能取得好成绩。",
      "只有努力学习，才取得好成绩吗？",
      "努力学习只有，才能取得好成绩。",
      "只有学习努力，才能好成绩取得。"
    ],
    "e": "Cấu trúc đúng: 只有…，才…",
    "exp": "Cấu trúc đúng: 只有…，才…"
  },
  {
    "level": 4,
    "s": "Viết",
    "q": "Điền từ đúng: 他不但会汉语，___会英语。",
    "a": "而且",
    "o": [
      "而且",
      "但是",
      "所以",
      "如果"
    ],
    "options": [
      "而且",
      "但是",
      "所以",
      "如果"
    ],
    "e": "不但…，而且… là cặp liên từ cố định.",
    "exp": "不但…，而且… là cặp liên từ cố định."
  }
];
  extra.forEach(q=>{
    const exam = MOCK_EXAMS.find(x=>x.level===q.level);
    if(exam) exam.questions.push({s:q.s, q:q.q, a:q.a, o:q.o, e:q.e, p:q.p, audio:q.audio});
  });
})();
