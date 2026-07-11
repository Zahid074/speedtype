# ⌨️ SpeedType — Typing Speed Trainer

A five-level typing speed test built with plain **HTML, CSS & JavaScript** — no frameworks, no build tools, no dependencies. Clear all five levels to earn the **Pro** badge.

## Live

[![Live Demo](https://img.shields.io/badge/Live-Demo-f2b134?style=for-the-badge&logo=googlechrome&logoColor=white)](https://zahid074.github.io/speedtype/)

https://zahid074.github.io/speedtype/

---

## About

SpeedType tests and trains your typing speed and accuracy through five progressively harder levels — from simple lowercase words to a mixed paragraph of numbers, symbols, and punctuation. Each level draws from a small pool of passages, so retrying or reloading a level gives you a fresh piece of text at the same difficulty.

## Features

- **5 levels**, each unlocking only after the previous one is cleared
- **Live stats** while you type — WPM, accuracy, elapsed time, error count
- **Randomized passages** — every level has multiple texts, picked at random on each load
- Character-by-character feedback (correct / incorrect / current caret)
- A **Pro badge** awarded for clearing Level 5's target
- A built-in **"How to use" page** explaining the scoring formula and level targets
- Fully responsive, keyboard-driven, zero dependencies

## Level targets

| Level | Focus                     | Min WPM | Min Accuracy |
|-------|----------------------------|---------|--------------|
| 1     | Lowercase words             | 20      | 85%          |
| 2     | Capitals & full stops       | 30      | 88%          |
| 3     | Commas & apostrophes        | 40      | 90%          |
| 4     | Numbers & symbols           | 50      | 92%          |
| 5     | Everything combined (Pro)   | 60      | 95%          |

**Scoring formulas:**

```
WPM      = (correct characters ÷ 5) ÷ (time in minutes)
Accuracy = correct characters ÷ total characters typed × 100
```

## File structure

```
speedtype/
├── index.html   → page structure
├── style.css    → all styling
├── script.js    → level data, typing logic, stats
└── README.md    → this file
```

## Run it locally

No build step needed — just open the file:

```bash
git clone https://github.com/zahid074/speedtype.git
cd speedtype
open index.html      # macOS
# or just double-click index.html
```

## Deploy it yourself (GitHub Pages)

1. Create a new GitHub repository (e.g. `speedtype`) and push these three files (`index.html`, `style.css`, `script.js`) to the `main` branch — keep them in the same folder, at the repo root.
2. Go to **Settings → Pages** in your repository.
3. Under **Build and deployment → Source**, select **Deploy from a branch**.
4. Under **Branch**, select `main` and folder `/ (root)`, then click **Save**.
5. Wait 1–2 minutes, then refresh the Pages settings tab — your live URL will appear at the top:
   `https://zahid074.github.io/speedtype/`

## Tech stack

Plain HTML5, CSS3, and vanilla JavaScript (ES6). Fonts loaded from Google Fonts (`JetBrains Mono`, `Inter`).

## License

Free to use, modify, and share.
