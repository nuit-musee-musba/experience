import { Section } from "./section";

import paint from "../interactive/paint";
import date from "../animation/date";
import landmark from "../animation/landmark";

import { Section1 } from "../section1/Section1";
import { Section4 } from "../section4/Section4";
import Button from "./button";
import Paragraph from "./paragraph";

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
  section9: Section;

  buttonSection2: Button;
  buttonSection3: Button;
  buttonSection4: Button;
  buttonSection5: Button;
  buttonSection6: Button;
  buttonSection7: Button;
  buttonSection8: Button;
  buttonSection9: Button;

  currentSectionNumber: number;
  sections: Section[];

  hintText: Paragraph;

  constructor() {
    this.buttonSection2 = new Button("sec2-button", () => this.next());
    this.buttonSection3 = new Button("sec3-button", () => this.next());
    this.buttonSection4 = new Button("sec4-button", () => this.next());
    this.buttonSection5 = new Button("sec5-button", () => this.next());
    this.buttonSection6 = new Button("sec6-button", () => this.next());
    this.buttonSection7 = new Button("sec7-button", () => this.next());
    this.buttonSection8 = new Button("sec8-button", () => this.next());
    this.buttonSection9 = new Button("sec9-button", () => this.next());

    this.currentSectionNumber = 0;

    this.section0 = new Section("section-0");
    this.section1 = new Section1(`section-1`, this);
    this.section2 = new Section(`section-2`);
    this.section3 = new Section(`section-3`);
    this.section4 = new Section4(`section-4`, this.buttonSection4);
    this.section5 = new Section(`section-5`);
    this.section6 = new Section(`section-6`);
    this.section7 = new Section(`section-7`);
    this.section8 = new Section(`section-8`);
    this.section9 = new Section(`section-9`);

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
      this.section9,
    ];

    this.hintText = new Paragraph("hint");

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

  displayTimelipse(currentSectionNumber: number) {
    const currentSection = document.querySelector(
      `#section-${currentSectionNumber}`
    ) as HTMLElement;

    const dateElement = currentSection.querySelector("#date-anim__year");

    if (dateElement) {
      date.init(this.buttonSection3);
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
              "painting-sketch.webp",
              "painting-clean.webp",
              this.buttonSection2,
              options
            );
            break;
          case "cleaning":
            paint(
              canvas,
              currentSectionNumber,
              "painting-stain.webp",
              "painting-clean.webp",
              this.buttonSection6,
              options
            );
            break;
          case "seal":
            const optionsSeal = {
              getPercentage: true,
              getPercentageAt: 60,
            };
            console.log("seal !!");

            paint(
              canvas,
              currentSectionNumber,
              "painting-cracked.webp",
              "painting-stain.webp",
              this.buttonSection5,
              optionsSeal
            );
            break;
        }
      });
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

  handleHintText() {
    switch (this.currentSectionNumber) {
      case 0:
        this.hintText.changeText("");
        break;
      case 1:
        this.hintText.changeText(
          "Faites preuve de délicatesse en retirant l'emballage de l'œuvre."
        );
        break;
      case 2:
        this.hintText.changeText(
          'Donnez vie au chef-d\'œuvre d’Odilon Redon : "Saint Sébastien".'
        );
        break;
      case 3:
        this.hintText.changeText("");
        break;
      case 7:
        this.hintText.changeText(
          "Habillez la peinture  d’un cadre de votre choix"
        );
        break;
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
    this.section9.hide();
    document.querySelector(".loading__container")?.classList.remove("active");
  }

  next() {
    if (this.currentSectionNumber === 9) {
      this.currentSectionNumber = 0;
    } else {
      this.currentSectionNumber = this.currentSectionNumber + 1;
    }
    this.handleSection();
    this.DisplayInteractiveCanvas(this.currentSectionNumber);
    this.displayTimelipse(this.currentSectionNumber);
    this.handleHintText();
    landmark.updadeDot(this.currentSectionNumber);
  }
}
