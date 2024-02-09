import * as THREE from "three";
import { createIsland } from "./helpers";
import data from "./data";
import { updateAllMaterials } from "./helpers";

import "./rotationSystem";

window.experience = window.experience || {};

// Set initial values
window.experience.canRotate = true;
window.experience.autoRotate = true;
window.experience.clickedOnExperience = false;

// Capture DOM elements

// Constants
const frontTitle = document.getElementById("frontTitle");
const infoDescription = document.getElementById("infoText");
const startButton = document.getElementById("startButton");



document.addEventListener("DOMContentLoaded", function () {
  // Set initial info box userData
  // TODO: make random
  frontTitle.innerHTML = data[0].title;
  infoDescription.innerHTML = data[0].description;
  startButton.href = data[0].path;
});


// Create scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xf8f4f4, 3, 5.3);
window.experience.scene = scene;


// Target canvas
var canvas = document.getElementById("webgl");
window.experience.canvas = canvas;

// Create camera
const camera = new THREE.PerspectiveCamera(
  10,
  canvas.clientWidth / canvas.clientHeight, // Use canvas dimensions
  0.1,
  2000
);
camera.position.set(0, 1.2, -4.5);
camera.lookAt(0, 0, 0);
window.experience.camera = camera;
// Create Rendererx@
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas: canvas,
});
renderer.setSize(canvas.clientWidth, canvas.clientHeight); // Use canvas dimensions
// // Add renderer to DOM
document.body.appendChild(renderer.domElement);

// Add light

const ambientLight = new THREE.AmbientLight(0x404040);
ambientLight.intensity = 1;
ambientLight.position.set(0, 2, 0);
scene.add(ambientLight);

// const spotLight = new THREE.SpotLight(0xffffff, 1, 1);
// spotLight.position.set(0, 0.6, -0.6);
// spotLight.castShadow = true;
// scene.add(spotLight);

const mainLight = new THREE.DirectionalLight(0x404040, 30);
mainLight.position.set(0, 0.2, 0);
mainLight.castShadow = true;
scene.add(mainLight);


// Carousel : Group of islands
const carousel = new THREE.Group();
// Calibrate rotation to set carousel in good position
carousel.rotation.set(0, 0, 0);
carousel.position.set(0, 0, 0);

// Create an array to store promises for each world creation
const islandPromises = [];

window.experience.islands = [];

// Count of islands
const count = 5;

// Create islands
for (let i = 0; i < count; i++) {
  const color = data[i].color;
  const islandPromise = createIsland(i, count, color)
    .then((island) => {
      // Add axes helper to the island
      carousel.add(island);
      window.experience.islands.push(island);
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
updateAllMaterials();

window.experience.carousel = carousel;

// We set this here once all promises are resolved
window.experience.scene = scene;

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

  // Get current island
  window.experience.currentIsland = window.experience.islands.find((island) => {
    return island.userData.id === window.experience.index + 1;
  });
  window.experience.otherIslands = window.experience.islands.filter(
    (island) => {
      return island.userData.id !== window.experience.index + 1;
    }
  );
  //console.log(window.experience.canRotate);
  // Render the scene
  renderer.render(scene, camera);
};

animate();

