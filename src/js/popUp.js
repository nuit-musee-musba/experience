document.addEventListener("DOMContentLoaded", function () {
  const helpButton = document.getElementById("helpButton");
  const helpPopup = document.getElementById("helpPopup");
  const closeButton = document.getElementById("closeButton");

  if (helpButton && closeButton && helpPopup) {
    helpButton.addEventListener("click", toggleHelpPopup);
    closeButton.addEventListener("click", toggleHelpPopup);
    document.addEventListener("click", closeOnOutsideClick);
  }

  function toggleHelpPopup() {
    console.log("toggleHelpPopup");

    // Get the computed style of the element
    const computedStyle = window.getComputedStyle(helpPopup);

    console.log("current popUp display: ", computedStyle.display);

    // Toggle the visibility
    helpPopup.style.display =
      computedStyle.display === "none" ? "block" : "none";

    console.log("helpPopup.style.display", helpPopup.style.display);
  }

  function closeOnOutsideClick(event) {
    if (!helpPopup.contains(event.target) && event.target !== helpButton) {
      helpPopup.style.display = "none";
    }
  }
});
