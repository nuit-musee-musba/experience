import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { period } from "./period";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

let index = 0;
let previousTime = 0;
let time = 0;
const clock = new THREE.Clock();
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
let mixer = null;
let isShowingText = false;

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

// LIGHTS

const ambientLight = new THREE.AmbientLight("#ffffff", 0.8);

const directionalLight = new THREE.DirectionalLight("#EBF5F6", 3);
directionalLight.position.set(1, 3, 4);
directionalLight.lookAt(4, 2, 4);

scene.add(ambientLight, directionalLight);

gltfLoader.load("/1-batiment/assets/museeV2anime.glb", (gltf) => {
  scene.add(gltf.scene);

  mixer = new THREE.AnimationMixer(gltf.scene);

  gltf.animations.sort((a, b) => a.timestamp - b.timestamp);

  gltf.animations.forEach((animation, index) => {
    const action = mixer.clipAction(animation);

    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(1);
    action.clampWhenFinished = true;
    action.loop = THREE.LoopOnce;
    action.startAt(0);
    action.play();
  });
});

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
  100
);
camera.position.set(2, 6, 2);
scene.add(camera);

// CONTROLS CAMERA
const controls = new OrbitControls(camera, canvas);
controls.enableZoom = false;

const getCameraPositionForTarget = (position) => {
  return { x: position.x + 0, y: position.y + 1, z: position.z + 1 };
};

//RENDERER

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#808E90");

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  time += 0.1;

  if (mixer) {
    mixer.update(deltaTime);
  }

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

const displayInfo = () => {
  if (!isShowingText) {
    isShowingText = true;
    component.style.display = "flex";
    return;
  }
  if (isShowingText) {
    isShowingText = false;
    component.style.display = "none";
    return;
  }
};

const nextStep = () => {
  if (index + 1 < period.length) {
    index++;
    handleFocusPeriod(period[index]);
    console.log(index);
  } else {
    endMenu.style.display = "flex";
  }
};

for (let i = 1; i <= 4; i++) {
  document.getElementById(`period${i}`).addEventListener("click", () => {
    handleFocusPeriod(period[i - 1]);
    index = i - 1;
  });
}

function handleFocusPeriod(step) {
  if (!step) {
    return;
  }

  const targetPosition = step.position;

  const cameraPosition = getCameraPositionForTarget(targetPosition);

  document.getElementById("title-component").textContent = step.title;
  document.getElementById("text-component").innerHTML = step.description
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");

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
document.getElementById("nextButton").addEventListener("click", nextStep);
document
  .getElementById("interestButton")
  .addEventListener("click", displayInfo);
