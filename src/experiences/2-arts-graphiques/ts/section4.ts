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
function hasRepaired(id: string) {
  if (!amountPlaced.includes(id)) {
    amountPlaced.push(id);
    if (amountPlaced.length >= 4) {
      console.log("weel done");

      return true;
    }
    return false;
  }
}

class Sec4Dragable extends Dragable {
  refData: RefData;
  refElmt: HTMLElement;
  isInside: boolean;
  id: string;
  onSucceed: (id: string) => void;

  constructor(element: HTMLElement, onSucceed: (id: string) => void) {
    super(element);

    this.id = element.id.split("-")[1];
    this.onSucceed = onSucceed;

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
      this.onSucceed(this.id);
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
  canvasContainer: HTMLElement;

  constructor(sectionId: string) {
    super(sectionId);
    this.dragablesElmt = Array.from(
      document.querySelectorAll<HTMLElement>(".sec4-dragable")
    );
  }

  handleSuccess(id: string) {
    const isRepaired = hasRepaired(id);

    if (isRepaired) {
      const paintingContainer = document.querySelector<HTMLElement>(
        ".painting-pieces-container"
      ) as HTMLElement;

      const canvasContainer = document.querySelector<HTMLElement>(
        "#section-4 .canvas__container"
      ) as HTMLElement;

      paintingContainer.style.display = "none";

      canvasContainer.style.display = "block";
    }
  }

  show() {
    super.show();
    this.dragables = this.dragablesElmt.map(
      (elmt) => new Sec4Dragable(elmt, this.handleSuccess)
    );

    const canvasContainer = document.querySelector<HTMLElement>(
      "#section-4 .canvas__container"
    );

    if (!canvasContainer) {
      throw new Error("no canvas with a class of '.canvas__container'");
    }
    this.canvasContainer = canvasContainer;
    console.log(this.canvasContainer);

    this.canvasContainer.style.display = "none";
  }
  hide() {
    super.hide();
    if (this.dragables) {
      this.dragables.forEach((elmt) => elmt.initialise());
    }
  }
}
