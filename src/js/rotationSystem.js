import { updateIslandInformation } from "./helpers";
import * as THREE from "three";

import data from "./data";

// Modifiable
const infoDescription = document.getElementById("infoText");
const infoButton = document.getElementById("startButton");

// Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

window.experience = window.experience || {};

window.experience.index = 0;
window.experience.rotation = 0;
window.experience.isRotating = false;
window.experience.canRotate = true;

// Constants
const rotationFactor = 0.001;
const powerFactor = 0.8;
const parts = 5;
const circle = Math.PI * 2;
const deceleration = 1;
const maxVelocity = 100;

// Variables
let direction = 1;
let velocity = 0;
let inititalPointer = 0;
let finalPointer = 0;
let lastX = 0;
let lastY = 0;
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
  // Stop aurto rotation when the user starts touch
  // window.experience.autoRotate = false;
  // Raycaster
  pointer.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.touches[0].clientY / window.innerHeight) * 2 + 1;
  inititalPointer = pointer

  console.log("Start", pointer);

  // Add this line to prevent rotation when the user is not allowed to rotate (i.e. when the user is in the first scene and the carousel is not visible)
  if (!window.experience.canRotate) {
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
  window.experience.autoRotate = false;

  if (!window.experience.canRotate) {
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
  lastY = touch.clientY;

});

window.addEventListener("touchend", (event) => {
  isTouching = false;
  // Raycaster
  pointer.x = (lastX / window.innerWidth) * 2 - 1;
  pointer.y = - (lastY / window.innerHeight) * 2 + 1;

  finalPointer = pointer

  // HEre will be the logic to capture the click on the island

  if (inititalPointer.x === finalPointer.x && inititalPointer.y === finalPointer.y) {
    console.log("Click!")
    console.log(window.experience.camera)
    raycaster.setFromCamera(pointer, window.experience.camera);
    console.log(raycaster)
    const intersects = raycaster.intersectObjects(window.experience.carousel.children);
    if (intersects.length > 0) {
      console.log("Intersected in an element")
      const intersectedObject = intersects[0].object;
      console.log(intersectedObject);
      if (intersectedObject instanceof THREE.Mesh || intersectedObject instanceof THREE.Object3D) {
        console.log("Intersected in an islanf")

        const id = intersectedObject.userData.id;
        window.experience.clickedOnExperience = true;
        window.location.href = data[id - 1].path;
      }
    }
  }
  console.log("End", pointer);
});

window.experience.updateCarouselRotation = function () {


  // Update the rotation
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
