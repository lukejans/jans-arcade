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
  CLI.innerHTML = INPUT.value.replace(/ /g, '<span class="hide">_</span>');
  liveValidCommand(INPUT.value.trim());
  caret.updateMoves('');
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
const caret = {
  mR: 0,
  mL: undefined,

  reStyle: function (move) {
    if (move === 'left') {
      CARET.style.left = parseInt(CARET.style.left) - 9 + 'px';
    } else if (move === 'right') {
      CARET.style.left = parseInt(CARET.style.left) + 9 + 'px';
    }
  },

  updateMoves: function (move) {
    if (move === 'left') {
      caret.mR++;
    } else if (move === 'right') {
      caret.mR--;
    }
    caret.mL = INPUT.value.length - caret.mR;
  },

  init: function () {
    CARET.style.left = '0px';
  },
};
// init
caret.init();
window.addEventListener('keydown', updateCaret);
// change caret location based on key
function updateCaret(e) {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
  } else if (e.key === 'ArrowLeft' && caret.mL !== 0) {
    caret.updateMoves('left');
    caret.reStyle('left');
  } else if (e.key === 'ArrowRight' && caret.mR !== 0) {
    caret.updateMoves('right');
    caret.reStyle('right');
  } else if (e.key === 'Space') {
    e.preventDefault();
    cliDisplayInput();
  } else if (e.key === 'Enter') {
    e.preventDefault();

    let a = INPUT.value.trim();
    commandHistory.push(a);

    printPrompt(a);
    commandOutput(a);

    INPUT.value = '';
    cliDisplayInput();
  }
}

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
    case 'link':
      loopLines(link, '', 80);
      break;
    case 'link -t':
      addLine('Opening Twitter...', '', 0);
      newTab(twitter);
      break;
    case 'link -in':
      addLine('Opening LinkedIn...', '', 0);
      newTab(linkedin);
      break;
    case 'link -gh':
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
    INPUT.value.trim()
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
// change color while typing
function liveValidCommand(textInput) {
  if (isValidCommand(textInput) === 'error') {
    CLI.classList.add('notValid');
  } else {
    CLI.classList.remove('notValid');
  }
}
