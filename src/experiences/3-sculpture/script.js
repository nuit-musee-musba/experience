import { enableInactivityRedirection } from "@/global/js/inactivity.ts";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import LoadPart from "./LoadPart";
import "./component/1-IntroPart/IntroPart.scss";
import RoughHewingPart from "./component/2-RoughHewingPart/RoughHewingPart";
import DetailsPart from "./component/3-DetailsPart/DetailsPart";
import RefiningPart from "./component/4-RefiningPart/RefiningPart";

enableInactivityRedirection();

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

let isPolished = false;
let sceneLoaded = false;

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

IntroPopup();

const canvas = document.querySelector("canvas.webgl");

// Scene

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 0, 15);

// TextureLoader

const textureLoader = new THREE.TextureLoader();

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

let workshop;
let socle;

let quantity;

gltfLoader.load("/3-sculpture/Mozart_sceneV3.glb", (gltf) => {
  gltf.scene.position.set(0, -1, -1.5);
  gltf.scene.rotation.y = Math.PI / 2;
  workshop = gltf.scene;

  for (let i = 0; i < workshop.children.length; i++) {
    if (workshop.children[i].name === "RSpot") {
      workshop.children[i].intensity = 20;
    } else if (workshop.children[i].name === "LSpot") {
      workshop.children[i].intensity = 5;
    } else if (workshop.children[i].name === "Area002_1") {
      workshop.children[i].intensity = 800;
    } else if (workshop.children[i].name === "Spot") {
      workshop.children[i].intensity = 350;
      workshop.children[i].distance = 6;
      workshop.children[i].angle = 0.821;
      workshop.children[i].penumbra = 1;
      workshop.children[i].decay = 2;
    } else if (workshop.children[i].name === "Socle") {
      socle = workshop.children[i];
    }
  }
  scene.add(workshop);
  LoadPart();
});
let statueV1;
let statueV2;
let statueV3;
let statueV4;
let statueV5;

const statueScale = new THREE.Vector3(0.25, 0.25, 0.25);
const statuePosition = new THREE.Vector3(1, -0.8, 0.6);
const statueRotation = Math.PI / 2;

gltfLoader.load("/3-sculpture/models/Bloc_Degrossi.glb", (gltf) => {
  gltf.scene.scale.set(statueScale.x, statueScale.y, statueScale.z);
  gltf.scene.position.set(statuePosition.x, statuePosition.y, statuePosition.z);
  gltf.scene.rotation.y = statueRotation;
  statueV1 = gltf.scene;



  scene.add(statueV1);
});

gltfLoader.load("/3-sculpture/models/Mozart_degrossiV1.glb", (gltf) => {
  gltf.scene.scale.set(statueScale.x, statueScale.y, statueScale.z);
  gltf.scene.position.set(statuePosition.x, statuePosition.y, statuePosition.z);
  gltf.scene.rotation.y = statueRotation;
  statueV2 = gltf.scene;

  scene.add(statueV2);
});

gltfLoader.load("/3-sculpture/models/Mozart_sculptV1.glb", (gltf) => {
  gltf.scene.scale.set(statueScale.x, statueScale.y, statueScale.z);
  gltf.scene.position.set(statuePosition.x, statuePosition.y, statuePosition.z);
  gltf.scene.rotation.y = statueRotation;
  statueV3 = gltf.scene;

  scene.add(statueV3);
});

gltfLoader.load("/3-sculpture/models/Mozart_affinageV1.glb", async (gltf) => {
  statueV4 = gltf.scene.children[0];
  statueV4.scale.set(1.4, 1.4, 1.4);
  statueV4.position.set(0.5, -1, -0.5);
  statueV4.rotation.y = Math.PI + 0.6;

  const loader = new THREE.TextureLoader();
  loader.load("/3-sculpture/assets/croquis.png", (texture) => {
    statueV5 = statueV4.clone();
    statueV5.geometry = statueV4.geometry.clone();
    statueV5.scale.multiplyScalar(1.002);
    statueV5.position.z += 0.01;

    statueV5.material = statueV5.material.clone();
    statueV5.material.color = new THREE.Color(0x000000);
    statueV5.material.opacity = 1;
    statueV5.material.transparent = true;

    const polishRange = document.getElementById("PolishRange");
    polishRange.addEventListener("input", (event) => {
      quantity = 1 - parseFloat(event.target.value);
      statueV5.material.opacity = quantity;
    });
  });
});

