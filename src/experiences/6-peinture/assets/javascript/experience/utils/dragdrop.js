import items from "../data/items.json" assert { type: "json" };
import { recipeResolve, recipeGeneration } from "./recipeManager.js";
import { print_chef_speech } from "./speechBehavior.js";
import { playAnimation } from './playAnimation.js';

var craftCont = document.querySelectorAll("#targetCraftZone > div");
let parentElement = document.getElementById("ingredients-container"); // parent
var stepsEl = document.getElementById("stepnum");
var winConditions = craftCont.length;
var howManyDone = 0;
export var current_step = 1;
var current_step_done = 0;
var current_step_win = 3;
stepsEl.innerHTML = current_step;
var step_success = false;

function countDuplicatesNbMovesNeeded(strings) {
  //cette fonction permet de compter le nombre d'objets
  let frequency = [0, 0, 0, 0];

  strings["items"].forEach((str) => {
    frequency[str["recipe_step"]] += str["number_needed"];
  });

  return frequency;
}

const movesNeededPerSteps = countDuplicatesNbMovesNeeded(items);

function handleDragInteraction(
  dragElementId,
  isMultiple,
  placedEl,
  marginTopPlacement,
  isCorrect,
  padLeft,
  targetZoneId,
  successPosX = null,
  successPosY = null
) {
  const dragElement = document.getElementById(dragElementId);
  const targetZone = document.getElementById(targetZoneId);
  let initialX, initialY;
  let howManyDrags = 0;
  let success = false;

  const dragElementRect = dragElement.getBoundingClientRect();
  const parentElementRect = parentElement.getBoundingClientRect();

  initialX = dragElementRect.left; //position X selon le navigateur
  initialY = dragElementRect.top; //position Y selon le navigateur

  let dragElWidth = dragElement.offsetWidth;

  let realInitialX = initialX - parentElementRect.left; //position X selon la div parente
  let realInitialY = initialY - parentElementRect.top; //position Y selon la div parente

  dragElement.addEventListener("touchstart", (e) => {
    const targetZoneRect = targetZone.getBoundingClientRect();
    console.log("touchstart");
  });

  dragElement.addEventListener("touchmove", (e) => {
    //if (!success) {
    e.preventDefault();
    const touch = e.touches[0];
    const currentX = touch.clientX - initialX + padLeft - dragElWidth / 2;
    const currentY =
      touch.clientY - initialY - dragElWidth / 2 + marginTopPlacement;
    dragElement.style.left = currentX + "px";
    dragElement.style.top = currentY + "px";
    //}
  });

  dragElement.addEventListener("touchend", (e) => {
    const dragElementRect = dragElement.getBoundingClientRect();
    const targetZoneRect = targetZone.getBoundingClientRect();

    if (
      dragElementRect.right >= targetZoneRect.left &&
      dragElementRect.left <= targetZoneRect.right &&
      dragElementRect.bottom >= targetZoneRect.top &&
      dragElementRect.top <= targetZoneRect.bottom
    ) {
      let dialog = items.items.find((item) => item.id === dragElementId);
      let numberUpdater = document.getElementById("actual-" + dialog.id);

      if (isCorrect) {
        if (dialog.recipe_step == current_step) {
          playAnimation(dialog.animation);
          //l'item doit etre dans le step actuel
          if (isMultiple) {
            if (howManyDrags < dialog.number_needed) {
              placedEl[howManyDrags].style.display = "block";
              howManyDone++;
              howManyDrags++;

              print_chef_speech(dialog.dialog); //definie dans speechBehavior.js
              recipeResolve(dialog.id);
              //alert("Chef : " + dialog.dialog);
            } else {
              print_chef_speech(
                "Vous en avez assez mis ! Cherchez quelque chose d'autre"
              ); //definie dans speechBehavior.js
              //alert("tu as mis tout les elements requis pour cet aliment");
            }
          } else {
            if (!success) {
              placedEl.style.display = "block";
              print_chef_speech(dialog.dialog); //definie dans speechBehavior.js
              recipeResolve(dialog.id);
              //alert("Chef : " + dialog.dialog);
              howManyDone++;
              howManyDrags++;
              current_step_done++;
              success = true;
            } else {
              print_chef_speech(
                "Vous en avez assez mis ! Cherchez quelque chose d'autre"
              ); //definie dans speechBehavior.js
              //alert("tu as mis tout les elements requis pour cet aliment");
            }
          }
        } else if (dialog.recipe_step < current_step) {
          print_chef_speech(
            "Vous l'avez déjà utilisé dans les étapes précédentes ! Cherchez autre chose..."
          );
        } else {
          if (dialog.wrong_step_dialog == "") {
            print_chef_speech(
              "C'est un choix qui me parait judicieux, mais pas pour l'instant. Gardez-le en mémoire !"
            );
          } else {
            print_chef_speech(dialog.wrong_step_dialog);
          }
        }

        dragElement.style.left = realInitialX + "px";
        dragElement.style.top = realInitialY + "px";

        numberUpdater.innerHTML = howManyDrags;

        // -- win a step --

        if (howManyDone == movesNeededPerSteps[current_step] && !step_success) {
          //win the game

          if (current_step >= current_step_win) {
            document.body.classList.add("has-ending-opened");
          } else {
            step_success = true;
            setTimeout(() => {
              current_step++;
              recipeGeneration();
              stepsEl.innerHTML = current_step;
              howManyDone = 0;
              step_success = false;
              print_chef_speech("Passons à l'étape " + current_step + "/3 !");
            }, 5000);
          }
        }
      } else {
        dragElement.style.left = realInitialX + "px";
        dragElement.style.top = realInitialY + "px"; //l'utilisateur n'a pas selectionné le bon aliment
        print_chef_speech(dialog.dialog); //definie dans speechBehavior.js
        //alert("Chef : " + dialog.dialog);
      }

      //howManyDrags++;
    } else {
      dragElement.style.left = realInitialX + "px";
      dragElement.style.top = realInitialY + "px";
    }
  });
}
function countDuplicates(strings) {
  //cette fonction permet de compter le nombre d'objets dans chaque catégorie automatiquement
  const frequency = {};

  strings["items"].forEach((str) => {
    if (frequency[str["category"]]) {
      // Si la chaîne existe déjà, augmenter la fréquence
      frequency[str["category"]]++;
    } else {
      // Si la chaîne n'existe pas encore, initialiser la fréquence à 1
      frequency[str["category"]] = 1;
    }
  });

  // Créer un tableau avec les résultats
  const resultArray = Object.keys(frequency).map((str) => ({
    name: str,
    count: frequency[str],
  }));

  return resultArray;
}

