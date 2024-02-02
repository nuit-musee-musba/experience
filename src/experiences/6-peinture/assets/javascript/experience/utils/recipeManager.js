import items from "../data/items.json" assert { type: "json" };

let craftZone = document.getElementById("targetCraftZone");

let elements = document.querySelectorAll("#targetCraftZone > div.item");

let recipe = document.querySelector(".recipe .list-item");

let accArray = [];

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

result.forEach((element) => {
  let thisItem = items.items.find((item) => item.id === element.name);

  recipe.innerHTML +=
    '<li class="item" id="recipe-' +
    element.name +
    '">x' +
    element.count +
    " " +
    thisItem.name +
    ' - <span class="food">' +
    thisItem.category +
    "</span></li>";
});

export function recipeResolve(id) {
  let thisItem = resultToVerify.find((el) => el.name === id);
  const indexOfItem = resultToVerify.indexOf(thisItem);
  resultToVerify[indexOfItem].count--;

  if (resultToVerify[indexOfItem].count <= 0) {
    var this_object = document.getElementById("recipe-" + id);
    this_object.classList.add("checked");
  }
}
