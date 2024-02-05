import "./RefiningPart.scss";

const RefiningPart = () => {
  const refiningPart = document.getElementById("RefiningPart");

  refiningPart.classList.add("show");

  refiningPart.addEventListener("click", () => {
    refiningPart.classList.remove("show");
  });
};

export default RefiningPart;
