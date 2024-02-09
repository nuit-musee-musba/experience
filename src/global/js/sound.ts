export const ambiantSound = (soundUrl: string) => {
  const audio = new Audio(soundUrl);
  audio.loop = true;

  audio.play().catch((e) => {
    console.log(
      "[ambiant sound] autoplay not allowed, waiting user interaction to play ambiant sound"
    );
  });

  const methods = {
    playOnFirstInteraction: () => {
      window.addEventListener("click", () => audio.play(), { once: true });
      window.addEventListener("tap", () => audio.play(), { once: true });
    },
  };

  return methods;
};
