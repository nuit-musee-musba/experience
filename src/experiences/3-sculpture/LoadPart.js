const LoadPart = () => {
  window.addEventListener("load", (event) => {
    const loadPart = document.getElementById("loadPart");
    loadPart.classList.remove("show_flex");
  });
};

export default LoadPart;
