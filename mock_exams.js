// Đề thi thử mô phỏng theo cấu trúc HSK thật: Nghe – Đọc – Viết/Ngữ pháp.
// Mỗi cấp có 9 câu: 3 nghe, 3 đọc, 3 viết/ngữ pháp. Đây là đề mô phỏng để ôn,
// không phải đề thi chính thức của Hanban, đáp án và giải thích ngắn đi kèm để tự chấm.
const MOCK_EXAMS = [
{level:1, questions:[
  {s:"Nghe", q:"Nghe và chọn nghĩa đúng.", audio:"你好", o:["Xin chào","Cảm ơn","Tạm biệt","Xin lỗi"], a:"Xin chào", e:"你好 nghĩa là xin chào."},
  {s:"Nghe", q:"Nghe và chọn nghĩa đúng.", audio:"谢谢", o:["Tạm biệt","Cảm ơn","Xin chào","Tôi là học sinh"], a:"Cảm ơn", e:"谢谢 nghĩa là cảm ơn."},
  {s:"Nghe", q:"Nghe và chọn chữ Hán đúng.", audio:"老师", o:["学生","老师","朋友","中国"], a:"老师", e:"老师 là giáo viên."},
  {s:"Đọc", p:"我叫小明。我是中国人。我是学生。我喜欢汉语。", q:"Tiểu Minh là người nước nào và làm gì?", o:["Người Việt Nam, là giáo viên","Người Trung Quốc, là học sinh","Người Trung Quốc, là bác sĩ","Người Việt Nam, là học sinh"], a:"Người Trung Quốc, là học sinh", e:"我是学生 và 我是中国人 cho biết điều này."},
  {s:"Đọc", p:"我叫小明。我是中国人。我是学生。我喜欢汉语。", q:"Tiểu Minh thích gì?", o:["Tiếng Anh","Tiếng Trung","Toán học","Âm nhạc"], a:"Tiếng Trung", e:"我喜欢汉语 nghĩa là tôi thích tiếng Trung."},
  {s:"Đọc", p:"我叫小明。我是中国人。我是学生。我喜欢汉语。", q:"“我是学生” có nghĩa là gì?", o:["Tôi là giáo viên","Tôi là học sinh","Tôi là bạn của bạn","Tôi thích học"], a:"Tôi là học sinh", e:"学生 là học sinh, sinh viên."},
  {s:"Viết", q:"Chọn câu đúng.", o:["我学生是。","是我学生。","我是学生。","学生我是。"], a:"我是学生。", e:"Trật tự đúng: chủ ngữ + 是 + danh từ."},
  {s:"Viết", q:"Điền từ đúng: 我___中国人。", o:["是","在","有","去"], a:"是", e:"是 dùng để nói “là”."},
  {s:"Viết", q:"Chọn câu hỏi đúng với nghĩa “Bạn khỏe không?”", o:["你叫什么？","你好吗？","你是哪国人？","你吃什么？"], a:"你好吗？", e:"你好吗 là câu hỏi thăm sức khỏe."}
]},
{level:2, questions:[
  {s:"Nghe", q:"Nghe và chọn nghĩa đúng.", audio:"朋友", o:["Gia đình","Bạn bè","Giáo viên","Học sinh"], a:"Bạn bè", e:"朋友 là bạn bè."},
  {s:"Nghe", q:"Nghe và chọn nghĩa đúng.", audio:"昨天", o:["Hôm nay","Ngày mai","Hôm qua","Ngày kia"], a:"Hôm qua", e:"昨天 là hôm qua."},
  {s:"Nghe", q:"Nghe và chọn nghĩa đúng.", audio:"电影", o:["Âm nhạc","Phim","Sách","Ảnh"], a:"Phim", e:"电影 là phim."},
  {s:"Đọc", p:"昨天我和朋友去看电影。电影很好看。我们都很喜欢。明天我们想去公园。", q:"Hôm qua họ đã làm gì?", o:["Đi công viên","Đi xem phim với bạn","Đi học","Đi mua sách"], a:"Đi xem phim với bạn", e:"昨天我和朋友去看电影 cho biết điều này."},
  {s:"Đọc", p:"昨天我和朋友去看电影。电影很好看。我们都很喜欢。明天我们想去公园。", q:"Bộ phim như thế nào?", o:["Rất hay","Rất chán","Rất dài","Rất buồn"], a:"Rất hay", e:"电影很好看 nghĩa là phim rất hay."},
  {s:"Đọc", p:"昨天我和朋友去看电影。电影很好看。我们都很喜欢。明天我们想去公园。", q:"Ngày mai họ muốn đi đâu?", o:["Đi xem phim","Đi công viên","Đi về nhà","Đi trường học"], a:"Đi công viên", e:"明天我们想去公园 nghĩa là ngày mai muốn đi công viên."},
  {s:"Viết", q:"Điền từ đúng: 我想___汉语。", o:["学习","吃","喝","睡觉"], a:"学习", e:"学习汉语 là học tiếng Trung."},
  {s:"Viết", q:"Chọn câu đúng.", o:["我喜欢唱歌。","我唱歌喜欢。","喜欢我唱歌。","唱歌我喜欢。"], a:"我喜欢唱歌。", e:"Trật tự đúng: chủ ngữ + 喜欢 + động từ."},
  {s:"Viết", q:"Điền từ đúng: 他___中国来。", o:["从","在","到","和"], a:"从", e:"从中国来 nghĩa là đến từ Trung Quốc."}
]},
{level:3, questions:[
  {s:"Nghe", q:"Nghe câu và chọn nghĩa đúng.", audio:"我每天早上跑步。", o:["Tôi mỗi sáng chạy bộ","Tôi mỗi tối đọc sách","Tôi thích ăn cơm","Tôi đi học bằng xe buýt"], a:"Tôi mỗi sáng chạy bộ", e:"每天早上跑步 là mỗi sáng chạy bộ."},
  {s:"Nghe", q:"Nghe câu và chọn nghĩa đúng.", audio:"他正在学习汉语。", o:["Anh ấy đang ngủ","Anh ấy đang học tiếng Trung","Anh ấy đang ăn cơm","Anh ấy đang xem phim"], a:"Anh ấy đang học tiếng Trung", e:"正在学习汉语 là đang học tiếng Trung."},
  {s:"Nghe", q:"Nghe câu và chọn nghĩa đúng.", audio:"请说慢一点。", o:["Xin nói nhanh lên","Xin nói chậm một chút","Xin nói to lên","Xin đừng nói"], a:"Xin nói chậm một chút", e:"说慢一点 là nói chậm một chút."},
  {s:"Đọc", p:"学习汉语不容易，但是很有意思。我每天练习听、说、读、写。老师说，多练习才能说得好。", q:"Học tiếng Trung như thế nào?", o:["Rất dễ và rất chán","Không dễ nhưng rất thú vị","Rất khó và không thú vị","Chỉ cần học một ngày"], a:"Không dễ nhưng rất thú vị", e:"不容易，但是很有意思 cho biết điều này."},
  {s:"Đọc", p:"学习汉语不容易，但是很有意思。我每天练习听、说、读、写。老师说，多练习才能说得好。", q:"Tác giả mỗi ngày luyện gì?", o:["Chỉ luyện nghe","Chỉ luyện viết","Nghe, nói, đọc, viết","Chỉ luyện nói"], a:"Nghe, nói, đọc, viết", e:"练习听、说、读、写 liệt kê đủ 4 kỹ năng."},
  {s:"Đọc", p:"学习汉语不容易，但是很有意思。我每天练习听、说、读、写。老师说，多练习才能说得好。", q:"Thầy cô nói gì?", o:["Không cần luyện tập","Luyện nhiều mới nói tốt được","Chỉ cần học từ mới","Không cần học ngữ pháp"], a:"Luyện nhiều mới nói tốt được", e:"多练习才能说得好 nghĩa là luyện nhiều mới nói tốt được."},
  {s:"Viết", q:"Điền từ đúng: 我想___汉语水平。", o:["提高","降低","放弃","忘记"], a:"提高", e:"提高水平 là nâng cao trình độ."},
  {s:"Viết", q:"Chọn câu đúng.", o:["虽然很累，但是他还是来了。","很累虽然，但是他还是来了。","虽然他还是来了，但是很累。","他还是来了，虽然很累但是。"], a:"虽然很累，但是他还是来了。", e:"Cấu trúc đúng: 虽然…，但是…"},
  {s:"Viết", q:"Sắp xếp thành câu đúng, chọn đáp án đúng.", o:["明天去北京我决定。","我决定明天去北京。","去北京我决定明天。","明天我北京去决定。"], a:"我决定明天去北京。", e:"Trật tự đúng: chủ ngữ + 决定 + thời gian + đi đâu."}
]},
{level:4, questions:[
  {s:"Nghe", q:"Nghe câu và chọn nghĩa đúng.", audio:"因为下雨，我们没出去。", o:["Vì trời mưa nên chúng tôi không ra ngoài","Vì trời nắng nên chúng tôi ra ngoài","Vì trời mưa nên chúng tôi đi chơi","Vì không có thời gian nên chúng tôi ở nhà"], a:"Vì trời mưa nên chúng tôi không ra ngoài", e:"因为下雨，我们没出去 nghĩa như đáp án."},
  {s:"Nghe", q:"Nghe câu và chọn nghĩa đúng.", audio:"通过学习，我了解了很多。", o:["Thông qua chơi game tôi hiểu nhiều","Thông qua học tập tôi hiểu rất nhiều","Tôi không hiểu gì cả","Tôi học rất ít"], a:"Thông qua học tập tôi hiểu rất nhiều", e:"通过学习，我了解了很多 nghĩa như đáp án."},
  {s:"Nghe", q:"Nghe câu và chọn nghĩa đúng.", audio:"除了汉语，他还会英语。", o:["Ngoài tiếng Trung, anh ấy còn biết tiếng Anh","Anh ấy chỉ biết tiếng Trung","Anh ấy không biết tiếng Anh","Anh ấy chỉ biết tiếng Anh"], a:"Ngoài tiếng Trung, anh ấy còn biết tiếng Anh", e:"除了…，还… là ngoài… ra, còn…"},
  {s:"Đọc", p:"现在，环境问题越来越重要。很多城市空气不好，人们要注意保护环境。政府采取了很多措施，比如多种树，少开车。", q:"Vấn đề chính trong đoạn văn là gì?", o:["Vấn đề giao thông","Vấn đề môi trường","Vấn đề giáo dục","Vấn đề kinh tế"], a:"Vấn đề môi trường", e:"环境问题 là vấn đề môi trường."},
  {s:"Đọc", p:"现在，环境问题越来越重要。很多城市空气不好，人们要注意保护环境。政府采取了很多措施，比如多种树，少开车。", q:"Chính phủ đã làm gì?", o:["Xây thêm nhà","Trồng thêm cây, lái xe ít đi","Tăng giá xăng","Đóng cửa trường học"], a:"Trồng thêm cây, lái xe ít đi", e:"多种树，少开车 cho biết điều này."},
  {s:"Đọc", p:"现在，环境问题越来越重要。很多城市空气不好，人们要注意保护环境。政府采取了很多措施，比如多种树，少开车。", q:"Mọi người nên làm gì?", o:["Không quan tâm môi trường","Chú ý bảo vệ môi trường","Lái xe nhiều hơn","Chặt thêm cây"], a:"Chú ý bảo vệ môi trường", e:"要注意保护环境 nghĩa là phải chú ý bảo vệ môi trường."},
  {s:"Viết", q:"Điền từ đúng: ___天气预报，明天会下雨。", o:["根据","因为","虽然","如果"], a:"根据", e:"根据天气预报 là theo dự báo thời tiết."},
  {s:"Viết", q:"Chọn câu đúng.", o:["通过学习，我了解了很多。","学习通过，我了解了很多。","我了解了通过学习很多。","很多通过学习我了解了。"], a:"通过学习，我了解了很多。", e:"通过 + cách thức đặt trước động từ chính."},
  {s:"Viết", q:"Điền từ đúng: ___汉语，他还会英语。", o:["除了","因为","所以","但是"], a:"除了", e:"除了汉语，他还会英语 là ngoài tiếng Trung, anh ấy còn biết tiếng Anh."}
]},
{level:5, questions:[
  {s:"Nghe", q:"Nghe câu và chọn nghĩa đúng.", audio:"尽管工作很忙，他还是坚持学习。", o:["Dù công việc rất bận, anh ấy vẫn kiên trì học","Vì công việc nhàn nên anh ấy học","Anh ấy bận nên bỏ học","Anh ấy không thích học"], a:"Dù công việc rất bận, anh ấy vẫn kiên trì học", e:"尽管…，还是… là mặc dù…, vẫn…"},
  {s:"Nghe", q:"Nghe câu và chọn nghĩa đúng.", audio:"我们要采取措施解决问题。", o:["Chúng ta phải bỏ qua vấn đề","Chúng ta phải áp dụng biện pháp để giải quyết vấn đề","Chúng ta không cần làm gì","Chúng ta phải tạo thêm vấn đề"], a:"Chúng ta phải áp dụng biện pháp để giải quyết vấn đề", e:"采取措施解决问题 là áp dụng biện pháp để giải quyết vấn đề."},
  {s:"Nghe", q:"Nghe câu và chọn nghĩa đúng.", audio:"他的汉语逐渐提高了。", o:["Tiếng Trung của anh ấy đột nhiên kém đi","Tiếng Trung của anh ấy dần dần được nâng cao","Anh ấy không học tiếng Trung nữa","Anh ấy học tiếng Trung rất nhanh trong một ngày"], a:"Tiếng Trung của anh ấy dần dần được nâng cao", e:"逐渐提高 là dần dần nâng cao."},
  {s:"Đọc", p:"教育对一个国家的发展非常重要。好的教育不仅教知识，还培养学生的态度和能力。社会应该给每个孩子公平的学习机会。", q:"Giáo dục quan trọng với điều gì?", o:["Sự phát triển của một quốc gia","Giá nhà đất","Thời tiết","Giao thông"], a:"Sự phát triển của một quốc gia", e:"对一个国家的发展非常重要 cho biết điều này."},
  {s:"Đọc", p:"教育对一个国家的发展非常重要。好的教育不仅教知识，还培养学生的态度和能力。社会应该给每个孩子公平的学习机会。", q:"Giáo dục tốt dạy những gì?", o:["Chỉ dạy kiến thức","Chỉ dạy thể thao","Kiến thức, thái độ và năng lực","Chỉ dạy ngoại ngữ"], a:"Kiến thức, thái độ và năng lực", e:"不仅教知识，还培养学生的态度和能力 cho biết điều này."},
  {s:"Đọc", p:"教育对一个国家的发展非常重要。好的教育不仅教知识，还培养学生的态度和能力。社会应该给每个孩子公平的学习机会。", q:"Xã hội nên làm gì?", o:["Chỉ cho một số trẻ đi học","Cho mỗi trẻ cơ hội học tập công bằng","Không cần quan tâm giáo dục","Chỉ đầu tư cho thành phố lớn"], a:"Cho mỗi trẻ cơ hội học tập công bằng", e:"给每个孩子公平的学习机会 nghĩa như đáp án."},
  {s:"Viết", q:"Điền từ đúng: 政府___了新的措施。", o:["采取","放弃","忘记","降低"], a:"采取", e:"采取措施 là áp dụng biện pháp."},
  {s:"Viết", q:"Điền từ đúng: 他的汉语___提高了。", o:["逐渐","突然","尤其","甚至"], a:"逐渐", e:"逐渐提高 là dần dần nâng cao."},
  {s:"Viết", q:"Chọn câu đúng.", o:["我尤其喜欢中国菜。","我喜欢尤其中国菜。","尤其我喜欢中国菜。","中国菜我尤其喜欢。"], a:"我尤其喜欢中国菜。", e:"尤其 đặt trước động từ hoặc cụm động từ chính."}
]},
{level:6, questions:[
  {s:"Nghe", q:"Nghe câu và chọn nghĩa đúng.", audio:"全球化给世界带来了很多机遇，也带来了挑战。", o:["Toàn cầu hóa chỉ mang lại thách thức","Toàn cầu hóa mang lại nhiều cơ hội tốt và cả thách thức","Toàn cầu hóa không ảnh hưởng gì","Toàn cầu hóa chỉ ảnh hưởng một nước"], a:"Toàn cầu hóa mang lại nhiều cơ hội tốt và cả thách thức", e:"机遇 là cơ hội tốt, 挑战 là thách thức."},
  {s:"Nghe", q:"Nghe câu và chọn nghĩa đúng.", audio:"我们要维护和平，保障每个人的权利。", o:["Chúng ta phải gây xung đột","Chúng ta phải bảo vệ hòa bình và bảo đảm quyền lợi mỗi người","Chúng ta không cần quan tâm quyền lợi","Chúng ta phải bỏ qua hòa bình"], a:"Chúng ta phải bảo vệ hòa bình và bảo đảm quyền lợi mỗi người", e:"维护和平，保障权利 nghĩa như đáp án."},
  {s:"Nghe", q:"Nghe câu và chọn nghĩa đúng.", audio:"科技促进了社会的发展。", o:["Khoa học công nghệ làm xã hội chậm lại","Khoa học công nghệ thúc đẩy sự phát triển xã hội","Khoa học công nghệ không liên quan xã hội","Khoa học công nghệ gây khủng hoảng"], a:"Khoa học công nghệ thúc đẩy sự phát triển xã hội", e:"促进发展 là thúc đẩy phát triển."},
  {s:"Đọc", p:"传统文化和现代科技并不矛盾。保护传统文化，可以让现代社会更有深度。很多年轻人开始重新认识传统艺术，这是一个好的趋势。", q:"Văn hóa truyền thống và công nghệ hiện đại có quan hệ gì?", o:["Hoàn toàn mâu thuẫn","Không hề mâu thuẫn","Không liên quan nhau","Chỉ một bên tồn tại được"], a:"Không hề mâu thuẫn", e:"并不矛盾 nghĩa là không hề mâu thuẫn."},
  {s:"Đọc", p:"传统文化和现代科技并不矛盾。保护传统文化，可以让现代社会更有深度。很多年轻人开始重新认识传统艺术，这是一个好的趋势。", q:"Bảo vệ văn hóa truyền thống giúp xã hội hiện đại như thế nào?", o:["Trở nên nông cạn hơn","Trở nên sâu sắc hơn","Trở nên chậm hơn","Trở nên đắt đỏ hơn"], a:"Trở nên sâu sắc hơn", e:"更有深度 nghĩa là sâu sắc hơn."},
  {s:"Đọc", p:"传统文化和现代科技并不矛盾。保护传统文化，可以让现代社会更有深度。很多年轻人开始重新认识传统艺术，这是一个好的趋势。", q:"Xu hướng tốt được nhắc đến là gì?", o:["Người trẻ bỏ qua nghệ thuật truyền thống","Người trẻ bắt đầu nhận thức lại nghệ thuật truyền thống","Người trẻ chỉ dùng công nghệ","Người trẻ không quan tâm văn hóa"], a:"Người trẻ bắt đầu nhận thức lại nghệ thuật truyền thống", e:"重新认识传统艺术 là nhận thức lại nghệ thuật truyền thống."},
  {s:"Viết", q:"Điền từ đúng: 交流可以___理解。", o:["促进","放弃","降低","忘记"], a:"促进", e:"促进理解 là thúc đẩy sự hiểu biết."},
  {s:"Viết", q:"Điền từ đúng: 考试前要做___的准备。", o:["充分","适当","严格","普遍"], a:"充分", e:"充分的准备 là sự chuẩn bị đầy đủ."},
  {s:"Viết", q:"Chọn câu đúng.", o:["这是一个明显的发展趋势。","这是一个发展趋势明显。","明显这是一个发展趋势。","发展趋势这是一个明显。"], a:"这是一个明显的发展趋势。", e:"Trật tự đúng: 这是 + một + 明显 + 的 + 发展趋势."}
]}
];
