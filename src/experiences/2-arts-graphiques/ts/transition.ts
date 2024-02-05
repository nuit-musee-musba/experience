import { Section } from "./section";
import { Section1 } from "./section1";
import paint from "./interactive/paint";

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
    this.DisplayInteractiveCanvas(this.currentSectionNumber)
  }

  destroyAllCanvases() {
    const existingCanvases = document.querySelectorAll('canvas');

    existingCanvases.forEach((canvas : HTMLElement | any) => {
      canvas.parentNode.removeChild(canvas);
    });
  }

  DisplayInteractiveCanvas(currentSectionNumber : any){
    this.destroyAllCanvases();

    const currentSection : HTMLElement | null =  document.querySelector(`#section-${currentSectionNumber}`);
    const canvasContainer : HTMLElement | null | undefined = currentSection?.querySelector(".canvas__container");

    if (canvasContainer) {
      const interaction = canvasContainer.getAttribute('data-interaction');
      console.log(currentSectionNumber);
      const options = {
        getPercentage: true,
        getPercentageAt: 80,
      };
      switch (interaction) {
        case 'paint':
          console.log(interaction);
          paint(canvasContainer, 'blank-canvas.jpeg', 'canvas1.jpeg', options)
          break;
        case 'cleaning':
          console.log(interaction);
          let imgElement = document.createElement('img');
          imgElement.src = '/2-arts-graphiques/canvas/canvas1.jpeg';
          imgElement.classList.add('canvas__img');
          canvasContainer.appendChild(imgElement);
          paint(canvasContainer, 'stains.png', 'stains_mask.png', options)
          break;
      }
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
        this.button.innerText = "Choisir un cadre";
        break;
      case 5:
        this.button.innerText = "Exposer l'oeuvre";
        break;
      case 6:
        this.button.innerText = "Voir les critiques";
        break;
      case 7:
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
  }
}
