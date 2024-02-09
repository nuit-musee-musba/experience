import { enableInactivityRedirection } from "@/global/js/inactivity.ts";
import { ambiantSound } from "@/global/js/sound";

enableInactivityRedirection().beforeRedirect(() =>
  console.log("log before redirect to home")
);

ambiantSound("/global/sounds/g1.mp3").playOnFirstInteraction();
