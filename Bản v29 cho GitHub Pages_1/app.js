const $ = id => document.getElementById(id);
// Tiến độ theo từng Gmail đăng nhập trên máy này (chưa đồng bộ sang máy khác).
// Khóa cũ 'hoc-tieng-trung' vẫn giữ làm dữ liệu chung để chuyển sang lần đầu.
function progressKey(){
  let user = null;
  try{ user = localStorage.getItem('hoc-tieng-trung-user'); }catch(e){}
  return user ? 'hoc-tieng-trung-' + user : 'hoc-tieng-trung';
}
function loadState(){
  const key = progressKey();
  let raw = null;
  try{ raw = localStorage.getItem(key); }catch(e){}
  if(!raw && key !== 'hoc-tieng-trung'){
    // Lần đầu đăng nhập Gmail này: chuyển tiến độ chung cũ sang cho tài khoản này.
    try{ raw = localStorage.getItem('hoc-tieng-trung'); }catch(e){}
    if(raw){ try{ localStorage.setItem(key, raw); }catch(e){} }
  }
  return JSON.parse(raw || '{"known":[],"learning":[],"quiz":[]}');
}
let state = loadState();
function save(){ localStorage.setItem(progressKey(), JSON.stringify(state)); updateProgress(); }
function logout(){ try{ localStorage.removeItem('hoc-tieng-trung-user'); }catch(e){} location.reload(); }
function speak(text){ if(!('speechSynthesis' in window)) return alert('Trình duyệt của bạn không hỗ trợ đọc tiếng Trung.'); const u = new SpeechSynthesisUtterance(text); u.lang='zh-CN'; speechSynthesis.cancel(); speechSynthesis.speak(u); }
function show(tab){
  document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
  document.querySelectorAll('main section').forEach(s=>s.classList.toggle('active', s.id==='tab-'+tab));
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>show(b.dataset.tab));

