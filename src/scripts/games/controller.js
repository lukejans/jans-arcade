import { ui } from "../index.js";
import { terminal } from "../interface/terminal.js";
import { btnClickIndication, toggleClasses } from "../utilities/helper.js";
import { initTicTacToe } from "./tictactoe.js";
import { initRockPaperScissors } from "./rock-paper-scissors.js";

/**
 * Arcade State
 * 
 * this object ensures that the ui will always match 
 * the games internal state.
 */
const initialArcadeState = {
  selectedGame: null,
  curMenu: 'mode',
  gameSettings: {}
};
let arcadeState = structuredClone(initialArcadeState);;

// Launch Selected game -------------------------------------------
function launchGame(game) {
  switch (game) {
    case 'ticTacToe':
      initTicTacToe(arcadeState.gameSettings);
      ui.games.ticTacToe.classList.remove('hidden');
      break;
    case 'rockPaperScissors':
      initRockPaperScissors(arcadeState.gameSettings);
      ui.games.rockPaperScissors.classList.remove('hidden');
      break;
  }
}

// Game Selection Functions ---------------------------------------

// Check what game was selected to play 
function handleGameSelection() {  
  btnClickIndication(this, 'playSuccessfulClick');

  // Set state variables
  arcadeState.selectedGame = ui.carousel.cards[1].id;
  arcadeState.curMenu = 'mode';

  // Hide carousel and clear terminal output
  terminal.resetScreen();
  ui.carousel.container.classList.add('hidden');

  // Update command prompt
  terminal.updatePrompt(`/${arcadeState.selectedGame}`);
  
  // Display game container
  toggleClasses(true, ui.games.container);

  switch (arcadeState.selectedGame) {
    case 'ticTacToe':
      // Display menu
      terminal.typeText('settings');
      toggleClasses(true, ui.settingsMenu.container, ui.settingsMenu.modeMenu);
      break;
    case 'rockPaperScissors':
      // No menu needed
      launchGame(arcadeState.selectedGame);
      break;
  }

}

// Game Settings Menu Functions -----------------------------------

/**
 * Handle Back Clicks
 * 
 * back click settings navigation handler. 
 */
function handleBackClicks() {
  if (arcadeState.curMenu === 'mode') {
    // Back to terminal home
    btnClickIndication(this, 'playUnsuccessfulClick');

    // Hide game container & menu
    toggleClasses(false, ui.games.container, 
                         ui.settingsMenu.container, 
                         ui.settingsMenu.modeMenu,
                         ui.settingsMenu.submitBtn);
    toggleClasses(true, ui.settingsMenu.nextBtn);

    // Reprint terminal home banner
    terminal.displayHome();
  } else if (arcadeState.curMenu === 'pvc') {
    // Back to mode menu
    arcadeState.curMenu = 'mode';
    btnClickIndication(this, 'playUnsuccessfulClick');
    toggleClasses(false, ui.settingsMenu.pvcMenu, ui.settingsMenu.submitBtn);
    toggleClasses(true, ui.settingsMenu.modeMenu, ui.settingsMenu.nextBtn);
  }
  // Reset previously selected form settings
  clearSettings();
}

/**
 * Handle Next Clicks
 * 
 * next click settings navigation handler 
 */
function handleNextClick() {
  btnClickIndication(this, 'playSuccessfulClick');
  
  // Move to next menu state
  arcadeState.curMenu = 'pvc';
  toggleClasses(false, this, ui.settingsMenu.modeMenu);
  toggleClasses(true, ui.settingsMenu.submitBtn, ui.settingsMenu.pvcMenu);
}

/**
 * Handle Form Submission
 * 
 * convert the form data into an object to an object and store it 
 * in arcade state. This object contains all the user selected 
 * settings for the game. 
 * 
 * @param {Event} event - form submission event
 */
