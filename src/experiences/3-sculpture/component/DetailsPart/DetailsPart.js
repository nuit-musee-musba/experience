import "./DetailsPart.scss";
import RefiningPart from "../RefiningPart/RefiningPart";

const DetailsPart = () => {
  const detailsPart = document.getElementById("DetailsPart");

  detailsPart.classList.add("show");

  detailsPart.addEventListener("click", () => {
    detailsPart.classList.remove("show");
    RefiningPart();
  });
};

export default DetailsPart;
