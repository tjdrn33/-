const { useState, useEffect } = React;


// ── 지출 카테고리 ──────────────────────────────────
const SPEND_CATEGORIES = [
  { key: "spend_meal",      label: "식사",     emoji: "🍚" },
  { key: "spend_transport", label: "교통",     emoji: "🚌" },
  { key: "spend_bath",      label: "목욕탕",   emoji: "🛁" },
  { key: "spend_snack",     label: "간식·음료", emoji: "☕" },
  { key: "spend_item",      label: "물건 구입", emoji: "🛍️" },
  { key: "spend_medical",   label: "의료·약",  emoji: "💊" },
  { key: "spend_other",     label: "기타",     emoji: "📦" },
];

// ── 체크리스트 섹션 ────────────────────────────────
const SECTIONS = [
  {
    id: "life", emoji: "🏠", title: "① 생활",
    fields: [
      { key: "life_home",    label: "집에 들어갔다" },
      { key: "life_stayed",  label: "집 안에서 10분 이상 있었다" },
      { key: "life_action",  label: "집에서 한 가지 일을 했다 (샤워, 청소, 빨래, 물 마시기 등)" },
    ]
  },
  {
    id: "meal", emoji: "🍚", title: "② 식사", sub: "하루 2끼 이상 목표",
    fields: [
      { key: "meal_morning",  label: "아침을 먹었다" },
      { key: "meal_lunch",    label: "점심을 먹었다" },
      { key: "meal_dinner",   label: "저녁을 먹었다" },
      { key: "meal_no_snack", label: "군것질을 하지 않았다" },
      { key: "meal_no_drink", label: "술을 마시지 않았다" },
    ]
  },
  {
    id: "self", emoji: "👕", title: "③ 자기관리",
    fields: [
      { key: "self_clothes", label: "옷을 갈아입었다" },
      { key: "self_shower",  label: "샤워했다" },
      { key: "self_brush",   label: "양치를 했다" },
    ]
  },
  {
    id: "money", emoji: "💳", title: "④ 돈과 카드",
    fields: [
      { key: "money_checked",     label: "카드 사용내역을 확인했다" },
      { key: "money_no_unknown",  label: "모르는 결제가 없었다" },
      { key: "money_no_give",     label: "카드를 누구에게도 주지 않았다" },
      { key: "money_no_cash",     label: "현금을 빌려주지 않았다" },
      { key: "money_no_deal",     label: "돈 거래를 하지 않았다" },
    ]
  },
  {
    id: "place", emoji: "👥", title: "⑤ 사람과 활동", sub: "오늘 간 곳 (복수 선택 가능)",
    fields: [
      { key: "place_temple",    label: "전등사" },
      { key: "place_volunteer", label: "봉사" },
      { key: "place_library",   label: "도서관" },
      { key: "place_community", label: "주민센터" },
      { key: "place_home",      label: "집" },
      { key: "place_other",     label: "기타" },
    ]
  },
  {
    id: "street", emoji: "🚶", title: "⑥ 길거리·버스",
    fields: [
      { key: "street_no_long",  label: "길거리나 목욕탕에서 오래 보내지 않았다" },
      { key: "street_no_bus",   label: "버스만 타고 시간을 보내지 않았다" },
    ],
    radio: { key: "street_time", label: "오늘 길거리에서 보낸 시간", options: ["1시간 이하", "3시간 이하", "5시간 이하", "5시간 이상"] }
  },
  {
    id: "impulse", emoji: "⚡", title: "⑦ 충동 확인", sub: "오늘 이런 충동이 있었나요? (복수 선택 가능)",
    fields: [
      { key: "imp_snack",  label: "과자를 많이 사고 싶었다" },
      { key: "imp_drink",  label: "술을 마시고 싶었다" },
      { key: "imp_spend",  label: "돈을 쓰고 싶었다" },
      { key: "imp_card",   label: "카드를 주고 싶었다" },
      { key: "imp_escape", label: "도망가고 싶었다" },
    ],
    radio: { key: "imp_acted", label: "위 충동을 실제로 행동으로 옮겼나요?", options: ["아니오", "조금", "많이"] }
  },
  {
    id: "emotion", emoji: "💭", title: "⑧ 오늘의 감정", sub: "오늘 나는 (복수 선택 가능)",
    fields: [
      { key: "emo_anxious", label: "불안했다" },
      { key: "emo_lonely",  label: "외로웠다" },
      { key: "emo_angry",   label: "화가 났다" },
      { key: "emo_sad",     label: "슬펐다" },
      { key: "emo_okay",    label: "괜찮았다" },
    ],
    radio: { key: "emo_intensity", label: "감정 강도", options: ["1", "2", "3", "4", "5"] }
  },
  {
    id: "real", emoji: "🪞", title: "⑨ 현실 직면",
    fields: [
      { key: "real_faced",   label: "피하고 싶은 현실을 떠올려보았다" },
      { key: "real_1min",    label: "그 현실을 1분 이상 견뎠다" },
      { key: "real_5min",    label: "5분 이상 견뎠다" },
      { key: "real_10min",   label: "10분 이상 견뎠다" },
    ]
  },
  {
    id: "help", emoji: "🙋", title: "⑩ 도움 요청", sub: "오늘 힘들 때",
    fields: [
      { key: "help_monk",  label: "스님에게 말했다" },
      { key: "help_other", label: "다른 사람에게 말했다" },
      { key: "help_alone", label: "혼자 견뎠다" },
    ]
  },
];

