import { Dragable } from "../interactive/dragable";

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

export class Sec4Dragable extends Dragable {
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

  isDraging(e: TouchEvent) {
    super.isDraging(e);

    const refDataBoundindRect = this.refElmt.getBoundingClientRect();
    const tolerance = 0.1;

    const { top, left, right, bottom } = refDataBoundindRect;
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

    const elmtBoundindRect = this.element.getBoundingClientRect();

    this.isInside = !(
      elmtBoundindRect.top > this.refData.avgZoneBottom ||
      elmtBoundindRect.right < this.refData.avgZoneLeft ||
      elmtBoundindRect.bottom < this.refData.avgZoneTop ||
      elmtBoundindRect.left > this.refData.avgZoneRight
    );

    console.log("target top : ", this.refData.top, this.refData.avgZoneTop);

    if (this.isInside) {
      this.refElmt.style.zIndex = "10";
      this.refElmt.style.stroke = "#ff0000";

      return;
    }
    this.refElmt.style.stroke = "#000000";
  }
  drop() {
    if (this.isInside) {
      this.element.style.transition = "top 0.2s, left 0.2s";
      this.element.style.top = `${this.refData.top}px`;
      this.element.style.left = ` ${this.refData.left}px`;
      super.unable();
      this.onSucceed(this.id);
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
