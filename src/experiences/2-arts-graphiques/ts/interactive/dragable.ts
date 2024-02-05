export class Dragable {
  element: HTMLElement;
  top: number;
  left: number;

  constructor(element: HTMLElement, position?: { top: number; left: number }) {
    this.element = element;

    this.top = position?.top ?? 0;
    this.left = position?.left ?? 0;

    this.element.addEventListener("touchend", (e) => {
      //console.log("%c handleEnd", "background-color: #AAAAAA;");

      this.drop(e);
    });
    this.element.addEventListener("touchmove", (e) => {
      //console.log("%c handleMove", "background-color: #AA3DAA;");
      e.preventDefault();
      e.stopPropagation();

      const elementBounding = this.element.getBoundingClientRect();

      const elementHeight = elementBounding.height;
      const elementWidth = elementBounding.width;

      this.top = e.touches[0].clientY - elementHeight / 2;
      this.left = e.touches[0].clientX - elementWidth / 2;

      this.element.style.top = `${this.top}px`;
      this.element.style.left = `${this.left}px`;

      this.isDraging(e);
    });
  }
  isDraging(e?: TouchEvent) {}
  drop(e?: TouchEvent) {}
}
