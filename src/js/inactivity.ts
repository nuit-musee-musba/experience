export const enableInactivityAnimation = ({
  isFocusingExperience,
}: {
  isFocusingExperience: () => boolean;
}) => {
  let displayAnimationTimeout: NodeJS.Timeout;

  const timeoutInMs = 60_000;
  const fingerRotationAnimation = document.getElementById(
    "fingerRotationAnimation"
  );

  const displayAnimation = () => {
    if (!fingerRotationAnimation || isFocusingExperience()) {
      return;
    }
    fingerRotationAnimation.classList.add("visible");
  };

  const resetTimer = () => {
    if (!fingerRotationAnimation) {
      return;
    }

    clearTimeout(displayAnimationTimeout);
    fingerRotationAnimation.classList.remove("visible");

    displayAnimationTimeout = setTimeout(displayAnimation, timeoutInMs);
  };

  resetTimer();
  document.addEventListener("mousedown", resetTimer);
  document.addEventListener("touchstart", resetTimer);
  document.addEventListener("touchmove", resetTimer);
};
