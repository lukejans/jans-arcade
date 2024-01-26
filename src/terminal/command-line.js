/* 
    Command Line
      
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
}, 100);

// query the dom
let before = document.getElementById('before'); // changes on clear cmd
const CLI = document.querySelector('.command-line');
const CARET = document.querySelector('.caret');
const TERMINAL = document.querySelector('.terminal-output');

// update command line with input
function cliDisplayInput() {}

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

// utility function to manage class changes
function manageClasses(element, removeClasses, addClass) {
  removeClasses.forEach((className) => element.classList.remove(className));
  element.classList.add(addClass);
}
