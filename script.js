/* ═══════════════════════════════════════════════════
   ТОҒЫЗ ҚҰМАЛАҚ — Complete Game Script
   EmailJS · Auth · Rooms · Game · i18n
═══════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────
   EMAIL CONFIG — Fill in your EmailJS credentials
   Sign up free at https://emailjs.com
   ──────────────────────────────────────────────
   1. Create account → Email Services → Add Gmail/Outlook
   2. Email Templates → Create template with variables:
      {{to_name}}, {{to_email}}, {{code}}, {{purpose}}
   3. Account → Public Key
   ──────────────────────────────────────────── */
const EMAILJS = {
  publicKey:  'YOUR_PUBLIC_KEY',    // e.g. 'abc123XYZ'
  serviceId:  'YOUR_SERVICE_ID',    // e.g. 'service_abc123'
  templateId: 'YOUR_TEMPLATE_ID',  // e.g. 'template_abc123'
  enabled: false, // ← set to true after filling in above
};

/* ──────────────────────────────────────────────
   TRANSLATIONS
────────────────────────────────────────────── */
const T = {
  en: {
    loginTab:'Login', registerTab:'Register', gameName:'Game Name',
    email:'Email', password:'Password', confirmPassword:'Confirm Password',
    newPassword:'New Password', loginBtn:'Login', registerBtn:'Create Account',
    sendCode:'Send Verification Code', verifyBtn:'Verify Code', resetBtn:'Reset Password',
    noAccount:"Don't have an account?", hasAccount:'Already have an account?',
    forgotPassword:'Forgot password?', forgotTitle:'Reset Password',
    forgotDesc:'Enter your game name and registered email.',
    identityVerified:'Email Verified! ✓', nowSetPass:'Now create your password',
    resetTitle:'Set New Password', back:'Back',
    verifyTitle:'Check your email',
    enterCode:'Enter 6-digit code', codeExpires:'Expires in',
    noCode:"Didn't get it?", resend:'Resend', demoTag:'DEMO',
    demoNote:'No email server set up. Your code:',
    successReset:'Password reset! Please log in.',
    successRegister:'Account created! Welcome.',
    eNameRequired:'Game name is required', eNameShort:'Name must be 3+ characters',
    eNameTaken:'This game name is already taken',
    eEmailInvalid:'Please enter a valid email',
    ePassRequired:'Password is required', ePassShort:'Password must be 4+ characters',
    ePassMismatch:'Passwords do not match',
    eWrongCreds:'Wrong game name or password',
    eEmailMismatch:'Email does not match this account',
    eCodeWrong:'Incorrect code. Try again.',
    eCodeExpired:'Code expired. Request a new one.',
    logout:'Logout', chooseMode:'Choose Your Battle',
    chooseModeDesc:'Select a game mode to begin',
    vsAI:'vs AI', vsAIDesc:'Challenge the machine in a single-player duel.',
    vsPlayer:'vs Player', vsPlayerDesc:'Create or join a room to play with others.',
    singlePlayer:'Single Player', multiplayer:'Multiplayer',
    online:'online', openRooms:'open rooms', playNow:'Play Now →', findMatch:'Find Match →',
    roomBrowser:'Room Browser', createRoom:'Create Room',
    createRoomDesc:'Set password, invite friends',
    quickMatch:'Quick Match', quickMatchDesc:'Find a random opponent',
    openRoomsList:'Open Rooms', noRooms:'No open rooms. Create one!',
    roomName:'Room Name', roomPassword:'Password', optional:'(optional)',
    createRoomBtn:'Create Room', passwordRequired:'Password Required',
    roomProtected:'This room is password protected',
    enterPassword:'Enter password…', wrongPassword:'Wrong password.',
    joinRoom:'Join Room', searching:'Searching…',
    lookingForOpponent:'Looking for opponent in other tabs', cancel:'Cancel',
    waitingPlayers:'Players', waitingHost:'Host', waitingChallenger:'Challenger',
    waitingForPlayer:'Waiting for player…', roomCode:'Code',
    roomStatus:'Status', statusWaiting:'Waiting…', statusReady:'Ready!',
    startGame:'Start Game', waitForHost:'Waiting for host to start…',
    waitForPlayer:'Waiting for another player…', leave:'Leave',
    roomChat:'Room Chat', sayHello:'Say hello…',
    yourTurn:'Your Turn', aiTurn:"AI's Turn", opponentTurn:"Opponent's Turn",
    quit:'✕ Quit', playAgain:'Play Again', backToLobby:'Back to Lobby',
    youWin:'You Win!', aiWins:'AI Wins!', draw:"It's a Draw!", wins:' Wins!',
    gameChat:'Chat', kazhan:'Казан', pts:'pts', rules:'Rules',
    rulesTitle:'Rules of Togyz Kumalak',
    rulesContent:[
      {num:'①', txt:'The game starts with 9 stones (құмалақ) in each of the 9 holes — 162 total.'},
      {num:'②', txt:'On your turn, pick any hole on your side. All stones are distributed one-by-one counter-clockwise.'},
      {num:'③', txt:'If the last stone lands in an opponent\'s hole and makes it even, you capture all stones in that hole.'},
      {num:'④', txt:'Captured stones go into your Казан (scoring pit) and are out of play.'},
      {num:'⑤', txt:'Game ends when all holes on one side are empty. Most stones wins. First to 81 wins immediately!'},
    ],
    joinedRoom:'Joined room! Share the code to invite friends.',
    leftRoom:' left the room.', gameStarted:'Game started!',
    yourTurnMsg:"It's your turn.", waitingFor:'Waiting for ',
    codeSentTo:'Code sent to',
  },
  zh: {
    loginTab:'登录', registerTab:'注册', gameName:'游戏名',
    email:'电子邮件', password:'密码', confirmPassword:'确认密码',
    newPassword:'新密码', loginBtn:'登录', registerBtn:'创建账户',
    sendCode:'发送验证码', verifyBtn:'验证', resetBtn:'重置密码',
    noAccount:'没有账户？', hasAccount:'已有账户？',
    forgotPassword:'忘记密码？', forgotTitle:'重置密码',
    forgotDesc:'输入游戏名和注册邮箱。',
    identityVerified:'邮箱已验证！✓', nowSetPass:'现在设置你的密码',
    resetTitle:'设置新密码', back:'返回',
    verifyTitle:'查看你的邮箱',
    enterCode:'输入6位验证码', codeExpires:'有效期',
    noCode:'没收到？', resend:'重新发送', demoTag:'演示',
    demoNote:'未配置邮件服务器。你的验证码：',
    successReset:'密码已重置！请登录。', successRegister:'账户创建成功！',
    eNameRequired:'请输入游戏名', eNameShort:'游戏名至少3个字符',
    eNameTaken:'该游戏名已被使用',
    eEmailInvalid:'请输入有效邮箱',
    ePassRequired:'请输入密码', ePassShort:'密码至少4个字符',
    ePassMismatch:'两次密码不一致',
    eWrongCreds:'游戏名或密码错误',
    eEmailMismatch:'邮箱与该账户不匹配',
    eCodeWrong:'验证码错误，请重试。',
    eCodeExpired:'验证码已过期，请重新获取。',
    logout:'退出', chooseMode:'选择战斗模式', chooseModeDesc:'选择游戏模式开始',
    vsAI:'对战AI', vsAIDesc:'在单人模式中挑战机器。',
    vsPlayer:'玩家对战', vsPlayerDesc:'创建或加入房间与他人对战。',
    singlePlayer:'单人游戏', multiplayer:'多人游戏',
    online:'在线', openRooms:'开放房间', playNow:'立即游戏→', findMatch:'寻找对手→',
    roomBrowser:'房间浏览', createRoom:'创建房间', createRoomDesc:'设置密码，邀请朋友',
    quickMatch:'快速匹配', quickMatchDesc:'随机寻找对手',
    openRoomsList:'开放房间', noRooms:'暂无房间，创建一个！',
    roomName:'房间名', roomPassword:'密码', optional:'（可选）',
    createRoomBtn:'创建房间', passwordRequired:'需要密码', roomProtected:'此房间有密码保护',
    enterPassword:'输入密码…', wrongPassword:'密码错误。',
    joinRoom:'加入房间', searching:'搜索中…', lookingForOpponent:'正在寻找对手',
    cancel:'取消', waitingPlayers:'玩家', waitingHost:'房主', waitingChallenger:'挑战者',
    waitingForPlayer:'等待玩家…', roomCode:'房间码', roomStatus:'状态',
    statusWaiting:'等待中…', statusReady:'准备好了！',
    startGame:'开始游戏', waitForHost:'等待房主开始…', waitForPlayer:'等待另一位玩家…',
    leave:'离开', roomChat:'房间聊天', sayHello:'打个招呼…',
    yourTurn:'你的回合', aiTurn:'AI回合', opponentTurn:'对手回合',
    quit:'✕ 退出', playAgain:'再玩一局', backToLobby:'返回大厅',
    youWin:'你赢了！', aiWins:'AI获胜！', draw:'平局！', wins:'获胜！',
    gameChat:'聊天', kazhan:'得分坑', pts:'分', rules:'规则',
    rulesTitle:'托古兹库玛拉克规则',
    rulesContent:[
      {num:'①', txt:'每位玩家9个坑，每坑9颗棋子，共162颗。'},
      {num:'②', txt:'选择己方的坑，将棋子逆时针逐一分发。'},
      {num:'③', txt:'最后一颗落入对方坑且总数为偶数，则吃掉该坑所有棋子。'},
      {num:'④', txt:'被吃棋子入得分坑（Казан），退出比赛。'},
      {num:'⑤', txt:'一方坑清空时游戏结束，棋子最多者获胜。率先81颗立即获胜！'},
    ],
    joinedRoom:'已加入房间！分享房间码邀请朋友。',
    leftRoom:' 离开了房间。', gameStarted:'游戏开始！',
    yourTurnMsg:'轮到你了。', waitingFor:'等待 ',
    codeSentTo:'验证码已发送至',
  },
  kk: {
    loginTab:'Кіру', registerTab:'Тіркелу', gameName:'Ойын аты',
    email:'Пошта', password:'Құпия сөз', confirmPassword:'Растау',
    newPassword:'Жаңа құпия сөз', loginBtn:'Кіру', registerBtn:'Тіркелу',
    sendCode:'Растау кодын жіберу', verifyBtn:'Растау', resetBtn:'Қалпына келтіру',
    noAccount:'Аккаунтыңыз жоқ па?', hasAccount:'Аккаунтыңыз бар ма?',
    forgotPassword:'Құпия сөзді ұмыттыңыз ба?', forgotTitle:'Қалпына келтіру',
    forgotDesc:'Ойын атыңызды және тіркелген поштаңызды енгізіңіз.',
    identityVerified:'Пошта расталды! ✓', nowSetPass:'Құпия сөз жасаңыз',
    resetTitle:'Жаңа құпия сөз', back:'Артқа',
    verifyTitle:'Поштаңызды тексеріңіз',
    enterCode:'6 таңбалы кодты енгізіңіз', codeExpires:'Мерзімі',
    noCode:'Алмадыңыз ба?', resend:'Қайта жіберу', demoTag:'ДЕМО',
    demoNote:'Пошта сервері жоқ. Кодыңыз:',
    successReset:'Қалпына келтірілді! Кіріңіз.', successRegister:'Аккаунт жасалды!',
    eNameRequired:'Ойын атын енгізіңіз', eNameShort:'Ат кемінде 3 таңба',
    eNameTaken:'Бұл ойын аты қолданылып тұр',
    eEmailInvalid:'Жарамды пошта енгізіңіз',
    ePassRequired:'Құпия сөзді енгізіңіз', ePassShort:'Кемінде 4 таңба',
    ePassMismatch:'Құпия сөздер сәйкес емес',
    eWrongCreds:'Ойын аты немесе құпия сөз қате',
    eEmailMismatch:'Пошта бұл аккаунтқа сәйкес емес',
    eCodeWrong:'Код қате. Қайтадан көріңіз.',
    eCodeExpired:'Мерзімі өтті. Жаңасын сұраңыз.',
    logout:'Шығу', chooseMode:'Шайқасты таңдаңыз', chooseModeDesc:'Режимді таңдаңыз',
    vsAI:'AI-ға қарсы', vsAIDesc:'Жалғыз режимде машинаны сынаңыз.',
    vsPlayer:'Ойыншыға қарсы', vsPlayerDesc:'Бөлме жасаңыз немесе ойнаңыз.',
    singlePlayer:'Жалғыз', multiplayer:'Көп ойыншы',
    online:'онлайн', openRooms:'ашық бөлме', playNow:'Ойнау→', findMatch:'Матч→',
    roomBrowser:'Бөлмелер', createRoom:'Бөлме жасау', createRoomDesc:'Пароль, шақыру',
    quickMatch:'Жылдам', quickMatchDesc:'Кездейсоқ қарсылас',
    openRoomsList:'Ашық бөлмелер', noRooms:'Бөлме жоқ. Жасаңыз!',
    roomName:'Бөлме аты', roomPassword:'Пароль', optional:'(міндетті емес)',
    createRoomBtn:'Жасау', passwordRequired:'Пароль қажет', roomProtected:'Паролмен қорғалған',
    enterPassword:'Паролді енгізіңіз…', wrongPassword:'Пароль қате.',
    joinRoom:'Кіру', searching:'Іздеу…', lookingForOpponent:'Қарсылас іздеу',
    cancel:'Бас тарту', waitingPlayers:'Ойыншылар', waitingHost:'Қожайын',
    waitingChallenger:'Бәсекелес', waitingForPlayer:'Күтуде…',
    roomCode:'Код', roomStatus:'Күй', statusWaiting:'Күтуде…', statusReady:'Дайын!',
    startGame:'Бастау', waitForHost:'Қожайынды күту…', waitForPlayer:'Ойыншыны күту…',
    leave:'Шығу', roomChat:'Бөлме чаты', sayHello:'Сәлем айтыңыз…',
    yourTurn:'Сіздің кезегіңіз', aiTurn:'AI кезегі', opponentTurn:'Қарсылас кезегі',
    quit:'✕ Шығу', playAgain:'Қайта', backToLobby:'Лоббиге',
    youWin:'Сіз жеңдіңіз!', aiWins:'AI жеңді!', draw:'Тең!', wins:' жеңді!',
    gameChat:'Чат', kazhan:'Қазан', pts:'ұпай', rules:'Ережелер',
    rulesTitle:'Тоғыз құмалақ ережелері',
    rulesContent:[
      {num:'①', txt:'Әр ойыншының 9 ұясында 9 құмалақтан — барлығы 162.'},
      {num:'②', txt:'Өз жағыңыздағы ұяны таңдап, сағат тіліне қарсы таратыңыз.'},
      {num:'③', txt:'Соңғы құмалақ қарсыластың ұясына жұп санмен түссе — алыңыз.'},
      {num:'④', txt:'Жиналған құмалақ Қазаныңызға түседі.'},
      {num:'⑤', txt:'Бір жақ босаса — ойын аяқталады. 81-ге бірінші жеткен жеңеді!'},
    ],
    joinedRoom:'Бөлмеге кірдіңіз! Кодты бөлісіңіз.',
    leftRoom:' шықты.', gameStarted:'Ойын басталды!',
    yourTurnMsg:'Сіздің кезегіңіз.', waitingFor:'Күтуде: ',
    codeSentTo:'Код жіберілді:',
  }
};

