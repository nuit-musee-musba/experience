import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import LoadPart from "./LoadPart";
import RoughHewingPart from "./component/2-RoughHewingPart/RoughHewingPart";
import DetailsPart from "./component/3-DetailsPart/DetailsPart";
import RefiningPart from "./component/4-RefiningPart/RefiningPart";
import PolishingPart from "./component/5-PolishingPart/PolishingPart";
import OutroPart from "./component/6-OutroPart/OutroPart";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./component/1-IntroPart/IntroPart.scss";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
let steps = 0;
let raycasterActive = false;
const steps1InRoughPart = document.getElementById("steps1InRoughPart");
const steps2InRoughPart = document.getElementById("steps2InRoughPart");
//
// INITIALIZATION
//

const IntroPopup = () => {
  const IntroPart = document.getElementById("IntroPart");
  const buttonIntro = document.getElementById("buttonIntro");

  buttonIntro.addEventListener("click", function () {
    IntroPart.classList.remove("show");
    steps1InRoughPart.classList.add("show");
    steps++;
    mouse.x = -1;
    mouse.y = -1;
    stepsFunction();
    RoughHewingPart();
  });
};
LoadPart();
IntroPopup();

console.log(steps);

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
let statueV2;

gltfLoader.load("/3-sculpture/Bloc_Degrossi.glb", (gltf) => {
  gltf.scene.scale.set(0.38, 0.38, 0.38);
  gltf.scene.position.set(1.3, -1, -1.5);
  gltf.scene.rotation.y = Math.PI / 2;
  statueV1 = gltf.scene;

  scene.add(statueV1);
});

gltfLoader.load("/3-sculpture/dégrossi-to-sculpt.glb", (gltf) => {
  gltf.scene.scale.set(0.38, 0.38, 0.38);
  gltf.scene.position.set(1.3, -1, -1.5);
  gltf.scene.rotation.y = Math.PI / 2;
  statueV2 = gltf.scene;

  scene.add(statueV2);
});

const light = new THREE.AmbientLight(0x404040);
light.intensity = 100;
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

//
// ANIMATE
//

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -((event.clientY / sizes.height) * 2 - 1);
});

window.addEventListener("click", onClick);

function onClick() {
  stepsFunction();
}

function changeTextInSteps(removeText, addText) {
  removeText.classList.remove("show");
  addText.classList.add("show");
  raycasterActive = true;
}

function stepsFunction() {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  switch (steps) {
    case 1:
      if (statueV1) {
        const intersects = raycaster.intersectObject(statueV1);
        const nextText = document.getElementById("nextText");

        nextText.addEventListener("touchstart", function () {
          changeTextInSteps(steps1InRoughPart, steps2InRoughPart);
        });

        if (statueV1.children.length <= 4) {
          changeTextInSteps(steps2InRoughPart, steps3InRoughPart);
        }

        if (intersects.length > 0 && raycasterActive) {
          const clickedBlock = intersects[0].object.parent;

          statueV1.remove(clickedBlock);

          if (statueV1.children.length === 0) {
            mouse.x = -1;
            mouse.y = -1;
            steps++;
            raycasterActive = false;
            DetailsPart();
            stepsFunction();
          }
        }
      }
      break;
    case 2:
      if (statueV2) {
        const intersects = raycaster.intersectObject(statueV2);
        const nextText2 = document.getElementById("nextText2");
        nextText2.addEventListener("touchstart", function () {
          changeTextInSteps(steps1InDetailsPart, steps2InDetailsPart);
        });

        if (statueV2.children.length <= 6) {
          changeTextInSteps(steps2InDetailsPart, steps3InDetailsPart);
        }
        if (statueV2.children.length <= 3) {
          changeTextInSteps(steps3InDetailsPart, steps4InDetailsPart);
        }

        if (intersects.length > 0 && raycasterActive) {
          const clickedBlock = intersects[0].object.parent;

          statueV2.remove(clickedBlock);

          if (statueV2.children.length === 0) {
            mouse.x = -1;
            mouse.y = -1;
            steps++;
            raycasterActive = false;
            RefiningPart();
            stepsFunction();
          }
        }
      }
      break;
    case 3:
      break;
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
    statueV2.rotation.y = statueV2.rotation.y + rotateSpeed * 0.3;
  }

  touchBefore = currentTouch;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

export { steps };
