class BackgroundPage {

    constructor() {
        this.onMessage.bind(this);
        this.register.bind(this);
        this.stopTimeout.bind(this);
        this.startTimeout.bind(this);
        this.sendToAllTabs.bind(this);
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

        if (request.timeout === null) {
            this.stopTimeout();
        } else {
            this.startTimeout(request.timeout);
        }
    };

    /**
     * Send a message to stop all players to all tabs.
     */
    startTimeout(timeout) {
        console.log("BackgroundPage::startTimeout()");

        this.sendToAllTabs({
            action: "start",
            timeout: timeout
        });
    };

    /**
     * Send a message to stop all players.
     */
    stopTimeout() {
        console.log("BackgroundPage::stopTimeout()");

        this.sendToAllTabs({
            action: "stop"
        });
    };

    sendToAllTabs(payload) {
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
