const IntroPopup = () => {

    const myPopup = document.getElementById("myPopup");
    const buttonPopup = document.getElementById("buttonPopup");
    const popupText = document.getElementById("popupText");
  
    buttonPopup.innerHTML = "Suivant";
  
    buttonPopup.addEventListener("click", function () {
      if (buttonPopup.innerHTML === "Suivant") {
        buttonPopup.innerHTML = "Fermer";
        popupText.innerHTML = "Si vous êtes un novice de la sculpture, ne vous inquiétez pas, Carnielo sera à vos côtés à chaque étape du processus de création de la sculpture. Il vous guidera sur le choix des outils, les techniques à utiliser, et vous plongera dans l'histoire qui se cache derrière cette œuvre d'art.";
        window.addEventListener("click", function (event) {
          if (event.target == myPopup) {
            myPopup.classList.remove("show");
          }
        });
      } else if (buttonPopup.innerHTML === "Fermer") {
        myPopup.classList.remove("show");
      }
    });
  
  
  };
  
  export default IntroPopup;
  
  