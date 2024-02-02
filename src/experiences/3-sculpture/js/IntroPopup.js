import RoughHewingPart from "./RoughHewingPart";

const IntroPopup = () => {
  const myPopup = document.getElementById("myPopup");
  const buttonPopup = document.getElementById("buttonPopup");
  const popupText = document.getElementById("popupText");

  buttonPopup.innerHTML = "Suivant";

  buttonPopup.addEventListener("click", function () {
    popupText.innerHTML =
      "Bienvenue dans mon atelier où je sculpte depuis 1883 ! Votre mission est de tailler dans l’intégralité ma sculpture “Mozart expirant” à partir d’un bloc de marbre. Avant votre arrivée, j’ai déjà réalisé le croquis et la petite maquette de la sculpture. <br/><br/>Maintenant, c’est à vous de reprendre le relais !";
    myPopup.classList.remove("show");
    RoughHewingPart();
  });
  window.addEventListener("click", function (event) {
    if (event.target == myPopup) {
      myPopup.classList.remove("show");
      RoughHewingPart();
    }
  });
};

export default IntroPopup;
