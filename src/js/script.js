import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  createIsland,
  rotateCarousel,
  updateIslandInformation,
} from "./helpers";
import data from "./data";
import { cos } from "three/examples/jsm/nodes/Nodes.js";

/// Start info box data
let infoTitle = document.getElementById("infoTitle");
let infoDescription = document.getElementById("infoText");
let infoButton = document.getElementById("startButton");

document.addEventListener("DOMContentLoaded", function () {
  // Set initial info box data
  infoTitle.innerHTML = data[0].title;
  infoDescription.innerHTML = data[0].description;
  infoButton.addEventListener("click", function () {
    const url = data[0].path;
    window.location.href = url;
    // camera.position.set(0, 3, 7);
  });
});

// Create scene
const scene = new THREE.Scene();

// Target canvas
var canvas = document.getElementById("webgl");

// Create camera
const camera = new THREE.PerspectiveCamera(
  10,
  canvas.clientWidth / canvas.clientHeight, // Use canvas dimensions
  0.1,
  2000
);
camera.position.set(0, 2.5, -6.5);
camera.lookAt(0, 0, 0);

// Create Renderer
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas: canvas,
});
renderer.setSize(canvas.clientWidth, canvas.clientHeight); // Use canvas dimensions

// // Add renderer to DOM
document.body.appendChild(renderer.domElement);

// Add light
const light = new THREE.DirectionalLight(0xffffff, 4);
// const light = new THREE.AmbientLight(0x404040, 3); // soft white light
light.position.set(0, 1, 1);
scene.add(light);

// Carousel : Group of islands
const carousel = new THREE.Group();
// Calibrate rotation to set carousel in good position
carousel.rotation.set(0, 0, 0); //

// Create an array to store promises for each world creation
const islandPromises = [];

const islands = [];

// Count of islands
const count = 5;
// Create islands
for (let i = 0; i < count; i++) {
  const color = data[i].color;
  const islandPromise = createIsland(i, count, color)
    .then((island) => {
      // Add axes helper to the island
      carousel.add(island);
      islands.push(island);
    })
    .catch((error) => {
      console.error("Error creating island:", error);
    });

  islandPromises.push(islandPromise);
  // console.log("island id", islandPromise.userData.id);
}
// Show loader while worlds are loading
const loaderElement = document.getElementById("loader");
loaderElement.style.display = "flex";

// Wait for all promises to resolve
// Use an IIFE to handle async code without top-level await
(async () => {
  try {
    await Promise.all(islandPromises);
  } catch (error) {
    console.error("Error creating worlds:", error);
  } finally {
    // Hide loader once all worlds are loaded or an error occurs
    loaderElement.style.display = "none";
  }
})();

// Add carousel to scene once all worlds are added
scene.add(carousel);

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Handle scroll/wheel event for desktop
canvas.addEventListener("wheel", (event) => {
  event.preventDefault(); // Prevent default scroll behavior
  const scrollPosition = event.deltaX % window.innerWidth; // Use deltaX for horizontal scrolling
  carousel.rotation.y += (-scrollPosition * Math.PI) / window.innerWidth;
});

// Handle touch events for mobile

////// Alexis code
// Store the interval ID

const pi = Math.PI;
let rotation = 0;
let lastX = 0; // last x position or pointer position
let speed = 0; // speed of the swipe
let power = 12; // power of the swipe
let direction = 1; // 1 for right, -1 for left
let moveX = 0; // move x position or pointer position
let index = 0;
const circle = Math.PI * 2;
const parts = 5;
let touchEndProcessing = false; // Flag to indicate if touchend is still processing
let isTouching = false;

function rotateX(quantity) {
  console.log("rotation", rotation);

  rotation = rotation + quantity;
  carousel.rotation.y = (rotation * pi) / pi;
}

// Touch start
canvas.addEventListener("touchstart", (event) => {
  isButtonClickable = false;
  console.log("index: ", index);
  if (touchEndProcessing) return; // Prevent touch start if touch end is still processing
  // TODO: Fix scroll bug in the carousel when touching the screen in the upper part of the screen
  isTouching = true;
  lastX = event.touches[0].clientX / canvas.clientWidth;
});

