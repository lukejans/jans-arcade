/* 
    COMMAND LINE

    display input from hidden textarea in the
    command line interface (cli) and display output 
    from commands entered.
*/
// display intro output
setTimeout(function () {
  loopLines(banner, 'banner', 80);
  INPUT.focus();
}, 100);
// query the dom
let before = document.getElementById('before'); // changes on clear cmd
const CLI = document.querySelector('.command-line');
const INPUT = document.getElementById('type');
const CARET = document.querySelector('.caret');
// focus on textarea (INPUT)
window.addEventListener('click', function (event) {
  if (event.target !== INPUT) {
    INPUT.focus();
  }
});
// update command line with input
function cliDisplayInput() {
  CLI.textContent = INPUT.value;
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
// print prompt on each output
function printPrompt(context = '') {}
/*
    CARET

    terminal caret movements & cmd history scroll 
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
/*
    COMMANDS

    valid commands to run on input
*/
function commander(cmd) {
  switch (cmd.toLowerCase()) {
    case 'help':
      loopLines(help, 'color2 margin', 80);
      break;
    case 'whoami':
      loopLines(whoami, 'color2 margin', 80);
      break;
    case 'social':
      loopLines(social, 'color2 margin', 80);
      break;
    case 'projects':
      loopLines(projects, 'color2 margin', 80);
      break;
    case 'history':
      addLine('<br>', '', 0);
      loopLines(commands, 'color2', 80);
      addLine('<br>', 'command', 80 * commands.length + 50);
      break;
    case 'clear':
      setTimeout(function () {
        terminal.innerHTML = '<a id="before"></a>';
        before = document.getElementById('before');
      }, 1);
      break;
    case 'banner':
      loopLines(banner, '', 80);
      break;
    // socials
    case 'twitter':
      addLine('Opening Twitter...', 'color2', 0);
      newTab(twitter);
      break;
    case 'linkedin':
      addLine('Opening LinkedIn...', 'color2', 0);
      newTab(linkedin);
      break;
    case 'github':
      addLine('Opening GitHub...', 'color2', 0);
      newTab(github);
      break;
    // not a command
    default:
      addLine(
        '<span class="inherit">Command not found. For a list of commands, type <span class="command">\'help\'</span>.</span>',
        'error',
        100
      );
      break;
  }
}
