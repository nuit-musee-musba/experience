const baseRoot = "/2-arts-graphiques/images/bg/";

const bgData = {
  musee: "bg-musee.webp",
  reserve: "bg-reserve.webp",
  atelier: "background-base.webp",
};
type TPlace = keyof typeof bgData;

export function setBg(place: TPlace) {
  const url = baseRoot + bgData[place];

  document.body.style.backgroundImage = `url(${url})`;
}
