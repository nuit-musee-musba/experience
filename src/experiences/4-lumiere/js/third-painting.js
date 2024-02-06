import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
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

// Hide popin
const popinHide = (targetPopin) => {
  targetPopin.classList.add("hidden");
  document.querySelector(".popin-overlay").classList.add("hidden");
};

// Show popin
const popinShow = (targetPopin) => {
  targetPopin.classList.remove("hidden");
  document.querySelector(".popin-overlay").classList.remove("hidden");
};

// Popin close buttons
const popinBtns = document.querySelectorAll(".popin-btn.popin-close");
for (const popinBtn of popinBtns) {
  const targetPopin = document.querySelector(popinBtn.dataset.target);
  popinBtn.addEventListener("click", (event) => {
    event.preventDefault();
    popinHide(targetPopin);
  });
}

// Popin open buttons
const popinOpenBtns = document.querySelectorAll(".popin-btn.popin-open");
for (const popinOpenBtn of popinOpenBtns) {
  const targetPopin = document.querySelector(popinOpenBtn.dataset.target);
  popinOpenBtn.addEventListener("click", (event) => {
    event.preventDefault();
    popinShow(targetPopin);
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

let globalParameters = {
  lightAngleStrength: 0.5,
  lightRadius: 1.3,
  planDistance: 0.5,
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

/**
 * Loader
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/4-lumiere//draco/");

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

const paintingTweaks = gui.addFolder("Painting parameters");
paintingTweaks
  .add(globalParameters, "planDistance")
  .min(0)
  .max(1)
  .step(0.01)
  .name("Plan distance")
  .onChange(() => {
    secondPainting1.position.z = 2 * globalParameters.planDistance;
    secondPainting3.position.z = -globalParameters.planDistance;
  });

// Frame
gltfLoader.load(
  "/4-lumiere/third-painting/third-painting-frame.glb",
  (gltf) => {
    gltf.scene.scale.set(6.0625, 6.0625, 6.0625);
    gltf.scene.position.z = 0.5;
    gltf.scene.position.x = -0.05;
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
  0.005, // radiusTop
  0.005, // radiusBottom
  3, // height
  32, // radialSegments
  1 // heightSegments
);
var lineMaterial = new THREE.MeshBasicMaterial({
  color: globalParameters.white,
  transparent: true,
  // opacity: 0,
  // wireframe: true,
});
var line = new THREE.Mesh(lineGeometry, lineMaterial);
// line.position.z = 0.25;
line.position.z = globalParameters.planDistance;
line.position.y = -0.5;
scene.add(line);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(
  "#d1dbff", // color
  5 // intensity
);
scene.add(ambientLight);

const ambientLightTweaks = gui.addFolder("Ambient light parameters");
ambientLightTweaks.add(ambientLight, "visible");
ambientLightTweaks.addColor(ambientLight, "color");
ambientLightTweaks.add(ambientLight, "intensity").min(0).max(3).step(0.001);

// Second painting point light
const rectAreaLight = new THREE.RectAreaLight(
  "#9FB2FF", // color
  1, // intensity
  8, // width
  2.5 // height
);
// pointLight.position.x = globalParameters.lightRadius;
scene.add(rectAreaLight);
line.add(rectAreaLight);

const lightMaxPos = line.geometry.parameters.height / 2;
const lightMinPos = -(line.geometry.parameters.height / 2);

rectAreaLight.position.y = lightMaxPos / 2;

console.log("rectAreaLight: ", rectAreaLight);
const rectAreaLightTweaks = gui.addFolder("Rectangle area light parameters");
rectAreaLightTweaks.add(rectAreaLight, "visible");
rectAreaLightTweaks.addColor(rectAreaLight, "color").onChange((value) => {
  console.log(value.getHexString());
});
rectAreaLightTweaks.add(rectAreaLight, "intensity").min(0).max(15).step(1);

// Helper
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// rectAreaLightHelper.visible = false;
scene.add(rectAreaLightHelper);
rectAreaLightTweaks.add(rectAreaLightHelper, "visible").name("Repère visuel");

const rectAreaLightPosition = rectAreaLightTweaks.addFolder(
  "Spot light position"
);

rectAreaLightPosition
  .add(rectAreaLight.position, "x")
  .min(-10)
  .max(10)
  .step(0.01);
rectAreaLightPosition
  .add(rectAreaLight.position, "y")
  .min(-10)
  .max(10)
  .step(0.01);
rectAreaLightPosition
  .add(rectAreaLight.position, "z")
  .min(-10)
  .max(10)
  .step(0.01);

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

const cameraTweaks = gui.addFolder("Camera parameters");
cameraTweaks
  .add(camera.position, "z")
  .min(-10)
  .max(200)
  .step(0.1)
  .name("Camera z pos");

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

// Update pointer position
canvas.addEventListener("touchstart", (event) => {
  pointer.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

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
      const movementSpeed = 1; // Adjust this value for desired sensitivity
      if (rectAreaLight.position.y < lightMaxPos && deltaY > 0) {
        rectAreaLight.position.y += deltaY * movementSpeed;
      }
      if (rectAreaLight.position.y > lightMinPos && deltaY < 0) {
        rectAreaLight.position.y += deltaY * movementSpeed;
      }
      // changeLights();
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

// Change day time
// function changeLights() {
//   const relativeCursorPosition = new THREE.Vector3(pointer.x, pointer.y, 0).sub(
//     line.position
//   );
//   const angle = Math.atan2(relativeCursorPosition.y, relativeCursorPosition.x);
//   const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);
//   return normalizedAngle;
// }

// // Result button
// const resultBtn = document.querySelector("#btn-validate");
// let resultState = false;
// const valudResultPopin = document.querySelector("#popin-result-true");

// // Update line rotation
// function updatePosition() {
//   const angle = calculateAngle();
//   line.rotation.z = angle;

//   // // Check result
//   if (angle > 3.6 && angle < 3.9) {
//     console.log("angle ok");
//     resultState = true;
//     if (resultBtn.classList.contains("hidden")) {
//       resultBtn.classList.remove("hidden");
//     }
//   } else {
//     resultState = false;
//   }
// }

// // Check result on click
// resultBtn.addEventListener("click", (event) => {
//   event.preventDefault();
//   if (resultState == true) {
//     popinShow(valudResultPopin);
//   } else {
//   }
// });

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.target = line.position;
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

const tick = () => {
  // Update controls
  // controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
