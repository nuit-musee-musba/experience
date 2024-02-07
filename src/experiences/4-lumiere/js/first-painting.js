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
 * Threejs
 */

// Debug
const gui = new GUI({
  width: 300,
  title: "Debugger",
  closeFolders: true,
});

// Global parameters
let globalParameters = {
  lightAngleStrength: 0.5,
  lightRadius: 1.3,
  white: "#f5f5f5",
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

// First painting
const colorTexture = textureLoader.load(
  "/4-lumiere/first-painting/first-painting-color.jpg"
);
colorTexture.colorSpace = THREE.SRGBColorSpace;

const heightTexture = textureLoader.load(
  "/4-lumiere/first-painting/first-painting-height.png"
);

// Wallpaper
const wallpaperHeightTexture = textureLoader.load(
  "/4-lumiere/first-painting/background-height.png"
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

// Wallpaper
const wallpaperGeometry = new THREE.PlaneGeometry(6, 4, 1, 1);
const wallpaperMaterial = new THREE.MeshStandardMaterial({
  color: "#000000",
  displacementMap: wallpaperHeightTexture,
  displacementScale: 0.2,
});
const wallpaper = new THREE.Mesh(wallpaperGeometry, wallpaperMaterial);
scene.add(wallpaper);
wallpaper.position.z = -0.5;

// First painting
const planeGeometry = new THREE.PlaneGeometry(5.3, 4, 150, 100);
const firstPaintingMaterial = new THREE.MeshStandardMaterial({
  map: colorTexture,
  transparent: true,
  displacementMap: heightTexture,
  displacementScale: 0.2,
  roughness: 1,
  metalness: 0.2,
});
const firstPainting = new THREE.Mesh(planeGeometry, firstPaintingMaterial);
scene.add(firstPainting);

const paintingTweaks = gui.addFolder("Painting parameters");
paintingTweaks
  .add(firstPainting.material, "roughness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Painting roughness");
paintingTweaks
  .add(firstPainting.material, "metalness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Painting metalness");

// Frame
gltfLoader.load(
  "/4-lumiere/first-painting/first-painting-frame.glb",
  (gltf) => {
    gltf.scene.scale.set(1.75, 1.75, 1.75);
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
  // opacity: 0,
  // wireframe: true,
});
var ellipse = new THREE.Mesh(ellipseGeometry, ellipseMaterial);
ellipse.position.z = 0.5;
scene.add(ellipse);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(
  globalParameters.white, // color
  1 // intensity
);
scene.add(ambientLight);

const ambientLightTweaks = gui.addFolder("Ambient light parameters");
ambientLightTweaks.add(ambientLight, "visible");
ambientLightTweaks.addColor(ambientLight, "color");
ambientLightTweaks.add(ambientLight, "intensity").min(0).max(3).step(0.001);

// firstPainting point light
const pointLight = new THREE.PointLight(
  "#ffCC70", // color
  10, // intensity
  3, // distance
  1 // decay
);
pointLight.position.x = globalParameters.lightRadius;
scene.add(pointLight);
ellipse.add(pointLight);
const pointLightTweaks = gui.addFolder("Spot light parameters");
pointLightTweaks.add(pointLight, "visible");
pointLightTweaks.addColor(pointLight, "color");
pointLightTweaks.add(pointLight, "intensity").min(0).max(50).step(0.001);
pointLightTweaks.add(pointLight, "distance").min(0).max(10).step(0.001);
pointLightTweaks
  .add(pointLight.shadow, "blurSamples")
  .min(-20)
  .max(20)
  .step(0.001);

// Helper
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
pointLightHelper.visible = true;
pointLightHelper.color = "#ffffff";
scene.add(pointLightHelper);
pointLightTweaks.add(pointLightHelper, "visible").name("Repère visuel");
pointLightTweaks
  .add(globalParameters, "lightAngleStrength")
  .min(0)
  .max(10)
  .step(0.01)
  .name("Light movement strength");
pointLightTweaks
  .add(globalParameters, "lightRadius")
  .min(0)
  .max(10)
  .step(0.01)
  .name("Light circle radius");

const pointLightPosition = pointLightTweaks.addFolder("Spot light position");

pointLightPosition.add(pointLight.position, "x").min(-10).max(10).step(0.01);
pointLightPosition.add(pointLight.position, "y").min(-10).max(10).step(0.01);
pointLightPosition.add(pointLight.position, "z").min(-10).max(10).step(0.01);

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
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 5;
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

  // Update firstPainting light position
  updateRotation();
});

canvas.addEventListener("touchmove", (event) => {
  pointer.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

  // Update firstPainting light position
  updateRotation();
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

// Result button
const resultBtn = document.querySelector("#btn-validate");
let resultState = false;

// Update ellipse rotation
function updateRotation() {
  const angle = calculateAngle();
  ellipse.rotation.z = angle;

  // Check result
  if (angle > 1.5 && angle < 1.8) {
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
    window.location.replace("./results.html?painting=first");
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
  // Light controls
  pointLightHelper.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
