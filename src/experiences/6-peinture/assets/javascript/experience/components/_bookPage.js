import { firstFingerOfEvent } from "@/global/js/touch";
import items from "../data/items.json" assert { type: "json" };

class BookPage {
  constructor(item) {
    this.item = item;
    this.id = this.item.getAttribute("id");
    this.items = document.querySelectorAll(".category-items .item");

    this.bookContainer = document.querySelector(".book");
    this.bookTitle = this.bookContainer.querySelector(".book-title");
    this.bookText = this.bookContainer.querySelector(".book-description");
    this.hasSelectedItem = false;

    this.selectedItem = items.items.find((item) => item.id === "1");
    this.displayData(this.selectedItem);

    this.listen();
  }

  listen() {
    this.item.addEventListener("touchstart", (event) => {
      const firstFinger = firstFingerOfEvent(event);

      if (!firstFinger) {
        return
      }

      this.selectedItem = items.items.find((item) => item.id === this.id);
      this.animation(true);
      this.displayData(this.selectedItem);
      this.hasSelectedItem = true;
    });
    this.item.addEventListener("click", () => {
      this.selectedItem = items.items.find((item) => item.id === this.id);
      this.animation(true);
      this.displayData(this.selectedItem);
      this.hasSelectedItem = true;
    });
    this.item.addEventListener("touchend", () => {
      this.animation(false);
    });
    this.item.addEventListener("touchmove", (event) => {
      const firstFinger = firstFingerOfEvent(event);

      if (!firstFinger) {
        return
      }

      if (this.item.classList.contains('disabled')) {
        this.animation(false);
        return;
      }
      this.animation(false);
      this.displayData(this.selectedItem);
      this.item.style.zIndex = "99";
    });
  }

  displayData(item) {
    this.bookTitle.textContent = item.name;
    this.bookText.innerHTML = item.description;
    this.bookText.classList.add(item.category);
    this.closeBook();
  }

  animation(status) {
    if (status && !this.item.classList.contains('selected-item')) {
      this.elSelected = document.querySelector('.selected-item');
      if (this.elSelected) {
        this.elSelected.classList.remove('selected-item');
      }
      this.item.classList.add('selected-item');
    }
    else if (this.item.classList.contains('selected-item')) {
      this.item.classList.remove('selected-item');
    }
  }

  closeBook() {

    this.items.forEach(item => {
      if (item.classList.contains('selected-item')) {
        this.hasSelectedItem = true;
      }
    });
    console.log(this.hasSelectedItem)

    if (!this.hasSelectedItem) {
      this.bookContainer.classList.add('is-closed');
      this.bookTitle.textContent = "";
      this.bookText.innerHTML = "";
    }
    else {
      this.bookContainer.classList.remove('is-closed');
    }
  }
}


(function () {
  const ingredients = document.querySelectorAll(".category-items .item");
  ingredients.forEach((ingredient) => {
    new BookPage(ingredient);
  });
})();
