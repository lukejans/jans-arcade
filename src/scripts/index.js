const ui = (() => {

  const entrance = {
    enterScreen: document.getElementById('enter-screen'),
    arcadeScreen: document.getElementById('arcade-screen'),
    enterArcadeBtn: document.getElementById('enter-arcade-btn')
  };

  const terminal = {
    textInjection: document.getElementById('inject-terminal-text'),
    screen: document.querySelector('.terminal-output'),
    command: document.querySelector('.command'),
    prompt: document.querySelector('.prompt')
  };

  const carousel = {
    container: document.getElementsByClassName('carousel-container')[0],
    leftBtn: document.getElementById('left-scroll-btn'),
    rightBtn: document.getElementById('right-scroll-btn'),
    selectBtn: document.getElementById('select-game-btn'),
    cards: Array.from(document.querySelectorAll('.card'))
  };

  const settingsMenu = {
    backBtn: document.getElementById('settings-back-btn'),
    nextBtn: document.getElementById('settings-next-btn'),
    submitBtn: document.getElementById('settings-submit-btn'),
    container: document.getElementById('game-settings-menu'),
    form: document.getElementById('game-settings-form'),
    modeMenu: document.getElementById('mode-menu'),
    pvcMenu: document.getElementById('pvc-menu'),
    options: document.querySelectorAll('input[type="radio"]')
  };

  const gameOverMenu = {
    container: document.getElementById('game-over-menu'),
    playAgainBtn: document.getElementById('play-again-btn'),
    homeBtn: document.getElementById('go-home-btn')
  };

  const games = {
    container: document.getElementById('game-container'),
    ticTacToe: document.getElementById('tic-tac-toe-game'),
    rockPaperScissors: document.getElementById('rock-paper-scissors-game')
  };

  const ticTacToe =  {
  /**
   *   A1 | B1 | C1 
   *  ----+----+----
   *   A2 | B2 | C2 
   *  ----+----+----
   *   A3 | B3 | C3 
   */
    board: Array.from(games.ticTacToe.querySelectorAll('.tic-tile'))
  };

  const rockPaperScissors = {
    round: document.getElementById('rps-round-number'),
    p1Score: document.getElementById('rps-p1-score'),
    p2Score: document.getElementById('rps-p2-score'),
    p1Choice: document.getElementById('rps-p1-choice'),
    p2Choice: document.getElementById('rps-p2-choice'),
    buttons: Array.from(games.rockPaperScissors.querySelectorAll('.rps-play-buttons button'))
  };

  return { entrance, terminal, carousel, settingsMenu, games, gameOverMenu, ticTacToe, rockPaperScissors};
})();

export { ui };