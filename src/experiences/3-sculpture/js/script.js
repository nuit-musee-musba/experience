import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import IntroPopup from "./IntroPopup";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//
// INITIALIZATION
//

IntroPopup();

const canvas = document.querySelector("canvas.webgl");

//Renderer

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 1.75;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor("#211d20");
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Scene

const scene = new THREE.Scene();

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
// OBJET
//

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: "blue" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0, 0);
scene.add(cube);

const planeGeometry = new THREE.PlaneGeometry(1, 1);
const planeMaterial = new THREE.MeshBasicMaterial({ color: "red" });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 0, -4);
plane.scale.set(5, 5, 5);
scene.add(plane);

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

window.addEventListener("touchmove", (event) => {
  currentTouch = event.touches[0].clientX / 100;
});

window.addEventListener("touchstart", (event) => {
  currentTouch = event.touches[0].clientX / 100;
  touchBefore = currentTouch;
});
//
// CONTROL
//

const controls = new OrbitControls(camera, canvas);

controls.maxDistance = 6;
controls.minDistance = 3;
controls.minPolarAngle = Math.PI / 2;
controls.maxPolarAngle = Math.PI / 2;

//
// ANIMATE
//

const clock = new THREE.Clock();
let previousTime = 0;

const diminue = -1;

camera.position.z = 5 - diminue;
plane.position.z = -8 + diminue;

const dampingFactor = 0.02;

const tick = () => {
  //Time
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  //Animate in tick

  const rotateSpeed = currentTouch - touchBefore;

  cube.rotation.y =
    THREE.MathUtils.lerp(
      cube.rotation.y,
      cube.rotation.y + rotateSpeed * 5,
      dampingFactor
    ) +
    rotateSpeed * 0.3;

  touchBefore = currentTouch;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
