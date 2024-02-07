import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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
      break;

    case "second":
      console.log("second painting");
      break;

    case "third":
      console.log("third painting");
      break;

    default:
      break;
  }
});
