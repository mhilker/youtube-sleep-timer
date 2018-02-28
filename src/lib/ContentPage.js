import moment from 'moment';

class ContentPage {

    constructor() {
        this.register.bind(this);
        this.onMessage.bind(this);
        this.startTimer.bind(this);
        this.stopTimer.bind(this);
        this.clickPlayer.bind(this);

        this.timer = null;
    }

    register() {
        console.log("ContentPage::register()");
        browser.runtime.onMessage.addListener((r, s, sr) => this.onMessage(r, s, sr));
    };

    onMessage(request, sender, sendResponse) {
        console.log("ContentPage::onMessage()");
        console.log(request);

        switch (request.action) {
            case "start":
                this.startTimer(request, sender, sendResponse);
                break;
            case "stop":
                this.stopTimer(request, sender, sendResponse);
                break;
            default:
                console.error("Error: unknown action.");
        }
    };

    startTimer(request, sender, sendResponse) {
        console.log("ContentPage::startTimer()");

        if (this.isPaused() === false) {
            console.error("Error: video player is paused.");
            return;
        }

        if (this.timer !== null) {
            clearTimeout(this.timer);
        }

        const ms = moment.duration(request.timeout).asMilliseconds();
        this.timer = setTimeout(this.clickPlayer, ms);
    }

    stopTimer(request, sender, sendResponse) {
        console.log("ContentPage::stopTimer()");

        if (this.timer !== null) {
            clearTimeout(this.timer);
        }

        this.clickPlayer();
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
