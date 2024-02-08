import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { enableInactivityRedirection } from "/global/js/inactivity";

/**
 * Inactivity
 */
enableInactivityRedirection();

/**
 * Popins
 */

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const urlOrigin = urlParams.get("home-popin");
const popin1 = document.querySelector("#popin-welcome");
const popin2 = document.querySelector("#popin-consignes");
let events = true;

const popinHide = (targetPopin) => {
  targetPopin.classList.add("hidden");
  document.querySelector("body").classList.add("popin-visible");
  document.querySelector(".popin-overlay").classList.add("hidden");
  events = true;
};

const popinShow = (targetPopin) => {
  targetPopin.classList.remove("hidden");
  document.querySelector("body").classList.remove("popin-visible");
  document.querySelector(".popin-overlay").classList.remove("hidden");
  events = false;
  if (targetPopin === popin2) {
    setTimeout(() => { targetPopin.classList.add("textshow"); }, 7000)
  }
};

// test const qui n'est pas un hide direct mais une animation
// const popinFadeOut = (targetPopin) => {
//   targetPopin.classList.add("fadeout");
//   document.querySelector("body").classList.add("popin-fadeout");
//   document.querySelector(".popin-overlay").classList.add("hidden");
//   events = true;
// };

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  if (urlOrigin == "false") {
    popinHide(popin1);
    popinHide(popin2);
  } else {
    popinShow(popin1)
    setTimeout(() => { popinHide(popin1); }, 1000)
    popinShow(popin2)
    
  }
});

// function FadeOut() {
//   alert("On attend");
// };


const popinBtns = document.querySelectorAll(".popin-btn.popin-close");
for (const popinBtn of popinBtns) {
  const targetPopin = document.querySelector(popinBtn.dataset.target);
  popinBtn.addEventListener("click", (event) => {
    event.preventDefault();
    popinHide(targetPopin);
  });
}


/**
 * Base
 */
// Debug
const gui = new GUI({
  width: 300,
  title: "Debugger",
  closeFolders: true,
});

let globalParameters = {
  lightAngleStrength: 0.5,
  ellipseRadius: 4,
  white: "#f5f5f5",
  userInteract: false,
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("onStart");
};
loadingManager.onLoaded = () => {
  console.log("onLoaded");
};
loadingManager.onProgress = () => {
  console.log("onProgress");
};
loadingManager.onError = (error) => {
  console.log("Error :", error);
};

const textureLoader = new THREE.TextureLoader(loadingManager);

const firstPaintingTexture = textureLoader.load(
  "/4-lumiere/first-painting/first-painting-color.jpg"
);
firstPaintingTexture.colorSpace = THREE.SRGBColorSpace;

const secondPaintingTexture = textureLoader.load(
  "/4-lumiere/second-painting/second-painting-plan-3.png"
);
secondPaintingTexture.colorSpace = THREE.SRGBColorSpace;

const thirdPaintingTexture = textureLoader.load(
  "/4-lumiere/third-painting/third-painting-plan-3.png"
);
thirdPaintingTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Object
 */
// First painting
const firstPaintingGeometry = new THREE.PlaneGeometry(5.3, 4, 150, 100);
const firstPaintingMaterial = new THREE.MeshStandardMaterial({
  map: firstPaintingTexture,
});
const firstPainting = new THREE.Mesh(
  firstPaintingGeometry,
  firstPaintingMaterial
);

firstPainting.position.x = globalParameters.ellipseRadius;

// Second painting
const secondPaintingGeometry = new THREE.PlaneGeometry(9.23, 4, 150, 100);
const secondPaintingMaterial = new THREE.MeshStandardMaterial({
  map: secondPaintingTexture,
});
const secondPainting = new THREE.Mesh(
  secondPaintingGeometry,
  secondPaintingMaterial
);

secondPainting.position.y = globalParameters.ellipseRadius;

// Third painting
const thirdPaintingGeometry = new THREE.PlaneGeometry(5.64, 4, 150, 100);
const thirdPaintingMaterial = new THREE.MeshStandardMaterial({
  map: thirdPaintingTexture,
});
const thirdPainting = new THREE.Mesh(
  thirdPaintingGeometry,
  thirdPaintingMaterial
);

thirdPainting.position.x = -globalParameters.ellipseRadius;

// Add paintings to scene
scene.add(firstPainting, secondPainting, thirdPainting);

