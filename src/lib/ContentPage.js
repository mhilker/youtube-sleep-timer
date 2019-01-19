import * as Bridge from '../Bridge/Bridge';

export default class ContentPage {
    constructor() {
        this.register.bind(this);
        this.onMessage.bind(this);
        this.stopPlayer.bind(this);
        this.startPlayer.bind(this);

        this.playerBridge = Bridge.Factory(window.location.hostname);
    }

    register() {
        console.log("ContentPage::register()");
        browser.runtime.onMessage.addListener((request, sender, sendResponse) => this.onMessage(request, sender, sendResponse));
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

        if (this.playerBridge.isPaused() === false) {
            console.log("Error: video player is not paused.");
            return;
        }

        this.playerBridge.startPlayer();

        setTimeout(() => {
            if (this.playerBridge.isPaused() === true) {
                console.error("Error: video player is still paused.");
            }
        }, 1000);
    }

    stopPlayer(request, sender, sendResponse) {
        console.log("ContentPage::startTimer()");

        if (this.playerBridge.isPaused() === true) {
            console.log("Error: video player is already paused.");
            return;
        }

        this.playerBridge.stopPlayer();

        setTimeout(() => {
            if (this.playerBridge.isPaused() === false) {
                console.log("Error: video player is already running.");
            }
        }, 1000);
    }
}
