// Get references to your elements
import gsap from "gsap";
// DOM elements
const showButton = document.getElementById("showButton");
const backButton = document.getElementById("backButton");
const firstSceneElements = document.querySelectorAll(".first-scene");
const secondSceneElements = document.querySelectorAll(".second-scene");
const canvas = document.getElementById("webgl");
// Constants
const PARTS = 5;
const CIRCLE = Math.PI * 2;
const MESHSCALE = window.experience.meshScale;
const TARGETSCALE = 0.035;
const POSITIONY = 0;
const FACTOR = 0.1; //Rotation factor
const SCALEFACTOR = 0.0002; // Scale
const POSITIONFACTOR = 0.015;
const TARGETYPOSITION = 0.1;

// window.experience object
window.experience = window.experience || {};
const index = window.experience.index;
let positionYComplete = false;
let positionXComplete = false;
let scaleComplete = false;
let rotationComplete = false;
let otherPositionYComplete = false;

showButton.addEventListener("click", () => {
  if (!window.experience.isRotating) {
    // Stop aurto rotation when the user clicks the button
    window.experience.autoRotate = false;
    window.experience.canRotate = false;
    window.experience.clickedOnExperience = false;
    canvas.classList.add("activated");

    // set current rotation
    let currentRotation = window.experience.rotation;
    let targetRotation = window.experience.index * (CIRCLE / PARTS);
    // Adjust the target rotation based on the real current rotation
    if (currentRotation < -(CIRCLE / PARTS / 2)) {
      targetRotation = targetRotation - CIRCLE;
    } else if (Math.abs(currentRotation) > CIRCLE - CIRCLE / PARTS / 2) {
      targetRotation = targetRotation + CIRCLE;
    }
    window.experience.animate = function animate() {
      // This is a positive number always based on the current index

      // Check if animation is complete
      window.experience.rotation +=
        (targetRotation - window.experience.rotation) *
        FACTOR *
        Math.cos(FACTOR);

      rotationComplete =
        Math.abs(targetRotation - window.experience.rotation) < 0.001;

      window.experience.currentIsland.position.y += POSITIONFACTOR; // as the camera is at negative z

      if (window.experience.currentIsland.position.y >= TARGETYPOSITION) {
        window.experience.currentIsland.position.y = TARGETYPOSITION;
        positionYComplete = true;
      } else {
        positionYComplete =
          Math.abs(
            TARGETYPOSITION - window.experience.currentIsland.position.y
          ) < 0.001;
      }

      // // Set the current scale

      let currentScale = window.experience.currentIsland.scale.x;
      let newScale = currentScale + SCALEFACTOR;

      window.experience.currentIsland.scale.set(newScale, newScale, newScale);
      if (newScale > TARGETSCALE) {
        window.experience.currentIsland.scale.x = TARGETSCALE;
        scaleComplete = true;
      } else {
        scaleComplete =
          Math.abs(TARGETSCALE - window.experience.currentIsland.scale.x) <
          0.001;
      }

      // // Move other islands to the back
      window.experience.otherIslands.forEach((island) => {
        island.position.y -= POSITIONFACTOR;
        // Stop the animation if the position is reached
        if (island.position.y <= POSITIONY) {
          island.position.y = island.position.y;
          otherPositionYComplete = true;
        } else {
          otherPositionYComplete =
            Math.abs(island.position.y - POSITIONY) < 0.001;
        }
      });

      if (
        !rotationComplete ||
        !scaleComplete ||
        !positionYComplete ||
        !otherPositionYComplete
      ) {
        window.experience.isRotating = true;
        requestAnimationFrame(animate); // Continue the animation if not finished
      } else {
        window.experience.isRotating = false;
        window.experience.canRotate = false;
      }
    }

    window.experience.animate();

    // Loop through all elements with the class 'first-scene' and set display to 'none'
    firstSceneElements.forEach((element) => {
      element.classList.add("transition-opacity");
      element.style.opacity = "0";
    });
    firstSceneElements.forEach((element) => {
      element.style.display = "none";
    });

    secondSceneElements.forEach((element) => {
      element.classList.add("transition-opacity");
      element.style.display = "flex";
      element.style.opacity = "0";
    });

    setTimeout(() => {
      secondSceneElements.forEach((element) => {
        element.classList.add("transition-opacity");
        element.style.opacity = "1";
      });
    }, 300);

    firstSceneElements.forEach((element) => {
      element.classList.remove("transition-opacity");
    });
    secondSceneElements.forEach((element) => {
      element.classList.remove("transition-opacity");
    });
  }
});