/* ──────────────────────────────────────────────
   STATE
────────────────────────────────────────────── */
let lang = localStorage.getItem('togyz-lang') || 'en';
const S = {
  username:'', userId: crypto.randomUUID(),
  currentRoom:null, isHost:false, gameMode:'ai',
  board:[], playerScore:0, opponentScore:0,
  isMyTurn:true, isAnimating:false, myRole:'bottom', opponentName:'AI',
};
const VS = { code:null, expires:null, purpose:null, pendingUser:null, interval:null };

function t(k) { return T[lang][k] || T.en[k] || k; }

/* ──────────────────────────────────────────────
   EMAILJS
────────────────────────────────────────────── */
function initEmailJS() {
  if (EMAILJS.enabled && typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS.publicKey);
  }
}

async function sendEmailCode(toEmail, toName, code, purpose) {
  // Always log to console
  console.log(`%c[CODE] ${toName} <${toEmail}> → ${code} (${purpose})`, 'color:#8B1A1A;font-size:1.2em;font-weight:bold');

  if (!EMAILJS.enabled || typeof emailjs === 'undefined') return false;

  try {
    await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
      to_email: toEmail, to_name: toName, code, purpose
    });
    return true;
  } catch(e) {
    console.warn('EmailJS send failed:', e);
    return false;
  }
}

