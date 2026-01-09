
(function(){
  const categorySelect = document.getElementById('quizCategory');
  const subcategorySelect = document.getElementById('quizSubcategory');
  const startBtn = document.getElementById('goToIntroBtn');
  const statusEl = document.getElementById('quizStatus');

  fetch('data/quiz_questions.json')
    .then(r => r.json())
    .then(data => { init(data); })
    .catch(e => { statusEl.textContent = 'Failed to load questions.'; console.error(e); });

  function init(allData){
    categorySelect.innerHTML = '';
    Object.keys(allData).forEach(cat => { const opt = document.createElement('option'); opt.value = cat; opt.textContent = cat.replace(/_/g,' '); categorySelect.appendChild(opt); });
    populateSubcategories(allData, categorySelect.value || Object.keys(allData)[0]);
    categorySelect.addEventListener('change', () => populateSubcategories(allData, categorySelect.value));

    startBtn.addEventListener('click', () => {
      const cat = categorySelect.value; const sub = subcategorySelect.value;
      window.location.href = `data/intro/${sub}.html`;
    });
  }

  function populateSubcategories(allData, cat){
    subcategorySelect.innerHTML = '';
    const subs = Array.isArray(allData[cat]) ? [] : Object.keys(allData[cat] || {});
    subs.forEach(sub => { const opt = document.createElement('option'); opt.value=sub; opt.textContent=sub.replace(/_/g,' '); subcategorySelect.appendChild(opt); });
  }
})();
