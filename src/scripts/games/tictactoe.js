import { ui } from "../index.js";
import { terminal } from "../interface/terminal.js";
import { soundEffects } from "../utilities/audio.js";


// Customize ------------------------------------------------------

// Time it takes for ai player to make a move
const AI_MOVE_DELAY = 1000;


// State & Initialization -----------------------------------------
const initialState = {
  // Game settings
  mode: null, // 'pvp', 'pvc', 'cvc'
  marker: null, // 'x', 'o'
  difficulty: null, // 'easy', 'medium', 'hard'

  // Game board state
  board: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  terminal: 'live', // 'live', 'x', 'o', 'tie'
  
  // Players and moves
  p1: null,
  p2: null,
  curTurn: null,
  winningMoves: []
};
let state = structuredClone(initialState);
const resetState = () => state = structuredClone(initialState);

/**
 * Initialize Tic Tac Toe
 * 
 * setup the game state from the settings selected in arcadeState. Then 
 * based on this state create the players
 * 
 * @param {object} arcadeState - game settings
 */
function initTicTacToe(arcadeState) {
  resetState();

  // Copy arcade settings to game state
  for (const setting in arcadeState) {
    state[setting] = arcadeState[setting];
  }

  createPlayers();
  state.curTurn = state.p1;
  terminal.typeText(`${state.curTurn.marker}'s turn`);

  if (state.mode === 'cvc') {
    playBotOnlyGame();
    return;
  }

  if (state.curTurn.isBot) {
    setTimeout(() => state.curTurn.playMove(), AI_MOVE_DELAY);
  }
}

// Player & Game --------------------------------------------------

/**
 * Player Factory 
 * 
 * @param {string} marker - 'x' or 'o' player marker
 * @param {boolean} cpu - if the player is a bot 
 * @returns 
 */
function Player(marker, cpu = false) {
  let player = {
    marker,
    isBot: cpu,
  };

  if (cpu) {
    player.playMove = botMove();
  } else {
    player.playMove = humanMove;
  }

  return player;
}


/**
 * Create Players
 * 
 * this contains all possible player configurations based on what 
 * state mode is set to. Player1 will always be x as x starts the game. 
 * Therefore in the case of pvc mode being selected the human player 
 * will either be player1 or player2 based on what marker they picked.
 */
function createPlayers() {
  // Possible player configurations
  const playerConfigs = {
    pvp: () => {
      state.p1 = Player('x');
      state.p2 = Player('o');
    },
    pvc: () => {
      let randomMarker = Math.random() < 0.5 ? 'x' : 'o';
      let humanMarker = state.marker === 'random' ? randomMarker : state.marker;
      let computerMarker = humanMarker === 'x' ? 'o' : 'x';

      state.p1 = Player('x', computerMarker === 'x');
      state.p2 = Player('o', computerMarker === 'o');
    },
    cvc: () => {
      state.p1 = Player('x', true);
      state.p2 = Player('o', true);
    }
  };

  // Create players
  playerConfigs[state.mode]();
}

function botMove() {
  if (state.difficulty === 'easy') {
    // Easy bot: 
    return () => {
      let move = getRandomMove();
      makeMove(move);
    };
  } else if (state.difficulty === 'hard') {
    // Hard bot: 
    return () => {
      let move = getMinimaxMove();
      makeMove(move);
    };
  } else {
    // Medium bot: 
    return () => {
      let move;
      if (getPossibleMoves(state.board).length > 7) {
        move = getRandomMove();
      } else {
        move = getMinimaxMove(3);
      }
      makeMove(move);
    };
  } 
}

function playBotOnlyGame() {
  let gameID = setInterval(() => {
    state.curTurn.playMove()
    if (gameIsOver()) {
      clearInterval(gameID);
      return;
    }
  }, AI_MOVE_DELAY);
}

