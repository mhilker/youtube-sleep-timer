import moment from "moment/moment";

export default class BackgroundPage {
    constructor() {
        this.onMessage.bind(this);
        this.register.bind(this);
        this.stopTimeout.bind(this);
        this.startTimeout.bind(this);
        this.continuePlayer.bind(this);
        this.sendMessageToAllTabs.bind(this);

        this.timer = null;
    }

    /**
     * Register to listen to messages.
     */
    register() {
        console.log("BackgroundPage::register()");
        browser.runtime.onMessage.addListener((request, sender, sendResponse) => this.onMessage(request, sender, sendResponse));
    }

    /**
     * Handle incoming messages.
     *
     * @param request
     * @param sender
     * @param sendResponse
     */
    onMessage(request, sender, sendResponse) {
        console.log("BackgroundPage::onMessage()");
        console.log(request);

        switch (request.action) {
            case "start":
                console.log('Action: start');
                this.startTimeout(request.timeout);
                break;
            case "stop":
                console.log('Action: stop');
                this.stopTimeout();
                break;
            case "continue":
                console.log('Action: continue');
                this.continuePlayer();
                break;
            default:
                console.error("Error: unknown action.");
        }
    };

    startTimeout(timeout) {
        console.log("BackgroundPage::startTimeout()");

        if (this.timer !== null) {
            clearTimeout(this.timer);
        }

        const ms = moment.duration(timeout).asMilliseconds();

        this.timer = setTimeout(() => {
            this.sendMessageToAllTabs({
                action: "pause"
            });
        }, ms);
    };

    stopTimeout() {
        console.log("BackgroundPage::stopTimeout()");

        if (this.timer !== null) {
            clearTimeout(this.timer);
        }
    };

    continuePlayer() {
        console.log("BackgroundPage::continuePlayer()");

        this.sendMessageToAllTabs({
            action: "play"
        });
    };

    sendMessageToAllTabs(payload) {
        try {
            const querying = browser.tabs.query({});

            querying.then(tabs => {
                for (const tab of tabs) {
                    console.log("Send message to Tab " + tab.id);
                    browser.tabs.sendMessage(tab.id, payload);
                }
            });
        } catch (e) {
            console.error(e);
        }
    }
}
