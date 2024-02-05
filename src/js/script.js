import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  createIsland,
  closestRotationValue,
  rotateCarousel,
  updateIslandInformation,
} from "./helpers";
import data from "./data";

/// Starti info box data
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
camera.position.set(0, 3, 8);
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
light.position.set(0, 3, 3);
scene.add(light);

// Carousel : Group of islands
const carousel = new THREE.Group();
// Calibrate rotation to set carousel in good position
carousel.rotation.set(0, Math.PI, 0);

const axesHelper = new THREE.AxesHelper(30);
axesHelper.setColors("white", "green", "blue");
carousel.add(axesHelper);
// Raycaster : raycasting to detect mouse click or hover on 3D objects
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Create an array to store promises for each world creation
const islandPromises = [];

// Count of worlds
const count = 5;

let currentIslandIndex = 0;
// Create worlds
for (let i = 0; i < count; i++) {
  const color = data[i].color;
  const islandPromise = createIsland(i, count, color)
    .then((island) => {
      // Add axes helper to the island
      carousel.add(island);
    })
    .catch((error) => {
      console.error("Error creating island:", error);
    });

  islandPromises.push(islandPromise);
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

// // Chose documet over window as it is more performant
// canvas.addEventListener("click", onMouseClick);

// Handle scroll/wheel event for desktop
canvas.addEventListener("wheel", (event) => {
  event.preventDefault(); // Prevent default scroll behavior
  const scrollPosition = event.deltaX % window.innerWidth; // Use deltaX for horizontal scrolling
  carousel.rotation.y += (-scrollPosition * Math.PI) / window.innerWidth;
});

// Handle touch events for mobile

// Declare Touch variables
let touchMoveX = 0;
let isTouching = false;
let deltaX = 0;
let firstTouch = 0;
let startTouch = 0;
let endTouch = 0;
// Create the rotationPositions array with both positive and negative values
// Define the carousel rotation step and the desired number of positions
const rotationStep = (2 * Math.PI) / 5; // Adjust as needed
const numberOfPositions = 5; // Adjust as needed

// Calculate the starting rotation value based on the current rotation of the carousel
const initialRotation = Math.PI; // Adjust as needed

// Generate the rotationPositions array
let rotationPositions = Array.from(
  { length: numberOfPositions * 2 },
  (_, index) => {
    const position = index % numberOfPositions;
    return (
      initialRotation + rotationStep * position * (index % 2 === 0 ? 1 : -1)
    );
  }
);
rotationPositions = Array.from(new Set(rotationPositions)).sort(
  (a, b) => a - b
);

let startRefRotation = carousel.rotation.y;
// Add a variable to store the current rotation of the carousel
let currentRotation = 0;

let realDifference = 0;

let closestRotation = 0;

let timesSurpassed = 0;

// Add a variable to store the current rotation index
// Touch event handlers

// Touch start
canvas.addEventListener("touchstart", (event) => {
  // TODO: Fix scroll bug in the carousel when touching the screen in the upper part of the screen
  isTouching = true;
  startTouch = event.touches[0].clientX / canvas.clientWidth;
  firstTouch = startTouch;
  closestRotation = startRefRotation;
  console.log("First touch at", firstTouch);
  console.log("Initial carousel rotation", carousel.rotation.y);
  console.log("Current island index", currentIslandIndex);
  console.log("Positions", rotationPositions);
});

// Touch move
canvas.addEventListener("touchmove", (event) => {
  event.preventDefault(); // Prevent default touch behavior

  // Calculate the touch movement on the canvas in normalized device coordinates
  touchMoveX = event.touches[0].clientX / canvas.clientWidth;

  // Calculate the deltaX for the carousel rotation
  deltaX = touchMoveX - startTouch;

  // Calculate the scroll position based on the touch movement on the canvas
  const scrollPosition = (deltaX * canvas.clientWidth) % canvas.clientWidth;

  // Update the carousel rotation based on the scroll position
  carousel.rotation.y += (scrollPosition * (Math.PI * 2)) / canvas.clientWidth;

  // Update the currentRotation variable to use it in the touch end event
  currentRotation = carousel.rotation.y;

  // Update the touch start position after each move
  startTouch = touchMoveX;

  // Check if the carousel rotation distance surpassed the half of the rotation step
  const rotationSurpassedStep =
    Math.abs(currentRotation - startRefRotation) > rotationStep / 2;

  // Calculate the real difference between the current rotation and the start reference rotation
  realDifference = currentRotation - startRefRotation;

  // If surpassed
  if (rotationSurpassedStep) {
    // Update the times surpassed variable
    timesSurpassed += 1;

    console.log(rotationSurpassedStep);

    // Calculate the smallest and last rotation values
    const smallestRotation = rotationPositions[0];
    const lastRotation = rotationPositions[rotationPositions.length - 1];

    // Calculate the newest rotation value to add to the rotationPositions array
    const newRotation =
      realDifference > 0
        ? lastRotation + rotationStep
        : smallestRotation - rotationStep;

    // Update the rotationPositions array based on the real difference value
    // This is sennse of the turn : left or right
    if (realDifference < 0) {
      // If the carousel is rotating to the left
      rotationPositions.pop();
      rotationPositions.unshift(newRotation);
      // currentIslandIndex =
      //   currentIslandIndex === 4 ? 0 : currentIslandIndex - 1;
      // console.log("New island index", currentIslandIndex);

      // updateIslandInformation(
      //   currentIslandIndex,
      //   data,
      //   infoTitle,
      //   infoDescription,
      //   infoButton
      // );
    } else {
      // If the carousel is rotating to the right
      rotationPositions.shift();
      rotationPositions.push(newRotation);
      // currentIslandIndex = currentIslandIndex + 1;
      // if (currentIslandIndex < 0) {
      //   currentIslandIndex = 4;
      // } else {
      //   currentIslandIndex = currentIslandIndex;
      // }
      // console.log("New island index", currentIslandIndex);

      // updateIslandInformation(
      //   currentIslandIndex,
      //   data,
      //   infoTitle,
      //   infoDescription,
      //   infoButton
      // );
    }

    // Remove duplicates and sort the array
    rotationPositions = Array.from(new Set(rotationPositions)).sort(
      (a, b) => a - b
    );

    // Calculate the closest rotation value
    closestRotation = closestRotationValue(currentRotation, rotationPositions);
    console.log("Closest rotation", closestRotation);

    // Use the updated rotationPositions array as needed
    console.log("Updated rotationPositions: ", rotationPositions);
    // Reset start reference rotation
    startRefRotation = closestRotation;

    console.log("New start reference rotation", startRefRotation);
    console.log("Times surpassed", timesSurpassed);
  } else {
    console.log("Not surpassed yet");
  }

  console.log(carousel.rotation.y);
  console.log(Math.round(carousel.rotation.y % ((Math.PI * 2) / 5)));
});

// Touch end
canvas.addEventListener("touchend", () => {
  const arrayLength = islandPromises.length;
  isTouching = false;
  endTouch = touchMoveX;
  console.log("Last touch at", endTouch);
  console.log("Touch distance", Math.abs(endTouch - firstTouch));

  currentRotation = carousel.rotation.y;
  // Rotate to the closest rotation value smoothly
  const rotateToClosest = () => {
    const deltaRotation = (closestRotation - carousel.rotation.y) * 0.17; // Adjust the smoothing factor as needed
    carousel.rotation.y += deltaRotation;
    const rotationDifference = Math.abs(closestRotation - carousel.rotation.y);
    if (rotationDifference > 0.00001) {
      requestAnimationFrame(rotateToClosest);
    }
  };
  rotateToClosest();

  // Change info box data based on the current island index
  // Use timesSurpassed to amount the index will be updated
  if (realDifference < 0) {
    // If the carousel is rotating to the left
    currentIslandIndex = currentIslandIndex - timesSurpassed;
    if (currentIslandIndex < 0) {
      currentIslandIndex = currentIslandIndex + arrayLength;
    } else {
      currentIslandIndex = currentIslandIndex;
    }
  } else {
    // If the carousel is rotating to the right
    // currentIslandIndex =
    //   currentIslandIndex === 4
    //     ? 0 + timesSurpassed
    //     : currentIslandIndex + timesSurpassed;
    currentIslandIndex = currentIslandIndex + timesSurpassed;
    if (currentIslandIndex > 4) {
      currentIslandIndex = currentIslandIndex - arrayLength;
    } else {
      currentIslandIndex = currentIslandIndex;
    }
  }

  console.log("New island index", currentIslandIndex);

  updateIslandInformation(
    currentIslandIndex,
    data,
    infoTitle,
    infoDescription,
    infoButton
  );

  // Reset the timesSurpassed variable
  timesSurpassed = 0;
});

// Touch cancel
canvas.addEventListener("touchcancel", () => {
  isTouching = false;
  // Handle touch cancel if needed
});
// Get the control buttons
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
let rotate = false;

// Usage example
rightButton.addEventListener("click", () => {
  console.log("Current Rotation", carousel.rotation.y);
  rotateCarousel("right", rotate, carousel);

  currentIslandIndex = currentIslandIndex === 4 ? 0 : currentIslandIndex + 1;
  updateIslandInformation(
    currentIslandIndex,
    data,
    infoTitle,
    infoDescription,
    infoButton
  );
});

leftButton.addEventListener("click", () => {
  console.log("Current Rotation", carousel.rotation.y);
  rotateCarousel("left", rotate, carousel);

  currentIslandIndex = currentIslandIndex - 1;
  if (currentIslandIndex < 0) {
    currentIslandIndex = 4;
  } else {
    currentIslandIndex = currentIslandIndex;
  }
  updateIslandInformation(
    currentIslandIndex,
    data,
    infoTitle,
    infoDescription,
    infoButton
  );
});

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
