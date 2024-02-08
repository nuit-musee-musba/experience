import Button from "../class/button";

const Date = {
  year: document.getElementById("date-anim__year") as HTMLElement,

  init(button: Button) {
    if (this.year) {
      this.scrollingNumber(this.year, false, button);
    }
  },

  scrollingNumber(
    text: HTMLElement,
    increment: boolean = true,
    button: Button
  ) {
    button.button.disabled = true;
    let numberFrom = parseInt(text.getAttribute("data-from") || "0", 10);
    let numberTo = parseInt(text.getAttribute("data-to") || "0", 10);
    text.innerText = numberFrom.toString();
    const speed = 15;

    setInterval(() => {
      if (numberFrom !== numberTo) {
        if (increment) {
          numberFrom++;
        } else {
          numberFrom--;
        }
        text.innerText = numberFrom.toString().padStart(2, "0");
      }
    }, speed);

    setTimeout(() => {
      button.button.disabled = false;
    }, 3000);
  },
};

export default Date;
