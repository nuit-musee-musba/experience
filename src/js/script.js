import * as THREE from "three";
import { createIsland } from "./helpers";
import data from "./data";

import "./rotationSystem";

window.experience = window.experience || {};

// Capture DOM elements

// Constants
const frontTitle = document.getElementById("frontTitle");
const infoDescription = document.getElementById("infoText");
const infoButton = document.getElementById("startButton");

document.addEventListener("DOMContentLoaded", function () {
  // Set initial info box userData
  // TODO: make random
  frontTitle.innerHTML = data[0].title;
  infoDescription.innerHTML = data[0].description;
  infoButton.href = data[0].path;
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
camera.position.set(0, 1.2, -4.5);
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
const light = new THREE.PointLight(0xffffff, 10);
// const light = new THREE.AmbientLight(0x404040, 3); // soft white light
light.position.set(0, 1, -1);
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

window.experience.carousel = carousel;

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

// Render loop
const animate = () => {
  requestAnimationFrame(animate);

  window.experience.updateCarouselRotation();
  // Render the scene
  renderer.render(scene, camera);
};

animate();
