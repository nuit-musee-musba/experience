import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import GUI from "lil-gui";
import { enableInactivityRedirection } from "/global/js/inactivity";

/**
 * Inactivity
 */
enableInactivityRedirection();

/**
 * Popins
 */
const popin = document.querySelector("#popin-info");
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
};

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  popinShow(popin);
});

const popinBtns = document.querySelectorAll(".popin-btn.popin-close");
for (const popinBtn of popinBtns) {
  const targetPopin = document.querySelector(popinBtn.dataset.target);
  popinBtn.addEventListener("click", (event) => {
    event.preventDefault();
    popinHide(targetPopin);
  });
}

/**
 * Threejs
 */

// Debug
const gui = new GUI({
  width: 300,
  title: "Debugger",
  closeFolders: true,
});
gui.hide();

let globalParameters = {
  lightAngleStrength: 0.5,
  lightRadius: 1.3,
  planDistance: 0.5,
  white: "#f5f5f5",
  ambientIntensity: 4.5,
  rectAreaIntensity: 1,
  changeValue: 0,
  lineDefaultOpacity: 0.5,
  lineTouchOpacity: 0.2,
  step1: 0.4,
  step2: 0.45,
  step3: 0.5,
  step4: 0.7,
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

// Third painting
const firstPlanTexture = textureLoader.load(
  "/4-lumiere/third-painting/third-painting-plan-1.png"
);
firstPlanTexture.colorSpace = THREE.SRGBColorSpace;

const secondPlanTexture = textureLoader.load(
  "/4-lumiere/third-painting/third-painting-plan-2.png"
);
secondPlanTexture.colorSpace = THREE.SRGBColorSpace;

const thirdPlanTexture = textureLoader.load(
  "/4-lumiere/third-painting/third-painting-plan-3.png"
);
thirdPlanTexture.colorSpace = THREE.SRGBColorSpace;

// Light object
const lightObjectTexture = textureLoader.load(
  "/4-lumiere/third-painting/third-light-object.png"
);

/**
 * Loader
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/4-lumiere/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Scene objects
 */

// Third painting
const planeGeometry = new THREE.PlaneGeometry(5.64, 4, 150, 100);

// Third painting | plan 1
const thirdPaintingMaterial1 = new THREE.MeshStandardMaterial({
  map: firstPlanTexture,
  transparent: true,
});
const thirdPainting1 = new THREE.Mesh(planeGeometry, thirdPaintingMaterial1);
thirdPainting1.position.z = 2 * globalParameters.planDistance;
thirdPainting1.scale.set(0.95, 0.95, 1);

// Third painting | plan 2
const thirdPaintingMaterial2 = new THREE.MeshStandardMaterial({
  map: secondPlanTexture,
  transparent: true,
});
const thirdPainting2 = new THREE.Mesh(planeGeometry, thirdPaintingMaterial2);
thirdPainting2.scale.set(0.985, 0.985, 1);
// Third painting | plan 3
const thirdPaintingMaterial3 = new THREE.MeshStandardMaterial({
  map: thirdPlanTexture,
  transparent: true,
});
const thirdPainting3 = new THREE.Mesh(planeGeometry, thirdPaintingMaterial3);
thirdPainting3.position.z = -globalParameters.planDistance;

// Third painting | Add to scene
scene.add(thirdPainting1, thirdPainting2, thirdPainting3);

// Frame
gltfLoader.load(
  "/4-lumiere/third-painting/third-painting-frame.glb",
  (gltf) => {
    gltf.scene.scale.set(7.5, 7.5, 7.5);
    gltf.scene.position.z = 1;
    console.log(gltf.scene);
    // gltf.scene.rotation.z = Math.PI;
    scene.add(gltf.scene);
  },
  () => {
    console.log("progress");
  },
  (error) => {
    console.log("error:", error);
  }
);

// line
var lineGeometry = new THREE.CylinderGeometry(
  0.01, // radiusTop
  0.01, // radiusBottom
  3, // height
  32, // radialSegments
  1 // heightSegments
);
var lineMaterial = new THREE.MeshBasicMaterial({
  color: globalParameters.white,
  transparent: true,
  opacity: globalParameters.lineDefaultOpacity,
});
var line = new THREE.Mesh(lineGeometry, lineMaterial);
line.position.z = globalParameters.planDistance;
line.position.y = -0.3625;
scene.add(line);

// Light object
const lightObjectGeometry = new THREE.PlaneGeometry(
  0.375, // width
  0.375, // height
  3, //widthSegments
  3 //heightSegments
);
const lightObjectMaterial = new THREE.MeshBasicMaterial({
  map: lightObjectTexture,
  transparent: true,
  opacity: 1,
});
const lightObject = new THREE.Mesh(lightObjectGeometry, lightObjectMaterial);

/**
 * Lights
 */

// Light colors
const lightColors = {
  blue: new THREE.Color("#2d4ed6"),
  yellow: new THREE.Color("#FFD79E"),
  red: new THREE.Color("#FF000C"),
  white: new THREE.Color("#9FB2FF"),
};

// Ambient light
const ambientLight = new THREE.AmbientLight(
  "#d1dbff", // color
  globalParameters.ambientIntensity // intensity
);
scene.add(ambientLight);

// Second painting point light
const rectAreaLight = new THREE.RectAreaLight(
  "#9FB2FF", // color
  globalParameters.rectAreaIntensity, // intensity
  8, // width
  2.5 // height
);
// pointLight.position.x = globalParameters.lightRadius;
scene.add(rectAreaLight);
line.add(rectAreaLight);
rectAreaLight.add(lightObject);
lightObject.position.z = 0.1;

const lightMaxPos = line.geometry.parameters.height / 2;
const lightMinPos = -(line.geometry.parameters.height / 2);

rectAreaLight.position.y = lightMaxPos / 2;

// RectAreaLight color change
changeMainLightColor();

function changeMainLightColor() {
  let colorFrom = null;
  let colorTo = null;
  let alphaInterpolation = null;

  if (globalParameters.changeValue <= globalParameters.step1) {
    colorFrom = lightColors.white;
    colorTo = lightColors.white;
    alphaInterpolation = globalParameters.changeValue / globalParameters.step1;
  } else if (
    globalParameters.changeValue > globalParameters.step1 &&
    globalParameters.changeValue <= globalParameters.step2
  ) {
    colorFrom = lightColors.white;
    colorTo = lightColors.red;
    alphaInterpolation =
      (globalParameters.changeValue - globalParameters.step1) /
      (globalParameters.step2 - globalParameters.step1);
  } else if (
    globalParameters.changeValue > globalParameters.ste2 &&
    globalParameters.changeValue <= globalParameters.step3
  ) {
    colorFrom = lightColors.red;
    colorTo = lightColors.yellow;
    alphaInterpolation =
      (globalParameters.changeValue - globalParameters.step2) /
      (globalParameters.step3 - globalParameters.step2);
  } else if (
    globalParameters.changeValue > globalParameters.step3 &&
    globalParameters.changeValue <= globalParameters.step4
  ) {
    colorFrom = lightColors.yellow;
    colorTo = lightColors.blue;
    alphaInterpolation =
      (globalParameters.changeValue - globalParameters.step3) /
      (globalParameters.step4 - globalParameters.step3);
  } else {
    colorFrom = lightColors.blue;
    colorTo = lightColors.blue;
    alphaInterpolation =
      (globalParameters.changeValue - globalParameters.step4) /
      (1 - globalParameters.step4);
  }
  rectAreaLight.color.lerpColors(colorFrom, colorTo, alphaInterpolation);
}

// Helper
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
rectAreaLightHelper.visible = false;
scene.add(rectAreaLightHelper);

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  15,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 30;
scene.add(camera);

/**
 * Pointer
 */
const pointer = new THREE.Vector2();

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

// Variables to track touch events
let touchStartY = 0;
let touchMoveY = 0;
let isSwiping = false;
globalParameters.changeValue =
  (rectAreaLight.position.y - lightMinPos) / line.geometry.parameters.height;
ambientLight.intensity =
  globalParameters.ambientIntensity * globalParameters.changeValue + 0.5;
rectAreaLight.intensity =
  globalParameters.rectAreaIntensity * globalParameters.changeValue;

// Update pointer position
canvas.addEventListener("touchstart", (event) => {
  pointer.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

  line.material.opacity = globalParameters.lineTouchOpacity;
  // Record the starting Y position of the touch
  touchStartY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
  isSwiping = true;
});

canvas.addEventListener(
  "touchmove",
  (event) => {
    pointer.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

    if (isSwiping) {
      // Calculate the vertical distance swiped
      touchMoveY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      const deltaY = touchMoveY - touchStartY;
      // Adjust the rotation of the ellipse based on the swipe distance
      const movementSpeed = 0.5; // Adjust this value for desired sensitivity
      if (rectAreaLight.position.y < lightMaxPos && deltaY > 0) {
        rectAreaLight.position.y += deltaY * movementSpeed;
        rectAreaLight.position.y > lightMaxPos
          ? (rectAreaLight.position.y = lightMaxPos)
          : (rectAreaLight.position.y = rectAreaLight.position.y);
      }
      if (rectAreaLight.position.y > lightMinPos && deltaY < 0) {
        rectAreaLight.position.y += deltaY * movementSpeed;
        rectAreaLight.position.y < lightMinPos
          ? (rectAreaLight.position.y = lightMinPos)
          : (rectAreaLight.position.y = rectAreaLight.position.y);
      }
      changeLights();
      changeMainLightColor();
      checkResult();
      // Update the starting Y position for the next frame
      touchStartY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

      // Render
      renderer.render(scene, camera);
    }
  },
  { passive: false }
);

canvas.addEventListener("touchend", function () {
  line.material.opacity = globalParameters.lineDefaultOpacity;

  // Reset the swipe tracking variables
  isSwiping = false;
});

// Change day time
function changeLights() {
  // Update the change value depending on the light position
  globalParameters.changeValue =
    (rectAreaLight.position.y - lightMinPos) / line.geometry.parameters.height;

  // Update ambientLight intensity
  ambientLight.intensity =
    globalParameters.ambientIntensity * globalParameters.changeValue + 0.5;

  // Update rectAreaLight intensity
  rectAreaLight.intensity =
    globalParameters.rectAreaIntensity * globalParameters.changeValue;
}

// // Result button
const resultBtn = document.querySelector("#btn-validate");
let resultState = false;

// Update line position
function checkResult() {
  // // Check result
  if (
    globalParameters.changeValue < 0.55 &&
    globalParameters.changeValue > 0.45
  ) {
    resultState = true;
    resultBtn.disabled = false;
  } else {
    resultBtn.disabled = true;
    resultState = false;
  }
}

// Check result on click
resultBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (resultState == true) {
    window.location.replace("./results.html?painting=third");
  }
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const tick = () => {
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
