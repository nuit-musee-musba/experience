import "./RoughHewingPart.scss";
import DetailsPart from "../3-DetailsPart/DetailsPart";

const RoughHewingPart = () => {
  const roughPart = document.getElementById("RoughHewingPart");
  const roughPartTitle = document.getElementById("RoughPartTitle");

  roughPart.classList.add("show");

  roughPartTitle.classList.add("show")

};

export default RoughHewingPart;
