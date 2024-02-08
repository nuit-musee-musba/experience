import { Section } from "../class/section";
import { Sec4Dragable } from "./Sec4Dragable";
import { hasRepaired, initialiseAmountPlaced } from "./util";
import Button from "../class/button";
import { setBg } from "../utils/setBg";

export class Section4 extends Section {
  dragables: Sec4Dragable[];
  dragablesElmt: HTMLElement[];

  button: Button;

  constructor(sectionId: string, button: Button) {
    super(sectionId);
    this.dragablesElmt = Array.from(
      document.querySelectorAll<HTMLElement>(".sec4-dragable")
    );
    this.button = button;
    this.button.button.disabled = true;

    this.handleSuccess = this.handleSuccess.bind(this);
  }

  handleSuccess(id: string) {
    const isRepaired = hasRepaired(id);

    if (isRepaired) {
      this.button.button.disabled = false;
    }
    return isRepaired;
  }

  show() {
    setBg("reserve");
    super.show();
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
