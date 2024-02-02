// import { easing } from 'maath';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import * as THREE from "three";

// World creation
export async function createIsland(i, count) {
  // For a loaded GLTF model
  try {
    const island = await createGLTFModel(
      i,
      "/assets/hub/reserve.glb", // url
      [0, 0, 0], // position
      [0, (i * count + Math.PI * 5) / 2, 0], // rotation to set the plane upright
      [0.065, 0.065, 0.065] // scale
    );
    // Create and add text to the island scene
    const islandText = createTextGeometry(
      "Island " + (i + 1),
      [0, 1.5, (i * count + Math.PI * 5) / 2],
      0.02
    );
    island.scene.add(islandText);
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

// Function to create text geometry
function createTextGeometry(text, position, size) {
  const loader = new FontLoader();
  const fontUrl = "/assets/hub/font.json"; // Specify the path to your font file
  const font = loader.load(fontUrl);

  const textGeometry = new TextGeometry(text, {
    font: font,
    // size: size,
    // height: 0.2,
    size: 80,
    height: 5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 10,
    bevelSize: 8,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.set(...position);

  return textMesh;
}
