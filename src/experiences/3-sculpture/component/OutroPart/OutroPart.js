import "./OutroPart.scss";

const OutroPart = () => {
  const outroPart = document.getElementById("OutroPart");

  outroPart.classList.add("show");

  outroPart.addEventListener("click", () => {
    outroPart.classList.remove("show");
  });
};

export default OutroPart;
