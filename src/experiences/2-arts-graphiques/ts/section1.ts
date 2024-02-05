import { Dragable } from "./interactive/dragable";
import { Section } from "./section";

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
    top: 500,
    left: 1418,
  },
  four: {
    top: 1290,
    left: 1980,
  },
};
type ids = "one" | "two" | "three" | "four";

let amountOutside: string[] = [];
function handleAmountOutside(action: "add" | "remove", id: string) {
  if (action === "add" && !amountOutside.includes(id)) {
    amountOutside.push(id);
    if (amountOutside.length >= 4) {
      alert("well done");
    }
    return;
  }

  if (action === "remove" && amountOutside.includes(id)) {
    amountOutside = amountOutside.filter((value) => id !== value);
  }
}

class Sec1Dragables extends Dragable {
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

  isDraging() {
    const elmtBoundindRect = this.element.getBoundingClientRect();
    const zoneBoundindRect = this.zone.getBoundingClientRect();

    this.isOutside =
      elmtBoundindRect.top > zoneBoundindRect.bottom ||
      elmtBoundindRect.right < zoneBoundindRect.left ||
      elmtBoundindRect.bottom < zoneBoundindRect.top ||
      elmtBoundindRect.left > zoneBoundindRect.right;

    if (this.isOutside) {
      handleAmountOutside("add", this.element.id);
      this.element.style.backgroundColor = "#BBEEAA";
      return;
    }
    handleAmountOutside("remove", this.element.id);
    this.element.style.backgroundColor = "#DDDDDD";
  }

  initialise() {
    this.element.style.top = `${initialPlace[this.element.id as ids].top}px`;
    this.element.style.left = `${initialPlace[this.element.id as ids].left}px`;
  }
}

export class Section1 extends Section {
  dragables: Sec1Dragables[];

  constructor(sectionId: string) {
    super(sectionId);
    const dragables = Array.from(
      document.querySelectorAll<HTMLElement>(".sec1-dragable")
    );

    this.dragables = dragables.map((elmt) => new Sec1Dragables(elmt));
  }

  hide() {
    super.hide();
    amountOutside = [];
    this.dragables.forEach((elmt) => elmt.initialise());
  }
}