// ===== Chuỗi ngày học (streak) =====
// Chỉ tính ngày khi người học thật sự làm một việc học (tra từ, ghép câu,
// quiz, thi thử, ôn tập...), vì logHistory chỉ được gọi ở những việc đó.
function dayStr(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function updateStreakFields(){
  if(!state.streak) state.streak=0;
  const today=dayStr(new Date());
  if(state.lastStudyDate===today) return;
  const y=new Date(); y.setDate(y.getDate()-1);
  if(state.lastStudyDate===dayStr(y)) state.streak+=1; else state.streak=1;
  state.lastStudyDate=today;
}
function streakText(){
  if(!state.streak) return 'Chuỗi ngày học: chưa có — hãy làm 1 việc học hôm nay để bắt đầu chuỗi ngày đầu tiên.';
  return `🔥 Chuỗi ngày học: ${state.streak} ngày liên tiếp · Ngày học gần nhất: ${state.lastStudyDate || ''}`;
}

// ===== Lịch sử sử dụng trên web =====
if(!state.history) state.history=[];
function logHistory(text){
  updateStreakFields();
  state.history.push({time:new Date().toLocaleString('vi-VN'), text});
  if(state.history.length>100) state.history=state.history.slice(-100);
  save(); renderUsageHistory();
}
function renderUsageHistory(){
  const el=$('historyList'); if(!el) return;
  el.innerHTML = state.history.slice().reverse().map(h=>`<div class="card" style="margin:8px 0;padding:14px"><span class="small">${h.time}</span> · ${h.text}</div>`).join('') || '<p class="small">Chưa có lịch sử nào. Bạn làm gì trên web — tra từ, ghép câu, làm quiz, thi thử, hỏi AI — cũng sẽ được ghi lại ở đây.</p>';
}
$('historyClear').onclick=()=>{ state.history=[]; save(); renderUsageHistory(); };
renderUsageHistory();

// ===== Hoa đào bay =====
function petalsOn(){
  try{ return localStorage.getItem('hoc-tieng-trung-petals') !== 'off'; }catch(e){ return true; }
}
function renderPetals(){
  const layer=$('petals'); if(!layer) return;
  layer.innerHTML='';
  if(!petalsOn()){ document.body.classList.add('no-petals'); return; }
  document.body.classList.remove('no-petals');
  for(let i=0;i<14;i++){
    const p=document.createElement('span');
    p.className='petal'; p.textContent='🌸';
    p.style.left=(Math.random()*100)+'vw';
    p.style.fontSize=(16+Math.random()*14)+'px';
    p.style.animationDuration=(10+Math.random()*10)+'s';
    p.style.animationDelay=(-Math.random()*18)+'s';
    layer.appendChild(p);
  }
}
function refreshPetalButton(){
  const b=$('menuTogglePetals'); if(b) b.textContent = petalsOn() ? '🌸 Tắt hoa đào bay' : '🌸 Bật hoa đào bay';
}
renderPetals(); refreshPetalButton();

// ===== Menu 3 gạch ở góc phải trên =====
$('menuBtn').onclick=(e)=>{
  e.stopPropagation();
  $('menuPanel').hidden=!$('menuPanel').hidden;
  const user=(()=>{ try{ return localStorage.getItem('hoc-tieng-trung-user'); }catch(e){ return null; } })();
  $('menuEmail').textContent=user || 'Chưa đăng nhập';
};
document.addEventListener('click',(e)=>{
  const panel=$('menuPanel');
  if(panel && !panel.hidden && !panel.contains(e.target) && e.target.id!=='menuBtn') panel.hidden=true;
});
$('menuChangeEmail').onclick=()=>{ $('menuPanel').hidden=true; logout(); };
$('menuTogglePetals').onclick=()=>{
  try{ localStorage.setItem('hoc-tieng-trung-petals', petalsOn() ? 'off' : 'on'); }catch(e){}
  renderPetals(); refreshPetalButton();
};
$('menuHistory').onclick=()=>{ $('menuPanel').hidden=true; show('history'); renderUsageHistory(); window.scrollTo({top:0, behavior:'smooth'}); };

// ===== Xuất / nhập tiến độ để sao lưu và chuyển máy =====
function exportProgress(){
  const blob=new Blob([JSON.stringify(state,null,2)], {type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download='cung-hoc-tieng-trung-tien-do.json'; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
}
function triggerImport(){ const f=$('importFile'); if(f) f.click(); }
if($('menuExport')) $('menuExport').onclick=()=>{ $('menuPanel').hidden=true; exportProgress(); };
if($('menuImport')) $('menuImport').onclick=()=>{ $('menuPanel').hidden=true; triggerImport(); };
if($('historyExport')) $('historyExport').onclick=exportProgress;
if($('historyImport')) $('historyImport').onclick=triggerImport;
if($('importFile')) $('importFile').onchange=(e)=>{
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const data=JSON.parse(reader.result);
      if(!data || !Array.isArray(data.known)) throw new Error('bad file');
      state=data;
      if(!Array.isArray(state.quiz)) state.quiz=[];
      if(!Array.isArray(state.exam)) state.exam=[];
      if(!Array.isArray(state.mock)) state.mock=[];
      if(!Array.isArray(state.history)) state.history=[];
      save();
      location.reload();
    }catch(err){
      alert('File sao lưu này không đúng định dạng tiến độ của web. Bạn chọn lại file .json đã xuất từ web nhé.');
    }
  };
  reader.readAsText(file);
  e.target.value='';
};

// Trang chủ: chữ của hôm nay (đổi theo ngày)
const today = WORDS[new Date().getDate() % WORDS.length];
$('todayHan').textContent = today.han;
$('todayPinyin').textContent = today.pinyin;
$('todayMeaning').textContent = today.meaning;
$('todayEx').textContent = today.ex + ' — ' + today.exVi;
$('todaySpeak').onclick = ()=>speak(today.han);

// Từ điển — bấm một từ là mở thẻ chi tiết kiểu từ điển, không tự đọc ngay
function renderDict(list){
  $('dictList').innerHTML = list.map(w=>`
    <div class="card word" onclick="showDictWord('${w.han}')">
      <div class="h">${w.han}</div><div class="p">${w.pinyin}</div>
      <div class="m">${w.meaning} · HSK ${w.hsk}</div>
      <div>${w.ex}</div><div class="small">${w.exVi}</div>
    </div>`).join('') || '<p>Không tìm thấy từ phù hợp.</p>';
}
window.showDictWord=function(han){
  const w=WORDS.find(x=>x.han===han); if(!w) return;
  logHistory(`Tra từ ${w.han} (${w.pinyin}: ${w.meaning})`);
  const related=WORDS.filter(x=>x.han!==w.han && (x.han[0]===w.han[0] || x.hsk===w.hsk)).slice(0,4);
  $('dictDetail').innerHTML=`
    <div class="card" style="text-align:center">
      <div class="han" style="font-size:72px">${w.han}</div>
      <div class="pinyin" style="font-size:22px">${w.pinyin}</div>
      <div style="font-size:18px;margin:8px 0">${w.meaning}</div>
      <div>${w.ex}</div><div class="small">${w.exVi}</div>
      <div class="small" style="margin-top:8px">HSK ${w.hsk}${related.length?' · Từ liên quan: '+related.map(r=>r.han+' ('+r.meaning+')').join(' · '):''}</div>
      <div class="row" style="justify-content:center;margin-top:12px">
        <button class="secondary" onclick="speak('${w.han}')">🔊 Nghe</button>
        <button class="secondary" onclick="dictMarkKnown('${w.han}')">${state.known.includes(w.han)?'★ Đã thuộc':'☆ Đánh dấu đã thuộc'}</button>
      </div>
    </div>`;
  $('dictDetail').scrollIntoView({behavior:'smooth', block:'start'});
};
window.dictMarkKnown=function(han){
  const i=state.known.indexOf(han);
  if(i>=0) state.known.splice(i,1); else state.known.push(han);
  save(); renderDict(filteredDict()); showDictWord(han);
  logHistory(`Đánh dấu đã thuộc từ ${han}`);
};
// Tìm nhanh từ trang chủ: gõ xong là mở thẳng từ điển, khỏi tìm tab
function homeSearch(){
  $('dictSearch').value=$('homeSearch').value||'';
  $('dictHsk').value='';
  renderDict(filteredDict());
  const first=filteredDict()[0];
  if(first) showDictWord(first.han);
  show('dict'); window.scrollTo({top:0, behavior:'smooth'});
}
$('homeSearchBtn').onclick=homeSearch;
$('homeSearch').addEventListener('keydown', e=>{ if(e.key==='Enter') homeSearch(); });
document.querySelectorAll('#homeHskChips button').forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll('#homeHskChips button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    $('dictHsk').value=b.dataset.hsk;
    $('dictSearch').value='';
    renderDict(filteredDict());
    show('dict'); window.scrollTo({top:0, behavior:'smooth'});
  };
});
function toggleFav(han){ const i=state.known.indexOf(han); if(i>=0) state.known.splice(i,1); else state.known.push(han); save(); renderDict(filteredDict()); }
function filteredDict(){
  const q=($('dictSearch').value||'').toLowerCase(); const h=$('dictHsk').value;
  return WORDS.filter(w=>(!h||w.hsk==h) && (!q || w.han.includes(q) || w.pinyin.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)));
}
$('dictSearch').oninput=()=>renderDict(filteredDict());
$('dictHsk').onchange=()=>renderDict(filteredDict());
renderDict(WORDS);

// Câu tiếng Trung
function renderSentences(){
  const h=$('sentenceHsk').value, t=$('sentenceTopic').value;
  const list=SENTENCES.filter(s=>(!h || s.hsk==h) && (!t || s.topic===t));
  $('sentenceList').innerHTML=list.map(s=>`
    <div class="card">
      <div class="han">${s.han}</div>
      <div class="pinyin">${s.pinyin}</div>
      <div>${s.meaning}</div>
      <p class="small">HSK ${s.hsk} · ${s.topic}</p>
      <button class="secondary" onclick="speak('${s.han.replace(/[，。！？、；：]/g,'')}'); logHistory('Nghe câu HSK ${s.hsk}: ${s.han}')">🔊 Nghe</button>
    </div>`).join('') || '<p class="small">Không có câu nào khớp bộ lọc này.</p>';
}
$('sentenceHsk').onchange=renderSentences;
$('sentenceTopic').onchange=renderSentences;
renderSentences();

