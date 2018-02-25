class ContentPage {

    constructor() {
        this.register.bind(this);
        this.onMessage.bind(this);
        this.stopPlayer.bind(this);
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
            case "stop":
                this.stopPlayer(request, sender, sendResponse);
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
    stopPlayer(request, sender, sendResponse) {
        console.log("ContentPage::stopPlayer()");

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

        console.log("Click");
        button[0].click();
        //
        // setTimeout(() => {
        //
        // }, request.timeout)
    }
}

export default ContentPage;
