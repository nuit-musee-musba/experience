export default class Transition{
    currentSection: HTMLElement | null
    section1: HTMLElement | null
    section2: HTMLElement | null
    section3: HTMLElement | null
    currentSectionNumber: number

    constructor() {
        this.currentSectionNumber = 1
        this.currentSection = document.getElementById(`section-1`)
        this.section1 = document.getElementById(`section-1`)
        this.section2 = document.getElementById(`section-2`)
        this.section3 = document.getElementById(`section-3`)

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
