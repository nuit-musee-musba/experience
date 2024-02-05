import RoughHewingPart from "../2-RoughHewingPart/RoughHewingPart";
import "./IntroPart.scss";

const IntroPopup = () => {
  const IntroPart = document.getElementById("IntroPart");
  const buttonIntro = document.getElementById("buttonIntro");

  buttonIntro.addEventListener("click", function () {
    IntroPart.classList.remove("show");
    RoughHewingPart();
  });
};

export default IntroPopup;
