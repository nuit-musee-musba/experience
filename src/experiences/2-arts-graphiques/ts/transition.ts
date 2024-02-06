import { Section } from "./section";
import { Section1 } from "./section1";

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

  currentSectionNumber: number;
  sections: Section[];
  button: HTMLButtonElement;

  constructor() {
    this.currentSectionNumber = 0;
    this.section0 = new Section("section-0");
    this.section1 = new Section1(`section-1`);
    this.section2 = new Section(`section-2`);
    this.section3 = new Section(`section-3`);
    this.section4 = new Section(`section-4`);
    this.section5 = new Section(`section-5`);
    this.section6 = new Section(`section-6`);
    this.section7 = new Section(`section-7`);

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
    ];

    this.currentSection = this.sections[this.currentSectionNumber];

    this.init();
  }

  handleTransition() {
    if (this.currentSectionNumber === 7) {
      this.currentSectionNumber = 0;
    } else {
      this.currentSectionNumber = this.currentSectionNumber + 1;
    }
    this.handleSection();
    this.handleButtonTitle();
  }

  displayTimelipse(currentSectionNumber: number) {
    const currentSection = document.querySelector(
      `#section-${currentSectionNumber}`
    ) as HTMLElement;

    const dateElement = currentSection.querySelector("#date-anim__year");

    if (dateElement) {
      this.button.disabled = true;
      date.init();
    }
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
    ) as HTMLElement;

    const canvasContainer = Array.from(
      currentSection.querySelectorAll<HTMLCanvasElement>(".canvas__container")
    );

    if (canvasContainer) {
      const options = {
        getPercentage: true,
        getPercentageAt: 80,
      };

      canvasContainer.forEach((canvas) => {
        let interaction = canvas.getAttribute("data-interaction");
        switch (interaction) {
          case "paint":
            paint(
              canvas,
              currentSectionNumber,
              "blank-canvas.jpeg",
              "canvas1.jpeg",
              options
            );
            break;
          case "cleaning":
            paint(
              canvas,
              currentSectionNumber,
              "stains_painting.png",
              "canvas1.jpeg",
              options
            );
            break;
          case "seal":
            const optionsSeal = {
              getPercentage: true,
              getPercentageAt: 60,
            };
            paint(
              canvas,
              currentSectionNumber,
              "seal.webp",
              "canvas1.jpeg",
              optionsSeal
            );
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
    console.log(this.currentSectionNumber);
    if (this.currentSectionNumber === 0) {
      this.button.innerText = "Découvrir l'oeuvre";
      return;
    }
    if (this.currentSectionNumber === 7) {
      this.button.innerText = "Recommencer l'expérience";
      return;
    }
    this.button.innerText = `Passer à la section ${this.currentSectionNumber + 1}`;
  }

  init() {
    this.section1.hide();
    this.section2.hide();
    this.section3.hide();
    this.section4.hide();
    this.section5.hide();
    this.section6.hide();
    this.section7.hide();
  }
}
