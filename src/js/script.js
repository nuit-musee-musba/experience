import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  createIsland,
  rotateCarousel,
  updateIslandInformation,
  handleScaleClick,
} from "./helpers";
import data from "./data";
import { cos } from "three/examples/jsm/nodes/Nodes.js";

// Capture DOM elements

// Modifiable
let infoTitle = document.getElementById("infoTitle");
let infoDescription = document.getElementById("infoText");
let infoButton = document.getElementById("startButton");

// Constant

// const leftButton = document.getElementById("left");
// const rightButton = document.getElementById("right");
// const buttonLoaderRight = document.querySelector(".button-loader-right");
// const buttonLoaderLeft = document.querySelector(".button-loader-left");
// const scaleButton = document.getElementById("scaleButton");

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
camera.position.set(0, 1.2, -5.5);
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

////////////////////////////SCROLL LOGIC////////////

const pi = Math.PI;
let rotation = 0;
let lastX = 0; // last x position or pointer position
let speed = 0; // speed of the swipe
let power = 1; // power of the swipe
let direction = 1; // 1 for right, -1 for left
let moveX = 0; // move x position or pointer position
let index = 0; // Start index TODO: make a random index that corelates to the random camera position
const circle = Math.PI * 2; // Useful pi
const parts = 5; // Worlds quantity
// let touchEndProcessing = false; // Flag to indicate if touchend is still processing
let isTouching = false;
let rotate = false;
let isButtonClickable = true;
let deltaX = 0;
let step = (2 * pi) / 5;

function rotateX(deltaX) {
  const rotationSpeed = 0.4; // Adjust this value to control the rotation speed

  rotation += deltaX * rotationSpeed;
  carousel.rotation.y = (rotation * Math.PI) / Math.PI;
}

// Touch start
canvas.addEventListener("touchstart", (event) => {
  console.log("REF index: ", index);
  console.log("Rotation TOUCH reference", rotation);

  isButtonClickable = false;
  // if (touchEndProcessing) return; // Prevent touch start if touch end is still processing
  // TODO: Fix scroll bug in the carousel when touching the screen in the upper part of the screen
  isTouching = true;
  lastX = event.touches[0].clientX / canvas.clientWidth;
});

// Touch move
canvas.addEventListener("touchmove", (event) => {
  console.log("Moving ");
  console.log("rotation ", rotation);

  event.preventDefault(); // Prevent default touch behavior
  if (!isTouching) return;
  // I set the speed for the touchend part
  speed =
    Math.abs(lastX - event.touches[0].clientX / canvas.clientWidth) * power;

  // set direction left or right
  direction = lastX < event.touches[0].clientX / canvas.clientWidth ? 1 : -1;

  moveX = lastX - event.touches[0].clientX / canvas.clientWidth;

  console.log("Last X: ", lastX);

  // Calculate the movement since the last touch event
  deltaX = lastX - event.touches[0].clientX / canvas.clientWidth;

  console.log("Delta X: ", deltaX);
  // Rotate the carousel based on the movement
  rotateX(-deltaX);

  index = ((rotation + (pi * 2) / 5 / 2) / circle) * parts;
  index = Math.floor(index % parts);
  index = index >= 0 ? index : index + parts;

  updateIslandInformation(index, data, infoTitle, infoDescription, infoButton);
});

// // Touch end
// canvas.addEventListener("touchend", () => {
//   // if (touchEndProcessing) {
//   //   return;
//   // }
//   // touchEndProcessing = true; // Set touch end processing flag to true
//   isTouching = false; // User is not touching the screen

//   console.log("TOUCHEND");

//   index = direction === 1 ? index : index + parts;
//   console.log("index at touch end ", index);

//   // Calculate landing rotation based on speed and power
//   const landingRotation = rotation + speed * power * direction;
//   // Find the closest rotation value
//   const closestRotation =
//     Math.round(landingRotation / (circle / parts)) * (circle / parts);
//   // Smoothly rotate to the closest rotation value
//   const rotateToClosest = () => {
//     const deltaRotation = (closestRotation - rotation) * 0.055; // Adjust the smoothing factor as needed
//     rotation += deltaRotation;
//     index = ((rotation + (pi * 2) / 5 / 2) / circle) * parts;
//     index = Math.floor(index % parts);
//     index = index >= 0 ? index : index + parts;

