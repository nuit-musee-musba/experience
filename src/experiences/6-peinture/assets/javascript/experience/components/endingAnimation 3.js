
export const endingAnimation = function() {
    const trigger = document.querySelector(".ending-trigger");
    const ending = document.querySelectorAll(".ending-screen");

    const animEnding = '/assets/javascript/animations/anims-evil/anim-evil-dialog.json';

    let animationEnd = lottie.loadAnimation({
        container: document.querySelector('.ending-animation'),
        path: animEnding,
        renderer: 'svg',
        loop: true,
        autoplay: false
    });

    
}