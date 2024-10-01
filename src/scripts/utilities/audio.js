/**
 *  Audio 
 * 
 * create audio elements and query larger preloaded audio
 * file as well as adjust audio levels.
 */

const audioContext = new window.AudioContext();

async function loadAudio(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
}

function playSound(buffer, volume = 1) {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;

  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume;

  source.connect(gainNode).connect(audioContext.destination);
  source.start(0);
}


const soundEffects = (() => {
  let carouselClickSound, successfulClick, unsuccessfulClick, confirmClick, points, termLoadAudio;

  // Load all audio files into buffers
  (async () => {
    carouselClickSound = await loadAudio('/assets/audio/carouselClick.mp3');
    successfulClick = await loadAudio('/assets/audio/successfulClick.mp3');
    unsuccessfulClick = await loadAudio('/assets/audio/unsuccessfulClick.mp3');
    confirmClick = await loadAudio('/assets/audio/confirmClick.mp3');
    points = await loadAudio('/assets/audio/points.mp3');    
    termLoadAudio = await loadAudio('/assets/audio/terminal-load.mp3');
  })();

  // Play functions
  function playCarouselClick() { playSound(carouselClickSound, 0.15); }
  function playSuccessfulClick() { playSound(successfulClick, 0.2); }
  function playUnsuccessfulClick() { playSound(unsuccessfulClick, 0.8); }
  function playConfirmClick() { playSound(confirmClick, 0.2); }
  function playPoints() { playSound(points, 0.2); }
  function playTerminalLoad() { playSound(termLoadAudio, 0.05); }

  return { playTerminalLoad, playCarouselClick, playSuccessfulClick, playUnsuccessfulClick, playConfirmClick, playPoints, termLoadAudio };
})();

export { soundEffects };
