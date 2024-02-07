import items from "../data/items.json" assert { type: "json" };

class BookPage {
  constructor(item) {
    this.item = item;
    this.id = this.item.getAttribute("id");

    this.bookContainer = document.querySelector(".book");
    this.bookTitle = this.bookContainer.querySelector(".book-title");
    this.bookText = this.bookContainer.querySelector(".book-description");

    this.listen();
  }

  listen() {
    this.item.addEventListener("touchstart", () => {
      this.bookContainer.classList.add('is-opened');
      this.displayData();
    });
  }

  displayData() {
    const selectedItem = items.items.find((item) => item.id === this.id);

    this.bookTitle.textContent = selectedItem.name;
    this.bookText.textContent = selectedItem.description;
  }
}

(function () {
  const ingredients = document.querySelectorAll(".category-items .item");
  ingredients.forEach((ingredient) => {
    new BookPage(ingredient);
  });
})();
