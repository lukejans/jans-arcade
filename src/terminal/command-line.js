/* 
    COMMAND LINE

      brief: when a user clicks anywhere on the screen it focuses the user
             to a hidden text area where they can type. What is typed in the 
             textarea is then read and displayed in the command line. Upon 
             enter key press if the command is valid the corresponding output
             will print.
*/
// display intro output
setTimeout(function () {
  addLine(
    `<span class="text">Connected at ${getCurrentTime()}</span>`,
    'text',
    0
  );
  loopLines(banner, 'banner', 80);
  addLine(
    '<span class="text">Please select a game mode</span>',
    'text',
    80 * banner.length + 50
  );
  INPUT.focus();
}, 100);

// query the dom
let before = document.getElementById('before'); // changes on clear cmd
const CLI = document.querySelector('.command-line');
const INPUT = document.getElementById('type');
const CARET = document.querySelector('.caret');
const TERMINAL = document.querySelector('.terminal-output');

// focus on textarea (INPUT)
window.addEventListener('click', function (event) {
  if (event.target !== INPUT) {
    INPUT.focus();
  }
});

// update command line with input
function cliDisplayInput() {
  // account for blank space collapsing
  CLI.innerHTML = INPUT.value.replace(/ /g, '<span class="hide">_</span>');
  liveValidCommand(INPUT.value.trim());
}

// create elements with text then add to dom
function addLine(text, style, time) {
  let curLine = '';
  // build line
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) == ' ' && text.charAt(i + 1) == ' ') {
      curLine += '&nbsp;';
      i++;
    } else {
      curLine += text.charAt(i);
    }
  }
  // print line to dom
  setTimeout(function () {
    let line = document.createElement('pre');
    line.innerHTML = curLine;
    line.className = style;

    before.parentNode.insertBefore(line, before);

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
    COMMANDS

    valid commands to run on input
*/
function commandOutput(cmd) {
  switch (cmd.toLowerCase()) {
    case 'banner':
      loopLines(banner, 'banner', 80);
      break;
    case 'clear':
      clearScreen();
      break;
    default:
      addLine(`JansArcade: command not found: ${cmd}`, '', 10);
      addLine(
        `Type <span class="cmds">'help'</span> for a list of available commands.`,
        'text',
        20
      );
      addLine('<br>', 'text', 50);

      break;
  }
}

// clear the terminal command
function clearScreen() {
  setTimeout(function () {
    TERMINAL.innerHTML = '<a id="before"></a>';
    before = document.getElementById('before');
  }, 1);
}

/* 
    CLOCK

    for displaying time in the terminal section
*/
// get current time
function getCurrentTime() {
  const time = new Date();
  return (
    String(time.getHours()).padStart(2, '0') +
    ':' +
    String(time.getMinutes()).padStart(2, '0') +
    ':' +
    String(time.getSeconds()).padStart(2, '0')
  );
}

function updateClock() {
  const timeString = getCurrentTime();
  document.getElementById('clock').innerText = timeString;
}

/*
    PROMPT

    functions for printing the command prompt
*/
// print prompt on output
function printPrompt(cmd) {
  let prompt = document.createElement('p');
  prompt.innerHTML = `
  <span>guest</span><span class="alt">@</span><span class="cmds">jansarcade</span>
  <span class="alt">  
  <span class="${isValidCommand(INPUT.value.trim())}">\> </span>
  <span class="${isValidCommand(INPUT.value.trim())}">${cmd}</span>
  </span>`;
  prompt.className = 'prompt';
  before.parentNode.insertBefore(prompt, before);
}

// utility function to manage class changes
function manageClasses(element, removeClasses, addClass) {
  removeClasses.forEach((className) => element.classList.remove(className));
  element.classList.add(addClass);
}
