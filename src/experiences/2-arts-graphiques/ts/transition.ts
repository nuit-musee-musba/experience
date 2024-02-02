import { Section } from "./section";

export default class Transition {
  currentSection: Section;
  section1: Section;
  section2: Section;
  section3: Section;
  currentSectionNumber: number;
  sections: Section[];
  button: HTMLButtonElement;

  constructor() {
    this.currentSectionNumber = 1;
    this.section1 = new Section(`section-1`);
    this.section2 = new Section(`section-2`);
    this.section3 = new Section(`section-3`);

    const button = document.querySelector<HTMLButtonElement>(".button");

    if (!button) {
      throw new Error(
        "transition/construcor: Elelement with a class of 'button' must be present"
      );
    }
    this.button = button;

    this.sections = [this.section1, this.section2, this.section3];
    this.currentSection = this.sections[this.currentSectionNumber - 1];
  }

  handleTransition() {
    if (this.currentSectionNumber === 4) {
      this.currentSectionNumber = 0;
    }
    this.handleSection();
    this.handleButtonTitle();
    this.currentSectionNumber = this.currentSectionNumber + 1;
  }

  handleButtonTitle() {
    if (this.button) {
      if (this.currentSectionNumber === 0) {
        this.button.innerText = "Découvrir l'oeuvre";
        return;
      }
      if (this.currentSectionNumber === 3) {
        this.button.innerText = "Recommencer l'expérience";
        return;
      }
      this.button.innerText = `Passer à la section ${this.currentSectionNumber + 1}`;
    }
  }

  handleSection() {
    this.currentSection = this.sections[this.currentSectionNumber - 1];

    if (
      this.section1 &&
      this.section2 &&
      this.currentSection &&
      this.section3
    ) {
      this.currentSection.show();
      switch (this.currentSectionNumber) {
        case 1:
          this.section2.hide();
          this.section3.hide();
          break;
        case 2:
          this.section1.hide();
          this.section3.hide();
          break;
        case 3:
          this.section1.hide();
          this.section2.hide();
      }
    }
  }
}
