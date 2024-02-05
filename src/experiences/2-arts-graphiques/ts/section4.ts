import { Dragable } from "./interactive/dragable";
import { Section } from "./section";

const initialPlace = {
  dl: {
    top: 900,
    left: 1500,
  },
  dr: {
    top: 1200,
    left: 2400,
  },
  ur: {
    top: 0,
    left: 2400,
  },
  ul: {
    top: 0,
    left: 0,
  },
};
type refId = "dl" | "dr" | "ur" | "ul";

let amountPlaced: string[] = [];
function handleAmountPlaced(id: string) {
  if (!amountPlaced.includes(id)) {
    amountPlaced.push(id);
    if (amountPlaced.length >= 4) {
      alert("well done");
    }
    return;
  }
}

class Sec4Dragable extends Dragable {
  refData: RefData;
  refElmt: HTMLElement;
  isInside: boolean;
  id: string;

  constructor(element: HTMLElement) {
    super(element);

    this.id = element.id.split("-")[1];

    const refElmt = document.querySelector<HTMLElement>(`#ref-${this.id}`);

    if (!refElmt) {
      throw new Error(`section4: No element with id of  #ref-${this.id}`);
    }
    this.refElmt = refElmt;

    const elmtBoundindRect = refElmt.getBoundingClientRect();

    const { top, left, right, bottom } = elmtBoundindRect;
    const tolerance = 0.1;
    console.log("sec4 : ", top);

    this.refData = {
      top,
      left,
      right,
      bottom,
      avgZoneTop: top - top * tolerance,
      avgZoneLeft: left - left * tolerance,
      avgZoneRight: right + right * tolerance,
      avgZoneBottom: bottom + bottom * tolerance,
    };
  }

  isDraging() {
    const elmtBoundindRect = this.element.getBoundingClientRect();

    this.isInside = !(
      elmtBoundindRect.top > this.refData.avgZoneBottom ||
      elmtBoundindRect.right < this.refData.avgZoneLeft ||
      elmtBoundindRect.bottom < this.refData.avgZoneTop ||
      elmtBoundindRect.left > this.refData.avgZoneRight
    );

    this.refData.top = this.refElmt.getBoundingClientRect().top;
    if (this.isInside) {
      this.refElmt.style.zIndex = "10";
      this.refElmt.style.stroke = "#FF0000";

      return;
    }
    this.refElmt.style.stroke = "#000000";
  }
  drop() {
    if (this.isInside) {
      this.element.style.transition = "top 0.2s, left 0.2s";
      this.element.style.top = `${this.refData.top}px`;
      this.element.style.left = ` ${this.refData.left}px`;
      handleAmountPlaced(this.id);
      console.log(this.refData.top, this.refData.left);
    }
  }
  initialise() {
    this.element.style.top = `${initialPlace[this.id as refId].top}px`;
    this.element.style.left = `${initialPlace[this.id as refId].left}px`;

    this.element.style.transition = "none";
    this.refElmt.style.stroke = "#000000";
  }
}

interface RefData {
  top: number;
  left: number;
  right: number;
  bottom: number;
  avgZoneTop: number;
  avgZoneBottom: number;
  avgZoneLeft: number;
  avgZoneRight: number;
}

export class Section4 extends Section {
  dragables: Sec4Dragable[];
  dragablesElmt: HTMLElement[];

  constructor(sectionId: string) {
    super(sectionId);
    this.dragablesElmt = Array.from(
      document.querySelectorAll<HTMLElement>(".sec4-dragable")
    );
  }

  show() {
    super.show();
    this.dragables = this.dragablesElmt.map((elmt) => new Sec4Dragable(elmt));
  }
  hide() {
    super.hide();
    this.dragables.forEach((elmt) => elmt.initialise());
  }
}
