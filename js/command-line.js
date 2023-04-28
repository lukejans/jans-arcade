/* 
    COMMAND LINE

    display input from hidden textarea in the
    command line interface (cli) and display output 
    from commands entered.
*/
// display intro output
setTimeout(function () {
  printPrompt('');
  loopLines(banner, 'banner', 80);
  INPUT.focus();
}, 100);
// query the dom
let before = document.getElementById('before'); // changes on clear cmd
const CLI = document.querySelector('.command-line');
const INPUT = document.getElementById('type');
const CARET = document.querySelector('.caret');
const TERMINAL = document.querySelector('.terminal');
// focus on textarea (INPUT)
window.addEventListener('click', function (event) {
  if (event.target !== INPUT) {
    INPUT.focus();
  }
});
// update command line with input
function cliDisplayInput() {
  CLI.textContent = INPUT.value;
  liveValidCommand(INPUT.value);
  updateCaretMoves();
}
// create elements with text then add to dom
function addLine(text, style, time) {
  let t = '';
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) == ' ' && text.charAt(i + 1) == ' ') {
      t += '&nbsp;&nbsp;';
      i++;
    } else {
      t += text.charAt(i);
    }
  }
  setTimeout(function () {
    let next = document.createElement('pre');
    next.innerHTML = t;
    next.className = style;

    before.parentNode.insertBefore(next, before);

    window.scrollTo(0, document.body.offsetHeight);
  }, time);
}
// given an array of text to display run addLine on each arr[i]
function loopLines(name, style, time) {
  name.forEach(function (item, index) {
    addLine(item, style, index * time);
  });
}
/*
    CARET

    terminal caret movements & cmd history scroll 
*/
// init
const caret = {
  mR: 0,
  mL: undefined,
  calcLeft: function () {
    return INPUT.value.length - caret.mR;
  },
};

// caret.mR++;
//     caret.mL = INPUT.value.length - caret.mR;
// caret.mR--;
//     caret.mL = INPUT.value.length - caret.mR;
CARET.style.left = '0px';

let movesRight = 0;
let movesLeft;
function updateCaretMoves() {
  movesLeft = INPUT.value.length - movesRight;
  console.log({ movesRight, movesLeft });
}
// change caret location based on arrow press, delete and type
window.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
  } else if (e.key === 'Space') {
    cliDisplayInput();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    commandHistory.push(INPUT.value);
    printPrompt(INPUT.value);
    commandOutput(INPUT.value);
    INPUT.value = '';
    cliDisplayInput();
  } else if (e.key === 'ArrowLeft' && movesLeft !== 0) {
    caret.mR++;
    caret.mL = caret.calcLeft();

    movesRight++;
    movesLeft = INPUT.value.length - movesRight;
    CARET.style.left = parseInt(CARET.style.left) - 9 + 'px';
  } else if (e.key === 'ArrowRight' && movesRight !== 0) {
    caret.mR--;
    caret.mL = caret.calcLeft();

    movesRight--;
    movesLeft = INPUT.value.length - movesRight;
    CARET.style.left = parseInt(CARET.style.left) + 9 + 'px';
  }
  console.log(caret);
  console.log({ movesRight, movesLeft });
});
/*
    COMMANDS

    valid commands to run on input
*/
function commandOutput(cmd) {
  switch (cmd.toLowerCase()) {
    case 'banner':
      loopLines(banner, 'banner', 80);
      break;
    case 'help':
      loopLines(help, '', 80);
      break;
    case 'about':
      loopLines(about, '', 80);
      break;
    case 'social':
      loopLines(social, '', 80);
      break;
    case 'twitter':
      addLine('Opening Twitter...', '', 0);
      newTab(twitter);
      break;
    case 'linkedin':
      addLine('Opening LinkedIn...', '', 0);
      newTab(linkedin);
      break;
    case 'github':
      addLine('Opening GitHub...', '', 0);
      newTab(github);
      break;
    case 'history':
      addLine('<br>', '', 0);
      loopLines(commandHistory, 'cmds', 80);
      addLine('<br>', '', 80 * commandHistory.length + 50);
      break;
    case 'clear':
      clearScreen();
      break;
    default:
      addLine(
        'Command not found. Type <span class="cmds">[help]</span> for a list of available commands.',
        '',
        100
      );
      break;
  }
}
// command history
let commandHistory = [];
// clear the terminal
function clearScreen() {
  setTimeout(function () {
    TERMINAL.innerHTML = '<a id="before"></a>';
    before = document.getElementById('before');
  }, 1);
}
// open links
function newTab(link) {
  setTimeout(function () {
    window.open(link, '_blank');
  }, 500);
}
// print prompt on output
function printPrompt(cmd) {
  let prompt = document.createElement('p');
  prompt.innerHTML = `<span>guest</span><span class="alt">@</span><span class="cmds">jansarcade</span><span class="alt">: ~ $ <span class="${isValidCommand(
    INPUT.value
  )}">${cmd}</span></span>`;
  prompt.className = 'prompt';
  before.parentNode.insertBefore(prompt, before);
}
// style input validity
function isValidCommand(textInput) {
  let style = '';
  if (commandList.includes(textInput)) {
    style = 'cmds';
  } else {
    style = 'error';
  }
  return style;
}
function liveValidCommand(textInput) {
  if (isValidCommand(textInput) === 'error') {
    CLI.classList.add('notValid');
  } else {
    CLI.classList.remove('notValid');
  }
}
