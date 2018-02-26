class ActionPage {

    constructor() {
        this.input = null;
        this.button = null;

        this.register.bind(this);
        this.onChange.bind(this);
        this.onSubmit.bind(this);
        this.getValue.bind(this);
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

        this.input.addEventListener('change', e => this.onChange(e));
        this.button.addEventListener('click', e => this.onSubmit(e));
    };

    /**
     * @param event
     */
    onChange(event) {
        console.log("ActionPage::onChange()");

        const timeout = this.getValue();
        if (timeout !== null) {
            return;
        }
    };

    /**
     * @param event
     */
    onSubmit(event) {
        console.log("ActionPage::onSubmit()");

        const timeout = this.getValue();
        if (timeout === null) {
            return;
        }

        browser.runtime.sendMessage({
            timeout: timeout * 1000
        });
    };

    /**
     * @returns int|null
     */
    getValue() {
        let timeout = null;
        try {
            timeout = parseInt(this.input.value)
        } catch (e) {
            return null;
        }

        if (Number.isInteger(timeout) === false) {
            return null;
        }

        return timeout;
    }
}

export default ActionPage;