// ── 유틸 ──────────────────────────────────────────
const todayStr = () => new Date().toLocaleDateString("ko-KR",
  { year:"numeric", month:"long", day:"numeric", weekday:"short" });
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const fmtWon = n => n ? Number(n).toLocaleString("ko-KR")+"원" : "";
const totalSpend = sp => SPEND_CATEGORIES.reduce((s,c)=>s+(parseInt(sp?.[c.key])||0),0);
const initSpending = () => Object.fromEntries(SPEND_CATEGORIES.map(c=>[c.key,""]));

const initialForm = () => ({
  // ① 생활
  life_home:false, life_stayed:false, life_action:false,
  // ② 식사
  meal_morning:false, meal_lunch:false, meal_dinner:false,
  meal_no_snack:false, meal_no_drink:false,
  // ③ 자기관리
  self_clothes:false, self_shower:false, self_brush:false,
  // ④ 돈
  money_checked:false, money_no_unknown:false, money_no_give:false,
  money_no_cash:false, money_no_deal:false,
  // ⑤ 장소
  place_temple:false, place_volunteer:false, place_library:false,
  place_community:false, place_home:false, place_other:false,
  // ⑥ 길거리
  street_no_long:false, street_no_bus:false, street_time:"",
  // ⑦ 충동
  imp_snack:false, imp_drink:false, imp_spend:false, imp_card:false, imp_escape:false,
  imp_acted:"",
  // ⑧ 감정
  emo_anxious:false, emo_lonely:false, emo_angry:false, emo_sad:false, emo_okay:false,
  emo_intensity:"",
  // ⑨ 현실
  real_faced:false, real_1min:false, real_5min:false, real_10min:false,
  // ⑩ 도움
  help_monk:false, help_other:false, help_alone:false,
  // 주관식
  good_thing:"",
  hard_thing:"",
  memo:"",
  // 지출
  spending: initSpending(),
});

const scoreRecord = r => {
  const boolKeys = Object.keys(r).filter(k => typeof r[k]==="boolean");
  return {
    checked: boolKeys.filter(k=>r[k]).length,
    total: boolKeys.length,
    meals: [r.meal_morning, r.meal_lunch, r.meal_dinner].filter(Boolean).length,
  };
};

const encodeRecord = rec => { try { return btoa(encodeURIComponent(JSON.stringify(rec))); } catch { return ""; } };
const decodeRecord = str => { try { return JSON.parse(decodeURIComponent(atob(str))); } catch { return null; } };
const getSharedFromURL = () => {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith("#share=")) return null;
    return decodeRecord(hash.slice(7));
  } catch { return null; }
};

