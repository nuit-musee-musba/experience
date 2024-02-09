import { gsap } from "gsap";

export function revealInfosContainer() {
  setTimeout(() => {
    gsap.to(".per-10", { opacity: "100%", duration: 3 });
  }, 300);
  setTimeout(() => {
    gsap.to(".per-20", { opacity: "100%", duration: 3 });
  }, 1000);
  setTimeout(() => {
    gsap.to(".per-40", { opacity: "100%", duration: 3 });
  }, 2000);
  setTimeout(() => {
    gsap.to(".per-60", { opacity: "100%", duration: 3 });
  }, 3000);
  setTimeout(() => {
    gsap.to(".per-70", { opacity: "100%", duration: 3 });
  }, 4000);
  setTimeout(() => {
    gsap.to(".per-85", { opacity: "100%", duration: 3 });
  }, 5000);
}
