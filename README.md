```text
learning-games/
├─ index.html                 # Home with two tabs: Quiz and Memory
├─ quiz.html                  # Quiz play page (after intro page)
├─ css/
│  └─ styles.css             # Global styles (layout, colors, buttons)
├─ js/
│  ├─ main.js                # Theme toggle + tab navigation
│  ├─ quiz-home.js           # Populates quiz Category/Subcategory + routes to intro page
│  ├─ intro-loader.js        # Renders preview on intro pages + routes to quiz.html
│  ├─ quiz.js                # Quiz engine (timers, scoring, green/red feedback)
│  └─ memory.js              # Memory engine (Category/Subcategory, Difficulty, Mode, timers, scoring)
├─ data/
│  ├─ quiz_questions.json    # Nested quiz data: category → subcategory → questions[]
│  ├─ memory_cards.json      # Nested memory data: category → subcategory → pairs[]
│  └─ intro/                 # Quiz intro pages, one per subcategory
│     ├─ addition.html
│     ├─ subtraction.html
│     ├─ multiplication.html
│     ├─ lesson_1.html
│     ├─ lesson_2.html
│     └─ lesson_3.html
└─ assets/
   └─ favicon.svg
```

   


➕ How to Add Additional Subcategories
A) Add a quiz subcategory
```text
{
  "vocab_es_en": {
    "lesson_4": [
      { "question": "Translate: 'árbol'", "options": ["tree", "flower", "grass", "leaf"], "answer": "tree" },
      { "question": "Translate: 'cielo'", "options": ["sky", "ground", "sea", "rain"], "answer": "sky" }
    ]
  }
}
```
2. Create an intro page for the new subcategory:
Add data/intro/lesson_4.html. You can duplicate an existing intro page and change the title/description.
Minimal template:
```text
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Vocab ES→EN — Lesson 4 — Quiz Intro</title>
  ../../css/styles.css
</head>
<body>
  <header class="site-header"><h1>Vocab ES→EN — Lesson 4 — Quiz Intro</h1></header>
  <main>
    <section class="panel">
      <h2>How this quiz works</h2>
      <p>Pick the correct translations. Timer resets each question.</p>
    </section>
    <section class="panel">
      <h3>Example questions</h3>
      <div id="previewList"></div>
      <div class="actions"><button id="beginQuizBtn" class="primary">Start the quiz</button></div>
    </section>
  </main>
  ../../js/intro-loader.js</script>
</body>
</html>
```


3. Map the new intro page in js/intro-loader.js
Add a mapping entry so the preview and start routing work:
```text
const MAP = {
  // existing...
  'lesson_4': { cat: 'vocab_es_en', sub: 'lesson_4' }
};
```


4. Done: The Quiz tab will list lesson_4 automatically (populated from JSON), and Start Quiz opens data/intro/lesson_4.html. The Start the quiz button on that page routes to quiz.html?cat=vocab_es_en&sub=lesson_4.



B) Add a memory subcategory


Edit data/memory_cards.json
Under your category, add a new subcategory key with an array of pairs:
```text
{
  "vocab_es_en": {
    "lesson_3": [
      { "a": "libro", "b": "book" },
      { "a": "maestra", "b": "teacher" }
    ]
  }
}
```


2. No extra HTML needed:
The Memory tab automatically displays the new subcategory (populated from JSON). Select Difficulty/Mode and click Start Game.


3. If you want a separate Memory page (optional):
You can move the Memory UI to memory.html and link to it from index.html. Just make sure the IDs remain the same and js/memory.js is included.

Edit data/quiz_questions.json
Under your category (e.g., vocab_es_en), add a new subcategory key with an array of question objects:
