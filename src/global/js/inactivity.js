export const inactivityTime = (element) => {
  console.log("inactivityTime");
  let time;
  const timeInMiliseconds = 10000;
  window.onload = resetTimer;
  document.addEventListener("click", resetTimer);

  function goHome() {
    window.location.href = "/";
  }

  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(goHome, timeInMiliseconds);
  }
};
