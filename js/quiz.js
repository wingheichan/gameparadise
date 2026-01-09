
(function(){
  const params = new URLSearchParams(location.search);
  const catParam = params.get('cat');
  const subParam = params.get('sub');

  const questionEl = document.getElementById('questionText');
  const answersList = document.getElementById('answersList');
  const progressEl = document.getElementById('quizProgress');
  const scoreEl = document.getElementById('quizScore');
  const timerEl = document.getElementById('questionTimer');
  const statusEl = document.getElementById('quizStatus');
  const nextBtn = document.getElementById('nextQuestionBtn');
  const restartBtn = document.getElementById('restartQuizBtn');

  let allData = {};
  let qTimerId = null;

  const state = { questions: [], current: 0, correct: 0, totalTime: 0, totalScore: 0, qStart: null };

  fetch('data/quiz_questions.json')
    .then(r => r.json())
    .then(data => { allData = data; init(); })
    .catch(e => { statusEl.textContent = 'Failed to load questions.'; console.error(e); });

  function getSelected(){
    let arr = [];
    if (catParam && subParam && allData[catParam] && Array.isArray(allData[catParam][subParam])) {
      arr = [...allData[catParam][subParam]];
    } else {
      statusEl.textContent = 'Invalid quiz selection.';
    }
    return arr;
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }

  function init(){
    clearInterval(qTimerId);
    state.questions = getSelected();
    if (!state.questions.length) return;
    state.questions = shuffle(state.questions);
    state.current = 0; state.correct = 0; state.totalTime = 0; state.totalScore = 0; statusEl.textContent = 'Good luck!';
    renderQuestion();
  }

  function startQuestionTimer(){
    clearInterval(qTimerId);
    state.qStart = Date.now();
    timerEl.textContent = 'Q Time: 0s';
    qTimerId = setInterval(() => {
      const secs = Math.floor((Date.now() - state.qStart)/1000);
      timerEl.textContent = `Q Time: ${secs}s`;
    }, 200);
  }

  function stopQuestionTimer(){
    const secs = Math.max(0, Math.round((Date.now() - (state.qStart||Date.now()))/1000));
    clearInterval(qTimerId);
    qTimerId = null;
    return secs;
  }

  function renderQuestion(){
    const q = state.questions[state.current];
    questionEl.textContent = q.question;
    answersList.innerHTML='';
    const options = shuffle([...q.options]);
    options.forEach(opt => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleAnswer(btn, opt === q.answer));
      li.appendChild(btn);
      answersList.appendChild(li);
    });
    progressEl.textContent = `Question ${state.current+1} of ${state.questions.length}`;
    scoreEl.textContent = `Correct: ${state.correct}`;
    nextBtn.disabled = true;
    startQuestionTimer();
  }

  function handleAnswer(btn, isCorrect){
    const q = state.questions[state.current];
    const secs = stopQuestionTimer();
    state.totalTime += secs;
    const timeBonus = Math.max(0, 51 - secs);

    [...answersList.querySelectorAll('.answer-btn')].forEach(b => {
      b.disabled = true;
      if (b.textContent === q.answer) b.classList.add('correct');
    });
    if (isCorrect){ state.correct++; btn.classList.add('correct'); statusEl.textContent='Correct!'; state.totalScore += (50 + timeBonus); }
    else { btn.classList.add('incorrect'); statusEl.textContent='Not quite.'; state.totalScore += timeBonus; }

    scoreEl.textContent = `Correct: ${state.correct}`;
    nextBtn.disabled = false;
  }

  function nextQuestion(){
    if (state.current < state.questions.length - 1){ state.current++; renderQuestion(); }
    else { finishQuiz(); }
  }

  function finishQuiz(){
    const finalScore = Math.max(0, Math.round(state.totalScore));
    statusEl.textContent = `Finished! Correct: ${state.correct}/${state.questions.length} • Total Time: ${state.totalTime}s • Score: ${finalScore}`;
    nextBtn.disabled = true; restartBtn.hidden = false;
  }

  nextBtn.addEventListener('click', nextQuestion);
  restartBtn.addEventListener('click', init);
})();
