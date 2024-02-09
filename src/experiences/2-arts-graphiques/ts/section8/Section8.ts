import { Section } from "../class/section";
import { setBg } from "../utils/setBg";

export class Section8 extends Section {
  constructor(sectionId: string) {
    super(sectionId);
  }

  show() {
    setBg("musee");
    super.show();
  }
}
