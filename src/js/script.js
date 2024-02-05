import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createIsland, findClosestIsland } from "./helpers";
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

// // Axes Helper
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

// Add light
const light = new THREE.DirectionalLight(0xffffff, 4);
light.position.set(0, 3, 3);
scene.add(light);

// Fog
// scene.fog = new THREE.Fog("#a79", 8.5, 12);

// Carousel : Group of islands
const carousel = new THREE.Group();
carousel.rotation.set(0, Math.PI, 0);
const axesHelper = new THREE.AxesHelper(30);
axesHelper.setColors("white", "green", "blue");
carousel.add(axesHelper);
// Raycaster : raycasting to detect mouse click or hover on 3D objects
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Create worlds

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

  // Add rotation positions to the array
  // console.log("rotationPosition", islandPromise.rotation);
  // rotationPositions.push(i === 0 ? 0 : (Math.PI * 2) / (count / i));

  islandPromises.push(islandPromise);
}
// console.log("rotationPositions", rotationPositions);

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

// Mouse Click event
var onMouseClick = (event) => {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1; // -1 to 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; // -1 to 1

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Loop through the intersections
  for (const intersect of intersects) {
    // Check if the intersected object is a mesh
    if (intersect.object.type === "Mesh") {
      try {
        // Get the URL from the intersected mesh parent's userData
        const url = data.find(
          (route) => route.id === intersect.object.parent.userData.id
        ).path;
        console.log("intersect", intersect.object.parent.userData);
        console.log("url", url);
        // Click event > Redirect to the specified URL
        // window.location.href = url;
      } catch (error) {
        console.error("Error in redirection", error);
      }
    }
  }
};

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Chose documet over window as it is more performant
canvas.addEventListener("click", onMouseClick);

// Handle scroll/wheel event for desktop
canvas.addEventListener("wheel", (event) => {
  event.preventDefault(); // Prevent default scroll behavior
  const scrollPosition = event.deltaX % window.innerWidth; // Use deltaX for horizontal scrolling
  carousel.rotation.y += (-scrollPosition * Math.PI) / window.innerWidth;
});

// Handle touch events for mobile

// Declare Touch variables
let touchStartX = 0;
let touchStartY = 0;
let touchMoveX = 0;
let isTouching = false;
let lastRotationY = 0;
let deltaX = 0;
let startTouch = 0;
let endTouch = 0;
// Add a variable to store the current rotation of the carousel
let currentRotation = 0;
// Add a variable to store the current rotation index
let currentRotationIndex = 0;
// Touch event handlers

// Touch start
canvas.addEventListener("touchstart", (event) => {
  // TODO: Fix scroll bug in the carousel when touching the screen in the upper part of the screen
  isTouching = true;
  touchStartX = event.touches[0].clientX / canvas.clientWidth;
  startTouch = touchStartX;
  console.log("First touch at", startTouch);
  console.log("carousel.rotation.y", carousel.rotation.y);
  // console.log("currentRotation", carousel.rotation.y);
  // console.log("touchStartX", touchStartX);
  // touchStartY = event.touches[0].clientY / window.innerHeight;
  // console.log("touchStartY", touchStartY);
});

// Touch move
canvas.addEventListener("touchmove", (event) => {
  event.preventDefault(); // Prevent default touch behavior

  touchMoveX = event.touches[0].clientX / canvas.clientWidth;
  deltaX = touchMoveX - touchStartX;
  // console.log("deltaX", deltaX);

  const scrollPosition = (deltaX * canvas.clientWidth) % canvas.clientWidth;

  // This is the actual rotation of the carousel based on the touch movement on the screen
  carousel.rotation.y += (scrollPosition * (Math.PI * 2)) / canvas.clientWidth;
  currentRotation = carousel.rotation.y;
  // console.log("currentRotation", currentRotation);

  // Update the current rotation index based on the carousel's rotation
  currentRotationIndex = Math.floor(carousel.rotation.y / Math.PI);

  // Ensure the index stays within the bounds of the array
  // currentRotationIndex =
  //   (currentRotationIndex + rotationPositions.length) %
  //   rotationPositions.length;
  // Update the touch start position after each move
  touchStartX = touchMoveX;
  console.log("touchStartX", touchStartX);
});

