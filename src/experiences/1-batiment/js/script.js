import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { period } from "./period";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import GUI from "lil-gui";
import { enableInactivityRedirection } from "/global/js/inactivity";
import { MeshTransmissionMaterial } from "./materials/MeshTransmissionMaterial";
import FakeGlowMaterial from "./materials/FakeGlowMaterial";

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
let mixer = null;
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

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Orb

const orbGeometry = new THREE.SphereGeometry(0.25, 30, 30);
const orbMaterial = new MeshTransmissionMaterial();
const orbMesh = new THREE.Mesh(orbGeometry, orbMaterial);
orbMesh.castShadow = true;

scene.add(orbMesh);

const orbGlowGeometry = new THREE.SphereGeometry(0.45, 30, 30);

const orbGlowMaterial = new FakeGlowMaterial({
  falloff: 1,
  glowInternalRadius: 4.3,
  glowColor: new THREE.Color(0x13b1ff),
  glowSharpness: 0,
  opacity: 1,
});

Object.assign(orbMaterial, {
  clearcoat: 0,
  clearcoatRoughness: 0.5,
  _transmission: 1,
  chromaticAberration: 0,
  anisotrophicBlur: 0.4,
  roughness: 0,
  thickness: 2.15,
  ior: 1.7,
  distortion: 1,
  distortionScale: 0.2,
  temporalDistortion: 0.9,
  color: new THREE.Color(0xffffff),
});

const orbGlowMesh = new THREE.Mesh(orbGlowGeometry, orbGlowMaterial);

scene.add(orbGlowMesh);

const glowFolder = gui.addFolder("Flow");

glowFolder
  .add(orbGlowMaterial.uniforms.falloff, "value")
  .min(0)
  .max(1)
  .step(0.01)
  .name("Falloff");
glowFolder
  .add(orbGlowMaterial.uniforms.glowInternalRadius, "value")
  .min(-10)
  .max(10)
  .step(0.01)
  .name("Glow Internal Radius");
glowFolder
  .addColor(
    {
      GlowColor: orbGlowMaterial.uniforms.glowColor.value.getStyle(),
    },
    "GlowColor"
  )
  .onChange((color) => {
    orbGlowMaterial.uniforms.glowColor.value.setStyle(color);
    orbGlowMaterial.needsUpdate = true;
  })
  .name("Glow Color");
glowFolder
  .add(orbGlowMaterial.uniforms.glowSharpness, "value")
  .min(0)
  .max(1)
  .step(0.01)
  .name("Glow Sharpness");
glowFolder
  .add(orbGlowMaterial.uniforms.opacity, "value")
  .min(0)
  .max(1)
  .step(0.01)
  .name("Opacity");

const folderOrb = gui.addFolder("Orb");

folderOrb.addColor(orbMaterial, "color");
folderOrb.addColor(orbMaterial, "color");
folderOrb.add(orbMaterial, "clearcoat", 0, 1, 0.01);
folderOrb.add(orbMaterial, "clearcoatRoughness", 0, 1, 0.01);
folderOrb.add(orbMaterial, "chromaticAberration", 0, 0.1, 0.001);
folderOrb.add(orbMaterial, "anisotrophicBlur", 0, 1, 0.01);
folderOrb.add(orbMaterial, "roughness", 0, 1, 0.01);
folderOrb.add(orbMaterial, "thickness", 0, 10, 0.01);
folderOrb.add(orbMaterial, "ior", 1, 3, 0.01);
folderOrb.add(orbMaterial, "distortion", 0, 1, 0.01);
folderOrb.add(orbMaterial, "distortionScale", 0, 1, 0.01);
folderOrb.add(orbMaterial, "temporalDistortion", 0, 1, 0.01);

orbMesh.position.set(1, 2, 3);
orbGlowMesh.position.set(1, 2, 3);

// LIGHTS

const ambientLight = new THREE.AmbientLight("#ffffff", 0.8);
gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Ambient Light");

const directionalLight = new THREE.DirectionalLight("#EBF5F6", 3);
gui.add(directionalLight, "intensity").min(0).max(10).step(0.001).name("Sun");
directionalLight.position.set(1, 3, 4);
directionalLight.lookAt(4, 2, 4);

scene.add(ambientLight, directionalLight);

gltfLoader.load("/1-batiment/assets/scenetoutbatiment.glb", (gltf) => {
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
renderer.setClearColor("#808E90");

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
document.getElementById("nextButton").addEventListener("click", nextStep);
document.getElementById("interestButton").addEventListener("click", toggleInfo);
// controls.target = cube.position;
