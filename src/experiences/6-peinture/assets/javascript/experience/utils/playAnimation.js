import lottie from 'lottie-web';

export function playAnimation(anim) {
    console.log(anim)
    let container = document.querySelector('.game-chef__illustration');
    let animatedElement = container.querySelector('svg');
    if (animatedElement) {
        animatedElement.remove();
    }
    
    // PATH JSON
    const animationPaths = {
        animJeffHappy: '/experiences/6-peinture/assets/javascript/experience/animations/anim-jeff-happy.json',
        animJeffAdorable: '/experiences/6-peinture/assets/javascript/experience/animations/anim-jeff-adorable.json',
        animJeffPerfect: '/experiences/6-peinture/assets/javascript/experience/animations/anim-jeff-adorable.json'
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
        if (animatedElement) {
            animatedElement.remove();
        }
        container.classList.remove('is-playing');
    });
}