// Wheel ellipse
var ellipseGeometry = new THREE.CircleGeometry(
  globalParameters.ellipseRadius,
  32
);
var ellipseMaterial = new THREE.MeshBasicMaterial({
  color: globalParameters.white,
  transparent: true,
  opacity: 0,
  // wireframe: true,
});
var ellipse = new THREE.Mesh(ellipseGeometry, ellipseMaterial);
ellipse.position.z = 0.5;
scene.add(ellipse);

// Wheel positions
ellipse.rotation.y = -Math.PI * 0.5;

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Mouse
 */
const mouse = new THREE.Vector2();

canvas.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

// 'touchmove' event listener
window.addEventListener(
  "touchmove",
  function (event) {
    // Prevent touchmove default behavior
    event.preventDefault();
  },
  { passive: false }
);

// 'wheel' event listener
window.addEventListener(
  "wheel",
  function (event) {
    // Prevent wheel event default behavior
    event.preventDefault();
  },
  { passive: false }
); // Use { passive: false } to enable preventDefault

canvas.addEventListener("click", () => {
  // Cast a ray
  raycaster.setFromCamera(mouse, camera);

  const objectsToTest = [firstPainting, secondPainting, thirdPainting];
  const intersects = raycaster.intersectObjects(objectsToTest);

  if (intersects.length) {
    if (currentIntersect === null) {
      console.log("mouse enter");
    }

    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      console.log("mouse leave");
    }

    currentIntersect = null;
  }

  if (currentIntersect) {
    switch (currentIntersect.object) {
      case firstPainting:
        console.log("click on first painting");
        window.location.replace("./first-painting.html");
        break;

      case secondPainting:
        console.log("click on second painting");
        window.location.replace("./second-painting.html");
        break;

      case thirdPainting:
        console.log("click on second painting");
        window.location.replace("./third-painting.html");
        break;

      default:
        console.log("no link");
    }
  }
});

// Rotate paintings
function checkUserInteractions() {
  if (globalParameters.userInteract) {
    console.log("stop rotate paintings");
  } else {
    console.log("Rotate paintings");
  }
  globalParameters.userInteract = false;
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 9;
scene.add(camera);

/**
 * Pointer
 */
const pointer = new THREE.Vector2();

canvas.addEventListener("touchmove", (event) => {
  pointer.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
});

// Variables to track touch events
let touchStartY = 0;
let touchMoveY = 0;
let isSwiping = false;

// Add event listeners for touch events on the window
window.addEventListener("touchstart", function (event) {
  // Record the starting Y position of the touch
  touchStartY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
  isSwiping = true;
  globalParameters.userInteract = true;
});

window.addEventListener(
  "touchmove",
  function (event) {
    if (isSwiping) {
      touchMoveY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      // Calculate the vertical distance swiped
      const deltaY = touchMoveY - touchStartY;

      // Adjust the rotation of the ellipse based on the swipe distance
      const rotationSpeed = 1; // Adjust this value for desired sensitivity
      ellipse.rotation.z += deltaY * rotationSpeed;

      // Update the starting Y position for the next frame
      touchStartY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

      // Render
      renderer.render(scene, camera);
    }
  },
  { passive: false }
);

window.addEventListener("touchend", function () {
  // Reset the swipe tracking variables
  isSwiping = false;
});

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.target = ellipse.position;
// controls.enableDamping = true;

/**
 * SetInterval
 */

// Function
setInterval(checkUserInteractions, 2000);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.target = ellipse.position;
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(
  0xffffff, // color
  3 // intensity
);
scene.add(ambientLight);

const ambientLightTweaks = gui.addFolder("Ambient light parameters");
ambientLightTweaks.add(ambientLight, "visible");
ambientLightTweaks.addColor(ambientLight, "color");
ambientLightTweaks.add(ambientLight, "intensity").min(0).max(3).step(0.001);

/**
 * Animate
 */
const clock = new THREE.Clock();

let currentIntersect = null;
let previousTime = 0;
let deltaTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update controls
  // controls.update();

  // Update paintings positions based on ellipse rotation
  const angle = ellipse.rotation.z;
  const radius = globalParameters.ellipseRadius;

  firstPainting.position.set(
    0,
    Math.sin(angle) * radius,
    Math.cos(angle) * radius
  );
  secondPainting.position.set(
    0,
    Math.sin(angle + (2 * Math.PI) / 3) * radius,
    Math.cos(angle + (2 * Math.PI) / 3) * radius
  );
  thirdPainting.position.set(
    0,
    Math.sin(angle - (2 * Math.PI) / 3) * radius,
    Math.cos(angle - (2 * Math.PI) / 3) * radius
  );

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
