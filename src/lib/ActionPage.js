class ActionPage {

    constructor() {
        this.input = null;
        this.button = null;

        this.register.bind(this);
        this.onChange.bind(this);
        this.onSubmit.bind(this);
    }

    /**
     * Register to listen on input actions.
     *
     * @param input
     * @param button
     */
    register(input, button) {
        console.log("ActionPage::register()");
        this.input = input;
        this.button = button;

        input.addEventListener('change', e => this.onChange(e));
        button.addEventListener('click', e => this.onSubmit(e));
    };

    /**
     * @param event
     */
    onChange(event) {
        console.log("ActionPage::onChange()");
    };

    /**
     * @param event
     */
    onSubmit(event) {
        console.log("ActionPage::onSubmit()");

        let timeout = null;
        try {
            timeout = parseInt(this.input.value)
        } catch (e) {
            return;
        }

        if (Number.isInteger(timeout) === false) {
            return;
        }

        browser.runtime.sendMessage({
            timeout: timeout * 1000
        });
    };
}

export default ActionPage;
