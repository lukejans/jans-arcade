/* 
    COMMAND LINE

    display input from hidden textarea in the
    command line interface (cli).
*/
const CLI = document.querySelector('.command-line');
const INPUT = document.getElementById('type');
const CARET = document.querySelector('.caret');
// focus on textarea (INPUT)
window.addEventListener('click', function (event) {
  if (event.target !== INPUT) {
    INPUT.focus();
  }
});
// function to run on input from textarea
function cliDisplayInput() {
  CLI.textContent = INPUT.value;
}
/*
    CARET

    terminal caret movements
*/
CARET.style.left = '0px';
let movesRight = 0;
let movesLeft;
// change caret location based on arrow press, delete and type
window.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
  } else if (e.key === 'Enter') {
    e.preventDefault();
  } else if (e.key === 'ArrowLeft' && movesLeft !== 0) {
    movesRight++;
    movesLeft = INPUT.value.length - movesRight;
    CARET.style.left = parseInt(CARET.style.left) - 9 + 'px';
  } else if (e.key === 'ArrowRight' && movesRight !== 0) {
    movesRight--;
    movesLeft = INPUT.value.length - movesRight;
    CARET.style.left = parseInt(CARET.style.left) + 9 + 'px';
  }
});