// ── RecordDetail ──────────────────────────────────
function RecordDetail({ record, onClose, isShared }) {
  const { checked, total, meals } = scoreRecord(record);
  const pct = Math.round((checked/total)*100);
  const sp = record.spending || {};
  const spTotal = totalSpend(sp);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-hd">
          <div>
            <div className="modal-date">{record.date}</div>
            {isShared && <div className="shared-badge">📨 받은 기록</div>}
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="pct-row">
          <div className="pct-label">완료율 {pct}% ({checked}/{total})</div>
          <div className="pct-bar"><div className="pct-fill" style={{width:pct+"%"}}/></div>
        </div>

        {spTotal>0 && (
          <div className="spend-block">
            <div className="sb-title">💸 지출</div>
            {SPEND_CATEGORIES.map(cat=>{
              const a=parseInt(sp[cat.key])||0;
              return a ? (
                <div key={cat.key} className="sb-row">
                  <span>{cat.emoji} {cat.label}</span><span className="sb-amt">{fmtWon(a)}</span>
                </div>
              ) : null;
            })}
            <div className="sb-total">총 <strong>{fmtWon(spTotal)}</strong></div>
          </div>
        )}

        <div className="rec-secs">
          {SECTIONS.map(sec => {
            const yesFields = (sec.fields||[]).filter(f=>record[f.key]);
            const radioVal = sec.radio ? record[sec.radio.key] : null;
            return (
              <div key={sec.id} className="rec-sec">
                <div className="rec-t">{sec.emoji} {sec.title}</div>
                {yesFields.length===0 && !radioVal
                  ? <div className="rec-none">기록 없음</div>
                  : <>
                      {yesFields.map(f=><div key={f.key} className="rec-i">✓ {f.label}</div>)}
                      {radioVal && <div className="rec-i">▸ {sec.radio.label}: <strong>{radioVal}</strong></div>}
                    </>
                }
              </div>
            );
          })}

          {record.good_thing && (
            <div className="rec-sec">
              <div className="rec-t">🌱 오늘 잘한 것</div>
              <div className="rec-memo">{record.good_thing}</div>
            </div>
          )}
          {record.hard_thing && (
            <div className="rec-sec">
              <div className="rec-t">😢 오늘 가장 힘들었던 것</div>
              <div className="rec-memo">{record.hard_thing}</div>
            </div>
          )}
          {record.memo && (
            <div className="rec-sec">
              <div className="rec-t">💬 자유 메모</div>
              <div className="rec-memo">{record.memo}</div>
            </div>
          )}
        </div>
        <div className="modal-ft">제출 시각: {record.submittedAt}</div>
      </div>
    </div>
  );
}

// ── HistoryList ──────────────────────────────────
function HistoryList({ records, isShared }) {
  const [sel, setSel] = useState(null);
  const weekly = records.slice(0,7).reduce((s,r)=>s+totalSpend(r.spending||{}),0);

  if (records.length===0) return (
    <div className="empty">
      <div style={{fontSize:36,marginBottom:12}}>{isShared?"📨":"📋"}</div>
      <p>{isShared
        ? "아직 받은 기록이 없어요.\n상대방이 카톡으로 보내주면 여기에 쌓여요."
        : "아직 기록이 없어요."}</p>
    </div>
  );

  return (
    <>
      {weekly>0 && (
        <div className="weekly">
          <span className="wl">최근 7일 지출</span>
          <span className="wa">{fmtWon(weekly)}</span>
        </div>
      )}
      {records.map(rec=>{
        const {checked,total,meals}=scoreRecord(rec);
        const pct=Math.round((checked/total)*100);
        const sp=totalSpend(rec.spending||{});
        return (
          <div key={rec.dateKey} className="h-card" onClick={()=>setSel(rec)}>
            <div className="h-top">
              <div className="h-date">{rec.date}</div>
              {sp>0 && <div className="h-sp">{fmtWon(sp)}</div>}
            </div>
            <div className="h-bar-row">
              <div className="h-bar"><div className="h-fill" style={{width:pct+"%"}}/></div>
              <span className="h-pct">{pct}%</span>
            </div>
            <div className="h-tags">
              <span className="tag">식사 {meals}끼</span>
              {rec.street_time && <span className="tag">외출 {rec.street_time}</span>}
              {rec.emo_intensity && <span className="tag">감정강도 {rec.emo_intensity}</span>}
              {rec.emo_okay    && <span className="tag green">괜찮음</span>}
              {rec.emo_anxious && <span className="tag amber">불안</span>}
              {rec.emo_lonely  && <span className="tag amber">외로움</span>}
              {rec.emo_angry   && <span className="tag amber">화남</span>}
              {rec.emo_sad     && <span className="tag amber">슬픔</span>}
            </div>
            {rec.good_thing && <div className="h-good">🌱 {rec.good_thing}</div>}
            <div className="h-time">제출 {rec.submittedAt}</div>
          </div>
        );
      })}
      {sel && <RecordDetail record={sel} isShared={isShared} onClose={()=>setSel(null)}/>}
    </>
  );
}