// Luyện ghép câu theo cấp HSK
let buildPool=[], buildCur=null, buildBuilt=[], buildLeft=[], buildScore=0, buildTotal=0;
function buildTarget(s){ return s.han.replace(/[，。！？、；：]/g,''); }
function renderBuildScore(){ $('buildScore').textContent = `Điểm ghép câu cấp này: ${buildScore}/${buildTotal} câu đúng.`; }
function renderBuild(){
  if(!buildCur){ $('buildMeaning').textContent='Bấm Câu mới để bắt đầu.'; $('buildBuilt').innerHTML=''; $('buildWords').innerHTML=''; $('buildResult').textContent=''; renderBuildScore(); return; }
  $('buildMeaning').textContent=buildCur.meaning;
  $('buildBuilt').innerHTML=buildBuilt.map((w,i)=>`<button class="secondary" data-i="${i}">${w.text}</button>`).join('') || '<span class="small">Bấm các từ bên dưới theo thứ tự đúng…</span>';
  $('buildWords').innerHTML=buildLeft.map((w,i)=>`<button class="secondary" data-i="${i}">${w.text}</button>`).join('');
  $('buildBuilt').querySelectorAll('button').forEach(b=>{
    b.onclick=()=>{ const w=buildBuilt[parseInt(b.dataset.i,10)]; buildBuilt.splice(parseInt(b.dataset.i,10),1); buildLeft.push(w); renderBuild(); };
  });
  $('buildWords').querySelectorAll('button').forEach(b=>{
    b.onclick=()=>{ const w=buildLeft[parseInt(b.dataset.i,10)]; buildLeft.splice(parseInt(b.dataset.i,10),1); buildBuilt.push(w); renderBuild(); };
  });
}
function buildNext(){
  const level=parseInt($('buildHsk').value,10);
  buildPool=SENTENCES.filter(s=>s.hsk===level);
  if(!buildPool.length) return;
  buildCur=buildPool[Math.floor(Math.random()*buildPool.length)];
  buildBuilt=[];
  buildLeft=buildCur.words.map((t,i)=>({text:t, idx:i})).sort(()=>Math.random()-.5);
  $('buildResult').textContent='';
  renderBuild();
}
$('buildNext').onclick=buildNext;
$('buildHsk').onchange=()=>{ buildScore=0; buildTotal=0; buildNext(); };
$('buildCheck').onclick=()=>{
  if(!buildCur) return;
  buildTotal++;
  const made=buildBuilt.map(w=>w.text).join('');
  if(made===buildTarget(buildCur)){
    buildScore++;
    $('buildResult').textContent='✅ Đúng rồi! Câu đúng là: '+buildCur.han+' — '+buildCur.meaning;
    logHistory(`Ghép câu đúng HSK ${buildCur.hsk}: ${buildCur.han}`);
  } else {
    $('buildResult').textContent='❌ Chưa đúng. Bạn ghép được: '+(made||'chưa có từ nào')+'. Bấm Xem đáp án hoặc Câu mới để thử lại.';
  }
  renderBuildScore();
};
$('buildShow').onclick=()=>{
  if(!buildCur) return;
  $('buildResult').textContent='Đáp án: '+buildCur.han+' ('+buildCur.pinyin+') — '+buildCur.meaning;
  speak(buildTarget(buildCur));
};
buildNext();

// Luyện viết
let writeIdx=0;
function renderWrite(){
  const w=WORDS[writeIdx];
  $('writeModel').textContent=w.han; $('writeInfo').textContent=w.pinyin+' · '+w.meaning+' · HSK '+w.hsk;
  const c=$('writeCanvas'), ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height);
}
const cv=$('writeCanvas'); let drawing=false;
function pos(e){ const r=cv.getBoundingClientRect(); const t=e.touches?e.touches[0]:e; return [ (t.clientX-r.left)*cv.width/r.width, (t.clientY-r.top)*cv.height/r.height ]; }
function start(e){ drawing=true; const [x,y]=pos(e); const ctx=cv.getContext('2d'); ctx.beginPath(); ctx.moveTo(x,y); e.preventDefault(); }
function move(e){ if(!drawing) return; const [x,y]=pos(e); const ctx=cv.getContext('2d'); ctx.lineWidth=6; ctx.lineCap='round'; ctx.strokeStyle='#2b2118'; ctx.lineTo(x,y); ctx.stroke(); e.preventDefault(); }
cv.addEventListener('mousedown',start); cv.addEventListener('mousemove',move); window.addEventListener('mouseup',()=>drawing=false);
cv.addEventListener('touchstart',start,{passive:false}); cv.addEventListener('touchmove',move,{passive:false}); cv.addEventListener('touchend',()=>drawing=false);
$('writeClear').onclick=renderWrite;
$('writeNext').onclick=()=>{ writeIdx=(writeIdx+1)%WORDS.length; renderWrite(); };
$('writeSpeak').onclick=()=>speak(WORDS[writeIdx].han);
renderWrite();

// Quiz: 4 chế độ, 10 câu
let quiz=[], qi=0, score=0, mode='han-mean';
function startQuiz(){
  mode=$('quizMode').value;
  quiz=[...WORDS].sort(()=>Math.random()-.5).slice(0,10); qi=0; score=0; renderQuiz();
}
function renderQuiz(){
  if(qi>=quiz.length){
    $('quizBox').innerHTML=`<h3>Hoàn thành! Bạn được ${score}/${quiz.length} điểm.</h3>`;
    state.quiz.push({date:new Date().toLocaleDateString('vi-VN'), mode, score, total:quiz.length}); save(); renderHistory(); logHistory(`Làm quiz (${mode}): ${score}/${quiz.length}`); return;
  }
  const w=quiz[qi];
  let q='', correct='';
  if(mode==='han-mean'){ q=w.han; correct=w.meaning; }
  if(mode==='pinyin-han'){ q=w.pinyin; correct=w.han; }
  if(mode==='mean-han'){ q=w.meaning; correct=w.han; }
  if(mode==='listen'){ q='🔊 Nghe và chọn chữ Hán đúng'; correct=w.han; }
  const opts=[correct];
  while(opts.length<4){ const c=WORDS[Math.floor(Math.random()*WORDS.length)]; const v= mode==='han-mean'?c.meaning:c.han; if(!opts.includes(v)) opts.push(v); }
  opts.sort(()=>Math.random()-.5);
  quizAnswered=false;
  $('quizBox').innerHTML=`<p>Câu ${qi+1}/10 · Điểm: ${score}</p><div class="han" style="font-size:44px">${q}</div>
    ${mode==='listen'?`<button class="secondary" onclick="speak('${w.han}')">▶ Nghe lại</button>`:''}
    <div class="row">${opts.map(o=>`<button class="secondary" onclick="answerQuiz('${o.replace(/'/g,"")}')">${o}</button>`).join('')}</div>
    <div id="quizFeedback"></div>`;
  $('quizBox').dataset.correct=correct;
}
let quizAnswered=false;
window.answerQuiz=function(o){
  if(quizAnswered) return;
  quizAnswered=true;
  const c=$('quizBox').dataset.correct;
  const fb=$('quizFeedback');
  if(o===c){ score++; fb.innerHTML='<div class="feedback ok">✅ Đúng rồi!</div>'; }
  else fb.innerHTML='<div class="feedback bad">❌ Sai rồi. Đáp án đúng: '+c+'</div>';
  setTimeout(()=>{ qi++; renderQuiz(); }, 900);
};
$('quizStart').onclick=startQuiz;
function renderHistory(){
  $('quizHistory').innerHTML = state.quiz.slice(-10).reverse().map(r=>`<div>${r.date} · ${r.mode} · ${r.score}/${r.total}</div>`).join('') || '<p class="small">Chưa có lịch sử quiz.</p>';
}
function updateProgress(){
  const pct = WORDS.length ? Math.round(state.known.length/WORDS.length*100) : 0;
  $('progressBar').style.width=pct+'%'; $('progressText').textContent=`Đã thuộc ${state.known.length}/${WORDS.length} từ (${pct}%) · Đã làm ${state.quiz.length} bài quiz`;
  const st=streakText();
  if($('streakText')) $('streakText').textContent=st;
  if($('streakText2')) $('streakText2').textContent=st;
}

