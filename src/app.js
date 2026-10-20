import { sb } from './supabase.js';
const API=window.claude&&window.claude.use?window.claude:null;
const LOGO=document.querySelector('.brand img').src;
/* ---------- Constants ---------- */
const TABS=[
 {id:'report',name:'Báo cáo tổng hợp',icon:'📊',sub:'Toàn cảnh mọi hạng mục theo kỳ'},
 {id:'habits',name:'Nhật ký thói quen',icon:'🌱',sub:'Rèn Thân – Tâm – Tuệ mỗi ngày'},
 {id:'karma',name:'Quản lý nghiệp',icon:'☯️',sub:'Kế hoạch & nhật ký gieo hạt'},
 {id:'gratitude',name:'Nhật ký biết ơn',icon:'🙏',sub:'10 điều biết ơn mỗi ngày'},
 {id:'order',name:'Order vũ trụ',icon:'✨',sub:'Đặt hàng rõ ràng, đón nhận đủ đầy'},
 {id:'journal',name:'Nhật ký ngày',icon:'📔',sub:'Nhìn lại để tiến lên'},
 {id:'videos',name:'Video ý nghĩa',icon:'▶️',sub:'Thư viện video nuôi dưỡng Thân – Tâm – Tuệ'},
 {id:'quotes',name:'Châm ngôn & nguyên tắc',icon:'🔥',sub:'Ngọn lửa động lực mỗi khi mở trang'},
 {id:'account',name:'Tài khoản',icon:'👤',sub:'Đăng nhập, mật khẩu và tài khoản người dùng'}];
const ICONS={
 report:'<path d="M4 20V11M10 20V5M16 20v-8M21 20H3"/>',
 habits:'<path d="M12 21v-9"/><path d="M12 12C12 7.5 8.5 4.5 4 4.5c0 4.5 3.5 7.5 8 7.5z"/><path d="M12 14.5c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/>',
 karma:'<circle cx="12" cy="12" r="9"/><path d="M12 3a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 1 0 9"/>',
 gratitude:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
 order:'<path d="M12 3l2 5.5 5.5 2-5.5 2L12 18l-2-5.5L4.5 10.5l5.5-2z"/><path d="M19 17v4M17 19h4"/>',
 journal:'<path d="M6 3.5h10.5a2.5 2.5 0 0 1 2.5 2.5v14.5H8.5A2.5 2.5 0 0 1 6 18z"/><path d="M6 18a2.5 2.5 0 0 1 2.5-2.5H19M10 8h5"/>',
 videos:'<rect x="3" y="5" width="18" height="14" rx="3.5"/><path d="M10 9.2l5 2.8-5 2.8z"/>',
 quotes:'<path d="M12 21.5c3.9 0 6.5-2.8 6.5-6.5 0-3.6-2.6-5.6-3.6-8.5-1 1.8-2 2.8-3 2.8 0-2-.8-4.2-2-5.3-.8 3.9-4.4 5.9-4.4 11 0 3.7 2.6 6.5 6.5 6.5z"/>',
 account:'<circle cx="12" cy="8" r="4"/><path d="M4 20.5c1.2-4 4.3-6 8-6s6.8 2 8 6"/>'};
const ico=id=>`<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[id]||''}</svg>`;
const CATS={than:{name:'Thân',c:'var(--than)',ico:'💪'},tam:{name:'Tâm',c:'var(--tam)',ico:'❤️'},tue:{name:'Tuệ',c:'var(--tue)',ico:'🧠'}};
const KCOLS=[{id:'kh',name:'Khách hàng',c:'var(--k1)',ico:'🤝'},{id:'dt',name:'Đối tác',c:'var(--k2)',ico:'🌿'},{id:'dn',name:'Đồng nghiệp',c:'var(--k3)',ico:'👥'},{id:'tg',name:'Thế giới',c:'var(--k4)',ico:'🌏'},{id:'gd',name:'Gia đình/bạn bè',c:'var(--k5)',ico:'🏡'}];
const KMAP=Object.fromEntries(KCOLS.map(c=>[c.id,c]));
const THEMES={anvi:'linear-gradient(135deg,#0B5D2E,#1F9A47 60%,#5EBD5F)',rung:'linear-gradient(135deg,#14532D,#65A30D)',bien:'linear-gradient(135deg,#0F766E,#22C55E)',binhminh:'linear-gradient(135deg,#F97316,#EC4899)',vutru:'linear-gradient(135deg,#312E81,#7C3AED 55%,#C026D3)',hoanghon:'linear-gradient(135deg,#B45309,#EF4444 60%,#DB2777)'};
const MOODS=['😞','😐','🙂','😊','🤩'];
const WD=['T2','T3','T4','T5','T6','T7','CN'];
const uid=()=>Math.random().toString(36).slice(2,9);
const DEFAULT_CONFIG=()=>({
 habits:[
  {id:uid(),name:'Tập thể dục',cat:'than',target:30,unit:'phút'},
  {id:uid(),name:'Uống nước',cat:'than',target:8,unit:'cốc'},
  {id:uid(),name:'Thiền định',cat:'tam',target:15,unit:'phút'},
  {id:uid(),name:'Nói lời yêu thương',cat:'tam',target:3,unit:'lần'},
  {id:uid(),name:'Đọc sách',cat:'tue',target:20,unit:'trang'},
  {id:uid(),name:'Học kỹ năng mới',cat:'tue',target:30,unit:'phút'}],
 quotes:[
  {id:uid(),text:'Mỗi ngày tốt hơn 1% – sau một năm bạn sẽ là một con người khác.',author:'Nguyên tắc sống',kind:'Nguyên tắc sống',theme:'anvi',active:true},
  {id:uid(),text:'Muốn nhận điều gì, hãy gieo điều đó cho người khác trước.',author:'Luật nhân quả',kind:'Châm ngôn',theme:'bien',active:true},
  {id:uid(),text:'Biết ơn biến những gì ta đang có thành đủ đầy.',author:'Châm ngôn',kind:'Châm ngôn',theme:'rung',active:true},
  {id:uid(),text:'Kỷ luật là cây cầu nối giữa mục tiêu và thành tựu.',author:'Jim Rohn',kind:'Châm ngôn',theme:'anvi',active:true},
  {id:uid(),text:'Thân khỏe để đi xa, Tâm an để đi vững, Tuệ sáng để đi đúng.',author:'Nguyên tắc sống',kind:'Nguyên tắc sống',theme:'bien',active:true}],
 karmaGoals:[],
 popup:true});

/* ---------- Utils ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const keyOf=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseKey=k=>{const[y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)};
const addDays=(k,n)=>{const d=parseKey(k);d.setDate(d.getDate()+n);return keyOf(d)};
const TODAY=()=>keyOf(new Date());
const fmtLong=k=>{const d=parseKey(k);const w=['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'][d.getDay()];return `${w}, ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`};
const fmtShort=k=>{const d=parseKey(k);return `${pad(d.getDate())}/${pad(d.getMonth()+1)}`};
const fmtShortY=k=>{const d=parseKey(k);return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`};
const monthDays=k=>{const d=parseKey(k);const n=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();return Array.from({length:n},(_,i)=>`${k.slice(0,7)}-${pad(i+1)}`)};
const clamp01=x=>Math.max(0,Math.min(1,x));
const avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:0;
const weekStart=k=>{const d=parseKey(k);d.setDate(d.getDate()-((d.getDay()+6)%7));return keyOf(d)};

/* ---------- State & persistence (Supabase) ---------- */
let S={config:normalizeConfig(null),months:{}};
let cur=TODAY(), tab='habits', SAMPLE=null, sampleReady=false;
const AIRES={};
let ME=null, syncToken=0, loaded=false, saving=false, saveAgain=false, saveTimer=null;
const pendingGrowth=new Map();
const LEGACY_KEY='anvi-v1', MIGRATED_KEY='anvi-migrated-to';
function normalizeConfig(c){c=c||DEFAULT_CONFIG();c.habits??=[];c.quotes??=[];c.karmaGoals??=[];c.videos??=[];if(c.popup===undefined)c.popup=true;return c}
function fromBody(b){return{config:normalizeConfig(b?.config),months:b?.months||{}}}

const getDay=k=>(S.months[k.slice(0,7)]?.days?.[k])||{};
function editDay(k){const ym=k.slice(0,7);S.months[ym]??={days:{}};S.months[ym].days??={};S.months[ym].days[k]??={};dirty();return S.months[ym].days[k]}
function allDays(){const out={};for(const m of Object.values(S.months))Object.assign(out,m.days||{});return out}

function dirty(){clearTimeout(saveTimer);saveTimer=setTimeout(flush,700);setStatus('saving')}
/* Ghi nhận trạng thái một thói quen trong một ngày để đồng bộ sang bảng growth_habits */
function markGrowth(id,date){const h=S.config.habits.find(x=>x.id===id);if(!h)return;
  pendingGrowth.set(h.name+'|'+date,{habit_name:h.name,target_date:date,is_completed:hv(date,h)>=h.target})}

async function flush(){
  clearTimeout(saveTimer);
  if(!sb||!ME||!loaded)return;
  if(saving){saveAgain=true;return}
  saving=true;const my=syncToken;
  const rows=[...pendingGrowth.values()];pendingGrowth.clear();
  try{
    const {error}=await sb.from('user_data').upsert({user_id:ME.id,body:JSON.parse(JSON.stringify(S)),updated_at:new Date().toISOString()});
    if(error)throw error;
    if(rows.length){
      const {error:e2}=await sb.from('growth_habits').upsert(rows.map(r=>({...r,user_id:ME.id})),{onConflict:'user_id,habit_name,target_date'});
      if(e2)throw e2;
    }
    if(my===syncToken)setStatus('cloud');
  }catch(e){
    console.error(e);
    rows.forEach(r=>pendingGrowth.set(r.habit_name+'|'+r.target_date,r));
    if(my===syncToken){setStatus('error','Chưa lưu được – đang thử lại');setTimeout(()=>{if(my===syncToken)flush()},4000)}
  }finally{
    saving=false;
    if(saveAgain){saveAgain=false;flush()}
  }
}
function setStatus(s,msg){const el=$('#status');el.dataset.s=s;el.querySelector('span').textContent=msg||({cloud:'Đã đồng bộ tài khoản',saving:'Đang lưu…',local:'Chưa kết nối',error:'Lỗi lưu'})[s]}
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),2000)}

