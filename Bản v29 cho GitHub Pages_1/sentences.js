// Mẫu câu tiếng Trung theo cấp HSK và chủ đề.
// words là cách tách câu để luyện ghép câu; nối các từ trong words lại (bỏ dấu câu)
// sẽ ra đúng câu trong han.
const SENTENCES = [
  // HSK 1 — Chào hỏi, giới thiệu, đời sống
  {han:"你好！", pinyin:"nǐ hǎo!", meaning:"Xin chào!", topic:"Chào hỏi", hsk:1, words:["你","好"]},
  {han:"你叫什么名字？", pinyin:"nǐ jiào shénme míngzi?", meaning:"Bạn tên là gì?", topic:"Chào hỏi", hsk:1, words:["你","叫","什么","名字"]},
  {han:"我是中国人。", pinyin:"wǒ shì Zhōngguó rén.", meaning:"Tôi là người Trung Quốc.", topic:"Chào hỏi", hsk:1, words:["我","是","中国","人"]},
  {han:"我是学生。", pinyin:"wǒ shì xuésheng.", meaning:"Tôi là học sinh.", topic:"Chào hỏi", hsk:1, words:["我","是","学生"]},
  {han:"今天天气很好。", pinyin:"jīntiān tiānqì hěn hǎo.", meaning:"Hôm nay thời tiết rất đẹp.", topic:"Đời sống", hsk:1, words:["今天","天气","很","好"]},
  {han:"明天我们去学校。", pinyin:"míngtiān wǒmen qù xuéxiào.", meaning:"Ngày mai chúng ta đi học.", topic:"Đời sống", hsk:1, words:["明天","我们","去","学校"]},
  {han:"我喜欢吃米饭。", pinyin:"wǒ xǐhuan chī mǐfàn.", meaning:"Tôi thích ăn cơm.", topic:"Ăn uống", hsk:1, words:["我","喜欢","吃","米饭"]},
  {han:"我的家庭有四个人。", pinyin:"wǒ de jiātíng yǒu sì ge rén.", meaning:"Gia đình tôi có bốn người.", topic:"Đời sống", hsk:1, words:["我","的","家庭","有","四","个","人"]},
  // HSK 2 — Mua sắm, du lịch, đời sống
  {han:"昨天我和朋友去看电影。", pinyin:"zuótiān wǒ hé péngyou qù kàn diànyǐng.", meaning:"Hôm qua tôi cùng bạn đi xem phim.", topic:"Du lịch", hsk:2, words:["昨天","我","和","朋友","去","看","电影"]},
  {han:"这个多少钱？", pinyin:"zhège duōshao qián?", meaning:"Cái này bao nhiêu tiền?", topic:"Mua sắm", hsk:2, words:["这个","多少","钱"]},
  {han:"请给我一杯水。", pinyin:"qǐng gěi wǒ yì bēi shuǐ.", meaning:"Cho tôi một cốc nước.", topic:"Ăn uống", hsk:2, words:["请","给","我","一","杯","水"]},
  {han:"我的手机没电了。", pinyin:"wǒ de shǒujī méi diàn le.", meaning:"Điện thoại tôi hết pin rồi.", topic:"Đời sống", hsk:2, words:["我","的","手机","没","电","了"]},
  {han:"现在几点？", pinyin:"xiànzài jǐ diǎn?", meaning:"Bây giờ mấy giờ?", topic:"Đời sống", hsk:2, words:["现在","几","点"]},
  {han:"他住在北京。", pinyin:"tā zhù zài Běijīng.", meaning:"Anh ấy sống ở Bắc Kinh.", topic:"Du lịch", hsk:2, words:["他","住","在","北京"]},
  {han:"我们一起去公园吧。", pinyin:"wǒmen yìqǐ qù gōngyuán ba.", meaning:"Chúng ta cùng đi công viên nhé.", topic:"Du lịch", hsk:2, words:["我们","一起","去","公园","吧"]},
  {han:"对不起，我迟到了。", pinyin:"duìbuqǐ, wǒ chídào le.", meaning:"Xin lỗi, tôi đến muộn rồi.", topic:"Đời sống", hsk:2, words:["对不起","我","迟到","了"]},
  // HSK 3 — Học tập, công việc
  {han:"学习汉语不容易，但是很有意思。", pinyin:"xuéxí Hànyǔ bù róngyì, dànshì hěn yǒu yìsi.", meaning:"Học tiếng Trung không dễ, nhưng rất thú vị.", topic:"Học tập", hsk:3, words:["学习","汉语","不","容易","但是","很","有","意思"]},
  {han:"我每天练习听、说、读、写。", pinyin:"wǒ měitiān liànxí tīng, shuō, dú, xiě.", meaning:"Mỗi ngày tôi luyện nghe, nói, đọc, viết.", topic:"Học tập", hsk:3, words:["我","每天","练习","听","说","读","写"]},
  {han:"老师说，多练习才能说得好。", pinyin:"lǎoshī shuō, duō liànxí cáinéng shuō de hǎo.", meaning:"Thầy cô nói, luyện nhiều mới nói tốt được.", topic:"Học tập", hsk:3, words:["老师","说","多","练习","才能","说","得","好"]},
  {han:"我想提高汉语水平。", pinyin:"wǒ xiǎng tígāo Hànyǔ shuǐpíng.", meaning:"Tôi muốn nâng cao trình độ tiếng Trung.", topic:"Học tập", hsk:3, words:["我","想","提高","汉语","水平"]},
  {han:"昨天我去买书了。", pinyin:"zuótiān wǒ qù mǎi shū le.", meaning:"Hôm qua tôi đi mua sách rồi.", topic:"Mua sắm", hsk:3, words:["昨天","我","去","买","书","了"]},
  {han:"请问，银行在哪里？", pinyin:"qǐngwèn, yínháng zài nǎlǐ?", meaning:"Xin hỏi, ngân hàng ở đâu?", topic:"Du lịch", hsk:3, words:["请问","银行","在","哪里"]},
  {han:"我习惯早上跑步。", pinyin:"wǒ xíguàn zǎoshang pǎobù.", meaning:"Tôi quen chạy bộ buổi sáng.", topic:"Đời sống", hsk:3, words:["我","习惯","早上","跑步"]},
  {han:"这个问题不难，我们可以解决。", pinyin:"zhège wèntí bù nán, wǒmen kěyǐ jiějué.", meaning:"Vấn đề này không khó, chúng ta có thể giải quyết.", topic:"Công việc", hsk:3, words:["这个","问题","不","难","我们","可以","解决"]},
  // HSK 4 — Xã hội, môi trường, văn hóa
  {han:"实际上，他昨天没来。", pinyin:"shíjì shang, tā zuótiān méi lái.", meaning:"Trên thực tế, hôm qua anh ấy đã không đến.", topic:"Đời sống", hsk:4, words:["实际上","他","昨天","没","来"]},
  {han:"虽然很累，但是他还是来了。", pinyin:"suīrán hěn lèi, dànshì tā háishi lái le.", meaning:"Mặc dù rất mệt, nhưng anh ấy vẫn đến.", topic:"Đời sống", hsk:4, words:["虽然","很","累","但是","他","还是","来","了"]},
  {han:"根据天气预报，明天会下雨。", pinyin:"gēnjù tiānqì yùbào, míngtiān huì xià yǔ.", meaning:"Theo dự báo thời tiết, ngày mai sẽ mưa.", topic:"Đời sống", hsk:4, words:["根据","天气预报","明天","会","下","雨"]},
  {han:"我们要保护环境，多种树，少开车。", pinyin:"wǒmen yào bǎohù huánjìng, duō zhòng shù, shǎo kāi chē.", meaning:"Chúng ta phải bảo vệ môi trường, trồng thêm cây, lái xe ít đi.", topic:"Xã hội", hsk:4, words:["我们","要","保护","环境","多","种","树","少","开","车"]},
  {han:"这本书是关于中国文化的。", pinyin:"zhè běn shū shì guānyú Zhōngguó wénhuà de.", meaning:"Cuốn sách này viết về văn hóa Trung Quốc.", topic:"Văn hóa", hsk:4, words:["这","本","书","是","关于","中国","文化","的"]},
  {han:"我决定明天去北京工作。", pinyin:"wǒ juédìng míngtiān qù Běijīng gōngzuò.", meaning:"Tôi quyết định ngày mai đi Bắc Kinh làm việc.", topic:"Công việc", hsk:4, words:["我","决定","明天","去","北京","工作"]},
  {han:"社会发展需要大家努力。", pinyin:"shèhuì fāzhǎn xūyào dàjiā nǔlì.", meaning:"Sự phát triển xã hội cần mọi người cùng cố gắng.", topic:"Xã hội", hsk:4, words:["社会","发展","需要","大家","努力"]},
  {han:"他的工作经验很丰富。", pinyin:"tā de gōngzuò jīngyàn hěn fēngfù.", meaning:"Kinh nghiệm làm việc của anh ấy rất phong phú.", topic:"Công việc", hsk:4, words:["他","的","工作","经验","很","丰富"]},
  // HSK 5 — Giáo dục, quan điểm, xã hội
  {han:"教育对国家的发展非常重要。", pinyin:"jiàoyù duì guójiā de fāzhǎn fēicháng zhòngyào.", meaning:"Giáo dục rất quan trọng đối với sự phát triển của đất nước.", topic:"Xã hội", hsk:5, words:["教育","对","国家","的","发展","非常","重要"]},
  {han:"好的教育不仅教知识，还培养学生的态度。", pinyin:"hǎo de jiàoyù bùjǐn jiāo zhīshi, hái péiyǎng xuésheng de tàidu.", meaning:"Giáo dục tốt không chỉ dạy kiến thức, còn bồi dưỡng thái độ của học sinh.", topic:"Học tập", hsk:5, words:["好","的","教育","不仅","教","知识","还","培养","学生","的","态度"]},
  {han:"我们要采取措施改善生活条件。", pinyin:"wǒmen yào cǎiqǔ cuòshī gǎishàn shēnghuó tiáojiàn.", meaning:"Chúng ta phải áp dụng biện pháp cải thiện điều kiện sống.", topic:"Xã hội", hsk:5, words:["我们","要","采取","措施","改善","生活","条件"]},
  {han:"尽管工作很忙，他还是坚持学习。", pinyin:"jǐnguǎn gōngzuò hěn máng, tā háishi jiānchí xuéxí.", meaning:"Mặc dù công việc rất bận, anh ấy vẫn kiên trì học tập.", topic:"Học tập", hsk:5, words:["尽管","工作","很","忙","他","还是","坚持","学习"]},
  {han:"他的汉语逐渐提高了。", pinyin:"tā de Hànyǔ zhújiàn tígāo le.", meaning:"Tiếng Trung của anh ấy dần dần được nâng cao.", topic:"Học tập", hsk:5, words:["他","的","汉语","逐渐","提高","了"]},
  {han:"请你认真考虑一下这个建议。", pinyin:"qǐng nǐ rènzhēn kǎolǜ yíxià zhège jiànyì.", meaning:"Bạn hãy cân nhắc kỹ một chút về đề nghị này.", topic:"Công việc", hsk:5, words:["请","你","认真","考虑","一下","这个","建议"]},
  {han:"社会应该给每个孩子公平的学习机会。", pinyin:"shèhuì yīnggāi gěi měi ge háizi gōngpíng de xuéxí jīhuì.", meaning:"Xã hội nên cho mỗi trẻ cơ hội học tập công bằng.", topic:"Xã hội", hsk:5, words:["社会","应该","给","每","个","孩子","公平","的","学习","机会"]},
  {han:"我对这个问题有不同的观点。", pinyin:"wǒ duì zhège wèntí yǒu bùtóng de guāndiǎn.", meaning:"Tôi có quan điểm khác về vấn đề này.", topic:"Xã hội", hsk:5, words:["我","对","这个","问题","有","不同","的","观点"]},
  // HSK 6 — Toàn cầu, văn hóa, xu hướng
  {han:"传统文化和现代科技并不矛盾。", pinyin:"chuántǒng wénhuà hé xiàndài kējì bìng bù máodùn.", meaning:"Văn hóa truyền thống và công nghệ hiện đại không hề mâu thuẫn.", topic:"Văn hóa", hsk:6, words:["传统","文化","和","现代","科技","并","不","矛盾"]},
  {han:"保护传统文化，可以让现代社会更有深度。", pinyin:"bǎohù chuántǒng wénhuà, kěyǐ ràng xiàndài shèhuì gèng yǒu shēndù.", meaning:"Bảo vệ văn hóa truyền thống có thể làm xã hội hiện đại sâu sắc hơn.", topic:"Văn hóa", hsk:6, words:["保护","传统","文化","可以","让","现代","社会","更","有","深度"]},
  {han:"全球化给世界带来了很多机遇，也带来了挑战。", pinyin:"quánqiúhuà gěi shìjiè dàilái le hěn duō jīyù, yě dàilái le tiǎozhàn.", meaning:"Toàn cầu hóa mang lại nhiều cơ hội tốt và cả thách thức cho thế giới.", topic:"Xã hội", hsk:6, words:["全球化","给","世界","带来","了","很多","机遇","也","带来","了","挑战"]},
  {han:"科技促进了社会的发展。", pinyin:"kējì cùjìn le shèhuì de fāzhǎn.", meaning:"Khoa học công nghệ đã thúc đẩy sự phát triển của xã hội.", topic:"Xã hội", hsk:6, words:["科技","促进","了","社会","的","发展"]},
  {han:"我们要维护和平，保障每个人的权利。", pinyin:"wǒmen yào wéihù hépíng, bǎozhàng měi ge rén de quánlì.", meaning:"Chúng ta phải bảo vệ hòa bình, bảo đảm quyền lợi của mỗi người.", topic:"Xã hội", hsk:6, words:["我们","要","维护","和平","保障","每","个","人","的","权利"]},
  {han:"考试前要做充分的准备。", pinyin:"kǎoshì qián yào zuò chōngfèn de zhǔnbèi.", meaning:"Trước kỳ thi phải chuẩn bị đầy đủ.", topic:"Học tập", hsk:6, words:["考试","前","要","做","充分","的","准备"]},
  {han:"这个市场潜力很大，值得关注。", pinyin:"zhège shìchǎng qiánlì hěn dà, zhíde guānzhù.", meaning:"Thị trường này có tiềm năng rất lớn, đáng được quan tâm.", topic:"Công việc", hsk:6, words:["这个","市场","潜力","很","大","值得","关注"]},
  {han:"从另一个角度看，问题不一样。", pinyin:"cóng lìng yí ge jiǎodù kàn, wèntí bù yíyàng.", meaning:"Nhìn từ một góc độ khác, vấn đề không giống nhau.", topic:"Xã hội", hsk:6, words:["从","另","一个","角度","看","问题","不","一样"]}
];