/* ──────────────────────────────────────────────
   AUTH STORAGE
────────────────────────────────────────────── */
function getUsers() { try{return JSON.parse(localStorage.getItem('togyz-users')||'{}')}catch{return{}} }
function saveUsers(u) { localStorage.setItem('togyz-users', JSON.stringify(u)); }
function getSession() { try{return JSON.parse(localStorage.getItem('togyz-session')||'null')}catch{return null} }
function saveSession(s) { localStorage.setItem('togyz-session', JSON.stringify(s)); }
function clearSession() { localStorage.removeItem('togyz-session'); }

function hashPass(str) {
  let h = 0x811c9dc5;
  for (let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,0x01000193);}
  return (h>>>0).toString(16).padStart(8,'0');
}

/* ──────────────────────────────────────────────
   VERIFICATION CODE SYSTEM
────────────────────────────────────────────── */
function makeCode() { return String(Math.floor(100000+Math.random()*900000)); }

async function startVerification(email, username, purpose, pendingUser) {
  const code = makeCode();
  VS.code = code; VS.expires = Date.now()+10*60*1000;
  VS.purpose = purpose; VS.pendingUser = pendingUser;

  const sent = await sendEmailCode(email, username, code, purpose);

  if (purpose === 'register') {
    qs('#v-desc').textContent = `${t('codeSentTo')} ${email}`;
    qs('#v-demo-code').textContent = code;
    qs('#v-demo').style.display = EMAILJS.enabled && sent ? 'none' : '';
    clearBoxes('v-code-row');
    qs('#v-err').textContent = '';
    startTimer('v-timer', () => { VS.code=null; });
    showPane('pane-verify');
  } else {
    qs('#rv-desc').textContent = `${t('codeSentTo')} ${email}`;
    qs('#rv-demo-code').textContent = code;
    qs('#rv-demo').style.display = EMAILJS.enabled && sent ? 'none' : '';
    clearBoxes('rv-code-row');
    qs('#rv-err').textContent = '';
    startTimer('rv-timer', () => { VS.code=null; });
    showPane('pane-reset-verify');
  }
}

function startTimer(elId, onExpire) {
  clearInterval(VS.interval);
  const el = qs('#'+elId);
  const tick = () => {
    const rem = Math.max(0, Math.round((VS.expires-Date.now())/1000));
    el.textContent = `${String(Math.floor(rem/60)).padStart(2,'0')}:${String(rem%60).padStart(2,'0')}`;
    el.classList.toggle('urgent', rem<=60);
    if(rem<=0){clearInterval(VS.interval);if(onExpire)onExpire();}
  };
  tick(); VS.interval=setInterval(tick,1000);
}

function getBoxCode(rowId) {
  return Array.from(qs('#'+rowId).querySelectorAll('.cbox')).map(b=>b.value).join('');
}
function clearBoxes(rowId) {
  qs('#'+rowId).querySelectorAll('.cbox').forEach(b=>{b.value='';b.classList.remove('filled','err');});
  qs('#'+rowId).querySelector('.cbox')?.focus();
}
function shakeBoxes(rowId) {
  qs('#'+rowId).querySelectorAll('.cbox').forEach(b=>{b.classList.add('err');setTimeout(()=>b.classList.remove('err'),400);});
}

function initBoxes(rowId, onFull) {
  const boxes = Array.from(qs('#'+rowId).querySelectorAll('.cbox'));
  boxes.forEach((b,i)=>{
    b.addEventListener('input',()=>{
      b.value=b.value.replace(/\D/g,'').slice(-1);
      b.classList.toggle('filled',!!b.value);
      if(b.value&&i<boxes.length-1)boxes[i+1].focus();
      if(boxes.every(x=>x.value)&&onFull)onFull();
    });
    b.addEventListener('keydown',e=>{
      if(e.key==='Backspace'&&!b.value&&i>0){boxes[i-1].value='';boxes[i-1].classList.remove('filled');boxes[i-1].focus();}
      if(e.key==='ArrowLeft'&&i>0)boxes[i-1].focus();
      if(e.key==='ArrowRight'&&i<boxes.length-1)boxes[i+1].focus();
    });
    b.addEventListener('paste',e=>{
      e.preventDefault();
      const digits=e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);
      digits.split('').forEach((d,j)=>{if(boxes[i+j]){boxes[i+j].value=d;boxes[i+j].classList.add('filled');}});
      boxes[Math.min(i+digits.length,boxes.length-1)]?.focus();
      if(digits.length===6&&onFull)onFull();
    });
  });
}

function checkCode(code, errId, rowId) {
  if(code.length<6){qs('#'+errId).textContent=t('eCodeWrong');return false;}
  if(!VS.code){qs('#'+errId).textContent=t('eCodeExpired');shakeBoxes(rowId);return false;}
  if(Date.now()>VS.expires){VS.code=null;qs('#'+errId).textContent=t('eCodeExpired');shakeBoxes(rowId);return false;}
  if(code!==VS.code){qs('#'+errId).textContent=t('eCodeWrong');shakeBoxes(rowId);return false;}
  return true;
}

