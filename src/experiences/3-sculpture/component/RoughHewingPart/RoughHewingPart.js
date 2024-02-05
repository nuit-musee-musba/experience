import "./RoughHewingPart.scss";
import RefiningPart from "../RefiningPart/RefiningPart";

const RoughHewingPart = () => {
  const roughPart = document.getElementById("RoughHewingPart");

  roughPart.classList.add("show");

  roughPart.addEventListener("click", () => {
    roughPart.classList.remove("show");
    RefiningPart();
  });
};

export default RoughHewingPart;
