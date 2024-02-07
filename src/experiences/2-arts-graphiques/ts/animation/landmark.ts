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
  }
};

export default Landmark;