/* ──────────────────────────────────────────────
   PANE / SCREEN ROUTING
────────────────────────────────────────────── */
function show(id) { document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); qs('#'+id).classList.add('active'); }
function modal(id,open) { qs('#'+id).classList.toggle('open',open); }
function qs(s,ctx=document) { return ctx.querySelector(s); }

function showPane(id) {
  document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
  qs('#'+id).classList.add('active');
  const hideTabs = ['pane-verify','pane-set-pass','pane-forgot','pane-reset-verify','pane-reset-pass'].includes(id);
  qs('#auth-tabs').classList.toggle('hidden', hideTabs);
}

/* ──────────────────────────────────────────────
   I18N
────────────────────────────────────────────── */
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n');
    if(T[lang][k]!==undefined)el.textContent=T[lang][k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    const k=el.getAttribute('data-i18n-ph');
    if(T[lang][k]!==undefined)el.placeholder=T[lang][k];
  });
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  renderRules();
  updateTurnUI();
}
function setLang(l) { lang=l; localStorage.setItem('togyz-lang',l); applyI18n(); }

function renderRules() {
  const list=qs('#rules-list'); if(!list)return;
  list.innerHTML=T[lang].rulesContent.map(r=>`<div class="rule-item"><span class="rule-num">${r.num}</span><span class="rule-txt">${r.txt}</span></div>`).join('');
}

/* ──────────────────────────────────────────────
   INIT
────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded',()=>{
  initEmailJS();
  applyI18n();
  bindGlobalControls();
  bindAuth();
  bindLobby();
  bindRooms();
  bindWaiting();
  bindGame();
  cleanRooms();
  initLobbyBC();
  setInterval(()=>{ if(S.username)blobby('PING'); },4000);

  const sess=getSession();
  if(sess){ S.username=sess.username; enterLobby(); }
});

/* ──────────────────────────────────────────────
   GLOBAL CONTROLS
────────────────────────────────────────────── */
function bindGlobalControls() {
  document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
  qs('#g-rules-btn').addEventListener('click',()=>{renderRules();modal('rules-modal',true);});
  qs('#close-rules').addEventListener('click',()=>modal('rules-modal',false));
  qs('#rules-modal').addEventListener('click',e=>{if(e.target===qs('#rules-modal'))modal('rules-modal',false);});
}

/* ──────────────────────────────────────────────
   AUTH
────────────────────────────────────────────── */
function bindAuth() {
  // Tab switch
  qs('#tab-login-btn').addEventListener('click',()=>{showPane('pane-login');qs('#auth-tabs').classList.remove('hidden');qs('#tab-login-btn').classList.add('active');qs('#tab-reg-btn').classList.remove('active');});
  qs('#tab-reg-btn').addEventListener('click',()=>{showPane('pane-reg');qs('#auth-tabs').classList.remove('hidden');qs('#tab-reg-btn').classList.add('active');qs('#tab-login-btn').classList.remove('active');});
  qs('#go-reg').addEventListener('click',()=>qs('#tab-reg-btn').click());
  qs('#go-login').addEventListener('click',()=>qs('#tab-login-btn').click());
  qs('#go-forgot').addEventListener('click',()=>showPane('pane-forgot'));
  qs('#v-back').addEventListener('click',()=>qs('#tab-reg-btn').click());
  qs('#fg-back').addEventListener('click',()=>qs('#tab-login-btn').click());
  qs('#rv-back').addEventListener('click',()=>showPane('pane-forgot'));

  // Password toggle eyes
  bindEye('l-pass','l-eye'); bindEye('sp-pass','sp-eye'); bindEye('rp-pass','rp-eye');

  // Login
  qs('#btn-login').addEventListener('click',doLogin);
  [qs('#l-name'),qs('#l-pass')].forEach(el=>el?.addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();}));

  // Register step 1
  qs('#btn-send-reg').addEventListener('click',doRegStep1);
  [qs('#r-name'),qs('#r-email')].forEach(el=>el?.addEventListener('keydown',e=>{if(e.key==='Enter')doRegStep1();}));

  // Verify
  initBoxes('v-code-row',()=>doVerify());
  qs('#btn-verify').addEventListener('click',doVerify);
  qs('#btn-resend-reg').addEventListener('click',()=>{ if(VS.pendingUser)startVerification(VS.pendingUser.email,VS.pendingUser.username,'register',VS.pendingUser); });

  // Set password (step 3)
  qs('#btn-create-acc').addEventListener('click',doSetPass);
  [qs('#sp-pass'),qs('#sp-pass2')].forEach(el=>el?.addEventListener('keydown',e=>{if(e.key==='Enter')doSetPass();}));

  // Forgot
  qs('#btn-send-reset').addEventListener('click',doForgotStep1);
  [qs('#fg-name'),qs('#fg-email')].forEach(el=>el?.addEventListener('keydown',e=>{if(e.key==='Enter')doForgotStep1();}));

  // Reset verify
  initBoxes('rv-code-row',()=>doResetVerify());
  qs('#btn-reset-verify').addEventListener('click',doResetVerify);
  qs('#btn-resend-reset').addEventListener('click',()=>{ if(VS.pendingUser)startVerification(VS.pendingUser.email,VS.pendingUser.username,'reset',VS.pendingUser); });

  // Reset set password
  qs('#btn-do-reset').addEventListener('click',doResetPass);
  [qs('#rp-pass'),qs('#rp-pass2')].forEach(el=>el?.addEventListener('keydown',e=>{if(e.key==='Enter')doResetPass();}));
}

function bindEye(inputId, btnId) {
  const inp=qs('#'+inputId), btn=qs('#'+btnId); if(!inp||!btn)return;
  btn.addEventListener('click',()=>{ inp.type=inp.type==='password'?'text':'password'; btn.textContent=inp.type==='password'?'👁':'🙈'; });
}

function err(id,msg){qs('#'+id).textContent=msg;}

function doLogin() {
  const name=qs('#l-name').value.trim(), pass=qs('#l-pass').value;
  err('l-err','');
  if(!name){err('l-err',t('eNameRequired'));return;}
  if(!pass){err('l-err',t('ePassRequired'));return;}
  const users=getUsers(), user=users[name.toLowerCase()];
  if(!user||user.passHash!==hashPass(pass)){err('l-err',t('eWrongCreds'));return;}
  saveSession({username:user.displayName,userId:crypto.randomUUID()});
  S.username=user.displayName; enterLobby();
}

async function doRegStep1() {
  const name=qs('#r-name').value.trim(), email=qs('#r-email').value.trim();
  err('r-err','');
  if(!name){err('r-err',t('eNameRequired'));return;}
  if(name.length<3){err('r-err',t('eNameShort'));return;}
  if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){err('r-err',t('eEmailInvalid'));return;}
  if(getUsers()[name.toLowerCase()]){err('r-err',t('eNameTaken'));return;}
  qs('#btn-send-reg').disabled=true; qs('#btn-send-reg').textContent='…';
  await startVerification(email, name, 'register', {username:name, email, passHash:null});
  qs('#btn-send-reg').disabled=false; qs('#btn-send-reg').textContent=t('sendCode');
}

function doVerify() {
  const code=getBoxCode('v-code-row');
  if(!checkCode(code,'v-err','v-code-row'))return;
  // Code correct — go to password setup
  clearInterval(VS.interval); VS.pendingUser.codeVerified=true;
  showPane('pane-set-pass');
}

