import { ui } from "../index.js";
import { soundEffects } from "../utilities/audio.js";
import { getCurrentTime, btnClickIndication } from "../utilities/helper.js";

/**
 * Terminal 
 * 
 * interface for terminal where all text animations occur showing
 * the user an introduction banner and the name of the currently 
 * selected game on the carousel.
 */
const terminal = (() => {
  // Terminal UI
  let textInjection = ui.terminal.textInjection;
  const screen = ui.terminal.screen;
  const command = ui.terminal.command;
  const enterScreen = ui.entrance.enterScreen;
  const arcadeScreen = ui.entrance.arcadeScreen;
  const enterArcadeBtn = ui.entrance.enterArcadeBtn;

  // Intro banner 
  const introBanner = {
    connected: `<span class="text">Connected at ${getCurrentTime()}</span>`,
    banner: [
      '___',
      ',"---".',
      ':     ;',
       "`-.-'",
      '| |',
      '| |',
      '| |',
      '_.-\\_/-._',
      '_ / |     | \\ _',
      "/ /   `---'   \\ \\",
      "/  `-----------'  \\",
      '/,-""-.       ,-""-.\\',
      '( i-..-i       i-..-i )',
      "|`|    |-------|    |'|",
      "\\ `-..-'  ,=.  `-..-'/",
      "`--------|=|-------'",
      '           __                    ',
      '       __ / /__  ___  ___        ',
      '      / // / _ `/ _ \\(_-<        ',
      '   ___\\___/\\_,_/_//_/___/__      ', 
      '  / _ | ___________ ____/ /__    ',
      ' / __ |/ __/ __/ _ `/ _  / -_)   ',
      '/_/ |_/_/  \\__/\\_,_/\\_,_/\\__/    ',
      '                        © 2024',
    ],
    message: '<span class="text">Please select a game mode</span>',
  };

  /**
   * Add Line 
   * 
   * creates 'pre' element and adds them to the dom with specified 
   * styles (classes) and a time duration between each line print. 
   * All elements created are added before a 'textInjection' element.
   * 
   * @param {string} content - line of text to append to dom
   * @param {string} style - class name to add to element
   * @param {number} time - time delay to add element to the dom
   */
  function addLine(content, style, time) {
    let curLine = content;
    setTimeout(function () {
      let line = document.createElement('pre');
      line.innerHTML = curLine;
      line.className = style;
      line.classList.add('typing-animation');
  
      textInjection.parentNode.insertBefore(line, textInjection);
    }, time);
  }

  /**
   * Loop Lines
   * 
   * calls addLine function to run on an array of strings.
   * 
   * @param {string[]} content - lines of text to append to dom
   * @param {string} style - class name to add to element
   * @param {number} time - time delay between each line print
   */
  function loopLines(content, style, time) {
    content.forEach(function (item, index) {
      addLine(item, style, index * time);
    });
  }

  // Reset the terminal output screen
  function resetScreen() {
    setTimeout(function () {
      screen.innerHTML = '<a id="inject-terminal-text"></a>';
      textInjection = document.getElementById('inject-terminal-text');
    }, 1);
  }

  // Update prompt path
  function updatePrompt(path = '') {
    ui.terminal.prompt.innerHTML = 
      `guest<span class="alt">@</span>jansarcade<span class="alt">${path}</span>`;
  }

  // Displaying the initial home screen banner
  function displayHome() {
    soundEffects.playTerminalLoad();
    updatePrompt();
    command.textContent = ''

    // Display intro banner
    let time = 80 * introBanner.banner.length;
    addLine(introBanner.connected, 'text', 0);
    loopLines(introBanner.banner, 'banner', 80);
    addLine(introBanner.message, 'text', time);

    // Display the carousel
    setTimeout(() => {
      ui.carousel.container.classList.remove('hidden');

      // Display first game name in the command prompt
      typeText(ui.carousel.cards[1].id, command);
    }, time);
  }

  /**
   * Change Command
   * 
   * used to type out text in the DOM. Used in the carousel to display the 
   * current game that has been selected and used during games to display 
   * and update information.
   * 
   * @param {string} txt - text to be typed out
   * @param {HTMLElement} el- target element to display text (default: command)
   */
  const typeText = (function () {
    // This is here to avoid overlapping of text being typed out 
    // on subsequent calls of the 'type()' func. (rapid button clicks)
    let timeoutId = null; 

    return function (txt,  el = command) {
      // If there's an ongoing typing process, cancel it
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      const phrase = txt;
      let currentText = '';
      let index = 0;

      /**
       * Recursive function to call with a timeout to simulate
       * text being typed out.
       */
      function type() {
        el.textContent = currentText;
        if (index < phrase.length) {
          currentText += phrase[index++];
          timeoutId = setTimeout(type, 55);
        } else {
          // Typing completed, reset the timeout ID
          timeoutId = null;
        }
      }
      type();
    };
  })();

  // Wait for all content to load before entrance
  window.addEventListener('load', () => {
    // Removing loading indication
    enterArcadeBtn.classList.remove('blink');
    enterArcadeBtn.textContent = 'ENTER';
    enterArcadeBtn.disabled = false;

    // Enter arcade 
    enterArcadeBtn.addEventListener('click', function() {
      btnClickIndication(enterArcadeBtn, '');

      // Toggle pages
      arcadeScreen.classList.remove('hidden');
      enterScreen.classList.add('hidden');
  
      // Initialize terminal 
      displayHome()
    });
  });

  return { typeText, displayHome, updatePrompt, resetScreen }
})();

export { terminal };