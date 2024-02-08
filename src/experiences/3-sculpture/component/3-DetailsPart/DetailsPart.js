import "./DetailsPart.scss";
import RefiningPart from "../4-RefiningPart/RefiningPart";

const DetailsPart = () => {
  const roughPart = document.getElementById("RoughHewingPart");
  roughPart.classList.remove("show");

  const detailsPart = document.getElementById("DetailsPart");
  detailsPart.classList.add("show");

  const steps1InDetailsPart = document.getElementById("steps1InDetailsPart");
  steps1InDetailsPart.classList.add("show");
};

export default DetailsPart;
