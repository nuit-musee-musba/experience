var craftCont = document.querySelectorAll("#targetCraftZone > div");
console.log(craftCont);
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

  let parentElement = document.getElementById("ingredients-container"); // parent

  const dragElementRect = dragElement.getBoundingClientRect();
  const parentElementRect = parentElement.getBoundingClientRect();

  initialX = dragElementRect.left; //position X selon le navigateur
  initialY = dragElementRect.top; //position Y selon le navigateur

  let realInitialX = initialX - parentElementRect.left; //position X selon la div parente
  let realInitialY = initialY - parentElementRect.top; //position Y selon la div parente

  dragElement.addEventListener("touchstart", (e) => {
    const targetZoneRect = targetZone.getBoundingClientRect();
  });

  dragElement.addEventListener("touchmove", (e) => {
    //if (!success) {
    e.preventDefault();
    const touch = e.touches[0];
    const currentX = touch.clientX - initialX + padLeft;
    const currentY = touch.clientY - initialY;
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
      //console.log('element dans la zone');
      // if(successPosX && successPosY){
      //     dragElement.style.left = successPosX + 'px';
      //     dragElement.style.top = successPosY + 'px';
      // }else{
      //     dragElement.style.left = targetZoneRect.left + 'px';
      //     dragElement.style.top = targetZoneRect.top + 'px';
      // }

      if (isCorrect) {
        if (isMultiple) {
          if (howManyDrags <= placedEl.length - 1) {
            placedEl[howManyDrags].style.display = "block";
            howManyDone++;
            alert("Chef : parfait !");
          } else {
            alert("tu as mis tout les elements requis pour cet aliment");
          }
        } else {
          if (!success) {
            console.log(placedEl);
            placedEl.style.display = "block";
            alert("Chef : parfait !");
            howManyDone++;
          } else {
            alert("tu as mis tout les elements requis pour cet aliment");
          }
        }

        dragElement.style.left = realInitialX + "px";
        dragElement.style.top = realInitialY + "px";

        console.log("true");

        success = true;

        // -- win --

        if (howManyDone >= winConditions) {
          alert("Chef : Tu as gagné !");
        }
      } else {
        dragElement.style.left = realInitialX + "px";
        dragElement.style.top = realInitialY + "px"; //l'utilisateur n'a pas selectionné le bon aliment
        alert("Chef : ce n'est pas le bon aliment !");
      }

      howManyDrags++;
    } else {
      dragElement.style.left = realInitialX + "px";
      dragElement.style.top = realInitialY + "px";
      console.log("element pas dans la zone");
    }
  });
}

// ici il faut initialiser les éléments qui vont drag and drop avec leurs identifiants
// handleDragInteraction(draggableElementId,targetElementId,positionLorsSuccesX(fac),positionLorsSuccesY(fac))

var dragableElementList = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

let i = 1;
dragableElementList.forEach((element) => {
  let placedEl = document.getElementById(element + "-placed");
  var elementsWithId = document.querySelectorAll(".multiple-" + element);

  console.log(elementsWithId);

  let ElementList = document.getElementById(element);

  ElementList.style.top = "90px";
  let leftPosition = 200 * i;
  ElementList.style.left = leftPosition + "px";

  if (i >= 3) {
    i = 1;
  } else {
    i++;
  }

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
