import "./PolishingPart.scss";
import OutroPart from "../6-OutroPart/OutroPart";

const PolishingPart = () => {
  const refiningPart = document.getElementById("RefiningPart");
  refiningPart.classList.remove("show");

  const polishingPart = document.getElementById("PolishingPart");

  polishingPart.classList.add("show");
};

export default PolishingPart;
