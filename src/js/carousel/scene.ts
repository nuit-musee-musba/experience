import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Experience, experiences, toObjectName } from "./experiences";
import { yRotationFromIndex } from "./rotation";

export const DEFAULT_CAMERA_POSITION = Object.freeze([0, 1.2, -4.5] as const);
export const DEFAULT_CAMERA_LOOK_AT = Object.freeze([0, 0, 0] as const);

export const makeScene = () => {
  // Create scene
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf8f4f4, 3, 5.3);

  // Target canvas
  const canvas = document.getElementById("webgl") as HTMLCanvasElement;

  // Create camera
  const camera = new THREE.PerspectiveCamera(
    10,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    2000
  );
  camera.position.set(...DEFAULT_CAMERA_POSITION);
  camera.lookAt(...DEFAULT_CAMERA_LOOK_AT);

  // Create Renderer
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas,
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const ambientLight = new THREE.AmbientLight(0x404040);
  ambientLight.intensity = 1;
  ambientLight.position.set(0, 2, 0);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0x404040, 30);
  mainLight.position.set(0, 0.2, 0);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const carouselGroup = new THREE.Group();
  carouselGroup.rotation.set(0, 0, 0);
  carouselGroup.position.set(0, 0, 0);

  const islandPromises: Array<Promise<void>> = [];
  const islands = [];
  // Create islands
  experiences.forEach((experience, index) => {
    const islandPromise = createIsland(index, experience)
      .then((island) => {
        carouselGroup.add(island);
        islands.push(island);
      })
      .catch((error) => {
        console.error("Error creating island:", error);
      });

    islandPromises.push(islandPromise);
  });

  const loaderElement = document.getElementById("loader") as HTMLDivElement;

  // Wait for all promises to resolve
  (async () => {
    try {
      await Promise.all(islandPromises);
    } catch (error) {
      console.error("Error creating worlds:", error);
    } finally {
      loaderElement.classList.add("hidden");
    }
  })();

  scene.add(carouselGroup);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const scrollPosition = event.deltaX % window.innerWidth;
    carouselGroup.rotation.y += (-scrollPosition * Math.PI) / window.innerWidth;
  });

  return {
    renderer,
    scene,
    canvas,
    camera,
    carouselGroup,
    lights: {
      ambientLight,
      mainLight,
    },
  };
};

const createIsland = async (index: number, experience: Experience) => {
  const yRotation = -yRotationFromIndex(index);
  const island = await createGLTFModel(experience, [0, yRotation, 0]);

  return island.scene;
};

const gltfLoader = new GLTFLoader();

const createGLTFModel = async (
  experience: Experience,
  rotation: [number, number, number]
) => {
  const gltf = await gltfLoader.loadAsync(experience.modelPath);
  const meshScale = 0.025;

  gltf.scene.scale.set(meshScale, meshScale, meshScale);
  gltf.scene.position.set(0, 0, 0);
  gltf.scene.rotation.set(...rotation);
  gltf.scene.name = toObjectName(experience); // set unique id for future redirection
  gltf.scene.userData.id = experience.id; // set unique id for future redirection
  gltf.scene.userData.islandName = experience.title;

  return gltf;
};