// Touch move
canvas.addEventListener("touchmove", (event) => {
  event.preventDefault(); // Prevent default touch behavior
  if (!isTouching) return;
  console.log("MOVING");
  // I set the speed for the touchend part
  speed =
    Math.abs(lastX - event.touches[0].clientX / canvas.clientWidth) * power;

  // set direction left or right
  direction = lastX < event.touches[0].clientX / canvas.clientWidth ? 1 : -1;

  moveX = lastX - event.touches[0].clientX / canvas.clientWidth;

  rotateX(-moveX);
  lastX = event.touches[0].clientX / canvas.clientWidth;
  index = ((rotation + (pi * 2) / 5 / 2) / circle) * parts;
  index = Math.floor(index % parts);
  index = index >= 0 ? index : index + parts;
  console.log("index: ", index);
  updateIslandInformation(index, data, infoTitle, infoDescription, infoButton);
  console.log("index: ", index);
});

// Touch end
canvas.addEventListener("touchend", () => {
  console.log("TouchEnd Processing: ", touchEndProcessing);
  if (touchEndProcessing) {
    return;
  }

  console.log("TOUCHEND");
  touchEndProcessing = true; // Set touch end processing flag to true
  index = direction === 1 ? index : index + parts;
  isTouching = false;
  // Calculate landing rotation based on speed and power
  const landingRotation = rotation + speed * power * direction;
  // Find the closest rotation value
  const closestRotation =
    Math.round(landingRotation / (circle / parts)) * (circle / parts);
  // Smoothly rotate to the closest rotation value
  const rotateToClosest = () => {
    const deltaRotation = (closestRotation - rotation) * 0.025; // Adjust the smoothing factor as needed
    rotation += deltaRotation;
    index = ((rotation + (pi * 2) / 5 / 2) / circle) * parts;
    index = Math.floor(index % parts);
    index = index >= 0 ? index : index + parts;
    console.log("index: ", index);
    updateIslandInformation(
      index,
      data,
      infoTitle,
      infoDescription,
      infoButton
    );
    carousel.rotation.y = (rotation * pi) / pi;
    const rotationDifference = Math.abs(closestRotation - rotation);
    if (rotationDifference > 0.01) {
      requestAnimationFrame(rotateToClosest);
    } else {
      touchEndProcessing = false; // Reset touch end processing flag
      isButtonClickable = true; // Reset buttons
    }
  };
  rotateToClosest();
  index = index;
});

// Touch cancel
canvas.addEventListener("touchcancel", () => {
  isTouching = false;
});

const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const buttonLoaderRight = document.querySelector(".button-loader-right");
const buttonLoaderLeft = document.querySelector(".button-loader-left");
let rotate = false;

let isButtonClickable = true;

function handleButtonClick(direction) {
  if (!isButtonClickable) {
    return;
  }

  console.log("Current Index", index);

  isButtonClickable = false;

  index = direction === "right" ? index - 1 : index === 4 ? 0 : index + 1;
  if (index < 0) {
    index = 4;
  } else {
    index = index;
  }
  console.log("New Index", index);

  const buttonLoader =
    direction === "right" ? buttonLoaderRight : buttonLoaderLeft;
  buttonLoader.style.display = "flex";

  rotateCarousel(direction, rotate, carousel);
  updateIslandInformation(index, data, infoTitle, infoDescription, infoButton);

  setTimeout(() => {
    isButtonClickable = true;
    buttonLoader.style.display = "none";
  }, 600);
}

rightButton.addEventListener("click", () => handleButtonClick("right"));
leftButton.addEventListener("click", () => handleButtonClick("left"));

// Render loop
const animate = () => {
  requestAnimationFrame(animate);

  // if (autoRotate) {
  //   carousel.rotation.y += -(Math.PI * 2) / window.innerWidth;
  // }

  // Render the scene
  renderer.render(scene, camera);
};

animate();
