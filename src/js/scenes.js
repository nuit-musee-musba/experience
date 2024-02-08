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

// Add event listener to showButton
showButton.addEventListener("click", () => {
  // Calculate the target rotation based on 'index'
  if (!window.experience.isRotating) {
    window.experience.rotation = window.experience.index * (circle / parts);
    console.log(
      window.experience.rotation,
      window.experience.index,
      circle,
      parts
    );
    // Loop through all elements with the class 'first-scene' and set display to 'none'
    firstSceneElements.forEach((element) => {
      element.style.display = "none";
    });

    // Loop through all elements with the class 'second-scene' and set display to 'flex'
    secondSceneElements.forEach((element) => {
      element.style.display = "flex";
    });
  }
});

// Add event listener to backButton
backButton.addEventListener("click", () => {
  // Loop through all elements with the class 'second-scene' and set display to 'none'
  secondSceneElements.forEach((element) => {
    element.style.display = "none";
  });

  // Loop through all elements with the class 'first-scene' and set display to 'flex'
  firstSceneElements.forEach((element) => {
    element.style.display = "flex";
  });
});

// Render loop
const tik = () => {
  requestAnimationFrame(tik);
  window.experience.isRotating
    ? (showButton.style.display = "none")
    : (showButton.style.display = "block");
};

tik();
