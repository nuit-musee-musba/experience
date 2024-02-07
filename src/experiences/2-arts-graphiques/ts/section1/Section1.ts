import { Section } from "../class/section";
import { Sec1Dragables } from "./Sec1Dragables";
import { initialiseAmountOutside } from "./utils";
import Transition from "../class/transition";
import Button from "../class/button";

export class Section1 extends Section {
  dragables: Sec1Dragables[];
  button: Button;

  constructor(sectionId: string, transition: Transition) {
    super(sectionId);
    this.button = new Button("sec1-button", () => transition.next());

    const dragables = Array.from(
      document.querySelectorAll<HTMLElement>(".sec1-dragable")
    );

    this.dragables = dragables.map((elmt) => new Sec1Dragables(elmt));
  }
  show() {
    super.show();
    this.button.button.disabled = true;
  }

  hide() {
    super.hide();
    initialiseAmountOutside();
    this.dragables.forEach((elmt) => elmt.initialise());
  }
}
