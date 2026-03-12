# Lucky Slot Game

A lightweight Flash-style 3×3 slot machine built with:

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- HTML5 Canvas

## Run in VS Code

### Option 1: Open directly (quickest)
1. Open this folder in VS Code.
2. In the Explorer, right-click `index.html`.
3. Click **Open with Live Server** (recommended) or open it directly in your browser.

> If you do not have Live Server installed, install the VS Code extension **Live Server** by Ritwick Dey.

### Option 2: Run local server from VS Code terminal
1. Open the project in VS Code.
2. Open terminal (**Terminal → New Terminal**).
3. Run:
   ```bash
   python3 -m http.server 4173
   ```
4. Open `http://localhost:4173` in your browser.

## Gameplay Rules

- Start with **100 coins**
- Each spin costs **10 coins**
- Reels spin for **2 seconds**
- Symbols: Cherry, Lemon, Star, Bell, Money
- Win when any row has **3 matching symbols**
- Win reward: **+50 coins**

## Files

- `index.html` – structure/UI shell
- `style.css` – visuals, responsive layout, animation styles
- `script.js` – game logic, canvas rendering, spin + win checks