/* ---------- Period & comparison ---------- */
const P={mode:'month',from:null,to:null,cmp:false,cmpMode:'prev',cfrom:null,cto:null};
const ord=(a,b)=>a<=b?{from:a,to:b}:{from:b,to:a};
function curRange(){
  if(P.mode==='day')return{from:cur,to:cur};
  if(P.mode==='week'){const w=weekStart(cur);return{from:w,to:addDays(w,6)}}
  if(P.mode==='month'){const m=monthDays(cur);return{from:m[0],to:m[m.length-1]}}
  return ord(P.from||addDays(cur,-6),P.to||cur);
}
function cmpRange(r){
  if(P.cmpMode==='custom'&&P.cfrom&&P.cto)return ord(P.cfrom,P.cto);
  if(P.mode==='month'){const d=parseKey(r.from);d.setMonth(d.getMonth()-1);const m=monthDays(keyOf(d));return{from:m[0],to:m[m.length-1]}}
  const n=rangeDays(r).length;return{from:addDays(r.from,-n),to:addDays(r.from,-1)};
}
function rangeDays(r){const out=[];let k=r.from;let g=0;while(k<=r.to&&g<1500){out.push(k);k=addDays(k,1);g++}return out}
const countDays=r=>{const t=TODAY();return rangeDays(r).filter(k=>k<=t)};
const rangeLabel=r=>r.from===r.to?fmtShortY(r.from):`${fmtShortY(r.from)} – ${fmtShortY(r.to)}`;
function periodBar(){
  const r=curRange();const c=cmpRange(r);
  const modes=[['day','Ngày'],['week','Tuần'],['month','Tháng'],['custom','Tùy chỉnh']];
  return `<div class="pbar">
   <div class="seg" role="group" aria-label="Kỳ báo cáo">${modes.map(([m,n])=>`<button data-pmode="${m}" aria-pressed="${P.mode===m}">${n}</button>`).join('')}</div>
   ${P.mode==='custom'?`<input type="date" data-pin="from" value="${r.from}" aria-label="Từ ngày"><span class="lbl">đến</span><input type="date" data-pin="to" value="${r.to}" aria-label="Đến ngày">`:`<span class="lbl">Kỳ: <b>${rangeLabel(r)}</b></span>`}
   <span class="spacer"></span>
   <label class="switch"><input type="checkbox" data-pcmp ${P.cmp?'checked':''}> So sánh</label>
   ${P.cmp?`<select data-pcm aria-label="Kỳ so sánh"><option value="prev" ${P.cmpMode==='prev'?'selected':''}>với kỳ trước</option><option value="custom" ${P.cmpMode==='custom'?'selected':''}>với kỳ tùy chỉnh</option></select>
     ${P.cmpMode==='custom'?`<input type="date" data-pin="cfrom" value="${c.from}" aria-label="So sánh từ"><span class="lbl">–</span><input type="date" data-pin="cto" value="${c.to}" aria-label="So sánh đến">`:`<span class="lbl">(${rangeLabel(c)})</span>`}`:''}
  </div>`;
}
document.addEventListener('click',e=>{
  const m=e.target.closest('[data-pmode]');if(m){P.mode=m.dataset.pmode;if(P.mode==='custom'&&!P.from){P.from=addDays(cur,-6);P.to=cur}render()}
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.matches('[data-pin]')&&t.value){P[t.dataset.pin]=t.value;if(t.dataset.pin.startsWith('c')){const c=cmpRange(curRange());P.cfrom??=c.from;P.cto??=c.to}render()}
  else if(t.matches('[data-pcmp]')){P.cmp=t.checked;render()}
  else if(t.matches('[data-pcm]')){P.cmpMode=t.value;if(t.value==='custom'){const c=cmpRange(curRange());P.cfrom=P.cfrom||c.from;P.cto=P.cto||c.to}render()}
});
function fmtVal(v,f){if(f==='%')return Math.round(v)+'%';if(f==='d1')return v?v.toFixed(1):'–';return Math.round(v).toLocaleString('vi-VN')}
function growth(a,b){
  if(!b){return a>0?'<span class="gr up">▲ Mới</span>':'<span class="gr">–</span>'}
  const g=(a-b)/Math.abs(b)*100;const cls=g>0.05?'up':g<-0.05?'down':'';
  return `<span class="gr ${cls}">${g>0.05?'▲':g<-0.05?'▼':'■'} ${Math.abs(g).toFixed(Math.abs(g)<10?1:0)}%</span>`;
}
function metricCards(list){
  const r=curRange(),c=cmpRange(r);
  return `<div class="stats">${list.map(m=>{const v=m.val(r);const showC=P.cmp&&!m.noCmp;const pv=showC?m.val(c):0;
    return `<div class="stat" style="--c:${m.c||'var(--g2)'}"><b>${fmtVal(v,m.fmt)}</b><span>${m.label}</span>${showC?`<div class="cmp">${growth(v,pv)}<span>kỳ so sánh: ${fmtVal(pv,m.fmt)}</span></div>`:(m.note?`<div class="cmp">${m.note}</div>`:'')}</div>`}).join('')}</div>`;
}
function summaryCard(title,sub,inner){return `<div class="card" id="summary"><div class="sec-title"><h3>📈 ${title}</h3></div>${sub?`<p class="sub">${sub}</p>`:''}${periodBar()}<div id="sumBody">${inner()}</div></div>`}