// Touch end
canvas.addEventListener("touchend", () => {
  isTouching = false;
  endTouch = touchMoveX;
  console.log("Last touch at", endTouch);
  console.log("Touch distance", Math.abs(endTouch - startTouch));

  // currentRotation = carousel.rotation.y - Math.PI;
  // console.log("currentRotation", currentRotation);
  // console.log("End rotation at", currentRotation);
  // // Find the closest rotation position from the predefined array
  // const closestRotation = rotationPositions.reduce((closest, rotation) => {
  //   return Math.abs(rotation - currentRotation) <
  //     Math.abs(closest - currentRotation)
  //     ? rotation
  //     : closest;
  // }, rotationPositions[0]);
  // console.log("closestRotation", closestRotation);

  // // Set the current rotation index to the index of the closest rotation in the array
  // currentRotationIndex = rotationPositions.indexOf(closestRotation);

  // // Rotate the carousel smoothly to the closest rotation
  // const rotateToClosest = () => {
  //   if (!isTouching) {
  //     const targetRotation = rotationPositions[currentRotationIndex];
  //     carousel.rotation.y +=
  //       (targetRotation - carousel.rotation.y + Math.PI) * 0.05; // Adjust the smoothing factor as needed

  //     if (Math.abs(targetRotation - carousel.rotation.y) > 0.001) {
  //       requestAnimationFrame(rotateToClosest);
  //     }
  //   }
  // };

  // rotateToClosest();
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

function rotateCarousel(direction) {
  if (!rotate) {
    rotate = true;
    const rotationAmount = (Math.PI * 2) / 5;
    console.log("rotationAmount", rotationAmount);
    const targetRotation =
      direction === "left"
        ? carousel.rotation.y + rotationAmount
        : carousel.rotation.y - rotationAmount;
    console.log("targetRotation", targetRotation);
    const rotateToTarget = () => {
      if (rotate) {
        const deltaRotation = (targetRotation - carousel.rotation.y) * 0.09; // Adjust the smoothing factor as needed
        carousel.rotation.y += deltaRotation;
        const rotationDifference = Math.abs(
          targetRotation - carousel.rotation.y
        );
        if (rotationDifference > 0.00001) {
          requestAnimationFrame(rotateToTarget);
        } else {
          rotate = false;
          console.log("Last Rotation value", carousel.rotation.y);
        }
      }
    };

    rotateToTarget();
  }
}

// Usage example
rightButton.addEventListener("click", () => {
  console.log("Current Rotation", carousel.rotation.y);
  currentIslandIndex = currentIslandIndex === 4 ? 0 : currentIslandIndex + 1;
  rotateCarousel("right");
  console.log("New Rotation", carousel.rotation.y);

  infoTitle.innerHTML = data[currentIslandIndex].title;
  infoDescription.innerHTML = data[currentIslandIndex].description;
  console.log("currentIslandIndex", currentIslandIndex);
  infoButton.addEventListener("click", function () {
    const url = data[currentIslandIndex].path;
    window.location.href = url;
  });
});

leftButton.addEventListener("click", () => {
  console.log("Current Rotation", carousel.rotation.y);

  currentIslandIndex = currentIslandIndex - 1;
  if (currentIslandIndex < 0) {
    currentIslandIndex = 4;
  } else {
    currentIslandIndex = currentIslandIndex;
  }

  infoTitle.innerHTML = data[currentIslandIndex].title;
  infoDescription.innerHTML = data[currentIslandIndex].description;
  rotateCarousel("left");
  infoButton.addEventListener("click", function () {
    const url = data[currentIslandIndex].path;
    window.location.href = url;
  });
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
