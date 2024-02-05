import { Dragable } from "./interactive/dragable";
import { Section } from "./section";

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
}
