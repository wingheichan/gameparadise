
(function(){
  const tabs = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.tab');
  const yearEl = document.getElementById('year');
  const themeToggle = document.getElementById('themeToggle');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  tabs.forEach(btn => btn.addEventListener('click', (e) => {
    const target = btn.dataset.tab;
    if (!target) return; // ignore external links
    e.preventDefault();
    tabs.forEach(b => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));
    sections.forEach(sec => { const active = sec.id === target; sec.hidden = !active; sec.classList.toggle('active', active); });
  }));

  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'light') document.body.classList.add('light');
  if (themeToggle) themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });
})();
