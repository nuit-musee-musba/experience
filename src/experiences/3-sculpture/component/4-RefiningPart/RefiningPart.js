import "./RefiningPart.scss";
import PolishingPart from "../5-PolishingPart/PolishingPart";

const RefiningPart = () => {
  const detailsPart = document.getElementById("DetailsPart");
  detailsPart.classList.remove("show");

  const refiningPart = document.getElementById("RefiningPart");

  refiningPart.classList.add("show");

  refiningPart.addEventListener("click", () => {
    refiningPart.classList.remove("show");
    PolishingPart();
  });
};

export default RefiningPart;