/**
 * Minimax Algorithm
 * ```
 *        0
 *      /  \
 *     0    0
 *    / \  / \
 *   0  0  0  0
 * ```
 * starting from the passed game state searches all possible move 
 * sequences and determines which move from the beginning of the 
 * tree is the best route to take (maximizing gain).
 * 
 * @param {*} state 
 * @param {*} depth 
 * @param {*} maximizingPlayer 
 * @param {*} maxPlayer 
 * @param {*} minPlayer
 */
function minimax(state, depth, maximizingPlayer, maxPlayer, minPlayer) {
  // Check for a terminal state
  let result = checkForWinner(state).terminal;
  // End of tree or terminal state so evaluate state score
  if (depth === 0 || result !== 'live') {
    if (result === maxPlayer) return 10 + depth;  // Max player won
    if (result === minPlayer) return -10 - depth; // Min Player won
    return 0;
  }

  // Continue to search down a tree of moves
  if (maximizingPlayer) {
    // Maximizing player
    let maxScore = -Infinity;

    // Call minimax on each possible branch of moves
    for (const move of getPossibleMoves(state)) {
      state[move] = maxPlayer;  // Simulate move in branch
      // console.log(`  ${state[0]} | ${state[1]} | ${state[2]}\n`,
      //   '---+---+---\n',
      //   ` ${state[3]} | ${state[4]} | ${state[5]}\n`,
      //   '---+---+---\n',
      //   ` ${state[6]} | ${state[7]} | ${state[8]}\n`
      // );
      let score = minimax(state, depth -1, false, maxPlayer, minPlayer);
      state[move] = move;       // Undo simulated move to test other branches

      // Update score: maxPlayer wants higher
      maxScore = Math.max(maxScore, score);
    }
    return maxScore;
  } else {
    // Minimizing player
    let minScore = Infinity;

    // Call minimax on each possible branch of moves
    for (const move of getPossibleMoves(state)) {
      state[move] = minPlayer;  // Simulate move in branch
      let score = minimax(state, depth -1, true, maxPlayer, minPlayer);
      state[move] = move;       // Undo simulated move to test other branches

      // Update score: maxPlayer wants higher
      minScore = Math.min(minScore, score);
    }
    return minScore;
  }
}

/**
 * Get Minimax Move
 * 
 * this function is responsible for making the initial call to the minimax 
 * function and accepts a param to limit the depth of a search. If no depth 
 * is provided the algorithm will search every possible move.
 * 
 * @param {number} depth - moves ahead in the tree you want to search
 * @returns {number} - index of the best move to play
 */
function getMinimaxMove(depth = getPossibleMoves(state.board).length) {
  // Determine max and min player
  let maxPlayer = state.curTurn.marker;
  let minPlayer = maxPlayer === 'x' ? 'o' : 'x';
  
  // Deep copy board so we aren't simulating on the real board
  let boardCopy = structuredClone(state.board);

  // Initialize 
  let bestMove;
  let bestScore = -Infinity;
  let possibleMoves = getPossibleMoves(boardCopy);

  // Check what move is the best
  for (const move of possibleMoves) {
    boardCopy[move] = maxPlayer;  // Simulate first move in branch
    let score = minimax(boardCopy, depth, false, maxPlayer, minPlayer);
    boardCopy[move] = move;       // Undo simulated move to test other branches

    // Update best move
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}

function getRandomMove() {
  // find a random move
  let possibleMoves = getPossibleMoves(state.board);
  let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  return move;
}

function humanMove(tile) {
  if (typeof state.board[tile] === 'number') {
    makeMove(tile);
  } else {
    soundEffects.playUnsuccessfulClick();
  }
}

function makeMove(tile) {
  // Update board state
  state.board[tile] = state.curTurn.marker;
  
  // Change current player
  state.curTurn = state.curTurn === state.p1 ? state.p2 : state.p1;
  
  // Update UI
  updateBoardUI();
  terminal.typeText(`${state.curTurn.marker}'s turn`);

  // Audio indication for legal move being made
  soundEffects.playSuccessfulClick();
}

function getPossibleMoves(board) {
  let possibleMoves = [];
  board.forEach((tile) => {
    if (typeof tile === 'number') {
      possibleMoves.push(tile);
    }
  });
  return possibleMoves;
}

/**
 * Check For Winner 
 * 
 * run after every move to see if a terminal state has been reached 
 * (win or tie). This function accepts a state parameter because it 
 * is also used inside the minimax algorithm move simulations.
 * 
 * @param {object} state - the game state to evaluate
 * @returns {string} - terminal state
 */
function checkForWinner(board) {
  // Initialize
  let checkedState = {
    terminal: 'live',
    winningMoves: []
  };

  // Find all win conditions
  const winConditions = [
    // Row
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Column
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonal 
    [0, 4, 8], 
    [2, 4, 6],
  ]

  // Check for a winner
  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (
      typeof board[a] !== 'number' &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      checkedState.winningMoves = condition;
      checkedState.terminal = `${board[a]}`; // Winner
    }
  }

  // Check for a tie
  if ( checkedState.terminal === 'live' && 
       board.every((tile) => typeof tile !== 'number')
  ) {
    checkedState.terminal = 'tie';
  }

  return checkedState;
}

