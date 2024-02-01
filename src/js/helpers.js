import * as THREE from "three";
// import { easing } from 'maath';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// World creation
export async function createIsland(i, count) {
  // For a loaded GLTF model
  try {
    const island = await createGLTFModel(
      "../assets/painting.glb", // url
      [0, 0, 0], // position
      [0, (i * count + Math.PI * 5) / 2, 0], // rotation to set the plane upright
      [0.07, 0.07, 0.07] // scale
    );
    return island.scene;
  } catch (error) {
    console.error("Error creating island:", error);
  }
}

function createGLTFModel(url, position, rotation, scale) {
  // Instantiate a loader
  const gltfLoader = new GLTFLoader();
  console.log("LOADIG 3D OBJECT ");
  // Use a promise to handle the asynchronous loading
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      url,
      (gltf) => {
        gltf.scene.scale.set(...scale);
        gltf.scene.position.set(...position);
        gltf.scene.rotation.set(...rotation);
        // If you need to perform additional actions after loading, resolve the promise
        resolve(gltf);
      },
      undefined,
      reject
    );
  });
}

// Usage example
