import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import IntroPopup from "./component/IntroPart/IntroPopup";
import RoughHewingPart from "./component/RoughHewingPart/RoughHewingPart";
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

//Camera

const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1000, 10, 10);
scene.add(camera);

//
// OBJET
//

const planeGeometry = new THREE.PlaneGeometry(1, 1);
const planeMaterial = new THREE.MeshBasicMaterial({ color: "white" });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 0, -4);
plane.scale.set(5, 5, 5);
scene.add(plane);

let statueV1;

gltfLoader.load("/3-sculpture/Blocs_V1.glb", (gltf) => {
  const enfants = gltf.scene.children;
  gltf.scene.scale.set(0.38, 0.38, 0.38);
  gltf.scene.position.set(0.5, -1, -0.5);
  gltf.scene.rotation.y = Math.PI / 2;
  statueV1 = gltf.scene;

  scene.add(statueV1);
});

// gltfLoader.load("/3-sculpture/Blocs_V1.glb", (gltf) => {
//   const enfants = gltf.scene.children;
//   gltf.scene.scale.set(0.38, 0.38, 0.38);
//   gltf.scene.position.set(0.5, -1, -0.5);
//   gltf.scene.rotation.y = Math.PI / 2;
//   statueV1 = gltf.scene;

//   scene.add(statueV1);
// });

const light = new THREE.AmbientLight(0x404040);
light.intensity = 1000;
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

const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -((event.clientY / sizes.height) * 2 - 1);
});

window.addEventListener("click", onClick);

function onClick() {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  if (statueV1 && statueV1.children) {
    const intersects = raycaster.intersectObjects(statueV1.children);

    if (intersects.length > 0) {
      const clickedBlock = intersects[0].object;
      statueV1.remove(clickedBlock);

      if (statueV1.children.length === 0) {
        console.log("Il n'y a plus de blocs à supprimer.");
      }
    }
  }
}

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

  //UpdateControls

  controls.update();
  //Animate in tick

  const rotateSpeed = currentTouch - touchBefore;

  if (statueV1) {
    statueV1.rotation.y = statueV1.rotation.y + rotateSpeed * 0.3;
  }

  touchBefore = currentTouch;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
