import items from "../data/items.json" assert { type: "json" };
import { recipeResolve } from "./recipeManager.js";

var craftCont = document.querySelectorAll("#targetCraftZone > div");
let parentElement = document.getElementById("ingredients-container"); // parent
var winConditions = craftCont.length;
var howManyDone = 0;

function handleDragInteraction(
  dragElementId,
  isMultiple,
  placedEl,
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
    const currentY = touch.clientY - initialY - dragElWidth / 2;
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
      // if(successPosX && successPosY){
      //     dragElement.style.left = successPosX + 'px';
      //     dragElement.style.top = successPosY + 'px';
      // }else{
      //     dragElement.style.left = targetZoneRect.left + 'px';
      //     dragElement.style.top = targetZoneRect.top + 'px';
      // }

      let dialog = items.items.find((item) => item.id === dragElementId);

      if (isCorrect) {
        if (isMultiple) {
          if (howManyDrags <= placedEl.length - 1) {
            placedEl[howManyDrags].style.display = "block";
            howManyDone++;

            print_chef_speech(dialog.dialog); //definie dans speechBehavior.js
            recipeResolve(dialog.id);
            //alert("Chef : " + dialog.dialog);
          } else {
            print_chef_speech(
              "Tu as mis tout les elements requis pour cet aliment"
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
          } else {
            print_chef_speech(
              "Tu as mis tout les elements requis pour cet aliment"
            ); //definie dans speechBehavior.js
            //alert("tu as mis tout les elements requis pour cet aliment");
          }
        }

        dragElement.style.left = realInitialX + "px";
        dragElement.style.top = realInitialY + "px";

        success = true;

        // -- win --

        if (howManyDone >= winConditions) {
          alert("Chef : Tu as gagné !");
        }
      } else {
        dragElement.style.left = realInitialX + "px";
        dragElement.style.top = realInitialY + "px"; //l'utilisateur n'a pas selectionné le bon aliment
        print_chef_speech(dialog.dialog); //definie dans speechBehavior.js
        //alert("Chef : " + dialog.dialog);
      }

      howManyDrags++;
    } else {
      dragElement.style.left = realInitialX + "px";
      dragElement.style.top = realInitialY + "px";
      console.log("element pas dans la zone");
    }
  });
}
console.log(items);
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

var dragableElementList = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
var numberItemsPerCategory = countDuplicates(items);

let i = 1; //boucle i
let category = 0; //0=Aliments, 1=Objets, 2=Animaux
dragableElementList.forEach((element) => {
  let placedEl = document.getElementById(element + "-placed");
  var elementsWithId = document.querySelectorAll(".multiple-" + element);

  let ElementList = document.getElementById(element);

  ElementList.style.top = "90px"; //top position
  let leftPosition = // pour centrer les absolute on va faire ce calcul
    (parentElement.offsetWidth / //la width du parent divisé par...
      (numberItemsPerCategory[category]["count"] + 1) - //on prend le nombre d'item de la catégorie (category) (en gros combien d'item il y a dans cette catégorie) et on lui ajoute un (ça permet de centrer le tout en fonction du nombre d'items)
      324 / 3) * //324 = la width de chaque div des aliments divisé par 3 (pour les centrer par rapport à leur propre centre et non aligné à sur leur gauche)
    i; //multiplié par le nombre d'occurence en cours
  ElementList.style.left = leftPosition + "px"; // on applique

  if (i >= numberItemsPerCategory[category]["count"]) {
    //cette boucle permet de savoir si tout les items attendus dans cette catégorie on été modifiés
    i = 1; //si oui, on remet i à 1
    category++; //et on ajoute 1 à catégory pour passer à la catégorie suivante
  } else {
    i++; //sinon, on continue d'incrémenter i
  }

  //ce code implique donc que les items dans items.json soient bien rangés par catégorie

  if (elementsWithId.length == 0) {
    if (placedEl) {
      handleDragInteraction(
        element,
        false,
        placedEl,
        true,
        leftPosition,
        "targetCraftZone"
      );
    } else {
      handleDragInteraction(
        element,
        false,
        placedEl,
        false,
        leftPosition,
        "targetCraftZone"
      );
    }
  } else if (elementsWithId.length > 0) {
    handleDragInteraction(
      element,
      true,
      elementsWithId,
      true,
      leftPosition,
      "targetCraftZone"
    );
  }
});
