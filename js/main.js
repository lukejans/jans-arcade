let before = document.getElementById('before');

setTimeout(function () {
  loopLines(banner, 'banner', 80);
  INPUT.focus();
}, 100);

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
// add lines to page and scrolls while output grows
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
    let next = document.createElement('p');
    next.innerHTML = t;
    next.className = style;
    // next.classList.add('typing');

    before.parentNode.insertBefore(next, before);

    window.scrollTo(0, document.body.offsetHeight);
  }, time);
}
// given text to display, style and time to display -> run addLine()
function loopLines(name, style, time) {
  name.forEach(function (item, index) {
    addLine(item, style, index * time);
  });
}
let phrase = 'test';
let currentPhrase = [];
let i = 0;
function typeText(context) {
  context.innerHTML = currentPhrase.join('');
  if (i < phrase.length) {
    currentPhrase.push(phrase[i]);
    i++;
    setTimeout(typeText, 20);
  } else {
    i = 0;
    currentPhrase = [];
  }
}
