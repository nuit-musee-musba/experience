import { updateIslandInformation } from "./helpers";
import data from "./data";

// Modifiable
const infoTitle = document.getElementById("infoTitle");
const infoDescription = document.getElementById("infoText");
const infoButton = document.getElementById("startButton");

window.experience = window.experience || {};

////////////////////////////SCROLL LOGIC////////////
const rotationFactor = 0.001;
const powerFactor = 0.5;
const parts = 5;
const circle = Math.PI * 2;
const deceleration = 1;
const maxVelocity = 100;
let isRotating = false;

let rotation = 0;
let index = 0;
let direction = 1;
let velocity = 0;

let lastX = 0;
let moveX = 0;
let isTouching = false;

function updateRotation(delta) {
  rotation = (rotation + delta) % circle;
  index = Math.floor(((rotation + circle / (2 * parts)) / circle) * parts);
  index = (index + parts) % parts;
}

window.addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  if (!touch) return;
  isTouching = true;
  lastX = touch.clientX;
  velocity = 0;
});

// Touch move
window.addEventListener("touchmove", (event) => {
  isTouching = true;
  isRotating = true;
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
  velocity === 0 ? (isRotating = false) : (isRotating = true);
  console.log(velocity);
  if (!isTouching) {
    updateRotation(velocity * direction * rotationFactor);
  }

  window.experience.carousel.rotation.y = rotation;
  updateIslandInformation(index, data, infoTitle, infoDescription, infoButton);
};

// Event listener for click
window.addEventListener("click", () => {
  console.log(isRotating);

  // Calculate the target rotation based on 'index'
  if (!isRotating) {
    rotation = index * (circle / parts);
  }
});
