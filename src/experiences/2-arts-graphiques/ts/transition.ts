import { Section } from "./section";
import { Section1 } from "./section1";

export default class Transition{
    currentSection: HTMLElement | null
    section1: HTMLElement | null
    section2: HTMLElement | null
    section3: HTMLElement | null
    currentSectionNumber: number



  constructor() {
    this.currentSectionNumber = 1;
    this.section1 = new Section1(`section-1`);
    this.section2 = new Section(`section-2`);
    this.section3 = new Section(`section-3`);

    const button = document.querySelector<HTMLButtonElement>(".button");

    if (!button) {
      throw new Error(
        "transition/construcor: Elelement with a class of 'button' must be present"
      );
    }

    handleTransition(){
        if(this.currentSectionNumber === 4){
            this.currentSectionNumber = 1
        }
        this.handleSection()
        this.currentSectionNumber = this.currentSectionNumber + 1
    }

    handleSection(){
        this.currentSection = document.getElementById(`section-${this.currentSectionNumber}`)

        if(this.section1 && this.section2 && this.currentSection && this.section3){
            this.currentSection.style.display = 'block'
            switch (this.currentSectionNumber) {
                case 1:
                    this.section2.style.display = 'none'
                    this.section3.style.display = 'none'
                    break
                case 2:
                    this.section1.style.display = 'none'
                    this.section3.style.display = 'none'
                    break
                case 3:
                    this.section1.style.display = 'none'
                    this.section2.style.display = 'none'
            }
        }
    }
}
