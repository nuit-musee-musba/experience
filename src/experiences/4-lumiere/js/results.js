import * as THREE from "three";
import GUI from "lil-gui";
import { enableInactivityRedirection } from "/global/js/inactivity";

/**
 * Inactivity
 */
enableInactivityRedirection();

/**
 * Popins
 */

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const paintingOrigin = urlParams.get("painting");

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  switch (paintingOrigin) {
    case "first":
      console.log("first painting");
      document
        .querySelector(`#result-first-painting`)
        .classList.remove("hidden");
      break;

    case "second":
      console.log("second painting");
      document
        .querySelector(`#result-second-painting`)
        .classList.remove("hidden");
      break;

    case "third":
      console.log("third painting");
      document
        .querySelector(`#result-third-painting`)
        .classList.remove("hidden");
      break;

    default:
      break;
  }
});
