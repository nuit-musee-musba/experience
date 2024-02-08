export const enableInactivityRedirection = () => {
  let time: NodeJS.Timeout;

  const timeInMs = 60_000;

  const goHome = () => {
    window.location.href = "/";
  };

  const resetTimer = () => {
    clearTimeout(time);
    time = setTimeout(goHome, timeInMs);
  };

  resetTimer();
  document.addEventListener("click", resetTimer);
  document.addEventListener("touchstart", resetTimer);
  document.addEventListener("touchmove", resetTimer);
};
