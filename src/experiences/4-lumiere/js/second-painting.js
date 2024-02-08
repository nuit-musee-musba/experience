import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
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

// Global parameters
let globalParameters = {
  lightAngleStrength: 0.5,
  lightRadius: 5.6,
  planDistance: 0.5,
  white: "#f5f5f5",
  ellipseDefaultOpacity: 0.5,
  ellipseTouchOpacity: 0.2,
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

// Second painting
const firstPlanTexture = textureLoader.load(
  "/4-lumiere/second-painting/second-painting-plan-1-2.png"
);
firstPlanTexture.colorSpace = THREE.SRGBColorSpace;

const secondPlanTexture = textureLoader.load(
  "/4-lumiere/second-painting/second-painting-plan-2.png"
);
secondPlanTexture.colorSpace = THREE.SRGBColorSpace;

const thirdPlanTexture = textureLoader.load(
  "/4-lumiere/second-painting/second-painting-plan-3.png"
);
thirdPlanTexture.colorSpace = THREE.SRGBColorSpace;

const thirdPlanNormalTexture = textureLoader.load(
  "/4-lumiere/second-painting/second-painting-plan-3-normal.png"
);

// Light object
const lightObjectTexture = textureLoader.load(
  "/4-lumiere/second-painting/second-light-object.png"
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

// Second painting
const planeGeometry = new THREE.PlaneGeometry(9.23, 4, 150, 100);

// Second painting | plan 1
const secondPaintingMaterial1 = new THREE.MeshStandardMaterial({
  map: firstPlanTexture,
  transparent: true,
});
const secondPainting1 = new THREE.Mesh(planeGeometry, secondPaintingMaterial1);
secondPainting1.position.z = globalParameters.planDistance;
secondPainting1.scale.set(0.968, 0.968, 1);

// Second painting | plan 2
const secondPaintingMaterial2 = new THREE.MeshStandardMaterial({
  map: secondPlanTexture,
  transparent: true,
});
const secondPainting2 = new THREE.Mesh(planeGeometry, secondPaintingMaterial2);
secondPainting2.scale.set(0.985, 0.985, 1);

// Second painting | plan 3
const secondPaintingMaterial3 = new THREE.MeshStandardMaterial({
  map: thirdPlanTexture,
  transparent: true,
  normalMap: thirdPlanNormalTexture,
});
const secondPainting3 = new THREE.Mesh(planeGeometry, secondPaintingMaterial3);
secondPainting3.position.z = -globalParameters.planDistance;

// Second painting | Add to scene
scene.add(secondPainting1, secondPainting2, secondPainting3);

// Frame
gltfLoader.load(
  "/4-lumiere/second-painting/second-painting-frame.glb",
  (gltf) => {
    gltf.scene.scale.set(17.25, 17.0125, 16.75);
    scene.add(gltf.scene);
  },
  () => {
    console.log("progress");
  },
  (error) => {
    console.log("error:", error);
  }
);

// ellipse
var ellipseGeometry = new THREE.TorusGeometry(
  globalParameters.lightRadius, // Radius
  0.005, // tube
  12, // radialSegments
  48, // tubularSegments
  Math.PI * 2 // arc
);
var ellipseMaterial = new THREE.MeshBasicMaterial({
  color: globalParameters.white,
  transparent: true,
  opacity: globalParameters.ellipseDefaultOpacity,
});
var ellipse = new THREE.Mesh(ellipseGeometry, ellipseMaterial);
ellipse.position.z = 0.5;
ellipse.rotation.x = -Math.PI * 0.45;
ellipse.rotation.z = -0.9;
scene.add(ellipse);

// Light object
const lightObjectGeometry = new THREE.PlaneGeometry(
  1, // width
  1, // height
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
// Ambient light
const ambientLight = new THREE.AmbientLight(
  0xffffff, // color
  1 // intensity
);
scene.add(ambientLight);

// Second painting point light
const pointLight = new THREE.PointLight(
  "#f09647", // color
  25, // intensity
  50, // distance
  1 // decay
);
pointLight.position.x = globalParameters.lightRadius;
scene.add(pointLight);
pointLight.add(lightObject);

ellipse.add(pointLight);

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

// Update pointer position
canvas.addEventListener("touchstart", (event) => {
  pointer.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
  ellipse.material.opacity = globalParameters.ellipseTouchOpacity;

  // Update firstPainting light position
  updateRotation();
});

canvas.addEventListener("touchmove", (event) => {
  pointer.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

  // Update firstPainting light position
  updateRotation();
});

canvas.addEventListener("touchend", (event) => {
  ellipse.material.opacity = globalParameters.ellipseDefaultOpacity;
});

// Calculate pointer angle
function calculateAngle() {
  const relativeCursorPosition = new THREE.Vector3(pointer.x, pointer.y, 0).sub(
    ellipse.position
  );
  const angle = Math.atan2(relativeCursorPosition.y, relativeCursorPosition.x);
  const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);
  return normalizedAngle;
}

// // Result button
const resultBtn = document.querySelector("#btn-validate");
let resultState = false;

// Update ellipse rotation
updateRotation;
function updateRotation() {
  const angle = calculateAngle();
  ellipse.rotation.z = angle;
  // // Check result
  if (angle > 3.4 && angle < 3.66) {
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
    window.location.replace("./results.html?painting=second");
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
  // Update light object
  lightObject.lookAt(camera.position);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
