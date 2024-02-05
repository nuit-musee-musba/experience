import "./RoughHewingPart.scss";
import DetailsPart from "../3-DetailsPart/DetailsPart";

const RoughHewingPart = () => {
  const roughPart = document.getElementById("RoughHewingPart");

  roughPart.classList.add("show");

  roughPart.addEventListener("click", () => {
    roughPart.classList.remove("show");
    DetailsPart();
  });
};

export default RoughHewingPart;
