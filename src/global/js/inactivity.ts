export const enableInactivityRedirection = () => {
  let time: NodeJS.Timeout;

  const minutesInMS = 1000 * 60;
  const timeInMs = 5 * minutesInMS;

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
