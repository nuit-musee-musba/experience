import { Experience } from "./experiences";

const detailsEls = {
  section: document.getElementById("xpDetails") as HTMLElement,
  title: document.getElementById("xpDetails__title") as HTMLHeadingElement,
  description: document.getElementById(
    "xpDetails__description"
  ) as HTMLParagraphElement,
  startBtn: document.getElementById("xpDetails__startBtn") as HTMLAnchorElement,
  backBtn: document.getElementById("xpDetails__backBtn") as HTMLAnchorElement,
};

const introEls = {
  section: document.getElementById("xpIntro") as HTMLElement,
  title: document.getElementById("xpIntro__title") as HTMLHeadingElement,
  showBtn: document.getElementById("xpIntro__showBtn") as HTMLButtonElement,
};

type OnClickFn = (e: MouseEvent) => any;
let onShowBtnClickFn: OnClickFn = (e) =>
  console.warn("showBtn clicked but no action defined");
let onBackBtnClickFn: OnClickFn = (e) =>
  console.warn("backBtn clicked but no action defined");
introEls.showBtn.addEventListener("click", (e) => {
  if (!onShowBtnClickFn) return;
  onShowBtnClickFn(e);
});
detailsEls.backBtn.addEventListener("click", (e) => {
  if (!onBackBtnClickFn) return;
  onBackBtnClickFn(e);
});

export const updateExperienceInfos = (experience: Experience) => {
  detailsEls.title.innerText = experience.title;
  detailsEls.description.innerText = experience.description;
  detailsEls.startBtn.href = experience.path;

  introEls.title.innerText = experience.title;
};

export const toggleShowBtnVisibility = (hide: boolean) => {
  introEls.showBtn.classList.toggle("hidden", hide);
};

const toggleDetails = (show: boolean) => {
  detailsEls.section.classList.toggle("hidden", !show);
  introEls.section.classList.toggle("hidden", show);
};

export const displayDetails = () => toggleDetails(true);
export const hideDetails = () => toggleDetails(false);
export const onShowBtnClick = (cb: OnClickFn) => {
  onShowBtnClickFn = cb;
};
export const onBackBtnClick = (cb: OnClickFn) => {
  onBackBtnClickFn = cb;
};
