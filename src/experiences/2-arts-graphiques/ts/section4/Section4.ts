import { Section } from "../class/section";
import { Sec4Dragable } from "./Sec4Dragable";
import { hasRepaired, initialiseAmountPlaced } from "./util";
import Button from "../class/button";
import { setBg } from "../utils/setBg";
import { ClockWatch } from "../class/ClockWatch";

export class Section4 extends Section {
  dragables: Sec4Dragable[];
  dragablesElmt: HTMLElement[];
  clockWatch: ClockWatch;
  button: Button;

  constructor(sectionId: string, button: Button) {
    super(sectionId);
    this.dragablesElmt = Array.from(
      document.querySelectorAll<HTMLElement>(".sec4-dragable")
    );
    this.button = button;
    this.button.button.disabled = true;

    this.handleSuccess = this.handleSuccess.bind(this);
    this.clockWatch = new ClockWatch(this.displayStrokes);
  }

  handleSuccess(id: string) {
    const isRepaired = hasRepaired(id);

    if (isRepaired) {
      this.clockWatch.startStopTimer();
      this.clockWatch.resetTimer();

      this.button.button.disabled = false;
    }
    return isRepaired;
  }

  displayStrokes(time: number) {
    if (time > 60) {
      const piecesRef = Array.from(
        document.querySelectorAll(".pieces-ref")
      ) as HTMLElement[];
      piecesRef.forEach((elmt) => {
        elmt.style.stroke = "#111111";
      });
    }
  }

  show() {
    setBg("reserve");
    super.show();
    this.clockWatch.startStopTimer();

    initialiseAmountPlaced();
    this.dragables = this.dragablesElmt.map(
      (elmt) => new Sec4Dragable(elmt, this.handleSuccess)
    );
    if (this.dragables) {
      this.dragables.forEach((elmt) => elmt.show());
    }

    const paintingContainer = document.querySelector<HTMLElement>(
      ".painting-pieces-container"
    ) as HTMLElement;

    paintingContainer.style.display = "block";
  }
  hide() {
    super.hide();

    if (this.dragables) {
      this.dragables.forEach((elmt) => elmt.initialise());
    }
  }
}
