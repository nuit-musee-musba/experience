export const ambiantSound = (soundUrl: string) => {
  const audio = new Audio(soundUrl);
  audio.loop = true;

  const methods = {
    tryToPlayDirectly: () => {
      // autoplay without user interaction will be possible in production
      // thanks to custom chrome browser, we can allow audio to be played without interaction
      audio.play().catch((e) => {
        console.warn(
          "[ambiant sound] autoplay not allowed, waiting user interaction to play ambiant sound"
        );
      });

      return methods;
    },
    playOnFirstInteraction: () => {
      window.addEventListener("click", () => audio.play(), { once: true });
      window.addEventListener("tap", () => audio.play(), { once: true });

      return methods;
    },
  };

  return methods;
};