function doSetPass() {
  const pass=qs('#sp-pass').value, pass2=qs('#sp-pass2').value;
  err('sp-err','');
  if(!pass){err('sp-err',t('ePassRequired'));return;}
  if(pass.length<4){err('sp-err',t('ePassShort'));return;}
  if(pass!==pass2){err('sp-err',t('ePassMismatch'));return;}
  if(!VS.pendingUser?.codeVerified){err('sp-err','Please verify email first.');return;}
  const u=VS.pendingUser;
  const users=getUsers();
  if(users[u.username.toLowerCase()]){err('sp-err',t('eNameTaken'));return;}
  users[u.username.toLowerCase()]={displayName:u.username,email:u.email,passHash:hashPass(pass),createdAt:Date.now()};
  saveUsers(users); VS.pendingUser=null; VS.code=null;
  saveSession({username:u.username,userId:crypto.randomUUID()});
  S.username=u.username; enterLobby();
}

async function doForgotStep1() {
  const name=qs('#fg-name').value.trim(), email=qs('#fg-email').value.trim();
  err('fg-err','');
  if(!name){err('fg-err',t('eNameRequired'));return;}
  if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){err('fg-err',t('eEmailInvalid'));return;}
  const user=getUsers()[name.toLowerCase()];
  if(!user){err('fg-err',t('eWrongCreds'));return;}
  if(user.email.toLowerCase()!==email.toLowerCase()){err('fg-err',t('eEmailMismatch'));return;}
  qs('#btn-send-reset').disabled=true; qs('#btn-send-reset').textContent='…';
  await startVerification(email,user.displayName,'reset',{username:user.displayName,email});
  qs('#btn-send-reset').disabled=false; qs('#btn-send-reset').textContent=t('sendCode');
}

function doResetVerify() {
  const code=getBoxCode('rv-code-row');
  if(!checkCode(code,'rv-err','rv-code-row'))return;
  clearInterval(VS.interval); VS.pendingUser.codeVerified=true;
  showPane('pane-reset-pass');
}

function doResetPass() {
  const pass=qs('#rp-pass').value, pass2=qs('#rp-pass2').value;
  err('rp-err','');
  if(!pass){err('rp-err',t('ePassRequired'));return;}
  if(pass.length<4){err('rp-err',t('ePassShort'));return;}
  if(pass!==pass2){err('rp-err',t('ePassMismatch'));return;}
  if(!VS.pendingUser?.codeVerified){err('rp-err','Please verify code first.');return;}
  const users=getUsers(), key=VS.pendingUser.username.toLowerCase();
  if(users[key]){users[key].passHash=hashPass(pass);saveUsers(users);}
  VS.pendingUser=null; VS.code=null;
  showPane('pane-login'); qs('#auth-tabs').classList.remove('hidden');
  qs('#tab-login-btn').classList.add('active'); qs('#tab-reg-btn').classList.remove('active');
  const el=qs('#l-err'); el.style.color='#2D6040'; el.textContent=t('successReset');
  setTimeout(()=>{el.style.color='';el.textContent='';},4000);
}

/* ──────────────────────────────────────────────
   LOBBY
────────────────────────────────────────────── */
function enterLobby() {
  qs('#lobby-avatar').textContent=S.username[0]?.toUpperCase()||'?';
  qs('#lobby-username').textContent=S.username;
  updateLobbyStats(); blobby('PING'); show('screen-lobby'); applyI18n();
}
function updateLobbyStats() {
  const rooms=getRooms(), open=Object.values(rooms).filter(r=>r.status==='waiting').length;
  qs('#stat-rooms').textContent=open;
}
function bindLobby() {
  qs('#mode-ai').addEventListener('click',startAIGame);
  qs('#mode-pvp').addEventListener('click',enterRooms);
  qs('#btn-logout').addEventListener('click',()=>{clearSession();S.username='';show('screen-auth');showPane('pane-login');qs('#auth-tabs').classList.remove('hidden');});
}

/* ──────────────────────────────────────────────
   ROOMS
────────────────────────────────────────────── */
let lobbyBC=null, gameBC=null;
function initLobbyBC(){if(lobbyBC)lobbyBC.close();lobbyBC=new BroadcastChannel('togyz-lobby');lobbyBC.onmessage=onLobbyMsg;}
function initGameBC(id){if(gameBC)gameBC.close();gameBC=new BroadcastChannel('togyz-game-'+id);gameBC.onmessage=onGameMsg;}
function blobby(type,d={}){lobbyBC?.postMessage({type,from:S.userId,fromName:S.username,...d});}
function bgame(type,d={}){gameBC?.postMessage({type,from:S.userId,fromName:S.username,...d});}

function getRooms(){try{return JSON.parse(localStorage.getItem('togyz-rooms')||'{}')}catch{return{}}}
function saveRooms(r){localStorage.setItem('togyz-rooms',JSON.stringify(r));}
function getRoom(id){return getRooms()[id]||null;}
function saveRoom(r){const rooms=getRooms();rooms[r.id]=r;saveRooms(rooms);}
function deleteRoom(id){const rooms=getRooms();delete rooms[id];saveRooms(rooms);}
function genRoomCode(){let c;do{c=Math.random().toString(36).substring(2,6).toUpperCase();}while(getRoom(c));return c;}
function cleanRooms(){const rooms=getRooms(),now=Date.now();let ch=false;for(const[id,r]of Object.entries(rooms)){if(now-r.createdAt>30*60000){delete rooms[id];ch=true;}}if(ch)saveRooms(rooms);}

