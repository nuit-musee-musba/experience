// import { easing } from 'maath';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import * as THREE from "three";

// World creation
export async function createIsland(i, count, color) {
  try {
    let url;
    // For a loaded GLTF model
    if (i % 2 !== 0) {
      url = "/assets/hub/bat.glb";
    } else {
      url = "/assets/hub/reserve.glb";
    }
    const island = await createGLTFModel(
      i,
      url, // url
      [0, 0, 0], // position
      [0, i === 0 ? 0 : (Math.PI * 2) / (count / i), 0], // rotation to set the plane upright
      [0.03, 0.03, 0.03], // scale
      color
    );
    // set unique id
    // console.log("island scene", island.scene);
    return island.scene;
  } catch (error) {
    console.error("Error creating island:", error);
  }
}

function createGLTFModel(i, url, position, rotation, scale, color) {
  // Instantiate a loader
  const gltfLoader = new GLTFLoader();
  //   console.info("LOADIG 3D OBJECT ");
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
        // Traverse through the scene to update materials
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            // Check if the material has a color property (for Lambert or Phong materials)
            if (child.material.color) {
              child.material.color.set(color);
            }
            // Check if the material has an emissive property (for Standard materials)
            if (child.material.emissive) {
              child.material.emissive.set(color);
            }
            // You may need to add more checks based on the material type used in your model
          }
        });
        resolve(gltf);
      },
      undefined,
      reject
    );
  });
}

// Function to find the closest island to the fixed position
export function findClosestIsland(carousel, fixedPosition) {
  let closestDistance = Infinity;
  let closestIsland;

  carousel.children.forEach((island) => {
    const distance = island.position.distanceTo(fixedPosition);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIsland = island;
    }
  });

  return closestIsland;
}
