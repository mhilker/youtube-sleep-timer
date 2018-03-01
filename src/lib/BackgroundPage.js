import moment from "moment/moment";

class BackgroundPage {

    constructor() {
        this.onMessage.bind(this);
        this.register.bind(this);
        this.stopTimeout.bind(this);
        this.startTimeout.bind(this);
        this.sendMessageToAllTabs.bind(this);

        this.timer = null;
    }

    /**
     * Register to listen to messages.
     */
    register() {
        console.log("BackgroundPage::register()");
        browser.runtime.onMessage.addListener((r, s, sr) => this.onMessage(r, s, sr));
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
                this.startTimeout(request.timeout);
                break;
            case "stop":
                this.stopTimeout();
                break;
            case "continue":
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

export default BackgroundPage;
