/* 
    TERMINAL
      
*/

// query the dom
let before = document.getElementById('before'); // changes on clear cmd
const CLI = document.querySelector('.command-line');
const CARET = document.querySelector('.caret');
const TERMINAL = document.querySelector('.terminal-output');

// update command line with input
function cliDisplayInput() {}

// create elements with text then add to dom
function addLine(content, style, time) {
  let curLine = '';
  // build line
  for (let i = 0; i < content.length; i++) {
    if (content.charAt(i) == ' ' && content.charAt(i + 1) == ' ') {
      curLine += '&nbsp;';
      i++;
    } else {
      curLine += content.charAt(i);
    }
  }
  // print line to dom
  setTimeout(function () {
    let line = document.createElement('pre');
    line.innerHTML = curLine;
    line.className = style;

    before.parentNode.insertBefore(line, before);
  }, time);
}

// given an array of text to display run addLine on each arr[i]
function loopLines(content, style, time) {
  content.forEach(function (item, index) {
    addLine(item, style, index * time);
  });
}

/*
    TERMINAL OUTPUTS

    valid commands to run on input
*/
const introBanner = {
  connected: `<span class="text">Connected at ${getCurrentTime()}</span>`,
  banner: [
    '  ___',
    '  ,"---".',
    '  :         ;',
    "  `-.-'",
    '  | |',
    '  | |',
    '  | |',
    '    _.-\\_/-._  ',
    '  _ / |         |  \\ _ ',
    "  / /     `---'     \\ \\",
    "  /    `-----------'    \\",
    '  /,-""-.             ,-""-.\\',
    `  ( i-..-i             i-..-i )`,
    "  |`|        |-------|        |'|",
    "  \\ '-..-'    |=|    '-..-' /",
    "  `------------------'",
    '     __                 ',
    '      __ / /__   ___   ___',
    '    / // / _ `/ _ \\(_-<',
    '    ___\\___/\\_,_/_//_/___/__  ',
    '   / _ | ___________ ____/ /__',
    '   / __ |/ __/ __/ _ `/ _   / -_)',
    '/_/ |_/_/   \\__/\\_,_/\\_,_/\\__/ ',
    '                                             © 2024',
  ],
  message: '<span class="text">Please select a game mode</span>',
};

// display intro banner
setTimeout(function () {
  addLine(introBanner.connected, 'text', 0);
  loopLines(introBanner.banner, 'banner', 80);
  addLine(introBanner.message, 'text', 80 * introBanner.banner.length);
}, 100);

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
