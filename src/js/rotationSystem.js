import { updateIslandInformation } from "./helpers";
import data from "./data";

// Modifiable
const infoDescription = document.getElementById("infoText");
const infoButton = document.getElementById("startButton");

window.experience = window.experience || {};

window.experience.index = 0;
window.experience.rotation = 0;
window.experience.isRotating = false;
window.experience.canRotate = true;

////////////////////////////SCROLL LOGIC////////////
const rotationFactor = 0.001;
const powerFactor = 0.8;
const parts = 5;
const circle = Math.PI * 2;
const deceleration = 1;
const maxVelocity = 100;

// let rotation = 0;
// let window.experience.index = 0;
let direction = 1;
let velocity = 0;

let lastX = 0;
let moveX = 0;
let isTouching = false;

function updateRotation(delta) {
  window.experience.rotation = (window.experience.rotation + delta) % circle;
  window.experience.index = Math.floor(
    ((window.experience.rotation + circle / (2 * parts)) / circle) * parts
  );
  window.experience.index = (window.experience.index + parts) % parts;
}

window.addEventListener("touchstart", (event) => {
  // Add this line to prevent rotation when the user is not allowed to rotate (i.e. when the user is in the first scene and the carousel is not visible)
  if (!window.experience.canRotate) {
    console.log("Can rotate? ", window.experience.canRotate);
    return;
  }
  const touch = event.touches[0];
  if (!touch) return;
  isTouching = true;
  lastX = touch.clientX;
  velocity = 0;
});

// Touch move
window.addEventListener("touchmove", (event) => {
  isTouching = true;
  window.experience.isRotating = true;

  if (!window.experience.canRotate) {
    console.log("Can rotate? ", window.experience.canRotate);
    return;
  }
  const touch = event.touches[0];
  if (!touch) return;

  velocity = Math.abs(lastX - touch.clientX) * powerFactor;
  direction = lastX < touch.clientX ? 1 : -1;
  moveX = lastX - touch.clientX;

  if (touch.clientY < window.innerHeight / 4) {
    direction *= -1;
    moveX *= -1;
  }

  updateRotation(-moveX * rotationFactor);

  lastX = touch.clientX;
});

window.addEventListener("touchend", (event) => {
  isTouching = false;
});

window.experience.updateCarouselRotation = function () {
  velocity = Math.max(0, velocity - deceleration);
  velocity = Math.min(maxVelocity, velocity);
  velocity === 0
    ? (window.experience.isRotating = false)
    : (window.experience.isRotating = true);

  if (!isTouching) {
    if (window.experience.autoRotate) {
      updateRotation(0.002);
    } else {
      updateRotation(velocity * direction * rotationFactor);
    }
  }
  window.experience.carousel.rotation.y = window.experience.rotation;
  updateIslandInformation(
    window.experience.index,
    data,
    frontTitle,
    infoDescription,
    infoButton
  );
};