const light = new THREE.AmbientLight(0x404040);
light.intensity = 20;
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
  // } else {
  if (event.target.id === "PolishRange") {
    isPolished = true;
  } else {
    currentTouch = event.touches[0].clientX / 100;
    isPolished = false;
  }
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
      if (statueV3) {
        const intersects = raycaster.intersectObject(statueV3);
        const nextText3 = document.getElementById("nextText3");
        const nextText4 = document.getElementById("nextText4");

        nextText3.addEventListener("touchstart", function () {
          changeTextInSteps(steps1InRefiningPart, steps2InRefiningPart);
        });

        nextText4.addEventListener("touchstart", function () {
          changeTextInSteps(steps2InRefiningPart, steps3InRefiningPart);
        });

        if (statueV3.children.length <= 6) {
          changeTextInSteps(steps3InRefiningPart, steps4InRefiningPart);
        }
        if (statueV3.children.length <= 4) {
          changeTextInSteps(steps4InRefiningPart, steps5InRefiningPart);
        }

        if (intersects.length > 0 && raycasterActive) {
          const clickedBlock = intersects[0].object;
          console.log(clickedBlock);
          statueV3.remove(clickedBlock);

          if (statueV3.children.length === 0) {
            mouse.x = -1;
            mouse.y = -1;
            mouse.y = -1;
            steps++;
            raycasterActive = false;
            PolishingPart();
            stepsFunction();
          }
        }
      }
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
renderer.toneMapping = THREE.ACESFilmicToneMapping;

let composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

let outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera
);
composer.addPass(outlinePass);

const params = {
  edgeStrength: 10,
  edgeGlow: 3,
  edgeThickness: 9,
};

outlinePass.edgeStrength = params.edgeStrength;
outlinePass.edgeGlow = params.edgeGlow;
outlinePass.edgeThickness = params.edgeThickness;
outlinePass.visibleEdgeColor.set("#dfa62a");
outlinePass.hiddenEdgeColor.set("#dfa62a");

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

  //if (statueV1 && statueV2 && isPolished == false) {
  if (statueV1 && statueV2 && statueV3 && statueV4) {
    statueV1.rotation.y = statueV1.rotation.y + rotateSpeed * 0.3;
    statueV2.rotation.y = statueV2.rotation.y + rotateSpeed * 0.3;
    statueV3.rotation.y = statueV3.rotation.y + rotateSpeed * 0.3;

    switch (steps) {
      case 1:
        console.log("heh1")

        if (-0.5 < outlinePass.edgeStrength && outlinePass.edgeStrength < 0.5) {
          if (statueV1.children.length > 0) {
            outlinePass.selectedObjects = [statueV1.children[Math.floor(Math.random() * statueV1.children.length)]];
          }
        }

        outlinePass.edgeStrength = Math.sin(elapsedTime * 2) * params.edgeStrength;
        break;
      case 2:
        console.log("heh2")
        if (-0.5 < outlinePass.edgeStrength && outlinePass.edgeStrength < 0.5) {
          if (statueV2.children.length > 0) {
            outlinePass.selectedObjects = [statueV2.children[Math.floor(Math.random() * statueV2.children.length)]];
          }
        }

        outlinePass.edgeStrength = Math.sin(elapsedTime * 2) * params.edgeStrength;
        break;
      case 3:
        if (-0.5 < outlinePass.edgeStrength && outlinePass.edgeStrength < 0.5) {
          if (statueV3.children.length > 0) {
            outlinePass.selectedObjects = [statueV3.children[Math.floor(Math.random() * statueV3.children.length)]];
          }
        }

        outlinePass.edgeStrength = Math.sin(elapsedTime * 2) * params.edgeStrength;
        break;

    }

  }



  if (socle) {
    socle.rotation.y = socle.rotation.y - rotateSpeed * 0.3;
  }

  touchBefore = currentTouch;

  // Render
  composer.render(scene, camera);

  //renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