backButton.addEventListener("click", async () => {
  const executeAnimation = async () => {
    await new Promise((resolve) => {
      gsap.to(window.experience.camera.position, {
        duration: 0.5,
        x: 0,
        y: 1.2,
        z: -4.2,
        onComplete: resolve,
      });
    });
  };

  await executeAnimation();
  window.experience.onZoom = false;

  const targetScale = MESHSCALE;
  canvas.classList.remove("activated");
  canvas.classList.add("deactivated");


  function descale() {
    let newScale = window.experience.currentIsland.scale.x - SCALEFACTOR;
    window.experience.currentIsland.scale.set(newScale, newScale, newScale);
    if (newScale <= targetScale) {
      window.experience.currentIsland.scale.set(
        targetScale,
        targetScale,
        targetScale
      );
    }
    const scaleComplete =
      Math.abs(targetScale - window.experience.currentIsland.scale.x) < 0.001;

    window.experience.currentIsland.position.y -= POSITIONFACTOR; // as the camera is at negative z
    if (window.experience.currentIsland.position.y <= 0) {
      window.experience.currentIsland.position.y = 0;
      positionYComplete = true;
    } else {
      positionYComplete =
        Math.abs(
          window.experience.currentIsland.position.y - TARGETYPOSITION
        ) < 0.001;
    }
    window.experience.otherIslands.forEach((island, i) => {
      island.position.y += POSITIONFACTOR;
      if (island.position.y >= 0) {
        island.position.y = 0;
      }
    });
    const positionComplete = window.experience.otherIslands.every(
      (island) => Math.abs(island.position.y - POSITIONY) < 0.001
    );
    if (!scaleComplete || !positionComplete || !positionYComplete) {
      requestAnimationFrame(descale);
    } else {
      window.experience.canRotate = true;
      window.experience.autoRotate = true;
    }
  }

  descale();


  secondSceneElements.forEach((element) => {
    element.classList.add("transition-opacity");
    element.style.opacity = "0";
  });

  setTimeout(() => {
    secondSceneElements.forEach((element) => {
      element.style.display = "none";
    });

    firstSceneElements.forEach((element) => {
      element.style.display = "flex";
      element.style.opacity = "0";
    });

    setTimeout(() => {
      firstSceneElements.forEach((element) => {
        element.classList.add("transition-opacity");
        element.style.opacity = "1";
      });
    }, 500);

    secondSceneElements.forEach((element) => {
      element.classList.remove("transition-opacity");
    });
    firstSceneElements.forEach((element) => {
      element.classList.remove("transition-opacity");
    });
  }, 300);
});


const tik = () => {
  requestAnimationFrame(tik);
  if (window.experience.isRotating) {
    showButton.style.opacity = "0";
  } else {
    showButton.style.opacity = "1";
  }
  if (window.experience.clickedOnExperience) {
    window.experience.onZoom = true;
    if (!window.experience.isRotating) {
      // Stop aurto rotation when the user clicks the button
      window.experience.autoRotate = false;
      window.experience.canRotate = false;

      canvas.classList.add("activated");

      // set current rotation
      let currentRotation = window.experience.rotation;


      let targetRotation = window.experience.clickedIndex * (CIRCLE / PARTS);
      // Adjust the target rotation based on the real current rotation
      if (currentRotation < -(CIRCLE / PARTS / 2)) {
        targetRotation = targetRotation - CIRCLE;
      } else if (Math.abs(currentRotation) > CIRCLE - CIRCLE / PARTS / 2) {
        targetRotation = targetRotation + CIRCLE;
      }
      window.experience.animate = function animate() {
        // This is a positive number always based on the current index

        // Check if animation is complete
        window.experience.rotation +=
          (targetRotation - window.experience.rotation) *
          FACTOR *
          Math.cos(FACTOR);

        rotationComplete =
          Math.abs(targetRotation - window.experience.rotation) < 0.001;

        window.experience.currentIsland.position.y += POSITIONFACTOR; // as the camera is at negative z

        if (window.experience.currentIsland.position.y >= TARGETYPOSITION) {
          window.experience.currentIsland.position.y = TARGETYPOSITION;
          positionYComplete = true;
        } else {
          positionYComplete =
            Math.abs(
              TARGETYPOSITION - window.experience.currentIsland.position.y
            ) < 0.001;
        }

        // // Set the current scale

        let currentScale = window.experience.currentIsland.scale.x;
        let newScale = currentScale + SCALEFACTOR;

        window.experience.currentIsland.scale.set(newScale, newScale, newScale);
        if (newScale > TARGETSCALE) {
          window.experience.currentIsland.scale.x = TARGETSCALE;
          scaleComplete = true;
        } else {
          scaleComplete =
            Math.abs(TARGETSCALE - window.experience.currentIsland.scale.x) <
            0.001;
        }

        // // Move other islands to the back
        window.experience.otherIslands.forEach((island) => {
          island.position.y -= POSITIONFACTOR;
          // Stop the animation if the position is reached
          if (island.position.y <= POSITIONY) {
            island.position.y = island.position.y;
            otherPositionYComplete = true;
          } else {
            otherPositionYComplete =
              Math.abs(island.position.y - POSITIONY) < 0.001;
          }
        });

        if (
          !rotationComplete ||
          !scaleComplete ||
          !positionYComplete ||
          !otherPositionYComplete
        ) {
          window.experience.isRotating = true;
          requestAnimationFrame(animate); // Continue the animation if not finished
        } else {
          window.experience.isRotating = false;
          window.experience.canRotate = false;
        }
      }

      window.experience.animate();

      // Loop through all elements with the class 'first-scene' and set display to 'none'
      firstSceneElements.forEach((element) => {
        element.classList.add("transition-opacity");
        element.style.opacity = "0";
      });
      firstSceneElements.forEach((element) => {
        element.style.display = "none";
      });

      secondSceneElements.forEach((element) => {
        element.classList.add("transition-opacity");
        element.style.display = "flex";
        element.style.opacity = "0";
      });

      setTimeout(() => {
        secondSceneElements.forEach((element) => {
          element.classList.add("transition-opacity");
          element.style.opacity = "1";
        });
      }, 300);

      firstSceneElements.forEach((element) => {
        element.classList.remove("transition-opacity");
      });
      secondSceneElements.forEach((element) => {
        element.classList.remove("transition-opacity");
      });
    }
    // Reset the clickedOnExperience flag
    window.experience.clickedOnExperience = false;
  }
};

tik();
