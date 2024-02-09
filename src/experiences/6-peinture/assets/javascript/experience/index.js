import "./components/Book";
// import "./components/bookPage";
import "./components/dialog";
import "./components/endingCinematic";
import "./components/tab";

import { playAnimation } from "./utils/playAnimation.js";

const gameScene = document.querySelector('.page__game');
if (gameScene) {
    playAnimation("animJeffIddle");
}