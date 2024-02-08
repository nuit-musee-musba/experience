import items from "../data/items.json" assert { type: "json" };

class BookPage {
  constructor(item) {
    this.item = item;
    this.id = this.item.getAttribute("id");

    this.bookContainer = document.querySelector(".book");
    this.bookTitle = this.bookContainer.querySelector(".book-title");
    this.bookText = this.bookContainer.querySelector(".book-description");
    
    this.selectedItem = items.items.find((item) => item.id === "1");
    this.displayData(this.selectedItem);

    this.listen();
  }

  listen() {
    this.item.addEventListener("touchstart", () => {
      this.selectedItem = items.items.find((item) => item.id === this.id);
      this.displayData(this.selectedItem);
    });
    this.item.addEventListener("click", () => {
      this.animation(true);
    });
    this.item.addEventListener("touchstart", () => {
      this.animation(true);
    });
    this.item.addEventListener("touchend", () => {
      this.animation(false);
    });
    this.item.addEventListener("touchmove", () => {
      this.animation(false);
    });
  }

  displayData(item) {
    this.bookTitle.textContent = item.name;
    this.bookText.innerHTML = item.description;
    this.bookText.classList.add(item.category)
  }

  animation(status) {
    if (status && !this.item.classList.contains('selected-item')) {
      this.item.classList.add('selected-item');
    } 
    else if (this.item.classList.contains('selected-item')) {
      this.item.classList.remove('selected-item');
    }
  }
}

(function () {
  const ingredients = document.querySelectorAll(".category-items .item");
  ingredients.forEach((ingredient) => {
    new BookPage(ingredient);
  });
})();
