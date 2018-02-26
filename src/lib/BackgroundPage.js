class BackgroundPage {

    constructor() {
        this.onMessage.bind(this);
        this.register.bind(this);
        this.stopPlayer.bind(this);
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
        console.log(this);
        this.stopPlayer(request.timeout);
    };

    /**
     * Send a message to stop all players to all tabs.
     */
    stopPlayer(timeout) {
        console.log("BackgroundPage::stopPlayer()");

        const querying = browser.tabs.query({});

        querying.then(tabs => {
            for (const tab of tabs) {
                console.log("Send message to Tab " + tab.id);
                browser.tabs.sendMessage(tab.id, {
                    action: "stop",
                    timeout: timeout
                });
            }
        });
    };
}

export default BackgroundPage;