function enterRooms(){
  qs('#rooms-avatar').textContent=S.username[0]?.toUpperCase()||'?';
  qs('#rooms-username').textContent=S.username;
  applyI18n(); refreshList(); show('screen-rooms');
}
function bindRooms(){
  qs('#rooms-back').addEventListener('click',enterLobby);
  qs('#btn-refresh').addEventListener('click',refreshList);
  qs('#btn-create-room').addEventListener('click',()=>{qs('#cr-name').value=S.username+"'s Room";qs('#cr-pass').value='';modal('modal-create',true);});
  qs('#close-create').addEventListener('click',()=>modal('modal-create',false));
  qs('#btn-confirm-create').addEventListener('click',doCreate);
  qs('#close-password').addEventListener('click',()=>modal('modal-password',false));
  qs('#btn-confirm-join').addEventListener('click',doJoinPW);
  qs('#join-pass').addEventListener('keydown',e=>{if(e.key==='Enter')doJoinPW();});
  qs('#btn-quick-match').addEventListener('click',startQM);
  qs('#btn-cancel-qm').addEventListener('click',cancelQM);
  [qs('#modal-create'),qs('#modal-password')].forEach(m=>m?.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open');}));
}
function refreshList(){
  cleanRooms();
  const open=Object.values(getRooms()).filter(r=>r.status==='waiting');
  const list=qs('#rooms-list'); list.querySelectorAll('.room-item').forEach(el=>el.remove());
  qs('#rooms-empty').style.display=open.length?'none':'';
  open.sort((a,b)=>b.createdAt-a.createdAt).forEach(room=>{
    const el=document.createElement('div'); el.className='room-item';
    el.innerHTML=`<div><div class="ri-name">${esc(room.name)} ${room.password?'🔒':''}</div><div class="ri-meta">${t('waitingHost')}: ${esc(room.creator)} · ${room.players.length}/2</div></div><button class="btn-join" data-id="${room.id}">${t('joinRoom')}</button>`;
    el.querySelector('.btn-join').addEventListener('click',()=>tryJoin(room.id));
    list.appendChild(el);
  });
  qs('#stat-rooms').textContent=open.length;
}
let pendingRoom=null;
function tryJoin(id){
  const room=getRoom(id); if(!room||room.status!=='waiting'){refreshList();return;}
  if(room.players.length>=2){refreshList();return;}
  if(room.password){pendingRoom=id;qs('#join-pass').value='';qs('#pass-err').textContent='';modal('modal-password',true);}
  else joinRoom(id,'');
}
function doJoinPW(){
  const pass=qs('#join-pass').value.trim(), room=getRoom(pendingRoom); if(!room)return;
  if(room.password&&room.password!==pass){qs('#pass-err').textContent=t('wrongPassword');return;}
  modal('modal-password',false); joinRoom(pendingRoom,pass);
}
function doCreate(){
  const name=qs('#cr-name').value.trim()||S.username+"'s Room", pass=qs('#cr-pass').value.trim();
  const room={id:genRoomCode(),name,password:pass||null,creator:S.username,creatorId:S.userId,players:[{name:S.username,id:S.userId}],status:'waiting',createdAt:Date.now()};
  saveRoom(room); modal('modal-create',false); blobby('ROOM_CREATED',{room}); S.isHost=true; enterWaiting(room);
}
function joinRoom(id,_){
  let room=getRoom(id); if(!room)return;
  if(room.players.find(p=>p.id===S.userId)){S.isHost=room.creatorId===S.userId;enterWaiting(room);return;}
  room.players.push({name:S.username,id:S.userId});
  if(room.players.length>=2)room.status='ready';
  saveRoom(room); S.isHost=false; blobby('ROOM_UPDATED',{room}); enterWaiting(room);
}
let seeking=false,qmTimer=null;
function startQM(){
  modal('modal-qm',true); seeking=true; blobby('QM_SEEK');
  setTimeout(()=>{if(!seeking)return;const open=Object.values(getRooms()).filter(r=>r.status==='waiting'&&r.creatorId!==S.userId);if(open.length){joinRoom(open[0].id,'');cancelQM();}},900);
  qmTimer=setTimeout(()=>{if(!seeking)return;qs('#cr-name').value=S.username+"'s Room";qs('#cr-pass').value='';doCreate();cancelQM();},6000);
}
function cancelQM(){seeking=false;clearTimeout(qmTimer);modal('modal-qm',false);}

/* ──────────────────────────────────────────────
   WAITING ROOM
────────────────────────────────────────────── */
let pollTm=null;
function enterWaiting(room){
  S.currentRoom=room; S.gameMode='pvp'; initGameBC(room.id);
  clearChat('w-msgs'); addSys('w-msgs',t('joinedRoom'));
  updateWaitUI(room); show('screen-waiting'); applyI18n();
  pollTm=setInterval(()=>{const r=getRoom(S.currentRoom?.id);if(!r)return;S.currentRoom=r;updateWaitUI(r);},1000);
}
function stopPoll(){clearInterval(pollTm);pollTm=null;}
function updateWaitUI(room){
  qs('#w-room-name').textContent=room.name; qs('#w-code-pill').textContent=room.id;
  qs('#ri-code').textContent=room.id; qs('#ri-pass').textContent=room.password||'—';
  qs('#ri-pass-row').style.display=room.password?'':'none';
  qs('#w-count').textContent=room.players.length+'/2';
  const p0=room.players[0],p1=room.players[1];
  if(p0){qs('#wav0').textContent=p0.name[0].toUpperCase();qs('#wn0').textContent=p0.name+(p0.id===S.userId?' ★':'');qs('#ws0').classList.remove('w-empty');qs('#wd0').classList.add('ready');}
  const s1=qs('#ws1');
  if(p1){s1.classList.remove('w-empty');s1.querySelector('.w-av').textContent=p1.name[0].toUpperCase();s1.querySelector('.w-name').textContent=p1.name+(p1.id===S.userId?' ★':'');qs('#wd1').classList.add('ready');qs('#ri-status').textContent=t('statusReady');qs('#ri-status').className='s-ready';}
  else{qs('#ri-status').textContent=t('statusWaiting');qs('#ri-status').className='s-wait';}
  const sb=qs('#btn-start-game');
  sb.style.display=S.isHost?'':'none'; sb.disabled=!(S.isHost&&room.players.length>=2);
  qs('#wait-hint').textContent=!S.isHost?(room.players.length>=2?t('waitForHost'):t('waitForPlayer')):'';
}
function bindWaiting(){
  qs('#waiting-leave').addEventListener('click',leaveRoom);
  qs('#btn-start-game').addEventListener('click',()=>{
    const room=getRoom(S.currentRoom?.id); if(!room||room.players.length<2)return;
    room.status='playing'; saveRoom(room); blobby('ROOM_UPDATED',{room}); bgame('GAME_START',{}); launchPvP(room,true);
  });
  qs('#ri-code').addEventListener('click',()=>{
    navigator.clipboard?.writeText(S.currentRoom?.id).catch(()=>{});
    const el=qs('#ri-code'); el.textContent='Copied!'; setTimeout(()=>{el.textContent=S.currentRoom?.id;},1500);
  });
  bindChat('w-input','w-send','w-msgs');
}
function leaveRoom(){
  stopPoll(); const room=S.currentRoom; if(!room){enterRooms();return;}
  let r=getRoom(room.id);
  if(r){r.players=r.players.filter(p=>p.id!==S.userId);if(!r.players.length){deleteRoom(r.id);blobby('ROOM_DELETED',{roomId:r.id});}else{r.status='waiting';saveRoom(r);blobby('ROOM_UPDATED',{room:r});}}
  bgame('PLAYER_LEFT',{}); S.currentRoom=null; gameBC?.close(); gameBC=null; enterRooms();
}

/* Broadcast handlers */
const peers=new Set();
function onLobbyMsg(e){
  const m=e.data; if(m.from===S.userId)return;
  if(m.type==='PING'){peers.add(m.from);qs('#stat-online').textContent=peers.size+1;}
  if(m.type==='ROOM_CREATED'||m.type==='ROOM_UPDATED'){if(m.room)saveRoom(m.room);if(qs('#screen-rooms').classList.contains('active'))refreshList();updateLobbyStats();}
  if(m.type==='ROOM_DELETED'){if(m.roomId)deleteRoom(m.roomId);if(qs('#screen-rooms').classList.contains('active'))refreshList();}
  if(m.type==='QM_SEEK'&&seeking){cancelQM();qs('#cr-name').value=S.username+"'s Room";qs('#cr-pass').value='';doCreate();}
}
function onGameMsg(e) {
  const m = e.data; if (m.from === S.userId) return;
  const inWaiting = qs('#screen-waiting').classList.contains('active');
  const inGame    = qs('#screen-game').classList.contains('active');
  if (m.type === 'CHAT') {
    addMsg(inWaiting ? 'w-msgs' : 'g-msgs', m.fromName, m.text, false);
  }
  if (m.type === 'PLAYER_LEFT') {
    addSys(inWaiting ? 'w-msgs' : 'g-msgs', m.fromName + t('leftRoom'));
    if (inGame) G.isAnimating = false;
  }
  if (m.type === 'GAME_START' && !S.isHost) {
    const r = getRoom(S.currentRoom?.id);
    if (r) launchPvP(r, false);
  }
  // HOST receives challenger's move → apply it → broadcast full state
  if (m.type === 'GAME_MOVE' && S.isHost && inGame) {
    applyOpponentMove(m.idx);
  }
  // CHALLENGER receives authoritative state from host → render it
  if (m.type === 'GAME_STATE' && !S.isHost && inGame) {
    applyGameState(m);
  }
}

/* ──────────────────────────────────────────────
   CHAT
────────────────────────────────────────────── */
function bindChat(inId,sendId,msgsId){
  const inp=qs('#'+inId),btn=qs('#'+sendId); if(!inp||!btn)return;
  const send=()=>{const txt=inp.value.trim();if(!txt)return;addMsg(msgsId,S.username,txt,true);bgame('CHAT',{text:txt});inp.value='';};
  btn.addEventListener('click',send); inp.addEventListener('keydown',e=>{if(e.key==='Enter')send();});
}

/* ═══════════════════════════════════════════════════════════
   GAME ENGINE — Host-Authoritative Multiplayer Sync
   ═══════════════════════════════════════════════════════════
   Architecture:
   • G = absolute game state (board[18], score[2], p0turn)
   • score[0] = host score, score[1] = challenger score
   • p0turn = true → host's turn, false → challenger's turn
   • HOST is authoritative: runs all logic, broadcasts GAME_STATE
   • CHALLENGER: sends GAME_MOVE, renders received GAME_STATE
   • AI game: G.playerIdx=0 (player=host), AI=challenger role
   ═══════════════════════════════════════════════════════════ */

const G = {
  board: new Array(18).fill(9),
  score: [0, 0],      // [hostScore, challengerScore]
  p0turn: true,       // true=host/player0 turn
  playerIdx: 0,       // 0=host/player, 1=challenger/AI
  isAnimating: false,
  opponentName: 'AI',
  gameMode: 'ai',
};

// Is it currently my turn?
function isMyTurn() {
  return G.p0turn ? G.playerIdx === 0 : G.playerIdx === 1;
}

// My hole indices (what I can click)
function myHoles()  { return G.playerIdx === 0 ? [0,8] : [9,17]; }
function oppHoles() { return G.playerIdx === 0 ? [9,17] : [0,8]; }

// ── SETUP ──────────────────────────────────────────────────

function initG() {
  G.board = new Array(18).fill(9);
  G.score = [0, 0];
  G.p0turn = true;
  G.isAnimating = false;
}

function startAIGame() {
  G.gameMode = 'ai'; G.playerIdx = 0; G.opponentName = 'AI';
  S.gameMode = 'ai';
  initG();
  setupGameUI('AI', S.username, false);
  clearChat('g-msgs'); addSys('g-msgs', t('gameStarted'));
  qs('#win-overlay').classList.remove('show');
  show('screen-game'); applyI18n(); renderBoard();
}

function launchPvP(room, isHost) {
  stopPoll(); S.isHost = isHost; S.currentRoom = room;
  const opp = room.players.find(p => p.id !== S.userId);
  G.gameMode = 'pvp'; S.gameMode = 'pvp';
  G.playerIdx = isHost ? 0 : 1;
  G.opponentName = opp?.name || 'Opponent';
  initG();
  setupGameUI(G.opponentName, S.username, true);
  clearChat('g-msgs'); addSys('g-msgs', t('gameStarted'));
  addSys('g-msgs', isMyTurn() ? t('yourTurnMsg') : t('waitingFor') + G.opponentName + '…');
  qs('#win-overlay').classList.remove('show');
  show('screen-game'); applyI18n(); renderBoard();
}

function setupGameUI(topName, botName, showChat) {
  qs('#gb-top-name').textContent = topName;
  qs('#gb-bot-name').textContent = botName;
  qs('#gb-top-av').textContent = topName[0]?.toUpperCase() || '?';
  qs('#gb-bot-av').textContent = botName[0]?.toUpperCase() || '?';
  qs('#gb-top-score').textContent = '0';
  qs('#gb-bot-score').textContent = '0';
  qs('#wn1').textContent = botName;
  qs('#wn2').textContent = topName;
  qs('#chat-col').classList.toggle('collapsed', !showChat);
}

// ── RENDERING ─────────────────────────────────────────────

function renderBoard() {
  const aiRow = qs('#ai-row'), plRow = qs('#player-row');
  aiRow.innerHTML = ''; plRow.innerHTML = '';

  /* TOP ROW = opponent holes (CSS has flex-direction:row-reverse so
     we append in natural order and they display reversed)          */
  const topStart = G.playerIdx === 0 ? 9  : 0;
  const topEnd   = G.playerIdx === 0 ? 18 : 9;
  for (let i = topStart; i < topEnd; i++) aiRow.appendChild(mkHole(i, false));

  /* BOTTOM ROW = my holes */
  const botStart = G.playerIdx === 0 ? 0 : 9;
  const botEnd   = G.playerIdx === 0 ? 9 : 18;
  for (let i = botStart; i < botEnd; i++) plRow.appendChild(mkHole(i, true));

  updateTurnUI();
  updateScoreUI();
}

function mkHole(i, isMyHole) {
  const el = document.createElement('div');
  el.className = 'hole'; el.dataset.index = i;
  const clickable = isMyHole && isMyTurn() && !G.isAnimating && G.board[i] > 0;
  if (clickable) { el.classList.add('clickable'); el.addEventListener('click', () => onHoleClick(i)); }
  const wrap = document.createElement('div');
  wrap.className = 'stones-wrap';
  const n = Math.min(G.board[i] || 0, 18);
  for (let j = 0; j < n; j++) {
    const s = document.createElement('div'); s.className = 'stone'; wrap.appendChild(s);
  }
  el.appendChild(wrap);
  const lbl = document.createElement('div');
  lbl.className = 'hole-count'; lbl.textContent = G.board[i] || 0; el.appendChild(lbl);
  return el;
}

function updateTurnUI() {
  const pill = qs('#turn-pill'); if (!pill) return;
  const mine = isMyTurn();
  pill.textContent = mine ? t('yourTurn') : (G.gameMode === 'ai' ? t('aiTurn') : t('opponentTurn'));
  pill.classList.toggle('ai-turn', !mine);
  qs('#pip-bot')?.classList.toggle('active', mine);
  qs('#pip-top')?.classList.toggle('active', !mine);
}

function updateScoreUI() {
  // My score = score[playerIdx], opp score = score[1-playerIdx]
  const myS  = G.score[G.playerIdx];
  const oppS = G.score[1 - G.playerIdx];
  qs('#gb-bot-score').textContent = myS;
  qs('#gb-top-score').textContent = oppS;
  qs('#kz-bot-n').textContent = myS;
  qs('#kz-top-n').textContent = oppS;
  renderKazhan('kz-bot', myS);
  renderKazhan('kz-top', oppS);
}

function renderKazhan(id, score) {
  const el = qs('#' + id); if (!el) return; el.innerHTML = '';
  const n = Math.min(score, 40);
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div'); s.className = 'kz-stone'; el.appendChild(s);
  }
}

