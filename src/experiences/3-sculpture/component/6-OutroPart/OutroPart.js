import "./OutroPart.scss";

const OutroPart = () => {
  const polishingPart = document.getElementById("PolishingPart");
  polishingPart.classList.remove("show");

  const outroPart = document.getElementById("OutroPart");

  outroPart.classList.add("show");

  // outroPart.addEventListener("click", () => {
  //   outroPart.classList.remove("show");
  // });
};

export default OutroPart;
