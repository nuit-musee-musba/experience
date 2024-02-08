class EndingScreen {
    constructor(element) {    
    this.element = element;
    this.button = element.querySelector('.btn-ending');
    this.videoContainer = this.element.querySelector(".player-video");
    this.video = this.videoContainer.querySelector("video");
    
    this.listen();
    }

    listen(){
        this.button.addEventListener('click', () => {
            this.videoContainer.style.display = 'block';
            this.playVideo();
        });

        this.video.addEventListener('ended', () => {
            window.location.href = './ending.html';
        });
    }

    playVideo() {
        this.video.play();
    }
}

(function () {
    const endingContainer = document.querySelector(".ending-screen");
    if (endingContainer) {
        new EndingScreen(endingContainer);
    }
})();