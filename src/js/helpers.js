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
      [0.05, 0.05, 0.05], // scale
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
export function findClosestRotation(carousel, scrollDistance) {
  return rotation;
}

// Mouse Click event
var onMouseClick = (event) => {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1; // -1 to 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; // -1 to 1

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Loop through the intersections
  for (const intersect of intersects) {
    // Check if the intersected object is a mesh
    if (intersect.object.type === "Mesh") {
      try {
        // Get the URL from the intersected mesh parent's userData
        const url = data.find(
          (route) => route.id === intersect.object.parent.userData.id
        ).path;
        console.log("intersect", intersect.object.parent.userData);
        console.log("url", url);
        // Click event > Redirect to the specified URL
        // window.location.href = url;
      } catch (error) {
        console.error("Error in redirection", error);
      }
    }
  }
};

// Function to dynamically update the rotationPositions array
export function closestRotationValue(currentRotation, rotationPositions) {
  // Calculate the closest rotation value
  const closestRotation = rotationPositions.reduce((prev, curr) =>
    Math.abs(curr - currentRotation) < Math.abs(prev - currentRotation)
      ? curr
      : prev
  );
  // Update the rotationPositions array
  return closestRotation;
}

export function updateIslandInformation(
  index,
  data,
  infoTitle,
  infoDescription,
  infoButton
) {
  infoTitle.innerHTML = data[index].title;
  infoDescription.innerHTML = data[index].description;

  infoButton.addEventListener("click", function () {
    const url = data[index].path;
    window.location.href = url;
  });
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
        const deltaRotation = (targetRotation - carousel.rotation.y) * 0.27; // Adjust the smoothing factor as needed
        carousel.rotation.y += deltaRotation;
        const rotationDifference = Math.abs(
          targetRotation - carousel.rotation.y
        );
        if (rotationDifference > 0.00001) {
          requestAnimationFrame(rotateToTarget);
        } else {
          rotate = false;
        }
      }
    };
    rotateToTarget();
  }
}
