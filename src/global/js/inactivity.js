export const inactivityTime = () => {
  let time;
  const timeInMiliseconds = 10000;

  const goHome = () => {
    window.location.href = "/";
  };

  const resetTimer = () => {
    clearTimeout(time);
    time = setTimeout(goHome, timeInMiliseconds);
  };

  resetTimer();
  document.addEventListener("click", resetTimer);
};
