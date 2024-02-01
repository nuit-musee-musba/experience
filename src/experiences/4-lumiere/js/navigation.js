import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Popins
 */

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const urlOrigin = urlParams.get("home-popin");
const popin = document.querySelector("#popin-home");

const popinHide = (targetPopin) => {
  targetPopin.classList.add("hidden");
  document.querySelector("body").classList.add("popin-visible");
  document.querySelector(".popin-overlay").classList.add("hidden");
};

const popinShow = (targetPopin) => {
  targetPopin.classList.remove("hidden");
  document.querySelector("body").classList.remove("popin-visible");
  document.querySelector(".popin-overlay").classList.remove("hidden");
};

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  if (urlOrigin == "false") {
    popinHide(popin);
  } else {
    popinShow(popin);
  }
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
  "/4-lumiere/first-painting/caravage-color.jpg"
);
colorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Object
 */
// First painting
const firstPaintingGeometry = new THREE.PlaneGeometry(5.3, 4, 150, 100);
const firstPaintingMaterial = new THREE.MeshStandardMaterial({
  map: colorTexture,
});
const firstPainting = new THREE.Mesh(
  firstPaintingGeometry,
  firstPaintingMaterial
);

const secondPainting = new THREE.Mesh(
  firstPaintingGeometry,
  firstPaintingMaterial
);

scene.add(firstPainting, secondPainting);

// Wheel ellipse

var ellipseGeometry = new THREE.CircleGeometry(
  globalParameters.ellipseRadius,
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

// Wheel positions
ellipse.rotation.y = -Math.PI * 0.5;
ellipse.add(firstPainting);
ellipse.add(secondPainting);
firstPainting.rotation.y = Math.PI * 0.5;
firstPainting.position.x = globalParameters.ellipseRadius;

secondPainting.rotation.y = Math.PI * 0.5;
secondPainting.position.x = -globalParameters.ellipseRadius;

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

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

window.addEventListener("click", () => {
  // Cast a ray
  raycaster.setFromCamera(mouse, camera);

  const objectsToTest = [firstPainting, secondPainting];
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
      default:
        console.log("no link");
    }
  }
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
camera.position.z = 12;
scene.add(camera);

/**
 * Pointer
 */
const pointer = new THREE.Vector2();

window.addEventListener("pointermove", (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target = ellipse.position;
controls.enableDamping = true;

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

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  previousTime = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