/* ---------- Shell ---------- */
function renderNav(){$('#nav').innerHTML=TABS.map(t=>`<button data-tab="${t.id}" ${t.id===tab?'aria-current="page"':''}><span class="ico">${ico(t.id)}</span>${t.name}</button>`).join('')}
$('#nav').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(!b)return;tab=b.dataset.tab;render();window.scrollTo({top:0})});
$('#who').onclick=()=>{tab='account';render();window.scrollTo({top:0})};
function renderWho(){if(!ME)return;const e=ME.email||'';$('#who').innerHTML=`<span class="av">${esc(e[0]?.toUpperCase()||'?')}</span><div><b>${esc(e)}</b><span>Đã đăng nhập</span></div>`}
$('#prevDay').onclick=()=>setDate(addDays(cur,-1));
$('#nextDay').onclick=()=>setDate(addDays(cur,1));
$('#todayBtn').onclick=()=>setDate(TODAY());
$('#datePick').onchange=e=>e.target.value&&setDate(e.target.value);
$('#themeBtn').onclick=()=>{const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;r.dataset.theme=dark?'light':'dark';try{localStorage.setItem('anvi-theme',r.dataset.theme)}catch(e){}};
try{const t=localStorage.getItem('anvi-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}
function setDate(k){cur=k;render()}
function render(){
  renderNav();const t=TABS.find(x=>x.id===tab);
  window.AI_HOOK=null;
  const noDate=['quotes','videos','account'].includes(tab);
  $('#title').innerHTML=`<span class="tico">${ico(t.id)}</span>${t.name}<small>${noDate?t.sub:fmtLong(cur)+' · '+t.sub}</small>`;
  $('#datePick').value=cur;
  document.querySelector('.datebar').style.visibility=noDate?'hidden':'visible';
  VIEWS[tab]();renderMiniQuote();renderWho();
}
function refreshSummary(){const b=$('#sumBody');if(b&&SUM[tab])b.innerHTML=SUM[tab]()}
function renderMiniQuote(){const act=S.config.quotes.filter(q=>q.active);const q=act[(new Date().getDate())%Math.max(1,act.length)];
  $('#miniQuote').innerHTML=q?`${esc(q.text)}<span>Bấm để mở châm ngôn</span>`:'Thêm châm ngôn để nhận động lực mỗi ngày<span>Mở tab Châm ngôn</span>'}
$('#miniQuote').onclick=()=>{S.config.quotes.some(q=>q.active)?showPopup():(tab='quotes',render())};

/* ---------- Calendar ---------- */
function calendar(cellFn){
  const first=parseKey(cur.slice(0,7)+'-01');const off=(first.getDay()+6)%7;const today=TODAY();
  let h=`<div class="cal-head"><button class="icon-btn" data-mshift="-1" aria-label="Tháng trước">‹</button><b>Tháng ${first.getMonth()+1}/${first.getFullYear()}</b><button class="icon-btn" data-mshift="1" aria-label="Tháng sau">›</button></div><div class="cal">`;
  h+=WD.map(w=>`<div class="wd">${w}</div>`).join('');
  for(let i=0;i<off;i++)h+=`<div class="cal-cell blank"></div>`;
  for(const k of monthDays(cur)){const c=cellFn(k)||{};
    h+=`<button class="cal-cell ${k===today?'today':''} ${k===cur?'sel':''}" data-date="${k}" style="${c.style||''}" title="${esc(c.title||fmtLong(k))}"><span class="dn">${+k.slice(8)}</span>${c.html||''}</button>`}
  return h+'</div>';
}
document.addEventListener('click',e=>{
  const d=e.target.closest('[data-date]');if(d&&$('#view').contains(d)){setDate(d.dataset.date);return}
  const m=e.target.closest('[data-mshift]');if(m){const dt=parseKey(cur);const day=dt.getDate();dt.setDate(1);dt.setMonth(dt.getMonth()+ +m.dataset.mshift);const max=new Date(dt.getFullYear(),dt.getMonth()+1,0).getDate();dt.setDate(Math.min(day,max));setDate(keyOf(dt))}
});

const VIEWS={},SUM={};

/* ---------- 1. Habits ---------- */
const hv=(k,h)=>{const v=getDay(k).habits?.[h.id];return typeof v==='number'?v:0};
const hRatio=(k,h)=>h.target>0?clamp01(hv(k,h)/h.target):0;
function dayScore(k,list=S.config.habits){if(!list.length)return 0;return list.reduce((s,h)=>s+hRatio(k,h),0)/list.length}
const monthCountable=()=>{const t=TODAY();return monthDays(cur).filter(k=>k<=t)};
function habitRateIn(h,days){return days.length?days.filter(k=>hv(k,h)>=h.target).length/days.length:0}
const HABIT_METRICS=()=>[
  {label:'Hoàn thành TB/ngày',fmt:'%',c:'var(--g2)',val:r=>avg(countDays(r).map(k=>dayScore(k)))*100},
  {label:'Ngày đạt 100%',fmt:'n',c:'var(--g3)',val:r=>countDays(r).filter(k=>S.config.habits.length&&dayScore(k)>=1).length},
  ...Object.entries(CATS).map(([cid,c])=>({label:`${c.ico} ${c.name} – TB`,fmt:'%',c:c.c,val:r=>{const l=S.config.habits.filter(h=>h.cat===cid);return l.length?avg(countDays(r).map(k=>dayScore(k,l)))*100:0}}))];
function habitTable(){
  const r=curRange(),c=cmpRange(r),ds=countDays(r),dc=countDays(c);
  if(!S.config.habits.length)return '';
  return `<div class="mx-wrap" style="margin-top:16px"><table class="list"><thead><tr><th>Thói quen</th><th>Tổng số lượng</th><th>Ngày đạt</th><th>Tỉ lệ đạt</th>${P.cmp?'<th>Kỳ so sánh</th><th>Tăng trưởng</th>':''}</tr></thead><tbody>
   ${S.config.habits.map(h=>{const tot=ds.reduce((s,k)=>s+hv(k,h),0),rate=habitRateIn(h,ds)*100,prate=habitRateIn(h,dc)*100;
    return `<tr><td><span style="color:${CATS[h.cat].c}">●</span> ${esc(h.name)}</td><td class="num">${fmtVal(tot,'n')} ${esc(h.unit)}</td><td class="num">${ds.filter(k=>hv(k,h)>=h.target).length}/${ds.length}</td><td class="num">${Math.round(rate)}%</td>${P.cmp?`<td class="num">${Math.round(prate)}%</td><td class="num">${growth(rate,prate)}</td>`:''}</tr>`}).join('')}</tbody></table></div>`;
}
SUM.habits=()=>metricCards(HABIT_METRICS())+habitTable();
VIEWS.habits=()=>{
  const H=S.config.habits;const days=monthDays(cur);const t=TODAY();const mc=monthCountable();
  let rows='';
  for(const [cid,c] of Object.entries(CATS)){const list=H.filter(h=>h.cat===cid);if(!list.length)continue;
    rows+=`<tr class="grp"><td class="hn"><span class="chip" style="--c:${c.c}">${c.ico} ${c.name}</span></td><td class="hin" style="background:var(--surface)"></td><td colspan="${days.length+1}"></td></tr>`;
    rows+=list.map(h=>`<tr data-h="${h.id}" style="--c:${c.c}">
      <td class="hn"><div class="nm"><span title="${esc(h.name)}">${esc(h.name)}</span><button class="icon-btn" data-edit title="Sửa thói quen" style="width:24px;height:24px;font-size:13px">✎</button></div><div class="meta">${h.target} ${esc(h.unit)}/ngày</div></td>
      <td class="hin"><div class="stepper"><button data-step="-1" aria-label="Giảm">−</button><input type="number" min="0" step="any" inputmode="decimal" value="${getDay(cur).habits?.[h.id]??''}" placeholder="0" aria-label="Số lượng ${esc(h.name)} ngày ${fmtShort(cur)}"><button data-step="1" aria-label="Tăng">+</button><span class="pct">${Math.round(hRatio(cur,h)*100)}%</span></div></td>
      ${days.map(k=>{const r=hRatio(k,h);return `<td class="c ${k>t?'future':''} ${k===cur?'sel':''}" data-date="${k}" style="--r:${Math.round(r*100)}%" title="${fmtShort(k)}: ${hv(k,h)}/${h.target} ${esc(h.unit)}">${r>=1?'✓':''}</td>`}).join('')}
      <td class="rate" style="color:${c.c}">${Math.round(habitRateIn(h,mc)*100)}%</td></tr>`).join('');
  }
  $('#view').innerHTML=`<div class="grid">
   <div class="hero">
     <div class="ring" id="ring"><div><span><b id="ringPct">0%</b><br><small>hoàn thành</small></span></div></div>
     <div><h3 id="heroMsg"></h3><p>Tỉ lệ hoàn thành ngày ${fmtShort(cur)} theo từng hạng mục</p><div class="cats" id="cats"></div></div>
   </div>
   <div class="card">
     <div class="row"><div><h3>Thói quen & bảng lịch tháng ${+cur.slice(5,7)}/${cur.slice(0,4)}</h3><p class="sub" style="margin:0">Điền số lượng cho ngày ${fmtShort(cur)} ở cột nhập. Bấm ô lịch để chuyển sang ngày đó.</p></div><span class="spacer"></span>
       <button class="icon-btn" data-mshift="-1" aria-label="Tháng trước">‹</button><button class="icon-btn" data-mshift="1" aria-label="Tháng sau">›</button>
       <button class="btn primary" id="addHabit">+ Thêm thói quen</button></div>
     ${H.length?`<div class="mx-wrap" style="margin-top:12px"><table class="hx" id="hx"><thead><tr><th class="hn">Thói quen</th><th class="hin" style="text-align:left">Ngày ${fmtShort(cur)}</th>${days.map(k=>`<th class="${k===cur?'sel':''}">${+k.slice(8)}<br>${WD[(parseKey(k).getDay()+6)%7]}</th>`).join('')}<th class="rate">Đạt tháng</th></tr></thead><tbody>${rows}
     <tr class="total" style="--c:var(--g3)"><td class="hn" style="font-weight:800">Tổng hoàn thành ngày</td><td class="hin"><b id="totPct">${Math.round(dayScore(cur)*100)}%</b></td>${days.map(k=>{const r=dayScore(k);return `<td class="c ${k>t?'future':''} ${k===cur?'sel':''}" data-date="${k}" data-tot="${k}" style="--r:${Math.round(r*100)}%" title="${fmtShort(k)}: ${Math.round(r*100)}%">${r>0?Math.round(r*100):''}</td>`}).join('')}<td class="rate" id="totRate">${Math.round(avg(mc.map(k=>dayScore(k)))*100)}%</td></tr>
     </tbody></table></div>`:'<div class="empty" style="margin-top:14px">Chưa có thói quen nào. Bấm “Thêm thói quen” để bắt đầu.</div>'}
   </div>
   ${summaryCard('Tổng kết thói quen','Tỉ lệ hoàn thành theo kỳ, so sánh tăng trưởng với kỳ trước',SUM.habits)}
  </div>`;
  refreshHabitHero();
  $('#addHabit').onclick=()=>habitForm();
  const tb=$('#hx');if(!tb)return;
  tb.addEventListener('input',e=>{if(e.target.matches('.stepper input'))setHabit(e.target.closest('[data-h]').dataset.h,e.target.value)});
  tb.addEventListener('click',e=>{const row=e.target.closest('[data-h]');if(!row)return;const id=row.dataset.h;
    const st=e.target.closest('[data-step]');if(st){const inp=row.querySelector('.stepper input');const h=H.find(x=>x.id===id);const step=h.target>=20?5:1;let v=Math.max(0,(parseFloat(inp.value)||0)+ +st.dataset.step*step);inp.value=v;setHabit(id,v)}
    if(e.target.closest('[data-edit]'))habitForm(H.find(x=>x.id===id))});
};
function setHabit(id,val){
  const d=editDay(cur);d.habits??={};
  if(val===''||isNaN(parseFloat(val)))delete d.habits[id];else d.habits[id]=Math.max(0,parseFloat(val));
  markGrowth(id,cur);
  const h=S.config.habits.find(x=>x.id===id);const row=document.querySelector(`tr[data-h="${id}"]`);const r=hRatio(cur,h);
  row.querySelector('.pct').textContent=Math.round(r*100)+'%';
  const cell=row.querySelector(`td.c[data-date="${cur}"]`);if(cell){cell.style.setProperty('--r',Math.round(r*100)+'%');cell.textContent=r>=1?'✓':'';cell.title=`${fmtShort(cur)}: ${hv(cur,h)}/${h.target} ${h.unit}`}
  const mc=monthCountable();row.querySelector('.rate').textContent=Math.round(habitRateIn(h,mc)*100)+'%';
  const ds=dayScore(cur);const tc=document.querySelector(`td[data-tot="${cur}"]`);if(tc){tc.style.setProperty('--r',Math.round(ds*100)+'%');tc.textContent=ds>0?Math.round(ds*100):''}
  $('#totPct').textContent=Math.round(ds*100)+'%';$('#totRate').textContent=Math.round(avg(mc.map(k=>dayScore(k)))*100)+'%';
  refreshHabitHero();clearTimeout(setHabit._t);setHabit._t=setTimeout(refreshSummary,400);
}
function refreshHabitHero(){
  const p=Math.round(dayScore(cur)*100);
  $('#ring').style.setProperty('--p',p);$('#ringPct').textContent=p+'%';
  $('#heroMsg').textContent=p>=100?'Tuyệt vời! Bạn đã hoàn thành trọn vẹn ngày hôm nay 🎉':p>=70?'Sắp chạm đích rồi, cố thêm chút nữa!':p>0?'Khởi đầu tốt – tiếp tục từng bước nhỏ.':'Một ngày mới, một cơ hội mới. Bắt đầu nào!';
  $('#cats').innerHTML=Object.entries(CATS).map(([cid,c])=>{const l=S.config.habits.filter(h=>h.cat===cid);const v=l.length?Math.round(dayScore(cur,l)*100):0;
    return `<div class="catbar"><div class="row"><span>${c.ico} ${c.name}</span><span>${l.length?v+'%':'–'}</span></div><div class="bar"><i style="--c:#fff;width:${v}%"></i></div></div>`}).join('');
}
function habitForm(h){
  const isNew=!h;h=h||{name:'',cat:'than',target:1,unit:'lần'};
  openModal(`<h3>${isNew?'Thêm thói quen':'Sửa thói quen'}</h3>
   <div class="fld"><label class="lb" for="hName">Tên thói quen</label><input class="f" id="hName" value="${esc(h.name)}" placeholder="Ví dụ: Chạy bộ"></div>
   <div class="fld"><label class="lb">Hạng mục</label><div class="row" id="hCat">${Object.entries(CATS).map(([id,c])=>`<button type="button" class="btn" data-cat="${id}" style="${h.cat===id?`background:${c.c};color:#fff;border-color:transparent`:''}">${c.ico} ${c.name}</button>`).join('')}</div></div>
   <div class="row"><div class="fld" style="flex:1"><label class="lb" for="hTarget">Chỉ tiêu mỗi ngày</label><input class="f" id="hTarget" type="number" min="0.1" step="any" value="${h.target}"></div>
   <div class="fld" style="flex:1"><label class="lb" for="hUnit">Đơn vị</label><input class="f" id="hUnit" value="${esc(h.unit)}" placeholder="phút, trang, lần…"></div></div>
   <div class="row" style="margin-top:6px">${isNew?'':'<button class="btn ghost" id="hDel" style="color:var(--down)">Xoá</button>'}<span class="spacer"></span><button class="btn" data-close>Huỷ</button><button class="btn primary" id="hSave">${isNew?'Thêm thói quen':'Lưu thay đổi'}</button></div>`);
  let cat=h.cat;
  $('#hCat').onclick=e=>{const b=e.target.closest('[data-cat]');if(!b)return;cat=b.dataset.cat;$('#hCat').querySelectorAll('button').forEach(x=>{x.style.cssText=x.dataset.cat===cat?`background:${CATS[cat].c};color:#fff;border-color:transparent`:''})};
  $('#hSave').onclick=()=>{const name=$('#hName').value.trim(),target=parseFloat($('#hTarget').value);
    if(!name){$('#hName').focus();toast('Nhập tên thói quen');return}
    if(!(target>0)){$('#hTarget').focus();toast('Chỉ tiêu phải lớn hơn 0');return}
    const data={name,cat,target,unit:$('#hUnit').value.trim()||'lần'};
    if(isNew)S.config.habits.push({id:uid(),...data});else Object.assign(h,data);
    dirty('config');closeModal();render();toast(isNew?'Đã thêm thói quen':'Đã lưu thay đổi')};
  if(!isNew)$('#hDel').onclick=async()=>{if(!await ask(`Xoá thói quen “${h.name}”?`))return;S.config.habits=S.config.habits.filter(x=>x.id!==h.id);dirty('config');closeModal();render();toast('Đã xoá thói quen')};
  setTimeout(()=>$('#hName').focus(),50);
}

/* ---------- 2. Karma ---------- */
function kLog(k){const d=getDay(k);if(d.karmaLog)return d.karmaLog;const legacy=[];if(d.karma)KCOLS.forEach(c=>{const t=(d.karma[c.id]||'').trim();if(t)legacy.push({g:c.id,t})});return legacy}
const kPlan=k=>getDay(k).karmaPlan||[];
const filled=a=>a.filter(x=>(x.t||'').trim());
const seedsIn=(r,g)=>rangeDays(r).reduce((s,k)=>s+filled(kLog(k)).filter(x=>!g||x.g===g).length,0);
const plansIn=r=>rangeDays(r).flatMap(k=>filled(kPlan(k)));
const KARMA_METRICS=()=>[
  {label:'Tổng việc đã gieo',fmt:'n',c:'var(--g2)',val:r=>seedsIn(r)},
  ...KCOLS.map(c=>({label:`${c.ico} ${c.name}`,fmt:'n',c:c.c,val:r=>seedsIn(r,c.id)})),
  {label:'Việc trong kế hoạch',fmt:'n',c:'var(--g3)',val:r=>plansIn(r).length},
  {label:'Tỉ lệ thực hiện kế hoạch',fmt:'%',c:'var(--g1)',val:r=>{const p=plansIn(r);return p.length?p.filter(x=>x.done).length/p.length*100:0}}];
SUM.karma=()=>{
  const r=curRange();const days=rangeDays(r).filter(k=>filled(kLog(k)).length);
  return metricCards(KARMA_METRICS())+`<h4 style="margin:18px 0 8px">Chi tiết việc đã gieo trong kỳ</h4>`+(days.length?`<div class="mx-wrap"><table class="list"><thead><tr><th>Ngày</th>${KCOLS.map(c=>`<th style="background:${c.c}">${c.name}</th>`).join('')}</tr></thead><tbody>${days.reverse().map(k=>`<tr><td class="d" data-date="${k}">${fmtShort(k)}</td>${KCOLS.map(c=>`<td>${filled(kLog(k)).filter(x=>x.g===c.id).map(x=>'• '+esc(x.t)).join('\n')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'<div class="empty">Chưa có việc gieo hạt nào trong kỳ này.</div>');
};
function goalPin(){
  const G=S.config.karmaGoals;const g=G[G.length-1];
  if(!g)return `<div class="goal-pin"><div class="row"><div><h3>📌 Mục tiêu gieo hạt tuần</h3><div class="sub2">Thiết lập mục tiêu cho từng nhóm – mục tiêu sẽ được ghim tại đây cho đến khi bạn tạo mục tiêu mới.</div></div><span class="spacer"></span><button class="btn" id="goalNew">+ Thiết lập mục tiêu tuần</button></div></div>`;
  const wr={from:g.week,to:addDays(g.week,6)};
  return `<div class="goal-pin"><div class="row"><div><h3>📌 Mục tiêu tuần ${fmtShort(wr.from)} – ${fmtShort(wr.to)}</h3><div class="sub2">Đang ghim · đã gieo ${seedsIn(wr)} việc trong tuần này</div></div><span class="spacer"></span><button class="btn sm" id="goalEdit">Sửa</button><button class="btn sm" id="goalNew">+ Tạo mục tiêu mới</button></div>
   <div class="goal-grid">${KCOLS.map(c=>`<div class="goal-item" style="--c:${c.c}"><div class="gh"><i></i>${c.name}</div><p>${esc(g.goals[c.id]||'—')}</p><div class="cnt">Đã gieo: <b>${seedsIn(wr,c.id)}</b> việc</div></div>`).join('')}</div>
   ${G.length>1?`<details><summary>Mục tiêu các tuần trước (${G.length-1})</summary>${G.slice(0,-1).reverse().map(o=>`<div style="margin-top:8px;padding:8px 10px;background:rgba(255,255,255,.12);border-radius:10px"><b>Tuần ${fmtShort(o.week)} – ${fmtShort(addDays(o.week,6))}</b>${KCOLS.filter(c=>o.goals[c.id]).map(c=>`<div>• ${c.name}: ${esc(o.goals[c.id])}</div>`).join('')}</div>`).join('')}</details>`:''}</div>`;
}
function goalForm(edit){
  const G=S.config.karmaGoals;const g=edit?G[G.length-1]:{week:weekStart(cur),goals:{}};
  openModal(`<h3>${edit?'Sửa mục tiêu tuần':'Thiết lập mục tiêu tuần mới'}</h3>
   <div class="fld"><label class="lb" for="gWeek">Tuần bắt đầu từ (thứ hai)</label><input class="f" type="date" id="gWeek" value="${g.week}"></div>
   ${KCOLS.map(c=>`<div class="fld"><label class="lb" for="gg-${c.id}" style="color:${c.c}">${c.ico} ${c.name}</label><textarea class="f" id="gg-${c.id}" style="min-height:58px" placeholder="Mục tiêu gieo hạt tuần này…">${esc(g.goals[c.id]||'')}</textarea></div>`).join('')}
   <div class="row"><span class="spacer"></span><button class="btn" data-close>Huỷ</button><button class="btn primary" id="gSave">${edit?'Lưu thay đổi':'Ghim mục tiêu'}</button></div>`);
  $('#gSave').onclick=()=>{const goals=Object.fromEntries(KCOLS.map(c=>[c.id,$('#gg-'+c.id).value.trim()]));
    if(!Object.values(goals).some(Boolean)){toast('Nhập ít nhất một mục tiêu');return}
    const week=weekStart($('#gWeek').value||cur);
    if(edit)Object.assign(g,{week,goals});else G.push({id:uid(),week,created:TODAY(),goals});
    dirty('config');closeModal();render();toast(edit?'Đã lưu mục tiêu':'Đã ghim mục tiêu tuần mới')};
}
function kRow(kind,x){const c=KMAP[x.g]||KCOLS[0];
  return `<div class="krow ${kind==='plan'&&x.done?'done':''}" style="--c:${c.c}">
   ${kind==='plan'?`<input type="checkbox" data-f="done" ${x.done?'checked':''} aria-label="Đã làm" style="margin-left:8px">`:''}
   <select data-f="g" aria-label="Nhóm">${KCOLS.map(o=>`<option value="${o.id}" ${o.id===c.id?'selected':''}>${o.name}</option>`).join('')}</select>
   <input data-f="t" value="${esc(x.t||'')}" placeholder="${kind==='plan'?'Việc dự định gieo…':'Việc tốt đã gieo…'}">
   ${kind==='plan'?'<button class="btn sm" data-kgo title="Chuyển sang nhật ký gieo hạt">→ Gieo</button>':''}
   <button class="icon-btn" data-kdel title="Xoá dòng">✕</button></div>`}
VIEWS.karma=()=>{
  const plan=kPlan(cur),log=kLog(cur);
  $('#view').innerHTML=`<div class="grid">
   ${goalPin()}
   <div class="kpair">
     <div class="card"><h3>🗓️ Kế hoạch gieo hạt</h3><p class="sub">Những việc bạn dự định làm cho người khác ngày ${fmtShort(cur)}. Tick khi đã làm, hoặc bấm “→ Gieo” để ghi vào nhật ký.</p>
       <div class="krows" data-kind="plan">${plan.map(x=>kRow('plan',x)).join('')||''}</div>
       <div class="quick-add" data-add="plan">${KCOLS.map(c=>`<button data-g="${c.id}" style="--c:${c.c}">+ ${c.name}</button>`).join('')}</div></div>
     <div class="card"><h3>🌱 Nhật ký gieo hạt</h3><p class="sub">Mỗi dòng là một việc tốt bạn đã gieo trong ngày ${fmtShort(cur)}.</p>
       <div class="krows" data-kind="log">${log.map(x=>kRow('log',x)).join('')||''}</div>
       <div class="quick-add" data-add="log">${KCOLS.map(c=>`<button data-g="${c.id}" style="--c:${c.c}">+ ${c.name}</button>`).join('')}</div></div>
   </div>
   ${summaryCard('Tổng kết gieo hạt','Đếm số việc đã gieo cho từng nhóm trong kỳ',SUM.karma)}
  </div>`;
  const nb=$('#goalNew');if(nb)nb.onclick=()=>goalForm(false);const eb=$('#goalEdit');if(eb)eb.onclick=()=>goalForm(true);
  const save=kind=>{const rows=[...document.querySelectorAll(`.krows[data-kind="${kind}"] .krow`)].map(r=>{const o={g:r.querySelector('[data-f="g"]').value,t:r.querySelector('[data-f="t"]').value};if(kind==='plan')o.done=r.querySelector('[data-f="done"]').checked;return o});
    const d=editDay(cur);if(kind==='plan')d.karmaPlan=rows;else{d.karmaLog=rows;delete d.karma}
    clearTimeout(save._t);save._t=setTimeout(()=>{refreshSummary();const gp=document.querySelector('.goal-pin');if(gp&&S.config.karmaGoals.length){gp.outerHTML=goalPin();const a=$('#goalNew');if(a)a.onclick=()=>goalForm(false);const b=$('#goalEdit');if(b)b.onclick=()=>goalForm(true)}},500)};
  document.querySelectorAll('.krows').forEach(box=>{const kind=box.dataset.kind;
    box.addEventListener('input',()=>save(kind));
    box.addEventListener('change',e=>{const r=e.target.closest('.krow');if(e.target.matches('select'))r.style.setProperty('--c',KMAP[e.target.value].c);if(e.target.matches('[data-f="done"]'))r.classList.toggle('done',e.target.checked);save(kind)});
    box.addEventListener('click',e=>{const r=e.target.closest('.krow');if(!r)return;
      if(e.target.closest('[data-kdel]')){r.remove();save(kind)}
      if(e.target.closest('[data-kgo]')){const t=r.querySelector('[data-f="t"]').value.trim();if(!t){toast('Nhập nội dung trước khi gieo');return}
        const g=r.querySelector('[data-f="g"]').value;const lb=document.querySelector('.krows[data-kind="log"]');lb.insertAdjacentHTML('beforeend',kRow('log',{g,t}));
        r.querySelector('[data-f="done"]').checked=true;r.classList.add('done');save('plan');save('log');toast('Đã ghi vào nhật ký gieo hạt')}});
  });
  document.querySelectorAll('.quick-add').forEach(q=>q.addEventListener('click',e=>{const b=e.target.closest('[data-g]');if(!b)return;const kind=q.dataset.add;const box=document.querySelector(`.krows[data-kind="${kind}"]`);box.insertAdjacentHTML('beforeend',kRow(kind,{g:b.dataset.g,t:''}));box.lastElementChild.querySelector('[data-f="t"]').focus()}));
};

/* ---------- 3. Gratitude ---------- */
const gItems=k=>(getDay(k).grat?.items||[]).filter(x=>(x||'').trim());
const gCount=k=>gItems(k).length;
const gSub=k=>{const g=getDay(k).grat;if(!g)return false;return g.submitted===true||(g.submitted===undefined&&gCount(k)>=10)};
function gratStreaks(){
  const all=allDays();const done=Object.keys(all).filter(gSub).sort();const set=new Set(done);const t=TODAY();
  let streak=0,k=set.has(t)?t:addDays(t,-1);while(set.has(k)){streak++;k=addDays(k,-1)}
  let best=0,run=0,prev=null;for(const d of done){run=(prev&&addDays(prev,1)===d)?run+1:1;best=Math.max(best,run);prev=d}
  return{streak,best,total:done.length};
}
const GRAT_METRICS=()=>{const s=gratStreaks();return[
  {label:'Ngày đã biết ơn',fmt:'n',c:'var(--g2)',val:r=>rangeDays(r).filter(gSub).length},
  {label:'Tỉ lệ hoàn thành',fmt:'%',c:'var(--g3)',val:r=>{const d=countDays(r);return d.length?d.filter(gSub).length/d.length*100:0}},
  {label:'Tổng điều biết ơn',fmt:'n',c:'#65A30D',val:r=>rangeDays(r).filter(gSub).reduce((a,k)=>a+gCount(k),0)},
  {label:'Chuỗi ngày liên tiếp 🔥',fmt:'n',c:'#F97316',val:()=>s.streak,noCmp:true,note:`Dài nhất: ${s.best} ngày`},
  {label:'Tổng số ngày từ trước tới nay',fmt:'n',c:'var(--g1)',val:()=>s.total,noCmp:true}]};
SUM.gratitude=()=>{
  const r=curRange();const ds=rangeDays(r).filter(gSub).reverse();const topics=ds.map(k=>getDay(k).grat.topic).filter(x=>(x||'').trim());
  return metricCards(GRAT_METRICS())+`<h4 style="margin:20px 0 8px">🌿 Tổng kết nội dung biết ơn</h4>`+(ds.length?
   `${topics.length?`<div class="topics">${topics.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}
   ${ds.map((k,i)=>`<details class="gday" ${i<2?'open':''}><summary>${fmtLong(k)}${getDay(k).grat.topic?` <span class="chip" style="--c:var(--g3)">${esc(getDay(k).grat.topic)}</span>`:''}</summary><ol>${gItems(k).map(x=>`<li>${esc(x)}</li>`).join('')}</ol></details>`).join('')}`
   :'<div class="empty">Chưa có ngày biết ơn nào được gửi trong kỳ này.</div>');
};
VIEWS.gratitude=()=>{
  const g=getDay(cur).grat||{};const items=g.items||[];
  $('#view').innerHTML=`<div class="grid">
   <div class="grat-hero"><div class="row"><div style="flex:1;min-width:220px"><label class="lb" for="gTopic">Chủ đề của ngày (không bắt buộc)</label><input class="f" id="gTopic" value="${esc(g.topic||'')}" placeholder="Ví dụ: Biết ơn cơ thể của mình"></div>
     <div style="text-align:right"><div style="font-size:13px;font-weight:600">Đã ghi</div><div style="font-size:30px;font-weight:800" id="gCounter">0/10</div></div></div></div>
   <div class="card"><h3>10 điều biết ơn ngày ${fmtShort(cur)}</h3><p class="sub">Điền đủ 10 điều rồi bấm “Biết ơn” để ghi nhận ngày hoàn thành</p>
     <div class="grat-list" id="glist">${Array.from({length:10},(_,i)=>`<div class="gitem ${(items[i]||'').trim()?'ok':''}"><span class="n">${i+1}</span><input data-g="${i}" value="${esc(items[i]||'')}" placeholder="Tôi biết ơn…" aria-label="Điều biết ơn ${i+1}"></div>`).join('')}</div>
     <div class="submit-zone"><button class="thank-btn" id="thankBtn">🙏 Biết ơn</button><span class="ai-note" id="thankNote"></span></div></div>
   ${summaryCard('Tổng kết biết ơn','Số ngày hoàn thành, tỉ lệ và nội dung đã ghi nhận trong kỳ',SUM.gratitude)}
   <div class="card"><h3>Lịch biết ơn</h3><p class="sub">Xanh đậm: đã bấm Biết ơn · Xanh nhạt: đang điền dở</p><div id="gcal"></div></div>
  </div>`;
  refreshGrat();
  $('#gTopic').oninput=e=>{const d=editDay(cur);d.grat??={items:[]};d.grat.topic=e.target.value};
  $('#glist').addEventListener('input',e=>{const t=e.target.closest('[data-g]');if(!t)return;const d=editDay(cur);d.grat??={items:[]};d.grat.items??=[];d.grat.items[+t.dataset.g]=t.value;
    t.parentElement.classList.toggle('ok',!!t.value.trim());if(gCount(cur)<10&&d.grat.submitted){d.grat.submitted=false}if(d.grat.submitted===undefined)d.grat.submitted=gCount(cur)>=10;refreshGrat()});
  $('#thankBtn').onclick=()=>{if(gCount(cur)<10)return;const d=editDay(cur);d.grat.submitted=true;d.grat.at=new Date().toISOString();flush();refreshGrat();refreshSummary();toast('🙏 Cảm ơn bạn! Đã ghi nhận 10 điều biết ơn')};
};
function refreshGrat(){
  const c=gCount(cur),sub=gSub(cur);$('#gCounter').textContent=c+'/10';
  const b=$('#thankBtn');b.disabled=c<10&&!sub;b.classList.toggle('sent',sub);b.textContent=sub?'✓ Đã biết ơn':'🙏 Biết ơn';
  $('#thankNote').textContent=sub?'Ngày này đã được tính là hoàn thành. Bạn vẫn có thể chỉnh sửa nội dung.':c<10?`Còn ${10-c} điều nữa để gửi lời biết ơn.`:'Đã đủ 10 điều – bấm “Biết ơn” để ghi nhận.';
  $('#gcal').innerHTML=calendar(k=>{const n=gCount(k);if(!n)return{};const s=gSub(k),t=getDay(k).grat?.topic;
    return{style:`background:${s?'var(--grad);color:#fff':'color-mix(in srgb,var(--g4) 28%,var(--surface-2))'}`,html:`<span class="cal-big">${s?'🙏':n+'/10'}</span>${t?`<span class="snip" style="${s?'color:#fff':''}">${esc(t)}</span>`:''}`,title:t||''}});
}

/* ---------- 4. Order vũ trụ ---------- */
const OCOLS=[{id:'task',name:'Công việc ngày',c:'#16A34A'},{id:'goal',name:'Kết quả mong muốn',c:'#0EA5E9'},{id:'res',name:'Nguồn lực liên quan',c:'#F59E0B'},{id:'real',name:'Thực tế',c:'#7C3AED'}];
const orderRows=k=>(getDay(k).order||[]).filter(r=>OCOLS.some(c=>(r[c.id]||'').trim()));
const ordersIn=r=>rangeDays(r).flatMap(orderRows);
const ORDER_METRICS=()=>[
  {label:'Ngày có order',fmt:'n',c:'var(--g2)',val:r=>rangeDays(r).filter(k=>orderRows(k).length).length},
  {label:'Số đơn đã đặt',fmt:'n',c:'#0EA5E9',val:r=>ordersIn(r).length},
  {label:'Đơn đã ghi thực tế',fmt:'n',c:'#7C3AED',val:r=>ordersIn(r).filter(x=>(x.real||'').trim()).length},
  {label:'Tỉ lệ ghi nhận thực tế',fmt:'%',c:'var(--g3)',val:r=>{const o=ordersIn(r);return o.length?o.filter(x=>(x.real||'').trim()).length/o.length*100:0}}];
SUM.order=()=>metricCards(ORDER_METRICS());
VIEWS.order=()=>{
  let rows=getDay(cur).order;if(!rows||!rows.length)rows=[{},{},{}];
  const tr=r=>`<tr>${OCOLS.map(c=>`<td class="${c.id}"><textarea class="f" data-o="${c.id}" placeholder="${c.name}…">${esc(r[c.id]||'')}</textarea></td>`).join('')}<td><button class="icon-btn" data-odel title="Xoá dòng">✕</button></td></tr>`;
  $('#view').innerHTML=`<div class="grid">
   <div class="cosmos"><h3>Đơn đặt hàng gửi vũ trụ · ${fmtLong(cur)}</h3><p>Viết rõ điều bạn muốn, chuẩn bị nguồn lực, rồi cuối ngày ghi lại thực tế đã nhận.</p></div>
   <div class="card"><div class="row"><h3>Bảng order</h3><span class="spacer"></span><button class="btn primary" id="oAdd">+ Thêm công việc</button></div>
     <div class="mx-wrap"><table class="order"><thead><tr>${OCOLS.map(c=>`<th><span style="--c:${c.c}"></span>${c.name}</th>`).join('')}<th></th></tr></thead><tbody id="obody">${rows.map(tr).join('')}</tbody></table></div></div>
   ${summaryCard('Tổng kết order vũ trụ','',SUM.order)}
   <div class="card"><h3>Lịch order</h3><p class="sub">Số đơn đã đặt mỗi ngày · ✓ là đã ghi thực tế</p><div id="ocal"></div></div>
  </div>`;
  const persist=()=>{const d=editDay(cur);d.order=[...document.querySelectorAll('#obody tr')].map(r=>Object.fromEntries(OCOLS.map(c=>[c.id,r.querySelector(`[data-o="${c.id}"]`).value])));
    clearTimeout(persist._t);persist._t=setTimeout(()=>{refreshOrder();refreshSummary()},500)};
  $('#obody').addEventListener('input',persist);
  $('#obody').addEventListener('click',e=>{if(e.target.closest('[data-odel]')){e.target.closest('tr').remove();persist()}});
  $('#oAdd').onclick=()=>{const tb=$('#obody');tb.insertAdjacentHTML('beforeend',tr({}));tb.lastElementChild.querySelector('textarea').focus()};
  refreshOrder();
};
function refreshOrder(){
  $('#ocal').innerHTML=calendar(k=>{const r=orderRows(k);if(!r.length)return{};const real=r.filter(x=>(x.real||'').trim()).length;
    return{style:'background:color-mix(in srgb,var(--g3) 16%,var(--surface-2))',html:`<span class="cal-big">${r.length} ✨</span><span class="snip">${real?`✓ ${real} thực tế`:esc(r[0].task||r[0].goal)}</span>`,title:r.map(x=>'• '+(x.task||x.goal)).join('\n')}});
}

/* ---------- 5. Journal ---------- */
const JF=[{id:'good',name:'Hôm nay làm tốt',ico:'🌟',c:'#F59E0B',ph:'Những điều mình đã làm tốt…'},{id:'notyet',name:'Chưa làm được',ico:'🌱',c:'#EF4444',ph:'Điều gì còn dang dở, vì sao…'},{id:'learn',name:'Bài học hôm nay',ico:'💡',c:'#16A34A',ph:'Mình học được gì…'}];
const jHas=k=>{const j=getDay(k).journal;return !!j&&(JF.some(f=>(j[f.id]||'').trim())||j.mood!=null)};
const JOURNAL_METRICS=()=>[
  {label:'Ngày đã viết nhật ký',fmt:'n',c:'var(--g2)',val:r=>rangeDays(r).filter(jHas).length},
  {label:'Tỉ lệ viết nhật ký',fmt:'%',c:'var(--g3)',val:r=>{const d=countDays(r);return d.length?d.filter(jHas).length/d.length*100:0}},
  {label:'Cảm xúc trung bình (1–5)',fmt:'d1',c:'#F59E0B',val:r=>avg(rangeDays(r).map(k=>getDay(k).journal?.mood).filter(m=>m!=null).map(m=>m+1))},
  {label:'Bài học ghi lại',fmt:'n',c:'#0EA5E9',val:r=>rangeDays(r).filter(k=>(getDay(k).journal?.learn||'').trim()).length}];
SUM.journal=()=>metricCards(JOURNAL_METRICS());
VIEWS.journal=()=>{
  const j=getDay(cur).journal||{};const r=curRange();const ak=r.from+'_'+r.to;
  $('#view').innerHTML=`<div class="grid">
   <div class="card"><div class="row"><div><h3>Hôm nay bạn cảm thấy thế nào?</h3><p class="sub" style="margin:0">Chọn cảm xúc chung của ngày ${fmtShort(cur)}</p></div><span class="spacer"></span><div class="moods" id="moods">${MOODS.map((m,i)=>`<button data-m="${i}" aria-pressed="${j.mood===i}" aria-label="Cảm xúc ${i+1}">${m}</button>`).join('')}</div></div></div>
   <div class="jgrid" id="jgrid">${JF.map(f=>`<div class="jcard" style="--c:${f.c}"><h4>${f.ico} ${f.name}</h4><textarea class="f" data-j="${f.id}" placeholder="${f.ph}">${esc(j[f.id]||'')}</textarea></div>`).join('')}</div>
   <div class="ai-card"><div class="row"><div><h3 style="margin:0">🤖 AI tổng hợp & định hướng</h3><p class="ai-note" style="margin:2px 0 0">AI đọc nhật ký trong kỳ đang chọn bên dưới để đưa ra nhận định và gợi ý hướng đi</p></div></div>
     <div style="margin-top:12px">${periodBar()}</div>
     <div class="row"><button class="btn primary" id="aiBtn">✨ Phân tích nhật ký kỳ ${rangeLabel(r)}</button><button class="btn" id="aiStop" style="display:none">Dừng</button><span class="ai-note" id="aiNote"></span></div>
     <div class="ai-out" id="aiOut">${AIRES[ak]?md(AIRES[ak]):''}</div></div>
   <div class="card" id="summary"><div class="sec-title"><h3>📈 Tổng kết nhật ký</h3></div><p class="sub">Theo kỳ đang chọn ở phần AI phía trên</p><div id="sumBody">${SUM.journal()}</div></div>
   <div class="two"><div class="card"><h3>Lịch nhật ký</h3><p class="sub">Biểu tượng cảm xúc của từng ngày</p><div id="jcal"></div></div>
     <div class="card"><h3>Những trang gần đây</h3><div id="jrecent"></div></div></div>
  </div>`;
  $('#jgrid').addEventListener('input',e=>{const t=e.target.closest('[data-j]');if(!t)return;const d=editDay(cur);d.journal??={};d.journal[t.dataset.j]=t.value;clearTimeout(refreshJournal._t);refreshJournal._t=setTimeout(()=>{refreshJournal();refreshSummary()},600)});
  $('#moods').onclick=e=>{const b=e.target.closest('[data-m]');if(!b)return;const d=editDay(cur);d.journal??={};const m=+b.dataset.m;d.journal.mood=d.journal.mood===m?null:m;
    $('#moods').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',+x.dataset.m===d.journal.mood));refreshJournal();refreshSummary()};
  window.AI_HOOK=()=>setupAI(r,ak,journalPrompt,false);AI_HOOK();refreshJournal();
};
function refreshJournal(){
  $('#jcal').innerHTML=calendar(k=>{if(!jHas(k))return{};const j=getDay(k).journal;
    return{style:'background:color-mix(in srgb,var(--g3) 12%,var(--surface-2))',html:`<span class="cal-big">${j.mood!=null?MOODS[j.mood]:'📝'}</span><span class="snip">${esc(j.good||j.learn||'')}</span>`}});
  const all=allDays();const ks=Object.keys(all).filter(jHas).sort().reverse().slice(0,6);
  $('#jrecent').innerHTML=ks.length?ks.map(k=>{const j=all[k].journal;return `<div data-date="${k}" style="cursor:pointer;padding:12px 0;border-bottom:1px solid var(--line)"><b>${j.mood!=null?MOODS[j.mood]+' ':''}${fmtLong(k)}</b>
    ${JF.map(f=>(j[f.id]||'').trim()?`<div style="font-size:13.5px;margin-top:4px"><span style="color:${f.c};font-weight:700">${f.ico} ${f.name}:</span> ${esc(j[f.id].slice(0,140))}${j[f.id].length>140?'…':''}</div>`:'').join('')}</div>`}).join(''):'<div class="empty">Chưa có trang nhật ký nào. Viết vài dòng cho hôm nay nhé.</div>';
}
function md(s){
  const lines=esc(s).split('\n');let out='',inList=false;
  const inline=t=>t.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
  for(let l of lines){const t=l.trim();
    const li=t.match(/^([-*•]|\d+[.)])\s+(.*)/);
    if(li){if(!inList){out+='<ul>';inList=true}out+=`<li>${inline(li[2])}</li>`;continue}
    if(inList){out+='</ul>';inList=false}
    if(/^#{1,4}\s/.test(t))out+=`<h4>${inline(t.replace(/^#+\s*/,''))}</h4>`;else if(t)out+=`<p>${inline(t)}</p>`;
  }
  return out+(inList?'</ul>':'');
}
const AI_RUNNING=new Set();
function journalPrompt(r){
  const ds=rangeDays(r).filter(jHas);if(!ds.length)return null;
  const entries=ds.map(k=>{const j=getDay(k).journal;return `### ${fmtLong(k)}${j.mood!=null?` (cảm xúc ${j.mood+1}/5)`:''}\n- Làm tốt: ${j.good||'(trống)'}\n- Chưa làm được: ${j.notyet||'(trống)'}\n- Bài học: ${j.learn||'(trống)'}`}).join('\n\n');
  const hd=countDays(r);const ctx=`Bối cảnh thêm trong kỳ: thói quen hoàn thành trung bình ${Math.round(avg(hd.map(k=>dayScore(k)))*100)}%/ngày; số ngày biết ơn: ${rangeDays(r).filter(gSub).length}; số việc tốt đã gieo cho người khác: ${seedsIn(r)}.`;
  return `Bạn là huấn luyện viên phát triển bản thân, nói chuyện ấm áp, thẳng thắn và thực tế. Hãy đọc nhật ký ngày của tôi trong kỳ ${rangeLabel(r)} (${ds.length} ngày có ghi chép) và trả lời hoàn toàn bằng tiếng Việt, ngắn gọn, theo đúng cấu trúc markdown sau:

## Nhận định tổng quan
(2–3 câu về xu hướng chung, năng lượng và cảm xúc)
## Điểm mạnh đang phát huy
(3–4 gạch đầu dòng)
## Điều cần cải thiện
(2–4 gạch đầu dòng, chỉ ra khuôn mẫu lặp lại nếu có)
## Bài học nổi bật
(2–3 gạch đầu dòng)
## Định hướng gợi ý cho giai đoạn tới
(3–5 hành động cụ thể, đo được)

Chỉ dựa trên dữ liệu bên dưới, không bịa thêm sự kiện. ${ctx}

NHẬT KÝ:
${entries}`;
}
const cut=(s,n=220)=>{s=String(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n)+'…':s};
function reportPrompt(r){
  const ds=rangeDays(r),cd=countDays(r),H=S.config.habits;
  const hasData=ds.some(k=>{const d=getDay(k);return (d.habits&&Object.keys(d.habits).length)||filled(kLog(k)).length||gCount(k)||orderRows(k).length||jHas(k)||filled(kPlan(k)).length});
  if(!hasData)return null;
  const lines=[];
  lines.push(`# THÓI QUEN (Thân – Tâm – Tuệ)\nHoàn thành trung bình: ${Math.round(avg(cd.map(k=>dayScore(k)))*100)}%/ngày; ngày đạt 100%: ${cd.filter(k=>H.length&&dayScore(k)>=1).length}/${cd.length}.`);
  H.forEach(h=>lines.push(`- [${CATS[h.cat].name}] ${h.name}: đạt chỉ tiêu ${cd.filter(k=>hv(k,h)>=h.target).length}/${cd.length} ngày, tổng ${cd.reduce((s,k)=>s+hv(k,h),0)} ${h.unit} (chỉ tiêu ${h.target}/ngày)`));
  const g=S.config.karmaGoals.at(-1);const plans=plansIn(r);
  lines.push(`\n# QUẢN LÝ NGHIỆP\nTổng việc đã gieo: ${seedsIn(r)}. Theo nhóm: ${KCOLS.map(c=>`${c.name} ${seedsIn(r,c.id)}`).join(', ')}. Kế hoạch: ${plans.length} việc, đã làm ${plans.filter(x=>x.done).length}.`);
  if(g)lines.push('Mục tiêu tuần đang ghim: '+KCOLS.filter(c=>g.goals[c.id]).map(c=>`${c.name}: ${cut(g.goals[c.id],120)}`).join('; '));
  const seeds=ds.flatMap(k=>filled(kLog(k)).map(x=>`- ${fmtShort(k)} [${KMAP[x.g]?.name}] ${cut(x.t,140)}`)).slice(-40);
  if(seeds.length)lines.push('Một số việc đã gieo:\n'+seeds.join('\n'));
  const gd=ds.filter(gSub);
  lines.push(`\n# NHẬT KÝ BIẾT ƠN\nSố ngày đã bấm Biết ơn: ${gd.length}/${cd.length}. Chủ đề: ${gd.map(k=>getDay(k).grat.topic).filter(Boolean).map(t=>cut(t,60)).join('; ')||'(không có)'}.`);
  const gi=ds.flatMap(k=>gItems(k).map(x=>'- '+cut(x,100))).slice(-35);if(gi.length)lines.push('Một số điều biết ơn:\n'+gi.join('\n'));
  const od=ds.flatMap(k=>orderRows(k).map(o=>`- ${fmtShort(k)}: việc "${cut(o.task,100)}" → mong muốn "${cut(o.goal,100)}" → nguồn lực "${cut(o.res,80)}" → thực tế "${cut(o.real,120)||'(chưa ghi)'}"`)).slice(-30);
  lines.push(`\n# ORDER VŨ TRỤ\nSố đơn: ${ordersIn(r).length}, đã ghi thực tế: ${ordersIn(r).filter(x=>(x.real||'').trim()).length}.`+(od.length?'\n'+od.join('\n'):''));
  const jd=ds.filter(jHas);
  lines.push(`\n# NHẬT KÝ NGÀY\nSố ngày viết: ${jd.length}.`+(jd.length?'\n'+jd.slice(-31).map(k=>{const j=getDay(k).journal;return `- ${fmtShort(k)}${j.mood!=null?` (cảm xúc ${j.mood+1}/5)`:''}: làm tốt "${cut(j.good)}"; chưa làm được "${cut(j.notyet)}"; bài học "${cut(j.learn)}"`}).join('\n'):''));
  if(P.cmp){const c=cmpRange(r),cc=countDays(c);lines.push(`\n# KỲ SO SÁNH (${rangeLabel(c)})\nThói quen TB ${Math.round(avg(cc.map(k=>dayScore(k)))*100)}%/ngày; việc đã gieo ${seedsIn(c)}; ngày biết ơn ${rangeDays(c).filter(gSub).length}; đơn order ${ordersIn(c).length}; ngày viết nhật ký ${rangeDays(c).filter(jHas).length}.`)}
  return `Bạn là huấn luyện viên phát triển bản thân, phân tích sắc sảo, ấm áp và thực tế. Dưới đây là toàn bộ dữ liệu tự quản lý của tôi trong kỳ ${rangeLabel(r)} gồm: thói quen, quản lý nghiệp (gieo hạt cho khách hàng, đối tác, đồng nghiệp, thế giới, gia đình/bạn bè), nhật ký biết ơn, order vũ trụ và nhật ký ngày. Hãy tổng hợp và phân tích vấn đề chung của cả kỳ, trả lời hoàn toàn bằng tiếng Việt, súc tích, theo đúng cấu trúc markdown:

## Tổng quan kỳ báo cáo
(3–4 câu: bức tranh chung, mức độ kỷ luật, năng lượng${P.cmp?', so sánh với kỳ trước':''})
## Điểm sáng
(3–4 gạch đầu dòng, có số liệu)
## Vấn đề chung cần lưu ý
(3–5 gạch đầu dòng: khuôn mẫu lặp lại, hạng mục bị bỏ quên, khoảng cách giữa kế hoạch/mong muốn và thực tế)
## Mối liên hệ giữa các hạng mục
(2–3 gạch đầu dòng, ví dụ thói quen ảnh hưởng tới cảm xúc, gieo hạt ảnh hưởng tới kết quả order)
## Định hướng & hành động cho kỳ tới
(4–6 hành động cụ thể, đo được, gắn với từng hạng mục)

Chỉ dựa trên dữ liệu bên dưới, không bịa thêm sự kiện; nếu dữ liệu mỏng hãy nói rõ.

${lines.join('\n')}`;
}
function setupAI(r,ak,build,auto){
  const btn=$('#aiBtn'),note=$('#aiNote'),out=$('#aiOut'),stop=$('#aiStop');if(!btn)return;
  if(!sampleReady)note.textContent='Đang kết nối AI…';
  else if(!SAMPLE){btn.disabled=true;note.textContent='AI chỉ hoạt động khi mở trang trong Claude và đã đăng nhập.'}
  else if(note.textContent==='Đang kết nối AI…')note.textContent='';
  let ctl;
  stop.onclick=()=>ctl?.abort();
  btn.onclick=async()=>{
    if(!SAMPLE){toast('AI chưa sẵn sàng');return}
    const prompt=build(r);
    if(!prompt){toast('Chưa có dữ liệu trong kỳ này');note.textContent='Chưa có dữ liệu trong kỳ này để AI phân tích.';return}
    if(AI_RUNNING.has(ak))return;AI_RUNNING.add(ak);
    btn.disabled=true;stop.style.display='';note.textContent='AI đang đọc dữ liệu…';out.innerHTML='';ctl=new AbortController();
    try{
      const {text,truncated}=await SAMPLE(prompt,{signal:ctl.signal,onText:({text})=>{if($('#aiOut')===out){out.innerHTML=md(text);note.textContent='AI đang viết…'}}});
      AIRES[ak]=text;if($('#aiOut')===out){out.innerHTML=md(text);note.textContent=truncated?'Phân tích bị cắt ngắn – hãy thử kỳ ngắn hơn.':`Phân tích lúc ${new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}`}
    }catch(e){
      if(e?.text)out.innerHTML=md(e.text);
      note.textContent=e?.code==='cancelled'?'Đã dừng.':e?.code==='not_granted'?'Bạn chưa cho phép trang dùng AI.':e?.code==='rate_limited'?'AI đang bận, hãy thử lại sau ít phút.':'Không phân tích được lúc này, hãy thử lại.';
    }finally{AI_RUNNING.delete(ak);btn.disabled=false;stop.style.display='none'}
  };
  if(auto&&SAMPLE&&!AIRES[ak]&&!AI_RUNNING.has(ak)&&build(r))btn.click();
}

/* ---------- 6. Quotes ---------- */
VIEWS.quotes=()=>{
  const Q=S.config.quotes;
  $('#view').innerHTML=`<div class="grid">
   <div class="card"><div class="row"><div><h3>Banner động lực</h3><p class="sub" style="margin:0">Banner đang bật sẽ hiện ngẫu nhiên dạng popup mỗi khi bạn mở trang</p></div><span class="spacer"></span>
     <label class="switch"><input type="checkbox" id="popToggle" ${S.config.popup?'checked':''}> Hiện popup khi mở trang</label>
     <button class="btn" id="qPreview">Xem thử popup</button><button class="btn primary" id="qAdd">+ Thêm banner</button></div></div>
   <div class="qgrid" id="qgrid">${Q.length?Q.map(q=>`<div class="banner ${q.active?'':'off'}" style="--g:${THEMES[q.theme]||THEMES.anvi}" data-q="${q.id}"><span class="kind">${esc(q.kind)}</span><q>${esc(q.text)}</q><div class="au">— ${esc(q.author||'Không rõ')}</div>
     <div class="acts"><button data-act="toggle">${q.active?'Đang bật':'Đang tắt'}</button><button data-act="show">Hiện</button><span class="spacer"></span><button data-act="edit" aria-label="Sửa">✎</button><button data-act="del" aria-label="Xoá">✕</button></div></div>`).join(''):'<div class="empty">Chưa có banner nào. Thêm châm ngôn hoặc nguyên tắc sống của riêng bạn.</div>'}</div>
  </div>`;
  $('#popToggle').onchange=e=>{S.config.popup=e.target.checked;dirty('config');toast(e.target.checked?'Đã bật popup khi mở trang':'Đã tắt popup')};
  $('#qPreview').onclick=()=>Q.some(q=>q.active)?showPopup():toast('Bật ít nhất một banner để xem thử');
  $('#qAdd').onclick=()=>quoteForm();
  $('#qgrid').onclick=e=>{const b=e.target.closest('[data-act]');if(!b)return;const q=Q.find(x=>x.id===b.closest('[data-q]').dataset.q);
    if(b.dataset.act==='toggle'){q.active=!q.active;dirty('config');render()}
    if(b.dataset.act==='show')showPopup(q);
    if(b.dataset.act==='edit')quoteForm(q);
    if(b.dataset.act==='del')ask('Xoá banner này?').then(ok=>{if(!ok)return;S.config.quotes=S.config.quotes.filter(x=>x!==q);dirty('config');render();toast('Đã xoá banner')})};
};
function quoteForm(q){
  const isNew=!q;q=q||{text:'',author:'',kind:'Châm ngôn',theme:'anvi',active:true};let theme=q.theme;
  openModal(`<h3>${isNew?'Thêm banner':'Sửa banner'}</h3>
   <div class="fld"><label class="lb" for="qText">Nội dung</label><textarea class="f" id="qText" placeholder="Câu châm ngôn hoặc nguyên tắc sống…">${esc(q.text)}</textarea></div>
   <div class="row"><div class="fld" style="flex:1"><label class="lb" for="qAuthor">Tác giả / nguồn</label><input class="f" id="qAuthor" value="${esc(q.author)}" placeholder="Không bắt buộc"></div>
   <div class="fld" style="flex:1"><label class="lb" for="qKind">Loại</label><select class="f" id="qKind">${['Châm ngôn','Nguyên tắc sống','Mục tiêu','Lời nhắc'].map(k=>`<option ${k===q.kind?'selected':''}>${k}</option>`).join('')}</select></div></div>
   <div class="fld"><label class="lb">Màu nền</label><div class="swatches" id="qTheme">${Object.entries(THEMES).map(([k,g])=>`<button type="button" data-t="${k}" style="--g:${g}" aria-pressed="${k===theme}" aria-label="${k}"></button>`).join('')}</div></div>
   <div class="row" style="margin-top:8px"><span class="spacer"></span><button class="btn" data-close>Huỷ</button><button class="btn primary" id="qSave">${isNew?'Thêm banner':'Lưu thay đổi'}</button></div>`);
  $('#qTheme').onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;theme=b.dataset.t;$('#qTheme').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.t===theme))};
  $('#qSave').onclick=()=>{const text=$('#qText').value.trim();if(!text){$('#qText').focus();toast('Nhập nội dung banner');return}
    const data={text,author:$('#qAuthor').value.trim(),kind:$('#qKind').value,theme};
    if(isNew)S.config.quotes.unshift({id:uid(),active:true,...data});else Object.assign(q,data);
    dirty('config');closeModal();render();toast(isNew?'Đã thêm banner':'Đã lưu thay đổi')};
  setTimeout(()=>$('#qText').focus(),50);
}

/* ---------- 7. Videos ---------- */
const VCATS={than:{name:'Thân',c:'var(--than)',ico:'💪'},tam:{name:'Tâm',c:'var(--tam)',ico:'❤️'},tue:{name:'Tuệ',c:'var(--tue)',ico:'🧠'}};
const vCat=v=>v.cat==='tri'?'tue':(VCATS[v.cat]?v.cat:'than');
let vFilter='all';
function ytId(u){u=(u||'').trim();if(/^[\w-]{11}$/.test(u))return u;
  try{const x=new URL(u.startsWith('http')?u:'https://'+u);const host=x.hostname.replace(/^www\.|^m\./,'');
    if(host==='youtu.be')return x.pathname.slice(1,12)||null;
    if(host.endsWith('youtube.com')||host==='youtube-nocookie.com'){if(x.searchParams.get('v'))return x.searchParams.get('v').slice(0,11);const m=x.pathname.match(/\/(shorts|embed|live|v)\/([\w-]{11})/);if(m)return m[2]}
  }catch(e){}return null}
const ytUrl=(id,orig)=>/\/shorts\//.test(orig||'')?`https://www.youtube.com/shorts/${id}`:`https://www.youtube.com/watch?v=${id}`;
/* Tách link + tiêu đề khi dán cả đoạn chia sẻ (vd: "Tên video – YouTube https://youtu.be/…") */
function splitPaste(text){const m=(text||'').match(/https?:\/\/\S+|(?:www\.|m\.)?(?:youtube\.com|youtu\.be)\/\S+/i);if(!m)return{url:text.trim(),title:''};
  const title=(text.slice(0,m.index)+' '+text.slice(m.index+m[0].length)).replace(/\s*[-–|]\s*YouTube\s*$/i,'').replace(/\s+/g,' ').trim();return{url:m[0],title}}
async function ytTitle(url){
  const tries=[`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,`https://noembed.com/embed?url=${encodeURIComponent(url)}`];
  for(const t of tries){try{const ctl=new AbortController();const tm=setTimeout(()=>ctl.abort(),4000);const r=await fetch(t,{signal:ctl.signal});clearTimeout(tm);if(!r.ok)continue;const j=await r.json();if(j&&j.title)return j.title}catch(e){}}
  return null;
}
function vItem(v){const c=VCATS[vCat(v)];
  return `<div class="vitem" style="--c:${c.c}" data-v="${v.id}"><div class="vrow">
    <div class="vplay"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></div>
    <div class="vt"><b title="${esc(v.title)}">${esc(v.title)}</b><span>${c.name} · thêm ngày ${fmtShortY(v.added||TODAY())}</span></div>
    <a class="watch" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">Xem</a>
    <button type="button" class="icon-btn" data-vedit title="Sửa tiêu đề / nhóm" aria-label="Sửa video">✎</button>
    <button type="button" class="icon-btn" data-vdel title="Xoá video" aria-label="Xoá video">✕</button></div>
   <div class="vsum"><label for="vs-${v.id}">✍️ Tóm tắt video <em data-saved></em></label><textarea class="f" id="vs-${v.id}" data-vsum placeholder="Viết tóm tắt, ý chính, bài học rút ra từ video…">${esc(v.summary||'')}</textarea></div></div>`}
VIEWS.videos=()=>{
  const V=S.config.videos;V.forEach(v=>{if(v.cat==='tri'){v.cat='tue';dirty('config')}});
  const cnt=k=>V.filter(v=>k==='all'||vCat(v)===k).length;
  const groups=Object.entries(VCATS).filter(([k])=>vFilter==='all'||vFilter===k);
  $('#view').innerHTML=`<div class="grid">
   <div class="card"><h3>Thêm video YouTube</h3><p class="sub">Dán link (hoặc cả đoạn chia sẻ gồm tiêu đề + link), chọn nhóm rồi bấm “Thêm vào kho”.</p>
     <div class="vadd">
       <div><label class="lb" for="vUrl">Link YouTube</label><input class="f" id="vUrl" placeholder="https://www.youtube.com/watch?v=…" inputmode="url"></div>
       <div><label class="lb" for="vTitle">Tiêu đề video</label><input class="f" id="vTitle" placeholder="Tự điền nếu lấy được, hoặc nhập tay"></div>
       <div><label class="lb" for="vCat">Nhóm</label><select class="f" id="vCat">${Object.entries(VCATS).map(([k,c])=>`<option value="${k}" ${vFilter===k?'selected':''}>${c.ico} ${c.name}</option>`).join('')}</select></div>
       <div class="full"><label class="lb" for="vSum">Viết tóm tắt video (không bắt buộc)</label><textarea class="f" id="vSum" placeholder="Ý chính, bài học rút ra…"></textarea></div>
       <div class="full row"><button class="btn primary" id="vAdd">+ Thêm vào kho</button><div class="vnote" id="vNote" style="margin:0"></div></div>
     </div></div>
   <div class="vtabs" role="group" aria-label="Lọc theo nhóm">
     <button class="vtab" data-vf="all" style="--c:var(--g2)" aria-pressed="${vFilter==='all'}"><i></i>Tất cả <small>${cnt('all')}</small></button>
     ${Object.entries(VCATS).map(([k,c])=>`<button class="vtab" data-vf="${k}" style="--c:${c.c}" aria-pressed="${vFilter===k}"><i></i>${c.name} <small>${cnt(k)}</small></button>`).join('')}
   </div>
   <div class="grid" id="vgroups">${groups.map(([k,c])=>{const list=V.filter(v=>vCat(v)===k).slice().reverse();
     return `<div class="card vgroup" style="--c:${c.c}"><header><h3>${c.ico} ${c.name}</h3><span>${list.length} video</span></header>
       <div class="vlist">${list.length?list.map(vItem).join(''):`<div class="empty">Chưa có video nhóm ${c.name}.</div>`}</div></div>`}).join('')}</div>
  </div>`;
  const urlI=$('#vUrl'),tI=$('#vTitle'),note=$('#vNote');let lastUrl='',autoTitle=false;
  const say=(t,warn)=>{note.textContent=t;note.classList.toggle('warn',!!warn)};
  tI.oninput=()=>{autoTitle=false};
  const lookup=async()=>{
    const sp=splitPaste(urlI.value);if(sp.title&&!tI.value.trim()){tI.value=sp.title;autoTitle=true}
    if(sp.url!==urlI.value.trim())urlI.value=sp.url;
    const id=ytId(sp.url);if(!id){if(sp.url)say('Link chưa đúng định dạng YouTube.',true);return}
    const url=ytUrl(id,sp.url);if(url===lastUrl)return;lastUrl=url;
    if(tI.value.trim()&&!autoTitle){say('');return}
    if(tI.value.trim()){say('✓ Đã lấy tiêu đề từ đoạn chia sẻ.');return}
    say('Đang lấy tiêu đề video…');
    const t=await ytTitle(url);if(lastUrl!==url)return;
    if(t){tI.value=t;autoTitle=true;say('✓ Đã lấy tiêu đề tự động.')}else{say('Không lấy được tiêu đề tự động – hãy nhập tiêu đề vào ô bên cạnh.',true);tI.focus()}};
  urlI.addEventListener('change',lookup);urlI.addEventListener('paste',()=>setTimeout(lookup,30));
  $('#vAdd').onclick=async()=>{
    await lookup();const id=ytId(urlI.value);if(!id){say('Hãy dán link YouTube hợp lệ.',true);urlI.focus();return}
    if(S.config.videos.some(v=>v.vid===id)){say('Video này đã có trong kho.',true);return}
    const title=tI.value.trim();
    if(!title){say('Nhập tiêu đề video rồi bấm “Thêm vào kho”.',true);tI.focus();return}
    const cat=$('#vCat').value;
    S.config.videos.push({id:uid(),vid:id,url:ytUrl(id,urlI.value),title,cat,summary:$('#vSum').value.trim(),added:TODAY()});
    if(vFilter!=='all')vFilter=cat;dirty('config');render();toast(`Đã thêm vào nhóm ${VCATS[cat].name}`)};
  document.querySelector('.vtabs').onclick=e=>{const b=e.target.closest('[data-vf]');if(!b)return;vFilter=b.dataset.vf;render()};
  const box=$('#vgroups');
  box.addEventListener('click',e=>{const item=e.target.closest('[data-v]');if(!item)return;const v=S.config.videos.find(x=>x.id===item.dataset.v);if(!v)return;
    if(e.target.closest('[data-vdel]')){e.preventDefault();ask(`Xoá video “${v.title}”?`).then(ok=>{if(!ok)return;S.config.videos=S.config.videos.filter(x=>x.id!==v.id);dirty('config');render();toast('Đã xoá video')})}
    else if(e.target.closest('[data-vedit]'))videoForm(v)});
  box.addEventListener('input',e=>{if(!e.target.matches('[data-vsum]'))return;const item=e.target.closest('[data-v]');const v=S.config.videos.find(x=>x.id===item.dataset.v);if(!v)return;
    v.summary=e.target.value;dirty('config');const s=item.querySelector('[data-saved]');s.textContent='đang lưu…';clearTimeout(s._t);s._t=setTimeout(()=>s.textContent='✓ đã lưu',900)});
};
function videoForm(v){
  openModal(`<h3>Sửa video</h3>
   <div class="fld"><label class="lb" for="veTitle">Tiêu đề</label><input class="f" id="veTitle" value="${esc(v.title)}"></div>
   <div class="fld"><label class="lb" for="veCat">Nhóm</label><select class="f" id="veCat">${Object.entries(VCATS).map(([k,c])=>`<option value="${k}" ${vCat(v)===k?'selected':''}>${c.ico} ${c.name}</option>`).join('')}</select></div>
   <div class="fld"><label class="lb" for="veUrl">Link</label><input class="f" id="veUrl" value="${esc(v.url)}"></div>
   <div class="row"><span class="spacer"></span><button class="btn" data-close>Huỷ</button><button class="btn primary" id="veSave">Lưu thay đổi</button></div>`);
  $('#veSave').onclick=()=>{const t=$('#veTitle').value.trim();if(!t){toast('Nhập tiêu đề');return}
    const id=ytId($('#veUrl').value);if(!id){toast('Link YouTube chưa đúng');return}
    Object.assign(v,{title:t,cat:$('#veCat').value,vid:id,url:ytUrl(id,$('#veUrl').value)});dirty('config');closeModal();render();toast('Đã lưu thay đổi')};
}

/* ---------- 0. Report ---------- */
VIEWS.report=()=>{
  const r=curRange(),c=cmpRange(r);
  const hero=[
    {l:'Hoàn thành thói quen TB',f:'%',v:x=>avg(countDays(x).map(k=>dayScore(k)))*100},
    {l:'Việc tốt đã gieo',f:'n',v:x=>seedsIn(x)},
    {l:'Ngày biết ơn',f:'n',v:x=>rangeDays(x).filter(gSub).length},
    {l:'Đơn order vũ trụ',f:'n',v:x=>ordersIn(x).length},
    {l:'Ngày viết nhật ký',f:'n',v:x=>rangeDays(x).filter(jHas).length}];
  const ds=rangeDays(r);
  const sec=(t,ico,col,metrics,extra='')=>`<div class="card"><div class="rep-sec" style="--c:${col}"><div class="sec-title"><h3>${ico} ${t}</h3></div>${metricCards(metrics)}${extra}</div></div>`;
  const kTable=`<div class="mx-wrap" style="margin-top:14px"><table class="list"><thead><tr><th>Nhóm</th><th>Việc đã gieo</th>${P.cmp?'<th>Kỳ so sánh</th><th>Tăng trưởng</th>':''}<th>Mục tiêu tuần đang ghim</th></tr></thead><tbody>${KCOLS.map(k=>{const a=seedsIn(r,k.id),b=seedsIn(c,k.id);const g=S.config.karmaGoals.at(-1);
    return `<tr><td><span style="color:${k.c}">●</span> ${k.name}</td><td class="num">${a}</td>${P.cmp?`<td class="num">${b}</td><td class="num">${growth(a,b)}</td>`:''}<td>${esc(g?.goals?.[k.id]||'—')}</td></tr>`}).join('')}</tbody></table></div>`;
  const ak='rep_'+r.from+'_'+r.to+(P.cmp?'_c'+c.from+'_'+c.to:'');
  $('#view').innerHTML=`<div class="grid">
   <div class="card">${periodBar()}
     <div class="ai-card"><div class="row"><div><h3 style="margin:0">🤖 AI tổng hợp & phân tích kỳ ${rangeLabel(r)}</h3><p class="ai-note" style="margin:2px 0 0">AI tự đọc toàn bộ thói quen, gieo hạt, biết ơn, order vũ trụ và nhật ký trong kỳ để chỉ ra vấn đề chung và định hướng</p></div><span class="spacer"></span><button class="btn primary" id="aiBtn">✨ Phân tích lại</button><button class="btn" id="aiStop" style="display:none">Dừng</button></div>
       <div class="ai-note" id="aiNote" style="margin-top:8px"></div><div class="ai-out" id="aiOut">${AIRES[ak]?md(AIRES[ak]):''}</div></div></div>
   <div class="card"><h3 style="margin-bottom:12px">Chỉ số chính</h3>
     <div class="rep-hero">${hero.map(h=>{const a=h.v(r),b=h.v(c);return `<div><b>${fmtVal(a,h.f)}</b><span>${h.l}</span>${P.cmp?`<div style="margin-top:6px">${growth(a,b)} <span style="font-size:12px;opacity:.85">so với ${fmtVal(b,h.f)}</span></div>`:''}</div>`}).join('')}</div></div>
   ${ds.length<=93?`<div class="card"><h3>Xu hướng hoàn thành thói quen theo ngày</h3><p class="sub">Bấm vào cột để mở ngày đó</p><div class="mx-wrap"><div class="trend" style="min-width:${Math.max(ds.length*14,300)}px">${ds.map(k=>{const v=Math.round(dayScore(k)*100);return `<div class="b" data-date="${k}" title="${fmtShortY(k)}: ${v}%"><i style="height:${Math.max(v,1)}%;${k>TODAY()?'opacity:.3':''}"></i><small>${ds.length<=31?+k.slice(8):''}</small></div>`}).join('')}</div></div></div>`:''}
   ${sec('Nhật ký thói quen','🌱','var(--g3)',HABIT_METRICS(),habitTable())}
   ${sec('Quản lý nghiệp','☯️','var(--k4)',KARMA_METRICS().filter((_,i)=>i===0||i>5),kTable)}
   ${sec('Nhật ký biết ơn','🙏','#65A30D',GRAT_METRICS())}
   ${sec('Order vũ trụ','✨','#0EA5E9',ORDER_METRICS())}
   ${sec('Nhật ký ngày','📔','#F59E0B',JOURNAL_METRICS())}
  </div>`;
  window.AI_HOOK=()=>setupAI(r,ak,reportPrompt,true);AI_HOOK();
};

/* ---------- Modal / Popup ---------- */
function openModal(html){$('#modal').innerHTML=html;$('#modalOv').classList.add('open')}
function ask(msg,ok='Xoá'){return new Promise(res=>{openModal(`<h3>${esc(msg)}</h3><p class="sub">Thao tác này không thể hoàn tác.</p><div class="row"><span class="spacer"></span><button class="btn" id="askNo">Huỷ</button><button class="btn" id="askYes" style="background:var(--down);color:#fff;border:0">${ok}</button></div>`);
  $('#askYes').onclick=()=>{closeModal();res(true)};$('#askNo').onclick=()=>{closeModal();res(false)};setTimeout(()=>$('#askNo').focus(),30)})}
function closeModal(){$('#modalOv').classList.remove('open')}
$('#modalOv').addEventListener('click',e=>{if(e.target.id==='modalOv'||e.target.closest('[data-close]'))closeModal()});
function showPopup(q){
  const act=S.config.quotes.filter(x=>x.active);if(!q){if(!act.length)return;q=act[Math.floor(Math.random()*act.length)]}
  const h=new Date().getHours();const greet=h<11?'Chào buổi sáng ☀️':h<14?'Chào buổi trưa 🌤️':h<18?'Chào buổi chiều 🌇':'Chào buổi tối 🌙';
  const p=$('#popup');p.style.setProperty('--g',THEMES[q.theme]||THEMES.anvi);
  p.innerHTML=`<div class="rays" aria-hidden="true"></div><img class="plogo" src="${LOGO}" alt="ANVI"><div class="greet">${greet}</div><span class="kind">${esc(q.kind)}</span><q>${esc(q.text)}</q><div class="au">— ${esc(q.author||'Không rõ')}</div>
   <div class="row">${act.length>1?'<button class="btn" id="popNext">Câu khác</button>':''}<button class="btn go" id="popGo">Bắt đầu ngày mới</button></div>`;
  p.style.animation='none';void p.offsetWidth;p.style.animation='';
  $('#popupOv').classList.add('open');
  $('#popGo').onclick=()=>$('#popupOv').classList.remove('open');
  const n=$('#popNext');if(n)n.onclick=()=>{const others=act.filter(x=>x!==q);showPopup(others[Math.floor(Math.random()*others.length)])};
}
$('#popupOv').addEventListener('click',e=>{if(e.target.id==='popupOv')$('#popupOv').classList.remove('open')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();$('#popupOv').classList.remove('open')}});
function maybePopup(){let seen=false;try{seen=sessionStorage.getItem('anvi-pop')==='1';sessionStorage.setItem('anvi-pop','1')}catch(e){}if(!seen&&S.config.popup)showPopup()}

/* ---------- 9. Tài khoản (Supabase Auth) ---------- */
const normEmail=e=>String(e||'').trim().toLowerCase();
const validEmail=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const authMessage=e=>{const m=String(e?.message||'');
  if(/invalid login/i.test(m))return 'Email hoặc mật khẩu không đúng';
  if(/already registered|already exists/i.test(m))return 'Email này đã có tài khoản';
  if(/not confirmed/i.test(m))return 'Email chưa được xác nhận. Kiểm tra hộp thư của bạn.';
  if(/least|short|characters/i.test(m))return 'Mật khẩu cần ít nhất 6 ký tự';
  return m||'Có lỗi xảy ra, thử lại sau'};
function legacyBody(){
  try{if(localStorage.getItem(MIGRATED_KEY))return null;const raw=localStorage.getItem(LEGACY_KEY);return raw?JSON.parse(raw):null}catch(e){return null}
}

function showAuth(msg='',mode='signin'){
  document.body.classList.add('locked');closeModal();$('#popupOv').classList.remove('open');
  if(!sb){$('#auth').innerHTML=`<div class="auth-box"><img class="alogo" src="${LOGO}" alt="ANVI"><h3>Chưa cấu hình Supabase</h3><p class="sub">Sao chép .env.example thành .env, điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY, rồi chạy lại ứng dụng.</p></div>`;return}
  const T={signin:['Đăng nhập ANVI','Đăng nhập','Chưa có tài khoản? Đăng ký'],signup:['Tạo tài khoản','Đăng ký','Đã có tài khoản? Đăng nhập'],forgot:['Quên mật khẩu','Gửi email đặt lại','← Quay lại đăng nhập']};
  const [title,btn,alt]=T[mode];
  $('#auth').innerHTML=`<form class="auth-box" id="authForm" novalidate>
    <img class="alogo" src="${LOGO}" alt="ANVI">
    <h3>${title}</h3>
    <p class="sub">Phát triển bản thân mỗi ngày – Thân · Tâm · Tuệ</p>
    <div class="fld"><label class="lb" for="auEmail">Email</label><input class="f" id="auEmail" type="email" autocomplete="username" placeholder="ban@email.com"></div>
    ${mode==='forgot'?'':`<div class="fld"><label class="lb" for="auPw">Mật khẩu${mode==='signup'?' (ít nhất 6 ký tự)':''}</label><input class="f" id="auPw" type="password" autocomplete="${mode==='signup'?'new-password':'current-password'}"></div>`}
    <div class="auth-err" id="auErr" role="alert">${esc(msg)}</div>
    <button class="btn primary" type="submit">${btn}</button>
    <p class="auth-note"><a href="#" id="authAlt">${alt}</a>${mode==='signin'?' · <a href="#" id="authForgot">Quên mật khẩu?</a>':''}</p>
  </form>`;
  setTimeout(()=>$('#auEmail').focus(),30);
  $('#authAlt').onclick=e=>{e.preventDefault();showAuth('',mode==='signin'?'signup':'signin')};
  const fg=$('#authForgot');if(fg)fg.onclick=e=>{e.preventDefault();showAuth('','forgot')};
  $('#authForm').onsubmit=async e=>{
    e.preventDefault();const err=$('#auErr');err.style.color='';
    const email=normEmail($('#auEmail').value);
    if(!validEmail(email)){err.textContent='Email chưa đúng định dạng';$('#auEmail').focus();return}
    if(mode==='forgot'){
      const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.href.split('#')[0]});
      err.style.color='var(--text)';err.textContent=error?authMessage(error):'Nếu email đã đăng ký, bạn sẽ nhận được thư đặt lại mật khẩu.';return;
    }
    const pw=$('#auPw').value;
    if(!pw){err.textContent='Nhập mật khẩu';$('#auPw').focus();return}
    if(mode==='signup'&&pw.length<6){err.textContent='Mật khẩu cần ít nhất 6 ký tự';$('#auPw').focus();return}
    const res=mode==='signup'?await sb.auth.signUp({email,password:pw}):await sb.auth.signInWithPassword({email,password:pw});
    if(res.error){err.textContent=authMessage(res.error);return}
    if(!res.data.session){err.style.color='var(--text)';err.textContent='Đã tạo tài khoản. Kiểm tra email để xác nhận rồi đăng nhập.';return}
    enterApp(res.data.user);
  };
}

let sampleStarted=false;
function startSample(){if(sampleStarted)return;sampleStarted=true;
  if(API){API.use('sample').then(s=>{SAMPLE=s;sampleReady=true;if(window.AI_HOOK)AI_HOOK();}).catch(()=>{sampleReady=true})}
  else sampleReady=true}

async function enterApp(user){
  ME=user;const my=++syncToken;loaded=false;
  clearTimeout(saveTimer);pendingGrowth.clear();saving=false;saveAgain=false;
  cur=TODAY();tab='habits';for(const k in AIRES)delete AIRES[k];
  S={config:normalizeConfig(null),months:{}};
  document.body.classList.remove('locked');$('#auth').innerHTML='';
  render();setTimeout(maybePopup,400);startSample();
  setStatus('saving','Đang tải dữ liệu…');
  try{
    const {data,error}=await sb.from('user_data').select('body').eq('user_id',user.id);
    if(error)throw error;
    if(my!==syncToken)return;
    const row=(data||[])[0];
    const legacy=row?null:legacyBody();
    if(row?.body&&Object.keys(row.body).length)S=fromBody(row.body);
    else if(legacy)S=fromBody(legacy);
    loaded=true;render();
    if(!row&&legacy){localStorage.setItem(MIGRATED_KEY,user.id);dirty()}
    else setStatus('cloud');
  }catch(e){
    console.error(e);
    if(my===syncToken){setStatus('error','Không tải được dữ liệu');toast('Không tải được dữ liệu. Kiểm tra kết nối rồi tải lại trang.')}
  }
}
async function logout(){
  if(loaded){clearTimeout(saveTimer);await flush()}
  syncToken++;ME=null;loaded=false;S={config:normalizeConfig(null),months:{}};
  if(sb)await sb.auth.signOut();
  showAuth();toast('Đã đăng xuất');
}

function pwForm(){
  openModal(`<h3>Đổi mật khẩu</h3>
   <div class="fld"><label class="lb" for="pwOld">Mật khẩu hiện tại</label><input class="f" id="pwOld" type="password" autocomplete="current-password"></div>
   <div class="fld"><label class="lb" for="pwNew">Mật khẩu mới (ít nhất 6 ký tự)</label><input class="f" id="pwNew" type="password" autocomplete="new-password"></div>
   <div class="fld"><label class="lb" for="pwNew2">Nhập lại mật khẩu mới</label><input class="f" id="pwNew2" type="password" autocomplete="new-password"></div>
   <div class="auth-err" id="pwErr" role="alert"></div>
   <div class="row"><span class="spacer"></span><button class="btn" data-close>Huỷ</button><button class="btn primary" id="pwSave">Đổi mật khẩu</button></div>`);
  setTimeout(()=>$('#pwOld').focus(),50);
  $('#pwSave').onclick=async()=>{
    const err=$('#pwErr'),o=$('#pwOld').value,n=$('#pwNew').value,n2=$('#pwNew2').value;
    if(n.length<6){err.textContent='Mật khẩu mới cần ít nhất 6 ký tự';$('#pwNew').focus();return}
    if(n!==n2){err.textContent='Hai lần nhập mật khẩu mới chưa khớp';$('#pwNew2').select();return}
    const check=await sb.auth.signInWithPassword({email:ME.email,password:o});
    if(check.error){err.textContent='Mật khẩu hiện tại không đúng';$('#pwOld').select();return}
    const {error}=await sb.auth.updateUser({password:n});
    if(error){err.textContent=authMessage(error);return}
    closeModal();toast('Đã đổi mật khẩu');
  };
}

VIEWS.account=()=>{
  $('#view').innerHTML=`<div class="grid">
   <div class="card"><div class="acc-me"><span class="av">${esc(ME.email[0].toUpperCase())}</span>
     <div class="info"><b>${esc(ME.email)}</b><span>Tạo ngày ${ME.created_at?fmtShortY(ME.created_at.slice(0,10)):'–'}</span></div>
     <div class="row"><button class="btn primary" id="accPw">Đổi mật khẩu</button><button class="btn" id="accOut">Đăng xuất</button></div></div>
     <p class="pw-hint">Dữ liệu của bạn được lưu trên tài khoản Supabase và chỉ tài khoản này truy cập được. Đổi mật khẩu là tuỳ chọn.</p></div>
  </div>`;
  $('#accPw').onclick=pwForm;
  $('#accOut').onclick=logout;
};

/* ---------- Boot ---------- */
render();
if(sb)sb.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT'&&ME){syncToken++;ME=null;loaded=false;showAuth()}});
(async()=>{
  if(!sb){showAuth();return}
  const {data:{session}}=await sb.auth.getSession();
  if(session?.user)enterApp(session.user);else showAuth();
})();
