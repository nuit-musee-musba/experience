import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * TO DO LIST
 * Ajouter une variable pour valider la position de la lumière
 * Créer un test : si lumière ok et click sur btn valider, ouvrir modal, sinon, afficher message d'erreur
 */

/**
 * Popins
 */

const popinHide = (targetPopin) => {
  targetPopin.classList.add("hidden");
  document.querySelector(".popin-overlay").classList.add("hidden");
};

const popinShow = (targetPopin) => {
  targetPopin.classList.remove("hidden");
  document.querySelector(".popin-overlay").classList.remove("hidden");
};

const popinBtns = document.querySelectorAll(".popin-btn.popin-close");
for (const popinBtn of popinBtns) {
  const targetPopin = document.querySelector(popinBtn.dataset.target);
  popinBtn.addEventListener("click", (event) => {
    event.preventDefault();
    popinHide(targetPopin);
  });
}

const popinOpenBtns = document.querySelectorAll(".popin-btn.popin-open");
for (const popinOpenBtn of popinOpenBtns) {
  const targetPopin = document.querySelector(popinOpenBtn.dataset.target);
  popinOpenBtn.addEventListener("click", (event) => {
    event.preventDefault();
    popinShow(targetPopin);
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
  lightRadius: 1.3,
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

const colorTexture = textureLoader.load(
  "/4-lumieres/first-painting/caravage-color.jpg"
);
const heightTexture = textureLoader.load(
  "/4-lumieres/first-painting/caravage-height.jpg"
);

colorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Object
 */
// Caravage painting
const planeGeometry = new THREE.PlaneGeometry(5.3, 4, 150, 100);
const caravageMaterial = new THREE.MeshStandardMaterial({
  map: colorTexture,
  transparent: true,
  displacementMap: heightTexture,
  displacementScale: 0.2,
  roughness: 1,
  metalness: 0.2,
});
const caravagePainting = new THREE.Mesh(planeGeometry, caravageMaterial);
scene.add(caravagePainting);

const paintingTweaks = gui.addFolder("Painting parameters");
paintingTweaks
  .add(caravagePainting.material, "roughness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Painting roughness");
paintingTweaks
  .add(caravagePainting.material, "metalness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Painting metalness");

// Caravage ellipse geometry

var ellipseGeometry = new THREE.CircleGeometry(
  globalParameters.lightRadius,
  32
);
var ellipseMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  // opacity: 0,
  wireframe: true,
});
var ellipse = new THREE.Mesh(ellipseGeometry, ellipseMaterial);
ellipse.position.z = 0.5;
scene.add(ellipse);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(
  0xffffff, // color
  1 // intensity
);
scene.add(ambientLight);

const ambientLightTweaks = gui.addFolder("Ambient light parameters");
ambientLightTweaks.add(ambientLight, "visible");
ambientLightTweaks.addColor(ambientLight, "color");
ambientLightTweaks.add(ambientLight, "intensity").min(0).max(3).step(0.001);

// Point light | Caravage
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
camera.position.z = 4;
scene.add(camera);

/**
 * Pointer
 */
const pointer = new THREE.Vector2();

window.addEventListener("touchmove", (event) => {
  pointer.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
});

// Function to calculate the angle between Z rotation and cursor position
function calculateAngle() {
  const relativeCursorPosition = new THREE.Vector3(pointer.x, pointer.y, 0).sub(
    ellipse.position
  );
  const angle = Math.atan2(relativeCursorPosition.y, relativeCursorPosition.x);
  const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);
  return normalizedAngle;
}

// Function to update rotation when cursor position changes
function updateRotation() {
  const angle = calculateAngle();
  ellipse.rotation.z = angle;

  // If response ok
  if (angle > 1.5 && angle < 1.8) {
    console.log("angle ok");

    for (const popinOpenBtn of popinOpenBtns) {
      if (popinOpenBtn.classList.contains("hidden")) {
        popinOpenBtn.classList.remove("hidden");
      }
    }
  }
}

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.target = caravagePainting.position;
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
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  const lightAngle = elapsedTime * globalParameters.lightAngleStrength;

  // Update caravage light position
  updateRotation();

  // Light controls
  pointLightHelper.update();

  // Update controls
  // controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
