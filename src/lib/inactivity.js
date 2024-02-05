export const inactivityTime = () => {
  let time;
  window.onload = resetTimer;
  document.onmousemove = resetTimer;

  function logout() {
    window.location.href = "/";
  }
  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(logout, 10000); // 10 seconds
    // time = setTimeout(logout, 300000); // 5 minutes
    console.log(time);
  }
};
inactivityTime();
