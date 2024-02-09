import { enableInactivityRedirection } from "@/global/js/inactivity.ts";
import { ambiantSound } from "@/global/js/sound";
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
import PolishingPart from "./component/5-PolishingPart/PolishingPart";
import OutroPart from "./component/6-OutroPart/OutroPart";

enableInactivityRedirection();
ambiantSound("/global/sounds/g3.mp3")
  .tryToPlayDirectly()
  .playOnFirstInteraction();

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
scene.fog = new THREE.FogExp2(0x000000, 0.1);

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


const light = new THREE.AmbientLight(0x404040);
light.intensity = 25;
scene.add(light);


gltfLoader.load("/3-sculpture/models/Mozart_scene.glb", (gltf) => {
  gltf.scene.position.set(-0.1, -0.8, -1.2);
  gltf.scene.rotation.y = Math.PI / 2;
  workshop = gltf.scene;

  for (let i = 0; i < workshop.children.length; i++) {
    if (workshop.children[i].name === "RSpot") {

      workshop.children[i].intensity = 113;

    } else if (workshop.children[i].name === "LSpot") {

      workshop.children[i].intensity = 0;

    } else if (workshop.children[i].name === "Area002_1") {

      workshop.children[i].intensity = 1000;
      workshop.children[i].angle = 0.281;

    } else if (workshop.children[i].name === "Spot") {

      workshop.children[i].intensity = 250;
      workshop.children[i].distance = 6;
      workshop.children[i].angle = 0.821;
      workshop.children[i].penumbra = 1;
      workshop.children[i].decay = 2;

      workshop.children[i].position.set(2, 0.5, -2.5);


    } else if (workshop.children[i].name === "Socle") {
      socle = workshop.children[i];
    } else if (workshop.children[i].name === "Point") {

      workshop.children[i].intensity = 15;
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

gltfLoader.load("/3-sculpture/models/Mozart_bloc.glb", (gltf) => {
  gltf.scene.scale.set(statueScale.x, statueScale.y, statueScale.z);
  gltf.scene.position.set(statuePosition.x, statuePosition.y, statuePosition.z);
  gltf.scene.rotation.y = statueRotation;
  statueV1 = gltf.scene;

  scene.add(statueV1);
});

gltfLoader.load("/3-sculpture/models/Mozart_degrossi.glb", (gltf) => {
  gltf.scene.scale.set(statueScale.x, statueScale.y, statueScale.z);
  gltf.scene.position.set(statuePosition.x, statuePosition.y, statuePosition.z);
  gltf.scene.rotation.y = statueRotation;
  statueV2 = gltf.scene;

  scene.add(statueV2);
});

gltfLoader.load("/3-sculpture/models/Mozart_sculpt.glb", (gltf) => {
  gltf.scene.scale.set(statueScale.x, statueScale.y, statueScale.z);
  gltf.scene.position.set(statuePosition.x, statuePosition.y, statuePosition.z);
  gltf.scene.rotation.y = statueRotation;
  statueV3 = gltf.scene;

  scene.add(statueV3);
});

gltfLoader.load("/3-sculpture/models/Mozart_polissage.glb", async (gltf) => {
  statueV5 = gltf.scene.children[0];
  statueV5.scale.set(statueScale.x, statueScale.y, statueScale.z);
  statueV5.position.set(statuePosition.x, statuePosition.y, statuePosition.z);
  statueV5.rotation.y = statueRotation;

  const loader = new THREE.TextureLoader();
  loader.load("/3-sculpture/textures/Mozart_affinage_texture.png", (texture) => {
    statueV4 = statueV5.clone();
    statueV4.geometry = statueV5.geometry.clone();
    statueV4.scale.multiplyScalar(1.002);
    statueV4.position.z += 0.01;

    statueV4.material = statueV5.material.clone();
    statueV4.material.map = texture;
    statueV4.material.opacity = 1;
    statueV4.material.transparent = true;



    const polishRange = document.getElementById("PolishRange");
    polishRange.addEventListener("input", (event) => {
      quantity = 1 - parseFloat(event.target.value);
      statueV4.material.opacity = quantity;
      stepsFunction();
    });
  });
});



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
window.addEventListener("touchstart", (event) => {
  currentTouch = event.touches[0].clientX / 100;
  touchBefore = currentTouch;
});

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

let isNextText1 = false;
let isNextText2 = false;
let isNextText3 = false;

function stepsFunction() {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  switch (steps) {
    case 1:
      if (statueV1) {
        const intersects = raycaster.intersectObject(statueV1);
        const nextText = document.getElementById("nextText");

        nextText.addEventListener('click', function () {
          changeTextInSteps(steps1InRoughPart, steps2InRoughPart);
          setTimeout(() => {
            isNextText1 = true;
          }, 10000);
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
        nextText2.addEventListener("click", function () {
          changeTextInSteps(steps1InDetailsPart, steps2InDetailsPart);
          setTimeout(() => {
            isNextText2 = true;
          }, 10000);

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
            scene.add(statueV4)
            scene.add(statueV5)
          }
        }
      }
      break;
    case 3:
      if (statueV3) {
        const intersects = raycaster.intersectObject(statueV3);
        const nextText3 = document.getElementById("nextText3");
        const nextText4 = document.getElementById("nextText4");

        nextText3.addEventListener("click", function () {
          steps1InRefiningPart.classList.remove("show");
          steps2InRefiningPart.classList.add("show");

        });

        nextText4.addEventListener("click", function () {
          changeTextInSteps(steps2InRefiningPart, steps3InRefiningPart);
          setTimeout(() => {
            isNextText3 = true;
          }, 10000);

        });

        if (statueV3.children.length <= 6) {
          changeTextInSteps(steps3InRefiningPart, steps4InRefiningPart);
        }
        if (statueV3.children.length <= 4) {
          changeTextInSteps(steps4InRefiningPart, steps5InRefiningPart);
        }

        if (intersects.length > 0 && raycasterActive) {
          const clickedBlock = intersects[0].object;
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
    case 4:
      if (statueV4) {
        const intersects = raycaster.intersectObject(statueV4);
        const nextText5 = document.getElementById("nextText5");
        const nextText6 = document.getElementById("nextText6");
        const nextText7 = document.getElementById("nextText7");
        const polishText = document.getElementById("polishText");



        nextText5.addEventListener("click", function () {
          changeTextInSteps(steps1InPolishingPart, steps2InPolishingPart);
        });

        nextText6.addEventListener("click", function () {
          changeTextInSteps(steps2InPolishingPart, steps3InPolishingPart);
          polishText.innerHTML = "Maintenant, c’est à votre tour d’utiliser le polissoir pour rendre la surface lisse et brillante. Servez-vous de la jauge pour lui donner tout son éclat"
        });

        if (quantity <= 0.5) {
          polishText.innerHTML = "Nous-y sommes presque, mais ce n’est pas encore assez poli..."
        }
        if (quantity <= 0) {
          changeTextInSteps(steps3InPolishingPart, steps4InPolishingPart);
        }

        nextText7.addEventListener("click", function () {
          OutroPart();
        });

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
  powerPreference: "low-power",
  physicallyCorrectLights: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));




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
  if (statueV1 && statueV2 && statueV3 && statueV4 && statueV5) {
    statueV1.rotation.y = statueV1.rotation.y + rotateSpeed * 0.3;
    statueV2.rotation.y = statueV2.rotation.y + rotateSpeed * 0.3;
    statueV3.rotation.y = statueV3.rotation.y + rotateSpeed * 0.3;
    statueV4.rotation.y = statueV4.rotation.y + rotateSpeed * 0.3;
    statueV5.rotation.y = statueV5.rotation.y + rotateSpeed * 0.3;

    switch (steps) {
      case 1:


        if (-0.5 < outlinePass.edgeStrength && outlinePass.edgeStrength < 0.5 && isNextText1) {
          if (statueV1.children.length > 0) {
            outlinePass.selectedObjects = [statueV1.children[Math.floor(Math.random() * statueV1.children.length)]];
          }
        }

        outlinePass.edgeStrength = Math.sin(elapsedTime) * params.edgeStrength;
        break;
      case 2:
        if (-0.5 < outlinePass.edgeStrength && outlinePass.edgeStrength < 0.5 && isNextText2) {
          if (statueV2.children.length > 0) {
            outlinePass.selectedObjects = [statueV2.children[Math.floor(Math.random() * statueV2.children.length)]];
          }
        }

        outlinePass.edgeStrength = Math.sin(elapsedTime) * params.edgeStrength;
        break;
      case 3:
        if (-0.5 < outlinePass.edgeStrength && outlinePass.edgeStrength < 0.5 && isNextText3) {
          if (statueV3.children.length > 0) {
            outlinePass.selectedObjects = [statueV3.children[Math.floor(Math.random() * statueV3.children.length)]];
          }
        }

        outlinePass.edgeStrength = Math.sin(elapsedTime) * params.edgeStrength;
        break;
    }
  }


  if (socle) {
    socle.rotation.y = socle.rotation.y - rotateSpeed * 0.3;
  }

  touchBefore = currentTouch;

  // Render


  renderer.render(scene, camera);
  composer.render(scene, camera);


  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
