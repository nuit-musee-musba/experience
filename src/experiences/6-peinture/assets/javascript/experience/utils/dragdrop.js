import items from "../data/items.json" assert { type: "json" };
import { recipeResolve, recipeGeneration } from "./recipeManager.js";
import { print_chef_speech } from "./speechBehavior.js";
import { playAnimation } from "./playAnimation.js";

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
  isCorrect,
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

  console.log(dragElementId + ":" + initialX + "," + initialY);

  let dragElWidth = dragElement.offsetWidth;
  let dragElheight = dragElement.offsetHeight;

  let realInitialX = initialX - parentElementRect.left; //position X selon la div parente
  let realInitialY = initialY - parentElementRect.top; //position Y selon la div parente

  dragElement.addEventListener("touchstart", (e) => {
    let selectedElement = parentElement.querySelector(".selected-item");
    if (selectedElement) {
      selectedElement.classList.remove("selected-item");
    }
    const targetZoneRect = targetZone.getBoundingClientRect();
    dragElement.classList.add("selected-item");
  });

  dragElement.addEventListener("touchmove", (e) => {
    //if (!success) {
    e.preventDefault();
    const touch = e.touches[0];
    const currentX = touch.clientX - initialX + realInitialX - dragElWidth / 2;
    const currentY = touch.clientY - initialY + realInitialY - dragElheight / 2;
    console.log(touch.clientX + "," + touch.clientY);
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
            for (let index = 0; index < dialog.number_needed; index++) {
              placedEl[index].style.display = "block";
              howManyDone++;
              howManyDrags++;
            }

            console.log(dialog);

            print_chef_speech(dialog.dialog); //definie dans speechBehavior.js
            if (dialog.number_needed == howManyDrags) {
              recipeResolve(dialog.id);
            }

            // if (howManyDrags < dialog.number_needed) {
            //   placedEl[howManyDrags].style.display = "block";
            //   howManyDone++;
            //   howManyDrags++;

            //   print_chef_speech(dialog.dialog); //definie dans speechBehavior.js
            //   recipeResolve(dialog.id);
            //   //alert("Chef : " + dialog.dialog);
            // } else {
            //   print_chef_speech(
            //     "Vous en avez assez mis ! Cherchez quelque chose d'autre"
            //   ); //definie dans speechBehavior.js
            //   //alert("tu as mis tout les elements requis pour cet aliment");
            // }
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
            playAnimation("animJeffPensive");
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
        playAnimation(dialog.animation);
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
  let leftPosition,
    marginTopPlacement = 0;

  //ce code implique donc que les items dans items.json soient bien rangés par catégorie

  if (elementsWithId.length == 0) {
    if (placedEl) {
      handleDragInteraction(
        element.id,
        false,
        placedEl,
        true,
        "targetCraftZone"
      );
    } else {
      handleDragInteraction(
        element.id,
        false,
        placedEl,
        false,
        "targetCraftZone"
      );
    }
  } else if (elementsWithId.length > 0) {
    handleDragInteraction(
      element.id,
      true,
      elementsWithId,
      true,
      "targetCraftZone"
    );
  }
});
