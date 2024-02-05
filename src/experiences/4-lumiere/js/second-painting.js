import * as THREE from "three";
import GUI from "lil-gui";

/**
 * TO DO LIST
 * Ajouter le cadre du tableau
 * Changer les images avec les versions retravaillées
 * Mise en forme des éléments (popins, textes, boutons)
 *
 * petit fx parallax avec le cursor "light" suivant sa position droite ou gauche :
 * mouvement delayed inverse de la position pour mettre en avant la lumière
 *
 * Trouver le petit détail effet waouw de ce tableau
 */

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
  lightRadius: 5.2,
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
  "/4-lumiere/second-painting/second-painting-plan-1.png"
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
  normal: thirdPlanNormalTexture,
});
const secondPainting3 = new THREE.Mesh(planeGeometry, secondPaintingMaterial3);
secondPainting3.position.z = -globalParameters.planDistance;

// Second painting | Add to scene
scene.add(secondPainting1, secondPainting2, secondPainting3);

const paintingTweaks = gui.addFolder("Painting parameters");
paintingTweaks
  .add(globalParameters, "planDistance")
  .min(0)
  .max(1)
  .step(0.01)
  .name("Plan distance")
  .onChange(() => {
    secondPainting1.position.z = globalParameters.planDistance;
    secondPainting3.position.z = -globalParameters.planDistance;
  });

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
ellipse.rotation.x = -Math.PI * 0.45;
ellipse.rotation.z = -0.9;
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

// Second painting point light
const pointLight = new THREE.PointLight(
  "#f09647", // color
  25, // intensity
  50, // distance
  1 // decay
);
pointLight.position.x = globalParameters.lightRadius;
scene.add(pointLight);
ellipse.add(pointLight);
const pointLightTweaks = gui.addFolder("Spot light parameters");
pointLightTweaks.add(pointLight, "visible");
pointLightTweaks.addColor(pointLight, "color");
pointLightTweaks.add(pointLight, "intensity").min(0).max(50).step(1);
pointLightTweaks.add(pointLight, "distance").min(0).max(70).step(1);
pointLightTweaks.add(pointLight, "decay").min(0).max(1).step(0.01);
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

// // Result button
const resultBtn = document.querySelector("#btn-validate");
let resultState = false;
const valudResultPopin = document.querySelector("#popin-result-true");

// Update ellipse rotation
function updateRotation() {
  const angle = calculateAngle();
  ellipse.rotation.z = angle;

  // // Check result
  if (angle > 3.6 && angle < 3.9) {
    console.log("angle ok");
    resultState = true;
    if (resultBtn.classList.contains("hidden")) {
      resultBtn.classList.remove("hidden");
    }
  } else {
    resultState = false;
  }
}

// Check result on click
resultBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (resultState == true) {
    popinShow(valudResultPopin);
  } else {
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
