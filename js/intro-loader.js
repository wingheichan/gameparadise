
(function(){
  const file = location.pathname.split('/').pop().replace('.html','');
  const MAP = {
    'addition':       { cat: 'math',        sub: 'addition' },
    'subtraction':    { cat: 'math',        sub: 'subtraction' },
    'multiplication': { cat: 'math',        sub: 'multiplication' },
    'lesson_1':       { cat: 'vocab_es_en', sub: 'lesson_1' },
    'lesson_2':       { cat: 'vocab_es_en', sub: 'lesson_2' },
    'lesson_3':       { cat: 'vocab_es_en', sub: 'lesson_3' }
  };
  const sel = MAP[file];
  const previewList = document.getElementById('previewList');
  const beginBtn = document.getElementById('beginQuizBtn');

  fetch('../../data/quiz_questions.json')
    .then(r => r.json())
    .then(data => {
      let questions = [];
      if (data[sel.cat]) {
        const sub = data[sel.cat][sel.sub];
        if (Array.isArray(sub)) questions = sub;
      }
      if (!questions.length) { previewList.innerHTML = '<em>No questions in this subcategory yet.</em>'; return; }
      const ul = document.createElement('ul');
      ul.style.listStyle = 'none'; ul.style.padding = '0'; ul.style.display = 'grid'; ul.style.gap = '.5rem';
      questions.slice(0, 20).forEach(q => {
        const li = document.createElement('li');
        li.innerHTML = `<div><strong>Q:</strong> ${q.question}</div><div><strong>Answer:</strong> ${q.answer}</div>`;
        li.style.border = '1px solid var(--border)'; li.style.borderRadius = '.5rem'; li.style.padding = '.5rem';
        ul.appendChild(li);
      });
      previewList.appendChild(ul);
    })
    .catch(err => { previewList.textContent = 'Failed to load preview: ' + err.message; });

  beginBtn && beginBtn.addEventListener('click', () => {
    const params = new URLSearchParams({ cat: MAP[file].cat, sub: MAP[file].sub });
    location.href = `../../quiz.html?${params.toString()}`;
  });
})();