// ── 메인 ─────────────────────────────────────────
function App() {
  const [tab, setTab]               = useState("check");
  const [form, setForm]             = useState(initialForm());
  const [myRecords, setMyRec]       = useState([]);
  const [sharedRecords, setSharedRec] = useState([]);
  const [submitted, setSubmitted]   = useState(false);
  const [alreadyToday, setAlready]  = useState(false);
  const [shareLink, setShareLink]   = useState("");
  const [copyMsg, setCopyMsg]       = useState("");
  const [incomingRec, setIncoming]  = useState(null);

  useEffect(()=>{
    try {
      const m = localStorage.getItem("wcl-my");
      if (m) setMyRec(JSON.parse(m));
      const s = localStorage.getItem("wcl-shared");
      if (s) setSharedRec(JSON.parse(s));
    } catch {}
  },[]);

  useEffect(()=>{
    const rec = getSharedFromURL();
    if (rec) {
      setIncoming(rec);
      window.history.replaceState(null,"",window.location.pathname+window.location.search);
    }
  },[]);

  useEffect(()=>{
    setAlready(!!myRecords.find(r=>r.dateKey===todayKey()));
  },[myRecords]);

  const saveIncoming = () => {
    if (!incomingRec) return;
    const updated = [incomingRec, ...sharedRecords.filter(r=>r.dateKey!==incomingRec.dateKey)];
    setSharedRec(updated);
    localStorage.setItem("wcl-shared", JSON.stringify(updated));
    setIncoming(null);
    setTab("shared");
  };

  const toggle   = k => setForm(f=>({...f,[k]:!f[k]}));
  const setRadio = (k,v) => setForm(f=>({...f,[k]:v}));
  const setSpend = (k,v) => setForm(f=>({...f,spending:{...f.spending,[k]:v}}));
  const setText  = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = () => {
    const now = new Date();
    const rec = {
      ...form,
      date: todayStr(),
      dateKey: todayKey(),
      submittedAt: now.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"}),
    };
    const updated = [rec, ...myRecords.filter(r=>r.dateKey!==todayKey())];
    setMyRec(updated);
    localStorage.setItem("wcl-my", JSON.stringify(updated));
    const encoded = encodeRecord(rec);
    const url = `${window.location.origin}${window.location.pathname}#share=${encoded}`;
    setShareLink(url);
    setSubmitted(true);
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareLink); setCopyMsg("링크 복사됨 ✓"); }
    catch { setCopyMsg("아래 링크를 직접 복사해주세요"); }
    setTimeout(()=>setCopyMsg(""),3000);
  };

  // ── 들어온 기록 화면 ──────────────────────────
  if (incomingRec) {
    const {checked,total,meals}=scoreRecord(incomingRec);
    const pct=Math.round((checked/total)*100);
    const sp=totalSpend(incomingRec.spending||{});
    return (
      <div className="app">
        <div className="incoming-screen">
          <div className="incoming-hd">
            <div style={{fontSize:32}}>📨</div>
            <div>
              <div className="incoming-title">기록이 도착했어요</div>
              <div className="incoming-date">{incomingRec.date}</div>
            </div>
          </div>
          <div className="incoming-summary">
            <div className="isrow"><span>완료율</span><strong>{pct}% ({checked}/{total})</strong></div>
            <div className="isrow"><span>식사</span><strong>{meals}끼</strong></div>
            {sp>0 && <div className="isrow"><span>지출</span><strong>{fmtWon(sp)}</strong></div>}
            {incomingRec.street_time && <div className="isrow"><span>외출</span><strong>{incomingRec.street_time}</strong></div>}
            {incomingRec.emo_intensity && <div className="isrow"><span>감정강도</span><strong>{incomingRec.emo_intensity}/5</strong></div>}
            {incomingRec.imp_acted && <div className="isrow"><span>충동 행동</span><strong>{incomingRec.imp_acted}</strong></div>}
            <div className="isrow">
              <span>감정</span>
              <strong>{[
                incomingRec.emo_okay    && "괜찮음",
                incomingRec.emo_anxious && "불안",
                incomingRec.emo_lonely  && "외로움",
                incomingRec.emo_angry   && "화남",
                incomingRec.emo_sad     && "슬픔",
              ].filter(Boolean).join(" · ")||"미입력"}</strong>
            </div>
          </div>
          {incomingRec.good_thing && (
            <div className="incoming-text-card">
              <div className="itc-label">🌱 오늘 잘한 것</div>
              <div className="itc-text">{incomingRec.good_thing}</div>
            </div>
          )}
          {incomingRec.hard_thing && (
            <div className="incoming-text-card">
              <div className="itc-label">😢 오늘 가장 힘들었던 것</div>
              <div className="itc-text">{incomingRec.hard_thing}</div>
            </div>
          )}
          {incomingRec.memo && (
            <div className="incoming-text-card">
              <div className="itc-label">💬 메모</div>
              <div className="itc-text">{incomingRec.memo}</div>
            </div>
          )}
          <button className="btn-dark" onClick={saveIncoming}>저장하고 전체 보기</button>
          <button className="btn-ghost" onClick={()=>setIncoming(null)}>무시하고 내 체크리스트 열기</button>
        </div>
        <style>{CSS}</style>
      </div>
    );
  }

  // ── 제출 완료 화면 ────────────────────────────
  if (submitted) {
    const spTotal=totalSpend(form.spending);
    return (
      <div className="app">
        <div className="done-screen">
          <div style={{fontSize:48}}>🌱</div>
          <h2 className="done-title">오늘도 수고했어요</h2>
          {spTotal>0 && <div className="done-spend">오늘 지출 <strong>{fmtWon(spTotal)}</strong></div>}
          {form.good_thing && <div className="done-good">🌱 {form.good_thing}</div>}
          <p className="done-sub">아래 링크를 카톡으로 보내주세요</p>
          <div className="share-box">
            <div className="share-box-title">📤 오늘 기록 공유하기</div>
            <div className="share-url">{shareLink.length>60?shareLink.slice(0,57)+"...":shareLink}</div>
            <button className="btn-copy" onClick={copyLink}>{copyMsg||"링크 복사하기"}</button>
            <div className="share-hint">이 링크를 카톡으로 전송하면<br/>상대방이 기록을 바로 확인할 수 있어요</div>
          </div>
          <button className="btn-dark" style={{width:"100%",maxWidth:320}} onClick={()=>{setTab("mine");setSubmitted(false);}}>내 기록 보기</button>
          <button className="btn-ghost" style={{width:"100%",maxWidth:320}} onClick={()=>{setForm(initialForm());setSubmitted(false);}}>다시 입력하기</button>
        </div>
        <style>{CSS}</style>
      </div>
    );
  }

  // ── 메인 화면 ─────────────────────────────────
  return (
    <div className="app">
      <header className="app-hd">
        <h1 className="app-title">🌱 웅녀 회복 체크리스트</h1>
        <div className="tab-bar">
          {[{id:"check",label:"체크하기"},{id:"mine",label:"내 기록"},{id:"shared",label:"받은 기록"}].map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
              {t.label}
              {t.id==="shared" && sharedRecords.length>0 && <span className="badge">{sharedRecords.length}</span>}
            </button>
          ))}
        </div>
      </header>

      {tab==="check" && (
        <div className="body">
          <div className="date-chip">{todayStr()}</div>
          {alreadyToday && <div className="already-note">오늘 이미 제출했어요. 수정하려면 다시 체크 후 제출하세요.</div>}

          {SECTIONS.map(sec=>(
            <div key={sec.id} className="sec-card">
              <div className="sec-hd">
                <span className="sec-em">{sec.emoji}</span>
                <span className="sec-title">{sec.title}</span>
              </div>
              {sec.sub && <div className="sec-sub">{sec.sub}</div>}

              {/* 체크박스 */}
              {sec.fields && (
                <div className="chk-list">
                  {sec.fields.map(f=>(
                    <label key={f.key} className={`chk-item ${form[f.key]?"checked":""}`} onClick={()=>toggle(f.key)}>
                      <span className="chk-box">{form[f.key]?"☑":"☐"}</span>
                      {f.label}
                    </label>
                  ))}
                </div>
              )}

              {/* 라디오 (섹션 내 추가 질문) */}
              {sec.radio && (
                <div className="radio-group">
                  <div className="radio-label">{sec.radio.label}</div>
                  <div className="radio-list">
                    {sec.radio.options.map(opt=>(
                      <label key={opt} className={`radio-item ${form[sec.radio.key]===opt?"checked":""}`}>
                        <input type="radio" name={sec.radio.key} value={opt}
                          checked={form[sec.radio.key]===opt}
                          onChange={()=>setRadio(sec.radio.key,opt)}/>
                        <span className="radio-dot">{form[sec.radio.key]===opt?"●":"○"}</span>
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* ⑪ 잘한 것 */}
          <div className="sec-card">
            <div className="sec-hd"><span className="sec-em">🌱</span><span className="sec-title">⑪ 오늘 잘한 것</span></div>
            <textarea className="text-ta" placeholder="오늘 내가 잘한 것 하나를 적어요..."
              value={form.good_thing} onChange={e=>setText("good_thing",e.target.value)} rows={2}/>
          </div>

          {/* ⑫ 힘들었던 것 */}
          <div className="sec-card">
            <div className="sec-hd"><span className="sec-em">😢</span><span className="sec-title">⑫ 오늘 가장 힘들었던 것</span></div>
            <textarea className="text-ta" placeholder="오늘 가장 힘들었던 순간을 적어요..."
              value={form.hard_thing} onChange={e=>setText("hard_thing",e.target.value)} rows={2}/>
          </div>

          {/* 지출 */}
          <div className="sec-card">
            <div className="sec-hd"><span className="sec-em">💸</span><span className="sec-title">오늘 지출</span></div>
            <div className="sec-sub">항목별로 쓴 금액을 입력해요 (선택)</div>
            <div className="sp-list">
              {SPEND_CATEGORIES.map(cat=>(
                <div key={cat.key} className="sp-row">
                  <span className="sp-em">{cat.emoji}</span>
                  <span className="sp-label">{cat.label}</span>
                  <div className="sp-iw">
                    <input type="number" className="sp-input" placeholder="0" min="0"
                      value={form.spending[cat.key]} onChange={e=>setSpend(cat.key,e.target.value)}/>
                    <span className="sp-unit">원</span>
                  </div>
                </div>
              ))}
            </div>
            {totalSpend(form.spending)>0 && (
              <div className="sp-total">오늘 총 지출 <span className="sp-amt">{fmtWon(totalSpend(form.spending))}</span></div>
            )}
          </div>

          {/* ⑬ 자유 메모 */}
          <div className="sec-card">
            <div className="sec-hd"><span className="sec-em">💬</span><span className="sec-title">⑬ 자유 메모</span></div>
            <textarea className="text-ta" placeholder="하고 싶은 말이 있으면 자유롭게 적어요..."
              value={form.memo} onChange={e=>setText("memo",e.target.value)} rows={3}/>
          </div>

          <button className="btn-submit" onClick={handleSubmit}>오늘 기록 제출하기</button>
        </div>
      )}

      {tab==="mine" && (
        <div className="body">
          <HistoryList records={myRecords} isShared={false}/>
        </div>
      )}

      {tab==="shared" && (
        <div className="body">
          <div className="shared-info">📨 상대방이 카톡으로 보낸 링크를 열면 자동으로 여기에 저장돼요</div>
          <HistoryList records={sharedRecords} isShared={true}/>
        </div>
      )}

      <style>{CSS}</style>
    </div>
  );
}

const CSS = `
* { box-sizing:border-box; margin:0; padding:0; }
body { background:#f0ede8; }
.app { min-height:100vh; background:#f0ede8; font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif; color:#2a2520; max-width:480px; margin:0 auto; }

.app-hd { background:#2a2520; padding:18px 20px 0; position:sticky; top:0; z-index:10; }
.app-title { color:#e8e0d4; font-size:16px; font-weight:800; padding-bottom:12px; letter-spacing:-0.3px; }
.tab-bar { display:flex; }
.tab { flex:1; padding:10px 4px; border:none; background:transparent; color:#8a7f74; font-size:13px; font-weight:600; cursor:pointer; border-bottom:2px solid transparent; display:flex; align-items:center; justify-content:center; gap:5px; }
.tab.active { color:#a8d878; border-bottom-color:#a8d878; }
.badge { background:#a8d878; color:#2a2520; border-radius:10px; padding:1px 6px; font-size:11px; font-weight:700; }

.body { padding:16px; display:flex; flex-direction:column; gap:12px; padding-bottom:40px; }
.date-chip { background:#2a2520; color:#a8d878; border-radius:20px; padding:5px 14px; font-size:12px; font-weight:600; align-self:flex-start; }
.already-note { background:#f0f7e8; border-left:3px solid #a8d878; border-radius:8px; padding:10px 14px; font-size:13px; color:#4a7020; }
.shared-info { background:#e8f0ff; border-left:3px solid #6a9adc; border-radius:8px; padding:10px 14px; font-size:12px; color:#3a5a9a; line-height:1.5; }

.sec-card { background:white; border-radius:16px; padding:16px; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
.sec-hd { display:flex; align-items:center; gap:8px; margin-bottom:4px; }
.sec-em { font-size:17px; }
.sec-title { font-size:14px; font-weight:700; color:#2a2520; }
.sec-sub { font-size:12px; color:#9a9088; margin-bottom:8px; padding-left:26px; }

.chk-list { display:flex; flex-direction:column; gap:3px; margin-top:8px; }
.chk-item { display:flex; align-items:center; gap:9px; padding:9px 10px; border-radius:10px; cursor:pointer; font-size:13px; color:#4a4540; user-select:none; transition:background .1s; }
.chk-item:hover { background:#f5f2ee; }
.chk-item.checked { background:#f0f7e8; color:#2a2520; font-weight:600; }
.chk-box { font-size:17px; color:#c5bbb0; width:20px; text-align:center; flex-shrink:0; }
.chk-item.checked .chk-box { color:#7ab840; }

.radio-group { margin-top:12px; padding-top:12px; border-top:1px solid #f0ede8; }
.radio-label { font-size:12px; font-weight:600; color:#7a706a; margin-bottom:8px; }
.radio-list { display:flex; flex-wrap:wrap; gap:6px; }
.radio-item { display:flex; align-items:center; gap:6px; padding:7px 12px; border-radius:20px; border:1.5px solid #e8e0d4; cursor:pointer; font-size:13px; color:#4a4540; user-select:none; transition:all .1s; }
.radio-item input[type=radio] { display:none; }
.radio-item.checked { background:#f0f7e8; border-color:#7ab840; color:#2a2520; font-weight:600; }
.radio-dot { font-size:13px; color:#c5bbb0; }
.radio-item.checked .radio-dot { color:#7ab840; }

.text-ta { width:100%; margin-top:10px; padding:11px; border:1.5px solid #e8e0d4; border-radius:10px; font-size:13px; font-family:inherit; color:#2a2520; resize:none; outline:none; background:#fafaf8; line-height:1.6; }
.text-ta:focus { border-color:#a8d878; }

.sp-list { display:flex; flex-direction:column; gap:7px; margin-top:10px; }
.sp-row { display:flex; align-items:center; gap:7px; }
.sp-em { font-size:15px; width:20px; text-align:center; flex-shrink:0; }
.sp-label { font-size:13px; color:#4a4540; flex:1; }
.sp-iw { display:flex; align-items:center; gap:3px; }
.sp-input { width:85px; padding:7px 8px; border:1.5px solid #e8e0d4; border-radius:8px; font-size:13px; font-family:inherit; color:#2a2520; text-align:right; outline:none; background:#fafaf8; -moz-appearance:textfield; }
.sp-input::-webkit-inner-spin-button,.sp-input::-webkit-outer-spin-button { -webkit-appearance:none; }
.sp-input:focus { border-color:#a8d878; }
.sp-unit { font-size:12px; color:#9a9088; }
.sp-total { margin-top:12px; padding-top:10px; border-top:1.5px solid #f0ede8; display:flex; justify-content:space-between; align-items:center; font-size:12px; color:#6a6058; }
.sp-amt { font-size:15px; font-weight:800; color:#2a2520; }

.btn-submit { background:#2a2520; color:#a8d878; border:none; border-radius:14px; padding:15px; font-size:15px; font-weight:700; cursor:pointer; width:100%; transition:opacity .15s; }
.btn-submit:hover { opacity:.88; }
.btn-dark { background:#2a2520; color:#e8e0d4; border:none; border-radius:12px; padding:13px; font-size:14px; font-weight:700; cursor:pointer; width:100%; transition:opacity .15s; }
.btn-dark:hover { opacity:.85; }
.btn-ghost { background:transparent; color:#9a9088; border:1.5px solid #d8d0c8; border-radius:12px; padding:12px; font-size:13px; cursor:pointer; width:100%; }
.btn-copy { background:#a8d878; color:#2a2520; border:none; border-radius:10px; padding:11px; font-size:14px; font-weight:700; cursor:pointer; transition:opacity .15s; }
.btn-copy:hover { opacity:.85; }

.done-screen { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:32px 24px; gap:14px; }
.done-title { font-size:22px; font-weight:800; color:#2a2520; }
.done-spend { background:#f0f7e8; border-radius:10px; padding:9px 18px; font-size:13px; color:#4a7020; }
.done-spend strong { color:#2a2520; font-size:15px; }
.done-good { background:#f0f7e8; border-radius:10px; padding:9px 18px; font-size:13px; color:#4a7020; max-width:320px; text-align:center; }
.done-sub { font-size:13px; color:#7a706a; }
.share-box { background:white; border-radius:16px; padding:18px; width:100%; max-width:360px; box-shadow:0 2px 8px rgba(0,0,0,0.08); display:flex; flex-direction:column; gap:10px; }
.share-box-title { font-size:14px; font-weight:700; color:#2a2520; }
.share-url { font-size:11px; color:#9a9088; background:#f5f2ee; border-radius:8px; padding:8px 10px; word-break:break-all; line-height:1.5; }
.share-hint { font-size:12px; color:#9a9088; text-align:center; line-height:1.6; }

.incoming-screen { display:flex; flex-direction:column; align-items:center; padding:40px 24px; gap:14px; }
.incoming-hd { display:flex; align-items:center; gap:14px; width:100%; max-width:360px; }
.incoming-title { font-size:18px; font-weight:800; color:#2a2520; }
.incoming-date { font-size:13px; color:#9a9088; margin-top:2px; }
.incoming-summary { background:white; border-radius:16px; padding:18px; width:100%; max-width:360px; box-shadow:0 1px 6px rgba(0,0,0,0.07); display:flex; flex-direction:column; gap:10px; }
.isrow { display:flex; justify-content:space-between; align-items:center; font-size:14px; }
.isrow span { color:#7a706a; }
.isrow strong { color:#2a2520; }
.incoming-text-card { background:white; border-radius:12px; padding:14px; width:100%; max-width:360px; }
.itc-label { font-size:12px; font-weight:700; color:#9a9088; margin-bottom:6px; }
.itc-text { font-size:14px; color:#2a2520; line-height:1.6; }

.weekly { background:#2a2520; color:#e8e0d4; border-radius:14px; padding:14px 18px; display:flex; justify-content:space-between; align-items:center; }
.wl { font-size:12px; opacity:.7; }
.wa { font-size:17px; font-weight:800; color:#a8d878; }

.h-card { background:white; border-radius:14px; padding:15px; cursor:pointer; box-shadow:0 1px 4px rgba(0,0,0,0.05); transition:transform .1s; }
.h-card:hover { transform:translateY(-1px); }
.h-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.h-date { font-size:13px; font-weight:700; color:#2a2520; }
.h-sp { font-size:13px; font-weight:800; color:#c47a20; }
.h-bar-row { display:flex; align-items:center; gap:9px; margin-bottom:9px; }
.h-bar { flex:1; height:5px; background:#e8e0d4; border-radius:3px; overflow:hidden; }
.h-fill { height:100%; background:#a8d878; border-radius:3px; }
.h-pct { font-size:12px; font-weight:700; color:#4a7020; min-width:30px; text-align:right; }
.h-tags { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:6px; }
.tag { font-size:11px; padding:2px 9px; border-radius:20px; background:#f0ede8; color:#6a6058; font-weight:500; }
.tag.green { background:#e8f5e2; color:#3a7030; }
.tag.amber { background:#fff3d6; color:#8a6010; }
.h-good { font-size:12px; color:#4a7020; background:#f0f7e8; border-radius:8px; padding:6px 10px; margin-bottom:6px; }
.h-time { font-size:11px; color:#b0a89e; }
.empty { text-align:center; padding:50px 20px; color:#9a9088; font-size:13px; line-height:1.8; white-space:pre-line; }

.pct-row { margin:10px 0; }
.pct-label { font-size:12px; color:#7a706a; margin-bottom:4px; }
.pct-bar { height:7px; background:#e8e0d4; border-radius:4px; overflow:hidden; }
.pct-fill { height:100%; background:#a8d878; border-radius:4px; }

.spend-block { background:#f0f7e8; border-radius:12px; padding:14px 16px; margin-bottom:14px; }
.sb-title { font-size:12px; font-weight:700; color:#4a7020; margin-bottom:8px; }
.sb-row { display:flex; justify-content:space-between; font-size:13px; color:#4a4540; margin-bottom:5px; }
.sb-amt { font-weight:600; color:#2a2520; }
.sb-total { margin-top:8px; padding-top:8px; border-top:1px solid #c8e0a8; font-size:13px; color:#6a6058; text-align:right; }
.sb-total strong { font-size:15px; color:#2a2520; }

.shared-badge { background:#e8f0ff; color:#3a5a9a; border-radius:6px; padding:2px 8px; font-size:11px; font-weight:600; margin-top:3px; display:inline-block; }
.overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:100; display:flex; align-items:flex-end; justify-content:center; }
.modal { background:white; border-radius:20px 20px 0 0; width:100%; max-width:480px; max-height:85vh; overflow-y:auto; padding:20px; }
.modal-hd { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; }
.modal-date { font-size:15px; font-weight:700; }
.close-btn { background:#f0ede8; border:none; border-radius:50%; width:30px; height:30px; font-size:13px; cursor:pointer; color:#6a6058; flex-shrink:0; }
.rec-secs { display:flex; flex-direction:column; gap:12px; }
.rec-t { font-size:12px; font-weight:700; color:#6a6058; margin-bottom:3px; }
.rec-i { font-size:13px; color:#2a2520; padding:2px 0 2px 8px; }
.rec-none { font-size:12px; color:#b0a89e; padding-left:8px; }
.rec-v { font-size:13px; color:#2a2520; padding-left:8px; }
.rec-memo { font-size:13px; color:#4a4540; background:#fafaf8; border-radius:8px; padding:9px; line-height:1.5; }
.modal-ft { margin-top:14px; font-size:11px; color:#b0a89e; text-align:center; padding-bottom:6px; }
`;