// ===== Ôn tập: chỉ ôn từ chưa thuộc =====
let reviewPool=[], reviewIdx=0, reviewRevealed=false;
function renderReview(){
  const unknown=WORDS.filter(w=>!state.known.includes(w.han));
  if(!reviewPool.length){
    $('reviewCount').textContent=`Bạn còn ${unknown.length} từ chưa thuộc trong tổng số ${WORDS.length} từ.`;
    $('reviewCard').innerHTML='<p class="small">Bấm Bắt đầu ôn để lấy danh sách từ chưa thuộc.</p>';
    return;
  }
  if(reviewIdx>=reviewPool.length){
    $('reviewCount').textContent=`Đã ôn hết ${reviewPool.length} từ trong lượt này.`;
    $('reviewCard').innerHTML='<h3>🎉 Hết lượt ôn này rồi!</h3><p class="small">Bấm Bắt đầu ôn để ôn lại những từ còn chưa thuộc (nếu còn).</p>';
    return;
  }
  const w=reviewPool[reviewIdx];
  $('reviewCount').textContent=`Còn ${reviewPool.length} từ chưa thuộc · Đang ôn từ ${reviewIdx+1}/${reviewPool.length}`;
  $('reviewCard').innerHTML=`<div class="han" style="font-size:72px">${w.han}</div>` + (reviewRevealed ? `<div class="pinyin" style="font-size:22px">${w.pinyin}</div><div style="font-size:18px;margin:8px 0">${w.meaning}</div><div>${w.ex}</div><div class="small">${w.exVi}</div>` : '<p class="small">Đoán nghĩa trong đầu rồi bấm Hiện nghĩa nhé.</p>');
}
function startReview(){
  reviewPool=WORDS.filter(w=>!state.known.includes(w.han)).sort(()=>Math.random()-.5);
  reviewIdx=0; reviewRevealed=false;
  renderReview();
  if(reviewPool.length) logHistory('Bắt đầu ôn từ chưa thuộc');
}
$('reviewStart').onclick=startReview;
$('reviewReveal').onclick=()=>{ if(reviewPool[reviewIdx]){ reviewRevealed=true; renderReview(); } };
$('reviewSpeak').onclick=()=>{ const w=reviewPool[reviewIdx]; if(w) speak(w.han); };
$('reviewKnown').onclick=()=>{
  const w=reviewPool[reviewIdx]; if(!w) return;
  if(!state.known.includes(w.han)) state.known.push(w.han);
  save();
  logHistory(`Ôn và đánh dấu đã thuộc từ ${w.han}`);
  reviewIdx++; reviewRevealed=false; renderReview();
};
$('reviewNext').onclick=()=>{ if(reviewPool[reviewIdx]){ reviewIdx++; reviewRevealed=false; renderReview(); } };
renderReview();
renderHistory(); updateProgress(); show('home');

