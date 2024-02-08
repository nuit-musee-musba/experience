import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import GUI from "lil-gui";
import { ObjectLoader } from "/experiences/1-batiment/js/objectLoader";
import { updateAllMaterials } from "./utils";
import { period } from "/experiences/1-batiment/js/period";

const gui = new GUI();

export const config = {
  envMapIntensity: 3,
};

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath("/1-batiment/draco/");
dracoLoader.preload();
gltfLoader.setDRACOLoader(dracoLoader);

// LIGHTS
const ambientLight = new THREE.AmbientLight("#FFFFFF", 1);
gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Ambient Light");

const sunLight = new THREE.DirectionalLight("#F5F0E8");
gui.add(sunLight, "intensity").min(0).max(10).step(0.001).name("Sun");

sunLight.position.set(63.9, 22.2, 100);
sunLight.shadow.camera.left = -26;
sunLight.shadow.camera.right = 45;
sunLight.shadow.camera.top = 13;
sunLight.shadow.camera.bottom = -3;
sunLight.intensity = 5.5;
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024 * 2 * 2 * 2;
sunLight.shadow.mapSize.height = 1024 * 2 * 2 * 2;
sunLight.shadow.radius = 4.2;
sunLight.shadow.blurSamples = 25;
sunLight.shadow.bias = -0.0002;

// GUI for Light Controls
const lightControls = gui.addFolder("Light Controls");

lightControls
  .add(sunLight.position, "x")
  .min(-100)
  .max(100)
  .step(0.1)
  .name("Light X");
lightControls
  .add(sunLight.position, "y")
  .min(-100)
  .max(100)
  .step(0.1)
  .name("Light Y");
lightControls
  .add(sunLight.position, "z")
  .min(-100)
  .max(100)
  .step(0.1)
  .name("Light Z");

lightControls
  .add(sunLight.rotation, "x")
  .min(-Math.PI)
  .max(Math.PI)
  .step(0.01)
  .name("Light Rotation X");
lightControls
  .add(sunLight.rotation, "y")
  .min(-Math.PI)
  .max(Math.PI)
  .step(0.01)
  .name("Light Rotation Y");
lightControls
  .add(sunLight.rotation, "z")
  .min(-Math.PI)
  .max(Math.PI)
  .step(0.01)
  .name("Light Rotation Z");

lightControls.add(sunLight, "castShadow").name("Cast Shadow");

lightControls
  .add(sunLight.shadow.camera, "left")
  .min(-100)
  .max(100)
  .name("Shadow Camera Left");
lightControls
  .add(sunLight.shadow.camera, "right")
  .min(-100)
  .max(100)
  .name("Shadow Camera Right");

lightControls
  .add(sunLight.shadow.camera, "top")
  .min(-100)
  .max(100)
  .name("Shadow Camera Top");

lightControls
  .add(sunLight.shadow.camera, "bottom")
  .min(-100)
  .max(100)
  .name("Shadow Camera Bottom");

lightControls
  .add(sunLight.shadow.camera, "near")
  .min(-100)
  .max(100)
  .name("Shadow Camera Near");

lightControls
  .add(sunLight.shadow.camera, "far")
  .min(-100)
  .max(100)
  .name("Shadow Camera Far");

lightControls
  .add(sunLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("Light Intensity");

lightControls
  .add(sunLight.shadow, "radius")
  .min(0)
  .max(10)
  .step(0.001)
  .name("Shadow Radius");

lightControls
  .add(sunLight.shadow, "blurSamples")
  .min(0)
  .max(100)
  .step(1)
  .name("Shadow Blur Samples");

lightControls
  .add(sunLight.shadow, "bias")
  .min(-0.01)
  .max(0.01)
  .step(0.0001)
  .name("Shadow Bias");

lightControls.open();

scene.add(sunLight);

const sunLightHelper = new THREE.DirectionalLightHelper(sunLight);
const sunLightCameraHelper = new THREE.CameraHelper(sunLight.shadow.camera);

gui.onFinishChange(() => {
  sunLight.shadow.camera.updateProjectionMatrix();
  sunLight.shadow.updateMatrices();
  sunLightCameraHelper.update();
  updateAllMaterials();
});

scene.add(sunLightHelper);
scene.add(sunLightCameraHelper);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// ENVIRONMENT

const loader = new THREE.CubeTextureLoader();
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

gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001);
gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.001);
gui
  .add(config, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials);

// MODELS
const poi1 = [];
const poi2 = [];
const poi3 = [];
const poi4 = [];

for (let i = 0; i < period.length; i++) {
  for (let j = 0; j < period[i].poiPosition.length; j++) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/1-batiment/assets/icons/poi.png");
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.SphereGeometry(0.2, 32, 16);
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
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
  }
}

const allPOI = [poi1, poi2, poi3, poi4];

scene.add(...poi1, ...poi2, ...poi3, ...poi4);
gltfLoader.load("/1-batiment/assets/0/plane.glb", (gltf) => {
  scene.add(gltf.scene);
});

const modelsPath = [
  "/1-batiment/assets/0/ANIM_Bordeaux-bat0.glb", // tout bordeaux
  "/1-batiment/assets/0/ANIM_mairie0.glb", //mairie, mettre animation flamme après
  "/1-batiment/assets/0/ANIM_musba0.glb",
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
scene.add(camera);

// CONTROLS CAMERA
const controls = new OrbitControls(camera, canvas);
controls.enablePan = false;
controls.maxPolarAngle = Math.PI * 0.33;
controls.minPolarAngle = Math.PI * 0.33;
//RENDERER

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#FFF6ED");
renderer.shadowMap.enabled = true;

export {
  renderer,
  camera,
  controls,
  scene,
  animatedScenes,
  loadModels,
  allPOI,
};
