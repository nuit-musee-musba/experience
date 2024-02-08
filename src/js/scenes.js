// Get references to your elements

const showButton = document.getElementById("showButton");
const backButton = document.getElementById("backButton");
const firstSceneElements = document.querySelectorAll(".first-scene");
const secondSceneElements = document.querySelectorAll(".second-scene");
const parts = 5;
const circle = Math.PI * 2;
window.experience = window.experience || {};
const index = window.experience.index;
const meshScale = 0.03;
const biggerScale = 0.035;
const positionY = 0.1;

showButton.addEventListener("click", () => {
  if (!window.experience.isRotating) {
    window.experience.autoRotate = false;
    // Smoothly interpolate the rotation over time
    let currentRotation = window.experience.rotation;

    // This is a positive number always
    let targetRotation = window.experience.index * (circle / parts);

    if (currentRotation < -(circle / parts / 2)) {
      targetRotation = targetRotation - circle;
    }

    window.experience.rotation = targetRotation;

    // Scale

    // Define the target scale for the island
    const targetScale = biggerScale; // Adjust as needed

    const initialScale = window.experience.currentIsland.scale.x; // Adjust as needed

    // Position

    // Calculate the target rotation based on the current'index'
    const duration = 1000; // Adjust duration as needed
    const startTime = Date.now();

    function animate() {
      // Rotation interpolation
      const now = Date.now();
      const elapsedTime = now - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Ensure progress is between 0 and 1
      // Interpolate the rotation smoothly
      const interpolatedRotation =
        currentRotation + (targetRotation - currentRotation) * progress;
      // Apply the interpolated rotation to your Three.js object
      window.experience.rotation = interpolatedRotation;

      // Interpolate the scale smoothly
      const interpolatedScale =
        initialScale + (targetScale - initialScale) * progress;
      window.experience.currentIsland.scale.set(
        interpolatedScale,
        interpolatedScale,
        interpolatedScale
      );

      // Move other islands to the back
      window.experience.otherIslands.forEach((island) => {
        const currenPosition = island.position.y;
        const targetPosition = positionY - 1; // initial position = 0
        const interpolatedPosition =
          currenPosition + (targetPosition - currenPosition) * progress * 0.1;
        island.position.y = interpolatedPosition;
      });
      if (progress < 1) {
        window.experience.isRotating = true;

        requestAnimationFrame(animate); // Continue the animation if not finished
      } else {
        window.experience.isRotating = false;
        window.experience.canRotate = false;
      }
    }

    animate();

    // Loop through all elements with the class 'first-scene' and set display to 'none'
    firstSceneElements.forEach((element) => {
      element.classList.add("transition-opacity");
      element.style.opacity = "0";
    });

    setTimeout(() => {
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
      }, 800);

      firstSceneElements.forEach((element) => {
        element.classList.remove("transition-opacity");
      });
      secondSceneElements.forEach((element) => {
        element.classList.remove("transition-opacity");
      });
    }, 800);
  }
});

backButton.addEventListener("click", () => {
  // Define the target scale for the elements
  const targetScale = meshScale; // Adjust as needed

  // Calculate the initial scale of the elements
  const initialScale = window.experience.currentIsland.scale.x; // Adjust as needed

  // Calculate the target rotation based on the current 'index'
  const duration = 1500; // Adjust duration as needed
  const startTime = Date.now();

  function descaleElements() {
    function animate() {
      // Scale interpolation
      const now = Date.now();
      const elapsedTime = now - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Ensure progress is between 0 and 1
      // Interpolate the scale smoothly
      let interpolatedScale =
        initialScale - (initialScale - targetScale) * progress * 2;
      if (interpolatedScale <= targetScale) {
        interpolatedScale = targetScale;
      }

      window.experience.currentIsland.scale.set(
        interpolatedScale,
        interpolatedScale,
        interpolatedScale
      );

      // Move other islands to the back
      window.experience.otherIslands.forEach((island) => {
        const currentPosition = island.position.y;
        const targetPosition = 0; // initial position
        const interpolatedPosition =
          currentPosition - (currentPosition - targetPosition) * progress * 0.2;
        island.position.y = interpolatedPosition;
      });
      if (progress < 1) {
        requestAnimationFrame(animate); // Continue the animation if not finished
      } else {
        window.experience.canRotate = true;
        window.experience.autoRotate = true;
      }
    }

    animate();
  }

  descaleElements();
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
};

tik();
