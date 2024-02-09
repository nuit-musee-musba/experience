import items from "../data/items.json" assert { type: "json" };
import { current_step } from "./dragdrop.js";

let craftZone = document.getElementById("targetCraftZone");

let elements = document.querySelectorAll("#targetCraftZone > div.item");

let recipe = document.querySelector(".recipe .list-items");

let accArray = [];

//current_step definie dans dragdrop.js

function countDuplicates(strings) {
  const frequency = {};

  strings.forEach((str) => {
    if (frequency[str]) {
      // Si la chaîne existe déjà, augmenter la fréquence
      frequency[str]++;
    } else {
      // Si la chaîne n'existe pas encore, initialiser la fréquence à 1
      frequency[str] = 1;
    }
  });

  // Créer un tableau avec les résultats
  const resultArray = Object.keys(frequency).map((str) => ({
    name: str,
    count: frequency[str],
  }));

  return resultArray;
}

function countDuplicatesForRecipe(arr) {
  const frequency = {};

  arr.items.forEach((str) => {
    if (frequency[str["recipe_step"]]) {
      // Si la chaîne existe déjà, augmenter la fréquence
      frequency[str["recipe_step"]]++;
    } else {
      // Si la chaîne n'existe pas encore, initialiser la fréquence à 1
      frequency[str["recipe_step"]] = 1;
    }
  });

  // Créer un tableau avec les résultats
  const resultArray = Object.keys(frequency).map((str) => ({
    name: str,
    count: frequency[str],
  }));

  return resultArray;
}

elements.forEach((element) => {
  if (element.className.includes("multiple")) {
    let preElId = element.id.split("-");
    let ElId = preElId[0];
    accArray.push(ElId);
  } else {
    let preElId = element.id.split("-");
    let ElId = preElId[0];
    accArray.push(ElId);
  }
});

const result = countDuplicates(accArray);
let resultToVerify = countDuplicates(accArray);
let actualNumber = 0;

export function recipeGeneration() {
  recipe.innerHTML = "";
  result.forEach((element) => {
    let thisItem = items.items.find((item) => item.id === element.name);
    //element.count
    if (thisItem.recipe_step == current_step) {
      recipe.innerHTML +=
        '<li class="item ' +
        thisItem.category +
        '" id="recipe-' +
        element.name +
        `"><span class="item-stuff">` +
        thisItem.recipe_text +
        //' <span id="actual-' +
        //element.name +
        //'">' +
        //actualNumber +
        //"</span>/" +
        //thisItem.number_needed +
        "</span><span class='item-checkbox'><img id='img-check-" +
        element.name +
        "' src='/6-peinture/images/misc/checked.svg'></span></li>";
    }
  });
}

recipeGeneration();

export function recipeResolve(id) {
  //   let thisItem = resultToVerify.find((el) => el.name === id);
  //   const indexOfItem = resultToVerify.indexOf(thisItem);
  //   resultToVerify[indexOfItem].count--;

  //if (resultToVerify[indexOfItem].count <= 0) {
  var this_object = document.getElementById("recipe-" + id);
  this_object.classList.add("checked");
  //}
}
