import { handleAmountOutside } from "./utils";
import { Dragable } from "../interactive/dragable";
import experience from "../script";

const initialPlace = {
  one: {
    top: 300,
    left: 1330,
  },
  two: {
    top: 500,
    left: 2160,
  },
  three: {
    top: 900,
    left: 1418,
  },
  four: {
    top: 1290,
    left: 1980,
  },
};
type ids = "one" | "two" | "three" | "four";

export class Sec1Dragables extends Dragable {
  zone: HTMLElement;
  isOutside?: boolean;

  constructor(element: HTMLElement) {
    super(element);

    const zone = document.querySelector<HTMLElement>(".sec1-painting");

    if (!zone) {
      throw new Error(
        "Sec1Dragables: Element with class: '.sec1-painting' is required in the dom"
      );
    }
    this.zone = zone;
  }

  isDraging(e: TouchEvent) {
    super.isDraging(e);

    const elmtBoundindRect = this.element.getBoundingClientRect();
    const zoneBoundindRect = this.zone.getBoundingClientRect();

    this.isOutside =
      elmtBoundindRect.top > zoneBoundindRect.bottom ||
      elmtBoundindRect.right < zoneBoundindRect.left ||
      elmtBoundindRect.bottom < zoneBoundindRect.top ||
      elmtBoundindRect.left > zoneBoundindRect.right;

    if (this.isOutside) {
      handleAmountOutside("add", this.element.id, experience);
      this.element.style.backgroundColor = "#BBEEAA";
      return;
    }
    handleAmountOutside("remove", this.element.id, experience);
    this.element.style.backgroundColor = "#DDDDDD";
  }

  initialise() {
    this.element.style.top = `${initialPlace[this.element.id as ids].top}px`;
    this.element.style.left = `${initialPlace[this.element.id as ids].left}px`;
    this.element.style.backgroundColor = "#DDDDDD";
  }
}
