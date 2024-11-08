import { ambiantSound } from "@/global/js/sound";
import { firstFingerOfEvent } from "@/global/js/touch";
import GUI from "lil-gui";
import * as THREE from "three";
import { enableInactivityRedirection } from "/global/js/inactivity";

/**
 * Ambiant Sound
 */
ambiantSound("/global/sounds/g4.mp3")
  .tryToPlayDirectly()
  .playOnFirstInteraction();

/**
 * Global settings
 */
// Clear local storage
const clearLocalStorage = () => {
  localStorage.removeItem("4-first");
  localStorage.removeItem("4-second");
  localStorage.removeItem("4-third");
}
// leave button
const leaveBtns = document.querySelectorAll(".btn-back-hub")
for (const leaveBtn of leaveBtns) {
  leaveBtn.addEventListener("click",
    () => {
      clearLocalStorage();
      window.location.href = "/experiences/5-hub";
    }
  )
}

// Inactivity
enableInactivityRedirection().beforeRedirect(() => {
  clearLocalStorage;
});


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
    setTimeout(() => {
      targetPopin.classList.add("textshow");
    }, 4500);
  }
};

document.addEventListener("DOMContentLoaded", (event) => {

  if (urlOrigin == "false") {
    popinHide(popin1);
    popinHide(popin2);
  } else {
    popinShow(popin1);
    setTimeout(() => {
      popinHide(popin1);
    }, 3000);
    popinShow(popin2);
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
 * Threejs
 */

// Debug
const gui = new GUI({
  width: 300,
  title: "Debugger",
  closeFolders: true,
});
gui.hide();

/**
 * Base
 */
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
loadingManager.onError = (error) => {
  console.log("Error :", error);
};

const textureLoader = new THREE.TextureLoader(loadingManager);

const firstPaintingTexture = textureLoader.load(
  "/4-lumiere/first-painting/first-painting-color.webp"
);
firstPaintingTexture.colorSpace = THREE.SRGBColorSpace;

const secondPaintingTexture = textureLoader.load(
  "/4-lumiere/second-painting/second-painting-plan-3.webp"
);
secondPaintingTexture.colorSpace = THREE.SRGBColorSpace;

const thirdPaintingTexture = textureLoader.load(
  "/4-lumiere/third-painting/third-painting-plan-3.webp"
);
thirdPaintingTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Object
 */

// Geometry
function generateParticles() {
  const particlesGeometry = new THREE.BufferGeometry()
  const count = 70

  const positions = new Float32Array(count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)

  for (let i = 0; i < count * 3; i++) // Multiply by 3 for same reason
  {
    positions[i] = (Math.random() - 0.5) * 10 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values

  // Material
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.105,
    sizeAttenuation: true
  })

  // color 
  particlesMaterial.color = new THREE.Color('#FFF7E2')

  // Texture
  const textureLoader = new THREE.TextureLoader()
  const particleTexture = textureLoader.load('/4-lumiere/particles/particle.png')
  particlesMaterial.map = particleTexture
  particlesMaterial.alphaTest = 0.001
  particlesMaterial.depthTest = false
  particlesMaterial.depthWrite = false
  particlesMaterial.blending = THREE.AdditiveBlending

  // Points
  return new THREE.Points(particlesGeometry, particlesMaterial)

}

// GENERATE 4 groups of particles

const particles1 = generateParticles();
particles1.position.z = 9
scene.add(particles1)

const particles2 = generateParticles();
particles2.position.z = 9
scene.add(particles2)

const particles3 = generateParticles();
particles3.position.z = 9
scene.add(particles3)

const particles4 = generateParticles();
particles4.position.z = 9
scene.add(particles4)

// First painting
const firstPaintingGeometry = new THREE.PlaneGeometry(5.3, 4, 150, 100);
const firstPaintingMaterial = new THREE.MeshStandardMaterial({
  map: firstPaintingTexture,
});
const firstPainting = new THREE.Mesh(
  firstPaintingGeometry,
  firstPaintingMaterial
);

firstPainting.name = "first";
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

secondPainting.name = "second";
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

thirdPainting.name = "third";
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
);

/**
 * Toggle painting desc
 */
const objectsToTest = [firstPainting, secondPainting, thirdPainting];
const descsToToggle = [
  document.querySelector("#first-desc"),
  document.querySelector("#second-desc"),
  document.querySelector("#third-desc")
]

const NEAREST_POSITION = -4;

const checkCurrentPainting = () => {
  let nearestPos = NEAREST_POSITION;
  let nearestPainting = null;
  for (let i = 0; i < objectsToTest.length; i++) {
    if (objectsToTest[i].position.z > nearestPos) {
      nearestPos = objectsToTest[i].position.z;
      nearestPainting = objectsToTest[i].name
    }
  }
  return nearestPainting;
}

const togglePaintingDesc = () => {
  const currentPainting = checkCurrentPainting()

  for (let i = 0; i < objectsToTest.length; i++) {
    if (objectsToTest[i].name === currentPainting) {
      descsToToggle[i].classList.remove("hidden")
    } else {
      descsToToggle[i].classList.add("hidden")
    }
  }
}

togglePaintingDesc()

canvas.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);

  const objectsToTest = [firstPainting, secondPainting, thirdPainting];
  const intersects = raycaster.intersectObjects(objectsToTest);

  const currentIntersect = intersects[0];

  console.log(currentIntersect);

  if (!currentIntersect) {
    return
  }

  switch (currentIntersect.object) {
    case firstPainting:
      window.location.href = "./first-painting.html";
      break;

    case secondPainting:
      window.location.href = "./second-painting.html";
      break;

    case thirdPainting:
      window.location.href = "./third-painting.html";
      break;

    default:
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
camera.position.z = 9;
scene.add(camera);

/**
 * Pointer
 */
const pointer = new THREE.Vector2();

canvas.addEventListener("touchmove", (event) => {
  const firstFinger = firstFingerOfEvent(event);

  if (!firstFinger) {
    return
  }

  pointer.x = (firstFinger.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(firstFinger.clientY / window.innerHeight) * 2 + 1;
});

// Variables to track touch events
let touchStartY = 0;
let touchMoveY = 0;
let isSwiping = false;

// Add event listeners for touch events on the window
window.addEventListener("touchstart", function (event) {
  const firstFinger = firstFingerOfEvent(event);

  if (!firstFinger) {
    return
  }

  // Record the starting Y position of the touch
  touchStartY = -(firstFinger.clientY / window.innerHeight) * 2 + 1;
  isSwiping = true;
  globalParameters.userInteract = true;
});

window.addEventListener(
  "touchmove",
  function (event) {
    const firstFinger = firstFingerOfEvent(event);

    if (!firstFinger) {
      return
    }

    if (isSwiping) {
      touchMoveY = -(firstFinger.clientY / window.innerHeight) * 2 + 1;
      // Calculate the vertical distance swiped
      const deltaY = touchMoveY - touchStartY;

      // Adjust the rotation of the ellipse based on the swipe distance
      const rotationSpeed = 2; // Adjust this value for desired sensitivity
      ellipse.rotation.z += deltaY * rotationSpeed;

      // Update the starting Y position for the next frame
      touchStartY = -(firstFinger.clientY / window.innerHeight) * 2 + 1;

      // Render
      renderer.render(scene, camera);
    }
    togglePaintingDesc()
  },
  { passive: false }
);

window.addEventListener("touchend", function () {
  // Reset the swipe tracking variables
  isSwiping = false;
});

/**
 * SetInterval
 */

// Function
// setInterval(checkUserInteractions, 2000);

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

/**
 * Animate
 */
// let currentIntersect = null;
const clock = new THREE.Clock()

const tick = () => {
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

  //Particles move
  const elapsedTime = clock.getElapsedTime()

  // Update particles
  particles1.position.x = Math.cos(elapsedTime / 2) * 0.05
  particles1.position.y = Math.sin(elapsedTime / 2) * 0.05
  particles1.position.z = Math.sin(elapsedTime / 2) * 0.05 + 9

  particles2.position.x = Math.cos(elapsedTime / 2) * -0.05
  particles2.position.y = Math.sin(elapsedTime / 2) * -0.05
  particles2.position.z = Math.sin(elapsedTime / 2) * -0.05 + 9

  particles3.position.x = Math.sin(elapsedTime / 2) * 0.05
  particles3.position.y = Math.cos(elapsedTime / 2) * -0.05
  particles3.position.z = Math.cos(elapsedTime / 2) * 0.05 + 9

  particles4.position.x = Math.sin(elapsedTime / 2) * -0.05
  particles4.position.y = Math.cos(elapsedTime / 2) * 0.05
  particles4.position.z = Math.sin(elapsedTime / 2) * -0.05 + 9


  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)

};

tick();
