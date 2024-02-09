export const ambiantSound = (soundUrl: string) => {
  const audio = new Audio(soundUrl);
  audio.loop = true;

  const methods = {
    playOnFirstInteraction: () => {
      window.addEventListener("click", audio.play, { once: true });
      window.addEventListener("dragstart", audio.play, { once: true });
    },
  };

  return methods;
};
