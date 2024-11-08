import "./RefiningPart.scss";
import PolishingPart from "../5-PolishingPart/PolishingPart";

const RefiningPart = () => {
  const detailsPart = document.getElementById("DetailsPart");
  detailsPart.classList.remove("show");

  const refiningPart = document.getElementById("RefiningPart");
  refiningPart.classList.add("show");

  const steps1InRefiningPart = document.getElementById("steps1InRefiningPart");
  steps1InRefiningPart.classList.add("show");
};

export default RefiningPart;
