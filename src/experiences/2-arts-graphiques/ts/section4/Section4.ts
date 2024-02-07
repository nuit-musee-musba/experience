import { Section } from "../section";
import { Sec4Dragable } from "./Sec4Dragable";
import { hasRepaired, initialiseAmountPlaced } from "./util";

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

      canvasContainer.classList.add("active");
    }
  }

  show() {
    super.show();

    const paintingContainer = document.querySelector<HTMLElement>(
      ".painting-pieces-container"
    ) as HTMLElement;
    paintingContainer.style.display = "block";

    this.dragables = this.dragablesElmt.map(
      (elmt) => new Sec4Dragable(elmt, this.handleSuccess)
    );
  }
  hide() {
    super.hide();
    initialiseAmountPlaced();
    if (this.dragables) {
      this.dragables.forEach((elmt) => elmt.initialise());
    }
  }
}
