import "./PolishingPart.scss";
import OutroPart from "../6-OutroPart/OutroPart";

const PolishingPart = () => {
  const polishingPart = document.getElementById("PolishingPart");

  polishingPart.classList.add("show");

  polishingPart.addEventListener("click", () => {
    polishingPart.classList.remove("show");
    OutroPart();
  });
};

export default PolishingPart;
