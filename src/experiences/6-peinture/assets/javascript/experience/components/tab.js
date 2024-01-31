class Tab {
    constructor(button) {    
    this.button = button;
    this.id = this.button.getAttribute('data-open-category');
    this.element = document.getElementById(this.id);

    if (!this.element) {
        return;
    }

    this.state = {
        isActive: false
    };

    this.listen();
    }

    listen() {
        this.button.addEventListener('click', () => {
            this.closeTab();
            this.openTab();
        });
    }

    closeTab() {
        this.tabsButtons = document.querySelectorAll('.tab-btn:not(.active)');
        this.currentBtn = document.querySelector('.tab-btn.selected');
        this.currentPanel = document.querySelector('.category-items.active');

        this.currentBtn.classList.remove('selected');
        this.currentPanel.classList.remove('active');
    }
    
    openTab() {
        this.element.classList.add('active');
        this.button.classList.add('selected');
    }
}

(function () {
    const tabsButtons = document.querySelectorAll("[data-open-category]");
    tabsButtons.forEach(button => {
        new Tab(button);
    })
})();
