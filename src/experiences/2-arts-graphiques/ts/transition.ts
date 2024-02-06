import { Section } from "./section";

import paint from "./interactive/paint";

import { Section1 } from "./section1/Section1";
import { Section4 } from "./section4/Section4";

export default class Transition {
  currentSection: Section;
  section0: Section;
  section1: Section;
  section2: Section;
  section3: Section;
  section4: Section;
  section5: Section;
  section6: Section;
  section7: Section;
  section8: Section;

  currentSectionNumber: number;
  sections: Section[];
  button: HTMLButtonElement;

  constructor() {
    this.currentSectionNumber = 0;
    this.section0 = new Section("section-0");
    this.section1 = new Section1(`section-1`);
    this.section2 = new Section(`section-2`);
    this.section3 = new Section(`section-3`);
    this.section4 = new Section4(`section-4`);
    this.section5 = new Section(`section-5`);
    this.section6 = new Section(`section-6`);
    this.section7 = new Section(`section-7`);
    this.section8 = new Section(`section-8`);

    const button = document.querySelector<HTMLButtonElement>("#button");

    if (!button) {
      throw new Error(
        "transition/constructor: Element with a class of 'button' must be present"
      );
    }
    this.button = button;
    this.button.addEventListener("click", () => this.handleTransition());

    this.sections = [
      this.section0,
      this.section1,
      this.section2,
      this.section3,
      this.section4,
      this.section5,
      this.section6,
      this.section7,
      this.section8,
    ];
    const urlParams = new URLSearchParams(window.location.search);

    this.currentSection = this.sections[this.currentSectionNumber];

    this.init();

    if (urlParams.has("section")) {
      const sectionId = urlParams.get("section");
      const section = this.sections[Number(sectionId)];

      if (this.sections[this.currentSectionNumber]) {
        this.sections[this.currentSectionNumber].hide();
      }
      this.currentSectionNumber = Number(sectionId);
      section.show();
    }
  }

  handleTransition() {
    if (this.currentSectionNumber === 8) {
      this.currentSectionNumber = 0;
    } else {
      this.currentSectionNumber = this.currentSectionNumber + 1;
    }
    this.handleSection();
    this.handleButtonTitle();
    this.DisplayInteractiveCanvas(this.currentSectionNumber);
  }

  destroyAllCanvases() {
    const existingCanvases = document.querySelectorAll("canvas");

    existingCanvases.forEach((canvas: HTMLElement | any) => {
      canvas.parentNode.removeChild(canvas);
    });
  }

  DisplayInteractiveCanvas(currentSectionNumber: number) {
    this.destroyAllCanvases();

    const currentSection = document.querySelector(
      `#section-${currentSectionNumber}`
    ) as HTMLElement

    const canvasContainer =
      Array.from(currentSection.querySelectorAll<HTMLCanvasElement>(".canvas__container"));

    if (canvasContainer) {
      const options = {
        getPercentage: true,
        getPercentageAt: 80,
      };

      canvasContainer.forEach(canvas => {
        let interaction = canvas.getAttribute("data-interaction");
        switch (interaction) {
          case "paint":
            paint(canvas, currentSectionNumber, "blank-canvas.jpeg", "canvas1.jpeg", options);
            break;
          case "cleaning":
            paint(canvas, currentSectionNumber, "stains_painting.png", "canvas1.jpeg", options);
            break;
          case "seal":
            const optionsSeal = {
              getPercentage: true,
              getPercentageAt: 60,
            };
            paint(canvas, currentSectionNumber, "seal.webp", "canvas1.jpeg", optionsSeal);
            break;
        }
      });

      console.log(currentSectionNumber);
    }
  }

  handleSection() {
    let previousSection: Section;
    this.currentSection = this.sections[this.currentSectionNumber];

    if (this.currentSectionNumber === 0) {
      previousSection = this.sections[this.sections.length - 1];
    } else {
      previousSection = this.sections[this.currentSectionNumber - 1];
    }
    this.currentSection.show();
    previousSection.hide();
  }

  handleButtonTitle() {
    switch (this.currentSectionNumber) {
      case 0:
        this.button.innerText = "Découvrir l'oeuvre";
        break;
      case 1:
        this.button.innerText = "Aller dans le passé";
        break;
      case 2:
        this.button.innerText = "Retour vers le présent";
        break;
      case 3:
        this.button.innerText = "Aller dans la réserve";
        break;
      case 4:
        this.button.innerText = "Nettoyer le tableau";
        break;
      case 5:
        this.button.innerText = "Choisir un cadre";
        break;
      case 6:
        this.button.innerText = "Exposer l'oeuvre";
        break;
      case 7:
        this.button.innerText = "Voir les critiques";
        break;
      case 8:
        this.button.innerText = "Recommencer l'expérience";
    }
  }

  init() {
    this.section1.hide();
    this.section2.hide();
    this.section3.hide();
    this.section4.hide();
    this.section5.hide();
    this.section6.hide();
    this.section7.hide();
    this.section8.hide();
  }
}
