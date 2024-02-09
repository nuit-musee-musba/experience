import { enableInactivityRedirection } from "@/global/js/inactivity.ts";
import { ambiantSound } from "@/global/js/sound";
import "./experience";

enableInactivityRedirection();
ambiantSound("/global/sounds/g6.mp3")
    .tryToPlayDirectly()
    .playOnFirstInteraction();