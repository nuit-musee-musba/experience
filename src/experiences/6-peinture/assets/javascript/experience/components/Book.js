import { firstFingerOfEvent } from "@/global/js/touch";
import items from "../data/items.json" assert { type: "json" };

class BookPage {
    constructor(container) {
        this.container = container;
        // this.hasSelectedItem = true;
        this.selectedClass = ".selected-item";

        this.items = this.container.querySelectorAll(".item");
        this.selectedItem = this.container.querySelector(this.selectedClass)
        this.bookContainer = document.querySelector(".book");
        this.bookTitle = this.bookContainer.querySelector(".book-title");
        this.bookText = this.bookContainer.querySelector(".book-description");

        this.listen();
    }

    listen() {
        this.items.forEach((item) => {
            item.addEventListener("click", () => {
                this.selectedItem.classList.remove(this.selectedClass);
                this.animation(item, true);
                this.displayData(item);
            });
            item.addEventListener("touchstart", (event) => {
                const firstFinger = firstFingerOfEvent(event);

                if (!firstFinger) {
                    return
                }

                // this.hasSelectedItem = true;
                this.displayData(item);
            });
            item.addEventListener("touchmove", (event) => {
                const firstFinger = firstFingerOfEvent(event);

                if (!firstFinger) {
                    return
                }

                // this.hasSelectedItem = true;
                this.animation(item, false);
            });
            item.addEventListener("touchend", () => {
                // this.hasSelectedItem = true;
                this.animation(item, true);
            });
        });
        if (this.selectedItem) {
            this.displayData(this.selectedItem);
        }
    }

    displayData(item) {
        this.id = item.getAttribute("id");
        this.stockedItem = items.items.find((item) => item.id === this.id);

        this.bookTitle.textContent = this.stockedItem.name;
        this.bookText.innerHTML = this.stockedItem.description;
        this.bookText.classList.add(this.stockedItem.category);
    }

    animation(item, status) {
        if (status) {
            item.classList.add('selected-item');
        }
        else {
            item.classList.remove('selected-item');
        }
    }

    // closeBook() {
    //     this.bookContainer.classList.add('is-closed');
    //     this.bookTitle.textContent = "";
    //     this.bookText.innerHTML = "";
    // }

}


(function () {
    const bookContainer = document.querySelector(".ingredients-container");
    if (bookContainer) {
        new BookPage(bookContainer);
    }
})();
