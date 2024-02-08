import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

// Initialisez Shepherd et créez le tour
const tour = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    classes: "shadow-md bg-purple-dark",
    scrollTo: true,
    buttonsClasses: "btn-small-primary",
  },
});

tour.addStep({
  id: "example-step",
  text: "This step is attached to the bottom of the <code>.example-css-selector</code> element.",
  attachTo: {
    element: ".book",
    on: "bottom",
  },
  classes: "book",
  buttons: [
    {
      text: "Next",
      action: tour.next,
    },
  ],
});

// Démarrer le tour
tour.start();
