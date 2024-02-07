import { dot } from "three/examples/jsm/nodes/Nodes.js";

const Landmark = {
  landmarkElement: document.querySelector(".landmark"),

  init(nbSections : number) {
    this.createDot(nbSections)
  },

  createDot(nbSections : number) {
    let dotTemplate : HTMLTemplateElement | null | undefined = this.landmarkElement?.querySelector("#landmark__dot");
    if (dotTemplate && this.landmarkElement) {
      while (this.landmarkElement.children.length < (nbSections - 1)) {
        let clone = dotTemplate.content.cloneNode(true)
        this.landmarkElement.appendChild(clone);
        if (this.landmarkElement.children.length === 2) {
          this.landmarkElement.querySelector(".landmark__dot")!.classList.add('active')
        }
      }
    } else {
      console.error('Template or landmark div not found');
    }
  },

  updadeDot(currentSectionNumber : number){
    const dots = document.querySelectorAll('.landmark__dot');

    dots.forEach(dot => {
      dot.classList.remove('active')
    });

    dots[(currentSectionNumber - 1)].classList.add('active');
  }
};

export default Landmark;
