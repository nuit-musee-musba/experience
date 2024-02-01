import lottie from 'lottie-web';

class EndingScreen {
    constructor(element) {    
    this.element = element;
    this.button = this.element.querySelector('.ending-trigger-anim');
    this.links = this.element.querySelector('.ending-links')

    const animEnding = '/experiences/6-peinture/assets/javascript/experience/animations/anim-evil-dialog.json';

    this.animationEnd = lottie.loadAnimation({
        container: document.querySelector('.ending-animation'),
        path: animEnding,
        renderer: 'svg',
        loop: false,
        autoplay: false
    });
    
    this.listen();
    }

    listen(){
        this.button.addEventListener('click', () => {
            this.animationEnd.play();
        });
        this.animationEnd.addEventListener('complete', () => {
            this.displayEndingLinks();
        });

    }

    displayEndingLinks() {
        this.links.classList.add('visible');
    }

}

(function () {
    const endingContainer = document.querySelector(".ending-screen");
    if (endingContainer) {
        new EndingScreen(endingContainer);
    }
    
})();