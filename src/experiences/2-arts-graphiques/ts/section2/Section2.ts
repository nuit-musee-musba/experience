import { Section } from "../class/section";
import { setBg } from "../utils/setBg";

export class Section2 extends Section {
  constructor(sectionId: string) {
    super(sectionId);
  }

  show() {
    setBg("atelier");
    super.show();
  }
}
