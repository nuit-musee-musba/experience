// Get references to your elements

const showButton = document.getElementById("showButton");
const backButton = document.getElementById("backButton");
const firstSceneElements = document.querySelectorAll(".first-scene");
const secondSceneElements = document.querySelectorAll(".second-scene");
const parts = 5;
const circle = Math.PI * 2;
window.experience = window.experience || {};
const index = window.experience.index;

showButton.addEventListener("click", () => {
  if (!window.experience.isRotating) {
    // // Smoothly interpolate the rotation over time
    window.experience.rotation = window.experience.index * (circle / parts);

    // let currentRotation = window.experience.rotation;
    // console.log("current rotation", currentRotation);

    // // This is a positive number always
    // let targetRotation = window.experience.index * (circle / parts);
    // console.log("Target rotation", targetRotation);

    // // // Check if the currentRotation is negative

    // // // // Calculate the target rotation based on the current'index'
    // // targetRotation > 4 ? targetRotation / 4 : targetRotation;
    // const duration = 500; // Adjust duration as needed
    // const startTime = Date.now();

    // function animate() {
    //   const now = Date.now();
    //   const elapsedTime = now - startTime;
    //   const progress = Math.min(elapsedTime / duration, 1); // Ensure progress is between 0 and 1

    //   // Interpolate the rotation smoothly
    //   const interpolatedRotation =
    //     currentRotation + (targetRotation - currentRotation) * progress;

    //   // Apply the interpolated rotation to your Three.js object
    //   window.experience.rotation = interpolatedRotation;

    //   if (progress < 1) {
    //     window.experience.isRotating = true;

    //     requestAnimationFrame(animate); // Continue the animation if not finished
    //   } else {
    //     window.experience.isRotating = false;
    //     window.experience.canRotate = false;
    //   }
    // }

    // animate();

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
      }, 300);

      firstSceneElements.forEach((element) => {
        element.classList.remove("transition-opacity");
      });
      secondSceneElements.forEach((element) => {
        element.classList.remove("transition-opacity");
      });
    }, 300);
  }
});

backButton.addEventListener("click", () => {
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
