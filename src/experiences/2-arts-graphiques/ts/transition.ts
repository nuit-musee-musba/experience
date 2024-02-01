export default class Transition {
  currentSection: HTMLElement | null;
  section0: HTMLElement | null;
  section1: HTMLElement | null;
  section2: HTMLElement | null;
  section3: HTMLElement | null;
  button: HTMLElement | null;
  currentSectionNumber: number;

  constructor() {
    this.currentSectionNumber = 1;
    this.currentSection = document.getElementById(`section-1`);

    this.section0 = document.getElementById("section-0");
    this.section1 = document.getElementById(`section-1`);
    this.section2 = document.getElementById(`section-2`);
    this.section3 = document.getElementById(`section-3`);

    this.button = document.getElementById("button");
  }

  handleTransition() {
    if (this.currentSectionNumber === 4) {
      this.currentSectionNumber = 0;
    }
    this.handleSection();
    this.handleButtonTitle();
    this.currentSectionNumber = this.currentSectionNumber + 1;
  }

  handleSection() {
    this.currentSection = document.getElementById(
      `section-${this.currentSectionNumber}`
    );

    if (
      this.section0 &&
      this.section1 &&
      this.section2 &&
      this.section3 &&
      this.currentSection
    ) {
      this.currentSection.style.display = "block";
      switch (this.currentSectionNumber) {
        case 0:
          this.section3.style.display = "none";
          break;
        case 1:
          this.section0.style.display = "none";
          break;
        case 2:
          this.section1.style.display = "none";
          break;
        case 3:
          this.section2.style.display = "none";
      }
    }
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
}
