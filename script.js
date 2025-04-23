// script.js

// Scores saved in localStorage or initialized
const scores = {
  clicker: parseInt(localStorage.getItem('clickerScore')) || 0,
  rps: parseInt(localStorage.getItem('rpsScore')) || 0,
  memory: parseInt(localStorage.getItem('memoryBest')) || 0,
  dodger: parseInt(localStorage.getItem('dodgerScore')) || 0,
};

// Update stats display
function updateStats() {
  document.getElementById('stat-clicker').textContent = scores.clicker;
  document.getElementById('stat-rps').textContent = scores.rps;
  document.getElementById('stat-memory').textContent = scores.memory;
  document.getElementById('stat-dodger').textContent = scores.dodger;
}
updateStats();

const gameContainer = document.getElementById('game-container');

function saveScore(game, score) {
  if(game === 'memory') {
    if(score > scores.memory) {
      scores.memory = score;
      localStorage.setItem('memoryBest', score);
    }
  } else {
    localStorage.setItem(game + 'Score', score);
    scores[game] = score;
  }
  updateStats();
}

function loadGame(name) {
  gameContainer.innerHTML = '';
  switch (name) {
    case 'clicker':
      loadClicker();
      break;
    case 'rps':
      loadRPS();
      break;
    case 'memory':
      loadMemory();
      break;
    case 'dodger':
      loadDodger();
      break;
  }
}

// Clicker Game
function loadClicker() {
  gameContainer.innerHTML = `
    <div class='game-box'>
      <h2>Clicker Game</h2>
      <p>Score: <span id='clicks'>${scores.clicker}</span></p>
      <button class='main-btn' id='clickerBtn'>Click Me!</button>
    </div>`;
  const clickDisplay = document.getElementById('clicks');
  const clickBtn = document.getElementById('clickerBtn');
  clickBtn.onclick = () => {
    scores.clicker++;
    saveScore('clicker', scores.clicker);
    clickDisplay.textContent = scores.clicker;
  };
}

// Rock Paper Scissors
function loadRPS() {
  gameContainer.innerHTML = `
    <div class='game-box'>
      <h2>Rock Paper Scissors</h2>
      <p>Score: <span id='rpsScore'>${scores.rps}</span></p>
      <div class='rps-buttons'>
        <button class='main-btn' data-choice="rock">Rock</button>
        <button class='main-btn' data-choice="paper">Paper</button>
        <button class='main-btn' data-choice="scissors">Scissors</button>
      </div>
      <p id='rpsResult'></p>
    </div>`;
  const rpsScoreDisplay = document.getElementById('rpsScore');
  const rpsResult = document.getElementById('rpsResult');
  const buttons = document.querySelectorAll('.rps-buttons button');

  buttons.forEach(button => {
    button.onclick = () => {
      const player = button.getAttribute('data-choice');
      const options = ['rock', 'paper', 'scissors'];
      const bot = options[Math.floor(Math.random() * 3)];
      let result = '';
      if (player === bot) {
        result = "It's a draw!";
      } else if (
        (player === 'rock' && bot === 'scissors') ||
        (player === 'paper' && bot === 'rock') ||
        (player === 'scissors' && bot === 'paper')
      ) {
        result = 'You win!';
        scores.rps++;
      } else {
        result = 'You lose!';
        scores.rps = Math.max(0, scores.rps - 1);
      }
      saveScore('rps', scores.rps);
      rpsScoreDisplay.textContent = scores.rps;
      rpsResult.textContent = `Bot chose ${bot}. ${result}`;
    };
  });
}

// Memory Game - simple score shown only
function loadMemory() {
  gameContainer.innerHTML = `
    <div class='game-box'>
      <h2>Memory Game</h2>
      <p>Your Best Score: <strong>${scores.memory}</strong></p>
      <p>Try playing the actual memory game in the full version!</p>
    </div>`;
}

// Dodger Game with mobile-friendly buttons
function loadDodger() {
  gameContainer.innerHTML = `
    <div class='game-box'>
      <h2>Dodger Game</h2>
      <p>Use Left and Right arrow keys or buttons below to dodge blocks.</p>
      <canvas id='dodgerCanvas' width='300' height='400' style='border-radius:12px; background:#111; display:block; margin: 0 auto;'></canvas>
      <div style="margin-top:10px; display:flex; justify-content:center; gap:20px;">
        <button id="leftBtn" class="main-btn" style="width:100px;">Left</button>
        <button id="rightBtn" class="main-btn" style="width:100px;">Right</button>
      </div>
      <p>Score: <span id='dodgerScore'>${scores.dodger}</span></p>
    </div>`;

  const canvas = document.getElementById('dodgerCanvas');
  const ctx = canvas.getContext('2d');
  let player = { x: 140, y: 360, w: 20, h: 20 };
  let enemies = [];
  let dodgerScore = scores.dodger;
  const scoreDisplay = document.getElementById('dodgerScore');
  let gameOver = false;

  function spawn() {
    enemies.push({ x: Math.random() * 280, y: 0, w: 20, h: 20 });
  }

  function draw() {
    if (gameOver) return;
    ctx.clearRect(0, 0, 300, 400);
    // Draw player
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(player.x, player.y, player.w, player.h);

    // Draw enemies
    ctx.fillStyle = '#ff4d4d';
    for (let e of enemies) {
      ctx.fillRect(e.x, e.y, e.w, e.h);
      e.y += 3;
      // Collision detection
      if (
        e.x < player.x + player.w &&
        e.x + e.w > player.x &&
        e.y < player.y + player.h &&
        e.y + e.h > player.y
      ) {
        gameOver = true;
        alert('Game Over! Final Score: ' + dodgerScore);
        saveScore('dodger', dodgerScore);
        loadGame('dodger'); // restart game
        return;
      }
    }

    enemies = enemies.filter(e => e.y < 400);
    dodgerScore++;
    scoreDisplay.textContent = dodgerScore;
    requestAnimationFrame(draw);
  }

  function moveLeft() {
    if (player.x > 0) player.x -= 15;
  }
  function moveRight() {
    if (player.x < 280) player.x += 15;
  }

  document.addEventListener('keydown', e => {
    if (gameOver) return;
    if (e.key === 'ArrowLeft') moveLeft();
    if (e.key === 'ArrowRight') moveRight();
  });

  // Mobile buttons
  document.getElementById('leftBtn').onclick = () => { if(!gameOver) moveLeft(); };
  document.getElementById('rightBtn
