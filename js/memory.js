
(function(){
  const categorySelect    = document.getElementById('memoryCategory');
  const subcategorySelect = document.getElementById('memorySubcategory');
  const difficultySelect  = document.getElementById('memoryDifficulty');
  const modeSelect        = document.getElementById('memoryMode');
  const previewInput      = document.getElementById('previewDuration');
  const startBtn          = document.getElementById('startMemoryBtn');
  const statusEl          = document.getElementById('memoryStatus');
  const grid              = document.getElementById('grid');
  const movesEl           = document.getElementById('movesCount');
  const timerEl           = document.getElementById('timer');
  const matchedEl         = document.getElementById('matchedPairs');
  const scoreEl           = document.getElementById('memoryScore');
  const restartBtn        = document.getElementById('restartMemoryBtn');

  let memoryData = {};
  const state = { deck: [], flipped: [], matched: new Set(), moves: 0, seconds: 0, timerId: null, mode: 'closed', previewTimeoutId: null, totalTime: 0, score: 0, pairStart: null };

  function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }
  function gridSize(diff){ switch(diff){ case 'easy': return [4,4]; case 'medium': return [5,4]; case 'hard': return [6,6]; default: return [4,4]; } }

  fetch('data/memory_cards.json')
    .then(r => r.json())
    .then(data => { memoryData = data; init(); })
    .catch(e => { statusEl.textContent = 'Failed to load cards.'; console.error(e); });

  function init(){
    populateCategories();
    populateSubcategories(categorySelect.value || Object.keys(memoryData)[0]);
    categorySelect.addEventListener('change', () => populateSubcategories(categorySelect.value));
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
  }

  function populateCategories(){
    categorySelect.innerHTML = '';
    Object.keys(memoryData).forEach(cat => { const opt = document.createElement('option'); opt.value = cat; opt.textContent = cat.replace(/_/g,' '); categorySelect.appendChild(opt); });
  }
  function populateSubcategories(cat){
    subcategorySelect.innerHTML = '';
    const subs = Object.keys(memoryData[cat] || {});
    subs.forEach(sub => { const opt = document.createElement('option'); opt.value=sub; opt.textContent=sub.replace(/_/g,' '); subcategorySelect.appendChild(opt); });
  }

  function getSelectedPairs(){
    const cat = categorySelect.value;
    const sub = subcategorySelect.value;
    const arr = memoryData?.[cat]?.[sub];
    if (!Array.isArray(arr) || arr.length === 0){ statusEl.textContent = 'No pairs available for this selection.'; return []; }
    return arr;
  }

  function buildDeck(diff){
    const [cols, rows] = gridSize(diff);
    const total = cols * rows;
    if (total % 2 !== 0) throw new Error('Grid size must be even.');
    const neededPairs = total / 2;

    const sourcePairs = getSelectedPairs();
    const selected = shuffle([...sourcePairs]).slice(0, neededPairs);
    const deck = [];
    selected.forEach((p, idx) => { deck.push({ id:`p${idx}-a`, pairId:idx, label:p.a }); deck.push({ id:`p${idx}-b`, pairId:idx, label:p.b }); });
    return shuffle(deck);
  }

  function renderGrid(diff){
    grid.className = `grid ${diff}`;
    grid.innerHTML = '';
    state.deck.forEach(card => {
      const btn = document.createElement('button');
      btn.className = 'card-tile';
      btn.setAttribute('data-id', card.id);
      if (state.mode === 'always-open' || state.mode === 'preview') { btn.textContent = card.label; btn.classList.add('flipped'); }
      else { btn.textContent = '❓'; }
      btn.addEventListener('click', () => onCardClick(btn, card));
      grid.appendChild(btn);
    });
  }

  function updateStats(){
    movesEl.textContent = `Moves: ${state.moves}`;
    matchedEl.textContent = `Matched: ${state.matched.size}`;
    scoreEl.textContent = `Score: ${Math.max(0, Math.round(state.score))}`;
  }

  function startPairTimer(){
    clearInterval(state.timerId);
    state.seconds = 0;
    state.pairStart = Date.now();
    timerEl.textContent = 'Pair Time: 0s';
    state.timerId = setInterval(() => {
      state.seconds = Math.floor((Date.now() - state.pairStart)/1000);
      timerEl.textContent = `Pair Time: ${state.seconds}s`;
    }, 200);
  }

  function stopPairTimer(){
    const secs = Math.max(0, Math.round((Date.now() - (state.pairStart||Date.now()))/1000));
    clearInterval(state.timerId);
    state.timerId = null;
    return secs;
  }

  function onCardClick(btn, card){
    if (state.mode === 'preview' && btn.classList.contains('preview-lock')) return;
    if (state.matched.has(card.pairId)) return;

    if (state.mode === 'closed' || state.mode === 'preview') { btn.classList.add('flipped'); btn.textContent = card.label; }
    if (state.mode === 'always-open') { btn.classList.add('flipped'); }

    if (state.flipped.some(c => c.id === card.id)) return;
    state.flipped.push(card);

    if (state.flipped.length === 2){
      state.moves++; updateStats();
      const [c1, c2] = state.flipped;
      const match = c1.pairId === c2.pairId && c1.id !== c2.id;
      if (match){
        const secs = stopPairTimer();
        state.totalTime += secs;
        const timeBonus = Math.max(0, 51 - secs);
        state.score += (50 + timeBonus); // per matched pair

        state.matched.add(c1.pairId);
        [...grid.querySelectorAll('.card-tile')].forEach(el => { const id = el.getAttribute('data-id'); if (id === c1.id || id === c2.id){ el.classList.add('matched'); el.textContent = labelForId(id); el.disabled = true; } });
        statusEl.textContent = 'Matched!';
        updateStats();
        state.flipped = [];
        checkWin();
        if (state.matched.size * 2 !== state.deck.length) startPairTimer(); // start timer for next pair
      } else {
        statusEl.textContent = 'Try again…';
        setTimeout(() => {
          if (state.mode === 'closed' || state.mode === 'preview') {
            [...grid.querySelectorAll('.card-tile.flipped:not(.matched)')].forEach(el => { el.classList.remove('flipped'); el.textContent = '❓'; });
          } else if (state.mode === 'always-open') {
            [...grid.querySelectorAll('.card-tile.flipped:not(.matched)')].forEach(el => { el.classList.remove('flipped'); el.textContent = labelForId(el.getAttribute('data-id')); });
          }
          state.flipped = [];
        }, 700);
      }
    }
  }

  function labelForId(id){ const c = state.deck.find(x => x.id === id); return c ? c.label : ''; }

  function checkWin(){
    if (state.matched.size * 2 === state.deck.length){
      clearInterval(state.timerId);
      statusEl.textContent = `You win! Moves: ${state.moves}, Total Time: ${state.totalTime}s, Score: ${Math.max(0, Math.round(state.score))}`;
      restartBtn.hidden = false;
    }
  }

  function startGame(){
    clearInterval(state.timerId); clearTimeout(state.previewTimeoutId);
    state.mode = modeSelect.value; const diff = difficultySelect.value; const previewSecs = Math.max(5, Math.min(30, parseInt(previewInput.value) || 10));

    statusEl.textContent = 'Good luck!';
    state.deck = buildDeck(diff);
    state.flipped = []; state.matched = new Set(); state.moves = 0; state.totalTime = 0; state.score = 0;
    updateStats(); renderGrid(diff);
    restartBtn.hidden = true;

    if (state.mode === 'preview') {
      [...grid.querySelectorAll('.card-tile')].forEach(el => el.classList.add('preview-lock'));
      state.previewTimeoutId = setTimeout(() => {
        closeAllUnmatched();
        [...grid.querySelectorAll('.card-tile')].forEach(el => el.classList.remove('preview-lock'));
        statusEl.textContent = 'Preview over—start matching!';
        startPairTimer();
      }, previewSecs * 1000);
    } else {
      startPairTimer();
    }
  }
})();
