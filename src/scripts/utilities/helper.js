import { soundEffects } from "./audio.js";

/**
 * Button Click Indication 
 * 
 * audio files 
 *    - playCarouselClick
 *    - playSuccessfulClick
 *    - playUnsuccessfulClick
 *    - playConfirmClick
 *    - playPoints
 *    - playTerminalLoad
 * 
 * @param {HTMLElement} btn - button to indicate click on
 * @param {string} audio - the name of a sound effect to play
 */
function btnClickIndication(btn, audio) {
  // Avoid accidental double clicks
  btn.disabled = true; 
  setTimeout(() => btn.disabled = false, 200);

  // Visual indication
  btn.classList.add('btn-click-indication');
  setTimeout(() => btn.classList.remove('btn-click-indication'), 100);
  
  // Audio indication
  audio ? soundEffects[audio]() : false;
}

/**
 * Get Current Time 
 * 
 * this function is to be called in the introduction banner when 
 * a user first 'connects' to the terminal.
 * 
 * @returns {String} - formatted time '00:00:00'
 */
function getCurrentTime() {
  let time = new Date();
  return (
    String(time.getHours()).padStart(2, '0') +
    ':' +
    String(time.getMinutes()).padStart(2, '0') +
    ':' +
    String(time.getSeconds()).padStart(2, '0')
  );
}

/**
 * Toggle Classes
 * 
 * class to help easily hide or show multiple elements at once.
 * 
 * @param {Boolean} show - hide or show elements 
 * @param {...HTMLElement} elements - list of elements to toggle class
 */
function toggleClasses(show, ...elements) {
  if (show) {
    elements.forEach((el) => el.classList.remove('hidden'));
  } else {
    elements.forEach((el) => el.classList.add('hidden'));
  }
}

export {getCurrentTime, btnClickIndication, toggleClasses};

