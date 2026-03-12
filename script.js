/**
 * Lucky Slot game logic.
 * Organized for easy expansion (symbols, paylines, payout tables).
 */
const SYMBOLS = ["🍒", "🍋", "⭐", "🔔", "💰"];
const GRID_SIZE = 3;
const START_COINS = 100;
const SPIN_COST = 10;
const WIN_REWARD = 50;
const SPIN_DURATION_MS = 2000;
const FRAME_MS = 100;

const canvas = document.getElementById("slotCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const coinCount = document.getElementById("coinCount");
const resultMessage = document.getElementById("resultMessage");
const gameShell = document.querySelector(".game-shell");

const state = {
  coins: START_COINS,
  spinning: false,
  displayGrid: createRandomGrid(),
};

/** Creates a grid with random symbols. */
function createRandomGrid() {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => getRandomSymbol())
  );
}

/** Returns one random symbol from the symbol set. */
function getRandomSymbol() {
  const index = Math.floor(Math.random() * SYMBOLS.length);
  return SYMBOLS[index];
}

/** Draws the full 3x3 board on the canvas. */
function drawBoard(grid) {
  const size = canvas.width;
  const cellSize = size / GRID_SIZE;

  ctx.clearRect(0, 0, size, size);

  // Background plate
  ctx.fillStyle = "#0f1625";
  ctx.fillRect(0, 0, size, size);

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const x = col * cellSize;
      const y = row * cellSize;

      // Cell panel
      ctx.fillStyle = "#1a2438";
      ctx.fillRect(x + 4, y + 4, cellSize - 8, cellSize - 8);

      // Cell border
      ctx.strokeStyle = "rgba(255, 200, 87, 0.45)";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 4, y + 4, cellSize - 8, cellSize - 8);

      // Symbol
      ctx.font = `${cellSize * 0.45}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#f4f7fb";
      ctx.fillText(grid[row][col], x + cellSize / 2, y + cellSize / 2 + 2);
    }
  }
}

/** Animates coin counter smoothly to the target value. */
function animateCoinCount(start, end, duration = 420) {
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(start + (end - start) * progress);
    coinCount.textContent = String(value);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/** Sets result text with styling state. */
function setMessage(text, type = "") {
  resultMessage.textContent = text;
  resultMessage.classList.remove("win", "lose");
  if (type) {
    resultMessage.classList.add(type);
  }
}

/** Returns true if any row contains three matching symbols. */
function isWinningGrid(grid) {
  return grid.some((row) => row.every((symbol) => symbol === row[0]));
}

/** Handles a full spin cycle (cost, animation, result, payout). */
function runSpin() {
  if (state.spinning || state.coins < SPIN_COST) {
    if (state.coins < SPIN_COST) {
      setMessage("Not enough coins", "lose");
    }
    return;
  }

  const previousCoins = state.coins;
  state.coins -= SPIN_COST;
  animateCoinCount(previousCoins, state.coins);

  state.spinning = true;
  spinButton.disabled = true;
  gameShell.classList.remove("win");
  setMessage("Spinning...");

  const startTime = performance.now();

  function spinFrame(now) {
    const elapsed = now - startTime;

    // Update symbols in all cells for spinning effect.
    if (elapsed % FRAME_MS < 16) {
      state.displayGrid = createRandomGrid();
    }

    drawBoard(state.displayGrid);

    if (elapsed < SPIN_DURATION_MS) {
      requestAnimationFrame(spinFrame);
      return;
    }

    // Final result grid after spin.
    state.displayGrid = createRandomGrid();
    drawBoard(state.displayGrid);

    const didWin = isWinningGrid(state.displayGrid);
    if (didWin) {
      const coinsBeforeReward = state.coins;
      state.coins += WIN_REWARD;
      animateCoinCount(coinsBeforeReward, state.coins);
      setMessage("YOU WIN! +50", "win");
      gameShell.classList.add("win");
    } else {
      setMessage("TRY AGAIN", "lose");
      gameShell.classList.remove("win");
    }

    state.spinning = false;
    spinButton.disabled = state.coins < SPIN_COST;
  }

  requestAnimationFrame(spinFrame);
}

spinButton.addEventListener("click", runSpin);

// Initial render.
drawBoard(state.displayGrid);
spinButton.disabled = false;
