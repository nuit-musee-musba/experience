var speech_area = document.getElementById("dialog");
var speech_area__parent = document.getElementById("game-top");
let currentIndex = 0;
let textSpeed = 25;
let active_bulle = false;
let isAnimating = false;
let old_text = "";
let loopId = 0;

speech_area__parent.addEventListener("touchstart", (e) => {
  textSpeed = 10;
});

function fadeOut() {
  if (!active_bulle) {
    speech_area.style.opacity = 0;
    textSpeed = 35;
  }
}

function animateText(speech, thisLoopId) {
  if (old_text != speech) {
    if (thisLoopId == loopId - 1) {
      //permet de stopper la boucle n-1 lorsque un nouvelle est entamée pour éviter que les deux textes se melangent
      console.log("different text detected while animation is on, aborted.");
      return;
    }
  } else {
    if (currentIndex < speech.length) {
      speech_area.textContent += speech.charAt(currentIndex);
      currentIndex++;
      setTimeout(() => animateText(speech), textSpeed); // Délai entre chaque lettre
    }
    if (currentIndex == speech.length) {
      setTimeout(fadeOut, 5000);
      active_bulle = false;
      isAnimating = false;
    }
  }
}

function init(text) {
  speech_area.textContent = "";
  currentIndex = 0;
  loopId++;
  animateText(text, loopId);
}

export function print_chef_speech(text) {
  speech_area.style.opacity = 1;
  old_text = text;
  init(text);
  active_bulle = true;
}
