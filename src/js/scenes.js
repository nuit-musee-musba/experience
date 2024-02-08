// Get references to your elements

const showButton = document.getElementById("showButton");
const backButton = document.getElementById("backButton");
const firstSceneElements = document.querySelectorAll(".first-scene");
const secondSceneElements = document.querySelectorAll(".second-scene");
const parts = 5;
const circle = Math.PI * 2;
window.experience = window.experience || {};
console.log(window.experience);
const index = window.experience.index;

showButton.addEventListener("click", () => {
  if (!window.experience.isRotating) {
    window.experience.rotation = window.experience.index * (circle / parts);

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
