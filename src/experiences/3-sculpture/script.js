import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import IntroPopup from "./component/1-IntroPart/IntroPart";
import RoughHewingPart from "./component/2-RoughHewingPart/RoughHewingPart";
import DetailsPart from "./component/3-DetailsPart/DetailsPart";
import RefiningPart from "./component/4-RefiningPart/RefiningPart";
import PolishingPart from "./component/5-PolishingPart/PolishingPart";
import OutroPart from "./component/6-OutroPart/OutroPart";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//
// INITIALIZATION
//
IntroPopup();
const canvas = document.querySelector("canvas.webgl");

// Scene

const scene = new THREE.Scene();

// GLTFLoader

const gltfLoader = new GLTFLoader();

//
// OBJET
//

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterialBlue = new THREE.MeshBasicMaterial({ color: "blue" });
const cubeMaterialYellow = new THREE.MeshBasicMaterial({ color: "yellow" });
const cubeMaterialRed = new THREE.MeshBasicMaterial({ color: "red" });
const cubeMaterialGreen = new THREE.MeshBasicMaterial({ color: "green" });

const cube1 = new THREE.Mesh(cubeGeometry, cubeMaterialBlue);
cube1.scale.set(0.5, 0.5, 0.5);
cube1.position.set(1, 0, 0);

const cube2 = new THREE.Mesh(cubeGeometry, cubeMaterialYellow);
cube2.scale.set(0.5, 0.5, 0.5);
cube2.position.set(0.5, 0, 0);

const cube3 = new THREE.Mesh(cubeGeometry, cubeMaterialRed);
cube3.scale.set(0.5, 0.5, 0.5);
cube3.position.set(1.5, 0, 0);

const cube4 = new THREE.Mesh(cubeGeometry, cubeMaterialGreen);
cube4.scale.set(0.5, 0.5, 0.5);
cube4.position.set(1, 0.5, 0);

const group = new THREE.Group();

// group.position.set(0, 0, 0);

scene.add(cube1);
// scene.add(cube2);
// scene.add(cube3);
// scene.add(cube4);

const planeGeometry = new THREE.PlaneGeometry(1, 1);
const planeMaterial = new THREE.MeshBasicMaterial({ color: "white" });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 0, -4);
plane.scale.set(5, 5, 5);
scene.add(plane);

let statueV1;

gltfLoader.load("/3-sculpture/MozartV1.glb", (gltf) => {
  gltf.scene.scale.set(0.38, 0.38, 0.38);
  gltf.scene.position.set(0.8, -0.75, 0);
  gltf.scene.rotation.y = Math.PI / 2;
  statueV1 = gltf.scene;
});

const light = new THREE.AmbientLight(0x404040);
scene.add(light);

//
// EVENT
//

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

let touchBefore = 0;
let currentTouch = 0;

const mouse = new THREE.Vector2();

window.addEventListener("touchmove", (event) => {
  currentTouch = event.touches[0].clientX / 100;
});

window.addEventListener("touchstart", (event) => {
  currentTouch = event.touches[0].clientX / 100;
  touchBefore = currentTouch;
});

//
// ANIMATE
//

// Mouse Moove

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -((event.clientY / sizes.height) * 2 - 1);
});

let currentPart1;
let currentPart2;
let currentPart3;
let currentPart4;

document.addEventListener(
  "click",
  (event) => {
    onClick(event);
  },
  false
);

let roughCube1 = 0;
let roughCube2 = 0;
let roughCube3 = 0;
let roughCube4 = 0;

function onClick(event) {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const part1 = raycaster.intersectObject(cube1);
  console.log(part1);
  currentPart1 = part1[0];

  if (currentPart1) {
    roughCube1++;
    if (roughCube1 === 1) {
      cube1.material.color.set("red");
      DetailsPart();
    }
    if (roughCube1 === 2) {
      cube1.material.color.set("yellow");
      RefiningPart();
    }
    if (roughCube1 === 3) {
      cube1.material.color.set("green");
      PolishingPart();
    }
    if (roughCube1 === 4) {
      cube1.material.color.set("blue");
      OutroPart();
    }
  }
  // if (currentPart2) {
  //   roughCube2++;
  //   if (roughCube2 === 1) {
  //     cube2.material.color.set("red");
  //   }
  //   if (roughCube2 === 2) {
  //     cube2.material.color.set("yellow");
  //   }
  //   if (roughCube2 === 3) {
  //     scene.remove(cube2);
  //   }
  // }
  // if (currentPart3) {
  //   roughCube3++;
  //   if (roughCube3 === 1) {
  //     cube3.material.color.set("red");
  //   }
  //   if (roughCube3 === 2) {
  //     cube3.material.color.set("yellow");
  //   }
  //   if (roughCube3 === 3) {
  //     scene.remove(cube3);
  //   }
  // }
  // if (currentPart4) {
  //   roughCube4++;
  //   if (roughCube4 === 1) {
  //     cube4.material.color.set("red");
  //   }
  //   if (roughCube4 === 2) {
  //     cube4.material.color.set("yellow");
  //   }
  //   if (roughCube4 === 3) {
  //     scene.remove(cube4);
  //   }
  // }
}

//Camera

const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 5);
scene.add(camera);

//
// CONTROL
//

const controls = new OrbitControls(camera, canvas);

controls.maxDistance = 6;
controls.minDistance = 3;
controls.enablePan = false;

controls.minPolarAngle = Math.PI / 3.5;
controls.maxPolarAngle = Math.PI / 2;

controls.minAzimuthAngle = 0;
controls.maxAzimuthAngle = 0;

controls.rotateSpeed = 0.1;

//Renderer

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  //Time
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  //Raycaster

  // if (part1.length) {
  //   currentPart1 = part1[0];
  // } else {
  //   currentPart1 = null;
  // }

  // if (part2.length) {
  //   currentPart2 = part2[0];
  // } else {
  //   currentPart2 = null;
  // }

  // if (part3.length) {
  //   currentPart3 = part3[0];
  // } else {
  //   currentPart3 = null;
  // }

  // if (part4.length) {
  //   currentPart4 = part4[0];
  // } else {
  //   currentPart4 = null;
  // }

  //UpdateControls

  controls.update();
  //Animate in tick

  const rotateSpeed = currentTouch - touchBefore;

  cube1.rotation.y = cube1.rotation.y + rotateSpeed * 0.3;

  touchBefore = currentTouch;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