//     updateIslandInformation(
//       index,
//       data,
//       infoTitle,
//       infoDescription,
//       infoButton
//     );
//     carousel.rotation.y = (rotation * pi) / pi;
//     const rotationDifference = Math.abs(closestRotation - rotation);
//     if (rotationDifference > 0.001) {
//       requestAnimationFrame(rotateToClosest);
//     } else {
//       // Arrived at fixes
//       console.log("Rotation TOUCH - END reference ", rotation);
//       touchEndProcessing = false; // Reset touch end processing flag
//       isButtonClickable = true; // Reset buttons
//     }
//   };
//   rotateToClosest();
// });

canvas.addEventListener("touchend", () => {
  isTouching = false;
  isButtonClickable = true; // Reset buttons
  index = direction === 1 ? index : index + parts;
  console.log("Touch end");

  // Gradually reduce the rotation speed until it stops
  const deceleration = 0.01; // Adjust this value to control the deceleration rate
  const stopThreshold = 0.01; // Threshold to stop the rotation

  function smoothStop() {
    if (Math.abs(speed) > stopThreshold) {
      // Adjust rotation based on speed
      rotation += speed * direction;
      rotateX(-speed * direction);

      index = ((rotation + (pi * 2) / 5 / 2) / circle) * parts;
      index = Math.floor(index % parts);
      index = index >= 0 ? index : index + parts;

      updateIslandInformation(
        index,
        data,
        infoTitle,
        infoDescription,
        infoButton
      );

      // Gradually reduce speed
      speed -= speed * deceleration;
      requestAnimationFrame(smoothStop);
    } else {
      speed = 0;
      rotation = Math.round(rotation / step) * step; // Snap rotation to nearest step
      isButtonClickable = true;
    }
  }

  smoothStop();
  // // // Calculate landing rotation based on speed and power
  // const landingRotation = lastX + speed * direction;

  // // // Smoothly deaccelerate the rotation
  // const deaccelerateRotation = () => {
  //   const deltaRotation = (landingRotation - rotation) * 0.055; // Adjust the smoothing factor as needed
  //   rotation += deltaRotation;
  //   index = ((rotation + (pi * 2) / 5 / 2) / circle) * parts;
  //   index = Math.floor(index % parts);
  //   index = index >= 0 ? index : index + parts;

  //   updateIslandInformation(
  //     index,
  //     data,
  //     infoTitle,
  //     infoDescription,
  //     infoButton
  //   );
  //   carousel.rotation.y = (rotation * pi) / pi;
  //   const rotationDifference = Math.abs(landingRotation - rotation);
  //   if (rotationDifference > 0.001) {
  //     requestAnimationFrame(deaccelerateRotation);
  //   } else {
  //     // Deacceleration complete
  //     isButtonClickable = true; // Reset buttons
  //   }
  // };
  // deaccelerateRotation();
});

// Touch cancel
canvas.addEventListener("touchcancel", () => {
  isTouching = false;
});

function handleButtonClick(direction) {
  console.log("Current index: ", index);
  // Control
  if (!isButtonClickable || isTouching) {
    return;
  }
  // Set correct istance
  isButtonClickable = false;

  if (direction === "right") {
    index -= 1;
    rotation = rotation + step;
  } else {
    index += 1;
    rotation = rotation - step;
  }

  // Calibrate the negative case of index
  if (index < 0) {
    index = 4;
  } else if (index > 4) {
    index = index - count;
  } else {
    index = index;
  }

  // Capture good DOM element
  const buttonLoader =
    direction === "right" ? buttonLoaderRight : buttonLoaderLeft;
  buttonLoader.style.display = "flex";

  // Rotate
  rotateCarousel(direction, rotate, carousel);

  // Update info
  updateIslandInformation(index, data, infoTitle, infoDescription, infoButton);

  //Timeout
  setTimeout(() => {
    isButtonClickable = true;
    buttonLoader.style.display = "none";
    console.log("New index: ", index);

    console.log("Rotation CLICK reference", rotation);
  }, 600);
}
// scaleButton.addEventListener("click", () => handleScaleClick(carousel, index));

// rightButton.addEventListener("click", () => handleButtonClick("right"));
// leftButton.addEventListener("click", () => handleButtonClick("left"));

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
