import { ui } from "../index.js";
import { terminal } from "../interface/terminal.js";
import { soundEffects } from "../utilities/audio.js";
import { btnClickIndication } from "../utilities/helper.js";

const CHOICES = ['rock', 'paper', 'scissors'];

const INITIAL_STATE = {
  p1Score: 0,
  p2Score: 0,
  p1Choice: '',
  p2Choice: '',
  curTurn: 'p1',
  roundOutcome: '',  // 'tie' 'p1' 'p2' 
  gameOutcome: 'live',   // 'live' 'p1' 'p2'
  roundNum: 1,
  allowedToPlay: true
}
let gameState = structuredClone(INITIAL_STATE);

function initRockPaperScissors() {
  gameState = structuredClone(INITIAL_STATE);
  terminal.typeText('first to 3 points wins')
  updateUI();
}

function playHumanMove(btn) {
  let move = btn.id;
  gameState[`${gameState.curTurn}Choice`] = move;
}

function playBotMove() {
  let random = Math.floor(Math.random() * 3);
  let move = CHOICES[random];
  gameState[`${gameState.curTurn}Choice`] = move;
}

function switchPlayerTurns() {
  gameState.curTurn === 'p1' ? gameState.curTurn = 'p2' : gameState.curTurn = 'p1';
}

function endRound() {
  let c1 = gameState.p1Choice;
  let c2 = gameState.p2Choice;

  // determine winner
  if (c1 === c2) {
    gameState.roundOutcome = 'tie';
    terminal.typeText(`round ended in a tie`);
    gameState.roundNum++;
  } else if (
    (c1 === 'rock' && c2 === 'scissors') ||
    (c1 === 'paper' && c2 === 'rock') ||
    (c1 === 'scissors' && c2 === 'paper')
  ) {
    gameState.roundOutcome = 'p1';
    gameState.p1Score++
    terminal.typeText(`p1 wins: ${gameState.p1Choice} beats ${gameState.p2Choice}`);
    if (gameState.p1Score === 3) {
      gameState.gameOutcome = 'p1'
      setTimeout(() => terminal.typeText('game over, p1 wins'), 1500);
    } else {
      gameState.roundNum++;
    }
  } else {
    gameState.roundOutcome = 'p2';
    gameState.p2Score++;
    terminal.typeText(`p2 wins: ${gameState.p2Choice} beats ${gameState.p1Choice}`);
    if (gameState.p2Score === 3) {
      gameState.gameOutcome = 'p2';
      setTimeout(() => terminal.typeText('game over, p2 wins'), 1500);
    } else {
      gameState.roundNum++;
    }
  }
  console.log(gameState.gameOutcome);

  gameState.p1Choice = '_';
  gameState.p2Choice = '_';
  setTimeout(() => {
    updateUI();
    gameState.allowedToPlay = true;
  }, 1500);

  if (gameState.gameOutcome !== 'live') {
    // Display game over menu
    setTimeout(() => {
      gameState = structuredClone(INITIAL_STATE);
      ui.gameOverMenu.container.classList.remove('hidden');
      updateUI();
    }, 2000);
  }
}

function updateUI() {
  // Update round number
  ui.rockPaperScissors.round.textContent = gameState.roundNum;

  // Update scores
  ui.rockPaperScissors.p1Score.textContent = `p1: ${gameState.p1Score}`;
  ui.rockPaperScissors.p2Score.textContent = `p2: ${gameState.p2Score}`;

  // Update choices
  ui.rockPaperScissors.p1Choice.textContent = `p1: ${gameState.p1Choice}`;
  ui.rockPaperScissors.p2Choice.textContent = `p2: ${gameState.p2Choice}`;
}

ui.rockPaperScissors.buttons.forEach((btn) => {
  btn.addEventListener('click', function() {
    if (gameState.curTurn === 'p1' && gameState.gameOutcome === 'live' && gameState.allowedToPlay) {
      gameState.allowedToPlay = false;
      // Human move
      playHumanMove(btn);
      btnClickIndication(btn, 'playSuccessfulClick');
      switchPlayerTurns();
      updateUI();

      // CPU move
      setTimeout(() => {
        playBotMove()
        switchPlayerTurns();
        updateUI();
        endRound();
      }, 1000);
    } else {
      btnClickIndication(btn, 'playUnsuccessfulClick');
    }
  });
});

export { initRockPaperScissors };