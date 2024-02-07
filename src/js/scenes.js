// Get references to your elements
const showButton = document.getElementById("showButton");
const backButton = document.getElementById("backButton");
const firstSceneElements = document.querySelectorAll(".first-scene");
const secondSceneElements = document.querySelectorAll(".second-scene");

// Add event listener to showButton
showButton.addEventListener("click", () => {
  // Loop through all elements with the class 'first-scene' and set display to 'none'
  firstSceneElements.forEach((element) => {
    element.style.display = "none";
  });

  // Loop through all elements with the class 'second-scene' and set display to 'flex'
  secondSceneElements.forEach((element) => {
    element.style.display = "flex";
  });
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
