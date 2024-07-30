import gsap from "gsap";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import { periods } from "./constants.js";
import { ObjectLoader } from "./objectLoader.js";


export const config = {
  envMapIntensity: 3,
  scalePixelRatioFactor: .7,
};

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const manager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(manager);
const dracoLoader = new DRACOLoader(manager);

manager.onLoad = () => {
  document.querySelector(".loader").classList.add("loader-hidden");
  document.querySelector(".loader-icon").classList.add("loader-hidden");
};

dracoLoader.setDecoderPath("/1-batiment/draco/");
dracoLoader.preload();
gltfLoader.setDRACOLoader(dracoLoader);

// LIGHTS
const ambientLight = new THREE.AmbientLight("#FFFFFF", 1);

const sunLight = new THREE.DirectionalLight("#F5F0E8");
scene.add(sunLight);

sunLight.position.set(63.9, 22.2, 100);
sunLight.shadow.camera.left = -26;
sunLight.shadow.camera.right = 45;
sunLight.shadow.camera.top = 13;
sunLight.shadow.camera.bottom = -3;
sunLight.intensity = 4.5;
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024 * 2 * 2 * 2;
sunLight.shadow.mapSize.height = 1024 * 2 * 2 * 2;
sunLight.shadow.radius = 4.2;
sunLight.shadow.blurSamples = 25;
sunLight.shadow.bias = -0.0002;

// ENVIRONMENT

const loader = new THREE.CubeTextureLoader(manager);
const texture = loader.load([
  "/1-batiment/assets/environments/px.png",
  "/1-batiment/assets/environments/nx.png",
  "/1-batiment/assets/environments/py.png",
  "/1-batiment/assets/environments/ny.png",
  "/1-batiment/assets/environments/pz.png",
  "/1-batiment/assets/environments/nz.png",
]);
scene.background = texture;
scene.environment = texture;

scene.backgroundBlurriness = 0.2;
scene.backgroundIntensity = 5;

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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) * config.scalePixelRatioFactor);
});

// CAMERA
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.2,
  300
);
camera.position.set(0, 0, 0);
scene.add(camera);

// CONTROLS CAMERA
const controls = new OrbitControls(camera, canvas);
controls.enablePan = false;
controls.enableZoom = false;
controls.maxPolarAngle = Math.PI * 0.33;
controls.minPolarAngle = Math.PI * 0.33;

// MODELS
const poi1 = [];
const poi2 = [];
const poi3 = [];
const poi4 = [];
const poi5 = [];


for (let i = 0; i < periods.length; i++) {
  for (let j = 0; j < periods[i].poiPosition.length; j++) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/1-batiment/assets/icons/poi.png");

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true, // Enable transparency
      alphaTest: 0.1, // Adjust the alpha test value if needed
    });
    const geometry = new THREE.PlaneGeometry(0.4, 0.4);
    const cube = new THREE.Mesh(geometry, material);

    cube.position.setY(-10);
    cube.name = `${i + j}`;

    if (i === 0) {
      poi1.push(cube);
    } else if (i === 1) {
      poi2.push(cube);
    } else if (i === 2) {
      poi3.push(cube);
    } else if (i === 3) {
      poi4.push(cube);
    }
    else if (i === 4) {
      poi5.push(cube);
    }

    cube.lookAt(camera.position);
  }
}

const allPOI = [poi1, poi2, poi3, poi4, poi5];

scene.add(...poi1, ...poi2, ...poi3, ...poi4, ...poi5);
gltfLoader.load("/1-batiment/assets/0/plane.glb", (gltf) => {
  scene.add(gltf.scene);
});

function updateCubeOrientation() {
  for (let i = 0; i < allPOI.length; i++) {
    for (let j = 0; j < allPOI[i].length; j++) {
      allPOI[i][j].lookAt(camera.position);
    }
  }
}

function animatePOI() {
  allPOI.forEach((poiArray) => {
    poiArray.forEach((poi) => {
      gsap.to(poi.scale, {
        duration: 0.9,
        x: 1.4,
        y: 1.4,
        z: 1.4,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      });
    });
  });
}

// Appelez la fonction animatePOI pour lancer l'animation
animatePOI();

controls.addEventListener("change", updateCubeOrientation);

const modelsPath = [
  "/1-batiment/assets/0/ANIM_Bordeaux-bat0.glb", // tout bordeaux
  "/1-batiment/assets/0/ANIM_mairie0.glb",

  "/1-batiment/assets/0/new_mairie.glb",

  "/1-batiment/assets/0/gallerie_beaux_arts.glb",
];

let animatedScenes = [];

const loadModels = async () => {
  for (let i = 0; i < modelsPath.length; i++) {
    const gltf = await gltfLoader.loadAsync(modelsPath[i]);

    scene.add(gltf.scene);
    const objectLoader = new ObjectLoader(gltf);

    animatedScenes.push(objectLoader);
  }
};

// gui.onFinishChange(() => {
//   sunLight.shadow.camera.updateProjectionMatrix();
//   sunLight.shadow.updateMatrices();
//   sunLightCameraHelper.update();
//   updateAllMaterials();
// });

//RENDERER

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  powerPreference: "high-performance",
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) * config.scalePixelRatioFactor);
renderer.setClearColor("#FFF6ED");
renderer.shadowMap.enabled = true;

export {
  allPOI, animatedScenes, camera,
  controls, loadModels, renderer, scene
};