// ── GAME LOGIC ─────────────────────────────────────────────

function onHoleClick(i) {
  if (!isMyTurn() || G.isAnimating || !G.board[i]) return;

  if (G.gameMode === 'pvp' && G.playerIdx === 1) {
    // Challenger: send move to host, host will apply and broadcast state
    G.isAnimating = true; // block double-click
    bgame('GAME_MOVE', { idx: i });
    return;
  }

  // Host or AI game: apply move locally
  G.isAnimating = true;
  const isP0Move = G.p0turn; // capture from p0's perspective
  runDistribute(i, isP0Move, () => {
    G.p0turn = !G.p0turn;
    G.isAnimating = false;
    if (G.gameMode === 'pvp') broadcastGameState();
    if (!checkEnd()) {
      renderBoard();
      if (G.gameMode === 'ai' && !isMyTurn()) setTimeout(aiTurn, 900);
    }
  });
}

// Apply a move received from challenger (PvP host only)
function applyOpponentMove(idx) {
  if (G.playerIdx !== 0) return; // only host runs this
  G.isAnimating = true;
  runDistribute(idx, false, () => { // false = challenger's move = p1's move
    G.p0turn = !G.p0turn;
    G.isAnimating = false;
    broadcastGameState();
    if (!checkEnd()) renderBoard();
  });
}

