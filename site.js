(()=>{
const D=document,W=window,$=s=>D.querySelector(s);
D.documentElement.dataset.theme=localStorage.twt||'dark';D.documentElement.classList.add('js');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(p,body,method){const t=localStorage.twa;const r=await fetch('/api'+p,{method:method||(body?'POST':'GET'),headers:{'Content-Type':'application/json',...(t?{Authorization:'Bearer '+t}:{})},body:body&&JSON.stringify(body)});const d=await r.json();if(!r.ok)throw new Error(d.error||'Something went wrong.');return d}
W.api=api;
const go=u=>(W.__nav||(x=>location.href=x))(u);
const L=[['Home','/'],['Features','/features.html'],['Competitions','/competitions.html'],['Analysis','/analysis.html'],['Learn','/learn.html']];
const A=[['About Alix','/about.html','Story and founder'],['Performance','/performance.html','The published record'],['Community &amp; Media','/community.html','Channels and Telegram'],['Partners','/partners.html','Brokers, platforms, sponsors'],['Contact','/contact.html','Talk to Alix']];
const a=(n,h,x)=>`<a href="${h}">${x?`<b>${n}</b><span>${x}</span>`:n}</a>`;
D.body.insertAdjacentHTML('afterbegin',`<header class="top"><div class="wrap bar"><a class="brand" href="/"><img src="/logo.svg" alt=""><b>tradewithalix</b></a>
<nav class="links" aria-label="Main">${L.map(x=>a(...x)).join('')}<details class="dd"><summary>About</summary><div class="menu">${A.map(x=>a(...x)).join('')}</div></details></nav>
<div class="acts"><button class="ghost sm" id="thm" aria-label="Switch dark or light theme">◐</button><span class="desk" id="authD"></span><button class="ghost sm burger" id="bg" aria-expanded="false" aria-controls="drawer">Menu</button></div></div>
<div id="drawer" class="drawer wrap hide">${[...L,...A].map(x=>a(x[0],x[1])).join('')}<div class="dbtn" id="authM"></div></div><div id="sp"></div></header>`);
D.body.insertAdjacentHTML('beforeend',`<footer class="foot"><div class="wrap"><div class="fgrid"><div><a class="brand" href="/"><img src="/logo.svg" alt=""><b>tradewithalix</b></a><p>A trading community by Arshad Ali, built around clear education and honest talk about risk.</p></div>
<div><h4>Quick Links</h4>${[...L,A[0]].map(x=>a(x[0],x[1])).join('')}</div>
<div><h4>Resources</h4>${[A[4],A[1],A[2],A[3]].map(x=>a(x[0],x[1])).join('')}<a href="#" onclick="openAuth('signup');return false">Create Free Account</a><a href="/privacy.html">Privacy Policy</a><a href="/terms.html">Terms of Service</a><a href="/risk-disclosure.html">Risk disclosure</a></div>
<div><h4>Connect</h4><div class="soc"><a href="https://youtube.com/@tradewithalix" aria-label="YouTube"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor"/></svg></a><a href="https://instagram.com/arshad_ali_official_" aria-label="Instagram"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor"/></svg></a><a href="https://t.me/tradewithalix" aria-label="Telegram"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.5 3.5 2.8 10.8l5.6 2 2 5.7 3.2-3.8 4.9 3.6z"/><path d="m8.4 12.8 9-6"/></svg></a></div></div></div>
<p class="risk"><b>Risk disclosure.</b> Trading forex and CFDs on margin is high risk and is not suitable for everyone. Leverage magnifies losses as well as gains, so you can lose some or all of your money, and on some accounts more than you deposit. Only trade with money you can afford to lose. Past performance is not a reliable indicator of future results. Results shown on this site come from the sources named beside them and have not been independently verified unless stated. tradewithalix does not hold client funds. Everything here and on Alix's channels is general information and education, not personal advice for your situation. Rules on forex and CFDs differ by country, so check what is allowed where you live. <a href="/risk-disclosure.html">Read the full risk disclosure</a></p>
<p>© 2026 Arshad Ali. Trade responsibly. Your capital is at risk.</p><p class="legal"><a href="/terms.html">Terms</a><a href="/privacy.html">Privacy</a><a href="/risk-disclosure.html">Risk disclosure</a></p></div></footer>
<dialog id="auth"><div id="as1"><p class="mute" id="astep">Step 1 of 2 · Your details</p><h2 id="authTitle">Create your account</h2><p class="mute" id="asub"></p>
<form id="authForm"><div id="nameRow"><label>First name<input id="af" autocomplete="given-name"></label><label>Last name<input id="al" autocomplete="family-name"></label></div><label>Email<input id="ae" type="email" required autocomplete="email"></label><p class="err" id="authErr" role="alert"></p><button id="authBtn">Continue</button> <button type="button" class="ghost" onclick="auth.close()">Cancel</button></form>
<p class="mute">No password needed. We email you a one-time code and sign-in link.</p><p class="mute"><a href="#" id="swap">Already a member? Sign in</a></p></div>
<div id="as2" class="hide"><p class="mute">Step 2 of 2 · Confirm your email</p><h2>Check your email</h2><p class="mute" id="asent"></p>
<form id="codeForm"><label>6-digit code<input id="ac" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required></label><p class="err" id="codeErr" role="alert"></p><p class="ok" id="demo"></p><button>Confirm</button> <button type="button" class="ghost" id="resend">Resend code</button></form>
<p class="mute"><a href="#" id="back">Use a different email</a></p></div></dialog><dialog id="lb"><img alt=""><button class="ghost sm" onclick="lb.close()">Close</button></dialog>`);

const authBtns=()=>{const on=!!localStorage.twa;
 $('#authD').innerHTML=on?`<a class="btn sm" href="/client.html">Client Area</a><button class="ghost sm" onclick="logout()">Log out</button>`:`<button class="ghost sm" onclick="openAuth('login')">Log in</button><button class="sm" onclick="openAuth('signup')">Create Free Account</button>`;
 $('#authM').innerHTML=(on?`<button class="ghost" onclick="logout()">Log out</button><a class="btn" href="/client.html">Client Area</a>`:`<button class="ghost" onclick="openAuth('login')">Log in</button><button onclick="openAuth('signup')">Create Free Account</button><a class="btn ghost wide" data-ca href="/client.html">Client Area</a>`)};
W.navAuth=authBtns;
$('#thm').onclick=W.toggleTheme=()=>{const d=D.documentElement,dark=(d.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'))==='dark';d.dataset.theme=localStorage.twt=dark?'light':'dark'};
$('#bg').onclick=()=>{const h=$('#drawer').classList.toggle('hide');$('#bg').setAttribute('aria-expanded',!h);$('#bg').textContent=h?'Menu':'Close'};
D.addEventListener('click',e=>{if(!e.target.closest('.dd'))$('.dd').open=false;if(e.target.closest('#drawer a'))$('#drawer').classList.add('hide');
 const c=e.target.closest('[data-ca]');if(c&&!localStorage.twa){e.preventDefault();openAuth('login')}});

let mode='signup',pend=null,tm;
const steps=n=>{$('#as1').classList.toggle('hide',n!==1);$('#as2').classList.toggle('hide',n!==2)};
const ui=()=>{const s=mode==='signup';$('#authTitle').textContent=s?'Create your account':'Sign in';$('#astep').textContent='Step 1 of 2 · '+(s?'Your details':'Your email');$('#asub').textContent=s?"Your name and email, that's it. We'll email you a one-time code to confirm your address.":"Enter your email and we'll send you a one-time code.";$('#nameRow').classList.toggle('hide',!s);$('#swap').textContent=s?'Already a member? Sign in':'New here? Create a free account'};
W.openAuth=m=>{mode=m==='login'?'login':'signup';$('#drawer').classList.add('hide');ui();steps(1);$('#authErr').textContent='';$('#auth').showModal()};
$('#swap').onclick=e=>{e.preventDefault();mode=mode==='signup'?'login':'signup';ui();$('#authErr').textContent=''};
const timer=()=>{let s=60;const b=$('#resend');b.disabled=true;b.textContent='Resend code (60)';clearInterval(tm);tm=setInterval(()=>{s--;b.textContent=s>0?'Resend code ('+s+')':'Resend code';if(s<=0){b.disabled=false;clearInterval(tm)}},1000)};
const start=async()=>{const r=await api('/auth/start',pend);$('#asent').textContent='We sent a 6-digit code and a sign-in link to '+pend.email+'. The code works for 15 minutes.';$('#demo').textContent=r.devCode?'Demo mode, no email is sent. Your code is '+r.devCode+'.':'';$('#codeErr').textContent='';steps(2);timer();$('#ac').focus()};
$('#authForm').onsubmit=async e=>{e.preventDefault();pend={mode,first:$('#af').value.trim(),last:$('#al').value.trim(),email:$('#ae').value.trim()};try{await start()}catch(x){$('#authErr').textContent=x.message}};
$('#resend').onclick=async()=>{try{await start()}catch(x){$('#codeErr').textContent=x.message}};
$('#back').onclick=e=>{e.preventDefault();clearInterval(tm);steps(1)};
$('#codeForm').onsubmit=async e=>{e.preventDefault();try{const d=await api('/auth/verify',{email:pend.email,code:$('#ac').value});localStorage.twa=d.token;$('#auth').close();$('#ac').value='';afterLogin()}catch(x){$('#codeErr').textContent=x.message}};
W.logout=async()=>{delete localStorage.twa;go('/')};

const card=p=>`<article class="card post"><h3>${esc(p.title)} ${p.public?'':'<span class="tag">Members</span>'}</h3><time>${new Date(p.created).toLocaleDateString()}</time><p>${esc(p.body)}</p></article>`;
const route=()=>{const d=location.hash==='#dashboard'&&localStorage.twa;if($('#dash')){$('#dash').classList.toggle('hide',!d);$('#home').classList.toggle('hide',!!d)}};
async function init(){let me=null;if(localStorage.twa){try{me=await api('/me')}catch{delete localStorage.twa}}
 authBtns();
 route()}
const lead=async e=>{e.preventDefault();const f=e.target,m=f.querySelector('.err,.ok');m.className='err';m.textContent='';try{await api('/leads',{name:f.elements.n.value,email:f.elements.e.value,message:f.elements.m?f.elements.m.value:''});m.className='ok';m.textContent='Thanks! Alix will be in touch.';f.reset()}catch(x){m.textContent=x.message}};
W.buy=async plan=>{const m=$('#payMsg');m.className='err';m.textContent='';
 if(!localStorage.twa){openAuth('signup');$('#authErr').textContent='Create an account first, then choose your plan.';return}
 try{const o=await api('/pay/order',{plan});
  if(!W.Razorpay)await new Promise(r=>{const s=D.createElement('script');s.src='https://checkout.razorpay.com/v1/checkout.js';s.onload=r;D.head.append(s)});
  new Razorpay({key:o.key,amount:o.amount,currency:'INR',order_id:o.orderId,name:'Trade with Alix',description:o.name+' plan',theme:{color:'#0B1F3A'},
   handler:async r=>{try{await api('/pay/verify',r);m.className='ok';m.textContent='Payment received. Your plan is active.';afterLogin()}catch(x){m.textContent=x.message}}}).open()
 }catch(x){m.textContent=x.message}};
const hdr=$('.top'),sp=$('#sp');
const onScroll=()=>{const y=scrollY,h=D.documentElement.scrollHeight-innerHeight;hdr.classList.toggle('scrolled',y>8);sp.style.width=(h>0?y/h*100:0)+'%'};
addEventListener('scroll',onScroll,{passive:true});
let io;const reveal=()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;io&&io.disconnect();
 io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
 D.querySelectorAll('#view section>*,#view .hero2>*').forEach(el=>{el.classList.add('rv');io.observe(el)})};
const clock=()=>{if(W.__ck)clearInterval(W.__ck);if(!$('#fxclock'))return;
 const tick=()=>{const n=new Date(),u=n.getUTCHours()+n.getUTCMinutes()/60,p=x=>String(x).padStart(2,'0');
  $('#ck-u').textContent=p(n.getUTCHours())+':'+p(n.getUTCMinutes());
  $('#ck-i').textContent=n.toLocaleTimeString('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'});
  D.querySelectorAll('[data-s]').forEach(r=>{const[a,b]=r.dataset.s.split('-').map(Number),on=a<b?(u>=a&&u<b):(u>=a||u<b);r.classList.toggle('open',on);r.querySelector('em').textContent=on?'Open':'Closed'});
  D.querySelectorAll('.nowm').forEach(m=>m.style.left=(u/24*100)+'%')};
 tick();W.__ck=setInterval(tick,30000)};

// ---------- Client Area ----------
let ME=null,TR=[],PAYS=[],NOTES={active:false,posts:[]},PL={},ACC=[];
const afterLogin=()=>{if($('#client'))clientInit();else go('/client.html')};
const money=n=>(n<0?'−':n>0?'+':'')+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const sc=(l,v,n='')=>`<div class="card stat"><span>${l}</span><b>${v}</b><span>${n}</span></div>`;
const tabBtn=(t,l,c='')=>`<button class="${c}" onclick="showTab('${t}')">${l}</button>`;
const PLn=k=>(PL[k]||{name:k||'None'}).name;
const actv=()=>ME&&(ME.role==='admin'||(ME.planUntil&&new Date(ME.planUntil)>new Date()));
const dstr=d=>new Date(d).toLocaleDateString();
const jstats=t=>{const n=t.length,w=t.filter(x=>x.pnl>0).length;let st=0,sw=false;if(n){sw=t[0].pnl>0;for(const x of t){if(x.pnl!==0&&(x.pnl>0)===sw)st++;else break}}
 return{n,net:t.reduce((a,x)=>a+x.pnl,0),wr:n?Math.round(w/n*100):0,best:n?Math.max(...t.map(x=>x.pnl)):0,worst:n?Math.min(...t.map(x=>x.pnl)):0,st,sw}};
const equity=t=>{const a=[...t].reverse();if(a.length<2)return'<p class="mute">Add at least two trades to see your equity curve.</p>';
 let c=0;const v=[0,...a.map(x=>c+=x.pnl)],lo=Math.min(...v),hi=Math.max(...v),sp=(hi-lo)||1,X=i=>40+i*(540/(v.length-1)),Y=y=>180-(y-lo)/sp*150;
 return`<svg class="chart" viewBox="0 0 620 210" role="img" aria-label="Equity curve of your journal, ending at ${money(v[v.length-1])}"><line x1="40" x2="580" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--line)" stroke-dasharray="4 4"/><polyline points="${v.map((y,i)=>X(i)+','+Y(y)).join(' ')}" fill="none" stroke="var(--acc)" stroke-width="2.5"/><text x="580" y="${Y(v[v.length-1])-8}" font-size="12" font-weight="700" text-anchor="end" fill="var(--ink)">${money(v[v.length-1])}</text></svg>`};
W.showTab=t=>{const T=['overview','competitions','community','tools','journal','notes','mentorship','learn','billing','profile'];if(!T.includes(t))t='overview';
 D.querySelectorAll('#capp .panel').forEach(p=>p.classList.toggle('hide',p.dataset.p!==t));
 D.querySelectorAll('#capp .tabs button').forEach(b=>{b.classList.toggle('on',b.dataset.t===t);b.setAttribute('aria-selected',b.dataset.t===t)});
 const inMore=['journal','notes','mentorship','learn','billing','profile'].includes(t);
 D.querySelectorAll('.bnav button').forEach(b=>b.classList.toggle('on',b.dataset.t===t||(b.dataset.t==='more'&&inMore)));
 if(t==='notes'){localStorage.twseen=new Date().toISOString();if(ME)renderBar()}
 try{history.replaceState(null,'','#'+t)}catch(e){}scrollTo(0,0)};
const tradeRows=(t,del)=>'<tr><th>Date</th><th>Symbol</th><th>Type</th><th>Lots</th><th>Entry → exit</th><th>P&amp;L</th>'+(del?'<th></th>':'')+'</tr>'+(t.map(x=>`<tr><td>${esc(x.date)}</td><td>${esc(x.symbol)}${x.notes&&del?`<span class="mute" style="display:block;font-size:.8rem">${esc(x.notes)}</span>`:''}</td><td>${esc(x.type)}</td><td>${x.lots??'—'}</td><td>${x.entry??'—'} → ${x.exit??'—'}</td><td class="${x.pnl>0?'pos':x.pnl<0?'neg':''}">${money(x.pnl)}</td>${del?`<td><button class="sm del" data-d="${x.id}" aria-label="Delete trade">Delete</button></td>`:''}</tr>`).join('')||`<tr><td colspan="${del?7:6}" class="mute">No trades yet. Log your first one in the Journal.</td></tr>`);
const renderO0=()=>{const j=jstats(TR),a=actv(),adm=ME.role==='admin';
 $('#csub').innerHTML=a?(adm?'Admin access.':'Your '+esc(PLn(ME.plan))+' plan is active until '+dstr(ME.planUntil)+'.'):'You do not have an active plan yet. Member notes unlock with a plan.';
 $('#p-overview').innerHTML=`${accCard()}<div class="stats">${sc('Total trades',j.n)}${sc('Win rate',j.wr+'%')}${sc('Total P&amp;L',money(j.net))}${sc('Current streak',j.st?j.st+(j.sw?' wins':' losses'):'None')}</div>
 <div class="card" style="margin-top:16px"><b>${a?esc(adm?'Admin access':PLn(ME.plan)+' plan'):'No active plan'}</b><p class="mute">${a?(adm?'No expiry.':Math.max(0,Math.ceil((new Date(ME.planUntil)-new Date())/864e5))+' days left, until '+dstr(ME.planUntil)+'.'):'Member notes unlock with a plan.'}</p>${a?'':tabBtn('billing','See plans')}</div>
 <div class="qa" style="margin:16px 0">${tabBtn('journal','Log a trade')}${tabBtn('tools','Open calculators','ghost')}${tabBtn('notes','Read analysis','ghost')}</div>
 <h3>Recent trades</h3><div class="card scroll"><table>${tradeRows(TR.slice(0,5),false)}</table></div>
 <h3 style="margin-top:20px">Performance</h3><div class="card">${equity(TR)}</div>
 <h3 style="margin-top:20px">Latest note</h3>${NOTES.posts[0]?card(NOTES.posts[0]):'<p class="mute">No notes yet.</p>'}`};
const renderO=()=>{renderO0();bindO()};
const accCard=()=>{const chip=ACC.some(x=>x.status==='approved')?['Linked','ok']:ACC.some(x=>x.status==='pending')?['Pending review','']:['Not linked',''];
 return`<div class="card lcard"><div class="lh"><h3>Trading account</h3><span class="chip ${chip[1]}">${chip[0]}</span></div>${ACC.map(x=>`<div class="row2"><div><b>${esc(x.broker)} · ${esc(x.number)}</b><small>${esc(x.status)}${x.server?' · '+esc(x.server):''}</small></div><button class="sm del" data-ad="${x.id}">Remove</button></div>`).join('')}
 <button class="row" id="accOpen"><span>I already have a trading account<small>Link your account number</small></span></button>
 <form id="accForm" class="hide"><label>Broker<input id="ab" maxlength="40" required></label><label>Account number<input id="an2" inputmode="numeric" maxlength="12" required></label><label>Server (optional)<input id="asv" maxlength="60"></label><p class="err" id="aerr" role="alert"></p><button>Send for review</button></form>
 <a class="row" href="/contact.html"><span>I need help choosing a broker<small>Ask Alix</small></span></a></div>`};
const bindO=()=>{const f=$('#accOpen');if(f)f.onclick=()=>$('#accForm').classList.toggle('hide');
 const fm=$('#accForm');if(fm)fm.onsubmit=async e=>{e.preventDefault();const m=$('#aerr');m.textContent='';try{await api('/accounts',{broker:$('#ab').value,number:$('#an2').value,server:$('#asv').value});ACC=await api('/accounts');renderO();renderBar()}catch(x){m.textContent=x.message}};
 D.querySelectorAll('#p-overview [data-ad]').forEach(b=>b.onclick=async()=>{if(confirm('Remove this account link?')){await api('/accounts/'+b.dataset.ad,null,'DELETE');ACC=await api('/accounts');renderO();renderBar()}})};
const notices=()=>{const L=[],seen=localStorage.twseen||'1970-01-01';const nn=NOTES.posts.filter(p=>p.created>seen).length;
 if(nn)L.push({t:nn+(nn>1?' new notes':' new note'),s:'Since your last visit',go:'notes',dot:1});
 if(ME.role!=='admin'){if(!actv())L.push({t:'Unlock member notes',s:'Choose a plan to read the deeper notes',go:'billing'});else{const d=Math.ceil((new Date(ME.planUntil)-new Date())/864e5);if(d<=7)L.push({t:'Your plan ends in '+d+' day'+(d===1?'':'s'),s:'Renew to keep access',go:'billing',dot:1})}}
 if(ACC.some(x=>x.status==='pending'))L.push({t:'Account link under review',s:'We will confirm it soon',go:'overview'});
 return L};
const renderBar=()=>{const f=ME.first||ME.name.split(' ')[0]||'',l=ME.last||ME.name.split(' ').slice(1).join(' ')||'';$('#aAv').textContent=((f[0]||'')+(l[0]||'')||'U').toUpperCase();
 const L=notices();$('#bdot').classList.toggle('hide',!L.some(x=>x.dot));
 $('#bellpop').innerHTML=L.length?L.map(x=>`<button class="row" data-go="${x.go}"><span>${esc(x.t)}<small>${esc(x.s)}</small></span></button>`).join(''):'<p class="mute">You are all caught up.</p>';
 $('#avpop').innerHTML=`<p class="mute">${esc(ME.email)}</p><button class="row" data-go="profile"><span>Settings</span></button><a class="row" href="/"><span>Back to website</span></a><button class="row" onclick="logout()"><span>Log out</span></button>`};
const PAGES=[['overview','Home'],['competitions','Competitions'],['community','Community'],['tools','Trade Tools'],['journal','Journal'],['notes','Analysis'],['mentorship','Mentorship'],['learn','Learn'],['billing','Billing'],['profile','Settings']];
const doSearch=q=>{q=q.trim().toLowerCase();const R=[];if(q){PAGES.filter(p=>p[1].toLowerCase().includes(q)).forEach(p=>R.push([p[0],p[1],'Page']));NOTES.posts.filter(p=>(p.title+' '+p.body).toLowerCase().includes(q)).slice(0,5).forEach(p=>R.push(['notes',p.title,'Note']));TR.filter(x=>(x.symbol+' '+(x.notes||'')).toLowerCase().includes(q)).slice(0,5).forEach(x=>R.push(['journal',x.symbol+' '+x.type+' '+x.date,'Trade']))}
 $('#sres').innerHTML=R.length?R.map(r=>`<button class="row" data-go="${r[0]}"><span>${esc(r[1])}<small>${r[2]}</small></span></button>`).join(''):`<p class="mute">${q?'Nothing found.':'Search your notes, trades and pages.'}</p>`};
const renderJ=()=>{const j=jstats(TR);
 $('#jstats').innerHTML=`<div class="stats">${sc('Trades',j.n)}${sc('Win rate',j.wr+'%')}${sc('Net P&amp;L',money(j.net))}${sc('Best',money(j.best))}${sc('Worst',money(j.worst))}${sc('Streak',j.st?j.st+(j.sw?' wins':' losses'):'None')}</div>`;
 $('#jchart').innerHTML=equity(TR);
 $('#jtable').innerHTML=tradeRows(TR,true)};
const renderN=()=>{$('#p-notes').innerHTML=(NOTES.active?'':`<div class="card"><h3>Member notes are locked</h3><p class="mute">Public notes are below. Choose a plan to unlock the rest.</p>${tabBtn('billing','See plans')}</div>`)+'<div class="posts" style="margin-top:12px">'+(NOTES.posts.map(card).join('')||'<p class="mute">No notes yet.</p>')+'</div>'};
const renderB=()=>{const adm=ME.role==='admin';
 $('#bsum').innerHTML=actv()?`<h3>${esc(adm?'Admin access':PLn(ME.plan))}</h3><p class="mute">${adm?'No expiry.':'Active until '+dstr(ME.planUntil)+'. Buying again adds time to the end of your current plan.'}</p>`:'<h3>No active plan</h3><p class="mute">Pick a plan below to unlock member notes.</p>';
 $('#bplans').innerHTML=Object.entries(PL).map(([k,v],i)=>`<div class="card plan${i==1?' feat':''}"><h3>${esc(v.name)}</h3><div class="price">₹${v.price.toLocaleString('en-IN')}</div><p class="mute">Member notes and updates for ${v.days} days.</p><button onclick="buy('${k}')">${actv()&&!adm?'Renew ':'Buy '}${esc(v.name)}</button></div>`).join('');
 $('#bpay').innerHTML='<tr><th>Date</th><th>Plan</th><th>Amount</th><th>Status</th></tr>'+(PAYS.map(p=>`<tr><td>${dstr(p.created)}</td><td>${esc(PLn(p.plan))}</td><td>₹${Number(p.amount).toLocaleString('en-IN')}</td><td>${esc(p.status)}</td></tr>`).join('')||'<tr><td colspan="4" class="mute">No payments yet.</td></tr>')};
const renderP=()=>{$('#pf1').value=ME.first||ME.name.split(' ')[0]||'';$('#pf2').value=ME.last||ME.name.split(' ').slice(1).join(' ')||'';$('#pem').value=ME.email;
 $('#pinfo').textContent='Email '+(ME.verified?'confirmed':'not confirmed')+(ME.created?' · member since '+dstr(ME.created):'');$('#padm').classList.toggle('hide',ME.role!=='admin')};
const renderAll=()=>{renderBar();$('#chi').textContent='Welcome back, '+(ME.first||ME.name.split(' ')[0])+'.';renderO();renderJ();renderN();renderB();renderP()};
const tools=()=>{const g=i=>parseFloat($('#'+i).value),VPU={XAUUSD:100,FOREX:100000};
 const pos=()=>{const s=$('#ti').value,vpu=s==='CUSTOM'?g('tv'):VPU[s];$('#tvr').classList.toggle('hide',s!=='CUSTOM');
  const risk=g('tb')*g('tr')/100,dist=Math.abs(g('te')-g('ts'));
  $('#tout').innerHTML=risk>0&&dist>0&&vpu>0?`<div class="stats">${sc('Risk amount',risk.toFixed(2))}${sc('Stop distance',+dist.toFixed(5))}${sc('Lot size',(Math.floor(risk/(dist*vpu)*100)/100).toFixed(2))}</div>`:'<p class="mute">Fill in every box to see the lot size.</p>'};
 const rr=()=>{const e=g('re'),s=g('rs'),t=g('rt');
  $('#rout').innerHTML=![e,s,t].every(isFinite)||e===s?'<p class="mute">Fill in entry, stop and target.</p>':(t-e)*(e-s)<=0?'<p class="err">Check your levels: the stop and the target must sit on opposite sides of the entry.</p>':`<div class="stats">${sc('Risk',+Math.abs(e-s).toFixed(5))}${sc('Reward',+Math.abs(t-e).toFixed(5))}${sc('Reward to risk','1 : '+(Math.abs(t-e)/Math.abs(e-s)).toFixed(2))}</div>`};
 const pl=()=>{const e=g('gpe'),x=g('gpx'),l=g('gpl'),d=$('#gpd').value==='sell'?-1:1,v=VPU[$('#gpi').value];$('#gout').innerHTML=[e,x,l].every(isFinite)&&l>0?`<div class="stats">${sc('Profit or loss',money((x-e)*d*l*v),'USD account assumed')}${sc('Price move',+(x-e).toFixed(5))}</div>`:'<p class="mute">Fill in entry, exit and lots.</p>'};
 const mg=()=>{const p=g('gmp'),l=g('gml'),lv=g('gmg'),c=VPU[$('#gmi').value]===100?100:100000;$('#gmout').innerHTML=[p,l,lv].every(isFinite)&&p>0&&l>0&&lv>0?`<div class="stats">${sc('Margin needed',(l*c*p/lv).toFixed(2),'USD account assumed')}${sc('Position value',(l*c*p).toFixed(2))}</div>`:'<p class="mute">Fill in price, lots and leverage.</p>'};
 ['gpi','gpd','gpe','gpx','gpl'].forEach(i=>$('#'+i).oninput=pl);['gmi','gmp','gml','gmg'].forEach(i=>$('#'+i).oninput=mg);
 ['tb','tr','ti','tv','te','ts'].forEach(i=>$('#'+i).oninput=pos);['re','rs','rt'].forEach(i=>$('#'+i).oninput=rr);pos();rr();pl();mg()};
W.clientInit=async()=>{if(!$('#client'))return;const gate=on=>{D.documentElement.classList.toggle('appmode',!on);$('#cgate').classList.toggle('hide',!on);$('#capp').classList.toggle('hide',on)};
 if(!localStorage.twa){gate(true);authBtns();return}
 try{ME=await api('/me')}catch{delete localStorage.twa;authBtns();gate(true);return}
 gate(false);authBtns();
 [NOTES,TR,PAYS,PL,ACC]=await Promise.all([api('/member/posts'),api('/journal'),api('/payments/me'),api('/plans'),api('/accounts')]);
 renderAll();tools();
 D.querySelectorAll('#capp .tabs button').forEach(b=>b.onclick=()=>showTab(b.dataset.t));
 const setD=()=>{$('#jd').value=new Date().toISOString().slice(0,10);$('#js').value='XAUUSD'};setD();
 $('#jform').onsubmit=async e=>{e.preventDefault();const g=i=>$('#'+i).value,m=$('#jerr');m.textContent='';
  try{await api('/journal',{date:g('jd'),symbol:g('js'),type:g('jt'),lots:g('jl'),entry:g('je'),exit:g('jx'),pnl:g('jp'),notes:g('jn')});TR=await api('/journal');renderJ();renderO();e.target.reset();setD()}catch(x){m.textContent=x.message}};
 $('#jtable').onclick=async e=>{const b=e.target.closest('[data-d]');if(b&&confirm('Delete this trade?')){await api('/journal/'+b.dataset.d,null,'DELETE');TR=await api('/journal');renderJ();renderO()}};
 $('#pform').onsubmit=async e=>{e.preventDefault();const m=$('#perr');m.className='err';m.textContent='';try{ME=await api('/me',{first:$('#pf1').value,last:$('#pf2').value},'PUT');renderAll();m.className='ok';m.textContent='Saved.'}catch(x){m.textContent=x.message}};
 D.querySelectorAll('.bnav button').forEach(b=>b.onclick=()=>b.dataset.t==='more'?$('#more').showModal():showTab(b.dataset.t));
 $('#aSearch').onclick=()=>{$('#srch').showModal();$('#sq').value='';doSearch('');$('#sq').focus()};$('#sq').oninput=e=>doSearch(e.target.value);
 $('#aBell').onclick=e=>{e.stopPropagation();$('#avpop').classList.add('hide');$('#bellpop').classList.toggle('hide')};
 $('#aAv').onclick=e=>{e.stopPropagation();$('#bellpop').classList.add('hide');$('#avpop').classList.toggle('hide')};
 $('#capp').onclick=e=>{const g=e.target.closest('[data-go]');if(g){if($('#srch').open)$('#srch').close();if($('#more').open)$('#more').close();$('#bellpop').classList.add('hide');$('#avpop').classList.add('hide');showTab(g.dataset.go)}};
 if(!W.__pc){W.__pc=1;D.addEventListener('click',e=>{if(!e.target.closest('.pop,#aBell,#aAv')){const a=$('#bellpop'),b=$('#avpop');a&&a.classList.add('hide');b&&b.classList.add('hide')}})}
 const cn=$('#cnotify'),cdone=()=>{cn.disabled=true;cn.textContent="You're on the list"};if(localStorage.twcomp)cdone();
 cn.onclick=async()=>{try{await api('/leads',{name:ME.name,email:ME.email,message:'Competition interest (from Client Area)'});localStorage.twcomp='1';cdone()}catch(x){$('#cerr').textContent=x.message}};
 const mf=$('#mform');mf.onsubmit=async e=>{e.preventDefault();const m=$('#merr');m.className='err';m.textContent='';
  try{await api('/leads',{name:ME.name,email:ME.email,message:'[Mentorship] Level: '+$('#mx').value+'. Goal: '+$('#mg2').value+($('#mc').value?'. Contact: '+$('#mc').value:'')});m.className='ok';m.textContent='Application sent. Alix will get back to you.';mf.reset()}catch(x){m.textContent=x.message}};
 showTab(location.hash.slice(1))};
W.siteHydrate=()=>{D.documentElement.classList.remove('appmode');
 const c=W.__path||location.pathname.replace(/index\.html$/,'')||'/';
 D.querySelectorAll('.top a[href]').forEach(x=>x.toggleAttribute('aria-current',x.getAttribute('href')===c));
 if($('#candles')){let y=170,h='';for(let i=0;i<30;i++){const o=y,v=y+(Math.random()-.55)*34,hi=Math.min(o,v)-Math.random()*14,lo=Math.max(o,v)+Math.random()*14,col=v<o?'var(--bull)':'var(--bear)',x=14+i*20;h+=`<line x1="${x}" x2="${x}" y1="${hi}" y2="${lo}" stroke="${col}"/><rect x="${x-5}" y="${Math.min(o,v)}" width="10" height="${Math.max(Math.abs(o-v),2)}" fill="${col}"/>`;y=v}$('#candles').innerHTML=h}
 if($('#posts'))api('/posts').then(l=>{if(l.length)$('#posts').innerHTML=l.map(card).join('')});
 if($('#planList'))api('/plans').then(p=>{$('#planList').innerHTML=Object.entries(p).map(([k,v],i)=>`<div class="card plan${i==1?' feat':''}"><h3>${esc(v.name)}</h3><div class="price">₹${v.price.toLocaleString('en-IN')}</div><p class="mute">Member notes and updates for ${v.days} days.</p><button onclick="buy('${k}')">Buy ${esc(v.name)}</button></div>`).join('')});
 D.querySelectorAll('.leadForm').forEach(f=>f.onsubmit=lead);reveal();clock();onScroll();if($('#client'))clientInit();
 init()};
D.addEventListener('click',e=>{const g=e.target.closest('.gal img');if(g){$('#lb img').src=g.src;$('#lb img').alt=g.alt;$('#lb').showModal()}});
addEventListener('hashchange',route);
siteHydrate();
})();