// ===== Luyện thi HSK 1-6 =====
// Kiểu tra từ như từ điển HSK: chữ lớn, pinyin, nghĩa, ví dụ, từ liên quan,
// cộng đề thi thử theo cấp có bấm giờ và lưu điểm riêng.
if(!state.exam) state.exam=[];
let exam=[], exqi=0, exscore=0, exmode='han-mean', exlevel=1, exTimer=null, exLeft=600, exTotal=10;
function examVal(w, m){
  if(m==='han-mean') return w.meaning;
  if(m==='pinyin-han') return w.han;
  if(m==='listen') return w.han;
  if(m==='read') return w.exVi;
  return w.meaning;
}
function examPool(){ return WORDS.filter(w=>w.hsk==exlevel); }
function renderExamWords(){
  const pool=examPool();
  $('examInfo').textContent='Cấp HSK '+exlevel+': có '+pool.length+' từ mẫu trong web. Bấm một từ để xem thẻ chi tiết kiểu từ điển.';
  $('examWordList').innerHTML=pool.map(w=>`
    <div class="card word" onclick="showExamWord('${w.han}')">
      <div class="h">${w.han}</div><div class="p">${w.pinyin}</div>
      <div class="m">${w.meaning} · HSK ${w.hsk}</div>
    </div>`).join('') || '<p>Chưa có từ mẫu cho cấp này.</p>';
  if(pool.length) showExamWord(pool[0].han);
}
window.showExamWord=function(han){
  const w=WORDS.find(x=>x.han===han); if(!w) return;
  const related=WORDS.filter(x=>x.han!==w.han && (x.han[0]===w.han[0] || x.hsk===w.hsk)).slice(0,4);
  $('examWordDetail').innerHTML=`
    <div class="card" style="text-align:center">
      <div class="han" style="font-size:72px">${w.han}</div>
      <div class="pinyin" style="font-size:22px">${w.pinyin}</div>
      <div style="font-size:18px;margin:8px 0">${w.meaning}</div>
      <div>${w.ex}</div><div class="small">${w.exVi}</div>
      <div class="small" style="margin-top:8px">HSK ${w.hsk}${related.length?' · Từ liên quan: '+related.map(r=>r.han+' ('+r.meaning+')').join(' · '):''}</div>
      <div class="row" style="justify-content:center;margin-top:12px">
        <button class="secondary" onclick="speak('${w.han}')">🔊 Nghe</button>
        <button class="secondary" onclick="examMarkKnown('${w.han}')">${state.known.includes(w.han)?'★ Đã thuộc':'☆ Đánh dấu đã thuộc'}</button>
      </div>
    </div>`;
};
window.examMarkKnown=function(han){
  const i=state.known.indexOf(han);
  if(i>=0) state.known.splice(i,1); else state.known.push(han);
  save(); showExamWord(han);
};
function renderExamHistory(){
  $('examHistory').innerHTML = state.exam.slice(-10).reverse().map(r=>`<div>${r.date} · HSK ${r.level} · ${r.mode} · ${r.score}/${r.total}</div>`).join('') || '<p class="small">Chưa có lịch sử thi thử.</p>';
}
function stopExamTimer(){ if(exTimer){ clearInterval(exTimer); exTimer=null; } }
function examTimerText(){
  const m=Math.floor(exLeft/60), s=exLeft%60;
  return (m<10?'0'+m:m)+':'+(s<10?'0'+s:s);
}
function startExam(){
  exlevel=parseInt($('examLevel').value,10);
  exmode=$('examMode').value;
  exTotal=parseInt($('examCount').value,10);
  const pool=[...examPool()].sort(()=>Math.random()-.5);
  exam=pool.slice(0, Math.min(exTotal, pool.length));
  exqi=0; exscore=0; exLeft=600; stopExamTimer();
  exTimer=setInterval(()=>{
    exLeft--;
    const t=$('examTimer'); if(t) t.textContent=examTimerText();
    if(exLeft<=0){ stopExamTimer(); exqi=exam.length; renderExam(); }
  }, 1000);
  renderExamWords(); renderExam();
}
function renderExam(){
  if(exqi>=exam.length){
    stopExamTimer();
    $('examBox').innerHTML=`<h3>Hoàn thành! Bạn được ${exscore}/${exam.length} điểm (HSK ${exlevel}).</h3><p class="small">Làm lại với cấp khác hoặc chế độ khác để ôn tiếp nhé.</p>`;
    state.exam.push({date:new Date().toLocaleDateString('vi-VN'), level:exlevel, mode:exmode, score:exscore, total:exam.length}); save(); renderExamHistory(); logHistory(`Làm bài luyện thi từ HSK ${exlevel} (${exmode}): ${exscore}/${exam.length}`); return;
  }
  const w=exam[exqi];
  const correct=examVal(w, exmode);
  let q='';
  if(exmode==='han-mean') q=w.han;
  if(exmode==='pinyin-han') q=w.pinyin;
  if(exmode==='listen') q='🔊 Nghe và chọn chữ Hán đúng';
  if(exmode==='read') q=w.ex;
  const pool=examPool().length>=4 ? examPool() : WORDS;
  const opts=[correct];
  while(opts.length<4){
    const c=pool[Math.floor(Math.random()*pool.length)];
    const v=examVal(c, exmode);
    if(!opts.includes(v)) opts.push(v);
  }
  opts.sort(()=>Math.random()-.5);
  $('examBox').innerHTML=`<p>Câu ${exqi+1}/${exam.length} · Điểm: ${exscore} · Còn lại: <span id="examTimer">${examTimerText()}</span></p>
    <div class="han" style="font-size:44px">${q}</div>
    ${exmode==='listen'?`<button class="secondary" onclick="speak('${w.han}')">▶ Nghe lại</button>`:''}
    <div class="row">${opts.map(o=>`<button class="secondary exam-opt">${o}</button>`).join('')}</div>`;
  $('examBox').insertAdjacentHTML('beforeend','<div id="examFeedback"></div>');
  let examAnswered=false;
  document.querySelectorAll('.exam-opt').forEach(b=>{
    b.onclick=()=>{
      if(examAnswered) return;
      examAnswered=true;
      const fb=$('examFeedback');
      if(b.textContent===correct){ exscore++; fb.innerHTML='<div class="feedback ok">✅ Đúng rồi!</div>'; }
      else fb.innerHTML='<div class="feedback bad">❌ Sai rồi. Đáp án đúng: '+correct+'</div>';
      setTimeout(()=>{ exqi++; renderExam(); }, 900);
    };
  });
}
$('examLevel').onchange=()=>{ exlevel=parseInt($('examLevel').value,10); renderExamWords(); };
$('examStart').onclick=startExam;
renderExamWords(); renderExamHistory();

// ===== Đề thi thử mô phỏng theo đề thật =====
// 9 câu: 3 nghe, 3 đọc, 3 viết. Chọn đáp án là chuyển câu, cuối bài mới chấm và xem giải thích.
if(!state.mock) state.mock=[];
let mock=[], mocki=0, mockLevel=1, mockAnswers=[], mockTimer=null, mockLeft=900;
function mockTimerText(){
  const m=Math.floor(mockLeft/60), s=mockLeft%60;
  return (m<10?'0'+m:m)+':'+(s<10?'0'+s:s);
}
function stopMockTimer(){ if(mockTimer){ clearInterval(mockTimer); mockTimer=null; } }
function renderMockHistory(){
  $('mockHistory').innerHTML = state.mock.slice(-10).reverse().map(r=>`<div>${r.date} · Đề HSK ${r.level} · ${r.score}/${r.total}${r.score>=6?' · Đạt (mô phỏng)':' · Chưa đạt (mô phỏng)'}</div>`).join('') || '<p class="small">Chưa có lịch sử đề thi thử.</p>';
}
function startMock(){
  mockLevel=parseInt($('mockLevel').value,10);
  const exam=MOCK_EXAMS.find(x=>x.level===mockLevel);
  mock=exam ? [...exam.questions] : [];
  mocki=0; mockAnswers=[]; mockLeft=900; stopMockTimer();
  mockTimer=setInterval(()=>{
    mockLeft--;
    const t=$('mockTimer'); if(t) t.textContent=mockTimerText();
    if(mockLeft<=0){ stopMockTimer(); mocki=mock.length; renderMock(); }
  }, 1000);
  renderMock();
}
function renderMock(){
  if(mocki>=mock.length){
    stopMockTimer();
    let score=0;
    mock.forEach((q,i)=>{ if(mockAnswers[i]===q.a) score++; });
    const review=mock.map((q,i)=>`
      <div class="card" style="margin:12px 0">
        <p><b>Câu ${i+1} · ${q.s}</b> — ${mockAnswers[i]===q.a?'✅ Đúng':'❌ Sai, bạn chọn: '+(mockAnswers[i]||'không chọn')}</p>
        ${q.p?`<p>${q.p}</p>`:''}
        <p>${q.q}</p>
        <p>Đáp án đúng: <b>${q.a}</b></p>
        <p class="small">${q.e}</p>
      </div>`).join('');
    $('mockBox').innerHTML=`<h3>Kết quả đề HSK ${mockLevel}: ${score}/${mock.length} ${score>=6?'(Đạt, theo chuẩn mô phỏng 60%)':'(Chưa đạt, theo chuẩn mô phỏng 60%)'}</h3><p class="small">Chuẩn này chỉ để tự đánh giá trong web, không phải chuẩn chấm chính thức của kỳ thi thật.</p>${review}`;
    state.mock.push({date:new Date().toLocaleDateString('vi-VN'), level:mockLevel, score, total:mock.length}); save(); renderMockHistory(); logHistory(`Làm đề thi thử mô phỏng HSK ${mockLevel}: ${score}/${mock.length}`); return;
  }
  const q=mock[mocki];
  $('mockBox').innerHTML=`<p>Phần ${q.s} · Câu ${mocki+1}/${mock.length} · Còn lại: <span id="mockTimer">${mockTimerText()}</span></p>
    ${q.p?`<div class="card" style="margin:0 0 12px">${q.p}</div>`:''}
    <p style="font-size:18px">${q.q}</p>
    ${q.audio?`<button class="secondary" onclick="speak('${q.audio}')">▶ Nghe lại</button>`:''}
    <div class="row">${q.o.map(o=>`<button class="secondary mock-opt">${o}</button>`).join('')}</div>`;
  if(q.audio) speak(q.audio);
  document.querySelectorAll('.mock-opt').forEach(b=>{
    b.onclick=()=>{ mockAnswers[mocki]=b.textContent; mocki++; renderMock(); };
  });
}
$('mockStart').onclick=startMock;
renderMockHistory();

