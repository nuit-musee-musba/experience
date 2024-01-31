
class Dialog {
    constructor(element) {    
    this.element = element;
    
    this.dialogs = this.element.querySelectorAll(".dialog-content");
    this.buttonNext = this.element.querySelector(".btn-next");
    this.buttonPrev = this.element.querySelector(".btn-prev");

    
    this.listen();
        
    }

    listen(){
        let i = 0;

        this.buttonPrev.addEventListener('click', () => {
                if(i > 0){
                    i--;
                    this.updateCurrent(this.dialogs[i]);
                }
            });

        
        this.buttonNext.addEventListener('click', () => {
                if(i < this.dialogs.length - 1){
                    i++;
                    this.updateCurrent(this.dialogs[i]);
                
                }
            });

        
    
    }


    updateCurrent(dialog){
        this.currentDialog = this.element.querySelector(".active");
        this.currentDialog.classList.remove("active");
        console.log(dialog);
        dialog.classList.add("active");

    }


}



(function () {
    const dialogContainer = document.querySelector(".dialog");
    new Dialog(dialogContainer);
    
})();