function runDistribute(start, isP0Move, cb) {
  let stones = G.board[start];
  if (!stones) { cb(); return; }
  G.board[start] = stones === 1 ? 0 : 1;
  if (stones !== 1) stones--;
  let cur = start;
  renderBoard();
  const step = () => {
    if (stones > 0) {
      cur = (cur + 1) % 18;
      G.board[cur]++;
      stones--;
      flashHole(cur);
      renderBoard();
      setTimeout(step, 220);
    } else {
      runCapture(cur, isP0Move);
      updateScoreUI();
      cb();
    }
  };
  setTimeout(step, 180);
}

function runCapture(pos, isP0Move) {
  /* Player 0 (host) captures when landing on player 1's holes (9-17) with even count.
     Player 1 (challenger/AI) captures when landing on player 0's holes (0-8) with even count. */
  if (isP0Move) {
    if (pos >= 9 && G.board[pos] % 2 === 0 && G.board[pos] > 0) {
      G.score[0] += G.board[pos]; G.board[pos] = 0; renderBoard();
    }
  } else {
    if (pos < 9 && G.board[pos] % 2 === 0 && G.board[pos] > 0) {
      G.score[1] += G.board[pos]; G.board[pos] = 0; renderBoard();
    }
  }
}

function flashHole(i) {
  document.querySelectorAll('.hole').forEach(h => {
    if (parseInt(h.dataset.index) === i) {
      h.classList.add('flash');
      setTimeout(() => h.classList.remove('flash'), 420);
    }
  });
}

function checkEnd() {
  const p0empty = G.board.slice(0, 9).every(x => !x);
  const p1empty = G.board.slice(9).every(x => !x);
  if (G.score[0] >= 81 || G.score[1] >= 81 || p0empty || p1empty) {
    // Sweep remaining stones to the player who still has holes
    for (let i = 0; i < 9;  i++) { G.score[0] += G.board[i]; G.board[i] = 0; }
    for (let i = 9; i < 18; i++) { G.score[1] += G.board[i]; G.board[i] = 0; }
    if (G.gameMode === 'pvp' && G.playerIdx === 0) broadcastGameState();
    updateScoreUI(); renderBoard();
    setTimeout(showWin, 700);
    return true;
  }
  return false;
}

// ── HOST BROADCASTS FULL STATE ─────────────────────────────

function broadcastGameState() {
  bgame('GAME_STATE', {
    board:   [...G.board],
    score:   [...G.score],
    p0turn:  G.p0turn,
  });
}

// Apply received state (challenger side)
function applyGameState(msg) {
  G.board   = [...msg.board];
  G.score   = [...msg.score];
  G.p0turn  = msg.p0turn;
  G.isAnimating = false;
  if (!checkEnd()) renderBoard();
}

// ── AI ─────────────────────────────────────────────────────

function aiTurn() {
  // AI is player 1 (holes 9-17)
  const valid = [];
  for (let i = 9; i < 18; i++) if (G.board[i]) valid.push(i);
  if (!valid.length) { checkEnd(); return; }

  // Heuristic: prefer capturing moves
  let move = null;
  for (const m of valid) {
    const land = (m + G.board[m] - 1) % 18;
    if (land < 9 && (G.board[land] + 1) % 2 === 0) { move = m; break; }
  }
  if (move === null) move = valid[Math.floor(Math.random() * valid.length)];

  G.isAnimating = true;
  runDistribute(move, false, () => {  // false = p1 (AI) move
    G.p0turn = true; // back to player
    G.isAnimating = false;
    if (!checkEnd()) renderBoard();
  });
}

// ── WIN ─────────────────────────────────────────────────────

function showWin() {
  const myS = G.score[G.playerIdx], oppS = G.score[1 - G.playerIdx];
  const botName = qs('#gb-bot-name').textContent;
  const topName = qs('#gb-top-name').textContent;
  let emoji, title;
  if (myS > oppS)       { emoji = '🏆'; title = t('youWin'); }
  else if (oppS > myS)  { emoji = '😔'; title = G.gameMode === 'ai' ? t('aiWins') : G.opponentName + t('wins'); }
  else                  { emoji = '🤝'; title = t('draw'); }
  qs('#win-emoji').textContent = emoji;
  qs('#win-title').textContent = title;
  qs('#wv1').textContent = myS;  qs('#wv2').textContent = oppS;
  qs('#wn1').textContent = botName; qs('#wn2').textContent = topName;
  qs('#win-overlay').classList.add('show');
}

// ── GAME SCREEN BINDINGS ───────────────────────────────────

function bindGame() {
  qs('#btn-quit').addEventListener('click', () => {
    if (G.gameMode === 'pvp') { bgame('PLAYER_LEFT', {}); leaveRoomSilent(); }
    enterLobby();
  });
  qs('#btn-again').addEventListener('click', () => {
    qs('#win-overlay').classList.remove('show');
    G.gameMode === 'ai' ? startAIGame() : enterLobby();
  });
  qs('#btn-lobby').addEventListener('click', () => {
    qs('#win-overlay').classList.remove('show');
    if (G.gameMode === 'pvp') leaveRoomSilent();
    enterLobby();
  });
  qs('#chat-collapse').addEventListener('click', () => {
    const c = qs('#chat-col');
    c.classList.toggle('collapsed');
    qs('#chat-collapse').textContent = c.classList.contains('collapsed') ? '+' : '−';
  });
  bindChat('g-input', 'g-send', 'g-msgs');
}

function leaveRoomSilent() {
  const room = S.currentRoom; if (!room) return;
  let r = getRoom(room.id);
  if (r) {
    r.players = r.players.filter(p => p.id !== S.userId);
    if (!r.players.length) { deleteRoom(r.id); blobby('ROOM_DELETED', { roomId: r.id }); }
    else { r.status = 'waiting'; saveRoom(r); blobby('ROOM_UPDATED', { room: r }); }
  }
  S.currentRoom = null; gameBC?.close(); gameBC = null;
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
