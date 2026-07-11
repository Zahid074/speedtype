(function(){
  "use strict";

  /* ---------------- Level data ---------------- */
  /* Each level has a pool of passages — one is picked at random every time
     the level loads (first visit, restart, retry, or advancing to it). */
  const LEVELS = [
    {
      id:1, name:"Warm Up", focus:"Lowercase words",
      minWPM:20, minAcc:85,
      texts:[
        "the quick brown fox jumps over the lazy dog and runs into the forest to find some food before the sun goes down and the night grows cold and quiet",
        "she walked along the beach and picked up shells while the waves rolled in and the birds flew low over the water looking for fish near the shore",
        "we packed our bags and left early in the morning to catch the train before the crowd arrived and the platform grew busy with tired travelers",
        "the old dog slept by the fire while the children played games on the floor and their mother read a book near the window in the quiet house"
      ]
    },
    {
      id:2, name:"Sentences", focus:"Capitals & full stops",
      minWPM:30, minAcc:88,
      texts:[
        "Learning to type well takes patience. Start slowly and let your fingers memorize the keyboard. Speed will come naturally once accuracy feels comfortable and automatic.",
        "Every morning she made a cup of tea and sat by the window. The city was quiet at that hour. She liked watching the sun rise over the rooftops.",
        "Good habits are built one small step at a time. Missing a day is not failure. Getting back on track the next day is what actually matters most.",
        "The library closes at nine on weekdays. Students often stay until the last minute. Many say the quiet reading room is the best place to focus."
      ]
    },
    {
      id:3, name:"Punctuation", focus:"Commas & apostrophes",
      minWPM:40, minAcc:90,
      texts:[
        "It's easy to rush, but rushing often leads to mistakes; and mistakes, in turn, slow you down more than typing carefully ever would. Don't underestimate a calm, steady pace.",
        "I don't think it's fair, honestly, that we can't reschedule; still, we'll manage — we always do, one way or another, don't we?",
        "She said she'd call later, but she didn't; and by the time we'd realized, it was already too late to change our plans for the evening.",
        "There's no need to worry, really — we've handled harder problems before, and we'll handle this one too, as long as we don't panic."
      ]
    },
    {
      id:4, name:"Numbers & Symbols", focus:"Mixed characters",
      minWPM:50, minAcc:92,
      texts:[
        "Invoice #4521 totals $1,289.75 (due 07/15) — a 12% discount applies if paid within 10 days; otherwise a 3.5% late fee is added after the 30-day grace period.",
        "The meeting is at 9:30 AM in Room #204 (2nd floor). Bring 3 copies of the report & a laptop — Wi-Fi password is set to expire after 24 hrs.",
        "Order #7789 shipped on 03/22 — total: $459.00 (incl. 8% tax). Track it at ref-code XJ-991 or call +1-800-555-0199 between 9 AM & 6 PM.",
        "Q3 revenue rose 14.6% to $2.1M, while costs fell by ~7% (from $980K to $912K) — a net margin gain of roughly 3.2 points vs. last quarter."
      ]
    },
    {
      id:5, name:"Pro Challenge", focus:"Everything combined",
      minWPM:60, minAcc:95,
      texts:[
        "Professional typists often exceed 80 WPM at 97%+ accuracy — a rare mix of muscle memory & discipline. Consider: 10,000 hours isn't a promise, but ~200 deliberate hours (30 min/day) reliably moves most typists from 40 to 70+ WPM.",
        "By Q4 2025, the team had shipped 3 major releases (v2.0, v2.1, v2.2) — each cutting load time by ~15%. Users weren't shy about it: 'finally, something that doesn't lag,' one review read; ratings jumped from 3.6 to 4.4 stars.",
        "The contract, signed on 11/03/24, guarantees a 5-year term at $18,500/mo — renewable if neither party objects 60 days prior. Clause 4.2(b) notes a 2% annual increase, capped at 6% over the contract's life.",
        "Dr. Alvarez's study (n=1,204) found that participants who practiced 20 min/day for 6 weeks improved WPM by 34% on average — though accuracy gains, at just 4.1%, weren't statistically significant (p=0.08)."
      ]
    }
  ];

  function randomText(level){
    const pool = level.texts;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  let unlockedLevel = 1;   // highest level the user may attempt
  let currentLevel = 1;
  let proEarned = false;

  let startTime = null;
  let timerHandle = null;
  let finished = false;
  let typedChars = [];     // per-position: true=correct, false=incorrect, null=not yet typed
  let target = "";

  /* ---------------- Elements ---------------- */
  const el = {
    keycaps: document.getElementById('keycaps'),
    proIndicator: document.getElementById('pro-indicator'),
    statWpm: document.getElementById('stat-wpm'),
    statAcc: document.getElementById('stat-acc'),
    statTime: document.getElementById('stat-time'),
    statErr: document.getElementById('stat-err'),
    levelTitle: document.getElementById('level-title'),
    levelTarget: document.getElementById('level-target'),
    textDisplay: document.getElementById('text-display'),
    input: document.getElementById('type-input'),
    btnRestart: document.getElementById('btn-restart'),
    result: document.getElementById('result'),
    resultHeadline: document.getElementById('result-headline'),
    resWpm: document.getElementById('res-wpm'),
    resAcc: document.getElementById('res-acc'),
    resTime: document.getElementById('res-time'),
    resNote: document.getElementById('res-note'),
    btnRetry: document.getElementById('btn-retry'),
    btnNext: document.getElementById('btn-next'),
    proBanner: document.getElementById('pro-banner'),
    tabPlay: document.getElementById('tab-play'),
    tabInfo: document.getElementById('tab-info'),
    viewPlay: document.getElementById('view-play'),
    viewInfo: document.getElementById('view-info'),
    levelsTable: document.getElementById('levels-table'),
  };

  /* ---------------- Tabs ---------------- */
  el.tabPlay.addEventListener('click', () => switchTab('play'));
  el.tabInfo.addEventListener('click', () => switchTab('info'));
  function switchTab(which){
    const playActive = which === 'play';
    el.tabPlay.classList.toggle('active', playActive);
    el.tabInfo.classList.toggle('active', !playActive);
    el.viewPlay.classList.toggle('active', playActive);
    el.viewInfo.classList.toggle('active', !playActive);
  }

  /* ---------------- Build keycaps ---------------- */
  function renderKeycaps(){
    el.keycaps.innerHTML = '';
    LEVELS.forEach(lv => {
      const btn = document.createElement('div');
      const locked = lv.id > unlockedLevel;
      const cleared = lv.id < unlockedLevel || (lv.id === unlockedLevel && lv.id === 5 && proEarned);
      btn.className = 'keycap' + (locked ? ' locked' : '') + (lv.id === currentLevel ? ' current' : '') + (cleared ? ' cleared' : '');
      btn.innerHTML = lv.id + '<small>LVL</small>';
      btn.title = locked ? 'Clear the previous level to unlock' : 'Level ' + lv.id + ' — ' + lv.name;
      if(!locked){
        btn.addEventListener('click', () => loadLevel(lv.id));
      }
      el.keycaps.appendChild(btn);
    });
    el.proIndicator.textContent = proEarned ? '🏆 PRO badge earned' : '☆ PRO badge not earned yet';
    el.proIndicator.classList.toggle('earned', proEarned);
  }

  /* ---------------- Build info table ---------------- */
  function renderLevelsTable(){
    el.levelsTable.innerHTML = LEVELS.map(lv =>
      `<tr><td class="name">Level ${lv.id}</td><td>${lv.focus}</td><td>${lv.minWPM}</td><td>${lv.minAcc}%</td></tr>`
    ).join('');
  }

  /* ---------------- Load / reset a level ---------------- */
  function loadLevel(id){
    currentLevel = id;
    const lv = LEVELS[id-1];
    target = randomText(lv);
    typedChars = new Array(target.length).fill(null);
    startTime = null;
    finished = false;
    if(timerHandle){ clearInterval(timerHandle); timerHandle = null; }

    el.levelTitle.textContent = `Level ${lv.id} — ${lv.name}`;
    el.levelTarget.textContent = `Target: ${lv.minWPM} WPM · ${lv.minAcc}% accuracy`;
    el.result.classList.remove('show');
    el.proBanner.style.display = 'none';
    el.btnNext.style.display = 'none';

    el.statWpm.textContent = '0';
    el.statAcc.textContent = '100%';
    el.statTime.textContent = '0.0s';
    el.statErr.textContent = '0';

    el.input.value = '';
    renderText();
    renderKeycaps();
    focusInput();
  }

  function focusInput(){
    el.input.disabled = false;
    el.input.value = '';
    el.input.focus();
  }

  /* ---------------- Render passage ---------------- */
  function renderText(){
    let html = '';
    for(let i=0;i<target.length;i++){
      const ch = target[i];
      const display = ch === ' ' ? ' ' : escapeHtml(ch);
      let cls = 'ch';
      if(typedChars[i] === true) cls += ' correct';
      else if(typedChars[i] === false) cls += ' incorrect';
      const isCurrent = i === firstUntypedIndex();
      if(isCurrent) cls += ' current';
      html += `<span class="${cls}">${display}</span>`;
    }
    el.textDisplay.innerHTML = html;
  }

  function firstUntypedIndex(){
    for(let i=0;i<typedChars.length;i++){
      if(typedChars[i] === null) return i;
    }
    return typedChars.length;
  }

  function escapeHtml(s){
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ---------------- Input handling ---------------- */
  el.textDisplay.addEventListener('click', focusInput);

  el.input.addEventListener('keydown', (e) => {
    if(finished) return;

    if(e.key === 'Backspace'){
      e.preventDefault();
      const idx = firstUntypedIndex() - 1;
      if(idx >= 0){
        typedChars[idx] = null;
        renderText();
      }
      return;
    }

    // ignore modifier / control keys, allow single printable characters
    if(e.key.length !== 1) return;
    e.preventDefault();

    if(startTime === null){
      startTime = performance.now();
      timerHandle = setInterval(updateLiveStats, 100);
    }

    const idx = firstUntypedIndex();
    if(idx >= target.length) return;

    typedChars[idx] = (e.key === target[idx]);
    renderText();
    updateLiveStats();

    if(firstUntypedIndex() >= target.length){
      finishLevel();
    }
  });

  // keep the hidden input focused whenever the play view is active
  document.addEventListener('click', (e) => {
    if(el.viewPlay.classList.contains('active') && !finished){
      if(e.target.closest('.panel')) focusInput();
    }
  });

  /* ---------------- Live stats ---------------- */
  function computeStats(){
    const typedCount = typedChars.filter(c => c !== null).length;
    const correct = typedChars.filter(c => c === true).length;
    const incorrect = typedChars.filter(c => c === false).length;
    const elapsedMs = startTime ? (performance.now() - startTime) : 0;
    const minutes = Math.max(elapsedMs / 60000, 1/600); // avoid divide-by-near-zero
    const wpm = startTime ? Math.round((correct/5) / minutes) : 0;
    const accuracy = typedCount > 0 ? Math.round((correct/typedCount)*100) : 100;
    return { typedCount, correct, incorrect, elapsedMs, wpm, accuracy };
  }

  function updateLiveStats(){
    const s = computeStats();
    el.statWpm.textContent = s.wpm;
    el.statAcc.textContent = s.accuracy + '%';
    el.statTime.textContent = (s.elapsedMs/1000).toFixed(1) + 's';
    el.statErr.textContent = s.incorrect;
  }

  /* ---------------- Finish level ---------------- */
  function finishLevel(){
    finished = true;
    if(timerHandle){ clearInterval(timerHandle); timerHandle = null; }
    el.input.disabled = true;

    const s = computeStats();
    const lv = LEVELS[currentLevel-1];
    const passed = s.wpm >= lv.minWPM && s.accuracy >= lv.minAcc;

    el.result.classList.add('show');
    el.resultHeadline.textContent = passed ? '✓ Level cleared' : '✗ Target not reached';
    el.resultHeadline.className = 'headline ' + (passed ? 'pass' : 'fail');
    el.resWpm.textContent = s.wpm;
    el.resAcc.textContent = s.accuracy + '%';
    el.resTime.textContent = (s.elapsedMs/1000).toFixed(1) + 's';

    if(passed){
      el.resNote.textContent = `You beat the target of ${lv.minWPM} WPM at ${lv.minAcc}% accuracy.`;
      if(currentLevel === unlockedLevel && currentLevel < 5){
        unlockedLevel = currentLevel + 1;
      }
      if(currentLevel === 5){
        proEarned = true;
        el.proBanner.style.display = 'flex';
      }
      if(currentLevel < 5){
        el.btnNext.style.display = 'inline-block';
      }
    } else {
      el.resNote.textContent = `This level needs ${lv.minWPM} WPM and ${lv.minAcc}% accuracy. You can retry as many times as you like.`;
    }

    renderKeycaps();
  }

  el.btnRetry.addEventListener('click', () => loadLevel(currentLevel));
  el.btnRestart.addEventListener('click', () => loadLevel(currentLevel));
  el.btnNext.addEventListener('click', () => {
    if(currentLevel < 5) loadLevel(currentLevel + 1);
  });

  /* ---------------- Init ---------------- */
  renderLevelsTable();
  loadLevel(1);
})();