// Trợ lý AI chạy ngay trong trình duyệt (Cách 1: không cần API key).
// Nó chỉ trả lời dựa trên từ vựng trong data.js và kiến thức cơ bản đã lập trình sẵn.
function aiAdd(text, who){
  const d=document.createElement('div'); d.className='msg '+who; d.textContent=text;
  $('aiChat').appendChild(d); $('aiChat').scrollTop=$('aiChat').scrollHeight;
}
function aiExplain(w){
  return `${w.han} — pinyin: ${w.pinyin} — nghĩa: ${w.meaning} (HSK ${w.hsk}). Ví dụ: ${w.ex} — ${w.exVi}`;
}
function aiAnswer(raw){
  const q=(raw||'').trim(); if(!q) return;
  const low=q.toLowerCase();
  aiAdd(q,'user');
  // Tìm từ theo chữ Hán, pinyin hoặc nghĩa
  const found = WORDS.find(w=> q.includes(w.han) || low.includes(w.pinyin.toLowerCase()) || low.includes(w.meaning.toLowerCase()));
  if(low.includes('quiz') || low.includes('câu hỏi') || low.includes('kiểm tra')){
    const w=WORDS[Math.floor(Math.random()*WORDS.length)];
    aiAdd(`Câu quiz nhanh: chữ ${w.han} có nghĩa là gì? Đáp án: ${w.meaning} (pinyin: ${w.pinyin}). Bạn thử trả lời trong đầu trước khi đọc đáp án nhé!`,'ai'); return;
  }
  if(low.includes('chưa thuộc') || low.includes('ôn')){
    const rest=WORDS.filter(w=>!state.known.includes(w.han));
    const pick=rest.slice(0,5).map(w=>`${w.han} (${w.pinyin}: ${w.meaning})`).join(' · ');
    aiAdd(rest.length ? `Bạn còn ${rest.length} từ chưa đánh dấu đã thuộc. Bắt đầu với 5 từ này nhé: ${pick}` : 'Bạn đã đánh dấu đã thuộc tất cả các từ trong web rồi, giỏi quá!','ai'); return;
  }
  if(low.includes('thanh điệu') || low.includes('thanh dieu')){
    aiAdd('Tiếng Trung có 4 thanh điệu chính và 1 thanh nhẹ: thanh 1 ngang (mā), thanh 2 đi lên (má), thanh 3 đi xuống rồi lên (mǎ), thanh 4 đi xuống mạnh (mà), thanh nhẹ không dấu (ma). Mỗi từ trong Từ điển đều có pinyin kèm theo để bạn xem nhé.','ai'); return;
  }
  if(low.includes('chào') || low.includes('xin chào') || low.includes('hello')){
    aiAdd('Chào bạn! Bạn có thể hỏi mình kiểu: "giải thích 你好", "pinyin của 谢谢 là gì", "từ về gia đình", hoặc "ra câu quiz".','ai'); return;
  }
  if(found){ aiAdd(aiExplain(found),'ai'); return; }
  // Tìm theo chủ đề nghĩa
  const topic = WORDS.filter(w=> low.split(/\s+/).some(t=> t.length>1 && w.meaning.toLowerCase().includes(t)));
  if(topic.length){
    aiAdd('Mình tìm thấy các từ liên quan: '+topic.slice(0,6).map(aiExplain).join(' | '),'ai'); return;
  }
  aiAdd('Mình chưa hiểu câu này. Bạn thử hỏi theo mẫu nhé: "giải thích 你好", "pinyin của 谢谢", "thanh điệu là gì", "ra câu quiz", hoặc "ôn từ chưa thuộc".','ai');
}
window.aiAsk=function(text){ $('aiInput').value=text; aiAnswer(text); };
$('aiSend').onclick=()=>{ const v=$('aiInput').value; $('aiInput').value=''; aiAnswer(v); };
$('aiInput').addEventListener('keydown',e=>{ if(e.key==='Enter') $('aiSend').click(); });
aiAdd('Xin chào! Mình là trợ lý AI trong web học tiếng Trung. Bạn muốn giải thích từ nào, học pinyin, hay làm một câu quiz nhanh?','ai');

