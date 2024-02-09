import lottie from 'lottie-web';

export function playAnimation(anim) {
    let container = document.querySelector('.game-chef__illustration');
    let animatedElement = container.querySelector('svg');
    if (animatedElement) {
        animatedElement.remove();
    }

    // PATH JSON
    const animationPaths = {
        animJeffHappy: '/6-peinture/animations/anim-jeff-happy.json',
        animJeffAdorable: '/6-peinture/animations/anim-jeff-adorable.json',
        animJeffPerfect: '/6-peinture/animations/anim-jeff-perfect.json',
        animJeffNope: '/6-peinture/animations/anim-jeff-nope.json',
        animJeffCringe: '/6-peinture/animations/anim-jeff-cringe.json',
        animJeffPensive: '/6-peinture/animations/anim-jeff-pensive.json',
        animJeffDrama: '/6-peinture/animations/anim-jeff-drama.json',
        animJeffIddle: '/6-peinture/animations/anim-jeff-iddle.json',
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

        var iddleAnimation = lottie.loadAnimation({
            container: container,
            path: animationPaths["animJeffIddle"],
            renderer: 'svg',
            loop: false,
            autoplay: false
        });
        iddleAnimation.play();
    });
}