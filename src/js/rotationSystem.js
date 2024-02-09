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
window.experience.onZoom = false;

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
  inititalPointer = pointer.x


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
  finalPointer = pointer.x


  // HEre will be the logic to capture the click on the island

  if (inititalPointer === finalPointer) {

    if (!window.experience.clickedOnExperience) {
      raycaster.setFromCamera(pointer, window.experience.camera);//
      const carousel = window.experience.scene.children[1];
      if (carousel.isObject3D) {
        const intersects = raycaster.intersectObjects(window.experience.scene.children, true); // Set recursive flag to true
        if (intersects.length > 0) {
          const intersectedElement = intersects[0];
          if (intersectedElement.object.type === "Mesh") {
            try {
              const islandElement = intersectedElement.object.parent
              const islandId = islandElement.userData.id;
              const islandName = islandElement.userData.islandName;
              window.experience.clickedOnExperience = true;
              window.experience.clickedIndex = islandId - 1;

            } catch (error) {
              console.error("Error in raycast click", error);
            }
          }
        }
      } else {
        console.log('Carousel is not 3D object', carousel)
      }
    }


  } else {
    window.experience.onZoom = false

  }
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
