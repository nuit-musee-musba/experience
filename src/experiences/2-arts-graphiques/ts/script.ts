import Transition from "./transition";
import Frames from "./interactive/paintingFrame";
import paint from "./interactive/paint";

window.addEventListener("load", () => {
  // paint();
  new Transition();
  new Frames();
});
