import "./RefiningPart.scss";
import PolishingPart from "../5-PolishingPart/PolishingPart";

const RefiningPart = () => {
  const refiningPart = document.getElementById("RefiningPart");

  refiningPart.classList.add("show");

  refiningPart.addEventListener("click", () => {
    refiningPart.classList.remove("show");
    PolishingPart();
  });
};

export default RefiningPart;
