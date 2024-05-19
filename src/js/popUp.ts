const enableCloseModalWhenClickingOutside = () => {
  // Source: https://stackoverflow.com/a/77300737
  // @ts-ignore
  HTMLDialogElement.prototype.triggerShow =
    HTMLDialogElement.prototype.showModal;
  HTMLDialogElement.prototype.showModal = function () {
    // @ts-ignore
    this.triggerShow();
    this.onclick = (event) => {
      let rect = this.getBoundingClientRect();
      if (event.clientY < rect.top || event.clientY > rect.bottom)
        return this.close();
      if (event.clientX < rect.left || event.clientX > rect.right)
        return this.close();
    };
  };
};
enableCloseModalWhenClickingOutside();

const helpOpenBtn = document.getElementById("helpOpenBtn") as HTMLButtonElement;
const helpDialog = document.getElementById("helpDialog") as HTMLDialogElement;
const helpCloseBtn = document.getElementById(
  "helpCloseBtn"
) as HTMLButtonElement;

helpOpenBtn.addEventListener("click", () => helpDialog.showModal());
helpCloseBtn.addEventListener("click", () => helpDialog.close());
