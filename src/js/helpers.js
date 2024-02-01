// import { easing } from 'maath';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// World creation
export async function createIsland(i, count) {
  // For a loaded GLTF model
  try {
    const island = await createGLTFModel(
      i,
      "/assets/hub/painting.glb", // url
      [0, 0, 0], // position
      [0, (i * count + Math.PI * 5) / 2, 0], // rotation to set the plane upright
      [0.065, 0.065, 0.065] // scale
    );
    // set unique id
    console.log("island scene", island.scene);
    return island.scene;
  } catch (error) {
    console.error("Error creating island:", error);
  }
}

function createGLTFModel(i, url, position, rotation, scale) {
  // Instantiate a loader
  const gltfLoader = new GLTFLoader();
  console.info("LOADIG 3D OBJECT ");
  // Use a promise to handle the asynchronous loading
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      url,
      (gltf) => {
        gltf.scene.scale.set(...scale);
        gltf.scene.position.set(...position);
        gltf.scene.rotation.set(...rotation);
        gltf.scene.userData.id = i + 1; // set unique id for future redirection
        // If you need to perform additional actions after loading, resolve the promise
        resolve(gltf);
      },
      undefined,
      reject
    );
  });
}

// Usage example
