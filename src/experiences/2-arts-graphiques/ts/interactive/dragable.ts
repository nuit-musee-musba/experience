export class Dragable {
  element: HTMLElement;
  top: number;
  left: number;
  dragable: boolean = true;

  constructor(element: HTMLElement, position?: { top: number; left: number }) {
    this.element = element;

    this.top = position?.top ?? 0;
    this.left = position?.left ?? 0;
    this.enable();
  }
  enable() {
    this.element.addEventListener("touchend", this.drop.bind(this));
    this.element.addEventListener("touchmove", this.isDraging.bind(this));
    this.element.classList.remove("drag-unable");
  }
  unable() {
    this.element.removeEventListener("touchend", this.drop.bind(this));
    this.element.removeEventListener("touchmove", this.isDraging.bind(this));

    this.element.classList.add("drag-unable");
  }
  isDraging(e: TouchEvent) {
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
  }
  drop(e?: TouchEvent) {}
}
