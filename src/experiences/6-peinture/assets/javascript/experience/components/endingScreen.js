import lottie from 'lottie-web';

class EndingScreen {
    constructor(element) {    
    this.element = element;
    this.button = this.element.querySelector(".ending-trigger");

    const animEnding = '/experiences/6-peinture/assets/javascript/experience/animations/anim-evil-dialog.json';

    this.animationEnd = lottie.loadAnimation({
        container: document.querySelector('.ending-animation'),
        path: animEnding,
        renderer: 'svg',
        loop: true, // CE SERA PEUT ÊTRE PAS UNE LOOP
        autoplay: false
    });
    
    this.listen();
        
    }

    listen(){
        this.button.addEventListener('click', () => {
            this.animationEnd.play();
        });
    }
}

(function () {
    const endingContainer = document.querySelector(".ending-screen");
    if (endingContainer) {
        new EndingScreen(endingContainer);
    }
})();