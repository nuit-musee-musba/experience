import { Section } from "../class/section";
import { Sec1Dragables } from "./Sec1Dragables";
import { initialiseAmountOutside } from "./utils";
import Transition from "../class/transition";

export class Section1 extends Section {
  dragables: Sec1Dragables[];
  button: HTMLButtonElement;

  constructor(sectionId: string, transition: Transition) {
    super(sectionId);
    this.button = document.querySelector<HTMLButtonElement>(
      ".sec1-button"
    ) as HTMLButtonElement;

    const dragables = Array.from(
      document.querySelectorAll<HTMLElement>(".sec1-dragable")
    );

    this.dragables = dragables.map((elmt) => new Sec1Dragables(elmt));
    this.button.addEventListener("click", () => transition.next());
  }
  show() {
    super.show();
    this.button.disabled = true;
  }

  hide() {
    super.hide();
    initialiseAmountOutside();
    this.dragables.forEach((elmt) => elmt.initialise());
  }
}
