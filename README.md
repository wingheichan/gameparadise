📁 Project Structure
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


   
