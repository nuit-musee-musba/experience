const Date = {
  year: document.getElementById('date-anim__year') as HTMLElement,

  init() {
    if (this.year) {
      this.scrollingNumber(this.year, false);
    }
  },

  scrollingNumber(text: HTMLElement, increment: boolean = true) {
    let numberFrom = parseInt(text.getAttribute('data-from') || '0', 10);
    let numberTo = parseInt(text.getAttribute('data-to') || '0', 10);
    text.innerText = numberFrom.toString();
    const speed = 15;

    setInterval(() => {
      if (numberFrom !== numberTo) {
        if (increment) {
          numberFrom++;
        } else {
          numberFrom--;
        }
        text.innerText = numberFrom.toString().padStart(2, '0');
      }
    }, speed);

    setTimeout(() => {
      document.querySelector<HTMLButtonElement>('#button')!.disabled = false
    }, 3000);
  },
};

export default Date;
