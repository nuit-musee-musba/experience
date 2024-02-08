import { handleAmountOutside } from "./utils";
import { Dragable } from "../interactive/dragable";
import experience from "../script";

const initialPlace = {
  one: {
    top: 353,
    left: 1308,
  },
  two: {
    top: 376,
    left: 1881,
  },
  three: {
    top: 1302,
    left: 1323,
  },
  four: {
    top: 1221,
    left: 1702,
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

      return;
    }
    handleAmountOutside("remove", this.element.id, experience);
    this.element.style.backgroundColor = "transparent";
  }

  initialise() {
    this.element.style.top = `${initialPlace[this.element.id as ids].top}px`;
    this.element.style.left = `${initialPlace[this.element.id as ids].left}px`;
    this.element.style.backgroundColor = "transparent";
  }
}
