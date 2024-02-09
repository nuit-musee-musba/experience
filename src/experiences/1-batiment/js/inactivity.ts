import gsap from "gsap";

export const enableInactivityAnimation = () => {
  let time: NodeJS.Timeout;

  const timeInMs = 30_000;
  const animation = document.getElementById("animation-video");

  const animateOpacity = (opacity: number) => {
    gsap.to(animation, {
      duration: 1.5,
      opacity: opacity,
      ease: "power2.inOut",
    });
  };

  const displayAnimation = () => {
    if (!animation) {
      return;
    }
    animateOpacity(100);
    console.log("display animation");
  };

  const resetTimer = () => {
    if (!animation) {
      return;
    }

    clearTimeout(time);
    animation.style.opacity = "0";

    time = setTimeout(displayAnimation, timeInMs);
  };

  resetTimer();
  document.addEventListener("click", resetTimer);
  document.addEventListener("touchstart", resetTimer);
  document.addEventListener("touchmove", resetTimer);
};