// ici il faut initialiser les éléments qui vont drag and drop avec leurs identifiants
// handleDragInteraction(draggableElementId,targetElementId,positionLorsSuccesX(fac),positionLorsSuccesY(fac))

var numberItemsPerCategory = countDuplicates(items);

let i = [1, 1, 1]; //boucle i
let i_overall = [1, 1, 1]; //boucle i
let staged = [0, 0, 0]; //"étage"
let max_item_per_stage = 5;
let cur_stage;
let marginTopPlacement;

// ---> ETAGE 1 : 90px
// ---> ETAGE 0 : 470px

let category = 0; //0=Aliments, 1=Objets, 2=Animaux
items.items.forEach((element) => {
  let placedEl = document.getElementById(element.id + "-placed");
  var elementsWithId = document.querySelectorAll(".multiple-" + element.id);

  let ElementList = document.getElementById(element.id);

  let leftPosition;

  if (numberItemsPerCategory[category]["count"] > max_item_per_stage) {
    staged[category] =
      numberItemsPerCategory[category]["count"] - max_item_per_stage; //number of items on top (stage 1)

    if (cur_stage != 1) {
      cur_stage = 0;
    }
  } else {
    staged[category] = 0;
    cur_stage = -1;
  }

  if (staged[category] == 0) {
    leftPosition = // pour centrer les absolute on va faire ce calcul
      (parentElement.offsetWidth / //la width du parent divisé par...
        (numberItemsPerCategory[category]["count"] + 1) - //on prend le nombre d'item de la catégorie (category) (en gros combien d'item il y a dans cette catégorie) et on lui ajoute un (ça permet de centrer le tout en fonction du nombre d'items)
        324 / 3) * //324 = la width de chaque div des aliments divisé par 3 (pour les centrer par rapport à leur propre centre et non aligné à sur leur gauche)
      i[category]; //multiplié par le nombre d'occurence en cours
    ElementList.style.left = leftPosition + "px"; // on applique
  } else {
    //cur_stage = 0;
    if (cur_stage == 1) {
      //stage 1

      leftPosition = // pour centrer les absolute on va faire ce calcul
        (parentElement.offsetWidth / //la width du parent divisé par...
          (numberItemsPerCategory[category]["count"] -
            max_item_per_stage +
            0.5) - //on prend le nombre d'item de la catégorie (category) (en gros combien d'item il y a dans cette catégorie) et on lui ajoute un (ça permet de centrer le tout en fonction du nombre d'items)
          324 / 3) * //324 = la width de chaque div des aliments divisé par 3 (pour les centrer par rapport à leur propre centre et non aligné à sur leur gauche)
        i[category]; //multiplié par le nombre d'occurence en cours
      ElementList.style.left = leftPosition + "px"; // on applique
    } else if (cur_stage == 0) {
      //stage 0 (forcement égal à max_item_per_stage)

      leftPosition = // pour centrer les absolute on va faire ce calcul
        (parentElement.offsetWidth / //la width du parent divisé par...
          (max_item_per_stage + 1) - //on prend le nombre d'item de la catégorie (category) (en gros combien d'item il y a dans cette catégorie) et on lui ajoute un (ça permet de centrer le tout en fonction du nombre d'items)
          324 / 7) * //324 = la width de chaque div des aliments divisé par 3 (pour les centrer par rapport à leur propre centre et non aligné à sur leur gauche)
        i[category]; //multiplié par le nombre d'occurence en cours
      ElementList.style.left = leftPosition + "px"; // on applique
    }
  }

  if (cur_stage == 1) {
    ElementList.style.top = "90px"; //top position
    marginTopPlacement = 90;
  } else if (cur_stage == 0) {
    ElementList.style.top = "400px"; //bot position
    marginTopPlacement = 470;
  } else if (cur_stage == -1) {
    ElementList.style.top = "250px"; //top position
    marginTopPlacement = 250;
  }

  if (
    i_overall[category] >= numberItemsPerCategory[category]["count"] ||
    (i[category] == staged[category] && cur_stage == 1)
  ) {
    category++;
    i_overall[category] = 1;
    cur_stage = -1;
  } else if (i[category] >= max_item_per_stage) {
    cur_stage++;
    i[category] = 1;
  } else {
    i[category]++;
    i_overall[category]++;
  }

  //ce code implique donc que les items dans items.json soient bien rangés par catégorie

  if (elementsWithId.length == 0) {
    if (placedEl) {
      handleDragInteraction(
        element.id,
        false,
        placedEl,
        marginTopPlacement,
        true,
        leftPosition,
        "targetCraftZone"
      );
    } else {
      handleDragInteraction(
        element.id,
        false,
        placedEl,
        marginTopPlacement,
        false,
        leftPosition,
        "targetCraftZone"
      );
    }
  } else if (elementsWithId.length > 0) {
    handleDragInteraction(
      element.id,
      true,
      elementsWithId,
      marginTopPlacement,
      true,
      leftPosition,
      "targetCraftZone"
    );
  }
});