// Check if the game is over
function gameIsOver() {
  // Merge state and evaluation of state
  Object.assign(state, checkForWinner(state.board));

  let gameEnded = state.terminal !== 'live';

  if (gameEnded) {
    terminalStateUI();
    
    // Display game over menu
    setTimeout(() => {
      ui.gameOverMenu.container.classList.remove('hidden');
      resetWinUI();
      resetState();
      updateBoardUI();
    }, 2000);
    
    return true;
  } else return false;
}

// UI Related Functions -------------------------------------------

/**
 * Update Board UI
 * 
 * copies each tiles value into its corresponding ui component.
 * If the tile is not occupied by a player its not copied over.
 */
function updateBoardUI() {
  state.board.forEach((tile, i) => {
    ui.ticTacToe.board[i].textContent = typeof tile === 'number' ? '' : tile;
  });
}

function resetWinUI() {
  state.winningMoves.forEach((tile) => {
    ui.ticTacToe.board[tile].classList.remove('tic-win');
  });
}

/**
 * Winner UI
 * 
 * when a user wins a game this function is run to highlight the moves that
 * lead to a win condition being fulfilled. It also has an timeout ID tracker 
 * to ensure we can stop the animation if needed.
 * 
 * @param {string} toggle - string representing 'add' or 'remove' highligh
 */
const winUI = function() {
    // Update UI for tiles with winning moves
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        ui.ticTacToe.board[state.winningMoves[i]].classList.add('tic-win');
        soundEffects.playPoints();
      }, i * 400);
    }
}

function terminalStateUI() {
  switch (state.terminal) {
    case 'x':
      terminal.typeText('player x wins');
      winUI('add');
      break;
    case 'o':
      terminal.typeText('player o wins');
      winUI('add');
      break;
    case 'tie':
      terminal.typeText('tie game');
      break;
  }
}

// Event Listeners ------------------------------------------------

ui.ticTacToe.board.forEach(tile => {
  tile.addEventListener('click', handleTileClick);
});

// Event Handlers -------------------------------------------------

function handleTileClick() {
  // Only run if it's the human player's turn and the game is live
  if (state.terminal === 'live' && !state.curTurn.isBot) {
    // Human move
    state.curTurn.playMove(this.value);
    if (gameIsOver()) return;

    // AI move
    if (state.mode === 'pvc' && state.curTurn.isBot) {
      setTimeout(() => {
        state.curTurn.playMove();
        gameIsOver();
      }, AI_MOVE_DELAY);
    }
  } else if (state.mode === 'cvc') {
    return;
  } else {
    soundEffects.playUnsuccessfulClick();
  }
}

export {initTicTacToe};