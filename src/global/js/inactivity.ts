type EventHook = () => any;

export const enableInactivityRedirection = () => {
  let time: NodeJS.Timeout;

  const timeInMs = 60_000;

  let beforeRedirectFn: EventHook = () => {};

  const redirectToHome = () => {
    beforeRedirectFn();

    window.location.href = "/";
  };

  const resetTimer = () => {
    clearTimeout(time);
    time = setTimeout(redirectToHome, timeInMs);
  };

  resetTimer();
  document.addEventListener("click", resetTimer);
  document.addEventListener("touchstart", resetTimer);
  document.addEventListener("touchmove", resetTimer);

  const methods = {
    beforeRedirect: (callback: EventHook | null) => {
      if (typeof callback !== "function") {
        throw new Error("callback must be a function");
      }

      beforeRedirectFn = callback;
      return methods;
    },
  };

  return methods;
};
