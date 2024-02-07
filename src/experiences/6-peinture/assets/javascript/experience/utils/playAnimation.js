import lottie from 'lottie-web';

export function playAnimation(anim) {

    let container = document.querySelector('.game-chef__illustration');
    
    // PATH JSON
    const animationPaths = {
        animJeffHappy: '/experiences/6-peinture/assets/javascript/experience/animations/anim-jeff-happy.json',
    };
    const animPath = animationPaths[anim];

    // ANIMATIONS
    var animation = lottie.loadAnimation({
        container: container,
        path: animPath,
        renderer: 'svg',
        loop: false,
        autoplay: false
    });

    animation.play();
    container.classList.add('is-playing');

    animation.addEventListener("complete", () => {
        let animatedElement = container.querySelector('svg');
        animatedElement.remove();
        container.classList.remove('is-playing');
    });
}