// ===== Bản AI thông minh hơn: dịch Trung-Việt, Việt-Trung, giải thích chi tiết =====
// Ghi đè hàm aiAnswer cũ bằng bản mới. Không cần API key, dịch dựa trên từ điển trong data.js.
const HAS_HAN = /[\u4e00-\u9fff]/;
const SORTED_WORDS = [...WORDS].sort((a,b)=>b.han.length-a.han.length);
function segmentChinese(text){
  const clean=text.replace(/[，。、；：？！,.?!;:\s]/g,'');
  const out=[]; let i=0;
  while(i<clean.length){
    const m=SORTED_WORDS.find(w=>clean.startsWith(w.han,i));
    if(m){ out.push(m); i+=m.han.length; } else { out.push({han:clean[i], pinyin:'?', meaning:'(chưa có trong từ điển)', unknown:true}); i++; }
  }
  return out;
}
function translateChinese(text){
  const toks=segmentChinese(text);
  const vi=toks.map(t=>t.unknown?`[${t.han}?]`:t.meaning).join(' ');
  const py=toks.map(t=>t.pinyin).join(' ');
  const unknown=toks.filter(t=>t.unknown).map(t=>t.han);
  let r=`Dịch Trung → Việt:\n${text}\nPinyin: ${py}\nNghĩa: ${vi}`;
  if(unknown.length) r+=`\nLưu ý: các chữ ${unknown.join('')} chưa có trong từ điển của web nên mình chưa dịch chính xác được, bạn thử tra riêng từng chữ đó nhé.`;
  return r;
}
function translateVietnamese(text){
  const norm=text.toLowerCase().replace(/[,.?!;:]/g,' ').replace(/\s+/g,' ').trim();
  const tokens=norm.split(' ');
  const out=[]; let i=0;
  while(i<tokens.length){
    let matched=null, len=0;
    for(let l=3;l>=1;l--){
      const phrase=tokens.slice(i,i+l).join(' ');
      const w=WORDS.find(x=>x.meaning.toLowerCase()===phrase);
      if(w){ matched=w; len=l; break; }
    }
    if(matched){ out.push(matched); i+=len; } else { out.push({han:`[${tokens[i]}?]`, pinyin:'?', meaning:tokens[i], unknown:true}); i++; }
  }
  const han=out.map(t=>t.han).join('');
  const py=out.map(t=>t.pinyin).join(' ');
  const unknown=out.filter(t=>t.unknown).map(t=>t.meaning);
  let r=`Dịch Việt → Trung:\n${text}\nChữ Hán: ${han}\nPinyin: ${py}`;
  if(unknown.length) r+=`\nLưu ý: các từ ${unknown.join(', ')} chưa có trong từ điển của web nên mình chưa dịch chính xác được.`;
  return r;
}
function explainDetailed(w){
  const related=WORDS.filter(x=>x.han!==w.han && (x.han[0]===w.han[0] || x.hsk===w.hsk)).slice(0,4)
    .map(x=>`${x.han} (${x.pinyin}: ${x.meaning})`).join(' · ');
  const level = w.hsk===1 ? 'Từ cơ bản, dùng nhiều trong giao tiếp hàng ngày.' : w.hsk===2 ? 'Từ trung cấp, hay gặp trong bài học và đời sống.' : 'Từ nâng cao, dùng để diễn đạt ý sâu hơn.';
  return `Giải thích chi tiết: ${w.han}\n• Pinyin: ${w.pinyin}\n• Nghĩa: ${w.meaning}\n• Cấp độ: HSK ${w.hsk} — ${level}\n• Ví dụ: ${w.ex}\n• Dịch ví dụ: ${w.exVi}\n• Cách dùng: bạn có thể dùng từ này đúng như trong ví dụ trên, thay chủ ngữ hoặc hoàn cảnh cho phù hợp với câu của bạn.\n${related?`• Từ liên quan: ${related}`:''}`;
}
function aiAnswer2(raw){
  const q=(raw||'').trim(); if(!q) return;
  const low=q.toLowerCase();
  aiAdd(q,'user');
  // Giải thích chi tiết
  if(low.includes('giải thích') || low.includes('giai thich') || low.includes('nghĩa của') || low.includes('ý nghĩa')){
    const exact=WORDS.find(w=>q.includes(w.han));
    if(exact){ aiAdd(explainDetailed(exact),'ai'); return; }
    const byMean=WORDS.find(w=>low.includes(w.meaning.toLowerCase()));
    if(byMean){ aiAdd(explainDetailed(byMean),'ai'); return; }
    aiAdd('Bạn ghi rõ từ cần giải thích giúp mình nhé, ví dụ: "giải thích chi tiết: 学习".','ai'); return;
  }
  if(low.includes('quiz') || low.includes('câu hỏi') || low.includes('kiểm tra')){
    const w=WORDS[Math.floor(Math.random()*WORDS.length)];
    aiAdd(`Câu quiz nhanh: chữ ${w.han} có nghĩa là gì? Đáp án: ${w.meaning} (pinyin: ${w.pinyin}). Bạn thử trả lời trong đầu trước khi đọc đáp án nhé!`,'ai'); return;
  }
  if(low.includes('chưa thuộc') || low.includes('ôn')){
    const rest=WORDS.filter(w=>!state.known.includes(w.han));
    const pick=rest.slice(0,5).map(w=>`${w.han} (${w.pinyin}: ${w.meaning})`).join(' · ');
    aiAdd(rest.length ? `Bạn còn ${rest.length} từ chưa đánh dấu đã thuộc. Bắt đầu với 5 từ này nhé: ${pick}` : 'Bạn đã đánh dấu đã thuộc tất cả các từ trong web rồi, giỏi quá!','ai'); return;
  }
  if(low.includes('thanh điệu') || low.includes('thanh dieu')){
    aiAdd('Tiếng Trung có 4 thanh điệu chính và 1 thanh nhẹ: thanh 1 ngang (mā), thanh 2 đi lên (má), thanh 3 đi xuống rồi lên (mǎ), thanh 4 đi xuống mạnh (mà), thanh nhẹ không dấu (ma). Mỗi từ trong Từ điển đều có pinyin kèm theo để bạn xem nhé.','ai'); return;
  }
  // Dịch tự động theo ngôn ngữ nhập vào
  const chinesePart = q.replace(/^(dịch|dich|translate)[:\s]*/i,'');
  if(HAS_HAN.test(q)){
    aiAdd(translateChinese(chinesePart),'ai');
    const exact=WORDS.find(w=>w.han===chinesePart.trim());
    if(exact) aiAdd(explainDetailed(exact),'ai');
    return;
  }
  // Pinyin -> chữ Hán
  const byPinyin=WORDS.find(w=>w.pinyin.toLowerCase()===low.replace(/^(dịch|dich)[:\s]*/,'').trim());
  if(byPinyin){ aiAdd(`Pinyin ${byPinyin.pinyin} là chữ ${byPinyin.han}, nghĩa: ${byPinyin.meaning}.`,'ai'); return; }
  // Mặc định: tiếng Việt -> tiếng Trung
  if(/^[a-zà-ỹ\s]+$/i.test(q.replace(/^(dịch|dich)[:\s]*/i,'')) && q.split(/\s+/).length>=1){
    aiAdd(translateVietnamese(chinesePart),'ai'); return;
  }
  aiAdd('Mình chưa hiểu câu này. Bạn thử: gõ một câu tiếng Trung để dịch sang tiếng Việt, gõ một câu tiếng Việt để dịch sang tiếng Trung, hoặc "giải thích chi tiết: 学习".','ai');
}
// Ghi đè bản cũ
aiAnswer = aiAnswer2;
aiAdd('Bản AI mới đã sẵn sàng: mình có thể dịch Trung → Việt, Việt → Trung và giải thích chi tiết từng từ. Bạn thử gõ "我爱中国" hoặc "Tôi yêu Trung Quốc" xem nhé!','ai');

