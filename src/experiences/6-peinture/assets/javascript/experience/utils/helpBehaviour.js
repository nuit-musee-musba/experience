import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

export function demarrerTour() {
  let helpbtn = document.getElementById("helpbtn");
  // Initialisez Shepherd et créez le tour
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: "shadow-md bg-purple-dark shepherd-button",
      scrollTo: true,
    },
  });

  tour.addStep({
    id: "recipe-step",
    text: "Voici la liste des éléments que tu dois trouver pour faire ta composition !",
    attachTo: {
      element: ".img-recipe",
      on: "left",
    },
    classes: "heyyy",
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
    id: "elements-step",
    text: "Voici votre inventaire, déplacez les éléments sur la table pour faire votre composition !",
    attachTo: {
      element: ".ingredients-container",
      on: "top",
    },
    classes: "heyyy",
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
    id: "onglets-step",
    text: "Vous pouvez changer de catégorie pour trouver le bon élément !",
    attachTo: {
      element: ".categories-tabs",
      on: "top",
    },
    classes: "heyyy",
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
    id: "book-step",
    text: "Ici vous pouvez retrouver la signification de l’élément que vous avez sélectionné.",
    attachTo: {
      element: ".book",
      on: "right",
    },
    classes: "heyyy",
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
    text: "Ici se trouve votre table de composition. Déplacez les bons éléments de votre inventaire ici !",
    attachTo: {
      element: ".composition",
      on: "bottom",
    },
    classes: "heyyy",
    buttons: [
      {
        text: "Terminer",
        defaultStepOptions: false,
        classes: "btn-small-primary",
        action: tour.complete,
      },
    ],
  });

  helpbtn.style.display = "none";

  tour.start();

  tour.on("complete", function () {
    // Fonction à exécuter une fois le tour complété
    helpbtn.style.display = "flex";
  });
}
