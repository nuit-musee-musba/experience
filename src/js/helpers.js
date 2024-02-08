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
      url = "/assets/hub/sculpture.glb";
    } else {
      url = "/assets/hub/vanite.glb";
    }
    const island = await createGLTFModel(
      i,
      url, // url
      [0, 0, 0], // position
      [0, i === 0 ? 0 : -(Math.PI * 2) / (count / i), 0], // rotation to set the plane upright
      [0.035, 0.035, 0.035], // scale
      color
    );
    // if (island.scene.userData.id === 1) {
    //   island.scene.scale.set(0.05, 0.05, 0.05);
    //   console.log("island id", island.scene);
    // }
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
        // gltf.scene.traverse((child) => {
        //   if (child.isMesh) {
        //     // Check if the material has a color property (for Lambert or Phong materials)
        //     if (child.material.color) {
        //       child.material.color.set(color);
        //     }
        //     // Check if the material has an emissive property (for Standard materials)
        //     if (child.material.emissive) {
        //       child.material.emissive.set(color);
        //     }
        //     // You may need to add more checks based on the material type used in your model
        //   }
        // });
        resolve(gltf);
      },
      undefined,
      reject
    );
  });
}

// Function to find the closest island to the fixed position
export function findClosestRotation(carousel, scrollDistance) {
  return rotation;
}

export function updateIslandInformation(
  index,
  data,
  frontTitle,
  infoDescription,
  infoButton
) {
  const infoTitle = document.getElementById("infoTitle");
  frontTitle.innerHTML = data[index].title;
  infoTitle.innerHTML = data[index].title;
  infoDescription.innerHTML = data[index].description;
  infoButton.href = data[index].path;
}

export function rotateCarousel(direction, rotate, carousel) {
  // TODO: remove evetListener for double click bug
  if (!rotate) {
    rotate = true;
    const rotationAmount = (Math.PI * 2) / 5;
    const targetRotation =
      direction === "left"
        ? carousel.rotation.y + rotationAmount
        : carousel.rotation.y - rotationAmount;
    const rotateToTarget = () => {
      if (rotate) {
        const deltaRotation = (targetRotation - carousel.rotation.y) * 0.47; // Adjust the smoothing factor as needed
        carousel.rotation.y += deltaRotation;
        const rotationDifference = Math.abs(
          targetRotation - carousel.rotation.y
        );
        if (rotationDifference > 0.0001) {
          requestAnimationFrame(rotateToTarget);
        } else {
          rotate = false;
        }
      }
    };
    rotateToTarget();
  }
}

function scaleModel(model, targetScale, duration) {
  console.log("Entered scale function");

  const initialScale = model.scale.x;
  const initialRotation = model.rotation.clone();
  const scaleIncrement = (targetScale - initialScale) / (duration / 10);
  const startTime = performance.now();

  function animateScale() {
    const currentTime = performance.now();
    const elapsedTime = currentTime - startTime;
    const newScale = initialScale + scaleIncrement * elapsedTime;

    model.rotation.set(initialRotation.x, initialRotation.y, initialRotation.z);
    model.scale.set(newScale, newScale, newScale);

    if (elapsedTime < duration) {
      requestAnimationFrame(animateScale);
    }
  }

  animateScale();
}
export function handleScaleClick(carousel, index) {
  console.log("Entered function");
  let model = null;
  for (let i = 0; i < carousel.children.length; i++) {
    if (carousel.children[i].userData.id === index + 1) {
      model = carousel.children[i];
    }
  }
  scaleModel(model, 0.0315, 100);
}
