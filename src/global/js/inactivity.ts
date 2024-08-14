type EventHook = () => any;
const HUB_URL = "/experiences/5-hub";
const REDIRECT_AFTER_MS = 5 * 60_000;

export const enableInactivityRedirection = () => {
  let time: NodeJS.Timeout;

  let beforeRedirectFn: EventHook = () => {};

  const redirectToHome = () => {
    beforeRedirectFn();

    window.location.href = HUB_URL;
  };

  const resetTimer = () => {
    clearTimeout(time);
    time = setTimeout(redirectToHome, REDIRECT_AFTER_MS);
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
