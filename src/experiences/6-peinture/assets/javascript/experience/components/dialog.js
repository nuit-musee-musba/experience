class Dialog {
  constructor(element) {
    this.element = element;
    this.dialogs = this.element.querySelectorAll(".dialog-content");

    this.buttonNext = this.element.querySelector(".btn-next");
    this.buttonPrev = this.element.querySelector(".btn-prev");
    this.buttonPlay = this.element.querySelector(".btn-game");

    this.listen();
  }

  listen() {
    let i = 0;

    if (this.buttonPrev) {
      this.buttonPrev.addEventListener("click", () => {
        if (i == 1) {
          this.buttonPrev.style.display = "none";
        }
        if (i > 0) {
          i--;
          this.updateCurrent(this.dialogs[i]);
        }
        if (i != this.dialogs.length - 1) {
          this.buttonNext.style.display = "flex";
          this.buttonPlay.style.display = "none";
        }
      });
    }

    if (this.buttonNext) {
      this.buttonNext.addEventListener("click", () => {
        if (i == 0) {
          this.buttonPrev.style.display = "flex";
        }
        if (i < this.dialogs.length - 1) {
          i++;
          this.updateCurrent(this.dialogs[i]);
        }
        if (i == this.dialogs.length - 1) {
          this.buttonNext.style.display = "none";
          this.buttonPlay.style.display = "flex";
        }
      });
    }
  }

  updateCurrent(dialog) {
    this.background = dialog.getAttribute(["data-background"]);
    this.animation = dialog.getAttribute(["data-anim"]);
    if (this.animation) {
      this.animContent = document.querySelector('.popup-animation');

      this.animContent.style.display = 'block';
      document.body.classList.add('last-scene');

      setTimeout(() => {
        this.animContent.style.display = 'none';
      }, 2500);
    }
    if (this.background) {
      const backgroundPath = `/6-peinture/images/scenery/ending/${this.background}.svg`;
      setTimeout(() => {
        document.body.style.backgroundImage = `url(${backgroundPath})`;
      }, 1000);
    }

    this.currentDialog = this.element.querySelector(".active");
    this.currentDialog.classList.remove("active");
    dialog.classList.add("active");

  }
}

(function () {
  const dialogContainer = document.querySelector(".dialog");
  if (dialogContainer) {
    new Dialog(dialogContainer);
  }
})();
