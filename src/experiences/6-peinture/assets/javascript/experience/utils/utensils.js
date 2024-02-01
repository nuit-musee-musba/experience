//penser que tout les fruits ne puevent pas être coupés
//donc il faut mettre en place un systeme qui gère quels fruits peuvent
//et gérer les info bulles du chef dans ces deux conditions
//pour faire ça tu peux par exemple faire un array des id des fruits qui peuvent être coupés

function utensilsHandleDragInteraction(dragElementId, targetZoneId) {
  const dragElement = document.getElementById(dragElementId);
  const targetZone = document.getElementById(targetZoneId);
  const dragElementImg = dragElement.querySelector("img");

  let initialX, initialY;

  let parentElement = document.querySelector(".utensils"); // parent du couteau pour déterminer sa position de retour (car il doit etre en absolute)

  console.log(parentElement);
  const dragElementRect = dragElement.getBoundingClientRect();
  const parentElementRect = parentElement.getBoundingClientRect();

  initialX = dragElementRect.left; //position X selon le navigateur
  initialY = dragElementRect.top; //position Y selon le navigateur

  let realInitialX = initialX - parentElementRect.left; //position X selon la div parente
  let realInitialY = initialY - parentElementRect.top; //position Y selon la div parente

  dragElement.addEventListener("touchstart", (e) => {
    const targetZoneRect = targetZone.getBoundingClientRect(); //ne sert pas à grand chose mais fait acte de présence
  });

  dragElement.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const currentX = touch.clientX - initialX;
    let rotationValue = Math.max(Math.min(currentX * 0.2, 0), -90);

    dragElementImg.style.transform = `rotate(${rotationValue}deg)`;

    //comportement quand le couteau est en train de bouger
    const currentY = touch.clientY - initialY;
    dragElement.style.left = currentX + "px";
    dragElement.style.top = currentY + "px";
  });

  dragElement.addEventListener("touchend", (e) => {
    //compportement quand il est relaché
    const dragElementRect = dragElement.getBoundingClientRect();
    const targetZoneRect = targetZone.getBoundingClientRect();
    dragElementImg.style.transform = `rotate(0deg)`;

    if (
      dragElementRect.right >= targetZoneRect.left && //condition : drag est il dans target ?
      dragElementRect.left <= targetZoneRect.right &&
      dragElementRect.bottom >= targetZoneRect.top &&
      dragElementRect.top <= targetZoneRect.bottom
    ) {
      console.log("element dans la zone");
      if (dragElementId == "knife") {
        alert("tu coupes citron");
        targetImage.src = "./assets/images/ingredients/animals/cat.png";
      } else if (dragElementId == "carafe") {
        alert("tu verses water");
      }

      dragElement.style.left = realInitialX + "px"; //permet de faire revenir le couteau à sa position initiale
      dragElement.style.top = realInitialY + "px";
    } else {
      dragElement.style.left = realInitialX + "px"; //permet de faire revenir le couteau à sa position initiale
      dragElement.style.top = realInitialY + "px";

      console.log("element pas dans la zone");
    }
  });
}

utensilsHandleDragInteraction("knife", "9-1-placed");
utensilsHandleDragInteraction("carafe", "5-placed");
