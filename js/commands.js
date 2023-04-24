/* 
    COMMANDS
    
    all commands output
*/
const banner = [
  '              ___',
  '            ,"---".',
  '            :     ;',
  "             `-.-'",
  '              | |',
  '              | |',
  '              | |',
  '           _.-\\_/-._',
  '        _ / |     | \\ _',
  "       / /   `---'   \\ \\              __                    ___                        __   ",
  "      /  `-----------'  \\            / /___  ____  _____   /   |  _____ ____ ___  ____/ /__ ",
  '     /,-""-.       ,-""-.\\      __  / / __ `/ __ \\/ ___/  / /| | / ___/ ___/ __ `/ __  / _ \\',
  '    ( i-..-i       i-..-i )    / /_/ / /_/ / / / (__  )  / ___ |/ /  / /__/ /_/ / /_/ /  __/',
  "    |`|    |-------|    |'|    \\____/\\__,_/_/ /_/____/  /_/  |_/_/   \\___/\\__,_/\\__,_/\\___/ ",
  "    \\ `-..-'  ,=.  `-..-'/                                                          © 2023",
  "     `--------|=|-------'",
  '              | |___________________________________________________________________________',
  '              \\____________________________________________________________________________/',
  '<br>',
  '<span class="text">Welcome to my interactive arcade terminal.</span>',
  '<span class="text">Type <span class="cmds">[help]</span> for a list of available commands.</span>',
];
const help = [
  '<br>',
  '<span class="cmds">about</span>         project description',
  '<span class="cmds">help</span>          list of available commands',
  '<span class="cmds">banner</span>        print arcade banner',
  '<span class="cmds">social</span>        links to social media accounts',
  '<span class="cmds">clear</span>         clear screen & command history',
  '<span class="cmds">history</span>       display command history',
  '<br>',
];

const about = [
  '<br>',
  '<span class="alt">Alpha Build</span>',
  "Terminal themed arcade to showcase various games I've ",
  'built while learning javascript via <a>The Odin Project</a>.',
  'This is an early stage version of the terminal.',
  '<br>',
];

// list of commands
const commandList = ['banner', 'help', 'about', ''];
// check input validity
function isValidCommand(textInput) {
  return commandList.includes(textInput);
}
// CONSOLE ART
console.log(
  `       __                    ___                        __ \n      / /___ _____  _____   /   |  ______________  ____/ /__    \n __  / / __ \\/ __ \\/ ___/  / /| | / ___/ ___/ __ \\/ __  / _ \\ \n/ /_/ / /_/ / / / (__  )  / ___ |/ /  / /__/ /_/ / /_/ /  __/ \n\\____/\\__,_/_/ /_/____/  /_/  |_/_/   \\___/\\__/_/\\__,_/\\___/ `
);