// ===== AI thật bằng API của chủ web, qua Netlify Function =====
// Người dùng không nhập key. Chủ web lưu key của mình một lần trong biến môi
// trường của site trên Netlify (GEMINI_API_KEY hoặc MODEL_API_KEY), hàm server
// muse-chat sẽ dùng key đó cho mọi người vào web. Đăng bằng kéo thả file sẽ
// không kèm hàm server, nên để AI thật chạy thì cần đăng bằng GitHub/Netlify CLI.
async function fetchRemoteAnswer(q){
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(), 25000);
  try{
    const res = await fetch('/.netlify/functions/muse-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: q }),
      signal: controller.signal
    });
    clearTimeout(timer);
    if(!res.ok) throw new Error('remote failed');
    const data = await res.json();
    if(!data.answer) throw new Error('empty answer');
    return data.answer;
  }catch(e){
    clearTimeout(timer);
    throw e;
  }
}
async function aiAnswerRemote(raw){
  const q=(raw||'').trim(); if(!q) return;
  aiAdd(q,'user');
  try{
    const answer = await fetchRemoteAnswer(q);
    aiAdd(answer,'ai');
    logHistory(`Hỏi trợ lý AI: ${q}`);
  }catch(e){
    aiAdd('AI thật tạm dừng trên GitHub Pages, vì Pages chỉ chạy web tĩnh và không chạy hàm server. Các phần học khác vẫn dùng bình thường.','ai');
  }
}
aiAnswer = aiAnswerRemote;
aiAdd('Bản này chạy trên GitHub Pages nên AI thật tạm dừng, vì Pages không chạy hàm server. Các phần học khác vẫn dùng bình thường.','ai');

// ===== Ô chat nhỏ kiểu nhắn tin, hiện ở mọi tab =====
// Dùng chung hàm server với tab Trợ lý AI. Nếu AI thật chưa kết nối thì
// ô này báo rõ lỗi thay vì im lặng chuyển về trợ lý nội bộ, để bạn biết
// là cần kiểm tra key / hàm server trên Netlify.
function miniAdd(text, who){
  const box = $('miniChat'); if(!box) return;
  const d = document.createElement('div');
  d.className = 'msg ' + who; d.textContent = text;
  box.appendChild(d); box.scrollTop = box.scrollHeight;
}
async function miniSend(raw){
  const q = (raw || '').trim(); if(!q) return;
  miniAdd(q, 'user');
  miniAdd('Đang nghĩ…', 'ai');
  const thinking = $('miniChat').lastElementChild;
  try{
    thinking.textContent = await fetchRemoteAnswer(q);
  }catch(e){
    thinking.textContent = 'AI thật tạm dừng trên GitHub Pages, vì Pages không chạy hàm server. Các phần học khác vẫn dùng bình thường.';
  }
  $('miniChat').scrollTop = $('miniChat').scrollHeight;
}
window.miniAsk = function(text){ $('miniInput').value = text; miniSend(text); };
const chatFab = $('chatFab'), chatBox = $('chatBox');
if(chatFab && chatBox){
  chatFab.onclick = ()=>{
    chatBox.hidden = !chatBox.hidden;
    if(!chatBox.hidden && !$('miniChat').children.length){
      miniAdd('Xin chào! Bạn muốn hỏi gì về tiếng Trung? Gõ câu tiếng Trung để dịch, hoặc hỏi giải thích một từ nhé.', 'ai');
    }
  };
  $('chatClose').onclick = ()=>{ chatBox.hidden = true; };
  $('miniSend').onclick = ()=>{ const v = $('miniInput').value; $('miniInput').value = ''; miniSend(v); };
  $('miniInput').addEventListener('keydown', e=>{ if(e.key === 'Enter') $('miniSend').click(); });
}

// ===== Đăng nhập đơn giản bằng Gmail, không cần mật khẩu =====
// Chỉ lưu Gmail trên trình duyệt của người dùng để chào tên, không gửi
// đi đâu, không xác minh chủ sở hữu Gmail, không đồng bộ sang máy khác.
(function(){
  const gate = $('loginGate'), emailInput = $('loginEmail'), err = $('loginError');
  const userBar = $('userBar'), greeting = $('userGreeting');
  if(!gate) return;
  function showUser(email){
    gate.hidden = true;
    userBar.hidden = false;
    greeting.textContent = 'Xin chào, ' + email;
  }
  function doLogin(){
    const email = (emailInput.value || '').trim().toLowerCase();
    if(!/^[a-z0-9._%+-]+@gmail\.com$/.test(email)){
      err.textContent = 'Bạn nhập chưa đúng Gmail. Ví dụ đúng: ban@gmail.com';
      emailInput.focus(); return;
    }
    try{ localStorage.setItem('hoc-tieng-trung-user', email); }catch(e){}
    err.textContent = '';
    // Tải lại trang để tiến độ, ghép câu và quiz đều lấy đúng dữ liệu của Gmail này.
    location.reload();
  }
  $('loginBtn').onclick = doLogin;
  emailInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') doLogin(); });
  // Đăng xuất / đổi Gmail chỉ còn trong menu 3 gạch, không còn nút ở đầu trang để tránh bấm nhầm.
  let saved = null;
  try{ saved = localStorage.getItem('hoc-tieng-trung-user'); }catch(e){}
  if(saved && /^[a-z0-9._%+-]+@gmail\.com$/.test(saved)){ showUser(saved); }
  else { gate.hidden = false; }
})();
