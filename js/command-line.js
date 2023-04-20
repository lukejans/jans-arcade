/* 
    COMMAND LINE

    display commands from hidden textarea in the
    command line interface (cli)
*/
const CLI = document.querySelector('.command-line');
const INPUT = document.getElementById('type');
// focus on textarea (INPUT)
window.addEventListener('click', function (event) {
  if (event.target !== INPUT) {
    INPUT.focus();
  }
});
// function to run onInput
function cliDisplayInput() {
  CLI.textContent = INPUT.value;
}