function handleFormSubmission(event) {
  event.preventDefault(); // Prevent page from reloading
  btnClickIndication(event.target, 'playSuccessfulClick');

  // Save submitted settings
  const formData = new FormData(event.target); 
  
  // Convert FormData to an object
  formData.forEach((value, key) => {
    // Handle multiple values (e.g., checkboxes with the same name)
    if (arcadeState.gameSettings[key]) {
      if (Array.isArray(arcadeState.gameSettings[key])) {
        arcadeState.gameSettings[key].push(value);
      } else {
        arcadeState.gameSettings[key] = [arcadeState.gameSettings[key], value];
      }
    } else {
      arcadeState.gameSettings[key] = value;
    }
  });

  // Reset Menu
  clearSettings();
  toggleClasses(false, ui.settingsMenu.container, 
                       ui.settingsMenu.modeMenu,
                       ui.settingsMenu.pvcMenu,
                       ui.settingsMenu.submitBtn);
  toggleClasses(true, ui.settingsMenu.nextBtn)
}

// Reset form & menu buttons
function clearSettings() {
  ui.settingsMenu.options.forEach(setting => {
    setting.checked = false;
  });

  // Reset menu state
  ui.settingsMenu.nextBtn.disabled = true;
  ui.settingsMenu.submitBtn.disabled = true;
}

/**
 * Update Menu Buttons
 * 
 * ran as a callback function to check what menu option have been selected.
 * this ensures that the user selects all required option before allowing 
 * them to either submit the form or go to the next menu screen (pvc menu).
 * 
 * @param {HTMLElement} clickedOption - menu option that was clicked 
 */
function updateMenuBtns(clickedOption) {
  // Menu behavior when the user is at mode menu
  if (arcadeState.curMenu === 'mode') {
    if (clickedOption.value === 'pvp' || clickedOption.value === 'cvc') {
      // Submit form
      ui.settingsMenu.nextBtn.classList.add('hidden');
      ui.settingsMenu.submitBtn.classList.remove('hidden');
      ui.settingsMenu.submitBtn.disabled = false;
    } else {
      // Next menu
      ui.settingsMenu.nextBtn.classList.remove('hidden');
      ui.settingsMenu.submitBtn.classList.add('hidden');
      ui.settingsMenu.nextBtn.disabled = false;
      ui.settingsMenu.submitBtn.disabled = true;
    }
  // Menu behavior when the user is at pvc menu
  } else if (arcadeState.curMenu === 'pvc') {
    let marker = false, difficulty = false;
    // check if the required options are checked
    ui.settingsMenu.options.forEach(option => {
      if (option.checked) {
        if (option.name === 'marker') marker = true;
        if (option.name === 'difficulty') difficulty = true;
      }
    });
    // Allow submission if all required options are checked
    if (marker && difficulty) {
      ui.settingsMenu.submitBtn.disabled = false;
    }
  }
}

// Menu navigation
ui.carousel.selectBtn.addEventListener('click', handleGameSelection);
ui.settingsMenu.backBtn.addEventListener('click', handleBackClicks);
ui.settingsMenu.nextBtn.addEventListener('click',  handleNextClick);

// Form submission
ui.settingsMenu.form.addEventListener('submit', function(event) {
  handleFormSubmission(event);
  launchGame(arcadeState.selectedGame);
});

// Menu options
ui.settingsMenu.options.forEach(el => el.addEventListener('click', function() {
  btnClickIndication(this, 'playCarouselClick');
  setTimeout(updateMenuBtns(this), 20);
}));

// Game Over Menu Functions ---------------------------------------

ui.gameOverMenu.homeBtn.addEventListener('click', returnHome);
ui.gameOverMenu.playAgainBtn.addEventListener('click', playAgain);

function returnHome() {
  btnClickIndication(ui.gameOverMenu.homeBtn, 'playUnsuccessfulClick');
  ui.gameOverMenu.container.classList.add('hidden');
  ui.games[arcadeState.selectedGame].classList.add('hidden');
  arcadeState = structuredClone(initialArcadeState);
  terminal.typeText('');
  terminal.displayHome();
}

function playAgain() {
  btnClickIndication(ui.gameOverMenu.playAgainBtn, 'playCarouselClick')
  ui.gameOverMenu.container.classList.add('hidden');

  launchGame(arcadeState.selectedGame);
}

