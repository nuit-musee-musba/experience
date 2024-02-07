import { Section } from "../class/section";
import { Sec4Dragable } from "./Sec4Dragable";
import { hasRepaired, initialiseAmountPlaced } from "./util";
import Button from "../class/button";

export class Section4 extends Section {
  dragables: Sec4Dragable[];
  dragablesElmt: HTMLElement[];
  canvasContainer: HTMLElement;
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
  }

  show() {
    super.show();
    this.dragables = this.dragablesElmt.map(
      (elmt) => new Sec4Dragable(elmt, this.handleSuccess)
    );

    const canvasContainer = document.querySelector<HTMLElement>(
      "#section-4 .canvas__container"
    );
    const paintingContainer = document.querySelector<HTMLElement>(
      ".painting-pieces-container"
    ) as HTMLElement;

    paintingContainer.style.display = "block";

    if (!canvasContainer) {
      throw new Error("no canvas with a class of '.canvas__container'");
    }
    this.canvasContainer = canvasContainer;

    this.canvasContainer.style.display = "none";
  }
  hide() {
    super.hide();
    initialiseAmountPlaced;
    if (this.dragables) {
      this.dragables.forEach((elmt) => elmt.initialise());
    }
  }
}
