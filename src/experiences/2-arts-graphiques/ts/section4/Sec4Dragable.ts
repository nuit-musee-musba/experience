import { Dragable } from "../interactive/dragable";

const initialPlace = {
  hautDroite: {
    top: 1300,
    left: 3337,
  },
  basDroite: {
    top: 1085,
    left: 820,
  },
  basCentre: {
    top: 20,
    left: 2900,
  },
  basGauche: {
    top: 1034,
    left: 3040,
  },
  centre: {
    top: 521.2,
    left: 5.79,
  },
  hautCentre: {
    top: 1392,
    left: -41,
  },
  hautGauche: {
    top: 10,
    left: 3153,
  },
};
type refId = keyof typeof initialPlace;

export class Sec4Dragable extends Dragable {
  refData: RefData;
  refElmt: HTMLElement;
  isInside: boolean;
  id: string;
  onSucceed: (id: string) => boolean;

  constructor(element: HTMLElement, onSucceed: (id: string) => boolean) {
    super(element, undefined, ".ref-click");

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
    this.element.style.zIndex = "10";
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
    this.element.style.zIndex = "1";
    if (this.isInside) {
      this.element.style.transition = "top 0.2s, left 0.2s";
      this.element.style.top = `${this.refData.top}px`;
      this.element.style.left = ` ${this.refData.left}px`;
      super.unable();

      const succeeded = this.onSucceed(this.id);
      console.log({ succeeded });

      if (!succeeded) {
        this.element.style.zIndex = "0";
      }
    }
  }
  show() {
    super.enable();
    this.element.style.top = `${initialPlace[this.id as refId].top}px`;
    this.element.style.left = `${initialPlace[this.id as refId].left}px`;
  }

  initialise() {
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
