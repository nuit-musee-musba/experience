import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

// Initialisez Shepherd et créez le tour
const tour = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    classes: "shadow-md bg-purple-dark shepherd-button",
    scrollTo: true,
  },
});

tour.addStep({
  id: "example-step",
  text: "Voici le livre. Vous pouvez cliquer sur les fruits à droite pour voir ici leurs significations !",
  attachTo: {
    element: ".book",
    on: "right",
  },
  classes: "book",
  buttons: [
    {
      text: "Suivant",
      defaultStepOptions: false,
      classes: "btn-small-primary",
      action: tour.next,
    },
  ],
});

tour.addStep({
  id: "example-step2",
  text: "Voici la recette. Chaque ligne correspond à la description d'un fruit. En appuyant sur les fruits et en regardant le livre, trouvez les fruits dont vous avez besoin !",
  attachTo: {
    element: ".img-recipe",
    on: "left",
  },
  classes: "img-recipe",
  buttons: [
    {
      text: "Suivant",
      defaultStepOptions: false,
      classes: "btn-small-primary",
      action: tour.next,
    },
  ],
});

tour.addStep({
  id: "example-step3",
  text: "Voici votre plan de travail. Quand vous avez repéré un fruit qui semble correspondre et à la description et à l'indication dans la recette, glissez-le ici.",
  attachTo: {
    element: ".composition",
    on: "bottom",
  },
  classes: "composition",
  buttons: [
    {
      text: "Terminer",
      defaultStepOptions: false,
      classes: "btn-small-primary",
      action: tour.complete,
    },
  ],
});

// Démarrer le tour
export function tstart() {
  tour.start();
}
