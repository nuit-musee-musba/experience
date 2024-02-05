import "./DetailsPart.scss";
import RefiningPart from "../4-RefiningPart/RefiningPart";

const DetailsPart = () => {
  const roughPart = document.getElementById("RoughHewingPart");
  roughPart.classList.remove("show");

  const detailsPart = document.getElementById("DetailsPart");

  detailsPart.classList.add("show");

  detailsPart.addEventListener("click", () => {
    detailsPart.classList.remove("show");
    RefiningPart();
  });
};

export default DetailsPart;
