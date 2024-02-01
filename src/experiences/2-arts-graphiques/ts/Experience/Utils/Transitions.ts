import Cube from '../World/Cube'

export default class Transition {
  currentStep: number;
  textElement: HTMLElement | null;
  buttonElement: HTMLElement | null;

  constructor() {
    this.textElement = document.getElementById("title");
    this.buttonElement = document.getElementById("button");
    this.currentStep = 1;

    if(this.buttonElement){
      this.buttonElement.addEventListener('click', () => this.handleTransition())
    }
  }

  handleTransition() {
    if (this.currentStep === 6) {
      this.currentStep = 0;
    }
    this.currentStep = this.currentStep + 1
    this.handleTitle()
    // this.handleCube()
  }

  handleTitle(){
    if(this.textElement){
      switch (this.currentStep) {
        case 1:
          this.textElement.innerText = 'scene 1'
          break
        case 2:
          this.textElement.innerText = 'scene 2'
          break
        case 3:
          this.textElement.innerText = 'scene 3'
          break
        case 4:
          this.textElement.innerText = 'scene 4'
          break
        case 5:
          this.textElement.innerText = 'scene 5'
          break
        case 6:
          this.textElement.innerText = 'scene 6'
          break
      }
    }
  }
  // handleCube(){
  //   switch (this.currentStep) {
  //     case 2: new Cube('#FFFFFF', 0,0,4)
  //   }
  // }
}
