class Square {
  square: HTMLDivElement;
  top: number;
  left: number;
  positionText: HTMLParagraphElement;

  constructor(
    parent: HTMLElement,
    name: string,
    position?: { top: number; left: number }
  ) {
    this.square = document.createElement("div");
    this.square.classList.add("square");

    this.top = position?.top ?? 0;
    this.left = position?.left ?? 0;

    this.square.innerHTML = `<p>${name}</p>`;

    this.positionText = document.createElement("p");
    this.positionText.innerText = `x:${this.left} ; y:${this.top}`;

    this.square.appendChild(this.positionText);

    this.square.style.top = `${this.top}px`;
    this.square.style.left = `${this.left}px`;

    parent.appendChild(this.square);

    this.square.addEventListener("touchstart", (e) => {
      this.changeColor("#11FFAA");
      e.preventDefault();
      e.stopPropagation();
    });
    this.square.addEventListener("touchend", () => {
      this.changeColor("#AAAAAA");
    });
    this.square.addEventListener("touchcancel", () => {});
    this.square.addEventListener("touchmove", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.changeColor("#AA3DAA");

      const elementBounding = this.square.getBoundingClientRect();

      const elementHeight = elementBounding.height;
      const elementWidth = elementBounding.width;

      this.top = e.touches[0].clientY - elementHeight / 2;
      this.left = e.touches[0].clientX - elementWidth / 2;

      this.positionText.innerHTML = `x:${this.left} <br/> y:${this.top}`;

      this.square.style.top = `${this.top}px`;
      this.square.style.left = `${this.left}px`;
    });
  }

  changeColor(color: string) {
    this.square.style.backgroundColor = color;
  }
}
const section2 = document.getElementById("section-1");
