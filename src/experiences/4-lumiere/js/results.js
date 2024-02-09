import * as THREE from "three";
import GUI from "lil-gui";
import { enableInactivityRedirection } from "/global/js/inactivity";

/**
 * Global settings
 */
// Clear local storage
const clearLocalStorage = () => {
  localStorage.removeItem("4-first");
  localStorage.removeItem("4-second");
  localStorage.removeItem("4-third");
}
// leave button
const leaveBtns = document.querySelectorAll(".btn-back-hub")
for (const leaveBtn of leaveBtns) {
  leaveBtn.addEventListener("click",
    () => {
      clearLocalStorage();
      window.location.href = "/";
    }
  )
}

// Inactivity
enableInactivityRedirection().beforeRedirect(() => {
  clearLocalStorage();
});

/**
 * Result texts
 */

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const paintingOrigin = urlParams.get("painting");

document.addEventListener("DOMContentLoaded", (event) => {

  switch (paintingOrigin) {
    case "first":
      console.log("first painting");
      localStorage.setItem("4-first", true);
      document
        .querySelector(`#result-first-painting`)
        .classList.remove("hidden");
      break;

    case "second":
      console.log("second painting");
      localStorage.setItem("4-second", true);
      document
        .querySelector(`#result-second-painting`)
        .classList.remove("hidden");
      break;

    case "third":
      console.log("third painting");
      localStorage.setItem("4-third", true);
      document
        .querySelector(`#result-third-painting`)
        .classList.remove("hidden");
      break;

    default:
      break;
  }

  let visitedPaintings = {
    first: localStorage.getItem("4-first"),
    second: localStorage.getItem("4-second"),
    third: localStorage.getItem("4-third"),
  }

  console.log("visitedPaintings:", visitedPaintings)
  if (visitedPaintings.first && visitedPaintings.second && visitedPaintings.third) {
    let endResultBtns = document.querySelectorAll(".btn-wrapper .btn-small-primary")

    endResultBtns.forEach(btn => {
      btn.textContent = "Terminer l'expérience";
      btn.href = "./end.html";
    });

  } else {
    console.log("not true")
  }
});

