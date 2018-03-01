class ContentPage {

    constructor() {
        this.register.bind(this);
        this.onMessage.bind(this);
        this.stopPlayer.bind(this);
        this.startPlayer.bind(this);
        this.clickPlayer.bind(this);
    }

    register() {
        console.log("ContentPage::register()");
        browser.runtime.onMessage.addListener((r, s, sr) => this.onMessage(r, s, sr));
    };

    onMessage(request, sender, sendResponse) {
        console.log("ContentPage::onMessage()");
        console.log(request);

        switch (request.action) {
            case "play":
                this.startPlayer(request, sender, sendResponse);
                break;
            case "pause":
                this.stopPlayer(request, sender, sendResponse);
                break;
            default:
                console.error("Error: unknown action.");
        }
    };

    startPlayer(request, sender, sendResponse) {
        console.log("ContentPage::stopTimer()");

        if (this.isPaused() === false) {
            console.log("Error: video player is not paused.");
            return;
        }

        this.clickPlayer();

        setTimeout(() => {
            if (this.isPaused() === true) {
                console.error("Error: video player is still paused.");
            }
        }, 1000);
    }

    stopPlayer(request, sender, sendResponse) {
        console.log("ContentPage::startTimer()");

        if (this.isPaused() === true) {
            console.log("Error: video player is already paused.");
            return;
        }

        this.clickPlayer();

        setTimeout(() => {
            if (this.isPaused() === false) {
                console.log("Error: video player is already paused.");
            }
        }, 1000);
    }

    clickPlayer() {
        console.log("ContentPage::clickPlayer()");

        const buttons = document.getElementsByClassName('ytp-play-button');

        if (buttons.length === 0) {
            console.error("Error: \"ytp-play-button\" not found.");
            return;
        }

        buttons[0].click();
    }

    isPaused() {
        const elements = document.getElementsByClassName('html5-video-player');

        if (elements.length === 0) {
            console.error("Error: \"html5-video-player\" not found.");
            return;
        }

        return elements[0].classList.contains('paused-mode');
    }
}

export default ContentPage;
