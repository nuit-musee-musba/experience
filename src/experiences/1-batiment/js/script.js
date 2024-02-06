import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { period } from "./period";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import GUI from "lil-gui";
import { enableInactivityRedirection } from "/global/js/inactivity";
import { AnimatedObject } from "/experiences/1-batiment/js/objectLoader";

enableInactivityRedirection();

const gui = new GUI();
let index = 0;
let previousTime = 0;
let time = 0;
const clock = new THREE.Clock();
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
let isShowingText = false;
const raycaster = new THREE.Raycaster();

dracoLoader.setDecoderPath("/1-batiment/draco/");
dracoLoader.preload();
gltfLoader.setDRACOLoader(dracoLoader);

//MATERIALS

// gltfLoader.load("/1-batiment/assets/museeV2anime.glb", (gltf) => {
//   gltf.scene.traverse((child) => {
//     if (child.isMesh) {
//       // child.material = new THREE.MeshBasicMaterial({ color: 'red', wireframe: true });
//     }
//   });
//   scene.add(gltf.scene);
//   gltf.scene.rotation.y = -1.25;
// });

const geometry = new THREE.SphereGeometry(0.2, 32, 16);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// LIGHTS

const ambientLight = new THREE.AmbientLight("#FFFFFF", 1);
gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Ambient Light");

const directionalLight1 = new THREE.DirectionalLight("#F5F0E8", 1.5);
gui.add(directionalLight1, "intensity").min(0).max(10).step(0.001).name("Sun");
directionalLight1.position.set(1, 3, 4);
directionalLight1.lookAt(4, 2, 4);

const directionalLight2 = new THREE.DirectionalLight("#F5F0E8", 1);
gui.add(directionalLight2, "intensity").min(0).max(10).step(0.001).name("Sun");
directionalLight2.position.set(-1, 3, -4);
directionalLight2.lookAt(4, 2, 4);

scene.add(ambientLight, directionalLight1, directionalLight2);

// MODELS

const models = [
  "/1-batiment/assets/gallerieba.glb",
  "/1-batiment/assets/hotellaland.glb",
  "/1-batiment/assets/mairie.glb",
  "/1-batiment/assets/maisondeco.glb",
  "/1-batiment/assets/musba.glb",
];
// let animatedScenes = [];
// let loadedIndex = 0;
let animatedScenes = [];
gltfLoader.load(models[0], (gltf) => {
  animatedScenes[new AnimatedObject(gltf)];
});

animatedScenes[0].setup();

// function loadNextAsset(path) {
//   gltfLoader.load(path, (gltf) => {
//     animatedScenes[new AnimatedObject(gltf)];

//     loadedIndex += 1;
//     if (loadedIndex < assets.length) {
//       loadNextAsset(assets[loadedIndex]);
//     } else {
//       onAllIsLoaded();
//     }
//   });
// }
// loadNextAsset(models[0]);

// function onAllIsLoaded() {
// }

// SIZES
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.2,
  500
);
const fixedCameraHeight = 6;
scene.add(camera);

// CONTROLS CAMERA
const controls = new OrbitControls(camera, canvas);

controls.enablePan = false;
// controls.enableZoom = false;

// controls.minPolarAngle = Math.PI / 8;
// controls.maxPolarAngle = Math.PI / 2 - 0.1;

const getCameraPositionForTarget = (position) => {
  return { x: position.x + 0, y: position.y + 6, z: position.z + 1 };
};

//RENDERER

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#FFF6ED");

//MOUSE

const mouse = new THREE.Vector2();

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object === cube) {
      showText();
      break;
    } else {
      hideText();
    }
  }
}

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  time += 0.1;

  animatedScenes.forEach((animatedScene) => {
    animatedScene.update();
  });

  // if ((mixer, mixer2, mixer3, mixer4, mixer5) !== null) {
  //   mixer.update(deltaTime);
  //   // mixer2.update(deltaTime);
  //   mixer3.update(deltaTime);
  //   mixer4.update(deltaTime);
  //   mixer5.update(deltaTime);
  // }

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

const endMenu = document.getElementById("end-menu");
const component = document.getElementById("component");

const audioContent = document.getElementById("audio-content");
const audio = document.getElementById("audio");

let isAudioPlaying = false;

audioContent.addEventListener("click", () => {
  if (isAudioPlaying) {
    audio.src = "./assets/icons/audio.svg";
  } else {
    audio.src = "./assets/icons/audioNone.svg";
  }

  isAudioPlaying = !isAudioPlaying;
});

const restart = () => {
  index = 0;
  handleFocusPeriod(period[index]);
  endMenu.style.display = "none";
};

const showText = () => {
  isShowingText = true;
  component.style.display = "flex";
};

const hideText = () => {
  isShowingText = false;
  component.style.display = "none";
};
window.addEventListener("click", onMouseClick, false);
window.addEventListener("mousedown", hideText(), false); // Doesnt work wtf

const toggleInfo = () => {
  if (!isShowingText) {
    showText();
    return;
  }
  if (isShowingText) {
    hideText();
    return;
  }
};

const nextStep = () => {
  if (index + 1 < period.length) {
    index++;
    handleFocusPeriod(period[index]);
  } else {
    endMenu.style.display = "flex";
  }
};

for (let i = 1; i <= 4; i++) {
  document.getElementById(`period${i}`).addEventListener("click", () => {
    index = i - 1;
    handleFocusPeriod(period[i - 1]);
  });

  document.getElementById(`circle${i}`).addEventListener("click", () => {
    index = i - 1;
    handleFocusPeriod(period[i - 1]);
  });
}

function handleFocusPeriod(step) {
  if (!step) {
    return;
  }

  const dateTitleElement = document.getElementById("date-title");
  dateTitleElement.textContent = "";

  dateTitleElement.appendChild(document.createTextNode(step.date));

  const selectedButtonId = `period${index + 1}`;
  const selectedRoundButtonId = `circle${index + 1}`;

  document.getElementById(selectedButtonId).style.fontSize = "8rem";
  document.getElementById(selectedRoundButtonId).style.backgroundColor =
    "white";

  for (let i = 1; i <= period.length; i++) {
    if (i - 1 !== index) {
      document.getElementById(`period${i}`).style.fontSize = "4rem";
      document.getElementById(`circle${i}`).style.backgroundColor = "#ffffff50";
    }
  }

  const targetPosition = step.position;

  const cameraPosition = getCameraPositionForTarget(targetPosition);

  document.getElementById("title-component").textContent = step.title;
  document.getElementById("text-component").innerHTML = step.description
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");

  cube.position.set(
    step.cubePosition.x,
    step.cubePosition.y,
    step.cubePosition.z
  );

  // camera.lookAt(cube.position);

  cube.cursor = "pointer";

  const rayOrigin = new THREE.Vector3(camera.position);
  const rayDirection = new THREE.Vector3(cube.position);
  raycaster.set(rayOrigin, rayDirection);
  rayDirection.normalize();

  raycaster.setFromCamera(mouse, camera);

  cube.material.color.set("#0000ff");

  gsap.to(controls.step, {
    duration: 1,
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
  });

  gsap.to(controls.object.position, {
    duration: 1,
    x: cameraPosition.x,
    y: cameraPosition.y,
    z: cameraPosition.z,
  });
}
handleFocusPeriod(period[index]);

document.getElementById("restart-button").addEventListener("click", restart);
// document.getElementById("nextButton").addEventListener("click", nextStep);
// document.getElementById("interestButton").addEventListener("click", toggleInfo);
// controls.target = cube.position;
