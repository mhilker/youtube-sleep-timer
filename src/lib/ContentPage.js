class ContentPage {

    constructor() {
        this.register.bind(this);
        this.onMessage.bind(this);
        this.startTimer.bind(this);
        this.stopTimer.bind(this);

        this.timeout = null;
    }

    /**
     * Register to listen on browser messages
     */
    register() {
        console.log("ContentPage::register()");
        browser.runtime.onMessage.addListener((r, s, sr) => this.onMessage(r, s, sr));
    };

    /**
     * Stop the player on the current page, if it is playing.
     *
     * @param request
     * @param sender
     * @param sendResponse
     */
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

    /**
     * @param request
     * @param sender
     * @param sendResponse
     */
    startTimer(request, sender, sendResponse) {
        console.log("ContentPage::startTimer()");

        const elements = document.getElementsByClassName('html5-video-player');
        if (elements.length === 0) {
            console.error("Error: \"html5-video-player\" not found.");
            return;
        }
        if (elements[0].classList.contains('paused-mode') === true) {
            console.error("Error: \"html5-video-player\" is paused.");
            return;
        }

        const button = document.getElementsByClassName('ytp-play-button');
        if (button.length === 0) {
            console.error("Error: \"ytp-play-button\" not found.");
            return;
        }

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            console.log("Stop");
            button[0].click();
        }, request.timeout)
    }

    /**
     * @param request
     * @param sender
     * @param sendResponse
     */
    stopTimer(request, sender, sendResponse) {
        console.log("ContentPage::endTimer()");

        const elements = document.getElementsByClassName('html5-video-player');
        if (elements.length === 0) {
            console.error("Error: \"html5-video-player\" not found.");
            return;
        }
        if (elements[0].classList.contains('paused-mode') === false) {
            console.error("Error: \"html5-video-player\" is paused.");
            return;
        }

        const button = document.getElementsByClassName('ytp-play-button');
        if (button.length === 0) {
            console.error("Error: \"ytp-play-button\" not found.");
            return;
        }

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }

        console.log("Resume");
        button[0].click();
    }
}

export default ContentPage;
