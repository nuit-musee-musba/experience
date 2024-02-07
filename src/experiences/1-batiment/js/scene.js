import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import GUI from "lil-gui";
import { ObjectLoader } from "/experiences/1-batiment/js/objectLoader";

const gui = new GUI();

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

const directionalLight1 = new THREE.DirectionalLight("#F5F0E8", 1.5);
gui.add(directionalLight1, "intensity").min(0).max(10).step(0.001).name("Sun");
directionalLight1.position.set(1, 3, 4);
directionalLight1.lookAt(4, 2, 4);

const directionalLight2 = new THREE.DirectionalLight("#F5F0E8", 1);
gui.add(directionalLight2, "intensity").min(0).max(10).step(0.001).name("Sun");
directionalLight2.position.set(-1, 3, -4);
directionalLight2.lookAt(4, 2, 4);

scene.add(ambientLight, directionalLight1, directionalLight2);

// MODELS
const geometry = new THREE.SphereGeometry(0.2, 32, 16);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

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

await loadModels();

console.log(animatedScenes);
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

//RENDERER

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#FFF6ED");

export { renderer, camera, controls, scene, animatedScenes, cube };
