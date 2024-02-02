import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createIsland } from "./helpers";
import router from "./router";

const worldLoaded = false;

if (worldLoaded) {
  console.log("world loaded");
}

// Create scene
const scene = new THREE.Scene();

// Target canvas
var canvas = document.getElementById("webgl");

// Create camera
const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
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
renderer.setSize(window.innerWidth, window.innerHeight);

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

// Raycaster : raycasting to detect mouse click or hover on 3D objects
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Create worlds

// Create an array to store promises for each world creation
const islandPromises = [];

// Create worlds
for (let i = 0; i < 5; i++) {
  const color = router[i].color;
  const islandPromise = createIsland(i, 5, color)
    .then((island) => {
      // Add each world to the carousel
      carousel.add(island);
    })
    .catch((error) => {
      console.error("Error creating world:", error);
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
        const url = router.find(
          (route) => route.id === intersect.object.parent.userData.id
        ).path;
        // Click event > Redirect to the specified URL
        window.location.href = url;
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
document.addEventListener("click", onMouseClick);

// Handle scroll/wheel event for desktop
canvas.addEventListener("wheel", (event) => {
  event.preventDefault(); // Prevent default scroll behavior
  const scrollPosition = event.deltaX % window.innerWidth; // Use deltaX for horizontal scrolling
  carousel.rotation.y += (-scrollPosition * Math.PI) / window.innerWidth;
});

// Handle touch events for mobile

// Declare Touch variables
let touchStartX = 0;
let touchMoveX = 0;
let isTouching = false;
let lastRotationY = 0;
let deltaX = 0;

// Touch event handlers

// Touch start
canvas.addEventListener("touchstart", (event) => {
  isTouching = true;
  touchStartX = event.touches[0].clientX;
});

// Touch move
canvas.addEventListener("touchmove", (event) => {
  event.preventDefault(); // Prevent default touch behavior

  touchMoveX = event.touches[0].clientX;
  deltaX = touchMoveX - touchStartX;

  const scrollPosition = deltaX % window.innerWidth;

  // This is the actual rotation of the carousel based on the touch movement on the screen
  carousel.rotation.y += (scrollPosition * (Math.PI * 2)) / window.innerWidth;

  // Update the touch start position after each move
  touchStartX = touchMoveX;
});

// Touch end
canvas.addEventListener("touchend", () => {
  isTouching = false;
  // Continue the rotation smoothly after touch end
  const continueRotation = () => {
    if (!isTouching) {
      lastRotationY *= 0.989; // Decrease the rotation speed gradually

      if (deltaX > 0) {
        carousel.rotation.y +=
          (lastRotationY * (Math.PI * 10)) / window.innerWidth;
      } else {
        carousel.rotation.y -=
          (lastRotationY * (Math.PI * 10)) / window.innerWidth;
      }

      if (Math.abs(lastRotationY) > 0.1) {
        requestAnimationFrame(continueRotation);
      }
    }
  };
  lastRotationY = (touchStartX % window.innerWidth) / window.innerWidth;
  continueRotation();
});

// Touch cancel
canvas.addEventListener("touchcancel", () => {
  isTouching = false;
  // Handle touch cancel if needed
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
